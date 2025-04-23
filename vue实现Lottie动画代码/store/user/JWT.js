/**
 * JWT相关工具函数
 * @module store/user/JWT
 */

// 导入路由管理器
import { Navigator } from '@/router/Router.js';

/**
 * 创建JWT令牌
 * @param {string} userId - 用户ID
 * @param {string} [secret='yanshilu-jwt-secret'] - 加密密钥
 * @param {Object} [additionalData={}] - 额外的数据
 * @returns {string} 生成的JWT令牌
 */
export const createToken = (userId, secret = 'yanshilu-jwt-secret', additionalData = {}) => {
  // 构建JWT的payload部分
  const payload = {
    userId: userId,
    ...additionalData,
    iat: Math.floor(Date.now() / 1000), // 令牌签发时间
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7天过期
  };

  // Base64编码header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const base64Header = btoa(JSON.stringify(header));

  // Base64编码payload
  const base64Payload = btoa(JSON.stringify(payload));

  // 创建签名 (在前端我们使用简化版本，真实签名应在后端完成)
  const signature = createSignature(`${base64Header}.${base64Payload}`, secret);

  // 返回完整的JWT
  return `${base64Header}.${base64Payload}.${signature}`;
};

/**
 * 创建签名（简化版，生产环境应使用专业库）
 * @param {string} data - 要签名的数据
 * @param {string} secret - 签名密钥
 * @returns {string} 签名结果
 */
const createSignature = (data, secret) => {
  // 注意：这是签名的简化实现，仅用于演示
  // 生产环境中应使用crypto-js或其他安全库进行真实HMAC-SHA256签名
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // 转换为32位整数
  }
  return btoa(hash + secret);
};

/**
 * 验证JWT令牌
 * @param {string} token - JWT令牌
 * @param {string} [secret='yanshilu-jwt-secret'] - 加密密钥
 * @returns {boolean} 令牌是否有效
 */
export const verifyToken = (token, secret = 'yanshilu-jwt-secret') => {
  try {
    // 分解JWT各部分
    const [headerBase64, payloadBase64, signature] = token.split('.');
    
    // 验证签名
    const expectedSignature = createSignature(`${headerBase64}.${payloadBase64}`, secret);
    if (signature !== expectedSignature) {
      return false;
    }
    
    // 解析payload
    const payload = JSON.parse(atob(payloadBase64));
    
    // 检查是否过期
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('JWT验证失败:', error);
    return false;
  }
};

/**
 * 解析JWT令牌获取用户ID
 * @param {string} token - JWT令牌
 * @returns {string|null} 用户ID，无效令牌返回null
 */
export const getUserIdFromToken = (token) => {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return payload.userId || null;
  } catch (error) {
    console.error('解析JWT令牌失败:', error);
    return null;
  }
};

/**
 * 解析JWT令牌获取完整载荷
 * @param {string} token - JWT令牌
 * @returns {Object|null} 载荷对象，无效令牌返回null
 */
export const getPayloadFromToken = (token) => {
  try {
    const [, payloadBase64] = token.split('.');
    return JSON.parse(atob(payloadBase64));
  } catch (error) {
    console.error('解析JWT载荷失败:', error);
    return null;
  }
};

/**
 * 获取当前用户令牌
 * @returns {string|null} 用户令牌，未登录返回null
 */
export const getCurrentToken = () => {
  return uni.getStorageSync('user-token') || null;
};

/**
 * 获取当前用户ID
 * @returns {string|null} 用户ID，未登录返回null
 */
export const getCurrentUserId = () => {
  const token = getCurrentToken();
  return token ? getUserIdFromToken(token) : null;
};

/**
 * 基于JWT令牌的统一API请求工具
 * @param {string} url - 请求URL
 * @param {string} [method='GET'] - 请求方法
 * @param {Object} [data={}] - 请求数据
 * @param {Object} [options={}] - 额外选项
 * @param {boolean} [options.autoAddUserId=true] - 是否自动添加用户ID
 * @param {boolean} [options.requireAuth=true] - 是否要求认证
 * @param {boolean} [options.showError=true] - 是否显示错误提示
 * @param {Object} [options.customHeader={}] - 自定义请求头
 * @returns {Promise<Object>} 请求结果Promise
 */
export const apiRequest = (url, method = 'GET', data = {}, options = {}) => {
  const defaultOptions = {
    autoAddUserId: true,
    requireAuth: true,
    showError: true,
    customHeader: {}
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    // 获取令牌
    const token = getCurrentToken();
    
    // 如果需要认证但没有令牌
    if (finalOptions.requireAuth && (!token || !verifyToken(token))) {
      const error = {
        success: false,
        error: {
          code: 401,
          message: '未登录或认证已过期，请重新登录'
        }
      };
      
      if (finalOptions.showError) {
        uni.showToast({
          title: error.error.message,
          icon: 'none',
          duration: 2000
        });
      }
      
      reject(error);
      return;
    }
    
    // 准备请求数据，如果需要则自动添加用户ID
    let requestData = { ...data };
    
    if (finalOptions.autoAddUserId && token) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        requestData = method.toUpperCase() === 'GET' 
          ? { ...requestData, userId } 
          : { ...requestData, userId };
      }
    }
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      ...finalOptions.customHeader
    };
    
    // 如果有令牌则添加到请求头
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 发送请求
    uni.request({
      url,
      method: method.toUpperCase(),
      data: requestData,
      header: headers,
      success: (res) => {
        // 请求成功但业务逻辑错误
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          resolve({
            success: true,
            data: res.data.data
          });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // 认证失败，清除令牌
          uni.removeStorageSync('user-token');
          uni.removeStorageSync('userId');
          
          const error = {
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.msg || (res.statusCode === 401 ? '认证已过期，请重新登录' : '无权访问')
            }
          };
          
          if (finalOptions.showError) {
            uni.showToast({
              title: error.error.message,
              icon: 'none',
              duration: 2000
            });
            
            // 如果认证失败，可以跳转到登录页
            setTimeout(() => {
              Navigator.toLogin();
            }, 2000);
          }
          
          reject(error);
        } else {
          // 其他业务逻辑错误
          const error = {
            success: false,
            error: {
              statusCode: res.statusCode,
              message: res.data?.msg || '请求失败'
            }
          };
          
          if (finalOptions.showError) {
            uni.showToast({
              title: error.error.message,
              icon: 'none',
              duration: 2000
            });
          }
          
          reject(error);
        }
      },
      fail: (err) => {
        // 网络请求失败
        const error = {
          success: false,
          error: {
            message: err.errMsg || '网络请求失败'
          }
        };
        
        if (finalOptions.showError) {
          uni.showToast({
            title: error.error.message,
            icon: 'none',
            duration: 2000
          });
        }
        
        reject(error);
      }
    });
  });
};
