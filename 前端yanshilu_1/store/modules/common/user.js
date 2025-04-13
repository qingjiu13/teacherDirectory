/**
 * @description 用户模块 - 处理用户基本信息（老师和学生共用）
 */
import { services } from '../../services';

/**
 * @description 检查是否使用模拟数据
 * @returns {Boolean} 是否使用模拟数据
 * 
 * TODO: 将来替换为真实API时，可以直接删除此方法，
 * 或者始终返回false
 */
const isUsingMockData = () => {
  // 明确检查本地存储中的设置
  const storageSetting = uni.getStorageSync('use_mock_api');
  
  if (storageSetting === 'true') {
    console.log('用户模块: 本地存储设置使用模拟数据');
    return true;
  }
  
  // 如果本地存储没有设置，则使用环境判断
  return process.env.NODE_ENV === 'development';
};

// 初始状态
const state = {
  profile: {
    avatar: '',         // 用户头像
    nickname: '',       // 昵称
    tags: [],           // 标签
    introduction: '',   // 个人介绍
    gender: '',         // 性别，可以是 'male'/'female'
    phone: '',          // 手机号
    wechat: '',         // 微信号
    password: '未设置'    // 密码状态
  },
  role: null,           // 用户角色: 'teacher' 或 'student'
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  mockMode: isUsingMockData() // 添加模拟模式状态
};

// Getters
const getters = {
  profile: state => state.profile,
  isProfileLoaded: state => !!state.profile.nickname, // 通过昵称判断资料是否加载
  loading: state => state.loading,
  error: state => state.error,
  updateLoading: state => state.updateLoading,
  updateError: state => state.updateError,
  
  /**
   * @description 判断是否使用模拟数据
   * @param {Object} state - 当前模块状态
   * @returns {Boolean} 是否使用模拟数据
   */
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
  
  /**
   * @description 判断用户是否为老师
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {Boolean} 是否为老师
   */
  isTeacher: (state, getters, rootState) => {
    // 优先使用本模块存储的角色信息，如果没有则从rootState获取
    return state.role === 'teacher' || rootState.auth?.role === 'teacher';
  },
  /**
   * @description 判断用户是否为学生（非老师）
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {Boolean} 是否为学生
   */
  isStudent: (state, getters, rootState) => {
    // 优先使用本模块存储的角色信息，如果没有则从rootState获取
    return state.role === 'student' || rootState.auth?.role === 'student';
  },
  /**
   * @description 获取用户角色
   * @param {Object} state - 当前模块状态
   * @param {Object} getters - 当前模块的getters
   * @param {Object} rootState - 根状态
   * @returns {String} 用户角色
   */
  userRole: (state, getters, rootState) => state.role || rootState.auth?.role || ''
};

// 引入常量类型
const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';
const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';
const CLEAR_PROFILE = 'CLEAR_PROFILE';
const SET_USER_ROLE = 'SET_USER_ROLE'; // 新增: 设置用户角色

// Mutations
const mutations = {
  [FETCH_PROFILE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_PROFILE_SUCCESS](state, profile) {
    state.profile = {
      ...state.profile,
      avatar: profile.avatar || state.profile.avatar,
      nickname: profile.nickname || profile.name || state.profile.nickname,
      tags: profile.tags || state.profile.tags,
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
    state.role = null; // 清除角色信息
  },
  /**
   * @description 设置用户角色
   * @param {Object} state - 当前模块状态
   * @param {String} role - 用户角色
   */
  [SET_USER_ROLE](state, role) {
    state.role = role;
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
      // 优先从本地存储获取用户角色，如果没有再从rootState.auth获取
      let role = uni.getStorageSync('userRole');
      if (!role) {
        role = rootState.auth?.role || 'student'; // 默认为学生角色
      }
      
      console.log('fetchProfile使用的角色:', role);
      
      // 同步设置用户角色
      commit(SET_USER_ROLE, role);
      
      // 调用user.api.js中的getUserProfile方法获取用户资料
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
  async updateProfile({ commit, rootState }, profileData) {
    commit(UPDATE_PROFILE_REQUEST);
    
    try {
      // 优先从本地存储获取用户角色，如果没有再从rootState.auth获取
      let role = uni.getStorageSync('userRole');
      if (!role) {
        role = rootState.auth?.role || 'student'; // 默认为学生角色
      }
      
      console.log('updateProfile使用的角色:', role);
      
      // 同步设置用户角色
      commit(SET_USER_ROLE, role);
      
      // 调用user.api.js中的updateUserProfile方法更新用户资料
      const response = await services.user.updateUserProfile(role, profileData);
      
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
      // 优先从本地存储获取用户角色，如果没有再从rootState.auth获取
      let role = uni.getStorageSync('userRole');
      if (!role) {
        role = rootState.auth?.role || 'student'; // 默认为学生角色
      }
      
      console.log('setPassword使用的角色:', role);
      
      // 调用user.api.js中的setUserPassword方法设置密码
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
      // 优先从本地存储获取当前角色，如果没有再从rootState.auth获取
      let currentRole = uni.getStorageSync('userRole');
      if (!currentRole) {
        currentRole = rootState.auth?.role || 'student'; // 默认为学生角色
      }
      
      console.log('从当前角色切换:', currentRole, '到:', newRole);
      
      // 获取当前模拟数据设置，确保切换角色后保持一致
      const useMockData = uni.getStorageSync('use_mock_api') === 'true';
      console.log('当前模拟数据设置:', useMockData ? '启用' : '禁用');
      
      // 调用user.api.js中的switchUserRole方法切换角色
      const response = await services.user.switchUserRole(currentRole, newRole);
      
      // 保存角色到本地存储，以便应用重启后保持状态
      uni.setStorageSync('userRole', newRole);
      
      // 确保模拟数据设置保持不变
      if (useMockData) {
        uni.setStorageSync('use_mock_api', 'true');
      }
      
      // 提交状态更新
      commit(SET_USER_ROLE, newRole);
      
      // 刷新用户资料，以获取对应角色的资料
      await dispatch('fetchProfile');
      
      return response.data;
    } catch (error) {
      console.error('切换角色失败:', error);
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