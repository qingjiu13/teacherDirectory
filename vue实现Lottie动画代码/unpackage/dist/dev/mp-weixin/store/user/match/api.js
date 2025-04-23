"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_index = require("../../../api/index.js");
const getMatchTeachers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        queryParams.append(key, value);
      }
    });
    const url = `${api_index.MATCH_API_BASE_URL}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/match/api.js:46", "获取匹配教师列表失败:", error);
    throw error;
  }
};
const getTeacherDetail = async (teacherId) => {
  try {
    if (!teacherId) {
      throw new Error("教师ID不能为空");
    }
    const url = `${api_index.USER_TEACHER_DETAIL_URL}?id=${teacherId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.selfIntroduction) {
      common_vendor.index.__f__("warn", "at store/user/match/api.js:82", "接口返回的数据中缺少selfIntroduction字段");
    }
    if (!data.service || !Array.isArray(data.service)) {
      common_vendor.index.__f__("warn", "at store/user/match/api.js:86", "接口返回的数据中缺少service字段或格式不正确");
    }
    return data;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/match/api.js:91", "获取教师详情失败:", error);
    throw error;
  }
};
exports.getMatchTeachers = getMatchTeachers;
exports.getTeacherDetail = getTeacherDetail;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/api.js.map
