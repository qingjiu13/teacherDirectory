/**
 * @description 用户登录相关API函数
 * @module store/user/APIroute/Login_api
 */

import { 
  LOGIN_WETHER_SIGN_IN_URL, 
  LOGIN_URL, 
  LOGIN_SIGN_IN_URL 
} from '../../API.js';
import { apiRequest } from '../../JWT.js';

/**
 * @description 判断用户是否注册过
 * @param {Object} options - 请求选项
 * @param {string} options.code - 微信登录返回的临时code
 * @param {Function} options.success - 成功回调
 * @param {Function} options.fail - 失败回调
 * @param {Function} options.complete - 完成回调
 * @returns {Promise} - 如果不传回调函数，则返回Promise
 */
export const checkUserRegistration = (options = {}) => {
  const { code, success, fail, complete } = options;
  
  // 参数验证
  if (!code) {
    const error = '缺少必要参数：code';
    if (typeof fail === 'function') {
      fail({ errMsg: error });
    }
    if (typeof complete === 'function') {
      complete({ errMsg: error });
    }
    return Promise.reject(new Error(error));
  }
  
  // 构建请求，不需要认证
  const requestTask = apiRequest(LOGIN_WETHER_SIGN_IN_URL, 'POST', { code }, { requireAuth: false });
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      if (typeof success === 'function') {
        success(response.data);
      }
    }).catch(error => {
      if (typeof fail === 'function') {
        fail({
          errMsg: error.error?.message || '网络请求失败',
          errCode: error.error?.statusCode,
          data: error.error
        });
      }
    }).finally(() => {
      if (typeof complete === 'function') {
        complete();
      }
    });
    
    return requestTask;
  }
  
  // 如果没有回调函数，返回处理后的Promise
  return requestTask.then(response => {
    return response.data;
  }).catch(error => {
    throw {
      errMsg: error.error?.message || '网络请求失败',
      errCode: error.error?.statusCode,
      data: error.error
    };
  });
};

/**
 * @description 验证用户登录状态
 * @param {Object} options - 请求选项
 * @param {Function} options.success - 成功回调
 * @param {Function} options.fail - 失败回调
 * @param {Function} options.complete - 完成回调
 * @returns {Promise} - 如果不传回调函数，则返回Promise
 */
export const verifyLoginStatus = (options = {}) => {
  const { success, fail, complete } = options;
  
  // 检查本地是否存在token
  const token = uni.getStorageSync('token');
  if (!token) {
    const error = { errMsg: '未登录，本地不存在token' };
    if (typeof fail === 'function') {
      fail(error);
    }
    if (typeof complete === 'function') {
      complete();
    }
    return Promise.reject(error);
  }
  
  // 构建请求，携带token到后端验证
  const requestTask = apiRequest(LOGIN_URL, 'POST', {});
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      if (typeof success === 'function') {
        success(response.data);
      }
    }).catch(error => {
      // 401表示token无效或过期
      if (error.error?.statusCode === 401) {
        // 清除本地无效token
        uni.removeStorageSync('token');
      }
      
      if (typeof fail === 'function') {
        fail({
          errMsg: error.error?.message || '登录状态验证失败',
          errCode: error.error?.statusCode,
          data: error.error
        });
      }
    }).finally(() => {
      if (typeof complete === 'function') {
        complete();
      }
    });
    
    return requestTask;
  }
  
  // 如果没有回调函数，返回处理后的Promise
  return requestTask.then(response => {
    return response.data;
  }).catch(error => {
    // 401表示token无效或过期
    if (error.error?.statusCode === 401) {
      // 清除本地无效token
      uni.removeStorageSync('token');
    }
    
    throw {
      errMsg: error.error?.message || '登录状态验证失败',
      errCode: error.error?.statusCode,
      data: error.error
    };
  });
};

/**
 * @description 新用户注册
 * @param {Object} options - 请求选项
 * @param {string} options.code - 微信登录临时code
 * @param {string} [options.encryptedData] - 微信加密数据
 * @param {string} [options.iv] - 加密算法的初始向量
 * @param {string} [options.avatarUrl] - 用户头像URL
 * @param {string} [options.nickName] - 用户昵称
 * @param {string} [options.gender] - 用户性别
 * @param {string} [options.school] - 用户学校
 * @param {string} [options.major] - 用户专业
 * @param {string} [options.targetSchool] - 目标学校
 * @param {string} [options.targetMajor] - 目标专业
 * @param {Function} options.success - 成功回调
 * @param {Function} options.fail - 失败回调
 * @param {Function} options.complete - 完成回调
 * @returns {Promise} - 如果不传回调函数，则返回Promise
 */
export const registerUser = (options = {}) => {
  const { 
    code, 
    encryptedData, 
    iv, 
    avatarUrl, 
    nickName, 
    gender, 
    school, 
    major, 
    targetSchool, 
    targetMajor,
    success, 
    fail, 
    complete 
  } = options;
  
  // 参数验证
  if (!code) {
    const error = '缺少必要参数：code';
    if (typeof fail === 'function') {
      fail({ errMsg: error });
    }
    if (typeof complete === 'function') {
      complete();
    }
    return Promise.reject(new Error(error));
  }
  
  // 构建请求数据
  const requestData = {
    code,
    // 只添加有值的字段
    ...(encryptedData && { encryptedData }),
    ...(iv && { iv }),
    ...(avatarUrl && { avatarUrl }),
    ...(nickName && { nickName }),
    ...(gender && { gender }),
    ...(school && { school }),
    ...(major && { major }),
    ...(targetSchool && { targetSchool }),
    ...(targetMajor && { targetMajor })
  };
  
  // 发送注册请求，不需要认证
  const requestTask = apiRequest(LOGIN_SIGN_IN_URL, 'POST', requestData, { requireAuth: false });
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      // 注册成功，保存token
      if (response.data && response.data.token) {
        uni.setStorageSync('token', response.data.token);
      }
      
      if (typeof success === 'function') {
        success(response.data);
      }
    }).catch(error => {
      if (typeof fail === 'function') {
        fail({
          errMsg: error.error?.message || '注册失败',
          errCode: error.error?.statusCode,
          data: error.error
        });
      }
    }).finally(() => {
      if (typeof complete === 'function') {
        complete();
      }
    });
    
    return requestTask;
  }
  
  // 如果没有回调函数，返回处理后的Promise
  return requestTask.then(response => {
    // 注册成功，保存token
    if (response.data && response.data.token) {
      uni.setStorageSync('token', response.data.token);
    }
    
    return response.data;
  }).catch(error => {
    throw {
      errMsg: error.error?.message || '注册失败',
      errCode: error.error?.statusCode,
      data: error.error
    };
  });
};

// ===================== 学校和专业搜索相关API =====================

/**
 * @description 搜索本科学校列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 返回学校搜索结果
 */
export const searchUndergraduateSchools = async (params) => {
  try {
    const response = await apiRequest(`${LOGIN_URL}/undergraduate/school/search`, 'POST', {
      userId: params.userId,
      keyword: params.keyword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * @description 搜索本科专业列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 返回专业搜索结果
 */
export const searchUndergraduateMajors = async (params) => {
  try {
    const response = await apiRequest(`${LOGIN_URL}/undergraduate/major/search`, 'POST', {
      userId: params.userId,
      keyword: params.keyword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * @description 搜索研究生学校列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回学校搜索结果
 */
export const searchGraduateSchools = async (params) => {
  try {
    const response = await apiRequest(`${LOGIN_URL}/graduate/school/search`, 'POST', {
      userId: params.userId,
      keyword: params.keyword,
      currentPage: params.currentPage,
      pageSize: params.pageSize
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * @description 根据学校ID搜索研究生专业列表
 * @param {Object} params - 请求参数
 * @param {string} params.userId - 用户ID
 * @param {number} params.schoolId - 学校ID
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 返回专业搜索结果
 */
export const searchGraduateMajors = async (params) => {
  try {
    const response = await apiRequest(`${LOGIN_URL}/graduate/major/search`, 'POST', {
      userId: params.userId,
      schoolId: params.schoolId,
      keyword: params.keyword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
