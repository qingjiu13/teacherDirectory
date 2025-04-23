"use strict";
const mutations = {
  // 会话相关
  SET_CURRENT_SESSION(state, session) {
    state.currentSession = { ...state.currentSession, ...session };
  },
  ADD_OR_UPDATE_SESSION(state, session) {
    if (!state.sessions.byId[session.sessionId]) {
      state.sessions.allIds.unshift(session.sessionId);
    }
    state.sessions.byId[session.sessionId] = { ...state.sessions.byId[session.sessionId], ...session };
  },
  REMOVE_SESSION(state, sessionId) {
    delete state.sessions.byId[sessionId];
    state.sessions.allIds = state.sessions.allIds.filter((id) => id !== sessionId);
  },
  UPDATE_SESSION_LAST_MESSAGE(state, { sessionId, message }) {
    const session = state.sessions.byId[sessionId];
    if (session) {
      session.lastMessage = message;
      session.lastMessageTime = message.time;
    }
  },
  // 消息相关
  ADD_MESSAGE(state, { sessionId, message }) {
    if (!state.messages.bySessionId[sessionId]) {
      state.messages.bySessionId[sessionId] = {
        hasMore: true,
        isLoading: false,
        list: []
      };
    }
    state.messages.bySessionId[sessionId].list.push(message);
  },
  PREPEND_MESSAGES(state, { sessionId, messages }) {
    if (!state.messages.bySessionId[sessionId]) {
      state.messages.bySessionId[sessionId] = {
        hasMore: true,
        isLoading: false,
        list: []
      };
    }
    state.messages.bySessionId[sessionId].list.unshift(...messages);
  },
  UPDATE_MESSAGE_STATUS(state, { sessionId, messageId, status }) {
    var _a;
    const messages = (_a = state.messages.bySessionId[sessionId]) == null ? void 0 : _a.list;
    if (messages) {
      const msg = messages.find((m) => m.id === messageId);
      if (msg)
        msg.status = status;
    }
  },
  // 用户信息相关
  UPDATE_USER_INFO(state, userInfo) {
    state.userInfos[userInfo.userId] = { ...state.userInfos[userInfo.userId], ...userInfo };
  },
  // 连接状态相关
  SET_CONNECTION_STATUS(state, { isConnected, isConnecting }) {
    state.connection.isConnected = isConnected;
    state.connection.isConnecting = isConnecting;
    if (isConnected) {
      state.connection.lastError = null;
      state.connection.reconnectCount = 0;
    }
  },
  SET_CONNECTION_ERROR(state, error) {
    state.connection.lastError = error;
    state.connection.reconnectCount++;
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/chat/mutations.js.map
