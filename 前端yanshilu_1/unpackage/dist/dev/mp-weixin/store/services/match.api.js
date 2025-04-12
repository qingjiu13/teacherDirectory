"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const store_services_mockData = require("./mock-data.js");
const API_PREFIX = `${config_index.API_BASE_URL}/api/match`;
const request = (options) => {
  return new Promise((resolve, reject) => {
    if (options.useMockOnDev) {
      setTimeout(() => {
        resolve(options.mockData || {});
      }, 300);
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
        if (options.useMockOnFail) {
          common_vendor.index.__f__("warn", "at store/services/match.api.js:41", "API请求失败，使用模拟数据替代", err);
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
const getRecommendedTeachers = async (params = {}) => {
  try {
    const mockData = {
      data: {
        list: store_services_mockData.mockTeachers,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: store_services_mockData.mockTeachers.length
        }
      }
    };
    const response = await request({
      url: `${API_PREFIX}/teachers/recommended`,
      method: "GET",
      data: params,
      useMockOnDev: true,
      useMockOnFail: true,
      mockData
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:84", "获取推荐老师列表失败:", error);
    return { success: false, error };
  }
};
const searchTeachers = async (params = {}) => {
  try {
    let filteredTeachers = [...store_services_mockData.mockTeachers];
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredTeachers = filteredTeachers.filter(
        (t) => t.nickname.toLowerCase().includes(keyword) || t.school.toLowerCase().includes(keyword) || t.major.toLowerCase().includes(keyword)
      );
    }
    if (params.school) {
      filteredTeachers = filteredTeachers.filter(
        (t) => t.school.includes(params.school)
      );
    }
    if (params.major) {
      filteredTeachers = filteredTeachers.filter(
        (t) => t.major.includes(params.major)
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
      method: "GET",
      data: params,
      useMockOnDev: true,
      useMockOnFail: true,
      mockData
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:147", "搜索老师失败:", error);
    return { success: false, error };
  }
};
const getTeacherDetail = async (teacherId) => {
  try {
    const mockDataResponse = store_services_mockData.getMockTeacherDetailWithServices(teacherId);
    const response = await request({
      url: `${API_PREFIX}/teachers/${teacherId}`,
      method: "GET",
      useMockOnDev: true,
      useMockOnFail: true,
      mockData: { data: mockDataResponse.data }
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/match.api.js:172", "获取老师详细信息失败:", error);
    return { success: false, error };
  }
};
const match = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRecommendedTeachers,
  getTeacherDetail,
  searchTeachers
}, Symbol.toStringTag, { value: "Module" }));
exports.getRecommendedTeachers = getRecommendedTeachers;
exports.getTeacherDetail = getTeacherDetail;
exports.match = match;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/match.api.js.map
