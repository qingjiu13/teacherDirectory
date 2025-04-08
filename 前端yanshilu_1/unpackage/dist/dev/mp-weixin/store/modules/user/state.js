"use strict";
const common_vendor = require("../../../common/vendor.js");
const state = {
  // 登录状态
  isLoggedIn: common_vendor.index.getStorageSync("isLoggedIn") || false,
  // 用户角色：student / teacher
  role: common_vendor.index.getStorageSync("role") || null,
  // 认证信息
  auth: {
    token: common_vendor.index.getStorageSync("token") || null,
    refreshToken: common_vendor.index.getStorageSync("refreshToken") || null,
    tokenExpireTime: common_vendor.index.getStorageSync("tokenExpireTime") || null
  },
  // 用户详细信息
  userInfo: {
    name: (common_vendor.index.getStorageSync("userBaseInfo") || {}).name || "",
    avatar: (common_vendor.index.getStorageSync("userBaseInfo") || {}).avatar || "",
    tags: (common_vendor.index.getStorageSync("userBaseInfo") || {}).tags || [],
    balance: null,
    // 余额（仅教师）
    bio: "",
    // 个人简介
    contact: {
      phone: "",
      email: "",
      wechat: ""
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
    step: 1,
    // 当前注册步骤
    completed: false,
    // 是否完成注册
    data: {}
    // 注册过程中的临时数据
  }
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/user/state.js.map
