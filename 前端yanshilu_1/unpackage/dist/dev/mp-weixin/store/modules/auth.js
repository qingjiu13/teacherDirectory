"use strict";
const common_vendor = require("../../common/vendor.js");
const api = {
  /**
   * @description 模拟登录请求
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @param {string} credentials.role - 角色（student/teacher）
   * @returns {Promise<Object>} 登录结果
   */
  login(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { username, role } = credentials;
        const payload = {
          sub: `user_${Date.now()}`,
          name: username,
          role,
          iat: Math.floor(Date.now() / 1e3),
          exp: Math.floor(Date.now() / 1e3) + 7200
          // 2小时后过期
        };
        const header = common_vendor.gBase64.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payloadBase64 = common_vendor.gBase64.encode(JSON.stringify(payload));
        const signature = common_vendor.gBase64.encode("mock_signature");
        const token = `${header}.${payloadBase64}.${signature}`;
        const refreshToken = `refresh_${header}.${common_vendor.gBase64.encode(JSON.stringify({
          ...payload,
          exp: Math.floor(Date.now() / 1e3) + 86400
          // 24小时后过期
        }))}.${signature}`;
        resolve({
          success: true,
          data: {
            token,
            refreshToken,
            expiresIn: 7200,
            userInfo: {
              name: username,
              avatar: "https://example.com/avatar.png",
              tags: ["标签1", "标签2"],
              balance: role === "teacher" ? 1e3 : null,
              bio: role === "teacher" ? "资深导师，专注于学术指导" : "热爱学习的学生",
              contact: {
                phone: "138****1234",
                email: `${username}@example.com`,
                wechat: username
              }
            },
            role
          }
        });
      }, 500);
    });
  },
  /**
   * @description 模拟获取用户信息
   * @param {string} token - 用户token
   * @returns {Promise<Object>} 用户信息
   */
  getUserInfo(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = token.startsWith("teacher") ? "teacher" : "student";
        resolve({
          success: true,
          data: {
            name: `${role}用户`,
            avatar: "https://example.com/avatar.png",
            tags: ["标签1", "标签2", "标签3"],
            balance: role === "teacher" ? 1500 : null,
            bio: role === "teacher" ? "资深导师，专注于学术指导" : "热爱学习的学生",
            contact: {
              phone: "138****1234",
              email: `${role}@example.com`,
              wechat: `${role}_user`
            },
            notifications: {
              unread: 3,
              messages: [
                { id: "m1", type: "system", content: "系统通知", read: false, time: Date.now() - 36e5 },
                { id: "m2", type: "chat", content: "新聊天消息", read: false, time: Date.now() - 72e5 },
                { id: "m3", type: "order", content: "订单状态更新", read: false, time: Date.now() - 108e5 }
              ]
            }
          }
        });
      }, 600);
    });
  },
  /**
   * @description 模拟刷新token
   * @param {string} refreshToken - 刷新token
   * @returns {Promise<Object>} 新的token信息
   */
  refreshToken(refreshToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            token: `new_token_${Date.now()}`,
            refreshToken: `new_refresh_token_${Date.now()}`,
            expiresIn: 7200
            // 2小时有效期
          }
        });
      }, 300);
    });
  }
};
const storage = {
  /**
   * @description 保存认证信息到本地存储
   * @param {Object} auth - 认证信息
   */
  saveAuth(auth2) {
    common_vendor.index.setStorageSync("token", auth2.token);
    common_vendor.index.setStorageSync("refreshToken", auth2.refreshToken);
    common_vendor.index.setStorageSync("tokenExpireTime", Date.now() + auth2.expiresIn * 1e3);
    common_vendor.index.setStorageSync("isLoggedIn", true);
    common_vendor.index.setStorageSync("role", auth2.role);
    common_vendor.index.setStorageSync("userBaseInfo", {
      name: auth2.userInfo.name,
      avatar: auth2.userInfo.avatar,
      tags: auth2.userInfo.tags || []
    });
  },
  /**
   * @description 保存用户详细信息到本地存储
   * @param {Object} userInfo - 用户详细信息
   */
  saveUserDetailInfo(userInfo) {
    common_vendor.index.setStorageSync("userDetailInfo", JSON.stringify(userInfo));
  },
  /**
   * @description 获取用户详细信息
   * @returns {Object|null} 用户详细信息
   */
  getUserDetailInfo() {
    const info = common_vendor.index.getStorageSync("userDetailInfo");
    try {
      return info ? JSON.parse(info) : null;
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/auth.js:161", "解析用户详细信息失败:", e);
      return null;
    }
  },
  /**
   * @description 清除认证信息
   */
  clearAuth() {
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("refreshToken");
    common_vendor.index.removeStorageSync("tokenExpireTime");
    common_vendor.index.removeStorageSync("isLoggedIn");
    common_vendor.index.removeStorageSync("role");
    common_vendor.index.removeStorageSync("userBaseInfo");
    common_vendor.index.removeStorageSync("userDetailInfo");
  },
  /**
   * @description 获取token
   * @returns {string|null} token值
   */
  getToken() {
    return common_vendor.index.getStorageSync("token") || null;
  },
  /**
   * @description 获取刷新token
   * @returns {string|null} 刷新token值
   */
  getRefreshToken() {
    return common_vendor.index.getStorageSync("refreshToken") || null;
  },
  /**
   * @description 获取token过期时间
   * @returns {number|null} 过期时间戳
   */
  getTokenExpireTime() {
    return common_vendor.index.getStorageSync("tokenExpireTime") || null;
  }
};
const state = {
  isRegistered: false,
  role: common_vendor.index.getStorageSync("role") || null,
  isLoggedIn: common_vendor.index.getStorageSync("isLoggedIn") || false,
  userInfo: {
    name: "",
    avatar: "",
    tags: [],
    bio: "",
    contact: {
      phone: "",
      email: "",
      wechat: ""
    },
    balance: null,
    notifications: {
      unread: 0,
      messages: []
    }
  },
  token: storage.getToken(),
  refreshToken: storage.getRefreshToken(),
  tokenExpireTime: storage.getTokenExpireTime(),
  permissions: {
    canPublishCourse: false,
    canWithdraw: false,
    isVerified: false
  }
};
const userDetailInfo = storage.getUserDetailInfo();
if (userDetailInfo) {
  state.userInfo = { ...state.userInfo, ...userDetailInfo };
}
const mutations = {
  /**
   * @description 设置登录状态
   * @param {Object} state - Vuex状态
   * @param {boolean} isLoggedIn - 是否已登录
   */
  SET_LOGGED_IN(state2, isLoggedIn) {
    state2.isLoggedIn = isLoggedIn;
  },
  /**
   * @description 设置用户角色
   * @param {Object} state - Vuex状态
   * @param {string} role - 用户角色
   */
  SET_ROLE(state2, role) {
    state2.role = role;
  },
  /**
   * @description 设置认证信息
   * @param {Object} state - Vuex状态
   * @param {Object} authData - 认证数据
   */
  SET_AUTH(state2, authData) {
    state2.token = authData.token;
    state2.refreshToken = authData.refreshToken;
    state2.tokenExpireTime = Date.now() + authData.expiresIn * 1e3;
    storage.saveAuth({
      token: authData.token,
      refreshToken: authData.refreshToken,
      expiresIn: authData.expiresIn,
      role: authData.role,
      userInfo: authData.userInfo
    });
  },
  /**
   * @description 设置用户信息
   * @param {Object} state - Vuex状态
   * @param {Object} userInfo - 用户信息
   */
  SET_USER_INFO(state2, userInfo) {
    state2.userInfo = userInfo;
    storage.saveUserDetailInfo(userInfo);
  },
  /**
   * @description 更新用户部分信息
   * @param {Object} state - Vuex状态
   * @param {Object} partialInfo - 部分用户信息
   */
  UPDATE_USER_INFO(state2, partialInfo) {
    state2.userInfo = { ...state2.userInfo, ...partialInfo };
    storage.saveUserDetailInfo(state2.userInfo);
  },
  /**
   * @description 设置用户权限
   * @param {Object} state - Vuex状态
   * @param {Object} permissions - 权限对象
   */
  SET_PERMISSIONS(state2, permissions) {
    state2.permissions = { ...state2.permissions, ...permissions };
  },
  /**
   * @description 清除认证状态
   * @param {Object} state - Vuex状态
   */
  CLEAR_AUTH(state2) {
    state2.isLoggedIn = false;
    state2.token = null;
    state2.refreshToken = null;
    state2.tokenExpireTime = null;
    state2.userInfo = {
      name: "",
      avatar: "",
      tags: [],
      bio: "",
      contact: {
        phone: "",
        email: "",
        wechat: ""
      },
      balance: null,
      notifications: {
        unread: 0,
        messages: []
      }
    };
    state2.permissions = {
      canPublishCourse: false,
      canWithdraw: false,
      isVerified: false
    };
    storage.clearAuth();
  },
  /**
   * @description 设置是否已注册
   * @param {Object} state - Vuex状态
   * @param {boolean} status - 注册状态
   */
  SET_REGISTERED(state2, status) {
    state2.isRegistered = status;
  }
};
const actions = {
  /**
   * @description 登录操作
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    try {
      const response = await api.login(credentials);
      if (response.success) {
        const { token, refreshToken, expiresIn, userInfo, role } = response.data;
        commit("SET_LOGGED_IN", true);
        commit("SET_ROLE", role);
        commit("SET_AUTH", { token, refreshToken, expiresIn, role, userInfo });
        commit("SET_USER_INFO", userInfo);
        const permissions = {
          canPublishCourse: role === "teacher",
          canWithdraw: role === "teacher",
          isVerified: role === "teacher"
        };
        commit("SET_PERMISSIONS", permissions);
        return { success: true, message: "登录成功" };
      }
      return { success: false, message: "登录失败" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/auth.js:380", "登录失败:", error);
      return { success: false, message: error.message || "登录失败" };
    }
  },
  /**
   * @description 获取用户信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 用户信息获取结果
   */
  async getUserInfo({ commit, state: state2, dispatch }) {
    if (state2.tokenExpireTime && state2.tokenExpireTime - Date.now() < 10 * 60 * 1e3) {
      await dispatch("refreshToken");
    }
    try {
      const response = await api.getUserInfo(state2.token);
      if (response.success) {
        commit("SET_USER_INFO", response.data);
        const permissions = {
          canPublishCourse: state2.role === "teacher",
          canWithdraw: state2.role === "teacher" && response.data.balance > 0,
          isVerified: state2.role === "teacher"
        };
        commit("SET_PERMISSIONS", permissions);
        return { success: true, data: response.data };
      }
      return { success: false, message: "获取用户信息失败" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/auth.js:411", "获取用户信息失败:", error);
      return { success: false, message: error.message || "获取用户信息失败" };
    }
  },
  /**
   * @description 刷新token
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state: state2 }) {
    if (!state2.refreshToken) {
      return { success: false, message: "无刷新令牌" };
    }
    try {
      const response = await api.refreshToken(state2.refreshToken);
      if (response.success) {
        const { token, refreshToken, expiresIn } = response.data;
        const decodedToken = jwtUtils.decode(token);
        commit("SET_AUTH", {
          token,
          refreshToken,
          expiresIn: decodedToken ? (decodedToken.exp * 1e3 - Date.now()) / 1e3 : expiresIn,
          role: state2.role,
          userInfo: state2.userInfo
        });
        return { success: true, message: "令牌刷新成功" };
      }
      return { success: false, message: "令牌刷新失败" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/auth.js:444", "令牌刷新失败:", error);
      commit("CLEAR_AUTH");
      return { success: false, message: error.message || "令牌刷新失败" };
    }
  },
  /**
   * @description 登出操作
   * @param {Object} context - Vuex上下文
   */
  logout({ commit }) {
    commit("CLEAR_AUTH");
    return { success: true, message: "已退出登录" };
  },
  /**
   * @description 验证登录状态
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 验证结果
   */
  async checkLoginStatus({ state: state2, commit, dispatch }) {
    if (!state2.token) {
      commit("CLEAR_AUTH");
      return { success: false, message: "未登录" };
    }
    const isTokenValid = jwtUtils.isValid(state2.token);
    if (!isTokenValid && state2.refreshToken) {
      const refreshResult = await dispatch("refreshToken");
      if (!refreshResult.success) {
        commit("CLEAR_AUTH");
        return { success: false, message: "登录已过期" };
      }
    } else if (!isTokenValid) {
      commit("CLEAR_AUTH");
      return { success: false, message: "登录已过期" };
    }
    const userInfoResult = await dispatch("getUserInfo");
    if (userInfoResult.success) {
      return { success: true, message: "登录状态有效" };
    } else {
      commit("CLEAR_AUTH");
      return { success: false, message: "登录状态无效" };
    }
  },
  /**
   * @description 更新用户信息
   * @param {Object} context - Vuex上下文
   * @param {Object} userInfo - 更新的用户信息
   * @returns {Promise<Object>} 更新结果
   */
  async updateUserInfo({ commit, state: state2 }, userInfo) {
    commit("UPDATE_USER_INFO", userInfo);
    return { success: true, message: "用户信息更新成功" };
  }
};
const getters = {
  /**
   * @description 获取用户角色
   * @param {Object} state - Vuex状态
   * @returns {string|null} 用户角色
   */
  userRole: (state2) => state2.role,
  /**
   * @description 判断是否是老师
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否是老师
   */
  isTeacher: (state2) => state2.role === "teacher",
  /**
   * @description 判断是否是学生
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否是学生
   */
  isStudent: (state2) => state2.role === "student",
  /**
   * @description 获取老师余额
   * @param {Object} state - Vuex状态
   * @returns {number|null} 老师余额
   */
  teacherBalance: (state2) => state2.role === "teacher" ? state2.userInfo.balance : null,
  /**
   * @description 获取用户名称
   * @param {Object} state - Vuex状态
   * @returns {string} 用户名称
   */
  userName: (state2) => state2.userInfo.name,
  /**
   * @description 获取用户头像
   * @param {Object} state - Vuex状态
   * @returns {string} 用户头像
   */
  userAvatar: (state2) => state2.userInfo.avatar,
  /**
   * @description 获取用户标签
   * @param {Object} state - Vuex状态
   * @returns {Array} 用户标签
   */
  userTags: (state2) => state2.userInfo.tags,
  /**
   * @description 获取用户简介
   * @param {Object} state - Vuex状态
   * @returns {string} 用户简介
   */
  userBio: (state2) => state2.userInfo.bio,
  /**
   * @description 获取用户联系信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 用户联系信息
   */
  userContact: (state2) => state2.userInfo.contact,
  /**
   * @description 获取未读消息数
   * @param {Object} state - Vuex状态
   * @returns {number} 未读消息数
   */
  unreadMessageCount: (state2) => state2.userInfo.notifications.unread,
  /**
   * @description 获取通知消息
   * @param {Object} state - Vuex状态
   * @returns {Array} 通知消息列表
   */
  notifications: (state2) => state2.userInfo.notifications.messages,
  /**
   * @description 获取用户权限
   * @param {Object} state - Vuex状态
   * @returns {Object} 用户权限
   */
  userPermissions: (state2) => state2.permissions
};
const jwtUtils = {
  /**
   * @description 解析JWT令牌
   * @param {string} token - JWT令牌
   * @returns {Object} 解析后的数据
   */
  decode(token) {
    try {
      return common_vendor.jwtDecode(token);
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/auth.js:601", "JWT解析失败:", error);
      return null;
    }
  },
  /**
   * @description 检查JWT是否有效
   * @param {string} token - JWT令牌
   * @returns {boolean} 是否有效
   */
  isValid(token) {
    if (!token)
      return false;
    try {
      const decoded = this.decode(token);
      if (!decoded)
        return false;
      const currentTime = Date.now() / 1e3;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};
const auth = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.auth = auth;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/auth.js.map
