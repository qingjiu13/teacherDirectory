/**
 * @description 用户模块的初始状态
 */

export default {
  // 登录状态
  isLoggedIn: uni.getStorageSync('isLoggedIn') || false,
  
  // 用户角色：student / teacher
  role: uni.getStorageSync('role') || null,
  
  // 认证信息
  auth: {
    token: uni.getStorageSync('token') || null,
    refreshToken: uni.getStorageSync('refreshToken') || null,
    tokenExpireTime: uni.getStorageSync('tokenExpireTime') || null
  },
  
  // 用户详细信息
  userInfo: {
    name: (uni.getStorageSync('userBaseInfo') || {}).name || '',
    avatar: (uni.getStorageSync('userBaseInfo') || {}).avatar || '',
    tags: (uni.getStorageSync('userBaseInfo') || {}).tags || [],
    balance: null, // 余额（仅教师）
    bio: '', // 个人简介
    contact: {
      phone: '',
      email: '',
      wechat: ''
    },
    notifications: {
      unread: 0,
      messages: []
    }
  },
  
  // 用户权限
  permissions: [],
  
  // 注册状态
  registration: {
    step: 1, // 当前注册步骤
    completed: false, // 是否完成注册
    data: {} // 注册过程中的临时数据
  }
}; 