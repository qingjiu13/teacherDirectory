/**
 * @description 用户认证状态管理模块
 */

import { jwtDecode } from 'jwt-decode';
import { Base64 } from 'js-base64';

// 模拟API请求
const api = {
  /**
   * @description 模拟登录请求
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @param {string} credentials.role - 角色（student/teacher）
   * @returns {Promise<Object>} 登录结果
   */
  login(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { username, role } = credentials;
        
        // 创建JWT payload
        const payload = {
          sub: `user_${Date.now()}`,
          name: username,
          role: role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 7200 // 2小时后过期
        };
        
        // 模拟JWT结构 (header.payload.signature)
        const header = Base64.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payloadBase64 = Base64.encode(JSON.stringify(payload));
        const signature = Base64.encode('mock_signature'); // 模拟签名
        
        const token = `${header}.${payloadBase64}.${signature}`;
        const refreshToken = `refresh_${header}.${Base64.encode(JSON.stringify({
          ...payload,
          exp: Math.floor(Date.now() / 1000) + 86400 // 24小时后过期
        }))}.${signature}`;
        
        resolve({
          success: true,
          data: {
            token,
            refreshToken,
            expiresIn: 7200,
            userInfo: {
              name: username,
              avatar: 'https://example.com/avatar.png',
              tags: ['标签1', '标签2'],
              balance: role === 'teacher' ? 1000 : null,
            },
            role
          }
        });
      }, 500);
    });
  },
  
  /**
   * @description 模拟获取用户信息
   * @param {string} token - 用户token
   * @returns {Promise<Object>} 用户信息
   */
  getUserInfo(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = token.startsWith('teacher') ? 'teacher' : 'student';
        resolve({
          success: true,
          data: {
            name: `${role}用户`,
            avatar: 'https://example.com/avatar.png',
            tags: ['标签1', '标签2', '标签3'],
            balance: role === 'teacher' ? 1500 : null,
            orders: {
              student: {
                pendingPayment: role === 'student' ? [{ id: 's1', title: '待付款订单1' }] : [],
                pendingService: role === 'student' ? [{ id: 's2', title: '待服务订单1' }] : [],
                completed: role === 'student' ? [{ id: 's3', title: '已完成订单1' }] : [],
                cancelled: role === 'student' ? [{ id: 's4', title: '已取消订单1' }] : []
              },
              teacher: {
                pendingService: role === 'teacher' ? [{ id: 't1', title: '待服务订单1' }] : [],
                completed: role === 'teacher' ? [{ id: 't2', title: '已完成订单1' }] : [],
                cancelled: role === 'teacher' ? [{ id: 't3', title: '已取消订单1' }] : []
              }
            }
          }
        });
      }, 600);
    });
  },
  
  /**
   * @description 模拟刷新token
   * @param {string} refreshToken - 刷新token
   * @returns {Promise<Object>} 新的token信息
   */
  refreshToken(refreshToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            token: `new_token_${Date.now()}`,
            refreshToken: `new_refresh_token_${Date.now()}`,
            expiresIn: 7200 // 2小时有效期
          }
        });
      }, 300);
    });
  }
};

// 存储助手函数
const storage = {
  /**
   * @description 保存认证信息到本地存储
   * @param {Object} auth - 认证信息
   */
  saveAuth(auth) {
    uni.setStorageSync('token', auth.token);
    uni.setStorageSync('refreshToken', auth.refreshToken);
    uni.setStorageSync('tokenExpireTime', Date.now() + auth.expiresIn * 1000);
    uni.setStorageSync('isLoggedIn', true);
    uni.setStorageSync('role', auth.role);
    uni.setStorageSync('userBaseInfo', {
      name: auth.userInfo.name,
      avatar: auth.userInfo.avatar
    });
  },
  
  /**
   * @description 清除认证信息
   */
  clearAuth() {
    uni.removeStorageSync('token');
    uni.removeStorageSync('refreshToken');
    uni.removeStorageSync('tokenExpireTime');
    uni.removeStorageSync('isLoggedIn');
    uni.removeStorageSync('role');
    uni.removeStorageSync('userBaseInfo');
  },
  
  /**
   * @description 获取token
   * @returns {string|null} token值
   */
  getToken() {
    return uni.getStorageSync('token') || null;
  },
  
  /**
   * @description 获取刷新token
   * @returns {string|null} 刷新token值
   */
  getRefreshToken() {
    return uni.getStorageSync('refreshToken') || null;
  },
  
  /**
   * @description 获取token过期时间
   * @returns {number|null} 过期时间戳
   */
  getTokenExpireTime() {
    return uni.getStorageSync('tokenExpireTime') || null;
  }
};

const state = {
  isRegistered: false,
  role: uni.getStorageSync('role') || null,
  isLoggedIn: uni.getStorageSync('isLoggedIn') || false,
  userInfo: {
    name: '',
    avatar: '',
    tags: [],
    balance: null,
    orders: {
      student: { pendingPayment: [], pendingService: [], completed: [], cancelled: [] },
      teacher: { pendingService: [], completed: [], cancelled: [] }
    }
  },
  token: storage.getToken(),
  refreshToken: storage.getRefreshToken(),
  tokenExpireTime: storage.getTokenExpireTime()
};

const mutations = {
  /**
   * @description 设置登录状态
   * @param {Object} state - Vuex状态
   * @param {boolean} isLoggedIn - 是否已登录
   */
  SET_LOGGED_IN(state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn;
  },
  
  /**
   * @description 设置用户角色
   * @param {Object} state - Vuex状态
   * @param {string} role - 用户角色
   */
  SET_ROLE(state, role) {
    state.role = role;
  },
  
  /**
   * @description 设置认证信息
   * @param {Object} state - Vuex状态
   * @param {Object} authData - 认证数据
   */
  SET_AUTH(state, authData) {
    state.token = authData.token;
    state.refreshToken = authData.refreshToken;
    state.tokenExpireTime = Date.now() + authData.expiresIn * 1000;
    
    // 保存到本地存储
    storage.saveAuth({
      token: authData.token,
      refreshToken: authData.refreshToken,
      expiresIn: authData.expiresIn,
      role: authData.role,
      userInfo: authData.userInfo
    });
  },
  
  /**
   * @description 设置用户信息
   * @param {Object} state - Vuex状态
   * @param {Object} userInfo - 用户信息
   */
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  
  /**
   * @description 清除认证状态
   * @param {Object} state - Vuex状态
   */
  CLEAR_AUTH(state) {
    state.isLoggedIn = false;
    state.token = null;
    state.refreshToken = null;
    state.tokenExpireTime = null;
    state.userInfo = {
      name: '',
      avatar: '',
      tags: [],
      balance: null,
      orders: {
        student: { pendingPayment: [], pendingService: [], completed: [], cancelled: [] },
        teacher: { pendingService: [], completed: [], cancelled: [] }
      }
    };
    
    // 清除本地存储
    storage.clearAuth();
  },
  
  /**
   * @description 设置是否已注册
   * @param {Object} state - Vuex状态
   * @param {boolean} status - 注册状态
   */
  SET_REGISTERED(state, status) {
    state.isRegistered = status;
  }
};

const actions = {
  /**
   * @description 登录操作
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    try {
      const response = await api.login(credentials);
      if (response.success) {
        const { token, refreshToken, expiresIn, userInfo, role } = response.data;
        
        commit('SET_LOGGED_IN', true);
        commit('SET_ROLE', role);
        commit('SET_AUTH', { token, refreshToken, expiresIn, role, userInfo });
        commit('SET_USER_INFO', userInfo);
        
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '登录失败' };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: error.message || '登录失败' };
    }
  },
  
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 用户信息获取结果
   */
  async getUserInfo({ commit, state, dispatch }) {
    // 如果token即将过期，先刷新token
    if (state.tokenExpireTime && state.tokenExpireTime - Date.now() < 10 * 60 * 1000) {
      await dispatch('refreshToken');
    }
    
    try {
      const response = await api.getUserInfo(state.token);
      if (response.success) {
        commit('SET_USER_INFO', response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: '获取用户信息失败' };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return { success: false, message: error.message || '获取用户信息失败' };
    }
  },
  
  /**
   * @description 刷新token
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state }) {
    if (!state.refreshToken) {
      return { success: false, message: '无刷新令牌' };
    }
    
    try {
      const response = await api.refreshToken(state.refreshToken);
      if (response.success) {
        const { token, refreshToken, expiresIn } = response.data;
        
        // 解析JWT获取过期时间
        const decodedToken = jwtUtils.decode(token);
        
        commit('SET_AUTH', {
          token,
          refreshToken,
          expiresIn: decodedToken ? (decodedToken.exp * 1000 - Date.now()) / 1000 : expiresIn,
          role: state.role,
          userInfo: state.userInfo
        });
        return { success: true, message: '令牌刷新成功' };
      }
      return { success: false, message: '令牌刷新失败' };
    } catch (error) {
      console.error('令牌刷新失败:', error);
      commit('CLEAR_AUTH');
      return { success: false, message: error.message || '令牌刷新失败' };
    }
  },
  
  /**
   * @description 登出操作
   * @param {Object} context - Vuex上下文
   */
  logout({ commit }) {
    commit('CLEAR_AUTH');
    return { success: true, message: '已退出登录' };
  },
  
  /**
   * @description 验证登录状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 验证结果
   */
  async checkLoginStatus({ state, commit, dispatch }) {
    if (!state.token) {
      commit('CLEAR_AUTH');
      return { success: false, message: '未登录' };
    }
    
    // 使用JWT工具检查是否有效
    const isTokenValid = jwtUtils.isValid(state.token);
    
    if (!isTokenValid && state.refreshToken) {
      const refreshResult = await dispatch('refreshToken');
      if (!refreshResult.success) {
        commit('CLEAR_AUTH');
        return { success: false, message: '登录已过期' };
      }
    } else if (!isTokenValid) {
      commit('CLEAR_AUTH');
      return { success: false, message: '登录已过期' };
    }
    
    // 获取用户信息以验证token有效性
    const userInfoResult = await dispatch('getUserInfo');
    if (userInfoResult.success) {
      return { success: true, message: '登录状态有效' };
    } else {
      commit('CLEAR_AUTH');
      return { success: false, message: '登录状态无效' };
    }
  }
};

const getters = {
  /**
   * @description 获取用户角色
   * @param {Object} state - Vuex状态
   * @returns {string|null} 用户角色
   */
  userRole: state => state.role,
  
  /**
   * @description 判断是否是老师
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否是老师
   */
  isTeacher: state => state.role === 'teacher',
  
  /**
   * @description 判断是否是学生
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否是学生
   */
  isStudent: state => state.role === 'student',
  
  /**
   * @description 获取老师余额
   * @param {Object} state - Vuex状态
   * @returns {number|null} 老师余额
   */
  teacherBalance: state => state.role === 'teacher' ? state.userInfo.balance : null,
  
  /**
   * @description 获取用户名称
   * @param {Object} state - Vuex状态
   * @returns {string} 用户名称
   */
  userName: state => state.userInfo.name,
  
  /**
   * @description 获取用户头像
   * @param {Object} state - Vuex状态
   * @returns {string} 用户头像
   */
  userAvatar: state => state.userInfo.avatar,
  
  /**
   * @description 获取用户标签
   * @param {Object} state - Vuex状态
   * @returns {Array} 用户标签
   */
  userTags: state => state.userInfo.tags,
  
  /**
   * @description 获取学生待付款订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待付款订单列表
   */
  studentPendingPaymentOrders: state => state.userInfo.orders.student.pendingPayment,
  
  /**
   * @description 获取学生待服务订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待服务订单列表
   */
  studentPendingServiceOrders: state => state.userInfo.orders.student.pendingService,
  
  /**
   * @description 获取学生已完成订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已完成订单列表
   */
  studentCompletedOrders: state => state.userInfo.orders.student.completed,
  
  /**
   * @description 获取学生已取消订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已取消订单列表
   */
  studentCancelledOrders: state => state.userInfo.orders.student.cancelled,
  
  /**
   * @description 获取老师待服务订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待服务订单列表
   */
  teacherPendingServiceOrders: state => state.userInfo.orders.teacher.pendingService,
  
  /**
   * @description 获取老师已完成订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已完成订单列表
   */
  teacherCompletedOrders: state => state.userInfo.orders.teacher.completed,
  
  /**
   * @description 获取老师已取消订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已取消订单列表
   */
  teacherCancelledOrders: state => state.userInfo.orders.teacher.cancelled
};

// JWT处理工具
const jwtUtils = {
  /**
   * @description 解析JWT令牌
   * @param {string} token - JWT令牌
   * @returns {Object} 解析后的数据
   */
  decode(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('JWT解析失败:', error);
      return null;
    }
  },
  
  /**
   * @description 检查JWT是否有效
   * @param {string} token - JWT令牌
   * @returns {boolean} 是否有效
   */
  isValid(token) {
    if (!token) return false;
    
    try {
      const decoded = this.decode(token);
      if (!decoded) return false;
      
      // 检查是否过期
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
