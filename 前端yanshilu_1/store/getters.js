/**
 * @description 根级别的getters
 */

export default {
  /**
   * @description 获取应用加载状态
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否正在加载
   */
  isLoading: state => state.isLoading,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {string|Object|null} 错误信息
   */
  error: state => state.error,
  
  /**
   * @description 获取应用版本
   * @param {Object} state - Vuex状态
   * @returns {string} 应用版本
   */
  appVersion: state => state.appVersion,
  
  /**
   * @description 获取应用配置
   * @param {Object} state - Vuex状态
   * @returns {Object} 应用配置
   */
  appConfig: state => state.appConfig,
  
  /**
   * @description 获取应用主题
   * @param {Object} state - Vuex状态
   * @returns {string} 应用主题
   */
  appTheme: state => state.appConfig.theme,
  
  /**
   * @description 判断是否为暗色主题
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否为暗色主题
   */
  isDarkTheme: state => state.appConfig.theme === 'dark',
  
  /**
   * @description 获取应用字体大小
   * @param {Object} state - Vuex状态
   * @returns {string} 应用字体大小
   */
  appFontSize: state => state.appConfig.fontSize,
  
  /**
   * @description 获取应用语言
   * @param {Object} state - Vuex状态
   * @returns {string} 应用语言
   */
  appLanguage: state => state.appConfig.language,
  
  /**
   * @description 判断用户是否已登录
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {boolean} 登录状态
   */
  isLoggedIn: (state, getters, rootState) => rootState.auth.isLoggedIn,
  
  /**
   * @description 获取当前用户角色
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {string|null} 用户角色
   */
  currentRole: (state, getters, rootState) => rootState.auth.role,
  
  /**
   * @description 判断是否是老师
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {boolean} 是否是老师
   */
  isTeacher: (state, getters, rootState) => rootState.auth.role === 'teacher',
  
  /**
   * @description 判断是否是学生
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {boolean} 是否是学生
   */
  isStudent: (state, getters, rootState) => rootState.auth.role === 'student',
  
  /**
   * @description 获取用户信息
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {Object} 用户信息
   */
  userInfo: (state, getters, rootState) => rootState.auth.userInfo,
  
  /**
   * @description 获取用户名称
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {string} 用户名称
   */
  userName: (state, getters, rootState) => rootState.auth.userInfo.name,
  
  /**
   * @description 获取用户头像
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {string} 用户头像
   */
  userAvatar: (state, getters, rootState) => rootState.auth.userInfo.avatar,
  
  /**
   * @description 获取未读消息数
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {number} 未读消息数
   */
  unreadMessageCount: (state, getters, rootState) => 
    rootState.auth.userInfo.notifications ? rootState.auth.userInfo.notifications.unread : 0,
  
  /**
   * @description 获取用户订单数据
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {Object} 订单数据
   */
  userOrders: (state, getters, rootState) => rootState.auth.userInfo.orders,
  
  /**
   * @description 获取用户课程数据
   * @param {Object} state - Vuex状态
   * @param {Object} getters - Vuex getters
   * @param {Object} rootState - Vuex根状态
   * @returns {Array} 课程数据
   */
  userCourses: (state, getters, rootState) => rootState.auth.userInfo.courses || []
};
