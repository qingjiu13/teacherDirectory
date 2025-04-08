/**
 * @description 公共模块的getters
 */

export default {
  /**
   * @description 获取应用加载状态
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否正在加载
   */
  isLoading: state => state.isLoading,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - 状态对象
   * @returns {string|Object|null} 错误信息
   */
  error: state => state.error,
  
  /**
   * @description 获取应用版本
   * @param {Object} state - 状态对象
   * @returns {string} 应用版本
   */
  appVersion: state => state.appVersion,
  
  /**
   * @description 获取应用配置
   * @param {Object} state - 状态对象
   * @returns {Object} 应用配置
   */
  appConfig: state => state.appConfig,
  
  /**
   * @description 获取应用主题
   * @param {Object} state - 状态对象
   * @returns {string} 应用主题
   */
  appTheme: state => state.appConfig.theme,
  
  /**
   * @description 判断是否为暗色主题
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否为暗色主题
   */
  isDarkTheme: state => state.appConfig.theme === 'dark',
  
  /**
   * @description 获取应用字体大小
   * @param {Object} state - 状态对象
   * @returns {string} 应用字体大小
   */
  appFontSize: state => state.appConfig.fontSize,
  
  /**
   * @description 获取应用语言
   * @param {Object} state - 状态对象
   * @returns {string} 应用语言
   */
  appLanguage: state => state.appConfig.language,
  
  /**
   * @description 获取所有通知
   * @param {Object} state - 状态对象
   * @returns {Array} 通知列表
   */
  notifications: state => state.notifications,
  
  /**
   * @description 获取未读通知数量
   * @param {Object} state - 状态对象
   * @returns {number} 未读通知数量
   */
  unreadNotificationsCount: state => state.notifications.filter(n => !n.read).length,
  
  /**
   * @description 获取系统信息
   * @param {Object} state - 状态对象
   * @returns {Object|null} 系统信息
   */
  systemInfo: state => state.systemInfo
}; 