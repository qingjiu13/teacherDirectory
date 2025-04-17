/**
 * @description 公共API服务
 */
import { API_BASE_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/common`;

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
 * @description 获取系统通知
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 通知列表
 */
export const getNotifications = (params = {}) => {
  return request({
    url: `${API_PREFIX}/notifications`,
    data: params
  });
};

/**
 * @description 标记通知为已读
 * @param {string} notificationId - 通知ID
 * @returns {Promise<Object>} 操作结果
 */
export const markNotificationAsRead = (notificationId) => {
  return request({
    url: `${API_PREFIX}/notifications/${notificationId}/read`,
    method: 'PUT'
  });
};

/**
 * @description 获取消息
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 消息列表
 */
export const getMessages = (params = {}) => {
  return request({
    url: `${API_PREFIX}/messages`,
    data: params
  });
};

/**
 * @description 发送消息
 * @param {Object} messageData - 消息数据
 * @returns {Promise<Object>} 操作结果
 */
export const sendMessage = (messageData) => {
  return request({
    url: `${API_PREFIX}/messages`,
    method: 'POST',
    data: messageData
  });
};

/**
 * @description 获取用户设置
 * @returns {Promise<Object>} 用户设置
 */
export const getUserSettings = () => {
  return request({
    url: `${API_PREFIX}/settings`
  });
};

/**
 * @description 更新用户设置
 * @param {Object} settings - 设置数据
 * @returns {Promise<Object>} 操作结果
 */
export const updateUserSettings = (settings) => {
  return request({
    url: `${API_PREFIX}/settings`,
    method: 'PUT',
    data: settings
  });
}; 