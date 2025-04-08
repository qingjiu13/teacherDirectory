/**
 * @description 用户模块的actions
 */

import { login, getUserInfo, refreshToken, jwt } from '../../services/auth.api';

export default {
  /**
   * @description 用户登录
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    try {
      const response = await login(credentials);
      
      if (response.success) {
        const { token, refreshToken, expiresIn, userInfo, role } = response.data;
        
        // 设置认证信息
        commit('SET_AUTH', { token, refreshToken, expiresIn });
        commit('SET_LOGGED_IN', true);
        commit('SET_ROLE', role);
        commit('SET_USER_INFO', userInfo);
        
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '登录失败' };
      }
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: error.message || '登录过程中发生错误' };
    }
  },
  
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 用户信息
   */
  async getUserInfo({ commit, state, dispatch }) {
    try {
      // 如果没有token，先尝试刷新token
      if (!state.auth.token) {
        const refreshResult = await dispatch('refreshToken');
        if (!refreshResult.success) {
          return { success: false, message: '获取用户信息失败: 无有效令牌' };
        }
      }
      
      const response = await getUserInfo(state.auth.token);
      
      if (response.success) {
        commit('SET_USER_INFO', response.data);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message || '获取用户信息失败' };
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return { success: false, message: error.message || '获取用户信息过程中发生错误' };
    }
  },
  
  /**
   * @description 刷新令牌
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state }) {
    try {
      if (!state.auth.refreshToken) {
        return { success: false, message: '没有可用的刷新令牌' };
      }
      
      const response = await refreshToken(state.auth.refreshToken);
      
      if (response.success) {
        const { token, refreshToken, expiresIn } = response.data;
        commit('SET_AUTH', { token, refreshToken, expiresIn });
        return { success: true };
      } else {
        commit('CLEAR_AUTH');
        return { success: false, message: response.message || '刷新令牌失败' };
      }
    } catch (error) {
      console.error('刷新令牌失败:', error);
      commit('CLEAR_AUTH');
      return { success: false, message: error.message || '刷新令牌过程中发生错误' };
    }
  },
  
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 登出结果
   */
  logout({ commit }) {
    commit('CLEAR_AUTH');
    return { success: true, message: '登出成功' };
  },
  
  /**
   * @description 检查登录状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 登录状态
   */
  async checkLoginStatus({ state, commit, dispatch }) {
    try {
      // 如果本地存储没有登录标记，直接返回未登录
      if (!state.isLoggedIn) {
        return { success: false, message: '未登录' };
      }
      
      // 检查令牌是否有效
      const token = state.auth.token;
      const tokenExpireTime = state.auth.tokenExpireTime;
      
      // 如果令牌不存在或已过期
      if (!token || !tokenExpireTime || tokenExpireTime <= Date.now()) {
        // 尝试使用刷新令牌
        const refreshResult = await dispatch('refreshToken');
        if (!refreshResult.success) {
          // 如果刷新失败，清除认证信息
          commit('CLEAR_AUTH');
          return { success: false, message: '登录已过期' };
        }
      }
      
      // 获取最新的用户信息
      const userInfoResult = await dispatch('getUserInfo');
      if (!userInfoResult.success) {
        // 如果获取用户信息失败，可能是令牌无效
        commit('CLEAR_AUTH');
        return { success: false, message: '获取用户信息失败，请重新登录' };
      }
      
      return { success: true, message: '已登录' };
    } catch (error) {
      console.error('检查登录状态失败:', error);
      commit('CLEAR_AUTH');
      return { success: false, message: error.message || '检查登录状态过程中发生错误' };
    }
  },
  
  /**
   * @description 更新用户信息
   * @param {Object} context - Vuex上下文
   * @param {Object} userInfo - 用户信息
   * @returns {Promise<Object>} 更新结果
   */
  async updateUserInfo({ commit, state }, userInfo) {
    try {
      // 这里应该有一个真实的API请求
      // 模拟API请求成功
      setTimeout(() => {}, 300);
      
      commit('UPDATE_USER_INFO', userInfo);
      return { success: true, message: '用户信息已更新' };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, message: error.message || '更新用户信息过程中发生错误' };
    }
  },
  
  /**
   * @description 更新注册状态
   * @param {Object} context - Vuex上下文
   * @param {Object} registrationData - 注册数据
   * @returns {Promise<Object>} 更新结果
   */
  updateRegistration({ commit }, registrationData) {
    commit('SET_REGISTRATION', registrationData);
    return { success: true };
  }
};