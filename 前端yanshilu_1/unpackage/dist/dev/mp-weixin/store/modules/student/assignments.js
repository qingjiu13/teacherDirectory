"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  pendingAssignments: [],
  // 待完成作业
  completedAssignments: [],
  // 已完成作业
  currentAssignment: null,
  // 当前正在查看的作业
  loading: false,
  error: null
};
const getters = {
  pendingAssignments: (state2) => state2.pendingAssignments,
  completedAssignments: (state2) => state2.completedAssignments,
  currentAssignment: (state2) => state2.currentAssignment,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  /**
   * @description 获取作业总数
   * @returns {Number} 作业总数
   */
  totalAssignments: (state2) => state2.pendingAssignments.length + state2.completedAssignments.length
};
const FETCH_ASSIGNMENTS_REQUEST = "FETCH_ASSIGNMENTS_REQUEST";
const FETCH_ASSIGNMENTS_SUCCESS = "FETCH_ASSIGNMENTS_SUCCESS";
const FETCH_ASSIGNMENTS_FAILURE = "FETCH_ASSIGNMENTS_FAILURE";
const FETCH_ASSIGNMENT_DETAIL_REQUEST = "FETCH_ASSIGNMENT_DETAIL_REQUEST";
const FETCH_ASSIGNMENT_DETAIL_SUCCESS = "FETCH_ASSIGNMENT_DETAIL_SUCCESS";
const FETCH_ASSIGNMENT_DETAIL_FAILURE = "FETCH_ASSIGNMENT_DETAIL_FAILURE";
const SUBMIT_ASSIGNMENT_REQUEST = "SUBMIT_ASSIGNMENT_REQUEST";
const SUBMIT_ASSIGNMENT_SUCCESS = "SUBMIT_ASSIGNMENT_SUCCESS";
const SUBMIT_ASSIGNMENT_FAILURE = "SUBMIT_ASSIGNMENT_FAILURE";
const mutations = {
  [FETCH_ASSIGNMENTS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_ASSIGNMENTS_SUCCESS](state2, { pending, completed }) {
    state2.pendingAssignments = pending || [];
    state2.completedAssignments = completed || [];
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_ASSIGNMENTS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_ASSIGNMENT_DETAIL_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_ASSIGNMENT_DETAIL_SUCCESS](state2, assignment) {
    state2.currentAssignment = assignment;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_ASSIGNMENT_DETAIL_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SUBMIT_ASSIGNMENT_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [SUBMIT_ASSIGNMENT_SUCCESS](state2, assignmentId) {
    const assignmentIndex = state2.pendingAssignments.findIndex((a) => a.id === assignmentId);
    if (assignmentIndex !== -1) {
      const assignment = { ...state2.pendingAssignments[assignmentIndex], status: "completed" };
      state2.completedAssignments.push(assignment);
      state2.pendingAssignments.splice(assignmentIndex, 1);
    }
    state2.loading = false;
  },
  [SUBMIT_ASSIGNMENT_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  }
};
const actions = {
  /**
   * @description 获取待完成的作业列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 待完成作业列表
   */
  async fetchPendingAssignments({ commit }) {
    var _a, _b;
    commit(FETCH_ASSIGNMENTS_REQUEST);
    try {
      const response = await store_services_index.services.student.getAssignments();
      const { pending, completed } = response.data;
      commit(FETCH_ASSIGNMENTS_SUCCESS, { pending, completed });
      return pending;
    } catch (error) {
      commit(FETCH_ASSIGNMENTS_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取作业列表失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取作业详情
   * @param {Object} context - Vuex上下文
   * @param {String} assignmentId - 作业ID
   * @returns {Promise<Object>} 作业详情
   */
  async fetchAssignmentDetail({ commit }, assignmentId) {
    var _a, _b;
    commit(FETCH_ASSIGNMENT_DETAIL_REQUEST);
    try {
      const response = await store_services_index.services.student.getAssignmentDetail(assignmentId);
      commit(FETCH_ASSIGNMENT_DETAIL_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_ASSIGNMENT_DETAIL_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取作业详情失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 提交作业
   * @param {Object} context - Vuex上下文
   * @param {Object} payload - 提交内容
   * @param {String} payload.assignmentId - 作业ID
   * @param {Object} payload.submission - 提交的作业内容
   * @returns {Promise<Object>} 提交结果
   */
  async submitAssignment({ commit }, { assignmentId, submission }) {
    var _a, _b;
    commit(SUBMIT_ASSIGNMENT_REQUEST);
    try {
      const response = await store_services_index.services.student.submitAssignment(assignmentId, submission);
      commit(SUBMIT_ASSIGNMENT_SUCCESS, assignmentId);
      return response.data;
    } catch (error) {
      commit(SUBMIT_ASSIGNMENT_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "提交作业失败");
      return Promise.reject(error);
    }
  }
};
const assignments = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.assignments = assignments;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/student/assignments.js.map
