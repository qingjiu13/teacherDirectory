"use strict";
const api = {
  /**
   * @description 获取消息列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>} 消息列表
   */
  getMessages(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = [
          {
            id: "m1",
            senderId: "system",
            senderName: "系统通知",
            senderAvatar: "https://example.com/system.png",
            content: "欢迎使用研师录平台",
            time: Date.now() - 36e5,
            read: false,
            type: "system"
          },
          {
            id: "m2",
            senderId: "teacher1",
            senderName: "王老师",
            senderAvatar: "https://example.com/teacher1.png",
            content: "您好，关于您的咨询我已回复",
            time: Date.now() - 72e5,
            read: true,
            type: "chat"
          },
          {
            id: "m3",
            senderId: "system",
            senderName: "系统通知",
            senderAvatar: "https://example.com/system.png",
            content: "您的订单状态已更新",
            time: Date.now() - 108e5,
            read: false,
            type: "order"
          }
        ];
        resolve({
          success: true,
          data: {
            messages,
            unreadCount: messages.filter((m) => !m.read).length,
            total: 10,
            page: params.page || 1,
            pageSize: params.pageSize || 10
          }
        });
      }, 500);
    });
  },
  /**
   * @description 获取聊天记录
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.chatId - 聊天ID
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>} 聊天记录
   */
  getChatMessages(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chatMessages = [
          {
            id: "c1",
            senderId: "teacher1",
            receiverId: "user1",
            content: "您好，我是王老师，有什么可以帮助您的吗？",
            time: Date.now() - 36e5,
            read: true
          },
          {
            id: "c2",
            senderId: "user1",
            receiverId: "teacher1",
            content: "您好，我想咨询一下关于研究方法的问题",
            time: Date.now() - 35e5,
            read: true
          },
          {
            id: "c3",
            senderId: "teacher1",
            receiverId: "user1",
            content: "好的，请问您具体想了解哪方面的内容？",
            time: Date.now() - 34e5,
            read: true
          },
          {
            id: "c4",
            senderId: "user1",
            receiverId: "teacher1",
            content: "我想了解定性研究与定量研究的区别",
            time: Date.now() - 33e5,
            read: true
          },
          {
            id: "c5",
            senderId: "teacher1",
            receiverId: "user1",
            content: "定性研究主要关注非数字数据，如文本、图像等，通过观察和解释来理解现象；而定量研究主要关注数字数据，通过统计和数学分析来验证假设。",
            time: Date.now() - 32e5,
            read: false
          }
        ];
        resolve({
          success: true,
          data: {
            chatId: params.chatId,
            messages: chatMessages,
            unreadCount: chatMessages.filter((m) => !m.read && m.senderId !== "user1").length,
            total: 20,
            page: params.page || 1,
            pageSize: params.pageSize || 10
          }
        });
      }, 500);
    });
  },
  /**
   * @description 获取聊天列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @returns {Promise<Object>} 聊天列表
   */
  getChatList(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chatList = [
          {
            id: "chat1",
            targetId: "teacher1",
            targetName: "王老师",
            targetAvatar: "https://example.com/teacher1.png",
            lastMessage: "定性研究主要关注非数字数据，如文本、图像等，通过观察和解释来理解现象；而定量研究主要关注数字数据，通过统计和数学分析来验证假设。",
            lastTime: Date.now() - 32e5,
            unreadCount: 1
          },
          {
            id: "chat2",
            targetId: "teacher2",
            targetName: "李老师",
            targetAvatar: "https://example.com/teacher2.png",
            lastMessage: "好的，请将您的论文发给我，我会尽快进行审阅。",
            lastTime: Date.now() - 864e5,
            unreadCount: 0
          },
          {
            id: "chat3",
            targetId: "system",
            targetName: "系统通知",
            targetAvatar: "https://example.com/system.png",
            lastMessage: "您的订单状态已更新",
            lastTime: Date.now() - 1728e5,
            unreadCount: 1
          }
        ];
        resolve({
          success: true,
          data: {
            chatList,
            totalUnread: chatList.reduce((sum, chat) => sum + chat.unreadCount, 0)
          }
        });
      }, 500);
    });
  },
  /**
   * @description 发送消息
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.chatId - 聊天ID
   * @param {string} params.receiverId - 接收者ID
   * @param {string} params.content - 消息内容
   * @returns {Promise<Object>} 发送结果
   */
  sendMessage(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: `msg_${Date.now()}`,
            senderId: "user1",
            receiverId: params.receiverId,
            content: params.content,
            time: Date.now(),
            read: false,
            chatId: params.chatId
          }
        });
      }, 300);
    });
  },
  /**
   * @description 标记消息已读
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.messageId - 消息ID
   * @returns {Promise<Object>} 标记结果
   */
  markMessageRead(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.messageId,
            read: true,
            readTime: Date.now()
          }
        });
      }, 200);
    });
  },
  /**
   * @description 标记所有消息已读
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.chatId - 聊天ID
   * @returns {Promise<Object>} 标记结果
   */
  markAllMessagesRead(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            chatId: params.chatId,
            readTime: Date.now()
          }
        });
      }, 300);
    });
  },
  /**
   * @description 删除消息
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.messageId - 消息ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteMessage(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.messageId,
            deleted: true,
            deleteTime: Date.now()
          }
        });
      }, 300);
    });
  }
};
const state = {
  notifications: {
    messages: [],
    unreadCount: 0,
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false
  },
  chats: {
    list: [],
    totalUnread: 0,
    loading: false
  },
  currentChat: {
    id: null,
    targetId: null,
    targetName: null,
    targetAvatar: null,
    messages: [],
    unreadCount: 0,
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false
  },
  error: null
};
const mutations = {
  /**
   * @description 设置通知消息列表
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   */
  SET_NOTIFICATIONS(state2, payload) {
    state2.notifications.messages = payload.messages;
    state2.notifications.unreadCount = payload.unreadCount;
    state2.notifications.total = payload.total;
    state2.notifications.page = payload.page;
    state2.notifications.pageSize = payload.pageSize;
  },
  /**
   * @description 设置通知加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} loading - 是否加载中
   */
  SET_NOTIFICATIONS_LOADING(state2, loading) {
    state2.notifications.loading = loading;
  },
  /**
   * @description 设置聊天列表
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   */
  SET_CHAT_LIST(state2, payload) {
    state2.chats.list = payload.chatList;
    state2.chats.totalUnread = payload.totalUnread;
  },
  /**
   * @description 设置聊天列表加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} loading - 是否加载中
   */
  SET_CHAT_LIST_LOADING(state2, loading) {
    state2.chats.loading = loading;
  },
  /**
   * @description 设置当前聊天
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   */
  SET_CURRENT_CHAT(state2, payload) {
    if (payload.chatId) {
      state2.currentChat.id = payload.chatId;
    }
    if (payload.targetId) {
      state2.currentChat.targetId = payload.targetId;
    }
    if (payload.targetName) {
      state2.currentChat.targetName = payload.targetName;
    }
    if (payload.targetAvatar) {
      state2.currentChat.targetAvatar = payload.targetAvatar;
    }
  },
  /**
   * @description 设置当前聊天消息
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   */
  SET_CURRENT_CHAT_MESSAGES(state2, payload) {
    state2.currentChat.messages = payload.messages;
    state2.currentChat.unreadCount = payload.unreadCount;
    state2.currentChat.total = payload.total;
    state2.currentChat.page = payload.page;
    state2.currentChat.pageSize = payload.pageSize;
  },
  /**
   * @description 设置当前聊天加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} loading - 是否加载中
   */
  SET_CURRENT_CHAT_LOADING(state2, loading) {
    state2.currentChat.loading = loading;
  },
  /**
   * @description 添加消息到当前聊天
   * @param {Object} state - Vuex状态
   * @param {Object} message - 消息对象
   */
  ADD_MESSAGE_TO_CURRENT_CHAT(state2, message2) {
    state2.currentChat.messages.push(message2);
  },
  /**
   * @description 更新聊天列表中的最后一条消息
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   */
  UPDATE_CHAT_LAST_MESSAGE(state2, { chatId, message: message2, time }) {
    const chatIndex = state2.chats.list.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      state2.chats.list[chatIndex].lastMessage = message2;
      state2.chats.list[chatIndex].lastTime = time;
    }
  },
  /**
   * @description 标记消息已读
   * @param {Object} state - Vuex状态
   * @param {string} messageId - 消息ID
   */
  MARK_MESSAGE_READ(state2, messageId) {
    const notificationIndex = state2.notifications.messages.findIndex((msg) => msg.id === messageId);
    if (notificationIndex !== -1) {
      state2.notifications.messages[notificationIndex].read = true;
      state2.notifications.unreadCount = Math.max(0, state2.notifications.unreadCount - 1);
    }
    const messageIndex = state2.currentChat.messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      state2.currentChat.messages[messageIndex].read = true;
      state2.currentChat.unreadCount = Math.max(0, state2.currentChat.unreadCount - 1);
    }
  },
  /**
   * @description 标记聊天中所有消息已读
   * @param {Object} state - Vuex状态
   * @param {string} chatId - 聊天ID
   */
  MARK_CHAT_READ(state2, chatId) {
    const chatIndex = state2.chats.list.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      const unreadCount = state2.chats.list[chatIndex].unreadCount;
      state2.chats.list[chatIndex].unreadCount = 0;
      state2.chats.totalUnread = Math.max(0, state2.chats.totalUnread - unreadCount);
    }
    if (state2.currentChat.id === chatId) {
      state2.currentChat.messages.forEach((msg) => {
        if (!msg.read && msg.senderId !== "user1") {
          msg.read = true;
        }
      });
      state2.currentChat.unreadCount = 0;
    }
  },
  /**
   * @description 删除消息
   * @param {Object} state - Vuex状态
   * @param {string} messageId - 消息ID
   */
  DELETE_MESSAGE(state2, messageId) {
    state2.notifications.messages = state2.notifications.messages.filter((msg) => msg.id !== messageId);
    state2.currentChat.messages = state2.currentChat.messages.filter((msg) => msg.id !== messageId);
  },
  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {string|Object|null} error - 错误信息
   */
  SET_ERROR(state2, error) {
    state2.error = error;
  }
};
const actions = {
  /**
   * @description 获取通知消息列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>} 获取结果
   */
  async getNotifications({ commit, rootState }, { page = 1, pageSize = 10 } = {}) {
    try {
      commit("SET_NOTIFICATIONS_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getMessages({ token, page, pageSize });
      if (response.success) {
        commit("SET_NOTIFICATIONS", {
          messages: response.data.messages,
          unreadCount: response.data.unreadCount,
          total: response.data.total,
          page: response.data.page,
          pageSize: response.data.pageSize
        });
        commit("SET_NOTIFICATIONS_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_NOTIFICATIONS_LOADING", false);
      commit("SET_ERROR", "获取通知消息失败");
      return { success: false, message: "获取通知消息失败" };
    } catch (error) {
      commit("SET_NOTIFICATIONS_LOADING", false);
      commit("SET_ERROR", error.message || "获取通知消息失败");
      return { success: false, message: error.message || "获取通知消息失败" };
    }
  },
  /**
   * @description 获取聊天列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 获取结果
   */
  async getChatList({ commit, rootState }) {
    try {
      commit("SET_CHAT_LIST_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getChatList({ token });
      if (response.success) {
        commit("SET_CHAT_LIST", {
          chatList: response.data.chatList,
          totalUnread: response.data.totalUnread
        });
        commit("SET_CHAT_LIST_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_CHAT_LIST_LOADING", false);
      commit("SET_ERROR", "获取聊天列表失败");
      return { success: false, message: "获取聊天列表失败" };
    } catch (error) {
      commit("SET_CHAT_LIST_LOADING", false);
      commit("SET_ERROR", error.message || "获取聊天列表失败");
      return { success: false, message: error.message || "获取聊天列表失败" };
    }
  },
  /**
   * @description 获取聊天消息
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.chatId - 聊天ID
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>} 获取结果
   */
  async getChatMessages({ commit, rootState }, { chatId, page = 1, pageSize = 10 }) {
    try {
      commit("SET_CURRENT_CHAT_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getChatMessages({ token, chatId, page, pageSize });
      if (response.success) {
        commit("SET_CURRENT_CHAT_MESSAGES", {
          messages: response.data.messages,
          unreadCount: response.data.unreadCount,
          total: response.data.total,
          page: response.data.page,
          pageSize: response.data.pageSize
        });
        commit("SET_CURRENT_CHAT_LOADING", false);
        if (response.data.unreadCount > 0) {
          dispatch("markChatRead", chatId);
        }
        return { success: true, data: response.data };
      }
      commit("SET_CURRENT_CHAT_LOADING", false);
      commit("SET_ERROR", "获取聊天消息失败");
      return { success: false, message: "获取聊天消息失败" };
    } catch (error) {
      commit("SET_CURRENT_CHAT_LOADING", false);
      commit("SET_ERROR", error.message || "获取聊天消息失败");
      return { success: false, message: error.message || "获取聊天消息失败" };
    }
  },
  /**
   * @description 设置当前聊天
   * @param {Object} context - Vuex上下文
   * @param {Object} chatInfo - 聊天信息
   * @returns {Promise<Object>} 设置结果
   */
  async setCurrentChat({ commit, dispatch: dispatch2 }, chatInfo) {
    try {
      commit("SET_CURRENT_CHAT", chatInfo);
      if (chatInfo.chatId) {
        await dispatch2("getChatMessages", { chatId: chatInfo.chatId });
      }
      return { success: true };
    } catch (error) {
      commit("SET_ERROR", error.message || "设置当前聊天失败");
      return { success: false, message: error.message || "设置当前聊天失败" };
    }
  },
  /**
   * @description 发送消息
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.chatId - 聊天ID
   * @param {string} params.receiverId - 接收者ID
   * @param {string} params.content - 消息内容
   * @returns {Promise<Object>} 发送结果
   */
  async sendMessage({ commit, rootState, state: state2 }, { chatId, receiverId, content }) {
    try {
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.sendMessage({ token, chatId, receiverId, content });
      if (response.success) {
        commit("ADD_MESSAGE_TO_CURRENT_CHAT", response.data);
        commit("UPDATE_CHAT_LAST_MESSAGE", {
          chatId,
          message: content,
          time: response.data.time
        });
        return { success: true, data: response.data };
      }
      commit("SET_ERROR", "发送消息失败");
      return { success: false, message: "发送消息失败" };
    } catch (error) {
      commit("SET_ERROR", error.message || "发送消息失败");
      return { success: false, message: error.message || "发送消息失败" };
    }
  },
  /**
   * @description 标记消息已读
   * @param {Object} context - Vuex上下文
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} 标记结果
   */
  async markMessageRead({ commit, rootState }, messageId) {
    try {
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.markMessageRead({ token, messageId });
      if (response.success) {
        commit("MARK_MESSAGE_READ", messageId);
        return { success: true, data: response.data };
      }
      commit("SET_ERROR", "标记消息已读失败");
      return { success: false, message: "标记消息已读失败" };
    } catch (error) {
      commit("SET_ERROR", error.message || "标记消息已读失败");
      return { success: false, message: error.message || "标记消息已读失败" };
    }
  },
  /**
   * @description 标记聊天中所有消息已读
   * @param {Object} context - Vuex上下文
   * @param {string} chatId - 聊天ID
   * @returns {Promise<Object>} 标记结果
   */
  async markChatRead({ commit, rootState }, chatId) {
    try {
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.markAllMessagesRead({ token, chatId });
      if (response.success) {
        commit("MARK_CHAT_READ", chatId);
        return { success: true, data: response.data };
      }
      commit("SET_ERROR", "标记聊天已读失败");
      return { success: false, message: "标记聊天已读失败" };
    } catch (error) {
      commit("SET_ERROR", error.message || "标记聊天已读失败");
      return { success: false, message: error.message || "标记聊天已读失败" };
    }
  },
  /**
   * @description 删除消息
   * @param {Object} context - Vuex上下文
   * @param {string} messageId - 消息ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteMessage({ commit, rootState }, messageId) {
    try {
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.deleteMessage({ token, messageId });
      if (response.success) {
        commit("DELETE_MESSAGE", messageId);
        return { success: true, data: response.data };
      }
      commit("SET_ERROR", "删除消息失败");
      return { success: false, message: "删除消息失败" };
    } catch (error) {
      commit("SET_ERROR", error.message || "删除消息失败");
      return { success: false, message: error.message || "删除消息失败" };
    }
  }
};
const getters = {
  /**
   * @description 获取通知消息列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 通知消息列表
   */
  notifications: (state2) => state2.notifications.messages,
  /**
   * @description 获取通知未读数
   * @param {Object} state - Vuex状态
   * @returns {number} 通知未读数
   */
  notificationsUnreadCount: (state2) => state2.notifications.unreadCount,
  /**
   * @description 获取通知加载状态
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否加载中
   */
  notificationsLoading: (state2) => state2.notifications.loading,
  /**
   * @description 获取聊天列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 聊天列表
   */
  chatList: (state2) => state2.chats.list,
  /**
   * @description 获取聊天列表未读总数
   * @param {Object} state - Vuex状态
   * @returns {number} 未读总数
   */
  chatTotalUnread: (state2) => state2.chats.totalUnread,
  /**
   * @description 获取聊天列表加载状态
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否加载中
   */
  chatListLoading: (state2) => state2.chats.loading,
  /**
   * @description 获取当前聊天ID
   * @param {Object} state - Vuex状态
   * @returns {string|null} 聊天ID
   */
  currentChatId: (state2) => state2.currentChat.id,
  /**
   * @description 获取当前聊天目标用户ID
   * @param {Object} state - Vuex状态
   * @returns {string|null} 目标用户ID
   */
  currentChatTargetId: (state2) => state2.currentChat.targetId,
  /**
   * @description 获取当前聊天目标用户名
   * @param {Object} state - Vuex状态
   * @returns {string|null} 目标用户名
   */
  currentChatTargetName: (state2) => state2.currentChat.targetName,
  /**
   * @description 获取当前聊天目标用户头像
   * @param {Object} state - Vuex状态
   * @returns {string|null} 目标用户头像
   */
  currentChatTargetAvatar: (state2) => state2.currentChat.targetAvatar,
  /**
   * @description 获取当前聊天消息列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 消息列表
   */
  currentChatMessages: (state2) => state2.currentChat.messages,
  /**
   * @description 获取当前聊天加载状态
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否加载中
   */
  currentChatLoading: (state2) => state2.currentChat.loading,
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {string|Object|null} 错误信息
   */
  error: (state2) => state2.error,
  /**
   * @description 获取系统消息
   * @param {Object} state - Vuex状态
   * @returns {Array} 系统消息列表
   */
  systemMessages: (state2) => state2.notifications.messages.filter((msg) => msg.type === "system"),
  /**
   * @description 获取订单消息
   * @param {Object} state - Vuex状态
   * @returns {Array} 订单消息列表
   */
  orderMessages: (state2) => state2.notifications.messages.filter((msg) => msg.type === "order"),
  /**
   * @description 获取聊天消息
   * @param {Object} state - Vuex状态
   * @returns {Array} 聊天消息列表
   */
  chatMessages: (state2) => state2.notifications.messages.filter((msg) => msg.type === "chat"),
  /**
   * @description 获取总的未读消息数
   * @param {Object} state - Vuex状态
   * @returns {number} 总的未读消息数
   */
  totalUnread: (state2) => state2.notifications.unreadCount + state2.chats.totalUnread
};
const message = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.message = message;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/message.js.map
