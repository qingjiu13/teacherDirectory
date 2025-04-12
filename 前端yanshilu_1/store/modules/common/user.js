/**
 * @description 用户模块 - 处理用户基本信息（老师和学生共用）
 */
import { services } from '../../services';

// 初始状态
const state = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
};

// Getters
const getters = {
  profile: state => state.profile,
  isProfileLoaded: state => !!state.profile,
  loading: state => state.loading,
  error: state => state.error,
  updateLoading: state => state.updateLoading,
  updateError: state => state.updateError,
  displayName: state => state.profile?.name || '',
  avatar: state => state.profile?.avatar || '',
  email: state => state.profile?.email || ''
};

// 引入常量类型
const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';
const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
const CLEAR_PROFILE = 'CLEAR_PROFILE';

// Mutations
const mutations = {
  [FETCH_PROFILE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_PROFILE_SUCCESS](state, profile) {
    state.profile = profile;
    state.loading = false;
    state.error = null;
  },
  [FETCH_PROFILE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [UPDATE_PROFILE_REQUEST](state) {
    state.updateLoading = true;
    state.updateError = null;
  },
  [UPDATE_PROFILE_SUCCESS](state, profile) {
    state.profile = { ...state.profile, ...profile };
    state.updateLoading = false;
    state.updateError = null;
  },
  [UPDATE_PROFILE_FAILURE](state, error) {
    state.updateLoading = false;
    state.updateError = error;
  },
  [CLEAR_PROFILE](state) {
    state.profile = null;
  }
};

// Actions
const actions = {
  /**
   * @description 获取用户个人资料
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 个人资料
   */
  async fetchProfile({ commit, rootState }) {
    commit(FETCH_PROFILE_REQUEST);
    
    try {
      // 根据用户角色调用不同的API
      let response;
      const { role } = rootState.auth;
      
      if (role === 'teacher') {
        response = await services.teacher.getTeacherProfile();
      } else if (role === 'student') {
        response = await services.student.getStudentProfile();
      } else {
        throw new Error('未知的用户角色');
      }
      
      commit(FETCH_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_PROFILE_FAILURE, error.response?.data?.message || '获取个人资料失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 更新用户个人资料
   * @param {Object} context - Vuex上下文
   * @param {Object} profileData - 个人资料数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile({ commit, rootState }, profileData) {
    commit(UPDATE_PROFILE_REQUEST);
    
    try {
      // 根据用户角色调用不同的API
      let response;
      const { role } = rootState.auth;
      
      if (role === 'teacher') {
        response = await services.teacher.updateTeacherProfile(profileData);
      } else {
        response = await services.student.updateStudentProfile(profileData);
      } 
      
      commit(UPDATE_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, error.response?.data?.message || '更新个人资料失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 清除用户个人资料（通常在登出时调用）
   * @param {Object} context - Vuex上下文
   */
  clearProfile({ commit }) {
    commit(CLEAR_PROFILE);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 