/**
 * @description 教师统计分析模块 - 处理教学数据分析
 */
import { services } from '../../services';

// 初始状态
const state = {
  teachingStats: null,
  studentPerformance: [],
  courseAnalytics: [],
  incomeStats: null,
  timeframeFilter: 'month', // month, quarter, year
  loading: false,
  error: null
};

// Getters
const getters = {
  teachingStats: state => state.teachingStats,
  studentPerformance: state => state.studentPerformance,
  courseAnalytics: state => state.courseAnalytics,
  incomeStats: state => state.incomeStats,
  timeframeFilter: state => state.timeframeFilter,
  loading: state => state.loading,
  error: state => state.error
};

// 引入常量类型
const FETCH_TEACHING_STATS_REQUEST = 'FETCH_TEACHING_STATS_REQUEST';
const FETCH_TEACHING_STATS_SUCCESS = 'FETCH_TEACHING_STATS_SUCCESS';
const FETCH_TEACHING_STATS_FAILURE = 'FETCH_TEACHING_STATS_FAILURE';
const FETCH_STUDENT_PERFORMANCE_REQUEST = 'FETCH_STUDENT_PERFORMANCE_REQUEST';
const FETCH_STUDENT_PERFORMANCE_SUCCESS = 'FETCH_STUDENT_PERFORMANCE_SUCCESS';
const FETCH_STUDENT_PERFORMANCE_FAILURE = 'FETCH_STUDENT_PERFORMANCE_FAILURE';
const FETCH_COURSE_ANALYTICS_REQUEST = 'FETCH_COURSE_ANALYTICS_REQUEST';
const FETCH_COURSE_ANALYTICS_SUCCESS = 'FETCH_COURSE_ANALYTICS_SUCCESS';
const FETCH_COURSE_ANALYTICS_FAILURE = 'FETCH_COURSE_ANALYTICS_FAILURE';
const FETCH_INCOME_STATS_REQUEST = 'FETCH_INCOME_STATS_REQUEST';
const FETCH_INCOME_STATS_SUCCESS = 'FETCH_INCOME_STATS_SUCCESS';
const FETCH_INCOME_STATS_FAILURE = 'FETCH_INCOME_STATS_FAILURE';
const SET_TIMEFRAME_FILTER = 'SET_TIMEFRAME_FILTER';

// Mutations
const mutations = {
  [FETCH_TEACHING_STATS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_TEACHING_STATS_SUCCESS](state, stats) {
    state.teachingStats = stats;
    state.loading = false;
  },
  [FETCH_TEACHING_STATS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_STUDENT_PERFORMANCE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_STUDENT_PERFORMANCE_SUCCESS](state, data) {
    state.studentPerformance = data;
    state.loading = false;
  },
  [FETCH_STUDENT_PERFORMANCE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_COURSE_ANALYTICS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_COURSE_ANALYTICS_SUCCESS](state, data) {
    state.courseAnalytics = data;
    state.loading = false;
  },
  [FETCH_COURSE_ANALYTICS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_INCOME_STATS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_INCOME_STATS_SUCCESS](state, data) {
    state.incomeStats = data;
    state.loading = false;
  },
  [FETCH_INCOME_STATS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SET_TIMEFRAME_FILTER](state, timeframe) {
    state.timeframeFilter = timeframe;
  }
};

// Actions
const actions = {
  /**
   * @description 获取教学统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 统计数据
   */
  async fetchTeachingStats({ commit, state }) {
    commit(FETCH_TEACHING_STATS_REQUEST);
    
    try {
      // 假设API服务中有获取教学统计数据的方法
      const response = await services.teacher.getTeachingStats({
        timeframe: state.timeframeFilter
      });
      
      commit(FETCH_TEACHING_STATS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取教学统计数据失败';
      commit(FETCH_TEACHING_STATS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取学生表现数据
   * @param {Object} context - Vuex上下文
   * @param {string} [courseId] - 可选的课程ID过滤
   * @returns {Promise<Array>} 学生表现数据
   */
  async fetchStudentPerformance({ commit, state }, courseId) {
    commit(FETCH_STUDENT_PERFORMANCE_REQUEST);
    
    try {
      // 假设API服务中有获取学生表现数据的方法
      const response = await services.teacher.getStudentPerformance({
        timeframe: state.timeframeFilter,
        courseId
      });
      
      commit(FETCH_STUDENT_PERFORMANCE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取学生表现数据失败';
      commit(FETCH_STUDENT_PERFORMANCE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取课程分析数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 课程分析数据
   */
  async fetchCourseAnalytics({ commit, state }) {
    commit(FETCH_COURSE_ANALYTICS_REQUEST);
    
    try {
      // 假设API服务中有获取课程分析数据的方法
      const response = await services.teacher.getCourseAnalytics({
        timeframe: state.timeframeFilter
      });
      
      commit(FETCH_COURSE_ANALYTICS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取课程分析数据失败';
      commit(FETCH_COURSE_ANALYTICS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取收入统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 收入统计数据
   */
  async fetchIncomeStats({ commit, state }) {
    commit(FETCH_INCOME_STATS_REQUEST);
    
    try {
      // 假设API服务中有获取收入统计数据的方法
      const response = await services.teacher.getIncomeStats({
        timeframe: state.timeframeFilter
      });
      
      commit(FETCH_INCOME_STATS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取收入统计数据失败';
      commit(FETCH_INCOME_STATS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 设置时间范围过滤器
   * @param {Object} context - Vuex上下文
   * @param {string} timeframe - 时间范围(month/quarter/year)
   */
  setTimeframeFilter({ commit }, timeframe) {
    commit(SET_TIMEFRAME_FILTER, timeframe);
  },
  
  /**
   * @description 加载所有统计数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 加载结果
   */
  async loadAllStats({ dispatch }) {
    try {
      await Promise.all([
        dispatch('fetchTeachingStats'),
        dispatch('fetchStudentPerformance'),
        dispatch('fetchCourseAnalytics'),
        dispatch('fetchIncomeStats')
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('加载统计数据失败:', error);
      return { success: false, error };
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