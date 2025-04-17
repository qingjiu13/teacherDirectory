/**
 * @description 认证模块 - 处理用户登录、注册、登出等认证相关功能
 */
import { services } from '../../services';

/**
 * @description 解析JWT Token
 * @param {string} token - JWT Token字符串
 * @returns {Object|null} 解析后的payload部分
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('解析JWT失败:', error);
    return null;
  }
};

/**
 * @description 检查Token是否过期
 * @param {string} token - JWT Token字符串
 * @returns {boolean} 是否已过期
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  // exp是秒级时间戳，需转换为毫秒
  return payload.exp * 1000 < Date.now();
};

/**
 * @description 检查Token是否即将过期（默认5分钟内）
 * @param {string} token - JWT Token字符串
 * @param {number} [timeThreshold=300000] - 到期前多少毫秒开始刷新（默认5分钟）
 * @returns {boolean} 是否即将过期
 */
const isTokenNearExpiry = (token, timeThreshold = 300000) => {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  // 检查是否在到期前timeThreshold毫秒内
  return payload.exp * 1000 - Date.now() < timeThreshold && payload.exp * 1000 > Date.now();
};

// 刷新Token锁，防止重复刷新
let isRefreshing = false;
// 等待刷新的请求队列
let refreshSubscribers = [];

/**
 * @description 完成Token刷新后执行队列中的请求
 * @param {string} token - 新的Token
 */
const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

/**
 * @description 添加请求到刷新队列
 * @param {Function} callback - 回调函数，接收新Token
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// 初始状态
const state = {
  token: uni.getStorageSync('token') || '',
  refreshToken: uni.getStorageSync('refreshToken') || '',
  userId: uni.getStorageSync('userId') || '',
  role: uni.getStorageSync('role') || '',
  loginLoading: false,
  loginError: null,
  tokenRefreshing: false,
  lastTokenRefresh: uni.getStorageSync('lastTokenRefresh') || 0
};

// Getters
const getters = {
  currentRole: state => state.role,
  isTeacher: state => state.role === 'teacher',
  isStudent: state => state.role === 'student',
  userId: state => state.userId,
  authToken: state => state.token,
  refreshToken: state => state.refreshToken,
  loginLoading: state => state.loginLoading,
  loginError: state => state.loginError,
  isTokenExpired: state => isTokenExpired(state.token),
  isTokenRefreshing: state => state.tokenRefreshing
};

// 引入常量类型
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const TOKEN_REFRESH_REQUEST = 'TOKEN_REFRESH_REQUEST';
const TOKEN_REFRESH_SUCCESS = 'TOKEN_REFRESH_SUCCESS';
const TOKEN_REFRESH_FAILURE = 'TOKEN_REFRESH_FAILURE';

// Mutations
const mutations = {
  [LOGIN_REQUEST](state) {
    state.loginLoading = true;
    state.loginError = null;
  },
  [LOGIN_SUCCESS](state, { token, refreshToken, userId, role }) {
    state.token = token;
    state.refreshToken = refreshToken || state.refreshToken;
    state.userId = userId;
    state.role = role;
    state.loginLoading = false;
    state.loginError = null;
    state.lastTokenRefresh = Date.now();
    
    // 保存到本地存储
    uni.setStorageSync('token', token);
    uni.setStorageSync('refreshToken', refreshToken || state.refreshToken);
    uni.setStorageSync('userId', userId);
    uni.setStorageSync('role', role);
    uni.setStorageSync('lastTokenRefresh', Date.now());
  },
  [LOGIN_FAILURE](state, error) {
    state.loginLoading = false;
    state.loginError = error;
  },
  [LOGOUT](state) {
    state.token = '';
    state.refreshToken = '';
    state.userId = '';
    state.role = '';
    
    // 清除本地存储
    uni.removeStorageSync('token');
    uni.removeStorageSync('refreshToken');
    uni.removeStorageSync('userId');
    uni.removeStorageSync('role');
    uni.removeStorageSync('lastTokenRefresh');
  },
  [TOKEN_REFRESH_REQUEST](state) {
    state.tokenRefreshing = true;
  },
  [TOKEN_REFRESH_SUCCESS](state, { token, refreshToken }) {
    state.token = token;
    if (refreshToken) state.refreshToken = refreshToken;
    state.tokenRefreshing = false;
    state.lastTokenRefresh = Date.now();
    
    // 更新本地存储
    uni.setStorageSync('token', token);
    if (refreshToken) uni.setStorageSync('refreshToken', refreshToken);
    uni.setStorageSync('lastTokenRefresh', Date.now());
  },
  [TOKEN_REFRESH_FAILURE](state) {
    state.tokenRefreshing = false;
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
      const { token, refreshToken, userId, role } = response.data;
      commit(LOGIN_SUCCESS, { token, refreshToken, userId, role });
      return { success: true, data: response.data };
    } catch (error) {
      commit(LOGIN_FAILURE, error.response?.data?.message || '登录失败');
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
   * @description 刷新Token
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state }) {
    // 防止重复刷新
    if (isRefreshing) {
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          resolve({ success: true, token });
        });
      });
    }
    
    // 限制刷新频率（最小间隔1分钟）
    const now = Date.now();
    if (now - state.lastTokenRefresh < 60000) {
      return { success: true, token: state.token };
    }
    
    isRefreshing = true;
    commit(TOKEN_REFRESH_REQUEST);
    
    try {
      const response = await services.auth.refreshToken({ 
        refreshToken: state.refreshToken 
      });
      
      const { token, refreshToken } = response.data;
      commit(TOKEN_REFRESH_SUCCESS, { token, refreshToken });
      
      // 执行队列中的请求
      onRefreshed(token);
      isRefreshing = false;
      
      return { success: true, token, refreshToken };
    } catch (error) {
      commit(TOKEN_REFRESH_FAILURE);
      isRefreshing = false;
      return { success: false, error };
    }
  },
  
  /**
   * @description 初始化请求拦截器，添加认证Token
   * @param {Object} context - Vuex上下文
   * @param {Object} requestInstance - uni.request实例或自定义请求库实例
   */
  setupRequestInterceptor({ state, dispatch }, requestInstance) {
    // 这里的实现取决于你使用的请求库
    // 示例基于通用拦截器模式，需根据实际情况调整
    
    if (requestInstance && requestInstance.interceptors) {
      // 请求拦截
      requestInstance.interceptors.request.use(async (config) => {
        // 检查Token是否过期或即将过期
        if (state.token) {
          if (isTokenExpired(state.token)) {
            // Token已过期，尝试刷新
            if (state.refreshToken) {
              const { success, token } = await dispatch('refreshToken');
              if (success) {
                config.header = config.header || {};
                config.header.Authorization = `Bearer ${token}`;
              }
            }
          } else {
            // Token有效，直接使用
            config.header = config.header || {};
            config.header.Authorization = `Bearer ${state.token}`;
            
            // 如果Token即将过期，后台刷新
            if (isTokenNearExpiry(state.token)) {
              dispatch('refreshToken');
            }
          }
        }
        return config;
      });
      
      // 响应拦截
      requestInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          
          // 如果是401错误且未尝试过刷新Token
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // 尝试刷新Token
            if (state.refreshToken) {
              const { success, token } = await dispatch('refreshToken');
              if (success) {
                // 更新请求头并重试
                originalRequest.header.Authorization = `Bearer ${token}`;
                return requestInstance(originalRequest);
              }
            }
            
            // 刷新失败，登出
            dispatch('logout');
          }
          
          return Promise.reject(error);
        }
      );
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