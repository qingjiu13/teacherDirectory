/**
 * @description 教师-学生管理模块 - 处理教师管理学生的功能
 */
import { services } from '../../services';

// 初始状态
const state = {
  studentsList: [],
  selectedStudent: null,
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
  studentsList: state => state.studentsList,
  selectedStudent: state => state.selectedStudent,
  loading: state => state.loading,
  error: state => state.error,
  pagination: state => state.pagination
};

// 引入常量类型
const FETCH_STUDENTS_REQUEST = 'FETCH_STUDENTS_REQUEST';
const FETCH_STUDENTS_SUCCESS = 'FETCH_STUDENTS_SUCCESS';
const FETCH_STUDENTS_FAILURE = 'FETCH_STUDENTS_FAILURE';
const SELECT_STUDENT = 'SELECT_STUDENT';
const UPDATE_PAGINATION = 'UPDATE_PAGINATION';

// Mutations
const mutations = {
  [FETCH_STUDENTS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_STUDENTS_SUCCESS](state, { students, total }) {
    state.studentsList = students;
    state.pagination.total = total;
    state.loading = false;
    state.error = null;
  },
  [FETCH_STUDENTS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SELECT_STUDENT](state, student) {
    state.selectedStudent = student;
  },
  [UPDATE_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  }
};

// Actions
const actions = {
  /**
   * @description 获取教师管理的学生列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 学生列表
   */
  async fetchStudentsList({ commit, state }, params = {}) {
    const queryParams = {
      page: state.pagination.current,
      pageSize: state.pagination.pageSize,
      ...params
    };
    
    commit(FETCH_STUDENTS_REQUEST);
    
    try {
      const response = await services.teacher.getStudents(queryParams);
      const { students, total } = response.data;
      commit(FETCH_STUDENTS_SUCCESS, { students, total });
      return response.data;
    } catch (error) {
      commit(FETCH_STUDENTS_FAILURE, error.response?.data?.message || '获取学生列表失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 选择学生查看详情
   * @param {Object} context - Vuex上下文
   * @param {Object} student - 学生对象
   */
  selectStudent({ commit }, student) {
    commit(SELECT_STUDENT, student);
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
      dispatch('fetchStudentsList');
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