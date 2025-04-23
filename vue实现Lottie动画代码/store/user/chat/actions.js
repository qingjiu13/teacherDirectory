/**
 * chat模块的actions
 * @module store/user/chat/actions
 */

export default {
        // 初始化IM连接
    async initIM({ commit, dispatch }, { userId, token }) {
      commit('SET_CONNECTION_STATUS', { isConnected: false, isConnecting: true })
      
      try {
        // 初始化IMBox SDK
        await IMBox.init({
          appId: 'your-app-id',
          userId,
          token
        })
        
        // 设置监听器
        IMBox.on('message', (message) => {
          dispatch('handleNewMessage', message)
        })
        
        IMBox.on('connection-status-changed', (status) => {
          commit('SET_CONNECTION_STATUS', {
            isConnected: status === 'connected',
            isConnecting: status === 'connecting'
          })
        })
        
        // 连接成功
        commit('SET_CONNECTION_STATUS', { isConnected: true, isConnecting: false })
        
        // 加载会话列表
        await dispatch('loadSessions')
        
      } catch (error) {
        commit('SET_CONNECTION_ERROR', error)
        commit('SET_CONNECTION_STATUS', { isConnected: false, isConnecting: false })
        throw error
      }
    },
    
    // 加载会话列表
    async loadSessions({ commit }) {
      try {
        const sessions = await IMBox.getSessions()
        sessions.forEach(session => {
          commit('ADD_OR_UPDATE_SESSION', {
            sessionId: session.sessionId,
            sessionType: session.type,
            targetId: session.targetId,
            title: session.title,
            avatar: session.avatar,
            lastMessage: session.lastMessage,
            unreadCount: session.unreadCount,
            lastMessageTime: session.lastMessageTime
          })
        })
      } catch (error) {
        console.error('加载会话列表失败:', error)
        throw error
      }
    },
    
    // 处理新消息
    async handleNewMessage({ commit, state }, message) {
      const { sessionId } = message
      
      // 添加到消息列表
      commit('ADD_MESSAGE', { sessionId, message })
      
      // 更新会话最后消息
      commit('UPDATE_SESSION_LAST_MESSAGE', { sessionId, message })
      
      // 如果当前不是这个会话，增加未读数
      if (state.currentSession.sessionId !== sessionId || !state.currentSession.isActive) {
        const session = state.sessions.byId[sessionId]
        if (session) {
          commit('ADD_OR_UPDATE_SESSION', {
            sessionId,
            unreadCount: (session.unreadCount || 0) + 1
          })
        }
      }
      
      // 如果是当前会话且活跃，标记为已读
      if (state.currentSession.sessionId === sessionId && state.currentSession.isActive) {
        await IMBox.markAsRead(sessionId)
      }
    },
    
    // 发送消息
    async sendMessage({ commit, state }, { sessionId, content, type = 'text' }) {
      const message = {
        id: `temp-${Date.now()}`, // 临时ID，发送成功后会替换
        type,
        content,
        senderId: state.currentUser.userId,
        time: Math.floor(Date.now() / 1000),
        status: 'sending',
        isSelf: true
      }
      
      // 先添加到本地
      commit('ADD_MESSAGE', { sessionId, message })
      
      try {
        // 调用IMBox发送
        const sentMessage = await IMBox.sendMessage({
          sessionId,
          type,
          content
        })
        
        // 更新消息状态和ID
        commit('UPDATE_MESSAGE_STATUS', {
          sessionId,
          messageId: message.id,
          status: 'sent'
        })
        
        // 更新会话最后消息
        commit('UPDATE_SESSION_LAST_MESSAGE', {
          sessionId,
          message: sentMessage
        })
        
        return sentMessage
      } catch (error) {
        commit('UPDATE_MESSAGE_STATUS', {
          sessionId,
          messageId: message.id,
          status: 'failed'
        })
        throw error
      }
    },
    
    // 加载历史消息
    async loadHistoryMessages({ commit, state }, { sessionId, lastMessageId }) {
      if (state.messages.bySessionId[sessionId]?.isLoading) return
      
      commit('SET_MESSAGES_LOADING', { sessionId, isLoading: true })
      
      try {
        const messages = await IMBox.getHistoryMessages({
          sessionId,
          before: lastMessageId,
          limit: 20
        })
        
        if (messages.length > 0) {
          commit('PREPEND_MESSAGES', { sessionId, messages })
        } else {
          commit('SET_NO_MORE_MESSAGES', { sessionId })
        }
      } catch (error) {
        console.error('加载历史消息失败:', error)
        throw error
      } finally {
        commit('SET_MESSAGES_LOADING', { sessionId, isLoading: false })
      }
    },
    
    // 切换会话
    async switchSession({ commit, dispatch }, sessionId) {
      // 更新当前会话
      const session = this.state.sessions.byId[sessionId]
      commit('SET_CURRENT_SESSION', {
        sessionId,
        targetId: session.targetId,
        sessionType: session.sessionType,
        isActive: true,
        unreadCount: 0
      })
      
      // 重置会话未读数
      commit('ADD_OR_UPDATE_SESSION', {
        sessionId,
        unreadCount: 0
      })
      
      // 标记为已读
      await IMBox.markAsRead(sessionId)
      
      // 加载消息
      if (!this.state.messages.bySessionId[sessionId]) {
        await dispatch('loadHistoryMessages', { sessionId })
      }
    }
}; 
