/**
 * 匹配模块的API接口
 * @module store/user/APIroute/match_api
 */

import { apiRequest } from '../../JWT.js';
import { useGlobalStore } from '../../../global.js';
// API 基础URL
const API_BASE_URL = 'http://x62e45a8.natappfree.cc';
const getApiPrefix = () => {
  const globalStore = useGlobalStore()
  return globalStore.apiBaseUrl
}






/**
 * 获取非专业课选项列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.type - 非专业课类型 ('math', 'english', 'politics', 'other')
 * @returns {Promise} 返回非专业课选项列表
 */
export const getNonProfessionalOptions = (params) => {
  // return apiRequest(`${API_BASE_URL}/nonprofessional/options`, 'POST', {
  //   type: params.type
  // });
};

/**
 * 获取排序方式选项列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @returns {Promise} 返回排序方式选项列表
 */
export const getSortModeOptions = (params) => {
  // return apiRequest(`${API_BASE_URL}/sort/options`, 'POST', {
  //   userId: params.userId
  // });
};

/**
 * 获取老师详细信息
 * @param {Object} params - 请求参数
 * @param {number} params.teacherId - 老师ID（数字类型）
 * @returns {Promise} 返回老师的详细信息
 */
export const getTeacherDetail = (params) => {
  console.log('=== getTeacherDetail API 被调用 ===');
  console.log('接收到的完整参数:', JSON.stringify(params, null, 2));
  
  // 确保teacherId是数字类型
  const teacherId = Number(params.teacherId);
  
  if (!teacherId || isNaN(teacherId)) {
    console.error('teacherId 无效:', params.teacherId);
    return Promise.reject(new Error('teacherId 必须是有效的数字'));
  }
  
  const requestParams = {
    teacherId: teacherId
  };
  
  console.log('准备发送的请求参数:', JSON.stringify(requestParams, null, 2));
  console.log('API URL:', `${getApiPrefix()}/yanshilu/teacher/match/detail`);
  
  return apiRequest(`${getApiPrefix()}/yanshilu/teacher/match/detail`, 'POST', requestParams);
};


