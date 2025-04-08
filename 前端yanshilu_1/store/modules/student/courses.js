/**
 * @description 学生-课程模块 - 处理学生已选课程功能
 */
import { services } from '../../services';

// 初始状态
const state = {
  enrolledCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
};

// Getters
const getters = {
  enrolledCourses: state => state.enrolledCourses,
  selectedCourse: state => state.selectedCourse,
  loading: state => state.loading,
  error: state => state.error,
  pagination: state => state.pagination
};

// 引入常量类型
const FETCH_ENROLLED_COURSES_REQUEST = 'FETCH_ENROLLED_COURSES_REQUEST';
const FETCH_ENROLLED_COURSES_SUCCESS = 'FETCH_ENROLLED_COURSES_SUCCESS';
const FETCH_ENROLLED_COURSES_FAILURE = 'FETCH_ENROLLED_COURSES_FAILURE';
const SELECT_COURSE = 'SELECT_COURSE';
const UPDATE_PAGINATION = 'UPDATE_PAGINATION';

// Mutations
const mutations = {
  [FETCH_ENROLLED_COURSES_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_ENROLLED_COURSES_SUCCESS](state, { courses, total }) {
    state.enrolledCourses = courses;
    state.pagination.total = total;
    state.loading = false;
    state.error = null;
  },
  [FETCH_ENROLLED_COURSES_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SELECT_COURSE](state, course) {
    state.selectedCourse = course;
  },
  [UPDATE_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  }
};

// Actions
const actions = {
  /**
   * @description 获取学生已选课程列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 课程列表
   */
  async fetchEnrolledCourses({ commit, state }, params = {}) {
    const queryParams = {
      page: state.pagination.current,
      pageSize: state.pagination.pageSize,
      ...params
    };
    
    commit(FETCH_ENROLLED_COURSES_REQUEST);
    
    try {
      const response = await services.student.getEnrolledCourses(queryParams);
      const { courses, total } = response.data;
      commit(FETCH_ENROLLED_COURSES_SUCCESS, { courses, total });
      return response.data;
    } catch (error) {
      commit(FETCH_ENROLLED_COURSES_FAILURE, error.response?.data?.message || '获取已选课程失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 选择课程查看详情
   * @param {Object} context - Vuex上下文
   * @param {Object} course - 课程对象
   */
  selectCourse({ commit }, course) {
    commit(SELECT_COURSE, course);
  },
  
  /**
   * @description 更新分页信息
   * @param {Object} context - Vuex上下文
   * @param {Object} pagination - 分页信息
   */
  updatePagination({ commit, dispatch }, pagination) {
    commit(UPDATE_PAGINATION, pagination);
    // 如果页码或每页数量发生变化，重新获取数据
    if (pagination.current || pagination.pageSize) {
      dispatch('fetchEnrolledCourses');
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