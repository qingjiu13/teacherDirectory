"use strict";
const store_user_match_api = require("./api.js");
const actions = {
  /**
   * 根据筛选条件获取匹配的老师列表
   * @param {Object} context - Vuex context对象
   * @param {Object} filters - 筛选条件
   * @param {String} filters.school - 学校筛选
   * @param {String} filters.major - 专业筛选
   * @param {String} filters.sort - 排序方式
   * @returns {Promise} - 返回获取结果的Promise
   */
  getFilteredMatchList({ commit }, filters = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await store_user_match_api.getMatchTeachers(filters);
        commit("SET_MATCH_LIST", result.matchList || []);
        const processedData = (result.matchList || []).map((teacher) => {
          if (!teacher.service) {
            teacher.service = [];
          }
          return teacher;
        });
        resolve({
          success: true,
          data: processedData
        });
      } catch (error) {
        reject({
          success: false,
          message: error.message || "获取老师列表失败",
          error
        });
      }
    });
  },
  /**
   * 获取特定老师的详细信息
   * @param {Object} context - Vuex context对象
   * @param {String} teacherId - 老师ID
   * @returns {Promise} - 返回获取结果的Promise
   */
  getTeacherById({ commit }, teacherId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await store_user_match_api.getTeacherDetail(teacherId);
        commit("UPDATE_TEACHER_DETAIL", {
          id: teacherId,
          detailInfo: result
        });
        resolve({
          success: true,
          data: result
        });
      } catch (error) {
        reject({
          success: false,
          message: error.message || "获取老师详情失败",
          error
        });
      }
    });
  },
  /**
   * 获取教师详细介绍信息（包含自我介绍和服务列表）
   * @param {Object} context - Vuex context对象
   * @param {String} teacherId - 教师ID
   * @returns {Promise} - 返回获取结果的Promise
   */
  getTeacherDetailInfo({ commit }, teacherId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!teacherId) {
          throw new Error("教师ID不能为空");
        }
        const detailData = await store_user_match_api.getTeacherDetail(teacherId);
        commit("UPDATE_TEACHER_DETAIL", {
          id: teacherId,
          detailInfo: detailData
        });
        resolve({
          success: true,
          data: detailData
        });
      } catch (error) {
        reject({
          success: false,
          message: error.message || "获取教师详情失败",
          error
        });
      }
    });
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/actions.js.map
