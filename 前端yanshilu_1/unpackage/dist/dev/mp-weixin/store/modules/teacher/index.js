"use strict";
const store_services_index = require("../../services/index.js");
const store_modules_teacher_students = require("./students.js");
const store_modules_teacher_courses = require("./courses.js");
const store_modules_teacher_statistics = require("./statistics.js");
const store_modules_teacher_schedule = require("./schedule.js");
const state = {
  teacherProfile: null,
  loading: false,
  error: null
};
const getters = {
  teacherProfile: (state2) => state2.teacherProfile,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error
};
const FETCH_TEACHER_PROFILE_REQUEST = "FETCH_TEACHER_PROFILE_REQUEST";
const FETCH_TEACHER_PROFILE_SUCCESS = "FETCH_TEACHER_PROFILE_SUCCESS";
const FETCH_TEACHER_PROFILE_FAILURE = "FETCH_TEACHER_PROFILE_FAILURE";
const LOAD_INITIAL_DATA_REQUEST = "LOAD_INITIAL_DATA_REQUEST";
const LOAD_INITIAL_DATA_SUCCESS = "LOAD_INITIAL_DATA_SUCCESS";
const LOAD_INITIAL_DATA_FAILURE = "LOAD_INITIAL_DATA_FAILURE";
const mutations = {
  [FETCH_TEACHER_PROFILE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_TEACHER_PROFILE_SUCCESS](state2, profile) {
    state2.teacherProfile = profile;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_TEACHER_PROFILE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [LOAD_INITIAL_DATA_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [LOAD_INITIAL_DATA_SUCCESS](state2) {
    state2.loading = false;
  },
  [LOAD_INITIAL_DATA_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  }
};
const actions = {
  /**
   * @description 获取教师专属信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 教师信息
   */
  async fetchTeacherProfile({ commit }) {
    var _a, _b;
    commit(FETCH_TEACHER_PROFILE_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getTeacherProfile();
      commit(FETCH_TEACHER_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_TEACHER_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取教师信息失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 加载教师初始数据（登录后调用）
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  async loadInitialData({ commit, dispatch }) {
    commit(LOAD_INITIAL_DATA_REQUEST);
    try {
      await Promise.all([
        dispatch("fetchTeacherProfile"),
        dispatch("students/fetchStudentsList"),
        dispatch("courses/fetchTeacherCourses"),
        dispatch("schedule/fetchTeacherSchedule")
      ]);
      commit(LOAD_INITIAL_DATA_SUCCESS);
      return { success: true };
    } catch (error) {
      commit(LOAD_INITIAL_DATA_FAILURE, error.message || "加载教师数据失败");
      return { success: false, error };
    }
  }
};
const teacher = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    students: store_modules_teacher_students.students,
    // 学生管理
    courses: store_modules_teacher_courses.courses,
    // 课程管理
    statistics: store_modules_teacher_statistics.statistics,
    // 统计分析
    schedule: store_modules_teacher_schedule.schedule
    // 课程安排
  }
};
exports.teacher = teacher;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/index.js.map
