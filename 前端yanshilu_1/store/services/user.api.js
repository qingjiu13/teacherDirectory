/**
 * @description 用户通用API服务
 */
import { API_BASE_URL } from '../../config';
import { mockDelay, mockApiResponse, mockStudentData, mockTeacherData, getMockUserProfile } from './mock-data';

const API_PREFIX = `${API_BASE_URL}/user`;

/**
 * @description 检查是否需要使用模拟数据
 * @param {Object} options - 请求选项
 * @returns {Boolean} 是否使用模拟数据
 */
const shouldUseMockData = (options) => {
  // 优先使用明确指定的设置
  if (options && options.forceMock !== undefined) {
    return options.forceMock;
  }
  
  // 其次检查本地存储
  if (uni.getStorageSync('use_mock_api') === 'true') {
    return true;
  }
  
  // 最后检查环境
  return process.env.NODE_ENV === 'development';
};

/**
 * @description 使用uni.request封装网络请求
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    if (shouldUseMockData(options)) {
      setTimeout(() => {
        resolve(options.mockData || {});
      }, options.mockDelay || 300);
      return;
    }
    
    uni.request({
      url: options.url,
      data: options.data,
      method: options.method || 'GET',
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        if (shouldUseMockData(options) && options.useMockOnFail) {
          setTimeout(() => {
            resolve(options.mockData || {});
          }, options.mockDelay || 300);
          return;
        }
        reject(err);
      }
    });
  });
};

/**
 * @description 获取用户个人资料
 * @param {String} role - 用户角色(teacher/student)
 * @returns {Promise<Object>} 用户资料
 */
export const getUserProfile = async (role) => {
  try {
    const userData = getMockUserProfile(role);
    
    // 确保老师数据中的第一个标签是认证标签
    if (role === 'teacher' && userData && userData.tags && userData.tags.length > 0) {
      if (!userData.tags[0].includes('认证') && userData.tags[0] !== '已认证') {
        userData.tags.unshift('已认证');
      }
      userData.tag = userData.tags[0];
    }
    
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: 'GET',
      data: { role },
      mockData: { data: userData },
      mockDelay: 500
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || '获取用户资料失败');
  }
};

/**
 * @description 更新用户个人资料
 * @param {String} role - 用户角色(teacher/student)
 * @param {Object} profileData - 资料数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserProfile = async (role, profileData) => {
  try {
    // 教师角色时，处理标签
    if (role === 'teacher' && profileData.tags) {
      if (profileData.certTag !== undefined) {
        const allTags = [profileData.certTag];
        if (profileData.otherTags) {
          allTags.push(...profileData.otherTags);
        }
        profileData.tags = allTags;
      }
    }
    
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: 'PUT',
      data: { ...profileData, role },
      mockData: {
        data: {
          ...profileData,
          updateTime: new Date().toISOString()
        }
      },
      mockDelay: 700
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || '更新用户资料失败');
  }
};

/**
 * @description 设置用户密码
 * @param {String} role - 用户角色(teacher/student)
 * @param {Object} passwordData - 密码数据
 * @returns {Promise<Object>} 设置结果
 */
export const setUserPassword = async (role, passwordData) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/password`,
      method: 'POST',
      data: { ...passwordData, role },
      mockData: {
        data: {
          success: true,
          hasPassword: true,
          updateTime: new Date().toISOString()
        }
      },
      mockDelay: 600
    });
    
    return response;
  } catch (error) {
    throw new Error(error.message || '设置密码失败');
  }
};

/**
 * @description 切换用户角色
 * @param {String} currentRole - 当前角色
 * @param {String} newRole - 新角色
 * @returns {Promise<Object>} 切换结果
 */
export const switchUserRole = async (currentRole, newRole) => {
  try {
    const useMockData = shouldUseMockData({});
    
    const response = await request({
      url: `${API_PREFIX}/switch-role`,
      method: 'POST',
      data: { currentRole, newRole, useMockData },
      mockData: {
        data: {
          oldRole: currentRole,
          newRole: newRole,
          success: true,
          useMockData: useMockData
        }
      },
      mockDelay: 500,
      forceMock: useMockData
    });
    
    if (useMockData) {
      uni.setStorageSync('use_mock_api', 'true');
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || '切换角色失败');
  }
};