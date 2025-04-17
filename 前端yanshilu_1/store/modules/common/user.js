/**
 * @description 用户模块 - 处理用户基本信息
 */
import { services } from '../../services';

/**
 * @description 检查是否使用模拟数据
 * @returns {Boolean} 是否使用模拟数据
 */
const isUsingMockData = () => {
  return uni.getStorageSync('use_mock_api') === 'true' || process.env.NODE_ENV === 'development';
};

// 初始状态
const state = {
  profile: {
    avatar: '',         // 用户头像
    nickname: '',       // 昵称
    tags: [],           // 标签
    certTag: '',        // 教师认证标签
    otherTags: [],      // 教师其他标签
    introduction: '',   // 个人介绍
    gender: '',         // 性别
    phone: '',          // 手机号
    wechat: '',         // 微信号
    password: '未设置'    // 密码状态
  },
  role: null,           // 用户角色
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  mockMode: isUsingMockData()
};

// Getters
const getters = {
  profile: state => state.profile,
  isProfileLoaded: state => !!state.profile.nickname,
  loading: state => state.loading,
  error: state => state.error,
  updateLoading: state => state.updateLoading,
  updateError: state => state.updateError,
  isMockMode: state => state.mockMode || isUsingMockData(),
  
  // 基本信息getters
  avatar: state => state.profile.avatar || '',
  nickname: state => state.profile.nickname || '',
  tags: state => state.profile.tags || [],
  introduction: state => state.profile.introduction || '',
  gender: state => state.profile.gender || '',
  phone: state => state.profile.phone || '',
  wechat: state => state.profile.wechat || '',
  password: state => state.profile.password || '未设置',
  
  // 标签相关getters
  teacherCertTag: (state, getters) => {
    if (getters.isTeacher) {
      return state.profile.certTag || 
             (state.profile.tags && state.profile.tags.length > 0 ? state.profile.tags[0] : '');
    }
    return '';
  },
  
  teacherOtherTags: (state, getters) => {
    if (getters.isTeacher) {
      return state.profile.otherTags && state.profile.otherTags.length > 0 ? 
             state.profile.otherTags : 
             (state.profile.tags && state.profile.tags.length > 1 ? state.profile.tags.slice(1) : []);
    }
    return [];
  },
  
  studentTags: (state, getters) => {
    if (getters.isStudent && state.profile.tags) {
      return state.profile.tags;
    }
    return [];
  },
  
  // 角色相关getters
  isTeacher: (state, getters, rootState) => {
    return state.role === 'teacher' || rootState.auth?.role === 'teacher';
  },
  isStudent: (state, getters, rootState) => {
    return state.role === 'student' || rootState.auth?.role === 'student';
  },
  userRole: (state, getters, rootState) => state.role || rootState.auth?.role || ''
};

// 常量类型
const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';
const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
const CLEAR_PROFILE = 'CLEAR_PROFILE';
const SET_USER_ROLE = 'SET_USER_ROLE';

// Mutations
const mutations = {
  [FETCH_PROFILE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_PROFILE_SUCCESS](state, profile) {
    let certTag = '';
    let otherTags = [];
    
    if (state.role === 'teacher' && profile.tags && profile.tags.length > 0) {
      certTag = profile.certTag || profile.tags[0];
      otherTags = profile.otherTags || (profile.tags.length > 1 ? profile.tags.slice(1) : []);
    }
    
    state.profile = {
      ...state.profile,
      avatar: profile.avatar || state.profile.avatar,
      nickname: profile.nickname || profile.name || state.profile.nickname,
      tags: profile.tags || state.profile.tags,
      certTag: certTag,
      otherTags: otherTags,
      introduction: profile.introduction || state.profile.introduction,
      gender: profile.gender || state.profile.gender,
      phone: profile.phone || state.profile.phone,
      wechat: profile.wechat || state.profile.wechat,
      password: profile.hasPassword ? '已设置' : '未设置'
    };
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
    state.profile = { 
      ...state.profile, 
      ...profile,
      password: profile.hasPassword ? '已设置' : '未设置'
    };
    state.updateLoading = false;
    state.updateError = null;
  },
  [UPDATE_PROFILE_FAILURE](state, error) {
    state.updateLoading = false;
    state.updateError = error;
  },
  [CLEAR_PROFILE](state) {
    state.profile = {
      avatar: '',
      nickname: '',
      tags: [],
      introduction: '',
      gender: '',
      phone: '',
      wechat: '',
      password: '未设置'
    };
    state.role = null;
  },
  [SET_USER_ROLE](state, role) {
    state.role = role;
  }
};

// 获取用户角色的辅助函数
const getUserRole = (state, rootState) => {
  let role = uni.getStorageSync('userRole');
  if (!role) {
    role = rootState.auth?.role || 'student';
  }
  return role;
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
      const role = getUserRole(null, rootState);
      commit(SET_USER_ROLE, role);
      
      const response = await services.user.getUserProfile(role);
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
  async updateProfile({ commit, state, rootState }, profileData) {
    commit(UPDATE_PROFILE_REQUEST);
    
    try {
      const role = getUserRole(state, rootState);
      commit(SET_USER_ROLE, role);
      
      const response = await services.user.updateUserProfile(role, profileData);
      commit(UPDATE_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, error.response?.data?.message || '更新个人资料失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 清除用户个人资料
   * @param {Object} context - Vuex上下文
   */
  clearProfile({ commit }) {
    commit(CLEAR_PROFILE);
  },
  
  /**
   * @description 设置密码
   * @param {Object} context - Vuex上下文
   * @param {Object} passwordData - 密码数据
   * @returns {Promise<Object>} 设置结果
   */
  async setPassword({ commit, state, rootState }, passwordData) {
    commit(UPDATE_PROFILE_REQUEST);
    
    try {
      const role = getUserRole(state, rootState);
      
      const response = await services.user.setUserPassword(role, passwordData);
      commit(UPDATE_PROFILE_SUCCESS, { hasPassword: true });
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, error.response?.data?.message || '设置密码失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 切换用户角色
   * @param {Object} context - Vuex上下文
   * @param {String} newRole - 新角色
   * @returns {Promise<Object>} 切换结果
   */
  async switchRole({ commit, dispatch, rootState }, newRole) {
    if (newRole !== 'teacher' && newRole !== 'student') {
      return Promise.reject(new Error('无效的角色'));
    }
    
    try {
      const currentRole = getUserRole(null, rootState);
      
      const response = await services.user.switchUserRole(currentRole, newRole);
      
      uni.setStorageSync('userRole', newRole);
      commit(SET_USER_ROLE, newRole);
      
      await dispatch('fetchProfile');
      
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 更新教师认证标签
   * @param {Object} context - Vuex上下文
   * @param {String} certTag - 认证标签
   * @returns {Promise<Object>} 更新结果
   */
  async updateTeacherCertTag({ state, dispatch }, certTag) {
    if (state.role !== 'teacher') {
      return Promise.reject(new Error('只有教师可以设置认证标签'));
    }
    
    try {
      const profileData = {
        certTag: certTag,
        otherTags: state.profile.otherTags || 
                  (state.profile.tags && state.profile.tags.length > 1 ? 
                   state.profile.tags.slice(1) : [])
      };
      
      return await dispatch('updateProfile', profileData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 更新教师其他标签
   * @param {Object} context - Vuex上下文
   * @param {Array} otherTags - 其他标签数组
   * @returns {Promise<Object>} 更新结果
   */
  async updateTeacherOtherTags({ state, dispatch }, otherTags) {
    if (state.role !== 'teacher') {
      return Promise.reject(new Error('只有教师可以设置其他标签'));
    }
    
    try {
      const profileData = {
        certTag: state.profile.certTag || 
                (state.profile.tags && state.profile.tags.length > 0 ? 
                 state.profile.tags[0] : ''),
        otherTags: otherTags
      };
      
      return await dispatch('updateProfile', profileData);
    } catch (error) {
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