/**
 * 全局页面状态管理器
 * 用于管理应用级别的页面状态，包括当前页面、页面栈等
 */

class PageStateManager {
  constructor() {
    this.currentPage = null;
    this.pageStack = [];
    this.pageListeners = new Set();
  }

  /**
   * 设置当前页面
   * @param {string} pageName - 页面名称
   * @param {Object} options - 页面选项
   */
  setCurrentPage(pageName, options = {}) {
    const previousPage = this.currentPage;
    this.currentPage = pageName;

    console.log("[页面状态管理] 页面切换:", {
      from: previousPage,
      to: pageName,
      options,
    });

    // 更新页面栈
    this.updatePageStack(pageName, options);

    // 通知所有监听器
    this.notifyListeners();
  }

  /**
   * 获取当前页面
   * @returns {string|null}
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * 获取页面栈
   * @returns {Array}
   */
  getPageStack() {
    return [...this.pageStack];
  }

  /**
   * 更新页面栈
   * @param {string} pageName - 页面名称
   * @param {Object} options - 页面选项
   */
  updatePageStack(pageName, options = {}) {
    // 如果是返回操作，移除栈顶页面
    if (options.isBack) {
      this.pageStack.pop();
    } else {
      // 添加新页面到栈顶
      this.pageStack.push({
        name: pageName,
        timestamp: Date.now(),
        options,
      });
    }

    // 限制栈的大小，防止内存泄漏
    if (this.pageStack.length > 10) {
      this.pageStack = this.pageStack.slice(-10);
    }
  }

  /**
   * 添加页面状态监听器
   * @param {Function} listener - 监听器函数
   */
  addPageListener(listener) {
    this.pageListeners.add(listener);
  }

  /**
   * 移除页面状态监听器
   * @param {Function} listener - 监听器函数
   */
  removePageListener(listener) {
    this.pageListeners.delete(listener);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.pageListeners.forEach((listener) => {
      try {
        listener(this.currentPage, this.pageStack);
      } catch (error) {
        console.error("[页面状态管理] 通知监听器失败:", error);
      }
    });
  }

  /**
   * 判断是否在指定页面
   * @param {string} pageName - 页面名称
   * @returns {boolean}
   */
  isInPage(pageName) {
    return this.currentPage === pageName;
  }

  /**
   * 判断是否在聊天相关页面
   * @returns {boolean}
   */
  isInChatPage() {
    return this.currentPage === "chat-box" || this.currentPage === "chat-list";
  }

  /**
   * 清理所有状态
   */
  cleanup() {
    this.currentPage = null;
    this.pageStack = [];
    this.pageListeners.clear();
    console.log("[页面状态管理] 清理完成");
  }
}

// 创建单例实例
const pageStateManager = new PageStateManager();

export default pageStateManager;
