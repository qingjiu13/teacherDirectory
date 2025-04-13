"use strict";
const store_services_index = require("../../services/index.js");
const store_modules_student_courses = require("./courses.js");
const store_modules_student_learning = require("./learning.js");
const state = {
  studentProfile: null,
  loading: false,
  error: null
};
const getters = {
  studentProfile: (state2) => state2.studentProfile,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error
};
const FETCH_STUDENT_PROFILE_REQUEST = "FETCH_STUDENT_PROFILE_REQUEST";
const FETCH_STUDENT_PROFILE_SUCCESS = "FETCH_STUDENT_PROFILE_SUCCESS";
const FETCH_STUDENT_PROFILE_FAILURE = "FETCH_STUDENT_PROFILE_FAILURE";
const LOAD_INITIAL_DATA_REQUEST = "LOAD_INITIAL_DATA_REQUEST";
const LOAD_INITIAL_DATA_SUCCESS = "LOAD_INITIAL_DATA_SUCCESS";
const LOAD_INITIAL_DATA_FAILURE = "LOAD_INITIAL_DATA_FAILURE";
const mutations = {
  [FETCH_STUDENT_PROFILE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_STUDENT_PROFILE_SUCCESS](state2, profile) {
    state2.studentProfile = profile;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_STUDENT_PROFILE_FAILURE](state2, error) {
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
   * @description 获取学生专属信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 学生信息
   */
  async fetchStudentProfile({ commit }) {
    var _a, _b;
    commit(FETCH_STUDENT_PROFILE_REQUEST);
    try {
      const response = await store_services_index.services.student.getStudentProfile();
      commit(FETCH_STUDENT_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_STUDENT_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取学生信息失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 加载学生初始数据（登录后调用）
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  async loadInitialData({ commit, dispatch }) {
    commit(LOAD_INITIAL_DATA_REQUEST);
    try {
      await Promise.all([
        dispatch("fetchStudentProfile"),
        dispatch("courses/fetchEnrolledCourses")
      ]);
      commit(LOAD_INITIAL_DATA_SUCCESS);
      return { success: true };
    } catch (error) {
      commit(LOAD_INITIAL_DATA_FAILURE, error.message || "加载学生数据失败");
      return { success: false, error };
    }
  }
};
const student = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    courses: store_modules_student_courses.courses,
    // 已选课程管理
    learning: store_modules_student_learning.learning
    // 学习进度
  }
};
exports.student = student;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/student/index.js.map
