"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  notifications: [],
  messages: [],
  unreadNotificationCount: 0,
  unreadMessageCount: 0,
  notificationsLoading: false,
  messagesLoading: false,
  error: null
};
const getters = {
  notifications: (state2) => state2.notifications,
  messages: (state2) => state2.messages,
  unreadNotificationCount: (state2) => state2.unreadNotificationCount,
  unreadMessageCount: (state2) => state2.unreadMessageCount,
  hasUnreadNotifications: (state2) => state2.unreadNotificationCount > 0,
  hasUnreadMessages: (state2) => state2.unreadMessageCount > 0,
  notificationsLoading: (state2) => state2.notificationsLoading,
  messagesLoading: (state2) => state2.messagesLoading,
  error: (state2) => state2.error
};
const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
const FETCH_NOTIFICATIONS_FAILURE = "FETCH_NOTIFICATIONS_FAILURE";
const FETCH_MESSAGES_REQUEST = "FETCH_MESSAGES_REQUEST";
const FETCH_MESSAGES_SUCCESS = "FETCH_MESSAGES_SUCCESS";
const FETCH_MESSAGES_FAILURE = "FETCH_MESSAGES_FAILURE";
const MARK_NOTIFICATION_READ = "MARK_NOTIFICATION_READ";
const MARK_MESSAGE_READ = "MARK_MESSAGE_READ";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const ADD_MESSAGE = "ADD_MESSAGE";
const mutations = {
  [FETCH_NOTIFICATIONS_REQUEST](state2) {
    state2.notificationsLoading = true;
    state2.error = null;
  },
  [FETCH_NOTIFICATIONS_SUCCESS](state2, { notifications, unreadCount }) {
    state2.notifications = notifications;
    state2.unreadNotificationCount = unreadCount;
    state2.notificationsLoading = false;
  },
  [FETCH_NOTIFICATIONS_FAILURE](state2, error) {
    state2.notificationsLoading = false;
    state2.error = error;
  },
  [FETCH_MESSAGES_REQUEST](state2) {
    state2.messagesLoading = true;
    state2.error = null;
  },
  [FETCH_MESSAGES_SUCCESS](state2, { messages, unreadCount }) {
    state2.messages = messages;
    state2.unreadMessageCount = unreadCount;
    state2.messagesLoading = false;
  },
  [FETCH_MESSAGES_FAILURE](state2, error) {
    state2.messagesLoading = false;
    state2.error = error;
  },
  [MARK_NOTIFICATION_READ](state2, notificationId) {
    const notification = state2.notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      state2.unreadNotificationCount = Math.max(0, state2.unreadNotificationCount - 1);
    }
  },
  [MARK_MESSAGE_READ](state2, messageId) {
    const message2 = state2.messages.find((m) => m.id === messageId);
    if (message2 && !message2.read) {
      message2.read = true;
      state2.unreadMessageCount = Math.max(0, state2.unreadMessageCount - 1);
    }
  },
  [ADD_NOTIFICATION](state2, notification) {
    state2.notifications.unshift(notification);
    if (!notification.read) {
      state2.unreadNotificationCount++;
    }
  },
  [ADD_MESSAGE](state2, message2) {
    state2.messages.unshift(message2);
    if (!message2.read) {
      state2.unreadMessageCount++;
    }
  }
};
const actions = {
  /**
   * @description 获取系统通知
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 通知列表
   */
  async fetchNotifications({ commit }, params = {}) {
    var _a, _b;
    commit(FETCH_NOTIFICATIONS_REQUEST);
    try {
      const response = await store_services_index.services.common.getNotifications(params);
      const { notifications, unreadCount } = response.data;
      commit(FETCH_NOTIFICATIONS_SUCCESS, { notifications, unreadCount });
      return response.data;
    } catch (error) {
      commit(FETCH_NOTIFICATIONS_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取通知失败");
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
    var _a, _b;
    commit(FETCH_MESSAGES_REQUEST);
    try {
      const response = await store_services_index.services.common.getMessages(params);
      const { messages, unreadCount } = response.data;
      commit(FETCH_MESSAGES_SUCCESS, { messages, unreadCount });
      return response.data;
    } catch (error) {
      commit(FETCH_MESSAGES_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取消息失败");
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
      await store_services_index.services.common.markNotificationAsRead(notificationId);
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
      const response = await store_services_index.services.common.sendMessage(messageData);
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
  addMessage({ commit }, message2) {
    commit(ADD_MESSAGE, message2);
  }
};
const message = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.message = message;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/message.js.map
