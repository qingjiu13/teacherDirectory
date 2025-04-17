/**
 * @description 教师课程管理模块 - 处理教师创建和管理的课程
 */
import { services } from '../../services';

// 初始状态
const state = {
  teacherCourses: [],
  loading: false,
  error: null,
  currentCourse: null,
  stats: {
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    totalStudents: 0
  }
};

// Getters
const getters = {
  teacherCourses: state => state.teacherCourses,
  loading: state => state.loading,
  error: state => state.error,
  currentCourse: state => state.currentCourse,
  stats: state => state.stats
};

// 引入常量类型
const FETCH_TEACHER_COURSES_REQUEST = 'FETCH_TEACHER_COURSES_REQUEST';
const FETCH_TEACHER_COURSES_SUCCESS = 'FETCH_TEACHER_COURSES_SUCCESS';
const FETCH_TEACHER_COURSES_FAILURE = 'FETCH_TEACHER_COURSES_FAILURE';
const SET_CURRENT_COURSE = 'SET_CURRENT_COURSE';
const UPDATE_COURSE_REQUEST = 'UPDATE_COURSE_REQUEST';
const UPDATE_COURSE_SUCCESS = 'UPDATE_COURSE_SUCCESS';
const UPDATE_COURSE_FAILURE = 'UPDATE_COURSE_FAILURE';
const CREATE_COURSE_REQUEST = 'CREATE_COURSE_REQUEST';
const CREATE_COURSE_SUCCESS = 'CREATE_COURSE_SUCCESS';
const CREATE_COURSE_FAILURE = 'CREATE_COURSE_FAILURE';

// Mutations
const mutations = {
  [FETCH_TEACHER_COURSES_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_TEACHER_COURSES_SUCCESS](state, { courses, stats }) {
    state.teacherCourses = courses;
    state.stats = stats || state.stats;
    state.loading = false;
  },
  [FETCH_TEACHER_COURSES_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SET_CURRENT_COURSE](state, course) {
    state.currentCourse = course;
  },
  [UPDATE_COURSE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [UPDATE_COURSE_SUCCESS](state, updatedCourse) {
    const index = state.teacherCourses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      state.teacherCourses.splice(index, 1, updatedCourse);
    }
    state.currentCourse = updatedCourse;
    state.loading = false;
  },
  [UPDATE_COURSE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [CREATE_COURSE_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [CREATE_COURSE_SUCCESS](state, newCourse) {
    state.teacherCourses.unshift(newCourse);
    state.stats.totalCourses++;
    state.stats.activeCourses++;
    state.loading = false;
  },
  [CREATE_COURSE_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  }
};

// Actions
const actions = {
  /**
   * @description 获取教师课程列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 课程列表
   */
  async fetchTeacherCourses({ commit }) {
    commit(FETCH_TEACHER_COURSES_REQUEST);
    
    try {
      // 假设API服务中有获取教师课程的方法
      const response = await services.course.getTeacherCourses();
      
      // 计算统计数据
      const stats = {
        totalCourses: response.data.length,
        activeCourses: response.data.filter(c => c.status === 'active').length,
        completedCourses: response.data.filter(c => c.status === 'completed').length,
        totalStudents: response.data.reduce((total, course) => total + (course.students?.length || 0), 0)
      };
      
      commit(FETCH_TEACHER_COURSES_SUCCESS, { 
        courses: response.data,
        stats
      });
      
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '获取课程列表失败';
      commit(FETCH_TEACHER_COURSES_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 设置当前课程
   * @param {Object} context - Vuex上下文
   * @param {Object} course - 课程对象
   */
  setCurrentCourse({ commit }, course) {
    commit(SET_CURRENT_COURSE, course);
  },
  
  /**
   * @description 更新课程信息
   * @param {Object} context - Vuex上下文
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} 更新后的课程
   */
  async updateCourse({ commit }, courseData) {
    commit(UPDATE_COURSE_REQUEST);
    
    try {
      const response = await services.course.updateCourse(courseData.id, courseData);
      commit(UPDATE_COURSE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '更新课程失败';
      commit(UPDATE_COURSE_FAILURE, errorMsg);
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 创建新课程
   * @param {Object} context - Vuex上下文
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} 创建的课程
   */
  async createCourse({ commit }, courseData) {
    commit(CREATE_COURSE_REQUEST);
    
    try {
      const response = await services.course.createCourse(courseData);
      commit(CREATE_COURSE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || '创建课程失败';
      commit(CREATE_COURSE_FAILURE, errorMsg);
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