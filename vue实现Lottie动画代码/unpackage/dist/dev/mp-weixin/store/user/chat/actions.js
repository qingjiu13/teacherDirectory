"use strict";
const common_vendor = require("../../../common/vendor.js");
const actions = {
  // 初始化IM连接
  async initIM({ commit, dispatch }, { userId, token }) {
    commit("SET_CONNECTION_STATUS", { isConnected: false, isConnecting: true });
    try {
      await IMBox.init({
        appId: "your-app-id",
        userId,
        token
      });
      IMBox.on("message", (message) => {
        dispatch("handleNewMessage", message);
      });
      IMBox.on("connection-status-changed", (status) => {
        commit("SET_CONNECTION_STATUS", {
          isConnected: status === "connected",
          isConnecting: status === "connecting"
        });
      });
      commit("SET_CONNECTION_STATUS", { isConnected: true, isConnecting: false });
      await dispatch("loadSessions");
    } catch (error) {
      commit("SET_CONNECTION_ERROR", error);
      commit("SET_CONNECTION_STATUS", { isConnected: false, isConnecting: false });
      throw error;
    }
  },
  // 加载会话列表
  async loadSessions({ commit }) {
    try {
      const sessions = await IMBox.getSessions();
      sessions.forEach((session) => {
        commit("ADD_OR_UPDATE_SESSION", {
          sessionId: session.sessionId,
          sessionType: session.type,
          targetId: session.targetId,
          title: session.title,
          avatar: session.avatar,
          lastMessage: session.lastMessage,
          unreadCount: session.unreadCount,
          lastMessageTime: session.lastMessageTime
        });
      });
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/chat/actions.js:61", "加载会话列表失败:", error);
      throw error;
    }
  },
  // 处理新消息
  async handleNewMessage({ commit, state }, message) {
    const { sessionId } = message;
    commit("ADD_MESSAGE", { sessionId, message });
    commit("UPDATE_SESSION_LAST_MESSAGE", { sessionId, message });
    if (state.currentSession.sessionId !== sessionId || !state.currentSession.isActive) {
      const session = state.sessions.byId[sessionId];
      if (session) {
        commit("ADD_OR_UPDATE_SESSION", {
          sessionId,
          unreadCount: (session.unreadCount || 0) + 1
        });
      }
    }
    if (state.currentSession.sessionId === sessionId && state.currentSession.isActive) {
      await IMBox.markAsRead(sessionId);
    }
  },
  // 发送消息
  async sendMessage({ commit, state }, { sessionId, content, type = "text" }) {
    const message = {
      id: `temp-${Date.now()}`,
      // 临时ID，发送成功后会替换
      type,
      content,
      senderId: state.currentUser.userId,
      time: Math.floor(Date.now() / 1e3),
      status: "sending",
      isSelf: true
    };
    commit("ADD_MESSAGE", { sessionId, message });
    try {
      const sentMessage = await IMBox.sendMessage({
        sessionId,
        type,
        content
      });
      commit("UPDATE_MESSAGE_STATUS", {
        sessionId,
        messageId: message.id,
        status: "sent"
      });
      commit("UPDATE_SESSION_LAST_MESSAGE", {
        sessionId,
        message: sentMessage
      });
      return sentMessage;
    } catch (error) {
      commit("UPDATE_MESSAGE_STATUS", {
        sessionId,
        messageId: message.id,
        status: "failed"
      });
      throw error;
    }
  },
  // 加载历史消息
  async loadHistoryMessages({ commit, state }, { sessionId, lastMessageId }) {
    var _a;
    if ((_a = state.messages.bySessionId[sessionId]) == null ? void 0 : _a.isLoading)
      return;
    commit("SET_MESSAGES_LOADING", { sessionId, isLoading: true });
    try {
      const messages = await IMBox.getHistoryMessages({
        sessionId,
        before: lastMessageId,
        limit: 20
      });
      if (messages.length > 0) {
        commit("PREPEND_MESSAGES", { sessionId, messages });
      } else {
        commit("SET_NO_MORE_MESSAGES", { sessionId });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/chat/actions.js:159", "加载历史消息失败:", error);
      throw error;
    } finally {
      commit("SET_MESSAGES_LOADING", { sessionId, isLoading: false });
    }
  },
  // 切换会话
  async switchSession({ commit, dispatch }, sessionId) {
    const session = this.state.sessions.byId[sessionId];
    commit("SET_CURRENT_SESSION", {
      sessionId,
      targetId: session.targetId,
      sessionType: session.sessionType,
      isActive: true,
      unreadCount: 0
    });
    commit("ADD_OR_UPDATE_SESSION", {
      sessionId,
      unreadCount: 0
    });
    await IMBox.markAsRead(sessionId);
    if (!this.state.messages.bySessionId[sessionId]) {
      await dispatch("loadHistoryMessages", { sessionId });
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/chat/actions.js.map
