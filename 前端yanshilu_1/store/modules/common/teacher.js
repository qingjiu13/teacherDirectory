/**
 * @description 老师详情功能Vuex模块
 * 获取和管理老师详细信息
 */

import { match, mock } from '../../services';

// 初始状态
const state = {
  // 老师基本信息
  teacherInfo: {
    id: null,
    nickname: '',
    avatar: '',
    school: '',
    major: '',
    score: '',
    tags: [],
    introduction: ''
  },
  
  // 老师服务列表
  services: [],
  
  // 加载状态
  loading: false,
  error: null
};

// Getters
const getters = {
  /**
   * @description 获取老师详情
   * @param {Object} state - Vuex状态
   * @returns {Object} 老师详情
   */
  teacherInfo: state => state.teacherInfo,
  
  /**
   * @description 获取老师服务列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 服务列表
   */
  services: state => state.services,
  
  /**
   * @description 获取加载状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载
   */
  isLoading: state => state.loading,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: state => state.error
};

// 引入常量类型
const SET_TEACHER_INFO = 'SET_TEACHER_INFO';
const SET_SERVICES = 'SET_SERVICES';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const RESET_TEACHER = 'RESET_TEACHER';

// Mutations
const mutations = {
  [SET_TEACHER_INFO](state, teacherInfo) {
    state.teacherInfo = teacherInfo;
  },
  
  [SET_SERVICES](state, services) {
    state.services = services;
  },
  
  [SET_LOADING](state, loading) {
    state.loading = loading;
  },
  
  [SET_ERROR](state, error) {
    state.error = error;
  },
  
  [RESET_TEACHER](state) {
    state.teacherInfo = {
      id: null,
      nickname: '',
      avatar: '',
      school: '',
      major: '',
      score: '',
      tags: [],
      introduction: ''
    };
    state.services = [];
  }
};

// Actions
const actions = {
  /**
   * @description 获取老师详情和服务列表（合并API）
   * @param {Object} context - Vuex上下文
   * @param {Number} teacherId - 老师ID
   * @returns {Promise<Object>} 结果对象
   */
  async getTeacherInfo({ commit, rootState }, teacherId) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      
      // 尝试从match模块中找到这个老师的基本信息
      let teacherBasicInfo = null;
      
      if (rootState.match && rootState.match.teachers) {
        teacherBasicInfo = rootState.match.teachers.find(t => t.id === parseInt(teacherId));
      }
      
      // API调用 - match.api.js会根据环境自动选择真实API或模拟数据
      const response = await match.getTeacherDetail(teacherId);
      
      if (!response.success) {
        throw response.error || { message: '获取老师详情失败' };
      }
      
      // 从API响应中提取老师信息和服务列表
      const teacherDetail = response.data.teacher;
      const services = response.data.services || [];
      
      // 更新state
      commit(SET_TEACHER_INFO, teacherDetail);
      commit(SET_SERVICES, services);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('获取老师详情失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  
  /**
   * @description 重置老师信息
   * @param {Object} context - Vuex上下文
   */
  resetTeacher({ commit }) {
    commit(RESET_TEACHER);
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
  },
  
  /**
   * @description 初始化老师模块数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async loadInitialData({ commit }) {
    // 在这里可以加载一些基础数据
    // 重置状态以确保初始化
    commit(RESET_TEACHER);
    
    return { success: true };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 