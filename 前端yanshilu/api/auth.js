/**
 * 认证相关API服务
 * @module api/auth
 */

import { post, get } from '../utils/request.js';
import { setToken, clearTokens, getToken, getRefreshToken } from '../utils/jwt.js';
import { Navigator, CommonRoutes } from '../utils/routes.js';

/**
 * 使用手机验证码登录
 * @param {Object} params - 登录参数
 * @param {string} params.mobile - 手机号
 * @param {string} params.code - 验证码
 * @returns {Promise<Object>} 登录结果
 */
export async function loginWithMobile(params) {
  try {
    const response = await post('/api/auth/login/mobile', params, {
      auth: false // 登录请求不需要认证头
    });
    
    if (response && response.token) {
      // 保存令牌
      setToken(response.token, response.refreshToken);
      return response;
    }
    throw new Error(response.message || '登录失败');
  } catch (error) {
    throw error;
  }
}

/**
 * 使用微信授权登录
 * @param {Object} params - 登录参数
 * @param {string} params.code - 微信授权code
 * @param {string} [params.encryptedData] - 微信加密数据
 * @param {string} [params.iv] - 微信加密初始向量
 * @returns {Promise<Object>} 登录结果
 */
export async function loginWithWechat(params) {
  try {
    const response = await post('/api/auth/login/wechat', params, {
      auth: false // 登录请求不需要认证头
    });
    
    if (response && response.token) {
      // 保存令牌
      setToken(response.token, response.refreshToken);
      return response;
    }
    throw new Error(response.message || '微信登录失败');
  } catch (error) {
    throw error;
  }
}

/**
 * 用户退出登录
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // 可选：调用后端注销接口
    if (getToken()) {
      await post('/api/auth/logout');
    }
  } catch (error) {
    console.error('注销时出错:', error);
  } finally {
    // 清除本地存储的令牌
    clearTokens();
    
    // 跳转到登录页
    Navigator.reLaunch(CommonRoutes.LOGIN);
  }
}

/**
 * 验证手机号
 * @param {string} mobile - 手机号
 * @returns {Promise<Object>} 验证结果
 */
export async function verifyMobile(mobile) {
  return await post('/api/auth/verify-mobile', { mobile });
}

/**
 * 发送验证码
 * @param {string} mobile - 手机号
 * @returns {Promise<Object>} 发送结果
 */
export async function sendVerificationCode(mobile) {
  return await post('/api/auth/send-code', { mobile }, {
    auth: false
  });
}

/**
 * 验证验证码
 * @param {string} mobile - 手机号
 * @param {string} code - 验证码
 * @returns {Promise<Object>} 验证结果
 */
export async function verifyCode(mobile, code) {
  return await post('/api/auth/verify-code', { mobile, code }, {
    auth: false
  });
}

/**
 * 绑定手机号
 * @param {string} mobile - 手机号
 * @param {string} code - 验证码
 * @returns {Promise<Object>} 绑定结果
 */
export async function bindMobile(mobile, code) {
  return await post('/api/user/bind-mobile', { 
    mobile, 
    code
  });
}

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export async function getCurrentUser() {
  return await get('/api/user/current');
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * 更新用户个人资料
 * @param {Object} profileData - 个人资料数据
 * @returns {Promise<Object>} 更新结果
 */
export async function updateProfile(profileData) {
  return await post('/api/user/profile', profileData);
}

export default {
  loginWithMobile,
  loginWithWechat,
  logout,
  verifyMobile,
  sendVerificationCode,
  verifyCode,
  bindMobile,
  getCurrentUser,
  isLoggedIn,
  updateProfile
}; 