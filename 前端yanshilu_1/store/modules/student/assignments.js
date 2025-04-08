/**
 * @description 学生作业管理模块
 */
import { services } from '../../services';

// 初始状态
const state = {
  pendingAssignments: [],  // 待完成作业
  completedAssignments: [], // 已完成作业
  currentAssignment: null, // 当前正在查看的作业
  loading: false,
  error: null
};

// Getters
const getters = {
  pendingAssignments: state => state.pendingAssignments,
  completedAssignments: state => state.completedAssignments,
  currentAssignment: state => state.currentAssignment,
  loading: state => state.loading,
  error: state => state.error,
  
  /**
   * @description 获取作业总数
   * @returns {Number} 作业总数
   */
  totalAssignments: state => state.pendingAssignments.length + state.completedAssignments.length
};

// 引入常量类型
const FETCH_ASSIGNMENTS_REQUEST = 'FETCH_ASSIGNMENTS_REQUEST';
const FETCH_ASSIGNMENTS_SUCCESS = 'FETCH_ASSIGNMENTS_SUCCESS';
const FETCH_ASSIGNMENTS_FAILURE = 'FETCH_ASSIGNMENTS_FAILURE';
const FETCH_ASSIGNMENT_DETAIL_REQUEST = 'FETCH_ASSIGNMENT_DETAIL_REQUEST';
const FETCH_ASSIGNMENT_DETAIL_SUCCESS = 'FETCH_ASSIGNMENT_DETAIL_SUCCESS';
const FETCH_ASSIGNMENT_DETAIL_FAILURE = 'FETCH_ASSIGNMENT_DETAIL_FAILURE';
const SUBMIT_ASSIGNMENT_REQUEST = 'SUBMIT_ASSIGNMENT_REQUEST';
const SUBMIT_ASSIGNMENT_SUCCESS = 'SUBMIT_ASSIGNMENT_SUCCESS';
const SUBMIT_ASSIGNMENT_FAILURE = 'SUBMIT_ASSIGNMENT_FAILURE';

// Mutations
const mutations = {
  [FETCH_ASSIGNMENTS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_ASSIGNMENTS_SUCCESS](state, { pending, completed }) {
    state.pendingAssignments = pending || [];
    state.completedAssignments = completed || [];
    state.loading = false;
    state.error = null;
  },
  [FETCH_ASSIGNMENTS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_ASSIGNMENT_DETAIL_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_ASSIGNMENT_DETAIL_SUCCESS](state, assignment) {
    state.currentAssignment = assignment;
    state.loading = false;
    state.error = null;
  },
  [FETCH_ASSIGNMENT_DETAIL_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SUBMIT_ASSIGNMENT_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [SUBMIT_ASSIGNMENT_SUCCESS](state, assignmentId) {
    // 将提交的作业从待完成移动到已完成
    const assignmentIndex = state.pendingAssignments.findIndex(a => a.id === assignmentId);
    if (assignmentIndex !== -1) {
      const assignment = {...state.pendingAssignments[assignmentIndex], status: 'completed'};
      state.completedAssignments.push(assignment);
      state.pendingAssignments.splice(assignmentIndex, 1);
    }
    state.loading = false;
  },
  [SUBMIT_ASSIGNMENT_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  }
};

// Actions
const actions = {
  /**
   * @description 获取待完成的作业列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 待完成作业列表
   */
  async fetchPendingAssignments({ commit }) {
    commit(FETCH_ASSIGNMENTS_REQUEST);
    
    try {
      const response = await services.student.getAssignments();
      const { pending, completed } = response.data;
      
      commit(FETCH_ASSIGNMENTS_SUCCESS, { pending, completed });
      return pending;
    } catch (error) {
      commit(FETCH_ASSIGNMENTS_FAILURE, error.response?.data?.message || '获取作业列表失败');
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
    commit(FETCH_ASSIGNMENT_DETAIL_REQUEST);
    
    try {
      const response = await services.student.getAssignmentDetail(assignmentId);
      commit(FETCH_ASSIGNMENT_DETAIL_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_ASSIGNMENT_DETAIL_FAILURE, error.response?.data?.message || '获取作业详情失败');
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
    commit(SUBMIT_ASSIGNMENT_REQUEST);
    
    try {
      const response = await services.student.submitAssignment(assignmentId, submission);
      commit(SUBMIT_ASSIGNMENT_SUCCESS, assignmentId);
      return response.data;
    } catch (error) {
      commit(SUBMIT_ASSIGNMENT_FAILURE, error.response?.data?.message || '提交作业失败');
      return Promise.reject(error);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 