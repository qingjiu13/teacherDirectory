/**
 * @description 学生相关API服务
 */
import { API_BASE_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/student`;

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
 * @description 获取学生个人信息
 * @returns {Promise<Object>} 学生信息
 */
export const getStudentProfile = () => {
  return request({
    url: `${API_PREFIX}/profile`
  });
};

/**
 * @description 更新学生个人信息
 * @param {Object} profileData - 个人信息数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateStudentProfile = (profileData) => {
  return request({
    url: `${API_PREFIX}/profile`,
    method: 'PUT',
    data: profileData
  });
};

/**
 * @description 获取学生选课列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 课程列表
 */
export const getEnrolledCourses = (params = {}) => {
  return request({
    url: `${API_PREFIX}/courses/enrolled`,
    data: params
  });
};

/**
 * @description 获取学生学习进度
 * @param {string} courseId - 课程ID
 * @returns {Promise<Object>} 学习进度
 */
export const getLearningProgress = (courseId) => {
  return request({
    url: `${API_PREFIX}/courses/${courseId}/progress`
  });
}; 