"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const store_services_match_api = require("../../services/match.api.js");
const FILTERS_STORAGE_KEY = "match_filters";
const NAVIGATION_TYPE_KEY = "match_navigation_type";
const NAV_TYPE = {
  DEFAULT: "default",
  // 默认导航（普通退出）
  CHAT: "chat",
  // 前往聊天页面
  TEACHER_DETAIL: "detail"
  // 前往老师详情页面
};
const getSavedFilters = () => {
  try {
    const savedFilters = common_vendor.index.getStorageSync(FILTERS_STORAGE_KEY);
    return savedFilters ? JSON.parse(savedFilters) : { school: "", major: "", keyword: "" };
  } catch (e) {
    common_vendor.index.__f__("error", "at store/modules/common/match.js:25", "获取保存的筛选条件失败", e);
    return { school: "", major: "", keyword: "" };
  }
};
const state = {
  // 老师数据
  teachers: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  // 筛选条件，从本地存储获取
  filters: getSavedFilters(),
  // 加载状态
  loading: false,
  loadingMore: false,
  error: null,
  // 选中的教师ID
  selectedTeacherId: null,
  // 导航类型，用于判断是否需要清空筛选条件
  navigationType: NAV_TYPE.DEFAULT
};
const getters = {
  /**
   * @description 获取筛选后的老师列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 筛选后的老师列表
   */
  filteredTeachers: (state2) => state2.teachers,
  /**
   * @description 判断是否有筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有筛选条件
   */
  hasFilters: (state2) => {
    return !!state2.filters.school || !!state2.filters.major || !!state2.filters.keyword;
  },
  /**
   * @description 获取加载状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载
   */
  isLoading: (state2) => state2.loading,
  /**
   * @description 获取加载更多状态
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否正在加载更多
   */
  isLoadingMore: (state2) => state2.loadingMore,
  /**
   * @description 是否有更多数据
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有更多数据
   */
  hasMoreData: (state2) => state2.currentPage < state2.totalPages,
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: (state2) => state2.error,
  /**
   * @description 获取当前筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Object} 筛选条件
   */
  currentFilters: (state2) => state2.filters,
  /**
   * @description 获取当前导航类型
   * @param {Object} state - Vuex状态
   * @returns {String} 导航类型
   */
  navigationType: (state2) => state2.navigationType
};
const SET_TEACHERS = "SET_TEACHERS";
const ADD_TEACHERS = "ADD_TEACHERS";
const SET_LOADING = "SET_LOADING";
const SET_LOADING_MORE = "SET_LOADING_MORE";
const SET_ERROR = "SET_ERROR";
const SET_FILTERS = "SET_FILTERS";
const SET_SELECTED_TEACHER = "SET_SELECTED_TEACHER";
const RESET_FILTERS = "RESET_FILTERS";
const SET_NAVIGATION_TYPE = "SET_NAVIGATION_TYPE";
const mutations = {
  [SET_TEACHERS](state2, data) {
    const { list, pagination } = data;
    state2.teachers = list;
    state2.currentPage = pagination.current || pagination.page;
    state2.totalPages = pagination.totalPages;
    state2.totalCount = pagination.total;
    state2.pageSize = pagination.pageSize;
  },
  [ADD_TEACHERS](state2, data) {
    const { list, pagination } = data;
    state2.teachers = [...state2.teachers, ...list];
    state2.currentPage = pagination.current || pagination.page;
    state2.totalPages = pagination.totalPages;
    state2.totalCount = pagination.total;
    state2.pageSize = pagination.pageSize;
  },
  [SET_LOADING](state2, loading) {
    state2.loading = loading;
  },
  [SET_LOADING_MORE](state2, loadingMore) {
    state2.loadingMore = loadingMore;
  },
  [SET_ERROR](state2, error) {
    state2.error = error;
  },
  [SET_FILTERS](state2, filters) {
    state2.filters = { ...state2.filters, ...filters };
    try {
      common_vendor.index.setStorageSync(FILTERS_STORAGE_KEY, JSON.stringify(state2.filters));
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:165", "保存筛选条件失败", e);
    }
  },
  [SET_SELECTED_TEACHER](state2, id) {
    state2.selectedTeacherId = id;
  },
  [RESET_FILTERS](state2) {
    state2.filters = {
      school: "",
      major: "",
      keyword: ""
    };
    try {
      common_vendor.index.removeStorageSync(FILTERS_STORAGE_KEY);
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:184", "删除筛选条件失败", e);
    }
  },
  [SET_NAVIGATION_TYPE](state2, type) {
    state2.navigationType = type;
    try {
      common_vendor.index.setStorageSync(NAVIGATION_TYPE_KEY, type);
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:195", "保存导航类型失败", e);
    }
  }
};
const actions = {
  /**
   * @description 获取老师列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} 结果对象
   */
  async getTeachers({ commit, state: state2 }, params = {}) {
    try {
      commit(SET_LOADING, true);
      commit(SET_ERROR, null);
      if (true) {
        await store_services_index.mock.mockDelay(500);
        let filteredTeachers = [...store_services_index.mock.mockTeachers];
        if (state2.filters.school) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.school.includes(state2.filters.school)
          );
        }
        if (state2.filters.major) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.major.includes(state2.filters.major)
          );
        }
        if (state2.filters.keyword) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.nickname.includes(state2.filters.keyword) || teacher.school.includes(state2.filters.keyword) || teacher.major.includes(state2.filters.keyword)
          );
        }
        const page = params.page || 1;
        const limit = params.limit || state2.pageSize;
        const total = filteredTeachers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageTeachers = filteredTeachers.slice(startIndex, endIndex);
        commit(SET_TEACHERS, {
          list: pageTeachers,
          pagination: {
            page,
            pageSize: limit,
            total,
            totalPages
          }
        });
        return { success: true, data: pageTeachers };
      }
      const response = await store_services_match_api.getRecommendedTeachers({
        ...state2.filters,
        page: params.page || 1,
        limit: params.limit || state2.pageSize
      });
      if (!response.success) {
        throw response.error || { message: "获取老师列表失败" };
      }
      commit(SET_TEACHERS, {
        list: response.data.teachers || [],
        pagination: {
          page: params.page || 1,
          pageSize: params.limit || state2.pageSize,
          total: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / (params.limit || state2.pageSize))
        }
      });
      return { success: true, data: response.data.teachers };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:288", "获取老师列表失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 加载更多老师
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async loadMoreTeachers({ commit, state: state2 }) {
    if (state2.currentPage >= state2.totalPages || state2.loadingMore) {
      return { success: true, data: state2.teachers, noMoreData: true };
    }
    try {
      commit(SET_LOADING_MORE, true);
      commit(SET_ERROR, null);
      const nextPage = state2.currentPage + 1;
      if (true) {
        await store_services_index.mock.mockDelay(500);
        let filteredTeachers = [...store_services_index.mock.mockTeachers];
        if (state2.filters.school) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.school.includes(state2.filters.school)
          );
        }
        if (state2.filters.major) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.major.includes(state2.filters.major)
          );
        }
        if (state2.filters.keyword) {
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.nickname.includes(state2.filters.keyword) || teacher.school.includes(state2.filters.keyword) || teacher.major.includes(state2.filters.keyword)
          );
        }
        const limit = state2.pageSize;
        const total = filteredTeachers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (nextPage - 1) * limit;
        const endIndex = startIndex + limit;
        const pageTeachers = filteredTeachers.slice(startIndex, endIndex);
        commit(ADD_TEACHERS, {
          list: pageTeachers,
          pagination: {
            page: nextPage,
            pageSize: limit,
            total,
            totalPages
          }
        });
        return {
          success: true,
          data: pageTeachers,
          noMoreData: nextPage >= totalPages
        };
      }
      const response = await store_services_match_api.getRecommendedTeachers({
        ...state2.filters,
        page: nextPage,
        limit: state2.pageSize
      });
      if (!response.success) {
        throw response.error || { message: "加载更多老师失败" };
      }
      commit(ADD_TEACHERS, {
        list: response.data.teachers || [],
        pagination: {
          page: nextPage,
          pageSize: state2.pageSize,
          total: response.data.total || 0,
          totalPages: Math.ceil((response.data.total || 0) / state2.pageSize)
        }
      });
      return {
        success: true,
        data: response.data.teachers,
        noMoreData: nextPage >= Math.ceil((response.data.total || 0) / state2.pageSize)
      };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:395", "加载更多老师失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error };
    } finally {
      commit(SET_LOADING_MORE, false);
    }
  },
  /**
   * @description 搜索老师
   * @param {Object} context - Vuex上下文
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 结果对象
   */
  async searchTeachers({ commit, state: state2, dispatch }, filters = {}) {
    commit(SET_FILTERS, filters);
    return dispatch("getTeachers", { page: 1, limit: state2.pageSize });
  },
  /**
   * @description 重置筛选条件并获取老师列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async resetAndGetTeachers({ commit, dispatch }) {
    commit(RESET_FILTERS);
    return dispatch("getTeachers", { page: 1 });
  },
  /**
   * @description 选择老师
   * @param {Object} context - Vuex上下文
   * @param {Number} id - 老师ID
   */
  selectTeacher({ commit }, id) {
    commit(SET_SELECTED_TEACHER, id);
  },
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
  },
  /**
   * @description 设置导航类型
   * @param {Object} context - Vuex上下文
   * @param {String} type - 导航类型
   */
  setNavigationType({ commit }, type) {
    commit(SET_NAVIGATION_TYPE, type);
  },
  /**
   * @description 设置为聊天导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateToChat({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.CHAT);
  },
  /**
   * @description 设置为老师详情导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateToTeacherDetail({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.TEACHER_DETAIL);
  },
  /**
   * @description 设置为默认导航类型
   * @param {Object} context - Vuex上下文
   */
  navigateDefault({ commit }) {
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
  },
  /**
   * @description 根据导航类型判断是否需要清空筛选条件
   * @param {Object} context - Vuex上下文
   * @returns {Boolean} 是否执行了清空操作
   */
  handleNavigationExit({ state: state2, commit, dispatch }) {
    const navType = state2.navigationType;
    if (navType === NAV_TYPE.DEFAULT) {
      commit(RESET_FILTERS);
      return true;
    }
    commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
    return false;
  },
  /**
   * @description 获取保存的导航类型
   * @param {Object} context - Vuex上下文
   * @returns {String} 导航类型
   */
  getSavedNavigationType({ commit }) {
    try {
      const navType = common_vendor.index.getStorageSync(NAVIGATION_TYPE_KEY) || NAV_TYPE.DEFAULT;
      commit(SET_NAVIGATION_TYPE, navType);
      return navType;
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:507", "获取导航类型失败", e);
      return NAV_TYPE.DEFAULT;
    }
  },
  /**
   * @description 清除导航类型
   * @param {Object} context - Vuex上下文
   */
  clearNavigationType({ commit }) {
    try {
      common_vendor.index.removeStorageSync(NAVIGATION_TYPE_KEY);
      commit(SET_NAVIGATION_TYPE, NAV_TYPE.DEFAULT);
    } catch (e) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:521", "清除导航类型失败", e);
    }
  }
};
const match = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.match = match;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/match.js.map
