/**
 * 匹配模块的API接口
 * @module store/user/APIroute/match_api
 */

import { MATCH_API_BASE_URL, USER_TEACHER_DETAIL_URL } from '../../API.js';

/**
 * 获取匹配的老师列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {number} params.schoolId - 学校ID
 * @param {number} params.professionalId - 专业课ID
 * @param {Object} params.nonProfessionalList - 非专业课列表
 * @param {number} params.nonProfessionalList.mathId - 数学ID
 * @param {number} params.nonProfessionalList.englishId - 英语ID
 * @param {number} params.nonProfessionalList.politicsId - 政治ID
 * @param {number} params.nonProfessionalList.otherId - 其他ID
 * @param {number} params.sortModeId - 排序方式ID
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
        schoolId: params.schoolId,
        professionalId: params.professionalId,
        nonProfessionalList: params.nonProfessionalList,
        sortModeId: params.sortModeId,
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
 * 搜索学校列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回学校搜索结果
 */
export const searchSchoolList = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${MATCH_API_BASE_URL}/school/search`,
      method: 'POST',
      data: {
        userId: params.userId,
        keyword: params.keyword,
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
 * 根据学校ID搜索专业列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {number} params.schoolId - 学校ID
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 返回专业搜索结果
 */
export const searchMajorList = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${MATCH_API_BASE_URL}/major/search`,
      method: 'POST',
      data: {
        userId: params.userId,
        schoolId: params.schoolId,
        keyword: params.keyword
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
 * 获取非专业课选项列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.type - 非专业课类型 ('math', 'english', 'politics', 'other')
 * @returns {Promise} 返回非专业课选项列表
 */
export const getNonProfessionalOptions = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${MATCH_API_BASE_URL}/nonprofessional/options`,
      method: 'POST',
      data: {
        userId: params.userId,
        type: params.type
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
 * 获取排序方式选项列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @returns {Promise} 返回排序方式选项列表
 */
export const getSortModeOptions = (params) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${MATCH_API_BASE_URL}/sort/options`,
      method: 'POST',
      data: {
        userId: params.userId
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


