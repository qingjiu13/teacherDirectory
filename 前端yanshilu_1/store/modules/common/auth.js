/**
 * @description 认证模块 - 处理用户登录、注册、登出等认证相关功能
 */
import { services } from '../../services';

// 初始状态
const state = {
  token: uni.getStorageSync('token') || '',
  userId: uni.getStorageSync('userId') || '',
  role: uni.getStorageSync('role') || '',
  isAuthenticated: !!uni.getStorageSync('token'),
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null
};

// Getters
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentRole: state => state.role,
  isTeacher: state => state.role === 'teacher',
  isStudent: state => state.role === 'student',
  userId: state => state.userId,
  authToken: state => state.token,
  loginLoading: state => state.loginLoading,
  loginError: state => state.loginError,
  registerLoading: state => state.registerLoading,
  registerError: state => state.registerError
};

// 引入常量类型
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const REGISTER_REQUEST = 'REGISTER_REQUEST';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';
const LOGOUT = 'LOGOUT';
const CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS';

// Mutations
const mutations = {
  [LOGIN_REQUEST](state) {
    state.loginLoading = true;
    state.loginError = null;
  },
  [LOGIN_SUCCESS](state, { token, userId, role }) {
    state.isAuthenticated = true;
    state.token = token;
    state.userId = userId;
    state.role = role;
    state.loginLoading = false;
    state.loginError = null;
    
    // 保存到本地存储
    uni.setStorageSync('token', token);
    uni.setStorageSync('userId', userId);
    uni.setStorageSync('role', role);
  },
  [LOGIN_FAILURE](state, error) {
    state.loginLoading = false;
    state.loginError = error;
    state.isAuthenticated = false;
  },
  [REGISTER_REQUEST](state) {
    state.registerLoading = true;
    state.registerError = null;
  },
  [REGISTER_SUCCESS](state) {
    state.registerLoading = false;
    state.registerError = null;
  },
  [REGISTER_FAILURE](state, error) {
    state.registerLoading = false;
    state.registerError = error;
  },
  [LOGOUT](state) {
    state.isAuthenticated = false;
    state.token = '';
    state.userId = '';
    state.role = '';
    
    // 清除本地存储
    uni.removeStorageSync('token');
    uni.removeStorageSync('userId');
    uni.removeStorageSync('role');
  },
  [CHECK_AUTH_SUCCESS](state, { userId, role }) {
    state.userId = userId;
    state.role = role;
    state.isAuthenticated = true;
  }
};

// Actions
const actions = {
  /**
   * @description 用户登录
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    commit(LOGIN_REQUEST);
    try {
      const response = await services.auth.login(credentials);
      const { token, userId, role } = response.data;
      commit(LOGIN_SUCCESS, { token, userId, role });
      return { success: true, data: response.data };
    } catch (error) {
      commit(LOGIN_FAILURE, error.response?.data?.message || '登录失败');
      return { success: false, error };
    }
  },
  
  /**
   * @description 用户注册
   * @param {Object} context - Vuex上下文
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 注册结果
   */
  async register({ commit }, userData) {
    commit(REGISTER_REQUEST);
    try {
      const response = await services.auth.register(userData);
      commit(REGISTER_SUCCESS);
      return { success: true, data: response.data };
    } catch (error) {
      commit(REGISTER_FAILURE, error.response?.data?.message || '注册失败');
      return { success: false, error };
    }
  },
  
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文
   */
  logout({ commit }) {
    // 可以在这里调用登出API
    commit(LOGOUT);
  },
  
  /**
   * @description 检查认证状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object|null>} 用户信息或null
   */
  async checkAuthStatus({ commit, state }) {
    if (!state.token) return null;
    
    try {
      const response = await services.auth.getUserInfo();
      const { userId, role } = response.data;
      commit(CHECK_AUTH_SUCCESS, { userId, role });
      return response.data;
    } catch (error) {
      commit(LOGOUT);
      return null;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 