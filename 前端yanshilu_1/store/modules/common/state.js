/**
 * @description 公共模块的初始状态
 */

export default {
  // 应用加载状态
  isLoading: false,

  // 全局错误信息
  error: null,

  // 应用版本
  appVersion: '1.0.0',

  // 应用配置
  appConfig: {
    theme: uni.getStorageSync('appConfig')?.theme || 'light',
    fontSize: uni.getStorageSync('appConfig')?.fontSize || 'medium',
    language: uni.getStorageSync('appConfig')?.language || 'zh-CN'
  },
  
  // 全局通知
  notifications: [],
  
  // 系统信息
  systemInfo: null
}; 