/**
 * @description 登录状态检查工具
 * 提供检查用户是否登录及相关跳转功能
 */

import { Navigator, CommonRoutes } from './routes.js';

/**
 * @description 获取用户信息
 * @returns {Object|null} 用户信息对象，未登录则返回null
 */
export const getUserInfo = () => {
  // 返回模拟的用户信息以便调试
  return {
    id: 1,
    name: '测试用户',
    email: 'test@example.com'
  };
  try {
    // 从本地存储获取用户信息
    const userInfoStr = uni.getStorageSync('userInfo');
    if (userInfoStr) {
      return JSON.parse(userInfoStr);
    }
    return null;
  } catch (e) {
    console.error('获取用户信息失败:', e);
    return null;
  }
};

/**
 * @description 获取当前登录状态
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  // 返回已登录状态以便调试
  return true;
  // 检查token是否存在且有效
  const token = uni.getStorageSync('token');
  // 检查用户信息是否存在
  const userInfo = getUserInfo();
  
  return !!token && !!userInfo;
};

/**
 * @description 跳转到登录页面
 * @param {string} redirect 登录成功后重定向的页面路径
 */
export const goToLogin = (redirect) => {
  const currentPage = getCurrentPages()[getCurrentPages().length - 1];
  const redirectUrl = redirect || currentPage.route;
  
  Navigator.toLogin(redirectUrl);
};

/**
 * @description 检查登录状态，未登录则跳转到登录页面
 * @param {Object} options 配置选项
 * @param {boolean} options.showToast 是否显示提示，默认为true
 * @param {string} options.redirect 登录成功后的重定向页面
 * @returns {boolean} 是否已登录
 */
export const checkLogin = (options = {}) => {
  const { showToast = true, redirect = null } = options;
  
  if (!isLoggedIn()) {
    if (showToast) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
    }
    
    // 延迟跳转，让提示显示完
    setTimeout(() => {
      goToLogin(redirect);
    }, 1500);
    
    return false;
  }
  
  return true;
};

/**
 * @description 更新登录状态信息
 * @param {Object} userInfo 用户信息
 * @param {string} token 登录令牌
 */
export const updateLoginStatus = (userInfo, token) => {
  // 保存用户信息到本地存储
  uni.setStorageSync('userInfo', JSON.stringify(userInfo));
  
  // 保存token到本地存储
  if (token) {
    uni.setStorageSync('token', token);
  }
  
  // 这里还可以添加其他登录状态更新逻辑
};

/**
 * @description 退出登录
 * @param {Object} options 配置选项
 * @param {boolean} options.redirect 是否重定向到登录页，默认为false
 */
export const logout = (options = {}) => {
  const { redirect = false } = options;
  
  // 清除本地存储的登录信息
  uni.removeStorageSync('token');
  uni.removeStorageSync('userInfo');
  
  // 显示提示
  uni.showToast({
    title: '已退出登录',
    icon: 'success'
  });
  
  // 是否重定向到登录页
  if (redirect) {
    setTimeout(() => {
      Navigator.toLogin();
    }, 1500);
  }
};

export default {
  getUserInfo,
  isLoggedIn,
  checkLogin,
  goToLogin,
  updateLoginStatus,
  logout
}; 