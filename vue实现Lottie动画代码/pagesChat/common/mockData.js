import { MESSAGE_TYPE, MESSAGE_STATUS } from './enums.js';

/**
 * 模拟用户数据
 * @type {Array<Object>}
 */
export const mockUsers = [
  {
    id: 1,
    nickName: '张老师',
    headImageThumb: '/static/image/defaultAvatar/teacher-man.png',
    state: 1 // 在线状态
  },
  {
    id: 2,
    nickName: '李同学',
    headImageThumb: '/static/image/defaultAvatar/student-woman.png',
    state: 1
  },
  {
    id: 3,
    nickName: '王同学',
    headImageThumb: '/static/image/defaultAvatar/student-man.png',
    state: 0 // 离线
  },
  {
    id: 4,
    nickName: '赵老师',
    headImageThumb: '/static/image/defaultAvatar/teacher-man.png',
    state: 1
  }
];

/**
 * 模拟群组数据
 * @type {Array<Object>}
 */
export const mockGroups = [
  {
    id: 101,
    showGroupName: '高三一班班级群',
    headImageThumb: '/static/image/defaultAvatar/teacher-man.png',
    memberCount: 45,
    members: [1, 2, 3, 4] // 成员ID列表
  },
  {
    id: 102,
    showGroupName: '教师交流群',
    headImageThumb: '/static/image/defaultAvatar/teacher-woman.png',
    memberCount: 18,
    members: [1, 4] // 成员ID列表
  }
];

/**
 * 生成随机消息ID
 * @returns {number}
 */
const generateMessageId = () => {
  return Math.floor(Math.random() * 10000) + 1000;
};

/**
 * 创建文本消息
 * @param {number} id - 消息ID
 * @param {number} senderId - 发送者ID
 * @param {string} content - 消息内容
 * @param {number} sendTime - 发送时间
 * @param {boolean} selfSend - 是否自己发送
 * @returns {Object} 消息对象
 */
const createTextMessage = (id, senderId, content, sendTime, selfSend) => {
  return {
    id: id,
    tmpId: 'tmp_' + id,
    sendId: senderId,
    content: content,
    sendTime: sendTime,
    selfSend: selfSend,
    type: MESSAGE_TYPE.TEXT,
    status: selfSend ? MESSAGE_STATUS.SENDED : MESSAGE_STATUS.READED
  };
};

/**
 * 创建图片消息
 * @param {number} id - 消息ID
 * @param {number} senderId - 发送者ID
 * @param {number} sendTime - 发送时间
 * @param {boolean} selfSend - 是否自己发送
 * @returns {Object} 消息对象
 */
const createImageMessage = (id, senderId, sendTime, selfSend) => {
  // 使用指定的默认头像图片作为聊天图片
  const imageUrl = '/static/image/defaultAvatar/student-man.png';
  const data = {
    originUrl: imageUrl,
    thumbUrl: imageUrl
  };
  
  return {
    id: id,
    tmpId: 'tmp_' + id,
    sendId: senderId,
    content: JSON.stringify(data),
    sendTime: sendTime,
    selfSend: selfSend,
    type: MESSAGE_TYPE.IMAGE,
    loadStatus: 'ok',
    status: selfSend ? MESSAGE_STATUS.SENDED : MESSAGE_STATUS.READED
  };
};

/**
 * 创建文件消息
 * @param {number} id - 消息ID
 * @param {number} senderId - 发送者ID
 * @param {number} sendTime - 发送时间
 * @param {boolean} selfSend - 是否自己发送
 * @returns {Object} 消息对象
 */
const createFileMessage = (id, senderId, sendTime, selfSend) => {
  // 使用指定的PDF文件
  const data = {
    name: '2351795-张腾-第五章.pdf',
    size: '3.5MB',
    url: 'C:\\Users\\19945\\Desktop\\2351795-张腾-第五章.pdf'
  };
  
  return {
    id: id,
    tmpId: 'tmp_' + id,
    sendId: senderId,
    content: JSON.stringify(data),
    sendTime: sendTime,
    selfSend: selfSend,
    type: MESSAGE_TYPE.FILE,
    loadStatus: 'ok',
    status: selfSend ? MESSAGE_STATUS.SENDED : MESSAGE_STATUS.READED
  };
};

/**
 * 创建语音消息
 * @param {number} id - 消息ID
 * @param {number} senderId - 发送者ID
 * @param {number} sendTime - 发送时间
 * @param {boolean} selfSend - 是否自己发送
 * @returns {Object} 消息对象
 */
const createAudioMessage = (id, senderId, sendTime, selfSend) => {
  // 模拟语音数据
  const data = {
    url: 'https://example.com/audio.mp3',
    duration: 15 // 15秒语音
  };
  
  return {
    id: id,
    tmpId: 'tmp_' + id,
    sendId: senderId,
    content: JSON.stringify(data),
    sendTime: sendTime,
    selfSend: selfSend,
    type: MESSAGE_TYPE.AUDIO,
    loadStatus: 'ok',
    status: selfSend ? MESSAGE_STATUS.SENDED : MESSAGE_STATUS.READED
  };
};

/**
 * 创建提示类消息
 * @param {number} sendTime - 发送时间
 * @returns {Object} 消息对象
 */
const createTimeTipMessage = (sendTime) => {
  return {
    id: generateMessageId(),
    sendTime: sendTime,
    type: MESSAGE_TYPE.TIP_TIME
  };
};

/**
 * 生成模拟消息
 * @param {number} count - 要生成的消息数量
 * @param {boolean} selfSend - 是否为自己发送的消息
 * @param {number} senderId - 发送者ID
 * @returns {Array<Object>}
 */
const generateMessages = (count, selfSend, senderId) => {
  const messages = [];
  const now = new Date().getTime();
  
  for (let i = 0; i < count; i++) {
    const messageId = generateMessageId();
    const sendTime = now - (count - i) * 5 * 60 * 1000; // 每条消息间隔5分钟
    
    // 每10条消息插入一个时间提示
    if (i % 10 === 0) {
      messages.push(createTimeTipMessage(sendTime));
    }
    
    // 根据索引生成不同类型的消息
    if (i % 5 === 0) { // 每5条消息插入一张图片
      messages.push(createImageMessage(messageId, senderId, sendTime, selfSend));
    } else if (i % 8 === 0) { // 每8条消息插入一个文件
      messages.push(createFileMessage(messageId, senderId, sendTime, selfSend));
    // } else if (i % 12 === 0) { // 每12条消息插入一条语音
    //   messages.push(createAudioMessage(messageId, senderId, sendTime, selfSend));
    } else { // 其他为文本消息
      let content = '';
      if (i % 3 === 0) {
        content = `这是第${i+1}条测试消息，包括删除、撤回等操作功能测试`;
      } else if (i % 7 === 0) {
        content = `请问老师，这道题应该怎么解？`;
      } else {
        content = `这是一条普通的聊天消息，用于测试聊天界面显示效果，消息序号:${i+1}`;
      }
      messages.push(createTextMessage(messageId, senderId, content, sendTime, selfSend));
    }
  }
  
  return messages;
};

/**
 * 生成复杂的群聊消息
 * @param {number} count - 消息数量
 * @param {Array} members - 群成员ID
 * @returns {Array<Object>} 消息数组
 */
const generateGroupMessages = (count, members) => {
  const messages = [];
  const now = new Date().getTime();
  let messageCount = 0;
  
  for (let i = 0; i < count; i++) {
    // 随机选择发送者
    const senderIndex = Math.floor(Math.random() * members.length);
    const senderId = members[senderIndex];
    // 是否是自己发送的消息（用户ID为1的是当前登录用户）
    const selfSend = senderId === 1;
    
    const messageId = generateMessageId();
    const sendTime = now - (count - i) * 5 * 60 * 1000;
    
    // 每8条消息插入一个时间提示
    if (messageCount % 8 === 0) {
      messages.push(createTimeTipMessage(sendTime));
    }
    
    // 根据规则生成不同类型的消息
    if (messageCount % 5 === 0) {
      messages.push(createImageMessage(messageId, senderId, sendTime, selfSend));
    } else if (messageCount % 9 === 0) {
      messages.push(createFileMessage(messageId, senderId, sendTime, selfSend));
    // } else if (messageCount % 11 === 0) {
    //   messages.push(createAudioMessage(messageId, senderId, sendTime, selfSend));
    } else {
      // 根据发送者不同生成不同的文本内容
      let content = '';
      if (senderId === 1) { // 张老师
        if (messageCount % 3 === 0) {
          content = '同学们，请注意提交作业截止时间是本周五晚上8点';
        } else {
          content = '有问题可以随时在群里提出来讨论';
        }
      } else if (senderId === 2) { // 李同学
        if (messageCount % 4 === 0) {
          content = '老师，我已经完成作业了，请查收';
        } else {
          content = '这道题我有疑问，可以详细解释一下吗？';
        }
      } else if (senderId === 3) { // 王同学
        content = '好的，我明白了，谢谢老师';
      } else { // 赵老师
        content = '张老师说得对，同学们要按时完成';
      }
      
      messages.push(createTextMessage(messageId, senderId, content, sendTime, selfSend));
    }
    
    messageCount++;
  }
  
  return messages;
};

/**
 * 模拟聊天会话数据
 * @type {Array<Object>}
 */
export const mockChats = [
  // 私聊会话1 - 李同学
  {
    targetId: 2, // 对方用户ID
    type: 'PRIVATE',
    showName: '李同学',
    headImage: '/static/image/defaultAvatar/student-woman.png',
    lastContent: '好的，明天见！',
    lastSendTime: new Date().getTime() - 10 * 60 * 1000, // 10分钟前
    unreadCount: 0,
    messages: generateMessages(25, false, 2),
    atMe: false,
    atAll: false,
    stored: false,
    lastTimeTip: new Date().getTime() - 2 * 60 * 60 * 1000 // 2小时前
  },
  
  // 私聊会话2 - 王同学
  {
    targetId: 3,
    type: 'PRIVATE',
    showName: '王同学',
    headImage: '/static/image/defaultAvatar/student-man.png',
    lastContent: '请问作业什么时候交？',
    lastSendTime: new Date().getTime() - 30 * 60 * 1000, // 30分钟前
    unreadCount: 2,
    messages: generateMessages(20, true, 1), // 自己发送的消息
    atMe: false,
    atAll: false,
    stored: false,
    lastTimeTip: new Date().getTime() - 3 * 60 * 60 * 1000 // 3小时前
  },
  
  // 私聊会话3 - 赵老师
  {
    targetId: 4,
    type: 'PRIVATE',
    showName: '赵老师',
    headImage: '/static/image/defaultAvatar/teacher-man.png',
    lastContent: '下周一有教研会议',
    lastSendTime: new Date().getTime() - 45 * 60 * 1000, // 45分钟前
    unreadCount: 1,
    messages: generateMessages(15, false, 4),
    atMe: false,
    atAll: false,
    stored: false,
    lastTimeTip: new Date().getTime() - 5 * 60 * 60 * 1000 // 5小时前
  },
  
  // 群聊会话1 - 高三一班班级群
  {
    targetId: 101,
    type: 'GROUP',
    showName: '高三一班班级群',
    headImage: '/static/image/defaultAvatar/teacher-man.png',
    lastContent: '[图片]',
    lastSendTime: new Date().getTime() - 5 * 60 * 1000, // 5分钟前
    unreadCount: 5,
    messages: generateGroupMessages(30, [1, 2, 3, 4]),
    atMe: true,
    atAll: false,
    stored: false,
    lastTimeTip: new Date().getTime() - 1 * 60 * 60 * 1000 // 1小时前
  },
  
  // 群聊会话2 - 教师交流群
  {
    targetId: 102,
    type: 'GROUP',
    showName: '教师交流群',
    headImage: '/static/image/defaultAvatar/teacher-woman.png',
    lastContent: '下周一开会讨论期末考试安排',
    lastSendTime: new Date().getTime() - 2 * 60 * 60 * 1000, // 2小时前
    unreadCount: 0,
    messages: generateGroupMessages(20, [1, 4]),
    atMe: false,
    atAll: true,
    stored: false,
    lastTimeTip: new Date().getTime() - 4 * 60 * 60 * 1000 // 4小时前
  }
];

/**
 * 初始化模拟数据，返回符合chatStore格式的数据
 * @returns {Object}
 */
export function initMockChatData() {
  return {
    chats: JSON.parse(JSON.stringify(mockChats)), // 深拷贝，避免修改原始数据
    privateMsgMaxId: 5000,
    groupMsgMaxId: 6000
  };
}

/**
 * 获取模拟用户（当前登录用户）
 * @returns {Object}
 */
export function getMockCurrentUser() {
  return {
    id: 1,
    nickName: '张老师',
    headImageThumb: '/static/image/defaultAvatar/teacher-man.png',
    state: 1
  };
}

/**
 * 根据ID获取模拟用户
 * @param {number} userId 
 * @returns {Object|null}
 */
export function getMockUserById(userId) {
  return mockUsers.find(user => user.id === userId) || null;
}

/**
 * 根据ID获取模拟群组
 * @param {number} groupId 
 * @returns {Object|null}
 */
export function getMockGroupById(groupId) {
  return mockGroups.find(group => group.id === groupId) || null;
} 