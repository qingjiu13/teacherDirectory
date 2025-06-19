/**
 * 用户基本信息相关API
 * @module store/user/APIroute/baseInfo_api
 */

import { USER_GET_USER_INFO_URL, USER_UPDATE_USER_INFO_URL } from '../../API.js';
import { apiRequest } from '../../JWT.js';

/**
 * 获取用户基本信息
 * @async
 * @function getUserInfo
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 包含用户所有信息的对象
 * @throws {Error} 当请求失败时抛出错误
 */
export const getUserInfo = async (userId) => {
  try {
    const response = await apiRequest(USER_GET_USER_INFO_URL, 'POST', { id: userId });
    return response.data;
  } catch (error) {
    console.error('获取用户信息出错:', error);
    throw new Error(error.error?.message || '获取用户信息失败');
  }
};

/**
 * 更新用户基本信息
 * @async
 * @function updateUserInfo
 * @param {string} userId - 用户ID
 * @param {Object} userData - 用户更新的信息
 * @param {string} [userData.avatar] - 用户头像
 * @param {string} [userData.name] - 用户昵称
 * @param {string} [userData.selfIntroduction] - 个人介绍
 * @param {string} [userData.gender] - 性别
 * @param {string} [userData.phoneNumber] - 手机号
 * @param {string} [userData.wechatNumber] - 微信号
 * @param {string} [userData.password] - 密码
 * @returns {Promise<Object>} 包含更新结果的对象
 * @throws {Error} 当请求失败时抛出错误
 */
export const updateUserInfo = async (userId, userData) => {
  try {
    // 构建请求数据，确保包含用户ID
    const requestData = {
      id: userId,
      ...userData
    };

    const response = await apiRequest(USER_UPDATE_USER_INFO_URL, 'POST', requestData);
    return response.data;
  } catch (error) {
    console.error('更新用户信息出错:', error);
    throw new Error(error.error?.message || '更新用户信息失败');
  }
};
