"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/api/match`;
const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查您的网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后再试",
  SERVER_ERROR: "服务器错误，请稍后再试",
  AUTH_ERROR: "身份验证失败，请重新登录",
  INVALID_PARAM: "参数错误",
  RATE_LIMIT: "请求过于频繁，请稍后再试",
  UNKNOWN_ERROR: "未知错误，请稍后再试"
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url,
      data: options.data,
      method: options.method || "GET",
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const handleError = (error) => {
  let errorMessage = "";
  if (error.data && error.data.message) {
    errorMessage = error.data.message;
  } else if (error.data && error.data.error && error.data.error.message) {
    errorMessage = error.data.error.message;
  } else if (error.statusCode) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = "请求的资源不存在";
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else {
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  return {
    message: errorMessage,
    originalError: error,
    statusCode: error.statusCode || 0
  };
};
const getRecommendedTeachers = async (params = {}) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/recommended`,
      method: "GET",
      data: params
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:97", "获取推荐老师列表失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const searchTeachers = async (params = {}) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/search`,
      method: "GET",
      data: params
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:122", "搜索老师失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const getSchoolList = async (keyword = "") => {
  try {
    const response = await request({
      url: `${API_PREFIX}/schools`,
      method: "GET",
      data: { keyword }
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:141", "获取学校列表失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const getMajorList = async (school = "") => {
  try {
    const response = await request({
      url: `${API_PREFIX}/majors`,
      method: "GET",
      data: { school }
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:160", "获取专业列表失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const applyForCommunication = async (teacherId, message = "") => {
  try {
    const response = await request({
      url: `${API_PREFIX}/communicate`,
      method: "POST",
      data: { teacherId, message }
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:180", "申请与老师沟通失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const getTeacherDetail = async (teacherId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/teachers/${teacherId}`,
      method: "GET"
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:198", "获取老师详细信息失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const match = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyForCommunication,
  getMajorList,
  getRecommendedTeachers,
  getSchoolList,
  getTeacherDetail,
  searchTeachers
}, Symbol.toStringTag, { value: "Module" }));
exports.applyForCommunication = applyForCommunication;
exports.getMajorList = getMajorList;
exports.getRecommendedTeachers = getRecommendedTeachers;
exports.getSchoolList = getSchoolList;
exports.getTeacherDetail = getTeacherDetail;
exports.match = match;
exports.searchTeachers = searchTeachers;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/match.api.js.map
