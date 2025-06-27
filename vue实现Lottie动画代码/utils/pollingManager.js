/**
 * 全局轮询管理器
 * 用于管理聊天相关的轮询状态，确保只在特定条件下进行轮询
 */

import websocketManager from "./websocketManager.js";
import pageStateManager from "./pageStateManager.js";

class PollingManager {
  constructor() {
    this.isPolling = false;
    this.pollingInterval = null;
    this.pollingCallbacks = new Map(); // 存储轮询回调函数

    // 监听WebSocket状态变化
    websocketManager.addConnectionListener((connected) => {
      this.updatePollingState();
    });

    // 监听页面状态变化
    pageStateManager.addPageListener((currentPage) => {
      this.updatePollingState();
    });
  }

  /**
   * 设置当前页面
   * @param {string} pageName - 页面名称 ('chat-box', 'chat-list', 'other')
   */
  setCurrentPage(pageName) {
    console.log("[轮询管理] 设置当前页面:", pageName);
    pageStateManager.setCurrentPage(pageName);
  }

  /**
   * 更新轮询状态
   */
  updatePollingState() {
    const shouldPoll = this.shouldStartPolling();

    if (shouldPoll && !this.isPolling) {
      this.startPolling();
    } else if (!shouldPoll && this.isPolling) {
      this.stopPolling();
    }
  }

  /**
   * 判断是否应该开始轮询
   * @returns {boolean}
   */
  shouldStartPolling() {
    const websocketConnected = websocketManager.getConnectionStatus();
    const currentPage = pageStateManager.getCurrentPage();

    console.log("[轮询调试] 判断是否应该轮询:", {
      websocketConnected,
      currentPage,
      shouldPoll: false,
    });

    // 规则1: 在chat-box页面时，如果WebSocket断开则轮询
    if (currentPage === "chat-box") {
      const shouldPoll = !websocketConnected;
      console.log(
        "[轮询调试] chat-box页面，WebSocket断开:",
        !websocketConnected,
        "应该轮询:",
        shouldPoll
      );
      return shouldPoll;
    }

    // 规则2: 在chat-list页面时，如果WebSocket断开则轮询
    if (currentPage === "chat-list") {
      const shouldPoll = !websocketConnected;
      console.log(
        "[轮询调试] chat-list页面，WebSocket断开:",
        !websocketConnected,
        "应该轮询:",
        shouldPoll
      );
      return shouldPoll;
    }

    // 规则3: 其他页面不轮询
    console.log("[轮询调试] 其他页面，不轮询");
    return false;
  }

  /**
   * 开始轮询
   */
  startPolling() {
    if (this.isPolling) {
      console.log("[轮询管理] 轮询已在进行中，跳过");
      return;
    }

    const currentPage = pageStateManager.getCurrentPage();
    console.log("[轮询管理] 开始轮询，当前页面:", currentPage);
    this.isPolling = true;

    this.pollingInterval = setInterval(() => {
      this.executePollingCallbacks();
    }, 2000); // 每2秒轮询一次
  }

  /**
   * 停止轮询
   */
  stopPolling() {
    if (!this.isPolling) {
      return;
    }

    console.log("[轮询管理] 停止轮询");
    this.isPolling = false;

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * 注册轮询回调函数
   * @param {string} key - 回调标识
   * @param {Function} callback - 回调函数
   */
  registerPollingCallback(key, callback) {
    this.pollingCallbacks.set(key, callback);
    console.log("[轮询管理] 注册轮询回调:", key);
  }

  /**
   * 注销轮询回调函数
   * @param {string} key - 回调标识
   */
  unregisterPollingCallback(key) {
    this.pollingCallbacks.delete(key);
    console.log("[轮询管理] 注销轮询回调:", key);
  }

  /**
   * 执行所有注册的轮询回调
   */
  executePollingCallbacks() {
    if (this.pollingCallbacks.size === 0) {
      return;
    }

    console.log("[轮询管理] 执行轮询回调，数量:", this.pollingCallbacks.size);

    this.pollingCallbacks.forEach((callback, key) => {
      try {
        callback();
      } catch (error) {
        console.error("[轮询管理] 执行回调失败:", key, error);
      }
    });
  }

  /**
   * 获取当前轮询状态
   * @returns {Object}
   */
  getStatus() {
    return {
      isPolling: this.isPolling,
      currentPage: pageStateManager.getCurrentPage(),
      websocketConnected: websocketManager.getConnectionStatus(),
      callbackCount: this.pollingCallbacks.size,
    };
  }

  /**
   * 清理所有状态
   */
  cleanup() {
    this.stopPolling();
    this.pollingCallbacks.clear();
    console.log("[轮询管理] 清理完成");
  }

  /**
   * 手动触发某个轮询回调（如发送消息后立即刷新会话列表）
   * @param {string} key - 回调标识
   */
  triggerPollingCallback(key) {
    const callback = this.pollingCallbacks.get(key);
    if (callback) {
      try {
        callback();
      } catch (error) {
        console.error("[轮询管理] 手动触发回调失败:", key, error);
      }
    }
  }
}

// 创建单例实例
const pollingManager = new PollingManager();

export default pollingManager;
