/**
 * 用户基本信息相关API
 * @module store/user/baseInfo/api
 */

import { 
  USER_GET_USER_INFO_URL, 
  LOGIN_URL, 
  USER_UPDATE_USER_INFO_URL 
} from '../../../api/index';
import { 
  createToken, 
  verifyToken, 
  getUserIdFromToken, 
  apiRequest 
} from '../JWT';
import { USE_MOCK_DATA } from './config';
import { 
  mockLogin, 
  mockGetUserInfo, 
  mockUpdateUserInfo 
} from './mock';

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = (data) => {
  // 如果使用模拟数据
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      mockLogin(data)
        .then(response => {
          if (response.success) {
            // 使用JWT.js创建令牌
            const userId = response.data.userId;
            const userData = {
              username: data.username,
              role: response.data.role || 'user',
              // 可以添加其他需要的用户信息
            };
            
            // 创建JWT令牌
            const token = createToken(userId, undefined, userData);
            
            // 存储token和用户ID
            uni.setStorageSync('user-token', token);
            uni.setStorageSync('userId', userId);
            
            resolve({
              success: true,
              data: {
                ...response.data,
                token
              }
            });
          } else {
            reject({
              success: false,
              error: response.error
            });
          }
        })
        .catch(error => {
          reject({
            success: false,
            error: error.error || { message: '登录请求失败' }
          });
        });
    });
  }
  
  // 使用真实API
  return new Promise((resolve, reject) => {
    // 登录请求不需要认证
    apiRequest(LOGIN_URL, 'POST', {
      username: data.username,
      password: data.password
    }, {
      requireAuth: false,
      autoAddUserId: false
    })
    .then(response => {
      if (response.success) {
        // 使用JWT.js创建令牌
        const userId = response.data.userId;
        const userData = {
          username: data.username,
          role: response.data.role || 'user',
          // 可以添加其他需要的用户信息
        };
        
        // 创建JWT令牌
        const token = createToken(userId, undefined, userData);
        
        // 存储token和用户ID
        uni.setStorageSync('user-token', token);
        uni.setStorageSync('userId', userId);
        
        resolve({
          success: true,
          data: {
            ...response.data,
            token
          }
        });
      } else {
        reject({
          success: false,
          error: response.error
        });
      }
    })
    .catch(error => {
      reject({
        success: false,
        error: error.error || { message: '登录请求失败' }
      });
    });
  });
};

/**
 * 验证用户令牌
 * @returns {boolean} 令牌是否有效
 */
export const validateToken = () => {
  const token = uni.getStorageSync('user-token');
  return token && verifyToken(token);
};

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = () => {
  if (USE_MOCK_DATA) {
    const userId = uni.getStorageSync('userId');
    return mockGetUserInfo(userId);
  }
  
  return apiRequest(USER_GET_USER_INFO_URL, 'GET', {}, {
    showError: true
  });
};

/**
 * 更新用户信息
 * @param {Object} userInfo - 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = (userInfo) => {
  if (USE_MOCK_DATA) {
    const userId = uni.getStorageSync('userId');
    return mockUpdateUserInfo(userId, userInfo);
  }
  
  return apiRequest(USER_UPDATE_USER_INFO_URL, 'POST', userInfo);
}; 