/**
 * @description 学生学习进度管理模块
 */
import { services } from '../../services';

// 初始状态
const state = {
  learningProgress: {},  // 按课程ID存储的学习进度
  watchHistory: [],      // 观看历史
  notes: [],             // 学习笔记
  loading: false,
  error: null
};

// Getters
const getters = {
  learningProgress: state => state.learningProgress,
  watchHistory: state => state.watchHistory,
  notes: state => state.notes,
  loading: state => state.loading,
  error: state => state.error,
  
  /**
   * @description 获取指定课程的学习进度
   * @param {String} courseId - 课程ID
   * @returns {Object} 课程学习进度
   */
  getCourseProgress: state => courseId => state.learningProgress[courseId] || { 
    completed: 0, 
    total: 0, 
    percentage: 0 
  },
  
  /**
   * @description 获取最近观看的课程
   * @returns {Array} 最近观看的课程列表
   */
  recentWatched: state => {
    return state.watchHistory.slice(0, 5);
  }
};

// 引入常量类型
const FETCH_LEARNING_PROGRESS_REQUEST = 'FETCH_LEARNING_PROGRESS_REQUEST';
const FETCH_LEARNING_PROGRESS_SUCCESS = 'FETCH_LEARNING_PROGRESS_SUCCESS';
const FETCH_LEARNING_PROGRESS_FAILURE = 'FETCH_LEARNING_PROGRESS_FAILURE';
const UPDATE_LEARNING_PROGRESS_REQUEST = 'UPDATE_LEARNING_PROGRESS_REQUEST';
const UPDATE_LEARNING_PROGRESS_SUCCESS = 'UPDATE_LEARNING_PROGRESS_SUCCESS';
const UPDATE_LEARNING_PROGRESS_FAILURE = 'UPDATE_LEARNING_PROGRESS_FAILURE';
const FETCH_WATCH_HISTORY_REQUEST = 'FETCH_WATCH_HISTORY_REQUEST';
const FETCH_WATCH_HISTORY_SUCCESS = 'FETCH_WATCH_HISTORY_SUCCESS';
const FETCH_WATCH_HISTORY_FAILURE = 'FETCH_WATCH_HISTORY_FAILURE';
const ADD_WATCH_RECORD_SUCCESS = 'ADD_WATCH_RECORD_SUCCESS';
const FETCH_NOTES_REQUEST = 'FETCH_NOTES_REQUEST';
const FETCH_NOTES_SUCCESS = 'FETCH_NOTES_SUCCESS';
const FETCH_NOTES_FAILURE = 'FETCH_NOTES_FAILURE';
const SAVE_NOTE_SUCCESS = 'SAVE_NOTE_SUCCESS';

// Mutations
const mutations = {
  [FETCH_LEARNING_PROGRESS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_LEARNING_PROGRESS_SUCCESS](state, progress) {
    state.learningProgress = progress;
    state.loading = false;
    state.error = null;
  },
  [FETCH_LEARNING_PROGRESS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [UPDATE_LEARNING_PROGRESS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [UPDATE_LEARNING_PROGRESS_SUCCESS](state, { courseId, progress }) {
    state.learningProgress = {
      ...state.learningProgress,
      [courseId]: progress
    };
    state.loading = false;
    state.error = null;
  },
  [UPDATE_LEARNING_PROGRESS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [FETCH_WATCH_HISTORY_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_WATCH_HISTORY_SUCCESS](state, history) {
    state.watchHistory = history;
    state.loading = false;
    state.error = null;
  },
  [FETCH_WATCH_HISTORY_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [ADD_WATCH_RECORD_SUCCESS](state, record) {
    // 移除相同的记录（如果存在）
    const index = state.watchHistory.findIndex(item => 
      item.courseId === record.courseId && item.lectureId === record.lectureId
    );
    
    if (index !== -1) {
      state.watchHistory.splice(index, 1);
    }
    
    // 添加到头部
    state.watchHistory.unshift(record);
  },
  [FETCH_NOTES_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [FETCH_NOTES_SUCCESS](state, notes) {
    state.notes = notes;
    state.loading = false;
    state.error = null;
  },
  [FETCH_NOTES_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [SAVE_NOTE_SUCCESS](state, note) {
    const index = state.notes.findIndex(n => n.id === note.id);
    
    if (index !== -1) {
      // 更新现有笔记
      state.notes.splice(index, 1, note);
    } else {
      // 添加新笔记
      state.notes.push(note);
    }
  }
};

// Actions
const actions = {
  /**
   * @description 获取所有课程的学习进度
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 所有课程的学习进度
   */
  async fetchLearningProgress({ commit }) {
    commit(FETCH_LEARNING_PROGRESS_REQUEST);
    
    try {
      const response = await services.student.getLearningProgress();
      commit(FETCH_LEARNING_PROGRESS_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_LEARNING_PROGRESS_FAILURE, error.response?.data?.message || '获取学习进度失败');
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
    commit(UPDATE_LEARNING_PROGRESS_REQUEST);
    
    try {
      const response = await services.student.updateLearningProgress(
        courseId, 
        lectureId, 
        { position, completed }
      );
      
      commit(UPDATE_LEARNING_PROGRESS_SUCCESS, { 
        courseId, 
        progress: response.data.progress 
      });
      
      // 添加到观看历史
      if (response.data.watchRecord) {
        commit(ADD_WATCH_RECORD_SUCCESS, response.data.watchRecord);
      }
      
      return response.data;
    } catch (error) {
      commit(UPDATE_LEARNING_PROGRESS_FAILURE, error.response?.data?.message || '更新学习进度失败');
      return Promise.reject(error);
    }
  },
  
  /**
   * @description 获取观看历史
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Array>} 观看历史记录
   */
  async fetchWatchHistory({ commit }) {
    commit(FETCH_WATCH_HISTORY_REQUEST);
    
    try {
      const response = await services.student.getWatchHistory();
      commit(FETCH_WATCH_HISTORY_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_WATCH_HISTORY_FAILURE, error.response?.data?.message || '获取观看历史失败');
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
    commit(FETCH_NOTES_REQUEST);
    
    try {
      const response = await services.student.getNotes(courseId);
      commit(FETCH_NOTES_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      commit(FETCH_NOTES_FAILURE, error.response?.data?.message || '获取学习笔记失败');
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
    try {
      const response = await services.student.saveNote(note);
      commit(SAVE_NOTE_SUCCESS, response.data);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response?.data?.message || '保存笔记失败');
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