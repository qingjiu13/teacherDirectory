/**
 * @description 封装uni.request请求
 * @param {Object} options - 请求配置
 * @param {String} options.url - 请求地址
 * @param {String} options.method - 请求方法，默认GET
 * @param {Object} options.data - 请求参数
 * @param {String} options.contentType - 内容类型，默认application/json
 * @param {Boolean} options.showLoading - 是否显示加载框，默认true
 * @param {Boolean} options.hideError - 是否隐藏错误提示，默认false
 * @returns {Promise} - 返回Promise对象
 */
import { BASE_URL } from '../config.js';

// 创建请求队列，用于防止重复请求
const requestQueue = new Map();

// 获取请求唯一标识
function getRequestId(options) {
  return `${options.url}_${options.method}_${JSON.stringify(options.data || {})}`;
}

// 默认请求配置
const defaultOptions = {
  method: 'GET',
  showLoading: true,
  hideError: false,
  contentType: 'application/json'
};

/**
 * @description 请求方法
 * @param {Object} options - 请求配置 
 * @returns {Promise} Promise对象
 */
export default function request(options) {
  // 合并默认配置
  options = Object.assign({}, defaultOptions, options);
  
  // 获取请求唯一标识
  const requestId = getRequestId(options);
  
  // 如果存在相同请求，则返回已存在的Promise
  if (requestQueue.has(requestId)) {
    return requestQueue.get(requestId);
  }
  
  // 显示加载提示
  if (options.showLoading) {
    uni.showLoading({ title: '加载中...' });
  }
  
  // 获取token
  const token = uni.getStorageSync('token') || '';
  
  // 创建Promise
  const requestTask = new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      data: options.data,
      method: options.method,
      header: {
        'content-type': options.contentType,
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        // 默认约定服务端返回格式：{ code: 0, data: {}, message: '' }
        if (res.statusCode === 200) {
          // 业务状态码处理
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else if (res.data.code === 401) {
            // 登录失效处理
            uni.removeStorageSync('token');
            uni.showToast({ title: '请先登录', icon: 'none' });
            
            // 跳转到登录页
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/login/login' });
            }, 1500);
            
            reject(res.data);
          } else {
            // 其他业务错误
            if (!options.hideError) {
              uni.showToast({
                title: res.data.message || '请求失败',
                icon: 'none'
              });
            }
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // HTTP 401状态码处理
          uni.removeStorageSync('token');
          uni.showToast({ title: '请先登录', icon: 'none' });
          
          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' });
          }, 1500);
          
          reject(res);
        } else {
          // 其他HTTP错误状态码
          if (!options.hideError) {
            uni.showToast({
              title: res.data.message || `请求失败(${res.statusCode})`,
              icon: 'none'
            });
          }
          reject(res);
        }
      },
      fail: (err) => {
        if (!options.hideError) {
          uni.showToast({
            title: '网络异常，请检查网络设置',
            icon: 'none'
          });
        }
        reject(err);
      },
      complete: () => {
        // 隐藏加载提示
        if (options.showLoading) {
          uni.hideLoading();
        }
        
        // 请求完成后，从队列中移除
        requestQueue.delete(requestId);
      }
    });
  });
  
  // 将Promise添加到队列
  requestQueue.set(requestId, requestTask);
  
  return requestTask;
}

/**
 * @description GET请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
export function get(url, data = {}, options = {}) {
  return request({
    url,
    data,
    method: 'GET',
    ...options
  });
}

/**
 * @description POST请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
export function post(url, data = {}, options = {}) {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  });
}

/**
 * @description PUT请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
export function put(url, data = {}, options = {}) {
  return request({
    url,
    data,
    method: 'PUT',
    ...options
  });
}

/**
 * @description DELETE请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
export function del(url, data = {}, options = {}) {
  return request({
    url,
    data,
    method: 'DELETE',
    ...options
  });
} 