"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_API = require("../API.js");
const getMatchTeachers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        queryParams.append(key, value);
      }
    });
    const url = `${store_user_API.MATCH_API_BASE_URL}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
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
    const url = `${store_user_API.USER_TEACHER_DETAIL_URL}?id=${teacherId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/match/api.js:80", "获取教师详情失败:", error);
    throw error;
  }
};
exports.getMatchTeachers = getMatchTeachers;
exports.getTeacherDetail = getTeacherDetail;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/api.js.map
