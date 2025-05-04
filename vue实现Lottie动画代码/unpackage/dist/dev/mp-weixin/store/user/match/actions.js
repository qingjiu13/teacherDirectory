"use strict";
const store_user_match_api = require("./api.js");
const actions = {
  /**
   * 更新学校列表
   * @param {Object} context - Vuex上下文对象
   * @param {String} schoolName - 学校名称
   */
  updateSchoolList({ commit }, schoolName) {
    commit("SET_SCHOOL_LIST", schoolName);
  },
  /**
   * 更新专业课列表
   * @param {Object} context - Vuex上下文对象
   * @param {String} professionalName - 专业课名称
   */
  updateProfessionalList({ commit }, professionalName) {
    commit("SET_PROFESSIONAL_LIST", professionalName);
  },
  /**
   * 更新排序模式
   * @param {Object} context - Vuex上下文对象
   * @param {String} sortMode - 排序模式
   */
  updateSortMode({ commit }, sortMode) {
    commit("SET_SORT_MODE", sortMode);
  },
  /**
   * 更新非专业课列表
   * @param {Object} context - Vuex上下文对象
   * @param {Object} nonProfessionalList - 非专业课列表对象
   */
  updateNonProfessionalList({ commit }, nonProfessionalList) {
    commit("SET_NON_PROFESSIONAL_LIST", nonProfessionalList);
  },
  /**
   * 获取匹配的教师列表
   * @param {Object} context - Vuex上下文对象
   * @returns {Promise} 请求Promise
   */
  fetchMatchTeachers({ commit, state }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
  /**
   * 加载更多教师数据
   * @param {Object} context - Vuex上下文对象
   * @returns {Promise} 请求Promise
   */
  loadMoreTeachers({ commit, state }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
  /**
   * 获取匹配的老师列表
   * @param {Object} param0 - commit函数和state状态
   * @param {Object} payload - 请求参数
   * @return {Promise} 请求结果的Promise
   */
  getMatchTeachers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      store_user_match_api.getMatchTeachers(payload).then((res) => {
        if (res.code === 0) {
          commit("SET_MATCH_LIST", res.data);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  },
  /**
   * 获取老师详细信息
   * @param {Object} param0 - commit函数和state状态
   * @param {String} teacherId - 老师ID
   * @return {Promise} 请求结果的Promise
   */
  getTeacherDetail({ commit }, teacherId) {
    return new Promise((resolve, reject) => {
      store_user_match_api.getTeacherDetail(teacherId).then((res) => {
        if (res.code === 0) {
          commit("UPDATE_TEACHER_DETAIL", {
            id: teacherId,
            detailInfo: res.data
          });
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/actions.js.map
