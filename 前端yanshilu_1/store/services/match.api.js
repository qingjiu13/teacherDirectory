/**
 * @description 匹配功能API服务
 * 提供老师匹配、筛选和沟通相关功能
 */
import { API_BASE_URL } from '../../config';

const API_PREFIX = `${API_BASE_URL}/api/match`;

// 错误码和消息映射
const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查您的网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后再试',
  SERVER_ERROR: '服务器错误，请稍后再试',
  AUTH_ERROR: '身份验证失败，请重新登录',
  INVALID_PARAM: '参数错误',
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  UNKNOWN_ERROR: '未知错误，请稍后再试'
};

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
 * @description 处理响应错误
 * @param {Object} error - 错误对象
 * @returns {Object} 格式化的错误对象
 */
const handleError = (error) => {
  let errorMessage = '';
  
  // 优先使用后端返回的错误消息
  if (error.data && error.data.message) {
    errorMessage = error.data.message;
  } else if (error.data && error.data.error && error.data.error.message) {
    errorMessage = error.data.error.message;
  } else if (error.statusCode) {
    // 如果没有具体错误消息，根据HTTP状态码判断
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = '请求的资源不存在';
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else {
    // 网络错误或其他错误
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return {
    message: errorMessage,
    originalError: error,
    statusCode: error.statusCode || 0
  };
};

/**
 * @description 获取推荐老师列表
 * @param {Object} params - 查询参数
 * @param {String} params.role - 当前用户角色，'teacher'或'student'
 * @param {Number} params.page - 页码
 * @param {Number} params.limit - 每页数量
 * @returns {Promise<Object>} 返回老师列表和分页信息
 */
export const getRecommendedTeachers = async (params = {}) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/recommended`,
      method: 'GET',
      data: params
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取推荐老师列表失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 搜索老师
 * @param {Object} params - 搜索参数
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.school - 学校筛选
 * @param {String} params.major - 专业筛选
 * @param {String} params.sortBy - 排序方式
 * @param {Number} params.page - 页码
 * @param {Number} params.limit - 每页数量
 * @returns {Promise<Object>} 返回老师列表和分页信息
 */
export const searchTeachers = async (params = {}) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/search`,
      method: 'GET',
      data: params
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('搜索老师失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 获取学校列表
 * @param {String} keyword - 搜索关键词
 * @returns {Promise<Array>} 返回学校列表
 */
export const getSchoolList = async (keyword = '') => {
  try {
    const response = await request({
      url: `${API_PREFIX}/schools`,
      method: 'GET',
      data: { keyword }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取学校列表失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 获取专业列表
 * @param {String} school - 学校名称（可选，传入时获取该学校的专业列表）
 * @returns {Promise<Array>} 返回专业列表
 */
export const getMajorList = async (school = '') => {
  try {
    const response = await request({
      url: `${API_PREFIX}/majors`,
      method: 'GET',
      data: { school }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取专业列表失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 申请与老师沟通
 * @param {Number} teacherId - 老师ID
 * @param {String} message - 初始消息（可选）
 * @returns {Promise<Object>} 返回申请结果
 */
export const applyForCommunication = async (teacherId, message = '') => {
  try {
    const response = await request({
      url: `${API_PREFIX}/communicate`,
      method: 'POST',
      data: { teacherId, message }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('申请与老师沟通失败:', error);
    return { success: false, error: handleError(error) };
  }
};

/**
 * @description 获取老师详细信息
 * @param {Number} teacherId - 老师ID
 * @returns {Promise<Object>} 返回老师详细信息
 */
export const getTeacherDetail = async (teacherId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/${teacherId}`,
      method: 'GET'
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取老师详细信息失败:', error);
    return { success: false, error: handleError(error) };
  }
}; 