/**
 * 匹配模块的API接口
 * @module store/user/APIroute/match_api
 */

import { apiRequest } from '../../JWT.js';

// API 基础URL
const API_BASE_URL = 'http://b968976e.natappfree.cc/yanshilu';

/**
 * 获取匹配的老师列表
 * @param {Object} params - 请求参数
 * @param {number} params.school - 学校ID
 * @param {number} params.professional - 专业课ID
 * @param {Object} params.nonProfessionalList - 非专业课列表
 * @param {number} params.nonProfessionalList.mathId - 数学ID
 * @param {number} params.nonProfessionalList.englishId - 英语ID
 * @param {number} params.nonProfessionalList.politicsId - 政治ID
 * @param {number} params.nonProfessionalList.otherId - 其他ID
 * @param {number} params.sortMode - 排序方式ID
 * @param {number} params.pageNum - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.searchKey - 搜索关键词
 * @returns {Promise} 返回匹配的老师列表
 */
export const getMatchTeacherList = (params) => {
  return apiRequest(`${API_BASE_URL}/teacher/match`, 'POST', {
    "school": params.school,
    "professional": params.professional,
    "nonProfessionalList": params.nonProfessionalList,
    "sortMode": params.sortMode,
    "pageNum": params.pageNum,
    "pageSize": params.pageSize,
    "searchKey": params.searchKey,
  });
};





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
 * @param {string} params.userId - 用户ID
 * @param {string} params.teacherId - 老师ID
 * @returns {Promise} 返回老师的详细信息
 */
export const getTeacherDetail = (params) => {
  console.log('=== getTeacherDetail API 被调用 ===');
  console.log('接收到的完整参数:', JSON.stringify(params, null, 2));
  
  // 确保teacherId是正确的类型
  let teacherId = params.teacherId;
  
  // 如果是字符串数字，转换为数字
  if (typeof teacherId === 'string' && !isNaN(teacherId)) {
    teacherId = parseInt(teacherId);
  }
  
  const requestParams = {
    teacherId: teacherId
  };
  
  console.log('准备发送的请求参数:', JSON.stringify(requestParams, null, 2));
  console.log('API URL:', `${API_BASE_URL}/teacher/match/detail`);
  
  return apiRequest(`${API_BASE_URL}/teacher/match/detail`, 'POST', requestParams);
};


