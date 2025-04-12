/**
 * @description 匹配功能Vuex模块
 * 老师和学生身份共享的匹配功能
 */

import { match, mock } from '../../services';

// 本地存储键名
const FILTERS_STORAGE_KEY = 'match_filters';
const NAVIGATION_TYPE_KEY = 'match_navigation_type';

// 导航类型常量
const NAV_TYPE = {
  DEFAULT: 'default',       // 默认导航（普通退出）
  CHAT: 'chat',             // 前往聊天页面
  TEACHER_DETAIL: 'detail'  // 前往老师详情页面
};

// 尝试从本地存储加载筛选条件
const getSavedFilters = () => {
  try {
    const savedFilters = uni.getStorageSync(FILTERS_STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : { school: '', major: '', keyword: '' };
  } catch (e) {
    console.error('获取保存的筛选条件失败', e);
    return { school: '', major: '', keyword: '' };
  }
};

// 初始状态
const state = {
  // 老师数据
  teachers: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  
  // 筛选条件，从本地存储获取
  filters: getSavedFilters(),
  
  // 加载状态
  loading: false,
  loadingMore: false,
  error: null,
  
  // 选中的教师ID
  selectedTeacherId: null,
  
  // 导航类型，用于判断是否需要清空筛选条件
  navigationType: NAV_TYPE.DEFAULT
};

// Getters
const getters = {
  /**
   * @description 获取筛选后的老师列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 筛选后的老师列表
   */
  filteredTeachers: state => state.teachers,
  
  /**
   * @description 判断是否有筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有筛选条件
   */
  hasFilters: state => {
    return !!state.filters.school || !!state.filters.major || !!state.filters.keyword;
  },
  
  /**
   * @description 获取加载状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载
   */
  isLoading: state => state.loading,
  
  /**
   * @description 获取加载更多状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载更多
   */
  isLoadingMore: state => state.loadingMore,
  
  /**
   * @description 是否有更多数据
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有更多数据
   */
  hasMoreData: state => state.currentPage < state.totalPages,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: state => state.error,
  
  /**
   * @description 获取当前筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Object} 筛选条件
   */
  currentFilters: state => state.filters,
  
  /**
   * @description 获取当前导航类型
   * @param {Object} state - Vuex状态
   * @returns {String} 导航类型
   */
  navigationType: state => state.navigationType
};

// 引入常量类型
const SET_TEACHERS = 'SET_TEACHERS';
const ADD_TEACHERS = 'ADD_TEACHERS';
const SET_LOADING = 'SET_LOADING';
const SET_LOADING_MORE = 'SET_LOADING_MORE';
const SET_ERROR = 'SET_ERROR';
const SET_FILTERS = 'SET_FILTERS';
const SET_SELECTED_TEACHER = 'SET_SELECTED_TEACHER';
const RESET_FILTERS = 'RESET_FILTERS';
const SET_NAVIGATION_TYPE = 'SET_NAVIGATION_TYPE';

// Mutations
const mutations = {
  [SET_TEACHERS](state, data) {
    const { list, pagination } = data;
    state.teachers = list;
    state.currentPage = pagination.current || pagination.page;
    state.totalPages = pagination.totalPages;
    state.totalCount = pagination.total;
    state.pageSize = pagination.pageSize;
  },
  
  [ADD_TEACHERS](state, data) {
    const { list, pagination } = data;
    state.teachers = [...state.teachers, ...list];
    state.currentPage = pagination.current || pagination.page;
    state.totalPages = pagination.totalPages;
    state.totalCount = pagination.total;
    state.pageSize = pagination.pageSize;
  },
  
  [SET_LOADING](state, loading) {
    state.loading = loading;
  },
  
  [SET_LOADING_MORE](state, loadingMore) {
    state.loadingMore = loadingMore;
  },
  
  [SET_ERROR](state, error) {
    state.error = error;
  },
  
  [SET_FILTERS](state, filters) {
    state.filters = { ...state.filters, ...filters };
    
    // 保存到本地存储
    try {
      uni.setStorageSync(FILTERS_STORAGE_KEY, JSON.stringify(state.filters));
    } catch (e) {
      console.error('保存筛选条件失败', e);
    }
  },
  
  [SET_SELECTED_TEACHER](state, id) {
    state.selectedTeacherId = id;
  },
  
  [RESET_FILTERS](state) {
    state.filters = {
      school: '',
      major: '',
      keyword: ''
    };
    
    // 从本地存储中删除
    try {
      uni.removeStorageSync(FILTERS_STORAGE_KEY);
    } catch (e) {
      console.error('删除筛选条件失败', e);
    }
  },
  
  [SET_NAVIGATION_TYPE](state, type) {
    state.navigationType = type;
    
    // 保存到本地存储
    try {
      uni.setStorageSync(NAVIGATION_TYPE_KEY, type);
    } catch (e) {
      console.error('保存导航类型失败', e);
    }
  }
};

// Actions
const actions = {
  /**
   * @description 获取老师列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 结果对象
   */
  async getTeachers({ commit, state }, params = {}) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      
      // TODO: 使用真实API接口时删除此模拟数据代码块
      if (process.env.NODE_ENV === 'development') {
        await mock.mockDelay(500);
        
        // 过滤模拟数据
        let filteredTeachers = [...mock.mockTeachers];
        
        // 应用筛选条件
        if (state.filters.school) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.school.includes(state.filters.school)
          );
        }
        
        if (state.filters.major) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.major.includes(state.filters.major)
          );
        }
        
        if (state.filters.keyword) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.nickname.includes(state.filters.keyword) || 
            teacher.school.includes(state.filters.keyword) || 
            teacher.major.includes(state.filters.keyword)
          );
        }
        
        // 计算分页信息
        const page = params.page || 1;
        const limit = params.limit || state.pageSize;
        const total = filteredTeachers.length;
        const totalPages = Math.ceil(total / limit);
        
        // 切片获取当前页数据
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageTeachers = filteredTeachers.slice(startIndex, endIndex);
        
        commit(SET_TEACHERS, {
          list: pageTeachers,
          pagination: {
            page: page,
            pageSize: limit,
            total: total,
            totalPages: totalPages
          }
        });
        
        return { success: true, data: pageTeachers };
      }
      
      // 真实API调用
      const response = await match.getRecommendedTeachers({
        ...state.filters,
        page: params.page || 1,
        limit: params.limit || state.pageSize
      });
      
      if (!response.success) {
        throw response.error || { message: '获取老师列表失败' };
      }
      
      commit(SET_TEACHERS, {
        list: response.data.teachers || [],
        pagination: {
          page: params.page || 1,
          pageSize: params.limit || state.pageSize,
          total: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / (params.limit || state.pageSize))
        }
      });
      
      return { success: true, data: response.data.teachers };
    } catch (error) {
      console.error('获取老师列表失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  
  /**
   * @description 加载更多老师
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async loadMoreTeachers({ commit, state }) {
    // 如果没有更多数据或正在加载，不执行操作
    if (state.currentPage >= state.totalPages || state.loadingMore) {
      return { success: true, data: state.teachers, noMoreData: true };
    }
    
    try {
      commit(SET_LOADING_MORE, true);
      commit(SET_ERROR, null);
      
      const nextPage = state.currentPage + 1;
      
      // TODO: 使用真实API接口时删除此模拟数据代码块
      if (process.env.NODE_ENV === 'development') {
        await mock.mockDelay(500);
        
        // 过滤模拟数据
        let filteredTeachers = [...mock.mockTeachers];
        
        // 应用筛选条件
        if (state.filters.school) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.school.includes(state.filters.school)
          );
        }
        
        if (state.filters.major) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.major.includes(state.filters.major)
          );
        }
        
        if (state.filters.keyword) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.nickname.includes(state.filters.keyword) || 
            teacher.school.includes(state.filters.keyword) || 
            teacher.major.includes(state.filters.keyword)
          );
        }
        
        // 计算分页信息
        const limit = state.pageSize;
        const total = filteredTeachers.length;
        const totalPages = Math.ceil(total / limit);
        
        // 切片获取当前页数据
        const startIndex = (nextPage - 1) * limit;
        const endIndex = startIndex + limit;
        const pageTeachers = filteredTeachers.slice(startIndex, endIndex);
        
        commit(ADD_TEACHERS, {
          list: pageTeachers,
          pagination: {
            page: nextPage,
            pageSize: limit,
            total: total,
            totalPages: totalPages
          }
        });
        
        return { 
          success: true, 
          data: pageTeachers,
          noMoreData: nextPage >= totalPages
        };
      }
      
      // 真实API调用
      const response = await match.getRecommendedTeachers({
        ...state.filters,
        page: nextPage,
        limit: state.pageSize
      });
      
      if (!response.success) {
        throw response.error || { message: '加载更多老师失败' };
      }
      
      commit(ADD_TEACHERS, {
        list: response.data.teachers || [],
        pagination: {
          page: nextPage,
          pageSize: state.pageSize,
          total: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / state.pageSize)
        }
      });
      
      return { 
        success: true, 
        data: response.data.teachers,
        noMoreData: nextPage >= Math.ceil((response.data.total || 0) / state.pageSize)
      };
    } catch (error) {
      console.error('加载更多老师失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING_MORE, false);
    }
  },
  
  /**
   * @description 搜索老师
   * @param {Object} context - Vuex上下文
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 结果对象
   */
  async searchTeachers({ commit, state, dispatch }, filters = {}) {
    // 先设置筛选条件
    commit(SET_FILTERS, filters);
    
    // 重置页码
    return dispatch('getTeachers', { page: 1, limit: state.pageSize });
  },
  
  /**
   * @description 重置筛选条件并获取老师列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async resetAndGetTeachers({ commit, dispatch }) {
    commit(RESET_FILTERS);
    return dispatch('getTeachers', { page: 1 });
  },
  
  /**
   * @description 选择老师
   * @param {Object} context - Vuex上下文
   * @param {Number} id - 老师ID
   */
  selectTeacher({ commit }, id) {
    commit(SET_SELECTED_TEACHER, id);
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
  },
  
  /**
   * @description 设置导航类型
   * @param {Object} context - Vuex上下文
   * @param {String} type - 导航类型
   */
  setNavigationType({ commit }, type) {
    commit(SET_NAVIGATION_TYPE, type);
  },
  
  /**
   * @description 设置为聊天导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateToChat({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.CHAT);
  },
  
  /**
   * @description 设置为老师详情导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateToTeacherDetail({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.TEACHER_DETAIL);
  },
  
  /**
   * @description 设置为默认导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateDefault({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
  },
  
  /**
   * @description 根据导航类型判断是否需要清空筛选条件
   * @param {Object} context - Vuex上下文
   * @returns {Boolean} 是否执行了清空操作
   */
  handleNavigationExit({ state, commit, dispatch }) {
    const navType = state.navigationType;
    
    // 如果是默认导航（即普通退出），则清空筛选条件
    if (navType === NAV_TYPE.DEFAULT) {
      commit(RESET_FILTERS);
      return true;
    }
    
    // 重置导航类型为默认，但不清空筛选条件
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
    return false;
  },
  
  /**
   * @description 获取保存的导航类型
   * @param {Object} context - Vuex上下文
   * @returns {String} 导航类型
   */
  getSavedNavigationType({ commit }) {
    try {
      const navType = uni.getStorageSync(NAVIGATION_TYPE_KEY) || NAV_TYPE.DEFAULT;
      commit(SET_NAVIGATION_TYPE, navType);
      return navType;
    } catch (e) {
      console.error('获取导航类型失败', e);
      return NAV_TYPE.DEFAULT;
    }
  },
  
  /**
   * @description 清除导航类型
   * @param {Object} context - Vuex上下文
   */
  clearNavigationType({ commit }) {
    try {
      uni.removeStorageSync(NAVIGATION_TYPE_KEY);
      commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
    } catch (e) {
      console.error('清除导航类型失败', e);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 