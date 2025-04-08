/**
 * @description 公共模块的actions
 */

export default {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 初始化结果
   */
  async initApp({ dispatch, commit }) {
    try {
      commit('SET_LOADING', true);
      
      // 加载系统信息
      await dispatch('loadSystemInfo');
      
      // 加载应用配置
      await dispatch('loadAppConfig');
      
      // 设置系统主题
      dispatch('setSystemTheme');
      
      // 检查登录状态
      await dispatch('user/checkLoginStatus', null, { root: true });
      
      commit('SET_LOADING', false);
      
      return { success: true, message: '应用初始化成功' };
    } catch (error) {
      console.error('应用初始化失败:', error);
      commit('SET_ERROR', error.message || '应用初始化失败');
      commit('SET_LOADING', false);
      return { success: false, error };
    }
  },
  
  /**
   * @description 加载系统信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 系统信息
   */
  loadSystemInfo({ commit }) {
    try {
      const systemInfo = uni.getSystemInfoSync();
      commit('SET_SYSTEM_INFO', systemInfo);
      return { success: true, data: systemInfo };
    } catch (error) {
      console.error('获取系统信息失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 加载应用配置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  loadAppConfig({ commit }) {
    try {
      // 从本地存储获取应用配置
      const config = uni.getStorageSync('appConfig') || {
        theme: 'light',
        fontSize: 'medium',
        language: 'zh-CN'
      };
      
      commit('SET_APP_CONFIG', config);
      return { success: true, data: config };
    } catch (error) {
      console.error('加载应用配置失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 设置系统主题
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 设置结果
   */
  setSystemTheme({ state }) {
    try {
      const { theme } = state.appConfig;
      
      // 设置系统主题
      if (theme === 'dark') {
        // 设置深色主题
        uni.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#333333'
        });
      } else {
        // 设置浅色主题
        uni.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff'
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('设置系统主题失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 更新应用配置
   * @param {Object} context - Vuex上下文
   * @param {Object} config - 新的配置
   * @returns {Promise<Object>} 更新结果
   */
  async updateAppConfig({ commit, dispatch, state }, config) {
    try {
      commit('SET_APP_CONFIG', config);
      
      // 如果主题发生变化，重新设置系统主题
      if (config.theme && config.theme !== state.appConfig.theme) {
        await dispatch('setSystemTheme');
      }
      
      return { success: true };
    } catch (error) {
      console.error('更新应用配置失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 添加通知
   * @param {Object} context - Vuex上下文
   * @param {Object} notification - 通知对象
   * @returns {Object} 添加结果
   */
  addNotification({ commit }, notification) {
    try {
      commit('ADD_NOTIFICATION', notification);
      return { success: true };
    } catch (error) {
      console.error('添加通知失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 标记通知为已读
   * @param {Object} context - Vuex上下文
   * @param {string} notificationId - 通知ID
   * @returns {Object} 标记结果
   */
  markNotificationRead({ commit }, notificationId) {
    try {
      commit('MARK_NOTIFICATION_READ', notificationId);
      return { success: true };
    } catch (error) {
      console.error('标记通知已读失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 清除所有通知
   * @param {Object} context - Vuex上下文
   * @returns {Object} 清除结果
   */
  clearNotifications({ commit }) {
    try {
      commit('CLEAR_NOTIFICATIONS');
      return { success: true };
    } catch (error) {
      console.error('清除通知失败:', error);
      return { success: false, error };
    }
  }
}; 