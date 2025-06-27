/**
 * 学校专业请求模块的API接口
 * @module store/user/APIroute/schoolMajorRequest_api
 */

import { apiRequest } from '../../JWT.js';
import { useGlobalStore } from '@/store/global.js';

/**
 * 获取API前缀
 * @returns {string} API基础URL
 */
const getApiPrefix = () => {
  const globalStore = useGlobalStore()
  return globalStore.apiBaseUrl
}

// ========== 本科生学校相关API ==========

/**
 * 获取本科生学校列表
 * @param {Object} params - 请求参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.pageNum=1] - 当前页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise} 返回本科生学校列表结果
 */
export const getUndergraduateSchoolList = (params = {}) => {
  const requestParams = {
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 20,
    schoolType: 2 // 本科生学校类型
  };
  
  // 如果有搜索关键词，添加到参数中
  if (params.keyword && params.keyword.trim()) {
    requestParams.keyword = params.keyword.trim();
  }
  
  return apiRequest(`${getApiPrefix()}/school/list`, 'POST', requestParams, {
    requireAuth: false // 根据实际情况决定是否需要认证
  }).then(response => {
    // 处理API返回的数据格式
    if (response && response.data.code === 200) {
      return {
        success: true,
        data: {
          total: response.data.total,
          rows: response.data.rows || []
        }
      };
    } else {
      throw new Error(response?.msg || '获取本科生学校列表失败');
    }
  });
};

// ========== 本科生专业相关API ==========

/**
 * 获取本科生专业列表（不依赖学校ID）
 * @param {Object} params - 请求参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.pageNum=1] - 当前页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise} 返回本科生专业列表结果
 */
export const getUndergraduateMajorList = (params = {}) => {
  const requestParams = {
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 20
  };
  
  // 如果有搜索关键词，添加到参数中
  if (params.keyword && params.keyword.trim()) {
    requestParams.keyword = params.keyword.trim();
  }
  
  return apiRequest(`${getApiPrefix()}/undergraduateProfessional/list`, 'POST', requestParams, {
    requireAuth: false
  }).then(response => {
    // 处理API返回的数据格式
    if (response && response.data.code === 200) {
      return {
        success: true,
        data: {
          total: response.data.total,
          rows: response.data.rows || []
        }
      };
    } else {
      throw new Error(response?.msg || '获取本科生专业列表失败');
    }
  });
};

// ========== 研究生学校相关API ==========

/**
 * 获取研究生学校列表
 * @param {Object} params - 请求参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.pageNum=1] - 当前页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise} 返回研究生学校列表结果
 */
export const getGraduateSchoolList = (params = {}) => {
  const requestParams = {
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 20,
    schoolType: 1 // 研究生学校类型
  };
  
  // 如果有搜索关键词，添加到参数中
  if (params.keyword && params.keyword.trim()) {
    requestParams.keyword = params.keyword.trim();
  }
  
  return apiRequest(`${getApiPrefix()}/school/list`, 'POST', requestParams, {
    requireAuth: false // 根据实际情况决定是否需要认证
  }).then(response => {
    // 处理API返回的数据格式
    if (response && response.data.code === 200) {
      return {
        success: true,
        data: {
          total: response.data.total,
          rows: response.data.rows || []
        }
      };
    } else {
      throw new Error(response?.msg || '获取研究生学校列表失败');
    }
  });
};

// ========== 研究生专业相关API ==========

/**
 * 根据学校ID获取研究生专业列表
 * @param {Object} params - 请求参数
 * @param {number} params.schoolId - 学校ID
 * @param {string} [params.keyword] - 搜索关键词
 * @param {number} [params.pageNum=1] - 当前页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise} 返回研究生专业列表结果
 */
export const getGraduateMajorList = (params) => {
  if (!params.schoolId) {
    return Promise.reject(new Error('schoolId 参数不能为空'));
  }
  
  const requestParams = {
    schoolId: params.schoolId,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 20
  };
  
  // 如果有搜索关键词，添加到参数中
  if (params.keyword && params.keyword.trim()) {
    requestParams.keyword = params.keyword.trim();
  }
  
  return apiRequest(`${getApiPrefix()}/professional/list`, 'POST', requestParams, {
    requireAuth: false // 根据实际情况决定是否需要认证
  }).then(response => {
    // 处理API返回的数据格式
    if (response && response.data.code === 200) {
      return {
        success: true,
        data: {
          total: response.data.total,
          rows: response.data.rows || []
        }
      };
    } else {
      throw new Error(response?.msg || '获取研究生专业列表失败');
    }
  });
};

