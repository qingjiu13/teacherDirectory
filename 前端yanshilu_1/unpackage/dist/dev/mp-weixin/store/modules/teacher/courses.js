"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  teacherCourses: [],
  loading: false,
  error: null,
  currentCourse: null,
  stats: {
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    totalStudents: 0
  }
};
const getters = {
  teacherCourses: (state2) => state2.teacherCourses,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  currentCourse: (state2) => state2.currentCourse,
  stats: (state2) => state2.stats
};
const FETCH_TEACHER_COURSES_REQUEST = "FETCH_TEACHER_COURSES_REQUEST";
const FETCH_TEACHER_COURSES_SUCCESS = "FETCH_TEACHER_COURSES_SUCCESS";
const FETCH_TEACHER_COURSES_FAILURE = "FETCH_TEACHER_COURSES_FAILURE";
const SET_CURRENT_COURSE = "SET_CURRENT_COURSE";
const UPDATE_COURSE_REQUEST = "UPDATE_COURSE_REQUEST";
const UPDATE_COURSE_SUCCESS = "UPDATE_COURSE_SUCCESS";
const UPDATE_COURSE_FAILURE = "UPDATE_COURSE_FAILURE";
const CREATE_COURSE_REQUEST = "CREATE_COURSE_REQUEST";
const CREATE_COURSE_SUCCESS = "CREATE_COURSE_SUCCESS";
const CREATE_COURSE_FAILURE = "CREATE_COURSE_FAILURE";
const mutations = {
  [FETCH_TEACHER_COURSES_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_TEACHER_COURSES_SUCCESS](state2, { courses: courses2, stats }) {
    state2.teacherCourses = courses2;
    state2.stats = stats || state2.stats;
    state2.loading = false;
  },
  [FETCH_TEACHER_COURSES_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SET_CURRENT_COURSE](state2, course) {
    state2.currentCourse = course;
  },
  [UPDATE_COURSE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [UPDATE_COURSE_SUCCESS](state2, updatedCourse) {
    const index = state2.teacherCourses.findIndex((c) => c.id === updatedCourse.id);
    if (index !== -1) {
      state2.teacherCourses.splice(index, 1, updatedCourse);
    }
    state2.currentCourse = updatedCourse;
    state2.loading = false;
  },
  [UPDATE_COURSE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [CREATE_COURSE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [CREATE_COURSE_SUCCESS](state2, newCourse) {
    state2.teacherCourses.unshift(newCourse);
    state2.stats.totalCourses++;
    state2.stats.activeCourses++;
    state2.loading = false;
  },
  [CREATE_COURSE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  }
};
const actions = {
  /**
   * @description 获取教师课程列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 课程列表
   */
  async fetchTeacherCourses({ commit }) {
    var _a, _b;
    commit(FETCH_TEACHER_COURSES_REQUEST);
    try {
      const response = await store_services_index.services.course.getTeacherCourses();
      const stats = {
        totalCourses: response.data.length,
        activeCourses: response.data.filter((c) => c.status === "active").length,
        completedCourses: response.data.filter((c) => c.status === "completed").length,
        totalStudents: response.data.reduce((total, course) => {
          var _a2;
          return total + (((_a2 = course.students) == null ? void 0 : _a2.length) || 0);
        }, 0)
      };
      commit(FETCH_TEACHER_COURSES_SUCCESS, {
        courses: response.data,
        stats
      });
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取课程列表失败";
      commit(FETCH_TEACHER_COURSES_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 设置当前课程
   * @param {Object} context - Vuex上下文
   * @param {Object} course - 课程对象
   */
  setCurrentCourse({ commit }, course) {
    commit(SET_CURRENT_COURSE, course);
  },
  /**
   * @description 更新课程信息
   * @param {Object} context - Vuex上下文
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} 更新后的课程
   */
  async updateCourse({ commit }, courseData) {
    var _a, _b;
    commit(UPDATE_COURSE_REQUEST);
    try {
      const response = await store_services_index.services.course.updateCourse(courseData.id, courseData);
      commit(UPDATE_COURSE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "更新课程失败";
      commit(UPDATE_COURSE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  /**
   * @description 创建新课程
   * @param {Object} context - Vuex上下文
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} 创建的课程
   */
  async createCourse({ commit }, courseData) {
    var _a, _b;
    commit(CREATE_COURSE_REQUEST);
    try {
      const response = await store_services_index.services.course.createCourse(courseData);
      commit(CREATE_COURSE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "创建课程失败";
      commit(CREATE_COURSE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  }
};
const courses = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.courses = courses;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/courses.js.map
