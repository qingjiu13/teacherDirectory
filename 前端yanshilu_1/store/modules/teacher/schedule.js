/**
 * @description 教师课程安排模块 - 管理课程时间和排课
 */
import { services } from '../../services';

// 初始状态
const state = {
  teacherSchedule: [],
  availabilitySettings: null,
  upcomingClasses: [],
  bookingRequests: [],
  selectedDate: new Date().toISOString().substring(0, 10),
  loading: false,
  error: null
};

// Getters
const getters = {
  teacherSchedule: state => state.teacherSchedule,
  availabilitySettings: state => state.availabilitySettings,
  upcomingClasses: state => state.upcomingClasses,
  bookingRequests: state => state.bookingRequests,
  selectedDate: state => state.selectedDate,
  loading: state => state.loading,
  error: state => state.error,
  
  // 获取今日课程
  todayClasses: state => {
    const today = new Date().toISOString().substring(0, 10);
    return state.teacherSchedule.filter(item => item.date === today);
  },
  
  // 获取本周课程
  weekClasses: state => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startDate = startOfWeek.toISOString().substring(0, 10);
    const endDate = endOfWeek.toISOString().substring(0, 10);
    
    return state.teacherSchedule.filter(item => 
      item.date >= startDate && item.date <= endDate
    );
  }
};

// 引入常量类型
const FETCH_TEACHER_SCHEDULE_REQUEST = 'FETCH_TEACHER_SCHEDULE_REQUEST';
const FETCH_TEACHER_SCHEDULE_SUCCESS = 'FETCH_TEACHER_SCHEDULE_SUCCESS';
const FETCH_TEACHER_SCHEDULE_FAILURE = 'FETCH_TEACHER_SCHEDULE_FAILURE';
const FETCH_AVAILABILITY_SETTINGS_REQUEST = 'FETCH_AVAILABILITY_SETTINGS_REQUEST';
const FETCH_AVAILABILITY_SETTINGS_SUCCESS = 'FETCH_AVAILABILITY_SETTINGS_SUCCESS';
const FETCH_AVAILABILITY_SETTINGS_FAILURE = 'FETCH_AVAILABILITY_SETTINGS_FAILURE';
const FETCH_UPCOMING_CLASSES_REQUEST = 'FETCH_UPCOMING_CLASSES_REQUEST';
const FETCH_UPCOMING_CLASSES_SUCCESS = 'FETCH_UPCOMING_CLASSES_SUCCESS';
const FETCH_UPCOMING_CLASSES_FAILURE = 'FETCH_UPCOMING_CLASSES_FAILURE';
const FETCH_BOOKING_REQUESTS_REQUEST = 'FETCH_BOOKING_REQUESTS_REQUEST';
const FETCH_BOOKING_REQUESTS_SUCCESS = 'FETCH_BOOKING_REQUESTS_SUCCESS';
const FETCH_BOOKING_REQUESTS_FAILURE = 'FETCH_BOOKING_REQUESTS_FAILURE';
const UPDATE_AVAILABILITY_REQUEST = 'UPDATE_AVAILABILITY_REQUEST';
const UPDATE_AVAILABILITY_SUCCESS = 'UPDATE_AVAILABILITY_SUCCESS';
const UPDATE_AVAILABILITY_FAILURE = 'UPDATE_AVAILABILITY_FAILURE';
const UPDATE_BOOKING_REQUEST_STATUS = 'UPDATE_BOOKING_REQUEST_STATUS';
const SET_SELECTED_DATE = 'SET_SELECTED_DATE';

// Mutations
const mutations = {
  [FETCH_TEACHER_SCHEDULE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_TEACHER_SCHEDULE_SUCCESS](state, schedule) {
    state.teacherSchedule = schedule;
    state.loading = false;
  },
  [FETCH_TEACHER_SCHEDULE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_AVAILABILITY_SETTINGS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_AVAILABILITY_SETTINGS_SUCCESS](state, settings) {
    state.availabilitySettings = settings;
    state.loading = false;
  },
  [FETCH_AVAILABILITY_SETTINGS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_UPCOMING_CLASSES_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_UPCOMING_CLASSES_SUCCESS](state, classes) {
    state.upcomingClasses = classes;
    state.loading = false;
  },
  [FETCH_UPCOMING_CLASSES_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_BOOKING_REQUESTS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_BOOKING_REQUESTS_SUCCESS](state, requests) {
    state.bookingRequests = requests;
    state.loading = false;
  },
  [FETCH_BOOKING_REQUESTS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [UPDATE_AVAILABILITY_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [UPDATE_AVAILABILITY_SUCCESS](state, settings) {
    state.availabilitySettings = settings;
    state.loading = false;
  },
  [UPDATE_AVAILABILITY_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [UPDATE_BOOKING_REQUEST_STATUS](state, { requestId, status }) {
    const index = state.bookingRequests.findIndex(req => req.id === requestId);
    if (index !== -1) {
      state.bookingRequests[index].status = status;
    }
  },
  [SET_SELECTED_DATE](state, date) {
    state.selectedDate = date;
  }
};

// Actions
const actions = {
  /**
   * @description 获取教师课程安排
   * @param {Object} context - Vuex上下文
   * @param {Object} [params] - 查询参数
   * @returns {Promise<Array>} 课程安排
   */
  async fetchTeacherSchedule({ commit }, params = {}) {
    commit(FETCH_TEACHER_SCHEDULE_REQUEST);
    
    try {
      // 假设API服务中有获取教师课程安排的方法
      const response = await services.teacher.getTeacherSchedule(params);
      
      commit(FETCH_TEACHER_SCHEDULE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取课程安排失败';
      commit(FETCH_TEACHER_SCHEDULE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取教师可用时间设置
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 可用时间设置
   */
  async fetchAvailabilitySettings({ commit }) {
    commit(FETCH_AVAILABILITY_SETTINGS_REQUEST);
    
    try {
      // 假设API服务中有获取教师可用时间设置的方法
      const response = await services.teacher.getAvailabilitySettings();
      
      commit(FETCH_AVAILABILITY_SETTINGS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取可用时间设置失败';
      commit(FETCH_AVAILABILITY_SETTINGS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取即将到来的课程
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 即将到来的课程
   */
  async fetchUpcomingClasses({ commit }) {
    commit(FETCH_UPCOMING_CLASSES_REQUEST);
    
    try {
      // 假设API服务中有获取即将到来的课程的方法
      const response = await services.teacher.getUpcomingClasses();
      
      commit(FETCH_UPCOMING_CLASSES_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取即将到来的课程失败';
      commit(FETCH_UPCOMING_CLASSES_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取预约请求
   * @param {Object} context - Vuex上下文
   * @param {Object} [params] - 查询参数
   * @returns {Promise<Array>} 预约请求
   */
  async fetchBookingRequests({ commit }, params = {}) {
    commit(FETCH_BOOKING_REQUESTS_REQUEST);
    
    try {
      // 假设API服务中有获取预约请求的方法
      const response = await services.teacher.getBookingRequests(params);
      
      commit(FETCH_BOOKING_REQUESTS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取预约请求失败';
      commit(FETCH_BOOKING_REQUESTS_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 更新可用时间设置
   * @param {Object} context - Vuex上下文
   * @param {Object} settings - 可用时间设置
   * @returns {Promise<Object>} 更新结果
   */
  async updateAvailabilitySettings({ commit }, settings) {
    commit(UPDATE_AVAILABILITY_REQUEST);
    
    try {
      // 假设API服务中有更新可用时间设置的方法
      const response = await services.teacher.updateAvailabilitySettings(settings);
      
      commit(UPDATE_AVAILABILITY_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '更新可用时间设置失败';
      commit(UPDATE_AVAILABILITY_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 更新预约请求状态
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 参数
   * @param {string} params.requestId - 请求ID
   * @param {string} params.status - 新状态(accepted/rejected)
   * @returns {Promise<Object>} 更新结果
   */
  async updateBookingRequestStatus({ commit }, { requestId, status }) {
    try {
      // 假设API服务中有更新预约请求状态的方法
      const response = await services.teacher.updateBookingRequestStatus(requestId, status);
      
      commit(UPDATE_BOOKING_REQUEST_STATUS, { requestId, status });
      return response.data;
    } catch (error) {
      console.error('更新预约请求状态失败:', error);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 设置选中日期
   * @param {Object} context - Vuex上下文
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   */
  setSelectedDate({ commit }, date) {
    commit(SET_SELECTED_DATE, date);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 