"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  enrolledCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
};
const getters = {
  enrolledCourses: (state2) => state2.enrolledCourses,
  selectedCourse: (state2) => state2.selectedCourse,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  pagination: (state2) => state2.pagination
};
const FETCH_ENROLLED_COURSES_REQUEST = "FETCH_ENROLLED_COURSES_REQUEST";
const FETCH_ENROLLED_COURSES_SUCCESS = "FETCH_ENROLLED_COURSES_SUCCESS";
const FETCH_ENROLLED_COURSES_FAILURE = "FETCH_ENROLLED_COURSES_FAILURE";
const SELECT_COURSE = "SELECT_COURSE";
const UPDATE_PAGINATION = "UPDATE_PAGINATION";
const mutations = {
  [FETCH_ENROLLED_COURSES_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_ENROLLED_COURSES_SUCCESS](state2, { courses: courses2, total }) {
    state2.enrolledCourses = courses2;
    state2.pagination.total = total;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_ENROLLED_COURSES_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SELECT_COURSE](state2, course) {
    state2.selectedCourse = course;
  },
  [UPDATE_PAGINATION](state2, pagination) {
    state2.pagination = { ...state2.pagination, ...pagination };
  }
};
const actions = {
  /**
   * @description 获取学生已选课程列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 课程列表
   */
  async fetchEnrolledCourses({ commit, state: state2 }, params = {}) {
    var _a, _b;
    const queryParams = {
      page: state2.pagination.current,
      pageSize: state2.pagination.pageSize,
      ...params
    };
    commit(FETCH_ENROLLED_COURSES_REQUEST);
    try {
      const response = await store_services_index.services.student.getEnrolledCourses(queryParams);
      const { courses: courses2, total } = response.data;
      commit(FETCH_ENROLLED_COURSES_SUCCESS, { courses: courses2, total });
      return response.data;
    } catch (error) {
      commit(FETCH_ENROLLED_COURSES_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取已选课程失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 选择课程查看详情
   * @param {Object} context - Vuex上下文
   * @param {Object} course - 课程对象
   */
  selectCourse({ commit }, course) {
    commit(SELECT_COURSE, course);
  },
  /**
   * @description 更新分页信息
   * @param {Object} context - Vuex上下文
   * @param {Object} pagination - 分页信息
   */
  updatePagination({ commit, dispatch }, pagination) {
    commit(UPDATE_PAGINATION, pagination);
    if (pagination.current || pagination.pageSize) {
      dispatch("fetchEnrolledCourses");
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
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/student/courses.js.map
