/**
 * HTTP请求拦截器 - 集成JWT认证
 * @module utils/request
 */

import { getToken, checkAndRefreshToken, clearTokens } from './jwt.js';
import { Navigator, CommonRoutes } from './routes.js';
import { BASE_URL } from '../config.js';

// 请求基础URL
const baseURL = BASE_URL || '';

/**
 * 统一请求方法
 * @param {Object} options - 请求选项
 * @param {string} options.url - 请求地址
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {Object} [options.header] - 请求头
 * @param {boolean} [options.auth=true] - 是否需要认证
 * @param {boolean} [options.loading=true] - 是否显示加载提示
 * @returns {Promise<any>} 请求响应
 */
const request = (options = {}) => {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    auth = true,
    loading = true
  } = options;

  // 显示加载提示
  if (loading) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
  }

  // 构建请求URL
  const requestUrl = url.startsWith('http') ? url : baseURL + url;

  // 构建请求头
  const requestHeader = {
    'Content-Type': 'application/json',
    ...header
  };

  // 添加认证头
  if (auth) {
    const token = getToken();
    if (token) {
      requestHeader.Authorization = `Bearer ${token}`;
    }
  }

  // 发起请求
  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      data,
      header: requestHeader,
      success: async (res) => {
        // 处理响应
        const { statusCode, data } = res;

        // 隐藏加载提示
        if (loading) {
          uni.hideLoading();
        }

        // 处理 HTTP 状态码
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else if (statusCode === 401) {
          // 尝试刷新 token
          try {
            const newToken = await checkAndRefreshToken();
            if (newToken) {
              // 使用新 token 重试请求
              const retryOptions = {
                ...options,
                loading: false  // 避免重复显示加载
              };
              const result = await request(retryOptions);
              resolve(result);
            } else {
              // 跳转到登录页
              handleAuthError();
              reject(new Error('未授权，请重新登录'));
            }
          } catch (error) {
            handleAuthError();
            reject(error);
          }
        } else {
          // 其他错误状态码
          const errorMsg = data?.message || `请求失败(${statusCode})`;
          showError(errorMsg);
          reject(new Error(errorMsg));
        }
      },
      fail: (err) => {
        // 隐藏加载提示
        if (loading) {
          uni.hideLoading();
        }
        
        // 处理请求失败
        const errorMsg = '网络请求失败，请检查网络连接';
        showError(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
};

/**
 * 处理认证错误
 */
function handleAuthError() {
  clearTokens();
  
  // 显示提示
  uni.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: 2000
  });
  
  // 延迟跳转到登录页面
  setTimeout(() => {
    Navigator.reLaunch(CommonRoutes.LOGIN);
  }, 1500);
}

/**
 * 显示错误提示
 * @param {string} message - 错误消息
 */
function showError(message) {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
}

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求参数
 * @param {Object} [options] - 其他选项
 * @returns {Promise<any>} 请求响应
 */
export function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求数据
 * @param {Object} [options] - 其他选项
 * @returns {Promise<any>} 请求响应
 */
export function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求数据
 * @param {Object} [options] - 其他选项
 * @returns {Promise<any>} 请求响应
 */
export function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求参数
 * @param {Object} [options] - 其他选项
 * @returns {Promise<any>} 请求响应
 */
export function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
}

export default {
  request,
  get,
  post,
  put,
  del
}; 