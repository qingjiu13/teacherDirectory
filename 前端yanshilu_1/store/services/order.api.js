/**
 * @description 订单相关API服务
 */
import { API_BASE_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/orders`;

/**
 * @description 使用uni.request封装网络请求
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      data: options.data,
      method: options.method || 'GET',
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * @description 创建订单
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} 创建结果
 */
export const createOrder = (orderData) => {
  return request({
    url: `${API_PREFIX}`,
    method: 'POST',
    data: orderData
  });
};

/**
 * @description 获取订单列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 订单列表
 */
export const getOrders = (params = {}) => {
  return request({
    url: `${API_PREFIX}`,
    data: params
  });
};

/**
 * @description 获取订单详情
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 订单详情
 */
export const getOrderDetails = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}`
  });
};

/**
 * @description 取消订单
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 操作结果
 */
export const cancelOrder = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}/cancel`,
    method: 'POST'
  });
};

/**
 * @description 支付订单
 * @param {string} orderId - 订单ID
 * @param {Object} paymentData - 支付数据
 * @returns {Promise<Object>} 支付结果
 */
export const payOrder = (orderId, paymentData) => {
  return request({
    url: `${API_PREFIX}/${orderId}/pay`,
    method: 'POST',
    data: paymentData
  });
};

/**
 * @description 获取支付状态
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 支付状态
 */
export const getPaymentStatus = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}/payment-status`
  });
}; 