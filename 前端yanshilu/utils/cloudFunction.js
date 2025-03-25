/**
 * @description 云函数调用工具
 * @module cloudFunction
 */

import { CLOUD_FUNCTION_MODE, CUSTOM_API_URL } from '../config.js';

/**
 * @description 调用云函数
 * @param {Object} options - 调用选项
 * @param {String} options.name - 云函数名称
 * @param {Object} options.data - 请求数据
 * @param {Number} options.timeout - 超时时间
 * @returns {Promise<Object>} 云函数执行结果
 */
export default function callCloudFunction(options) {
  const { name, data, timeout = 5000 } = options;
  
  // 检查参数
  if (!name) {
    return Promise.reject(new Error('云函数名称不能为空'));
  }
  
  // 根据模式执行不同的调用方式
  if (CLOUD_FUNCTION_MODE === 'unicloud') {
    // 使用原生uniCloud调用
    return uniCloud.callFunction({
      name,
      data,
      timeout
    });
  } else if (CLOUD_FUNCTION_MODE === 'custom') {
    // 使用自定义API调用
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${CUSTOM_API_URL}/call/${name}`,
        method: 'POST',
        data: { data },
        timeout,
        header: {
          'Content-Type': 'application/json',
          'X-Platform': uni.getSystemInfoSync().platform,
          'X-AppId': process.env.UNI_APP_ID || '',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 模拟uniCloud.callFunction的返回格式
            resolve({
              result: res.data,
              requestId: res.header['x-request-id'] || '',
              success: true,
              errCode: 0
            });
          } else {
            reject(new Error(`HTTP错误: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          reject(new Error(`请求失败: ${err.errMsg}`));
        }
      });
    });
  } else {
    return Promise.reject(new Error(`不支持的云函数调用模式: ${CLOUD_FUNCTION_MODE}`));
  }
} 