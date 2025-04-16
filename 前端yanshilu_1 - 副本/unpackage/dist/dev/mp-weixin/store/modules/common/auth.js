"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    common_vendor.index.__f__("error", "at store/modules/common/auth.js:23", "解析JWT失败:", error);
    return null;
  }
};
const isTokenExpired = (token) => {
  if (!token)
    return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp)
    return true;
  return payload.exp * 1e3 < Date.now();
};
const isTokenNearExpiry = (token, timeThreshold = 3e5) => {
  if (!token)
    return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp)
    return false;
  return payload.exp * 1e3 - Date.now() < timeThreshold && payload.exp * 1e3 > Date.now();
};
let isRefreshing = false;
let refreshSubscribers = [];
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};
const state = {
  token: common_vendor.index.getStorageSync("token") || "",
  refreshToken: common_vendor.index.getStorageSync("refreshToken") || "",
  userId: common_vendor.index.getStorageSync("userId") || "",
  role: common_vendor.index.getStorageSync("role") || "",
  loginLoading: false,
  loginError: null,
  tokenRefreshing: false,
  lastTokenRefresh: common_vendor.index.getStorageSync("lastTokenRefresh") || 0
};
const getters = {
  currentRole: (state2) => state2.role,
  isTeacher: (state2) => state2.role === "teacher",
  isStudent: (state2) => state2.role === "student",
  userId: (state2) => state2.userId,
  authToken: (state2) => state2.token,
  refreshToken: (state2) => state2.refreshToken,
  loginLoading: (state2) => state2.loginLoading,
  loginError: (state2) => state2.loginError,
  isTokenExpired: (state2) => isTokenExpired(state2.token),
  isTokenRefreshing: (state2) => state2.tokenRefreshing
};
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const LOGOUT = "LOGOUT";
const TOKEN_REFRESH_REQUEST = "TOKEN_REFRESH_REQUEST";
const TOKEN_REFRESH_SUCCESS = "TOKEN_REFRESH_SUCCESS";
const TOKEN_REFRESH_FAILURE = "TOKEN_REFRESH_FAILURE";
const mutations = {
  [LOGIN_REQUEST](state2) {
    state2.loginLoading = true;
    state2.loginError = null;
  },
  [LOGIN_SUCCESS](state2, { token, refreshToken, userId, role }) {
    state2.token = token;
    state2.refreshToken = refreshToken || state2.refreshToken;
    state2.userId = userId;
    state2.role = role;
    state2.loginLoading = false;
    state2.loginError = null;
    state2.lastTokenRefresh = Date.now();
    common_vendor.index.setStorageSync("token", token);
    common_vendor.index.setStorageSync("refreshToken", refreshToken || state2.refreshToken);
    common_vendor.index.setStorageSync("userId", userId);
    common_vendor.index.setStorageSync("role", role);
    common_vendor.index.setStorageSync("lastTokenRefresh", Date.now());
  },
  [LOGIN_FAILURE](state2, error) {
    state2.loginLoading = false;
    state2.loginError = error;
  },
  [LOGOUT](state2) {
    state2.token = "";
    state2.refreshToken = "";
    state2.userId = "";
    state2.role = "";
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("refreshToken");
    common_vendor.index.removeStorageSync("userId");
    common_vendor.index.removeStorageSync("role");
    common_vendor.index.removeStorageSync("lastTokenRefresh");
  },
  [TOKEN_REFRESH_REQUEST](state2) {
    state2.tokenRefreshing = true;
  },
  [TOKEN_REFRESH_SUCCESS](state2, { token, refreshToken }) {
    state2.token = token;
    if (refreshToken)
      state2.refreshToken = refreshToken;
    state2.tokenRefreshing = false;
    state2.lastTokenRefresh = Date.now();
    common_vendor.index.setStorageSync("token", token);
    if (refreshToken)
      common_vendor.index.setStorageSync("refreshToken", refreshToken);
    common_vendor.index.setStorageSync("lastTokenRefresh", Date.now());
  },
  [TOKEN_REFRESH_FAILURE](state2) {
    state2.tokenRefreshing = false;
  }
};
const actions = {
  /**
   * @description 用户登录
   * @param {Object} context - Vuex上下文
   * @param {Object} credentials - 登录凭证
   * @returns {Promise<Object>} 登录结果
   */
  async login({ commit }, credentials) {
    var _a, _b;
    commit(LOGIN_REQUEST);
    try {
      const response = await store_services_index.services.auth.login(credentials);
      const { token, refreshToken, userId, role } = response.data;
      commit(LOGIN_SUCCESS, { token, refreshToken, userId, role });
      return { success: true, data: response.data };
    } catch (error) {
      commit(LOGIN_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "登录失败");
      return { success: false, error };
    }
  },
  /**
   * @description 用户登出
   * @param {Object} context - Vuex上下文
   */
  logout({ commit }) {
    commit(LOGOUT);
  },
  /**
   * @description 刷新Token
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken({ commit, state: state2 }) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          resolve({ success: true, token });
        });
      });
    }
    const now = Date.now();
    if (now - state2.lastTokenRefresh < 6e4) {
      return { success: true, token: state2.token };
    }
    isRefreshing = true;
    commit(TOKEN_REFRESH_REQUEST);
    try {
      const response = await store_services_index.services.auth.refreshToken({
        refreshToken: state2.refreshToken
      });
      const { token, refreshToken } = response.data;
      commit(TOKEN_REFRESH_SUCCESS, { token, refreshToken });
      onRefreshed(token);
      isRefreshing = false;
      return { success: true, token, refreshToken };
    } catch (error) {
      commit(TOKEN_REFRESH_FAILURE);
      isRefreshing = false;
      return { success: false, error };
    }
  },
  /**
   * @description 初始化请求拦截器，添加认证Token
   * @param {Object} context - Vuex上下文
   * @param {Object} requestInstance - uni.request实例或自定义请求库实例
   */
  setupRequestInterceptor({ state: state2, dispatch }, requestInstance) {
    if (requestInstance && requestInstance.interceptors) {
      requestInstance.interceptors.request.use(async (config) => {
        if (state2.token) {
          if (isTokenExpired(state2.token)) {
            if (state2.refreshToken) {
              const { success, token } = await dispatch("refreshToken");
              if (success) {
                config.header = config.header || {};
                config.header.Authorization = `Bearer ${token}`;
              }
            }
          } else {
            config.header = config.header || {};
            config.header.Authorization = `Bearer ${state2.token}`;
            if (isTokenNearExpiry(state2.token)) {
              dispatch("refreshToken");
            }
          }
        }
        return config;
      });
      requestInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (state2.refreshToken) {
              const { success, token } = await dispatch("refreshToken");
              if (success) {
                originalRequest.header.Authorization = `Bearer ${token}`;
                return requestInstance(originalRequest);
              }
            }
            dispatch("logout");
          }
          return Promise.reject(error);
        }
      );
    }
  }
};
const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.auth = auth;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/auth.js.map
