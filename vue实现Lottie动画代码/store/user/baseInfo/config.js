/**
 * 用户基本信息模块配置
 * @module store/user/baseInfo/config
 */

// 直接导入所有API实现，避免使用动态require
import * as realApi from './api';
import * as mockApi from './mock-api';
import * as mockDataModule from './mock-data';

/**
 * 是否使用模拟API
 * 在开发/测试阶段设为true，与后端集成时设为false
 * @type {boolean}
 */
export const USE_MOCK_DATA = true;

/**
 * 开发环境配置
 * @type {Object}
 */
export const DEV_CONFIG = {
  // 开发环境下的其他配置项
  useDebugLog: true,
  mockDelay: {
    min: 200,  // 最小延迟(ms)
    max: 800   // 最大延迟(ms)
  },
  // 控制是否使用本地缓存来模拟持久化存储
  useLocalCache: true
};

/**
 * 生产环境配置
 * @type {Object}
 */
export const PROD_CONFIG = {
  useDebugLog: false,
  // 其他生产环境特有配置
};

/**
 * 根据当前环境返回配置
 * @returns {Object} 当前环境的配置
 */
export const getEnvironmentConfig = () => {
  // 根据环境变量或其他条件判断当前环境
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? PROD_CONFIG : DEV_CONFIG;
};

/**
 * 获取当前应该使用的API实现
 * @returns {Object} API模块
 */
export const getApiImplementation = () => {
  if (USE_MOCK_DATA) {
    // 使用模拟API
    return mockApi;
  } else {
    // 使用真实API
    return realApi;
  }
};

/**
 * 获取模拟数据
 * 仅在测试和开发环境中使用
 * @returns {Object} 模拟数据模块
 */
export const getMockData = () => {
  if (USE_MOCK_DATA) {
    return mockDataModule;
  }
  return null;
}; 