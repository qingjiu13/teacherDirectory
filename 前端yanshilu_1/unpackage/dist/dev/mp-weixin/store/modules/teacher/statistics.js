"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const state = {
  teachingStats: null,
  studentPerformance: [],
  courseAnalytics: [],
  incomeStats: null,
  timeframeFilter: "month",
  // month, quarter, year
  loading: false,
  error: null
};
const getters = {
  teachingStats: (state2) => state2.teachingStats,
  studentPerformance: (state2) => state2.studentPerformance,
  courseAnalytics: (state2) => state2.courseAnalytics,
  incomeStats: (state2) => state2.incomeStats,
  timeframeFilter: (state2) => state2.timeframeFilter,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error
};
const FETCH_TEACHING_STATS_REQUEST = "FETCH_TEACHING_STATS_REQUEST";
const FETCH_TEACHING_STATS_SUCCESS = "FETCH_TEACHING_STATS_SUCCESS";
const FETCH_TEACHING_STATS_FAILURE = "FETCH_TEACHING_STATS_FAILURE";
const FETCH_STUDENT_PERFORMANCE_REQUEST = "FETCH_STUDENT_PERFORMANCE_REQUEST";
const FETCH_STUDENT_PERFORMANCE_SUCCESS = "FETCH_STUDENT_PERFORMANCE_SUCCESS";
const FETCH_STUDENT_PERFORMANCE_FAILURE = "FETCH_STUDENT_PERFORMANCE_FAILURE";
const FETCH_COURSE_ANALYTICS_REQUEST = "FETCH_COURSE_ANALYTICS_REQUEST";
const FETCH_COURSE_ANALYTICS_SUCCESS = "FETCH_COURSE_ANALYTICS_SUCCESS";
const FETCH_COURSE_ANALYTICS_FAILURE = "FETCH_COURSE_ANALYTICS_FAILURE";
const FETCH_INCOME_STATS_REQUEST = "FETCH_INCOME_STATS_REQUEST";
const FETCH_INCOME_STATS_SUCCESS = "FETCH_INCOME_STATS_SUCCESS";
const FETCH_INCOME_STATS_FAILURE = "FETCH_INCOME_STATS_FAILURE";
const SET_TIMEFRAME_FILTER = "SET_TIMEFRAME_FILTER";
const mutations = {
  [FETCH_TEACHING_STATS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_TEACHING_STATS_SUCCESS](state2, stats) {
    state2.teachingStats = stats;
    state2.loading = false;
  },
  [FETCH_TEACHING_STATS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_STUDENT_PERFORMANCE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_STUDENT_PERFORMANCE_SUCCESS](state2, data) {
    state2.studentPerformance = data;
    state2.loading = false;
  },
  [FETCH_STUDENT_PERFORMANCE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_COURSE_ANALYTICS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_COURSE_ANALYTICS_SUCCESS](state2, data) {
    state2.courseAnalytics = data;
    state2.loading = false;
  },
  [FETCH_COURSE_ANALYTICS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_INCOME_STATS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_INCOME_STATS_SUCCESS](state2, data) {
    state2.incomeStats = data;
    state2.loading = false;
  },
  [FETCH_INCOME_STATS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SET_TIMEFRAME_FILTER](state2, timeframe) {
    state2.timeframeFilter = timeframe;
  }
};
const actions = {
  /**
   * @description 获取教学统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 统计数据
   */
  async fetchTeachingStats({ commit, state: state2 }) {
    var _a, _b;
    commit(FETCH_TEACHING_STATS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getTeachingStats({
        timeframe: state2.timeframeFilter
      });
      commit(FETCH_TEACHING_STATS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取教学统计数据失败";
      commit(FETCH_TEACHING_STATS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取学生表现数据
   * @param {Object} context - Vuex上下文
   * @param {string} [courseId] - 可选的课程ID过滤
   * @returns {Promise<Array>} 学生表现数据
   */
  async fetchStudentPerformance({ commit, state: state2 }, courseId) {
    var _a, _b;
    commit(FETCH_STUDENT_PERFORMANCE_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getStudentPerformance({
        timeframe: state2.timeframeFilter,
        courseId
      });
      commit(FETCH_STUDENT_PERFORMANCE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取学生表现数据失败";
      commit(FETCH_STUDENT_PERFORMANCE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取课程分析数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 课程分析数据
   */
  async fetchCourseAnalytics({ commit, state: state2 }) {
    var _a, _b;
    commit(FETCH_COURSE_ANALYTICS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getCourseAnalytics({
        timeframe: state2.timeframeFilter
      });
      commit(FETCH_COURSE_ANALYTICS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取课程分析数据失败";
      commit(FETCH_COURSE_ANALYTICS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取收入统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 收入统计数据
   */
  async fetchIncomeStats({ commit, state: state2 }) {
    var _a, _b;
    commit(FETCH_INCOME_STATS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getIncomeStats({
        timeframe: state2.timeframeFilter
      });
      commit(FETCH_INCOME_STATS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取收入统计数据失败";
      commit(FETCH_INCOME_STATS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 设置时间范围过滤器
   * @param {Object} context - Vuex上下文
   * @param {string} timeframe - 时间范围(month/quarter/year)
   */
  setTimeframeFilter({ commit }, timeframe) {
    commit(SET_TIMEFRAME_FILTER, timeframe);
  },
  /**
   * @description 加载所有统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  async loadAllStats({ dispatch }) {
    try {
      await Promise.all([
        dispatch("fetchTeachingStats"),
        dispatch("fetchStudentPerformance"),
        dispatch("fetchCourseAnalytics"),
        dispatch("fetchIncomeStats")
      ]);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/teacher/statistics.js:219", "加载统计数据失败:", error);
      return { success: false, error };
    }
  }
};
const statistics = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.statistics = statistics;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/statistics.js.map
