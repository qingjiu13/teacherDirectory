/**
 * @description 用户登录相关API函数
 * @module store/user/APIroute/Login_api
 */

import { 
  LOGIN_WETHER_SIGN_IN_URL, 
  LOGIN_URL, 
  LOGIN_SIGN_IN_URL 
} from '../../API.js';

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
  
  // 构建请求
  const requestTask = uni.request({
    url: LOGIN_WETHER_SIGN_IN_URL,
    method: 'POST',
    data: { code },
    header: {
      'content-type': 'application/json'
    }
  });
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      // 状态码检查
      if (response.statusCode === 200) {
        if (typeof success === 'function') {
          success(response.data);
        }
      } else {
        if (typeof fail === 'function') {
          fail({
            errMsg: '接口请求失败',
            errCode: response.statusCode,
            data: response.data
          });
        }
      }
    }).catch(error => {
      if (typeof fail === 'function') {
        fail({ errMsg: '网络请求失败', error });
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
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw {
        errMsg: '接口请求失败',
        errCode: response.statusCode,
        data: response.data
      };
    }
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
  const requestTask = uni.request({
    url: LOGIN_URL,
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      if (response.statusCode === 200) {
        if (typeof success === 'function') {
          success(response.data);
        }
      } else {
        // 401表示token无效或过期
        if (response.statusCode === 401) {
          // 清除本地无效token
          uni.removeStorageSync('token');
        }
        
        if (typeof fail === 'function') {
          fail({
            errMsg: '登录状态验证失败',
            errCode: response.statusCode,
            data: response.data
          });
        }
      }
    }).catch(error => {
      if (typeof fail === 'function') {
        fail({ errMsg: '网络请求失败', error });
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
    if (response.statusCode === 200) {
      return response.data;
    } else {
      // 401表示token无效或过期
      if (response.statusCode === 401) {
        // 清除本地无效token
        uni.removeStorageSync('token');
      }
      
      throw {
        errMsg: '登录状态验证失败',
        errCode: response.statusCode,
        data: response.data
      };
    }
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
  
  // 发送注册请求
  const requestTask = uni.request({
    url: LOGIN_SIGN_IN_URL,
    method: 'POST',
    data: requestData,
    header: {
      'content-type': 'application/json'
    }
  });
  
  // 如果传入了回调函数，使用回调处理结果
  if (typeof success === 'function' || typeof fail === 'function' || typeof complete === 'function') {
    requestTask.then(response => {
      if (response.statusCode === 200) {
        // 注册成功，保存token
        if (response.data && response.data.token) {
          uni.setStorageSync('token', response.data.token);
        }
        
        if (typeof success === 'function') {
          success(response.data);
        }
      } else {
        if (typeof fail === 'function') {
          fail({
            errMsg: '注册失败',
            errCode: response.statusCode,
            data: response.data
          });
        }
      }
    }).catch(error => {
      if (typeof fail === 'function') {
        fail({ errMsg: '网络请求失败', error });
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
    if (response.statusCode === 200) {
      // 注册成功，保存token
      if (response.data && response.data.token) {
        uni.setStorageSync('token', response.data.token);
      }
      
      return response.data;
    } else {
      throw {
        errMsg: '注册失败',
        errCode: response.statusCode,
        data: response.data
      };
    }
  });
};
