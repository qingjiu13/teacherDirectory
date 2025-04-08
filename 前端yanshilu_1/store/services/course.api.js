/**
 * @description 课程相关API服务
 */
import { API_BASE_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/courses`;

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
 * @description 获取课程列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 课程列表
 */
export const getCourses = (params = {}) => {
  return request({
    url: `${API_PREFIX}`,
    data: params
  });
};

/**
 * @description 获取课程详情
 * @param {string} courseId - 课程ID
 * @returns {Promise<Object>} 课程详情
 */
export const getCourseDetails = (courseId) => {
  return request({
    url: `${API_PREFIX}/${courseId}`
  });
};

/**
 * @description 获取课程章节
 * @param {string} courseId - 课程ID
 * @returns {Promise<Object>} 课程章节列表
 */
export const getCourseChapters = (courseId) => {
  return request({
    url: `${API_PREFIX}/${courseId}/chapters`
  });
};

/**
 * @description 获取课程评价
 * @param {string} courseId - 课程ID
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 课程评价列表
 */
export const getCourseReviews = (courseId, params = {}) => {
  return request({
    url: `${API_PREFIX}/${courseId}/reviews`,
    data: params
  });
};

/**
 * @description 提交课程评价
 * @param {string} courseId - 课程ID
 * @param {Object} reviewData - 评价数据
 * @returns {Promise<Object>} 操作结果
 */
export const submitCourseReview = (courseId, reviewData) => {
  return request({
    url: `${API_PREFIX}/${courseId}/reviews`,
    method: 'POST',
    data: reviewData
  });
}; 