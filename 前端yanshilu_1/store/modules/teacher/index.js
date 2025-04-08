/**
 * @description 教师模块入口文件 - 汇总所有教师特有功能
 */
import { services } from '../../services';
import students from './students';
import courses from './courses';
import statistics from './statistics';
import schedule from './schedule';

// 初始状态
const state = {
  teacherProfile: null,
  loading: false,
  error: null
};

// Getters
const getters = {
  teacherProfile: state => state.teacherProfile,
  loading: state => state.loading,
  error: state => state.error
};

// 引入常量类型
const FETCH_TEACHER_PROFILE_REQUEST = 'FETCH_TEACHER_PROFILE_REQUEST';
const FETCH_TEACHER_PROFILE_SUCCESS = 'FETCH_TEACHER_PROFILE_SUCCESS';
const FETCH_TEACHER_PROFILE_FAILURE = 'FETCH_TEACHER_PROFILE_FAILURE';
const LOAD_INITIAL_DATA_REQUEST = 'LOAD_INITIAL_DATA_REQUEST';
const LOAD_INITIAL_DATA_SUCCESS = 'LOAD_INITIAL_DATA_SUCCESS';
const LOAD_INITIAL_DATA_FAILURE = 'LOAD_INITIAL_DATA_FAILURE';

// Mutations
const mutations = {
  [FETCH_TEACHER_PROFILE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_TEACHER_PROFILE_SUCCESS](state, profile) {
    state.teacherProfile = profile;
    state.loading = false;
    state.error = null;
  },
  [FETCH_TEACHER_PROFILE_FAILURE](state, error) {
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
   * @description 获取教师专属信息
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 教师信息
   */
  async fetchTeacherProfile({ commit }) {
    commit(FETCH_TEACHER_PROFILE_REQUEST);
    
    try {
      const response = await services.teacher.getTeacherProfile();
      commit(FETCH_TEACHER_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_TEACHER_PROFILE_FAILURE, error.response?.data?.message || '获取教师信息失败');
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
      // 并行加载各种教师数据
      await Promise.all([
        dispatch('fetchTeacherProfile'),
        dispatch('students/fetchStudentsList'),
        dispatch('courses/fetchTeacherCourses'),
        dispatch('schedule/fetchTeacherSchedule')
      ]);
      
      commit(LOAD_INITIAL_DATA_SUCCESS);
      return { success: true };
    } catch (error) {
      commit(LOAD_INITIAL_DATA_FAILURE, error.message || '加载教师数据失败');
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
    students,    // 学生管理
    courses,     // 课程管理
    statistics,  // 统计分析
    schedule     // 课程安排
  }
};
