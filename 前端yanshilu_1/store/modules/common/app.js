/**
 * @description 应用全局状态模块 - 处理应用级别的全局状态
 */

// 初始状态
const state = {
  loading: false,
  firstLaunch: false,
  appVersion: '1.0.0',
  appInitialized: false,
  appError: null,
  sidebarCollapsed: uni.getStorageSync('sidebarCollapsed') === 'true',
  darkMode: uni.getStorageSync('darkMode') === 'true',
  currentRoute: null
};

// Getters
const getters = {
  loading: state => state.loading,
  isDarkMode: state => state.darkMode,
  isSidebarCollapsed: state => state.sidebarCollapsed,
  appVersion: state => state.appVersion,
  currentRoute: state => state.currentRoute,
  isAppInitialized: state => state.appInitialized
};

// 引入常量类型
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';
const APP_INIT_START = 'APP_INIT_START';
const APP_INIT_SUCCESS = 'APP_INIT_SUCCESS';
const APP_INIT_FAILURE = 'APP_INIT_FAILURE';
const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';

// Mutations
const mutations = {
  [TOGGLE_SIDEBAR](state) {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    uni.setStorageSync('sidebarCollapsed', state.sidebarCollapsed.toString());
  },
  [TOGGLE_DARK_MODE](state) {
    state.darkMode = !state.darkMode;
    uni.setStorageSync('darkMode', state.darkMode.toString());
  },
  [APP_INIT_START](state) {
    state.loading = true;
    state.appError = null;
  },
  [APP_INIT_SUCCESS](state) {
    state.loading = false;
    state.appInitialized = true;
  },
  [APP_INIT_FAILURE](state, error) {
    state.loading = false;
    state.appError = error;
  },
  [SET_CURRENT_ROUTE](state, route) {
    state.currentRoute = route;
  }
};

// Actions
const actions = {
  /**
   * @description 切换侧边栏展开/收起状态
   */
  toggleSidebar({ commit }) {
    commit(TOGGLE_SIDEBAR);
  },
  
  /**
   * @description 切换深色/浅色模式
   */
  toggleDarkMode({ commit }) {
    commit(TOGGLE_DARK_MODE);
  },
  
  /**
   * @description 应用初始化
   * @returns {Promise<boolean>} 初始化结果
   */
  async initializeApp({ commit }) {
    commit(APP_INIT_START);
    
    try {
      // 这里可以放置应用初始化的逻辑
      // 例如加载配置、检查版本等
      
      commit(APP_INIT_SUCCESS);
      return true;
    } catch (error) {
      commit(APP_INIT_FAILURE, error);
      return false;
    }
  },
  
  /**
   * @description 设置当前路由
   * @param {Object} context - Vuex上下文
   * @param {Object} route - 路由对象
   */
  setCurrentRoute({ commit }, route) {
    commit(SET_CURRENT_ROUTE, route);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 