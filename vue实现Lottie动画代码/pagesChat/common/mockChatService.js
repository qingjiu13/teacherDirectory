import { initMockChatData, getMockUserById, getMockGroupById, getMockCurrentUser } from './mockData.js';
import { MESSAGE_TYPE, MESSAGE_STATUS } from './enums.js';

/**
 * 模拟聊天服务类
 */
class MockChatService {
  constructor() {
    // 初始化模拟数据
    this.chatData = initMockChatData();
    this.currentUser = getMockCurrentUser();
    this.eventListeners = {};
  }

  /**
   * 获取所有聊天会话
   * @returns {Promise<Object>} 包含会话列表和最大消息ID的对象
   */
  getChats() {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        resolve(this.chatData);
      }, 300);
    });
  }

  /**
   * 获取指定会话的消息
   * @param {string} type 会话类型 ('PRIVATE'|'GROUP')
   * @param {number} targetId 目标ID
   * @returns {Promise<Array>} 消息列表
   */
  getMessages(type, targetId) {
    return new Promise((resolve) => {
      const chat = this.chatData.chats.find(
        (c) => c.type === type && c.targetId === targetId
      );
      
      setTimeout(() => {
        if (chat) {
          resolve(chat.messages);
        } else {
          resolve([]);
        }
      }, 300);
    });
  }

  /**
   * 发送消息
   * @param {Object} message 消息对象
   * @param {Object} chatInfo 会话信息
   * @returns {Promise<Object>} 发送结果
   */
  sendMessage(message, chatInfo) {
    return new Promise((resolve) => {
      // 查找或创建会话
      let chat = this.chatData.chats.find(
        (c) => c.type === chatInfo.type && c.targetId === chatInfo.targetId
      );
      
      if (!chat) {
        chat = {
          targetId: chatInfo.targetId,
          type: chatInfo.type,
          showName: chatInfo.type === 'PRIVATE' 
            ? getMockUserById(chatInfo.targetId)?.nickName 
            : getMockGroupById(chatInfo.targetId)?.showGroupName,
          headImage: chatInfo.type === 'PRIVATE'
            ? getMockUserById(chatInfo.targetId)?.headImageThumb
            : getMockGroupById(chatInfo.targetId)?.headImageThumb,
          lastContent: "",
          lastSendTime: new Date().getTime(),
          unreadCount: 0,
          messages: [],
          atMe: false,
          atAll: false,
          stored: false
        };
        this.chatData.chats.unshift(chat);
      }
      
      // 生成消息ID
      const messageId = this.chatData.privateMsgMaxId + 1;
      this.chatData.privateMsgMaxId = messageId;
      
      // 完善消息信息
      message.id = messageId;
      message.sendTime = new Date().getTime();
      message.senderId = this.currentUser.id;
      message.sendNickName = this.currentUser.nickName;
      message.selfSend = true;
      message.status = MESSAGE_STATUS.SENDED;
      
      // 更新会话信息
      chat.lastContent = message.type === MESSAGE_TYPE.TEXT 
        ? message.content 
        : message.type === MESSAGE_TYPE.IMAGE 
          ? "[图片]" 
          : "[文件]";
      chat.lastSendTime = message.sendTime;
      chat.sendNickName = message.sendNickName;
      
      // 插入消息
      chat.messages.push(message);
      
      // 将会话移到顶部
      const chatIndex = this.chatData.chats.indexOf(chat);
      if (chatIndex > 0) {
        this.chatData.chats.splice(chatIndex, 1);
        this.chatData.chats.unshift(chat);
      }
      
      // 触发消息发送事件
      this.triggerEvent('messageSent', { message, chatInfo });
      
      setTimeout(() => {
        resolve({ success: true, message });
      }, 300);
    });
  }

  /**
   * 删除消息
   * @param {Object} messageInfo 消息信息
   * @param {Object} chatInfo 会话信息
   * @returns {Promise<Object>} 删除结果
   */
  deleteMessage(messageInfo, chatInfo) {
    return new Promise((resolve) => {
      const chat = this.chatData.chats.find(
        (c) => c.type === chatInfo.type && c.targetId === chatInfo.targetId
      );
      
      if (!chat) {
        resolve({ success: false, error: '会话不存在' });
        return;
      }
      
      const messageIndex = chat.messages.findIndex(
        (m) => m.id === messageInfo.id || (m.tmpId && m.tmpId === messageInfo.tmpId)
      );
      
      if (messageIndex !== -1) {
        // 删除消息
        chat.messages.splice(messageIndex, 1);
        
        // 更新最后一条消息内容
        if (chat.messages.length > 0) {
          const lastMsg = chat.messages[chat.messages.length - 1];
          chat.lastContent = lastMsg.type === MESSAGE_TYPE.TEXT 
            ? lastMsg.content 
            : lastMsg.type === MESSAGE_TYPE.IMAGE 
              ? "[图片]" 
              : "[文件]";
          chat.lastSendTime = lastMsg.sendTime;
        } else {
          chat.lastContent = "";
        }
        
        // 触发消息删除事件
        this.triggerEvent('messageDeleted', { messageInfo, chatInfo });
        
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      } else {
        resolve({ success: false, error: '消息不存在' });
      }
    });
  }

  /**
   * 撤回消息
   * @param {Object} messageInfo 消息信息
   * @param {Object} chatInfo 会话信息
   * @returns {Promise<Object>} 撤回结果
   */
  recallMessage(messageInfo, chatInfo) {
    return new Promise((resolve) => {
      const chat = this.chatData.chats.find(
        (c) => c.type === chatInfo.type && c.targetId === chatInfo.targetId
      );
      
      if (!chat) {
        resolve({ success: false, error: '会话不存在' });
        return;
      }
      
      const message = chat.messages.find(
        (m) => m.id === messageInfo.id || (m.tmpId && m.tmpId === messageInfo.tmpId)
      );
      
      if (message) {
        // 修改消息为撤回状态
        const originalContent = message.content;
        message.status = MESSAGE_STATUS.RECALL;
        message.content = `${message.selfSend ? '你' : message.sendNickName}撤回了一条消息`;
        message.type = MESSAGE_TYPE.TIP_TEXT;
        
        // 更新最后一条消息内容
        if (chat.messages[chat.messages.length - 1].id === message.id) {
          chat.lastContent = message.content;
        }
        
        // 触发消息撤回事件
        this.triggerEvent('messageRecalled', { 
          messageInfo: { ...messageInfo, content: originalContent }, 
          chatInfo 
        });
        
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      } else {
        resolve({ success: false, error: '消息不存在' });
      }
    });
  }

  /**
   * 清空会话消息
   * @param {Object} chatInfo 会话信息
   * @returns {Promise<Object>} 清空结果
   */
  clearMessages(chatInfo) {
    return new Promise((resolve) => {
      const chat = this.chatData.chats.find(
        (c) => c.type === chatInfo.type && c.targetId === chatInfo.targetId
      );
      
      if (!chat) {
        resolve({ success: false, error: '会话不存在' });
        return;
      }
      
      chat.messages = [];
      chat.lastContent = "";
      chat.unreadCount = 0;
      
      // 触发会话清空事件
      this.triggerEvent('messagesCleared', { chatInfo });
      
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }

  /**
   * 删除会话
   * @param {Object} chatInfo 会话信息
   * @returns {Promise<Object>} 删除结果
   */
  deleteChat(chatInfo) {
    return new Promise((resolve) => {
      const chatIndex = this.chatData.chats.findIndex(
        (c) => c.type === chatInfo.type && c.targetId === chatInfo.targetId
      );
      
      if (chatIndex !== -1) {
        // 删除会话
        this.chatData.chats.splice(chatIndex, 1);
        
        // 触发会话删除事件
        this.triggerEvent('chatDeleted', { chatInfo });
        
        setTimeout(() => {
          resolve({ success: true });
        }, 300);
      } else {
        resolve({ success: false, error: '会话不存在' });
      }
    });
  }

  /**
   * 添加事件监听器
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * 移除事件监听器
   * @param {string} event 事件名称
   * @param {Function} callback 回调函数
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {Object} data 事件数据
   * @private
   */
  triggerEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }
}

// 创建单例实例
const mockChatService = new MockChatService();

export default mockChatService; 