/**
 * @description 匹配功能API服务
 * 提供老师匹配和筛选相关功能
 */
import { API_BASE_URL } from '../../config';
import { mockDelay, mockTeachers, mockServices, getMockTeacherDetailWithServices } from './mock-data';

const API_PREFIX = `${API_BASE_URL}/api/match`;

// 是否使用模拟数据
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

/**
 * @description 使用uni.request封装网络请求
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 在开发环境中，检查是否设置了直接使用模拟数据
    if (USE_MOCK_DATA && options.useMockOnDev) {
      // 延迟返回模拟数据，模拟网络请求
      setTimeout(() => {
        resolve(options.mockData || {});
      }, 300);
      return;
    }
    
    // 否则发起真实网络请求
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
        if (USE_MOCK_DATA && options.useMockOnFail) {
          console.warn('API请求失败，使用模拟数据替代', err);
          setTimeout(() => {
            resolve(options.mockData || {});
          }, 300);
          return;
        }
        reject(err);
      }
    });
  });
};

/**
 * @description 获取推荐老师列表
 * @param {Object} params - 查询参数
 * @param {Number} params.page - 页码
 * @param {Number} params.limit - 每页数量
 * @returns {Promise<Object>} 返回老师列表和分页信息
 */
export const getRecommendedTeachers = async (params = {}) => {
  try {
    const mockData = {
      data: {
        list: mockTeachers,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: mockTeachers.length
        }
      }
    };
    
    const response = await request({
      url: `${API_PREFIX}/teachers/recommended`,
      method: 'GET',
      data: params,
      useMockOnDev: true,
      useMockOnFail: true,
      mockData: mockData
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取推荐老师列表失败:', error);
    return { success: false, error };
  }
};

/**
 * @description 搜索老师
 * @param {Object} params - 搜索参数
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.school - 学校筛选
 * @param {String} params.major - 专业筛选
 * @param {Number} params.page - 页码
 * @param {Number} params.limit - 每页数量
 * @returns {Promise<Object>} 返回老师列表和分页信息
 */
export const searchTeachers = async (params = {}) => {
  try {
    // 过滤模拟数据，模拟搜索功能
    let filteredTeachers = [...mockTeachers];
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredTeachers = filteredTeachers.filter(t => 
        t.nickname.toLowerCase().includes(keyword) || 
        t.school.toLowerCase().includes(keyword) || 
        t.major.toLowerCase().includes(keyword)
      );
    }
    
    if (params.school) {
      filteredTeachers = filteredTeachers.filter(t => 
        t.school.includes(params.school)
      );
    }
    
    if (params.major) {
      filteredTeachers = filteredTeachers.filter(t => 
        t.major.includes(params.major)
      );
    }
    
    const mockData = {
      data: {
        list: filteredTeachers,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: filteredTeachers.length
        }
      }
    };
    
    const response = await request({
      url: `${API_PREFIX}/teachers/search`,
      method: 'GET',
      data: params,
      useMockOnDev: true,
      useMockOnFail: true,
      mockData: mockData
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('搜索老师失败:', error);
    return { success: false, error };
  }
};

/**
 * @description 获取老师详细信息（包含服务列表）
 * @param {Number} teacherId - 老师ID
 * @returns {Promise<Object>} 返回老师详细信息和服务列表
 */
export const getTeacherDetail = async (teacherId) => {
  try {
    // 使用之前添加的合并数据函数获取模拟数据
    const mockDataResponse = getMockTeacherDetailWithServices(teacherId);
    
    const response = await request({
      url: `${API_PREFIX}/teachers/${teacherId}`,
      method: 'GET',
      useMockOnDev: true,
      useMockOnFail: true,
      mockData: { data: mockDataResponse.data }
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('获取老师详细信息失败:', error);
    return { success: false, error };
  }
}; 