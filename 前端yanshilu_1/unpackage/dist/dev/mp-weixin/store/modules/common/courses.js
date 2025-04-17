"use strict";
const common_vendor = require("../../../common/vendor.js");
const state = {
  courseList: [],
  // 课程列表
  courseCategories: [],
  // 课程分类
  currentCourse: null,
  // 当前查看的课程
  loading: false,
  // 加载状态
  error: null
  // 错误信息
};
const getters = {
  /**
   * @description 获取所有课程
   * @param {Object} state - 状态对象
   * @returns {Array} 课程列表
   */
  allCourses: (state2) => state2.courseList,
  /**
   * @description 获取课程分类
   * @param {Object} state - 状态对象
   * @returns {Array} 课程分类列表
   */
  categories: (state2) => state2.courseCategories,
  /**
   * @description 根据分类筛选课程
   * @param {Object} state - 状态对象
   * @returns {Function} 筛选函数
   */
  coursesByCategory: (state2) => (categoryId) => {
    return state2.courseList.filter((course) => course.categoryId === categoryId);
  }
};
const mutations = {
  /**
   * @description 设置课程列表
   * @param {Object} state - 状态对象
   * @param {Array} courses - 课程列表
   */
  SET_COURSE_LIST(state2, courses2) {
    state2.courseList = courses2;
  },
  /**
   * @description 设置课程分类
   * @param {Object} state - 状态对象
   * @param {Array} categories - 课程分类
   */
  SET_CATEGORIES(state2, categories) {
    state2.courseCategories = categories;
  },
  /**
   * @description 设置当前课程
   * @param {Object} state - 状态对象
   * @param {Object} course - 课程对象
   */
  SET_CURRENT_COURSE(state2, course) {
    state2.currentCourse = course;
  },
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {boolean} loading - 加载状态
   */
  SET_LOADING(state2, loading) {
    state2.loading = loading;
  },
  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {Object} error - 错误信息
   */
  SET_ERROR(state2, error) {
    state2.error = error;
  }
};
const actions = {
  /**
   * @description 获取课程列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Array>} 课程列表
   */
  async fetchCourses({ commit }, params = {}) {
    commit("SET_LOADING", true);
    try {
      const courses2 = [];
      commit("SET_COURSE_LIST", courses2);
      commit("SET_ERROR", null);
      return courses2;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/courses.js:119", "获取课程列表失败:", error);
      commit("SET_ERROR", error);
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },
  /**
   * @description 获取课程分类
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 分类列表
   */
  async fetchCategories({ commit }) {
    try {
      const categories = [];
      commit("SET_CATEGORIES", categories);
      return categories;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/courses.js:140", "获取课程分类失败:", error);
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
    commit("SET_LOADING", true);
    try {
      const course = null;
      commit("SET_CURRENT_COURSE", course);
      return course;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/courses.js:160", "获取课程详情失败:", error);
      commit("SET_ERROR", error);
      return null;
    } finally {
      commit("SET_LOADING", false);
    }
  }
};
const courses = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.courses = courses;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/courses.js.map
