"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const state = {
  teacherSchedule: [],
  availabilitySettings: null,
  upcomingClasses: [],
  bookingRequests: [],
  selectedDate: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
  loading: false,
  error: null
};
const getters = {
  teacherSchedule: (state2) => state2.teacherSchedule,
  availabilitySettings: (state2) => state2.availabilitySettings,
  upcomingClasses: (state2) => state2.upcomingClasses,
  bookingRequests: (state2) => state2.bookingRequests,
  selectedDate: (state2) => state2.selectedDate,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  // 获取今日课程
  todayClasses: (state2) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
    return state2.teacherSchedule.filter((item) => item.date === today);
  },
  // 获取本周课程
  weekClasses: (state2) => {
    const now = /* @__PURE__ */ new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startDate = startOfWeek.toISOString().substring(0, 10);
    const endDate = endOfWeek.toISOString().substring(0, 10);
    return state2.teacherSchedule.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
  }
};
const FETCH_TEACHER_SCHEDULE_REQUEST = "FETCH_TEACHER_SCHEDULE_REQUEST";
const FETCH_TEACHER_SCHEDULE_SUCCESS = "FETCH_TEACHER_SCHEDULE_SUCCESS";
const FETCH_TEACHER_SCHEDULE_FAILURE = "FETCH_TEACHER_SCHEDULE_FAILURE";
const FETCH_AVAILABILITY_SETTINGS_REQUEST = "FETCH_AVAILABILITY_SETTINGS_REQUEST";
const FETCH_AVAILABILITY_SETTINGS_SUCCESS = "FETCH_AVAILABILITY_SETTINGS_SUCCESS";
const FETCH_AVAILABILITY_SETTINGS_FAILURE = "FETCH_AVAILABILITY_SETTINGS_FAILURE";
const FETCH_UPCOMING_CLASSES_REQUEST = "FETCH_UPCOMING_CLASSES_REQUEST";
const FETCH_UPCOMING_CLASSES_SUCCESS = "FETCH_UPCOMING_CLASSES_SUCCESS";
const FETCH_UPCOMING_CLASSES_FAILURE = "FETCH_UPCOMING_CLASSES_FAILURE";
const FETCH_BOOKING_REQUESTS_REQUEST = "FETCH_BOOKING_REQUESTS_REQUEST";
const FETCH_BOOKING_REQUESTS_SUCCESS = "FETCH_BOOKING_REQUESTS_SUCCESS";
const FETCH_BOOKING_REQUESTS_FAILURE = "FETCH_BOOKING_REQUESTS_FAILURE";
const UPDATE_AVAILABILITY_REQUEST = "UPDATE_AVAILABILITY_REQUEST";
const UPDATE_AVAILABILITY_SUCCESS = "UPDATE_AVAILABILITY_SUCCESS";
const UPDATE_AVAILABILITY_FAILURE = "UPDATE_AVAILABILITY_FAILURE";
const UPDATE_BOOKING_REQUEST_STATUS = "UPDATE_BOOKING_REQUEST_STATUS";
const SET_SELECTED_DATE = "SET_SELECTED_DATE";
const mutations = {
  [FETCH_TEACHER_SCHEDULE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_TEACHER_SCHEDULE_SUCCESS](state2, schedule2) {
    state2.teacherSchedule = schedule2;
    state2.loading = false;
  },
  [FETCH_TEACHER_SCHEDULE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_AVAILABILITY_SETTINGS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_AVAILABILITY_SETTINGS_SUCCESS](state2, settings) {
    state2.availabilitySettings = settings;
    state2.loading = false;
  },
  [FETCH_AVAILABILITY_SETTINGS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_UPCOMING_CLASSES_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_UPCOMING_CLASSES_SUCCESS](state2, classes) {
    state2.upcomingClasses = classes;
    state2.loading = false;
  },
  [FETCH_UPCOMING_CLASSES_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_BOOKING_REQUESTS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_BOOKING_REQUESTS_SUCCESS](state2, requests) {
    state2.bookingRequests = requests;
    state2.loading = false;
  },
  [FETCH_BOOKING_REQUESTS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [UPDATE_AVAILABILITY_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [UPDATE_AVAILABILITY_SUCCESS](state2, settings) {
    state2.availabilitySettings = settings;
    state2.loading = false;
  },
  [UPDATE_AVAILABILITY_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [UPDATE_BOOKING_REQUEST_STATUS](state2, { requestId, status }) {
    const index = state2.bookingRequests.findIndex((req) => req.id === requestId);
    if (index !== -1) {
      state2.bookingRequests[index].status = status;
    }
  },
  [SET_SELECTED_DATE](state2, date) {
    state2.selectedDate = date;
  }
};
const actions = {
  /**
   * @description 获取教师课程安排
   * @param {Object} context - Vuex上下文
   * @param {Object} [params] - 查询参数
   * @returns {Promise<Array>} 课程安排
   */
  async fetchTeacherSchedule({ commit }, params = {}) {
    var _a, _b;
    commit(FETCH_TEACHER_SCHEDULE_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getTeacherSchedule(params);
      commit(FETCH_TEACHER_SCHEDULE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取课程安排失败";
      commit(FETCH_TEACHER_SCHEDULE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取教师可用时间设置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 可用时间设置
   */
  async fetchAvailabilitySettings({ commit }) {
    var _a, _b;
    commit(FETCH_AVAILABILITY_SETTINGS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getAvailabilitySettings();
      commit(FETCH_AVAILABILITY_SETTINGS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取可用时间设置失败";
      commit(FETCH_AVAILABILITY_SETTINGS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取即将到来的课程
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 即将到来的课程
   */
  async fetchUpcomingClasses({ commit }) {
    var _a, _b;
    commit(FETCH_UPCOMING_CLASSES_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getUpcomingClasses();
      commit(FETCH_UPCOMING_CLASSES_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取即将到来的课程失败";
      commit(FETCH_UPCOMING_CLASSES_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取预约请求
   * @param {Object} context - Vuex上下文
   * @param {Object} [params] - 查询参数
   * @returns {Promise<Array>} 预约请求
   */
  async fetchBookingRequests({ commit }, params = {}) {
    var _a, _b;
    commit(FETCH_BOOKING_REQUESTS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getBookingRequests(params);
      commit(FETCH_BOOKING_REQUESTS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取预约请求失败";
      commit(FETCH_BOOKING_REQUESTS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新可用时间设置
   * @param {Object} context - Vuex上下文
   * @param {Object} settings - 可用时间设置
   * @returns {Promise<Object>} 更新结果
   */
  async updateAvailabilitySettings({ commit }, settings) {
    var _a, _b;
    commit(UPDATE_AVAILABILITY_REQUEST);
    try {
      const response = await store_services_index.services.teacher.updateAvailabilitySettings(settings);
      commit(UPDATE_AVAILABILITY_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "更新可用时间设置失败";
      commit(UPDATE_AVAILABILITY_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新预约请求状态
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 参数
   * @param {string} params.requestId - 请求ID
   * @param {string} params.status - 新状态(accepted/rejected)
   * @returns {Promise<Object>} 更新结果
   */
  async updateBookingRequestStatus({ commit }, { requestId, status }) {
    try {
      const response = await store_services_index.services.teacher.updateBookingRequestStatus(requestId, status);
      commit(UPDATE_BOOKING_REQUEST_STATUS, { requestId, status });
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/schedule.js:269", "更新预约请求状态失败:", error);
      return Promise.reject(error);
    }
  },
  /**
   * @description 设置选中日期
   * @param {Object} context - Vuex上下文
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   */
  setSelectedDate({ commit }, date) {
    commit(SET_SELECTED_DATE, date);
  }
};
const schedule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.schedule = schedule;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/schedule.js.map
