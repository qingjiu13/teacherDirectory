/**
 * @description 公共模块的mutations
 */

export default {
  /**
   * @description 设置应用加载状态
   * @param {Object} state - 状态对象
   * @param {boolean} isLoading - 是否加载中
   */
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },

  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {string|Object} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} state - 状态对象
   */
  CLEAR_ERROR(state) {
    state.error = null;
  },
  
  /**
   * @description 设置应用配置
   * @param {Object} state - 状态对象
   * @param {Object} config - 应用配置
   */
  SET_APP_CONFIG(state, config) {
    state.appConfig = { ...state.appConfig, ...config };
    // 保存到本地存储
    uni.setStorageSync('appConfig', state.appConfig);
  },
  
  /**
   * @description 设置应用主题
   * @param {Object} state - 状态对象
   * @param {string} theme - 主题类型 ('light'/'dark')
   */
  SET_THEME(state, theme) {
    if (state.appConfig) {
      state.appConfig.theme = theme;
      // 保存到本地存储
      uni.setStorageSync('appConfig', state.appConfig);
    }
  },
  
  /**
   * @description 设置应用字体大小
   * @param {Object} state - 状态对象
   * @param {string} fontSize - 字体大小 ('small'/'medium'/'large')
   */
  SET_FONT_SIZE(state, fontSize) {
    if (state.appConfig) {
      state.appConfig.fontSize = fontSize;
      // 保存到本地存储
      uni.setStorageSync('appConfig', state.appConfig);
    }
  },
  
  /**
   * @description 设置应用语言
   * @param {Object} state - 状态对象
   * @param {string} language - 应用语言
   */
  SET_LANGUAGE(state, language) {
    if (state.appConfig) {
      state.appConfig.language = language;
      // 保存到本地存储
      uni.setStorageSync('appConfig', state.appConfig);
    }
  },
  
  /**
   * @description 设置应用版本
   * @param {Object} state - 状态对象
   * @param {string} version - 应用版本
   */
  SET_APP_VERSION(state, version) {
    state.appVersion = version;
  },
  
  /**
   * @description 添加通知
   * @param {Object} state - 状态对象
   * @param {Object} notification - 通知对象
   */
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push({
      id: `notification_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
      ...notification
    });
  },
  
  /**
   * @description 设置通知为已读
   * @param {Object} state - 状态对象
   * @param {string} notificationId - 通知ID
   */
  MARK_NOTIFICATION_READ(state, notificationId) {
    const notification = state.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },
  
  /**
   * @description 清除所有通知
   * @param {Object} state - 状态对象
   */
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = [];
  },
  
  /**
   * @description 设置系统信息
   * @param {Object} state - 状态对象
   * @param {Object} systemInfo - 系统信息
   */
  SET_SYSTEM_INFO(state, systemInfo) {
    state.systemInfo = systemInfo;
  }
}; 