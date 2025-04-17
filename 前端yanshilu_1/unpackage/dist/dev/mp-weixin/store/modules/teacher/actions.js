"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_teacher_api = require("../../services/teacher.api.js");
const actions = {
  /**
   * @description 获取老师列表
   * @param {Object} context - Vuex上下文
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 操作结果
   */
  async fetchTeachers({ commit, state }, filters = {}) {
    try {
      if (filters) {
        commit("UPDATE_FILTERS", filters);
      }
      commit("SET_LOADING", { teachers: true });
      commit("CLEAR_ERROR");
      const response = await store_services_teacher_api.getTeachers(state.filters);
      if (response.success) {
        commit("SET_TEACHERS", response.data.list);
        commit("SET_PAGINATION", response.data.pagination);
        commit("SET_LOADING", { teachers: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "获取老师列表失败");
        commit("SET_LOADING", { teachers: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/actions.js:43", "获取老师列表失败:", error);
      commit("SET_ERROR", error.message || "获取老师列表过程中发生错误");
      commit("SET_LOADING", { teachers: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 重置筛选条件并获取老师列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 操作结果
   */
  async resetFiltersAndFetchTeachers({ commit, dispatch }) {
    commit("RESET_FILTERS");
    return dispatch("fetchTeachers");
  },
  /**
   * @description 获取老师详情
   * @param {Object} context - Vuex上下文
   * @param {string} teacherId - 老师ID
   * @returns {Promise<Object>} 操作结果
   */
  async fetchTeacherDetail({ commit }, teacherId) {
    try {
      commit("SET_LOADING", { teacher: true });
      commit("CLEAR_ERROR");
      const response = await store_services_teacher_api.getTeacherDetail(teacherId);
      if (response.success) {
        commit("SET_CURRENT_TEACHER", response.data);
        commit("SET_LOADING", { teacher: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "获取老师详情失败");
        commit("SET_LOADING", { teacher: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/actions.js:83", "获取老师详情失败:", error);
      commit("SET_ERROR", error.message || "获取老师详情过程中发生错误");
      commit("SET_LOADING", { teacher: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 预约老师
   * @param {Object} context - Vuex上下文
   * @param {Object} bookingInfo - 预约信息
   * @returns {Promise<Object>} 操作结果
   */
  async bookTeacher({ commit, dispatch }, bookingInfo) {
    try {
      commit("SET_LOADING", { booking: true });
      commit("CLEAR_ERROR");
      const response = await store_services_teacher_api.bookTeacher(bookingInfo);
      if (response.success) {
        commit("ADD_BOOKING", response.data);
        dispatch("fetchBookings");
        commit("SET_LOADING", { booking: false });
        return { success: true, data: response.data, message: response.message };
      } else {
        commit("SET_ERROR", response.message || "预约老师失败");
        commit("SET_LOADING", { booking: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/actions.js:118", "预约老师失败:", error);
      commit("SET_ERROR", error.message || "预约老师过程中发生错误");
      commit("SET_LOADING", { booking: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 获取预约列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 操作结果
   */
  async fetchBookings({ commit, rootState }, params = {}) {
    try {
      commit("SET_LOADING", { bookings: true });
      commit("CLEAR_ERROR");
      const role = rootState.user.role;
      const queryParams = { role, ...params };
      const response = await store_services_teacher_api.getBookings(queryParams);
      if (response.success) {
        commit("SET_BOOKINGS", response.data);
        commit("SET_LOADING", { bookings: false });
        return { success: true, data: response.data };
      } else {
        commit("SET_ERROR", response.message || "获取预约列表失败");
        commit("SET_LOADING", { bookings: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/actions.js:152", "获取预约列表失败:", error);
      commit("SET_ERROR", error.message || "获取预约列表过程中发生错误");
      commit("SET_LOADING", { bookings: false });
      return { success: false, message: error.message };
    }
  },
  /**
   * @description 更新预约状态
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 参数
   * @param {string} params.id - 预约ID
   * @param {string} params.status - 预约状态
   * @returns {Promise<Object>} 操作结果
   */
  async updateBookingStatus({ commit, dispatch }, { id, status }) {
    try {
      commit("SET_LOADING", { booking: true });
      setTimeout(() => {
      }, 300);
      commit("UPDATE_BOOKING_STATUS", { id, status });
      await dispatch("fetchBookings");
      commit("SET_LOADING", { booking: false });
      return { success: true, message: "预约状态已更新" };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/actions.js:184", "更新预约状态失败:", error);
      commit("SET_ERROR", error.message || "更新预约状态过程中发生错误");
      commit("SET_LOADING", { booking: false });
      return { success: false, message: error.message };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/actions.js.map
