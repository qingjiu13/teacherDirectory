/**
 * @description 课程管理模块（共享）
 * @module store/modules/common/courses
 */

/**
 * @description 初始状态
 * @type {Object}
 */
const state = {
  courseList: [],         // 课程列表
  courseCategories: [],   // 课程分类
  currentCourse: null,    // 当前查看的课程
  loading: false,         // 加载状态
  error: null,            // 错误信息
};

/**
 * @description getters
 * @type {Object}
 */
const getters = {
  /**
   * @description 获取所有课程
   * @param {Object} state - 状态对象
   * @returns {Array} 课程列表
   */
  allCourses: (state) => state.courseList,
  
  /**
   * @description 获取课程分类
   * @param {Object} state - 状态对象
   * @returns {Array} 课程分类列表
   */
  categories: (state) => state.courseCategories,
  
  /**
   * @description 根据分类筛选课程
   * @param {Object} state - 状态对象
   * @returns {Function} 筛选函数
   */
  coursesByCategory: (state) => (categoryId) => {
    return state.courseList.filter(course => course.categoryId === categoryId);
  },
};

/**
 * @description mutations
 * @type {Object}
 */
const mutations = {
  /**
   * @description 设置课程列表
   * @param {Object} state - 状态对象
   * @param {Array} courses - 课程列表
   */
  SET_COURSE_LIST(state, courses) {
    state.courseList = courses;
  },
  
  /**
   * @description 设置课程分类
   * @param {Object} state - 状态对象
   * @param {Array} categories - 课程分类
   */
  SET_CATEGORIES(state, categories) {
    state.courseCategories = categories;
  },
  
  /**
   * @description 设置当前课程
   * @param {Object} state - 状态对象
   * @param {Object} course - 课程对象
   */
  SET_CURRENT_COURSE(state, course) {
    state.currentCourse = course;
  },
  
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {boolean} loading - 加载状态
   */
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {Object} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
};

/**
 * @description actions
 * @type {Object}
 */
const actions = {
  /**
   * @description 获取课程列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Array>} 课程列表
   */
  async fetchCourses({ commit }, params = {}) {
    commit('SET_LOADING', true);
    try {
      // 这里添加API调用，获取课程列表
      // const response = await api.getCourses(params);
      const courses = []; // 替换为实际API返回的数据
      commit('SET_COURSE_LIST', courses);
      commit('SET_ERROR', null);
      return courses;
    } catch (error) {
      console.error('获取课程列表失败:', error);
      commit('SET_ERROR', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * @description 获取课程分类
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 分类列表
   */
  async fetchCategories({ commit }) {
    try {
      // 这里添加API调用，获取课程分类
      // const response = await api.getCategories();
      const categories = []; // 替换为实际API返回的数据
      commit('SET_CATEGORIES', categories);
      return categories;
    } catch (error) {
      console.error('获取课程分类失败:', error);
      return [];
    }
  },
  
  /**
   * @description 获取课程详情
   * @param {Object} context - Vuex上下文
   * @param {string|number} courseId - 课程ID
   * @returns {Promise<Object>} 课程详情
   */
  async fetchCourseDetail({ commit }, courseId) {
    commit('SET_LOADING', true);
    try {
      // 这里添加API调用，获取课程详情
      // const response = await api.getCourseDetail(courseId);
      const course = null; // 替换为实际API返回的数据
      commit('SET_CURRENT_COURSE', course);
      return course;
    } catch (error) {
      console.error('获取课程详情失败:', error);
      commit('SET_ERROR', error);
      return null;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 