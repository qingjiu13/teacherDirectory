/**
 * @description 用户通用API服务
 * 提供用户资料获取、更新、密码设置等通用功能
 */
import { API_BASE_URL } from '../../config';
import { mockDelay, mockApiResponse, mockStudentData, mockTeacherData, getMockUserProfile } from './mock-data';

const API_PREFIX = `${API_BASE_URL}/user`;

// 是否使用模拟数据 - 为了将来容易替换，添加多种控制方式
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || uni.getStorageSync('use_mock_api') === 'true';

/**
 * @description 检查是否需要使用模拟数据
 * @param {Object} options - 请求选项，可以包含强制指定是否使用模拟数据
 * @returns {Boolean} 是否使用模拟数据
 */
const shouldUseMockData = (options) => {
  // 如果选项中明确指定了是否使用模拟数据，则优先使用
  if (options && options.forceMock !== undefined) {
    console.log('API请求使用强制模拟数据设置:', options.forceMock);
    return options.forceMock;
  }
  
  // 检查本地存储中的模拟数据设置 - 添加显式检查，确保不遗漏
  const useStorageMock = uni.getStorageSync('use_mock_api') === 'true';
  
  // 如果本地存储中明确设置了使用模拟数据，则使用模拟数据
  if (useStorageMock) {
    console.log('API请求使用本地存储模拟数据设置: true');
    return true;
  }
  
  // 开发环境默认使用模拟数据
  const useDevMock = process.env.NODE_ENV === 'development';
  console.log('API请求环境模拟数据设置:', useDevMock ? '开发环境启用' : '生产环境禁用');
  
  // 最终决策
  const finalDecision = useStorageMock || USE_MOCK_DATA || useDevMock;
  console.log('API请求最终使用模拟数据:', finalDecision);
  
  return finalDecision;
};

/**
 * @description 使用uni.request封装网络请求
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 检查是否应该使用模拟数据 - 修改逻辑，只要shouldUseMockData返回true就使用模拟数据
    if (shouldUseMockData(options)) {
      console.log('使用模拟数据响应请求:', options.url);
      // 延迟返回模拟数据，模拟网络请求
      setTimeout(() => {
        resolve(options.mockData || {});
      }, options.mockDelay || 300);
      return;
    }
    
    // 否则发起真实网络请求
    console.log('发起实际API请求:', options.url);
    uni.request({
      url: options.url,
      data: options.data,
      method: options.method || 'GET',
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        // 如果请求失败且在开发环境并指定了失败时使用模拟数据
        if (shouldUseMockData(options) && options.useMockOnFail) {
          console.warn('API请求失败，使用模拟数据替代', err);
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
 * @description 获取用户个人资料（通用API，根据角色调用不同服务）
 * @param {String} role - 用户角色(teacher/student)
 * @returns {Promise<Object>} 用户资料
 * 
 * TODO: 替换为真实API时，需要修改此方法，移除模拟数据相关代码，
 * 直接发送请求到后端API获取用户资料
 */
export const getUserProfile = async (role) => {
  try {
    // 准备模拟数据
    const userData = getMockUserProfile(role);
    const mockData = {
      data: userData
    };
    
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: 'GET',
      data: { role },
      mockData: mockData,
      mockDelay: 500
    });
    
    // 为了保持与之前API格式一致，直接返回data字段
    return response;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw new Error(error.message || '获取用户资料失败');
  }
};

/**
 * @description 更新用户个人资料（通用API）
 * @param {String} role - 用户角色(teacher/student)
 * @param {Object} profileData - 资料数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserProfile = async (role, profileData) => {
  try {
    // 准备模拟数据
    const mockData = {
      data: {
        ...profileData,
        updateTime: new Date().toISOString()
      }
    };
    
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: 'PUT',
      data: { ...profileData, role },
      mockData: mockData,
      mockDelay: 700
    });
    
    // 保持一致的返回格式
    return response;
  } catch (error) {
    console.error('更新用户资料失败:', error);
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
    // 准备模拟数据
    const mockData = {
      data: {
        success: true,
        hasPassword: true,
        updateTime: new Date().toISOString()
      }
    };
    
    const response = await request({
      url: `${API_PREFIX}/password`,
      method: 'POST',
      data: { ...passwordData, role },
      mockData: mockData,
      mockDelay: 600
    });
    
    // 保持一致的返回格式
    return response;
  } catch (error) {
    console.error('设置密码失败:', error);
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
    // 获取当前模拟数据设置
    const useMockData = shouldUseMockData({});
    console.log('角色切换API - 使用模拟数据:', useMockData ? '是' : '否');
    
    // 准备模拟数据
    const mockData = {
      data: {
        oldRole: currentRole,
        newRole: newRole,
        success: true,
        useMockData: useMockData  // 记录模拟数据设置，确保切换后一致
      }
    };
    
    const response = await request({
      url: `${API_PREFIX}/switch-role`,
      method: 'POST',
      data: { currentRole, newRole, useMockData },  // 传递模拟数据设置
      mockData: mockData,
      mockDelay: 500,
      forceMock: useMockData  // 强制使用模拟数据设置
    });
    
    // 切换角色后，确保模拟数据设置保持不变
    if (useMockData) {
      uni.setStorageSync('use_mock_api', 'true');
      console.log('角色切换后保持模拟数据设置: true');
    }
    
    // 保持一致的返回格式
    return response;
  } catch (error) {
    console.error('切换角色失败:', error);
    throw new Error(error.message || '切换角色失败');
  }
}; 