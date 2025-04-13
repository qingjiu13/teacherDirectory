"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const store_services_mockData = require("./mock-data.js");
const API_PREFIX = `${config_index.API_BASE_URL}/user`;
const USE_MOCK_DATA = true;
const shouldUseMockData = (options) => {
  if (options && options.forceMock !== void 0) {
    common_vendor.index.__f__("log", "at store/services/user.api.js:21", "API请求使用强制模拟数据设置:", options.forceMock);
    return options.forceMock;
  }
  const useStorageMock = common_vendor.index.getStorageSync("use_mock_api") === "true";
  if (useStorageMock) {
    common_vendor.index.__f__("log", "at store/services/user.api.js:30", "API请求使用本地存储模拟数据设置: true");
    return true;
  }
  const useDevMock = true;
  common_vendor.index.__f__("log", "at store/services/user.api.js:36", "API请求环境模拟数据设置:", "开发环境启用");
  const finalDecision = useStorageMock || USE_MOCK_DATA || useDevMock;
  common_vendor.index.__f__("log", "at store/services/user.api.js:40", "API请求最终使用模拟数据:", finalDecision);
  return finalDecision;
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    if (shouldUseMockData(options)) {
      common_vendor.index.__f__("log", "at store/services/user.api.js:54", "使用模拟数据响应请求:", options.url);
      setTimeout(() => {
        resolve(options.mockData || {});
      }, options.mockDelay || 300);
      return;
    }
    common_vendor.index.__f__("log", "at store/services/user.api.js:63", "发起实际API请求:", options.url);
    common_vendor.index.request({
      url: options.url,
      data: options.data,
      method: options.method || "GET",
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        if (shouldUseMockData(options) && options.useMockOnFail) {
          common_vendor.index.__f__("warn", "at store/services/user.api.js:75", "API请求失败，使用模拟数据替代", err);
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
const getUserProfile = async (role) => {
  try {
    const userData = store_services_mockData.getMockUserProfile(role);
    const mockData = {
      data: userData
    };
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: "GET",
      data: { role },
      mockData,
      mockDelay: 500
    });
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/user.api.js:114", "获取用户资料失败:", error);
    throw new Error(error.message || "获取用户资料失败");
  }
};
const updateUserProfile = async (role, profileData) => {
  try {
    const mockData = {
      data: {
        ...profileData,
        updateTime: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: "PUT",
      data: { ...profileData, role },
      mockData,
      mockDelay: 700
    });
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/user.api.js:146", "更新用户资料失败:", error);
    throw new Error(error.message || "更新用户资料失败");
  }
};
const setUserPassword = async (role, passwordData) => {
  try {
    const mockData = {
      data: {
        success: true,
        hasPassword: true,
        updateTime: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const response = await request({
      url: `${API_PREFIX}/password`,
      method: "POST",
      data: { ...passwordData, role },
      mockData,
      mockDelay: 600
    });
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/user.api.js:179", "设置密码失败:", error);
    throw new Error(error.message || "设置密码失败");
  }
};
const switchUserRole = async (currentRole, newRole) => {
  try {
    const useMockData = shouldUseMockData({});
    common_vendor.index.__f__("log", "at store/services/user.api.js:194", "角色切换API - 使用模拟数据:", useMockData ? "是" : "否");
    const mockData = {
      data: {
        oldRole: currentRole,
        newRole,
        success: true,
        useMockData
        // 记录模拟数据设置，确保切换后一致
      }
    };
    const response = await request({
      url: `${API_PREFIX}/switch-role`,
      method: "POST",
      data: { currentRole, newRole, useMockData },
      // 传递模拟数据设置
      mockData,
      mockDelay: 500,
      forceMock: useMockData
      // 强制使用模拟数据设置
    });
    if (useMockData) {
      common_vendor.index.setStorageSync("use_mock_api", "true");
      common_vendor.index.__f__("log", "at store/services/user.api.js:218", "角色切换后保持模拟数据设置: true");
    }
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/user.api.js:224", "切换角色失败:", error);
    throw new Error(error.message || "切换角色失败");
  }
};
const user = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getUserProfile,
  setUserPassword,
  switchUserRole,
  updateUserProfile
}, Symbol.toStringTag, { value: "Module" }));
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/user.api.js.map
