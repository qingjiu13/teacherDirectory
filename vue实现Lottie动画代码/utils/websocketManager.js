/**
 * 全局WebSocket状态管理器
 * 用于在页面间共享WebSocket连接状态
 */

class WebSocketManager {
  constructor() {
    this.isConnected = false;
    this.connectionListeners = new Set();
    this.currentConversationId = null;
  }

  /**
   * 设置WebSocket连接状态
   * @param {boolean} connected - 连接状态
   * @param {string} conversationId - 当前会话ID
   */
  setConnectionStatus(connected, conversationId = null) {
    const previousStatus = this.isConnected;
    this.isConnected = connected;
    this.currentConversationId = conversationId;

    console.log("[WebSocket管理] 状态变更:", {
      connected,
      conversationId,
      previousStatus,
    });

    // 通知所有监听器
    this.notifyListeners();
  }

  /**
   * 获取当前连接状态
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * 获取当前会话ID
   * @returns {string|null}
   */
  getCurrentConversationId() {
    return this.currentConversationId;
  }

  /**
   * 添加连接状态监听器
   * @param {Function} listener - 监听器函数
   */
  addConnectionListener(listener) {
    this.connectionListeners.add(listener);
  }

  /**
   * 移除连接状态监听器
   * @param {Function} listener - 监听器函数
   */
  removeConnectionListener(listener) {
    this.connectionListeners.delete(listener);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(this.isConnected, this.currentConversationId);
      } catch (error) {
        console.error("[WebSocket管理] 通知监听器失败:", error);
      }
    });
  }

  /**
   * 清理所有状态
   */
  cleanup() {
    this.isConnected = false;
    this.currentConversationId = null;
    this.connectionListeners.clear();
    console.log("[WebSocket管理] 清理完成");
  }
}

// 创建单例实例
const websocketManager = new WebSocketManager();

export default websocketManager;
