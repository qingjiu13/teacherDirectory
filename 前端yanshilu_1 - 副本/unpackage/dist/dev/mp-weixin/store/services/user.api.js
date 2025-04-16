"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const store_services_mockData = require("./mock-data.js");
const API_PREFIX = `${config_index.API_BASE_URL}/user`;
const shouldUseMockData = (options) => {
  if (options && options.forceMock !== void 0) {
    return options.forceMock;
  }
  if (common_vendor.index.getStorageSync("use_mock_api") === "true") {
    return true;
  }
  return true;
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    if (shouldUseMockData(options)) {
      setTimeout(() => {
        resolve(options.mockData || {});
      }, options.mockDelay || 300);
      return;
    }
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
    if (role === "teacher" && userData && userData.tags && userData.tags.length > 0) {
      if (!userData.tags[0].includes("认证") && userData.tags[0] !== "已认证") {
        userData.tags.unshift("已认证");
      }
      userData.tag = userData.tags[0];
    }
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: "GET",
      data: { role },
      mockData: { data: userData },
      mockDelay: 500
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "获取用户资料失败");
  }
};
const updateUserProfile = async (role, profileData) => {
  try {
    if (role === "teacher" && profileData.tags) {
      if (profileData.certTag !== void 0) {
        const allTags = [profileData.certTag];
        if (profileData.otherTags) {
          allTags.push(...profileData.otherTags);
        }
        profileData.tags = allTags;
      }
    }
    const response = await request({
      url: `${API_PREFIX}/profile`,
      method: "PUT",
      data: { ...profileData, role },
      mockData: {
        data: {
          ...profileData,
          updateTime: (/* @__PURE__ */ new Date()).toISOString()
        }
      },
      mockDelay: 700
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "更新用户资料失败");
  }
};
const setUserPassword = async (role, passwordData) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/password`,
      method: "POST",
      data: { ...passwordData, role },
      mockData: {
        data: {
          success: true,
          hasPassword: true,
          updateTime: (/* @__PURE__ */ new Date()).toISOString()
        }
      },
      mockDelay: 600
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "设置密码失败");
  }
};
const switchUserRole = async (currentRole, newRole) => {
  try {
    const useMockData = shouldUseMockData({});
    const response = await request({
      url: `${API_PREFIX}/switch-role`,
      method: "POST",
      data: { currentRole, newRole, useMockData },
      mockData: {
        data: {
          oldRole: currentRole,
          newRole,
          success: true,
          useMockData
        }
      },
      mockDelay: 500,
      forceMock: useMockData
    });
    if (useMockData) {
      common_vendor.index.setStorageSync("use_mock_api", "true");
    }
    return response;
  } catch (error) {
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
