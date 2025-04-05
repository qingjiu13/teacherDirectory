/**
 * @description 根级别的mutations
 */

export default {
  /**
   * @description 设置应用加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} isLoading - 是否加载中
   */
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },

  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {string|Object} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} state - Vuex状态
   */
  CLEAR_ERROR(state) {
    state.error = null;
  },
  
  /**
   * @description 设置应用配置
   * @param {Object} state - Vuex状态
   * @param {Object} config - 应用配置
   */
  SET_APP_CONFIG(state, config) {
    state.appConfig = { ...state.appConfig, ...config };
  },
  
  /**
   * @description 设置应用主题
   * @param {Object} state - Vuex状态
   * @param {string} theme - 主题类型 ('light'/'dark')
   */
  SET_THEME(state, theme) {
    if (state.appConfig) {
      state.appConfig.theme = theme;
    } else {
      state.appConfig = { theme };
    }
  },
  
  /**
   * @description 设置应用字体大小
   * @param {Object} state - Vuex状态
   * @param {string} fontSize - 字体大小 ('small'/'medium'/'large')
   */
  SET_FONT_SIZE(state, fontSize) {
    if (state.appConfig) {
      state.appConfig.fontSize = fontSize;
    } else {
      state.appConfig = { fontSize };
    }
  },
  
  /**
   * @description 设置应用语言
   * @param {Object} state - Vuex状态
   * @param {string} language - 应用语言
   */
  SET_LANGUAGE(state, language) {
    if (state.appConfig) {
      state.appConfig.language = language;
    } else {
      state.appConfig = { language };
    }
  },
  
  /**
   * @description 设置应用版本
   * @param {Object} state - Vuex状态
   * @param {string} version - 应用版本
   */
  SET_APP_VERSION(state, version) {
    state.appVersion = version;
  }
};
