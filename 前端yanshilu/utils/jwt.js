/**
 * JWT工具类 - 处理JSON Web Token的存储、获取、刷新等操作
 * @module utils/jwt
 */

/**
 * 存储JWT令牌到本地
 * @param {string} token - JWT令牌
 * @param {string} [refreshToken] - 刷新令牌（可选）
 */
export function setToken(token, refreshToken) {
  try {
    uni.setStorageSync('jwtToken', token);
    if (refreshToken) {
      uni.setStorageSync('refreshToken', refreshToken);
    }
  } catch (e) {
    console.error('存储JWT令牌失败:', e);
  }
}

/**
 * 获取JWT令牌
 * @returns {string|null} JWT令牌，如果不存在则返回null
 */
export function getToken() {
  try {
    return uni.getStorageSync('jwtToken');
  } catch (e) {
    console.error('获取JWT令牌失败:', e);
    return null;
  }
}

/**
 * 获取刷新令牌
 * @returns {string|null} 刷新令牌，如果不存在则返回null
 */
export function getRefreshToken() {
  try {
    return uni.getStorageSync('refreshToken');
  } catch (e) {
    console.error('获取刷新令牌失败:', e);
    return null;
  }
}

/**
 * 清除所有令牌
 */
export function clearTokens() {
  try {
    uni.removeStorageSync('jwtToken');
    uni.removeStorageSync('refreshToken');
  } catch (e) {
    console.error('清除令牌失败:', e);
  }
}

/**
 * 检查JWT令牌是否存在
 * @returns {boolean} 是否存在令牌
 */
export function hasToken() {
  return !!getToken();
}

/**
 * 解析JWT令牌（不验证签名）
 * @param {string} token - JWT令牌
 * @returns {Object|null} 解析后的载荷对象
 */
export function parseToken(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('解析JWT令牌失败:', e);
    return null;
  }
}

/**
 * 检查令牌是否过期
 * @param {string} token - JWT令牌
 * @returns {boolean} 是否已过期
 */
export function isTokenExpired(token) {
  const payload = parseToken(token);
  if (!payload || !payload.exp) return true;
  
  // exp是秒级时间戳，需要转换为毫秒
  const expDate = new Date(payload.exp * 1000);
  return expDate <= new Date();
}

/**
 * 检查令牌状态并处理过期情况
 * @returns {Promise<string|null>} 有效的JWT令牌或null
 */
export async function checkAndRefreshToken() {
  const token = getToken();
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    try {
      return await refreshToken();
    } catch (e) {
      console.error('刷新令牌失败:', e);
      clearTokens();
      // 可以在这里触发重新登录
      uni.reLaunch({ url: '/pages/login/login' });
      return null;
    }
  }
  
  return token;
}

/**
 * 刷新JWT令牌
 * @returns {Promise<string>} 新的JWT令牌
 */
export async function refreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('没有可用的刷新令牌');
  }
  
  // 这里替换为您的API请求实现
  try {
    const response = await uni.request({
      url: '/api/auth/refresh',  // 替换为您的刷新API地址
      method: 'POST',
      data: { refreshToken },
      header: { 'Content-Type': 'application/json' }
    });
    
    const { data } = response;
    if (data.token) {
      setToken(data.token, data.refreshToken || refreshToken);
      return data.token;
    } else {
      throw new Error(data.message || '刷新令牌失败');
    }
  } catch (error) {
    clearTokens();
    throw error;
  }
} 