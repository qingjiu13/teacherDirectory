"use strict";
const store_services_index = require("../../services/index.js");
const state = {
  learningProgress: {},
  // 按课程ID存储的学习进度
  watchHistory: [],
  // 观看历史
  notes: [],
  // 学习笔记
  loading: false,
  error: null
};
const getters = {
  learningProgress: (state2) => state2.learningProgress,
  watchHistory: (state2) => state2.watchHistory,
  notes: (state2) => state2.notes,
  loading: (state2) => state2.loading,
  error: (state2) => state2.error,
  /**
   * @description 获取指定课程的学习进度
   * @param {String} courseId - 课程ID
   * @returns {Object} 课程学习进度
   */
  getCourseProgress: (state2) => (courseId) => state2.learningProgress[courseId] || {
    completed: 0,
    total: 0,
    percentage: 0
  },
  /**
   * @description 获取最近观看的课程
   * @returns {Array} 最近观看的课程列表
   */
  recentWatched: (state2) => {
    return state2.watchHistory.slice(0, 5);
  }
};
const FETCH_LEARNING_PROGRESS_REQUEST = "FETCH_LEARNING_PROGRESS_REQUEST";
const FETCH_LEARNING_PROGRESS_SUCCESS = "FETCH_LEARNING_PROGRESS_SUCCESS";
const FETCH_LEARNING_PROGRESS_FAILURE = "FETCH_LEARNING_PROGRESS_FAILURE";
const UPDATE_LEARNING_PROGRESS_REQUEST = "UPDATE_LEARNING_PROGRESS_REQUEST";
const UPDATE_LEARNING_PROGRESS_SUCCESS = "UPDATE_LEARNING_PROGRESS_SUCCESS";
const UPDATE_LEARNING_PROGRESS_FAILURE = "UPDATE_LEARNING_PROGRESS_FAILURE";
const FETCH_WATCH_HISTORY_REQUEST = "FETCH_WATCH_HISTORY_REQUEST";
const FETCH_WATCH_HISTORY_SUCCESS = "FETCH_WATCH_HISTORY_SUCCESS";
const FETCH_WATCH_HISTORY_FAILURE = "FETCH_WATCH_HISTORY_FAILURE";
const ADD_WATCH_RECORD_SUCCESS = "ADD_WATCH_RECORD_SUCCESS";
const FETCH_NOTES_REQUEST = "FETCH_NOTES_REQUEST";
const FETCH_NOTES_SUCCESS = "FETCH_NOTES_SUCCESS";
const FETCH_NOTES_FAILURE = "FETCH_NOTES_FAILURE";
const SAVE_NOTE_SUCCESS = "SAVE_NOTE_SUCCESS";
const mutations = {
  [FETCH_LEARNING_PROGRESS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_LEARNING_PROGRESS_SUCCESS](state2, progress) {
    state2.learningProgress = progress;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_LEARNING_PROGRESS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [UPDATE_LEARNING_PROGRESS_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [UPDATE_LEARNING_PROGRESS_SUCCESS](state2, { courseId, progress }) {
    state2.learningProgress = {
      ...state2.learningProgress,
      [courseId]: progress
    };
    state2.loading = false;
    state2.error = null;
  },
  [UPDATE_LEARNING_PROGRESS_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [FETCH_WATCH_HISTORY_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_WATCH_HISTORY_SUCCESS](state2, history) {
    state2.watchHistory = history;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_WATCH_HISTORY_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [ADD_WATCH_RECORD_SUCCESS](state2, record) {
    const index = state2.watchHistory.findIndex(
      (item) => item.courseId === record.courseId && item.lectureId === record.lectureId
    );
    if (index !== -1) {
      state2.watchHistory.splice(index, 1);
    }
    state2.watchHistory.unshift(record);
  },
  [FETCH_NOTES_REQUEST](state2) {
    state2.loading = true;
    state2.error = null;
  },
  [FETCH_NOTES_SUCCESS](state2, notes) {
    state2.notes = notes;
    state2.loading = false;
    state2.error = null;
  },
  [FETCH_NOTES_FAILURE](state2, error) {
    state2.loading = false;
    state2.error = error;
  },
  [SAVE_NOTE_SUCCESS](state2, note) {
    const index = state2.notes.findIndex((n) => n.id === note.id);
    if (index !== -1) {
      state2.notes.splice(index, 1, note);
    } else {
      state2.notes.push(note);
    }
  }
};
const actions = {
  /**
   * @description 获取所有课程的学习进度
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 所有课程的学习进度
   */
  async fetchLearningProgress({ commit }) {
    var _a, _b;
    commit(FETCH_LEARNING_PROGRESS_REQUEST);
    try {
      const response = await store_services_index.services.student.getLearningProgress();
      commit(FETCH_LEARNING_PROGRESS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_LEARNING_PROGRESS_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取学习进度失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 更新课程学习进度
   * @param {Object} context - Vuex上下文
   * @param {Object} payload - 进度信息
   * @param {String} payload.courseId - 课程ID
   * @param {String} payload.lectureId - 讲座ID
   * @param {Number} payload.position - 视频位置（秒）
   * @param {Boolean} payload.completed - 是否完成
   * @returns {Promise<Object>} 更新结果
   */
  async updateProgress({ commit }, { courseId, lectureId, position, completed }) {
    var _a, _b;
    commit(UPDATE_LEARNING_PROGRESS_REQUEST);
    try {
      const response = await store_services_index.services.student.updateLearningProgress(
        courseId,
        lectureId,
        { position, completed }
      );
      commit(UPDATE_LEARNING_PROGRESS_SUCCESS, {
        courseId,
        progress: response.data.progress
      });
      if (response.data.watchRecord) {
        commit(ADD_WATCH_RECORD_SUCCESS, response.data.watchRecord);
      }
      return response.data;
    } catch (error) {
      commit(UPDATE_LEARNING_PROGRESS_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "更新学习进度失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取观看历史
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 观看历史记录
   */
  async fetchWatchHistory({ commit }) {
    var _a, _b;
    commit(FETCH_WATCH_HISTORY_REQUEST);
    try {
      const response = await store_services_index.services.student.getWatchHistory();
      commit(FETCH_WATCH_HISTORY_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_WATCH_HISTORY_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取观看历史失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 获取学习笔记
   * @param {Object} context - Vuex上下文
   * @param {String} courseId - 可选的课程ID过滤器
   * @returns {Promise<Array>} 学习笔记列表
   */
  async fetchNotes({ commit }, courseId = null) {
    var _a, _b;
    commit(FETCH_NOTES_REQUEST);
    try {
      const response = await store_services_index.services.student.getNotes(courseId);
      commit(FETCH_NOTES_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_NOTES_FAILURE, ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "获取学习笔记失败");
      return Promise.reject(error);
    }
  },
  /**
   * @description 保存学习笔记
   * @param {Object} context - Vuex上下文
   * @param {Object} note - 笔记内容
   * @returns {Promise<Object>} 保存结果
   */
  async saveNote({ commit }, note) {
    var _a, _b;
    try {
      const response = await store_services_index.services.student.saveNote(note);
      commit(SAVE_NOTE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      return Promise.reject(((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "保存笔记失败");
    }
  }
};
const learning = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.learning = learning;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/student/learning.js.map
