/**
 * @description 根级别的actions
 */

export default {
  /**
   * @description 初始化应用
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async initApp({ dispatch, commit }) {
    try {
      commit('SET_LOADING', true);
      
      // 验证登录状态
      await dispatch('auth/checkLoginStatus', null, { root: true });
      
      // 加载应用配置
      await dispatch('loadAppConfig');
      
      // 设置系统主题
      dispatch('setSystemTheme');
      
      commit('SET_LOADING', false);
    } catch (error) {
      commit('SET_ERROR', error.message || '应用初始化失败');
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * @description 加载应用配置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<void>}
   */
  async loadAppConfig({ commit }) {
    try {
      // 这里可以从本地存储或服务器获取应用配置
      const config = uni.getStorageSync('appConfig') || {
        theme: 'light',
        fontSize: 'medium',
        language: 'zh-CN'
      };
      
      commit('SET_APP_CONFIG', config);
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message || '加载应用配置失败');
      return { success: false, error };
    }
  },
  
  /**
   * @description 设置系统主题
   * @param {Object} context - Vuex上下文
   * @returns {void}
   */
  setSystemTheme({ commit, state }) {
    const { theme } = state.appConfig;
    
    // 设置系统主题
    if (theme === 'dark') {
      // 设置深色主题
      // 在实际项目中，这里可能需要设置CSS变量或切换CSS类
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
  },
  
  /**
   * @description 更新应用配置
   * @param {Object} context - Vuex上下文
   * @param {Object} config - 新的配置
   * @returns {Promise<Object>} 更新结果
   */
  async updateAppConfig({ commit, dispatch, state }, config) {
    try {
      const newConfig = { ...state.appConfig, ...config };
      commit('SET_APP_CONFIG', newConfig);
      
      // 保存到本地存储
      uni.setStorageSync('appConfig', newConfig);
      
      // 如果主题发生变化，重新设置系统主题
      if (config.theme && config.theme !== state.appConfig.theme) {
        dispatch('setSystemTheme');
      }
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message || '更新应用配置失败');
      return { success: false, error };
    }
  }
};
