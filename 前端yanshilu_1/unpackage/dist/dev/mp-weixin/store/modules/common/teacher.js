"use strict";
const common_vendor = require("../../../common/vendor.js");
require("../../services/mock-data.js");
const store_services_match_api = require("../../services/match.api.js");
const state = {
  // 老师基本信息
  teacherInfo: {
    id: null,
    nickname: "",
    avatar: "",
    school: "",
    major: "",
    score: "",
    tags: [],
    introduction: ""
  },
  // 老师服务列表
  services: [],
  // 加载状态
  loading: false,
  error: null
};
const getters = {
  /**
   * @description 获取老师详情
   * @param {Object} state - Vuex状态
   * @returns {Object} 老师详情
   */
  teacherInfo: (state2) => state2.teacherInfo,
  /**
   * @description 获取老师服务列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 服务列表
   */
  services: (state2) => state2.services,
  /**
   * @description 获取加载状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载
   */
  isLoading: (state2) => state2.loading,
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: (state2) => state2.error
};
const SET_TEACHER_INFO = "SET_TEACHER_INFO";
const SET_SERVICES = "SET_SERVICES";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const RESET_TEACHER = "RESET_TEACHER";
const mutations = {
  [SET_TEACHER_INFO](state2, teacherInfo) {
    state2.teacherInfo = teacherInfo;
  },
  [SET_SERVICES](state2, services) {
    state2.services = services;
  },
  [SET_LOADING](state2, loading) {
    state2.loading = loading;
  },
  [SET_ERROR](state2, error) {
    state2.error = error;
  },
  [RESET_TEACHER](state2) {
    state2.teacherInfo = {
      id: null,
      nickname: "",
      avatar: "",
      school: "",
      major: "",
      score: "",
      tags: [],
      introduction: ""
    };
    state2.services = [];
  }
};
const actions = {
  /**
   * @description 获取老师详情和服务列表（合并API）
   * @param {Object} context - Vuex上下文
   * @param {Number} teacherId - 老师ID
   * @returns {Promise<Object>} 结果对象
   */
  async getTeacherInfo({ commit, rootState }, teacherId) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      let teacherBasicInfo = null;
      if (rootState.match && rootState.match.teachers) {
        teacherBasicInfo = rootState.match.teachers.find((t) => t.id === parseInt(teacherId));
      }
      const response = await store_services_match_api.getTeacherDetail(teacherId);
      if (!response.success) {
        throw response.error || { message: "获取老师详情失败" };
      }
      const teacherDetail = response.data.teacher;
      const services = response.data.services || [];
      commit(SET_TEACHER_INFO, teacherDetail);
      commit(SET_SERVICES, services);
      return { success: true, data: response.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/teacher.js:138", "获取老师详情失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 重置老师信息
   * @param {Object} context - Vuex上下文
   */
  resetTeacher({ commit }) {
    commit(RESET_TEACHER);
  },
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
  },
  /**
   * @description 初始化老师模块数据
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async loadInitialData({ commit }) {
    commit(RESET_TEACHER);
    return { success: true };
  }
};
const teacher = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.teacher = teacher;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/teacher.js.map
