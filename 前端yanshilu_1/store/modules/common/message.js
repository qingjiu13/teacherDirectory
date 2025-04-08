/**
 * @description 消息通知模块 - 处理系统消息、通知和用户间消息
 */
import { services } from '../../services';

// 初始状态
const state = {
  notifications: [],
  messages: [],
  unreadNotificationCount: 0,
  unreadMessageCount: 0,
  notificationsLoading: false,
  messagesLoading: false,
  error: null
};

// Getters
const getters = {
  notifications: state => state.notifications,
  messages: state => state.messages,
  unreadNotificationCount: state => state.unreadNotificationCount,
  unreadMessageCount: state => state.unreadMessageCount,
  hasUnreadNotifications: state => state.unreadNotificationCount > 0,
  hasUnreadMessages: state => state.unreadMessageCount > 0,
  notificationsLoading: state => state.notificationsLoading,
  messagesLoading: state => state.messagesLoading,
  error: state => state.error
};

// 引入常量类型
const FETCH_NOTIFICATIONS_REQUEST = 'FETCH_NOTIFICATIONS_REQUEST';
const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
const FETCH_NOTIFICATIONS_FAILURE = 'FETCH_NOTIFICATIONS_FAILURE';
const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST';
const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';
const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
const MARK_MESSAGE_READ = 'MARK_MESSAGE_READ';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const ADD_MESSAGE = 'ADD_MESSAGE';

// Mutations
const mutations = {
  [FETCH_NOTIFICATIONS_REQUEST](state) {
    state.notificationsLoading = true;
    state.error = null;
  },
  [FETCH_NOTIFICATIONS_SUCCESS](state, { notifications, unreadCount }) {
    state.notifications = notifications;
    state.unreadNotificationCount = unreadCount;
    state.notificationsLoading = false;
  },
  [FETCH_NOTIFICATIONS_FAILURE](state, error) {
    state.notificationsLoading = false;
    state.error = error;
  },
  [FETCH_MESSAGES_REQUEST](state) {
    state.messagesLoading = true;
    state.error = null;
  },
  [FETCH_MESSAGES_SUCCESS](state, { messages, unreadCount }) {
    state.messages = messages;
    state.unreadMessageCount = unreadCount;
    state.messagesLoading = false;
  },
  [FETCH_MESSAGES_FAILURE](state, error) {
    state.messagesLoading = false;
    state.error = error;
  },
  [MARK_NOTIFICATION_READ](state, notificationId) {
    const notification = state.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      state.unreadNotificationCount = Math.max(0, state.unreadNotificationCount - 1);
    }
  },
  [MARK_MESSAGE_READ](state, messageId) {
    const message = state.messages.find(m => m.id === messageId);
    if (message && !message.read) {
      message.read = true;
      state.unreadMessageCount = Math.max(0, state.unreadMessageCount - 1);
    }
  },
  [ADD_NOTIFICATION](state, notification) {
    state.notifications.unshift(notification);
    if (!notification.read) {
      state.unreadNotificationCount++;
    }
  },
  [ADD_MESSAGE](state, message) {
    state.messages.unshift(message);
    if (!message.read) {
      state.unreadMessageCount++;
    }
  }
};

// Actions
const actions = {
  /**
   * @description 获取系统通知
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 通知列表
   */
  async fetchNotifications({ commit }, params = {}) {
    commit(FETCH_NOTIFICATIONS_REQUEST);
    
    try {
      const response = await services.common.getNotifications(params);
      const { notifications, unreadCount } = response.data;
      commit(FETCH_NOTIFICATIONS_SUCCESS, { notifications, unreadCount });
      return response.data;
    } catch (error) {
      commit(FETCH_NOTIFICATIONS_FAILURE, error.response?.data?.message || '获取通知失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取用户消息
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 消息列表
   */
  async fetchMessages({ commit }, params = {}) {
    commit(FETCH_MESSAGES_REQUEST);
    
    try {
      const response = await services.common.getMessages(params);
      const { messages, unreadCount } = response.data;
      commit(FETCH_MESSAGES_SUCCESS, { messages, unreadCount });
      return response.data;
    } catch (error) {
      commit(FETCH_MESSAGES_FAILURE, error.response?.data?.message || '获取消息失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 标记通知为已读
   * @param {Object} context - Vuex上下文
   * @param {string} notificationId - 通知ID
   * @returns {Promise<Object>} 操作结果
   */
  async markNotificationAsRead({ commit }, notificationId) {
    try {
      await services.common.markNotificationAsRead(notificationId);
      commit(MARK_NOTIFICATION_READ, notificationId);
      return { success: true };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 发送消息
   * @param {Object} context - Vuex上下文
   * @param {Object} messageData - 消息数据
   * @returns {Promise<Object>} 操作结果
   */
  async sendMessage({ commit }, messageData) {
    try {
      const response = await services.common.sendMessage(messageData);
      // 可以选择在这里添加消息到本地状态
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 添加新通知（通常由WebSocket触发）
   * @param {Object} context - Vuex上下文
   * @param {Object} notification - 通知对象
   */
  addNotification({ commit }, notification) {
    commit(ADD_NOTIFICATION, notification);
  },
  
  /**
   * @description 添加新消息（通常由WebSocket触发）
   * @param {Object} context - Vuex上下文
   * @param {Object} message - 消息对象
   */
  addMessage({ commit }, message) {
    commit(ADD_MESSAGE, message);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 