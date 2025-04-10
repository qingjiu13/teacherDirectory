/**
 * @description 匹配功能Vuex模块
 * 老师和学生身份共享的匹配功能
 */

import { match } from '../../services';

// 初始状态
const state = {
  // 筛选条件
  filters: {
    school: '',
    major: '',
    keyword: '',
    sortBy: '综合排序'
  },
  
  // 学校和专业列表
  schoolList: [],
  majorList: [],
  
  // 老师数据
  teachers: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  
  // 加载状态
  loading: false,
  error: null,
  
  // 具体操作的加载状态
  loadingTypes: {
    teachers: false,
    schools: false,
    majors: false,
    communication: false,
    teacherDetail: false
  },
  
  // 选中的教师ID
  selectedTeacherId: null,
  
  // 当前教师详情
  teacherDetail: null
};

// Getters
const getters = {
  /**
   * @description 获取筛选后的老师列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 筛选后的老师列表
   */
  filteredTeachers: state => {
    return state.teachers;
  },
  
  /**
   * @description 获取学校列表（格式化为下拉框使用的格式）
   * @param {Object} state - Vuex状态
   * @returns {Array} 格式化后的学校列表
   */
  formattedSchoolList: state => {
    return state.schoolList.map(school => ({
      choiceItemId: school.id,
      choiceItemContent: school.name
    }));
  },
  
  /**
   * @description 获取专业列表（格式化为下拉框使用的格式）
   * @param {Object} state - Vuex状态
   * @returns {Array} 格式化后的专业列表
   */
  formattedMajorList: state => {
    return state.majorList.map(major => ({
      choiceItemId: major.id,
      choiceItemContent: major.name
    }));
  },
  
  /**
   * @description 判断是否有筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有筛选条件
   */
  hasFilters: state => {
    return !!state.filters.school || !!state.filters.major || !!state.filters.keyword;
  },
  
  /**
   * @description 获取排序选项
   * @returns {Array} 排序选项列表
   */
  sortOptions: () => {
    return [
      { choiceItemId: '综合排序', choiceItemContent: '综合排序' },
      { choiceItemId: '评分最高', choiceItemContent: '评分最高' },
      { choiceItemId: '最新加入', choiceItemContent: '最新加入' }
    ];
  },
  
  /**
   * @description 获取是否处于加载状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否处于加载状态
   */
  isLoading: state => state.loading,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: state => state.error,
  
  /**
   * @description 获取具体类型的加载状态
   * @param {Object} state - Vuex状态
   * @returns {Function} 返回获取具体类型加载状态的函数
   */
  loadingType: state => type => state.loadingTypes[type]
};

// 引入常量类型
const SET_LOADING = 'SET_LOADING';
const SET_LOADING_TYPE = 'SET_LOADING_TYPE';
const SET_ERROR = 'SET_ERROR';
const SET_FILTERS = 'SET_FILTERS';
const SET_SCHOOL_LIST = 'SET_SCHOOL_LIST';
const SET_MAJOR_LIST = 'SET_MAJOR_LIST';
const SET_TEACHERS = 'SET_TEACHERS';
const SET_SELECTED_TEACHER = 'SET_SELECTED_TEACHER';
const SET_TEACHER_DETAIL = 'SET_TEACHER_DETAIL';
const RESET_FILTERS = 'RESET_FILTERS';

// Mutations
const mutations = {
  /**
   * @description 设置全局加载状态
   * @param {Object} state - Vuex状态
   * @param {Boolean} status - 加载状态
   */
  [SET_LOADING](state, status) {
    state.loading = status;
  },
  
  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {Object} error - 错误信息
   */
  [SET_ERROR](state, error) {
    state.error = error;
  },
  
  /**
   * @description 设置特定类型的加载状态
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 加载状态信息
   */
  [SET_LOADING_TYPE](state, { type, value }) {
    state.loadingTypes[type] = value;
  },
  
  /**
   * @description 设置筛选条件
   * @param {Object} state - Vuex状态
   * @param {Object} filters - 筛选条件
   */
  [SET_FILTERS](state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
  
  /**
   * @description 设置学校列表
   * @param {Object} state - Vuex状态
   * @param {Array} schools - 学校列表
   */
  [SET_SCHOOL_LIST](state, schools) {
    state.schoolList = schools;
  },
  
  /**
   * @description 设置专业列表
   * @param {Object} state - Vuex状态
   * @param {Array} majors - 专业列表
   */
  [SET_MAJOR_LIST](state, majors) {
    state.majorList = majors;
  },
  
  /**
   * @description 设置老师列表
   * @param {Object} state - Vuex状态
   * @param {Object} data - 老师列表数据和分页信息
   */
  [SET_TEACHERS](state, data) {
    const { list, pagination } = data;
    state.teachers = list;
    state.currentPage = pagination.current || pagination.page;
    state.totalPages = pagination.totalPages;
    state.totalCount = pagination.total;
    state.pageSize = pagination.pageSize;
  },
  
  /**
   * @description 设置选中的教师ID
   * @param {Object} state - Vuex状态
   * @param {Number} id - 教师ID
   */
  [SET_SELECTED_TEACHER](state, id) {
    state.selectedTeacherId = id;
  },
  
  /**
   * @description 设置教师详情
   * @param {Object} state - Vuex状态
   * @param {Object} detail - 教师详情
   */
  [SET_TEACHER_DETAIL](state, detail) {
    state.teacherDetail = detail;
  },
  
  /**
   * @description 重置筛选条件
   * @param {Object} state - Vuex状态
   */
  [RESET_FILTERS](state) {
    state.filters = {
      school: '',
      major: '',
      keyword: '',
      sortBy: '综合排序'
    };
  }
};

// Actions
const actions = {
  /**
   * @description 获取推荐老师列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 结果对象
   */
  async getRecommendedTeachers({ commit, rootState }, params = {}) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'teachers', value: true });
      commit(SET_ERROR, null);
      
      // 添加用户角色到参数
      const role = rootState.auth.userInfo?.role || 'student';
      const response = await match.getRecommendedTeachers({ 
        ...params, 
        role,
        page: params.page || state.currentPage,
        limit: params.limit || state.pageSize
      });
      
      if (!response.success) {
        throw response.error || { message: '获取推荐老师失败' };
      }
      
      commit(SET_TEACHERS, {
        list: response.data.list,
        pagination: response.data.pagination
      });
      
      return { success: true, data: response.data.list };
    } catch (error) {
      console.error('获取推荐老师失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '获取推荐老师失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'teachers', value: false });
    }
  },
  
  /**
   * @description 搜索老师
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async searchTeachers({ commit, state }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'teachers', value: true });
      commit(SET_ERROR, null);
      
      const response = await match.searchTeachers({
        ...state.filters,
        page: state.currentPage,
        limit: state.pageSize
      });
      
      if (!response.success) {
        throw response.error || { message: '搜索老师失败' };
      }
      
      commit(SET_TEACHERS, {
        list: response.data.list,
        pagination: response.data.pagination
      });
      
      return { success: true, data: response.data.list };
    } catch (error) {
      console.error('搜索老师失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '搜索老师失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'teachers', value: false });
    }
  },
  
  /**
   * @description 加载学校列表
   * @param {Object} context - Vuex上下文
   * @param {String} keyword - 搜索关键词
   * @returns {Promise<Object>} 结果对象
   */
  async loadSchoolList({ commit }, keyword = '') {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'schools', value: true });
      commit(SET_ERROR, null);
      
      const response = await match.getSchoolList(keyword);
      
      if (!response.success) {
        throw response.error || { message: '获取学校列表失败' };
      }
      
      commit(SET_SCHOOL_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('获取学校列表失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '获取学校列表失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'schools', value: false });
    }
  },
  
  /**
   * @description 加载专业列表
   * @param {Object} context - Vuex上下文
   * @param {String} school - 学校名称
   * @returns {Promise<Object>} 结果对象
   */
  async loadMajorList({ commit }, school = '') {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'majors', value: true });
      commit(SET_ERROR, null);
      
      const response = await match.getMajorList(school);
      
      if (!response.success) {
        throw response.error || { message: '获取专业列表失败' };
      }
      
      commit(SET_MAJOR_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('获取专业列表失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '获取专业列表失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'majors', value: false });
    }
  },
  
  /**
   * @description 应用筛选条件
   * @param {Object} context - Vuex上下文
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 结果对象
   */
  async applyFilters({ commit, dispatch }, filters) {
    commit(SET_FILTERS, filters);
    return dispatch('searchTeachers');
  },
  
  /**
   * @description 申请与老师沟通
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 结果对象
   */
  async applyForCommunication({ commit }, { teacherId, message = '' }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'communication', value: true });
      commit(SET_ERROR, null);
      
      const response = await match.applyForCommunication(teacherId, message);
      
      if (!response.success) {
        throw response.error || { message: '申请沟通失败' };
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('申请沟通失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '申请沟通失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'communication', value: false });
    }
  },
  
  /**
   * @description 获取老师详情
   * @param {Object} context - Vuex上下文
   * @param {Number} id - 老师ID
   * @returns {Promise<Object>} 结果对象
   */
  async getTeacherDetail({ commit }, id) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: 'teacherDetail', value: true });
      commit(SET_ERROR, null);
      commit(SET_SELECTED_TEACHER, id);
      
      const response = await match.getTeacherDetail(id);
      
      if (!response.success) {
        throw response.error || { message: '获取老师详情失败' };
      }
      
      commit(SET_TEACHER_DETAIL, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('获取老师详情失败:', error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || '获取老师详情失败' };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: 'teacherDetail', value: false });
    }
  },
  
  /**
   * @description 重置过滤器并获取推荐老师
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async resetAndGetRecommended({ commit, dispatch }) {
    commit(RESET_FILTERS);
    return dispatch('getRecommendedTeachers');
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 