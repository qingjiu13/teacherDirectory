/**
 * @description 学生模块入口文件 - 汇总所有学生特有功能
 */
import { services } from '../../services';
import courses from './courses';
import learning from './learning';
import assignments from './assignments';

// 初始状态
const state = {
  studentProfile: null,
  loading: false,
  error: null
};

// Getters
const getters = {
  studentProfile: state => state.studentProfile,
  loading: state => state.loading,
  error: state => state.error
};

// 引入常量类型
const FETCH_STUDENT_PROFILE_REQUEST = 'FETCH_STUDENT_PROFILE_REQUEST';
const FETCH_STUDENT_PROFILE_SUCCESS = 'FETCH_STUDENT_PROFILE_SUCCESS';
const FETCH_STUDENT_PROFILE_FAILURE = 'FETCH_STUDENT_PROFILE_FAILURE';
const LOAD_INITIAL_DATA_REQUEST = 'LOAD_INITIAL_DATA_REQUEST';
const LOAD_INITIAL_DATA_SUCCESS = 'LOAD_INITIAL_DATA_SUCCESS';
const LOAD_INITIAL_DATA_FAILURE = 'LOAD_INITIAL_DATA_FAILURE';

// Mutations
const mutations = {
  [FETCH_STUDENT_PROFILE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_STUDENT_PROFILE_SUCCESS](state, profile) {
    state.studentProfile = profile;
    state.loading = false;
    state.error = null;
  },
  [FETCH_STUDENT_PROFILE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [LOAD_INITIAL_DATA_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [LOAD_INITIAL_DATA_SUCCESS](state) {
    state.loading = false;
  },
  [LOAD_INITIAL_DATA_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  }
};

// Actions
const actions = {
  /**
   * @description 获取学生专属信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 学生信息
   */
  async fetchStudentProfile({ commit }) {
    commit(FETCH_STUDENT_PROFILE_REQUEST);
    
    try {
      const response = await services.student.getStudentProfile();
      commit(FETCH_STUDENT_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_STUDENT_PROFILE_FAILURE, error.response?.data?.message || '获取学生信息失败');
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
      // 并行加载各种学生数据
      await Promise.all([
        dispatch('fetchStudentProfile'),
        dispatch('courses/fetchEnrolledCourses'),
        dispatch('assignments/fetchPendingAssignments')
      ]);
      
      commit(LOAD_INITIAL_DATA_SUCCESS);
      return { success: true };
    } catch (error) {
      commit(LOAD_INITIAL_DATA_FAILURE, error.message || '加载学生数据失败');
      return { success: false, error };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    courses,      // 已选课程管理
    learning,     // 学习进度
    assignments   // 作业管理
  }
};