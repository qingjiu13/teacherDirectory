class PageStateManager {
  constructor() {
    this.currentPage = "";
    this.isPageVisible = true;
    this.listeners = [];
  }

  // 设置当前页面
  setCurrentPage(pageName) {
    this.currentPage = pageName;
    this.notifyListeners();
  }

  // 获取当前页面
  getCurrentPage() {
    return this.currentPage;
  }

  // 设置页面可见性
  setPageVisibility(visible) {
    this.isPageVisible = visible;
    this.notifyListeners();
  }

  // 获取页面可见性
  getPageVisibility() {
    return this.isPageVisible;
  }

  // 检查是否在聊天页面
  isInChatPage() {
    return this.currentPage === "chat" || this.currentPage === "chat-box";
  }

  // 检查是否在聊天列表页面
  isInChatListPage() {
    return this.currentPage === "friend-list";
  }

  // 添加状态变化监听器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 移除监听器
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback({
          currentPage: this.currentPage,
          isPageVisible: this.isPageVisible,
        });
      } catch (error) {
        console.error("页面状态监听器错误:", error);
      }
    });
  }
}

// 创建全局实例
const pageStateManager = new PageStateManager();

export default pageStateManager;
