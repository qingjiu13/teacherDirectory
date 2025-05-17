/**
 * 匹配模块的API接口
 * @module store/user/APIroute/match_api
 */

import { MATCH_API_BASE_URL, USER_TEACHER_DETAIL_URL } from '../../API.js';

/**
 * 获取匹配的老师列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string|Array} params.schoolList - 学校列表
 * @param {string|Array} params.professionalList - 专业课列表
 * @param {Object} params.nonProfessionalList - 非专业课列表
 * @param {string} params.sortMode - 排序方式
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回匹配的老师列表
 */
export const getMatchTeacherList = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: MATCH_API_BASE_URL,
      method: 'POST',
      data: {
        userId: params.userId,
        schoolList: params.schoolList,
        professionalList: params.professionalList,
        nonProfessionalList: params.nonProfessionalList,
        sortMode: params.sortMode,
        currentPage: params.currentPage,
        pageSize: params.pageSize
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 获取老师详细信息
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.teacherId - 老师ID
 * @returns {Promise} 返回老师的详细信息
 */
export const getTeacherDetail = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: USER_TEACHER_DETAIL_URL,
      method: 'POST',
      data: {
        userId: params.userId,
        teacherId: params.teacherId
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};


