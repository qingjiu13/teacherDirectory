"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  studentsList: [],
  selectedStudent: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
};
const getters = {
  studentsList: (state2) => state2.studentsList,
  selectedStudent: (state2) => state2.selectedStudent,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  pagination: (state2) => state2.pagination
};
const FETCH_STUDENTS_REQUEST = "FETCH_STUDENTS_REQUEST";
const FETCH_STUDENTS_SUCCESS = "FETCH_STUDENTS_SUCCESS";
const FETCH_STUDENTS_FAILURE = "FETCH_STUDENTS_FAILURE";
const SELECT_STUDENT = "SELECT_STUDENT";
const UPDATE_PAGINATION = "UPDATE_PAGINATION";
const mutations = {
  [FETCH_STUDENTS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_STUDENTS_SUCCESS](state2, { students: students2, total }) {
    state2.studentsList = students2;
    state2.pagination.total = total;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_STUDENTS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SELECT_STUDENT](state2, student) {
    state2.selectedStudent = student;
  },
  [UPDATE_PAGINATION](state2, pagination) {
    state2.pagination = { ...state2.pagination, ...pagination };
  }
};
const actions = {
  /**
   * @description 获取教师管理的学生列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 学生列表
   */
  async fetchStudentsList({ commit, state: state2 }, params = {}) {
    var _a, _b;
    const queryParams = {
      page: state2.pagination.current,
      pageSize: state2.pagination.pageSize,
      ...params
    };
    commit(FETCH_STUDENTS_REQUEST);
    try {
      const response = await store_services_index.services.teacher.getStudents(queryParams);
      const { students: students2, total } = response.data;
      commit(FETCH_STUDENTS_SUCCESS, { students: students2, total });
      return response.data;
    } catch (error) {
      commit(FETCH_STUDENTS_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取学生列表失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 选择学生查看详情
   * @param {Object} context - Vuex上下文
   * @param {Object} student - 学生对象
   */
  selectStudent({ commit }, student) {
    commit(SELECT_STUDENT, student);
  },
  /**
   * @description 更新分页信息
   * @param {Object} context - Vuex上下文
   * @param {Object} pagination - 分页信息
   */
  updatePagination({ commit, dispatch }, pagination) {
    commit(UPDATE_PAGINATION, pagination);
    if (pagination.current || pagination.pageSize) {
      dispatch("fetchStudentsList");
    }
  }
};
const students = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.students = students;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/students.js.map
