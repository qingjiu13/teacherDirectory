/**
 * 用户认证状态管理工具
 * @module utils/auth
 */
import { getToken, hasToken, checkAndRefreshToken, clearTokens, parseToken } from './jwt.js';
import { Navigator, CommonRoutes } from './routes.js';
import { get } from './request.js';

// 用户状态存储键
const USER_INFO_KEY = 'userInfo';
const LOGIN_STATUS_KEY = 'loginStatus';

/**
 * 用户登录状态枚举
 * @enum {number}
 */
export const LoginStatus = {
  NOT_LOGGED_IN: 0, // 未登录
  LOGGED_IN: 1,     // 已登录
  TOKEN_EXPIRED: 2, // 令牌过期
  REFRESHING: 3     // 正在刷新
};

/**
 * 存储用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export function setUserInfo(userInfo) {
  try {
    uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
    setLoginStatus(LoginStatus.LOGGED_IN);
  } catch (e) {
    console.error('存储用户信息失败:', e);
  }
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象，如果不存在则返回null
 */
export function getUserInfo() {
  try {
    const userInfo = uni.getStorageSync(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (e) {
    console.error('获取用户信息失败:', e);
    return null;
  }
}

/**
 * 设置登录状态
 * @param {LoginStatus} status - 登录状态
 */
export function setLoginStatus(status) {
  try {
    uni.setStorageSync(LOGIN_STATUS_KEY, status);
  } catch (e) {
    console.error('设置登录状态失败:', e);
  }
}

/**
 * 获取当前登录状态
 * @returns {LoginStatus} 当前登录状态
 */
export function getLoginStatus() {
  try {
    const status = uni.getStorageSync(LOGIN_STATUS_KEY);
    return status !== '' ? status : LoginStatus.NOT_LOGGED_IN;
  } catch (e) {
    console.error('获取登录状态失败:', e);
    return LoginStatus.NOT_LOGGED_IN;
  }
}

/**
 * 清除用户信息和登录状态
 */
export function clearUserInfo() {
  try {
    uni.removeStorageSync(USER_INFO_KEY);
    setLoginStatus(LoginStatus.NOT_LOGGED_IN);
  } catch (e) {
    console.error('清除用户信息失败:', e);
  }
}

/**
 * 登出用户
 * @param {boolean} [redirect=true] - 是否重定向到登录页面
 */
export function logout(redirect = true) {
  clearTokens();
  clearUserInfo();
  
  // 提示用户已登出
  uni.showToast({
    title: '已退出登录',
    icon: 'none',
    duration: 2000
  });
  
  // 重定向到登录页面
  if (redirect) {
    setTimeout(() => {
      Navigator.reLaunch(CommonRoutes.LOGIN);
    }, 1500);
  }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return hasToken() && getLoginStatus() === LoginStatus.LOGGED_IN;
}

/**
 * 检查登录状态并处理
 * @param {boolean} [redirect=true] - 若未登录是否重定向到登录页面
 * @returns {Promise<boolean>} 登录状态的Promise
 */
export async function checkLoginStatus(redirect = true) {
  // 检查令牌是否存在
  if (!hasToken()) {
    if (redirect) {
      Navigator.redirectTo(CommonRoutes.LOGIN);
    }
    return false;
  }
  
  try {
    // 检查并刷新令牌
    const token = await checkAndRefreshToken();
    if (!token) {
      if (redirect) {
        Navigator.redirectTo(CommonRoutes.LOGIN);
      }
      return false;
    }
    
    // 如果状态显示未登录但有有效令牌，更新状态
    if (getLoginStatus() !== LoginStatus.LOGGED_IN) {
      setLoginStatus(LoginStatus.LOGGED_IN);
    }
    
    return true;
  } catch (error) {
    console.error('检查登录状态失败:', error);
    if (redirect) {
      Navigator.redirectTo(CommonRoutes.LOGIN);
    }
    return false;
  }
}

/**
 * 从令牌中获取用户ID
 * @returns {string|null} 用户ID
 */
export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  
  const payload = parseToken(token);
  return payload?.userId || null;
}

/**
 * 刷新用户信息
 * @returns {Promise<Object|null>} 用户信息的Promise
 */
export async function refreshUserInfo() {
  try {
    // 确保用户已登录
    if (!await checkLoginStatus(false)) {
      return null;
    }
    
    // 调用获取用户信息的API
    const result = await get('/api/user/info');
    if (result && result.code === 200) {
      setUserInfo(result.data);
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('刷新用户信息失败:', error);
    return null;
  }
}

/**
 * 设置登录状态监听器
 * @param {Function} callback - 状态变化时的回调函数
 */
export function setupLoginStatusListener(callback) {
  // 定期检查登录状态
  const timer = setInterval(async () => {
    const wasLoggedIn = isLoggedIn();
    const isLoggedInNow = await checkLoginStatus(false);
    
    // 如果状态发生变化，调用回调
    if (wasLoggedIn !== isLoggedInNow) {
      callback(isLoggedInNow);
    }
  }, 60000); // 每分钟检查一次
  
  // 返回清理函数
  return () => clearInterval(timer);
}

export default {
  LoginStatus,
  setUserInfo,
  getUserInfo,
  clearUserInfo,
  isLoggedIn,
  logout,
  checkLoginStatus,
  getUserIdFromToken,
  refreshUserInfo,
  setupLoginStatusListener
}; 