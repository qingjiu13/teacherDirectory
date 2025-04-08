"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null
};
const getters = {
  profile: (state2) => state2.profile,
  isProfileLoaded: (state2) => !!state2.profile,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  updateLoading: (state2) => state2.updateLoading,
  updateError: (state2) => state2.updateError,
  displayName: (state2) => {
    var _a;
    return ((_a = state2.profile) == null ? void 0 : _a.name) || "";
  },
  avatar: (state2) => {
    var _a;
    return ((_a = state2.profile) == null ? void 0 : _a.avatar) || "";
  },
  email: (state2) => {
    var _a;
    return ((_a = state2.profile) == null ? void 0 : _a.email) || "";
  }
};
const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";
const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";
const CLEAR_PROFILE = "CLEAR_PROFILE";
const mutations = {
  [FETCH_PROFILE_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_PROFILE_SUCCESS](state2, profile) {
    state2.profile = profile;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_PROFILE_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [UPDATE_PROFILE_REQUEST](state2) {
    state2.updateLoading = true;
    state2.updateError = null;
  },
  [UPDATE_PROFILE_SUCCESS](state2, profile) {
    state2.profile = { ...state2.profile, ...profile };
    state2.updateLoading = false;
    state2.updateError = null;
  },
  [UPDATE_PROFILE_FAILURE](state2, error) {
    state2.updateLoading = false;
    state2.updateError = error;
  },
  [CLEAR_PROFILE](state2) {
    state2.profile = null;
  }
};
const actions = {
  /**
   * @description 获取用户个人资料
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 个人资料
   */
  async fetchProfile({ commit, rootState }) {
    var _a, _b;
    commit(FETCH_PROFILE_REQUEST);
    try {
      let response;
      const { role } = rootState.auth;
      if (role === "teacher") {
        response = await store_services_index.services.teacher.getTeacherProfile();
      } else if (role === "student") {
        response = await store_services_index.services.student.getStudentProfile();
      } else {
        throw new Error("未知的用户角色");
      }
      commit(FETCH_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新用户个人资料
   * @param {Object} context - Vuex上下文
   * @param {Object} profileData - 个人资料数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile({ commit, rootState }, profileData) {
    var _a, _b;
    commit(UPDATE_PROFILE_REQUEST);
    try {
      let response;
      const { role } = rootState.auth;
      if (role === "teacher") {
        response = await store_services_index.services.teacher.updateTeacherProfile(profileData);
      } else if (role === "student") {
        response = await store_services_index.services.student.updateStudentProfile(profileData);
      } else {
        throw new Error("未知的用户角色");
      }
      commit(UPDATE_PROFILE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(UPDATE_PROFILE_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "更新个人资料失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 清除用户个人资料（通常在登出时调用）
   * @param {Object} context - Vuex上下文
   */
  clearProfile({ commit }) {
    commit(CLEAR_PROFILE);
  }
};
const user = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.user = user;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/user.js.map
