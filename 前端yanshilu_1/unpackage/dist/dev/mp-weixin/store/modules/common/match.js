"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_services_index = require("../../services/index.js");
const store_services_match_api = require("../../services/match.api.js");
const state = {
  recommended: {
    current: [],
    // 当前推荐列表
    total: 0,
    // 总数
    page: 1,
    // 当前页
    loading: false,
    // 加载中状态
    error: null
    // 错误信息
  },
  filters: {
    school: "",
    major: "",
    keyword: "",
    sortBy: "rating",
    order: "desc"
  },
  // 学校和专业列表
  schoolList: [],
  majorList: [],
  // 老师数据
  teachers: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  // 加载状态
  loading: false,
  error: null,
  // 具体操作的加载状态
  loadingTypes: {
    teachers: false,
    schools: false,
    majors: false,
    communication: false,
    teacherDetail: false
  },
  // 选中的教师ID
  selectedTeacherId: null,
  // 当前教师详情
  teacherDetail: null
};
const getters = {
  recommended: (state2) => state2.recommended,
  filters: (state2) => state2.filters,
  isLoading: (state2) => state2.recommended.loading,
  hasError: (state2) => state2.recommended.error !== null,
  /**
   * @description 获取筛选后的老师列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 筛选后的老师列表
   */
  filteredTeachers: (state2) => {
    return state2.teachers;
  },
  /**
   * @description 获取学校列表（格式化为下拉框使用的格式）
   * @param {Object} state - Vuex状态
   * @returns {Array} 格式化后的学校列表
   */
  formattedSchoolList: (state2) => {
    return state2.schoolList.map((school) => ({
      choiceItemId: school.id,
      choiceItemContent: school.name
    }));
  },
  /**
   * @description 获取专业列表（格式化为下拉框使用的格式）
   * @param {Object} state - Vuex状态
   * @returns {Array} 格式化后的专业列表
   */
  formattedMajorList: (state2) => {
    return state2.majorList.map((major) => ({
      choiceItemId: major.id,
      choiceItemContent: major.name
    }));
  },
  /**
   * @description 判断是否有筛选条件
   * @param {Object} state - Vuex状态
   * @returns {Boolean} 是否有筛选条件
   */
  hasFilters: (state2) => {
    return !!state2.filters.school || !!state2.filters.major || !!state2.filters.keyword;
  },
  /**
   * @description 获取排序选项
   * @returns {Array} 排序选项列表
   */
  sortOptions: () => {
    return [
      { choiceItemId: "综合排序", choiceItemContent: "综合排序" },
      { choiceItemId: "评分最高", choiceItemContent: "评分最高" },
      { choiceItemId: "最新加入", choiceItemContent: "最新加入" }
    ];
  },
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {Object} 错误信息
   */
  error: (state2) => state2.error,
  /**
   * @description 获取具体类型的加载状态
   * @param {Object} state - Vuex状态
   * @returns {Function} 返回获取具体类型加载状态的函数
   */
  loadingType: (state2) => (type) => state2.loadingTypes[type]
};
const SET_RECOMMENDED = "SET_RECOMMENDED";
const SET_LOADING = "SET_LOADING";
const SET_LOADING_TYPE = "SET_LOADING_TYPE";
const SET_ERROR = "SET_ERROR";
const SET_FILTERS = "SET_FILTERS";
const SET_SCHOOL_LIST = "SET_SCHOOL_LIST";
const SET_MAJOR_LIST = "SET_MAJOR_LIST";
const SET_TEACHERS = "SET_TEACHERS";
const SET_SELECTED_TEACHER = "SET_SELECTED_TEACHER";
const SET_TEACHER_DETAIL = "SET_TEACHER_DETAIL";
const RESET_FILTERS = "RESET_FILTERS";
const mutations = {
  [SET_RECOMMENDED](state2, { teachers, total, page }) {
    if (!state2.recommended) {
      state2.recommended = {
        current: [],
        total: 0,
        page: 1,
        loading: false,
        error: null
      };
    }
    state2.recommended.current = teachers || [];
    state2.recommended.total = total || 0;
    state2.recommended.page = page || 1;
  },
  [SET_LOADING](state2, loading) {
    if (!state2.recommended) {
      state2.recommended = {
        current: [],
        total: 0,
        page: 1,
        loading: false,
        error: null
      };
    }
    state2.recommended.loading = loading;
  },
  [SET_ERROR](state2, error) {
    if (!state2.recommended) {
      state2.recommended = {
        current: [],
        total: 0,
        page: 1,
        loading: false,
        error: null
      };
    }
    state2.recommended.error = error;
  },
  [SET_LOADING_TYPE](state2, { type, value }) {
    state2.loadingTypes[type] = value;
  },
  [SET_FILTERS](state2, filters) {
    state2.filters = { ...state2.filters, ...filters };
  },
  [SET_SCHOOL_LIST](state2, schools) {
    state2.schoolList = schools;
  },
  [SET_MAJOR_LIST](state2, majors) {
    state2.majorList = majors;
  },
  [SET_TEACHERS](state2, data) {
    const { list, pagination } = data;
    state2.teachers = list;
    state2.currentPage = pagination.current || pagination.page;
    state2.totalPages = pagination.totalPages;
    state2.totalCount = pagination.total;
    state2.pageSize = pagination.pageSize;
  },
  [SET_SELECTED_TEACHER](state2, id) {
    state2.selectedTeacherId = id;
  },
  [SET_TEACHER_DETAIL](state2, detail) {
    state2.teacherDetail = detail;
  },
  [RESET_FILTERS](state2) {
    state2.filters = {
      school: "",
      major: "",
      keyword: "",
      sortBy: "rating",
      order: "desc"
    };
  }
};
const actions = {
  /**
   * @description 获取推荐老师列表
   * @param {Object} params 过滤参数
   * @returns {Promise<Array>} 老师列表
   */
  async getRecommendedTeachers({ commit, state: state2 }, params = {}) {
    commit(SET_LOADING, true);
    commit(SET_ERROR, null);
    try {
      const queryParams = {
        ...state2.filters,
        ...params,
        page: params.page || 1,
        limit: params.limit || 10
      };
      common_vendor.index.__f__("log", "at store/modules/common/match.js:249", "获取推荐老师, 参数:", queryParams);
      await store_services_index.mock.mockDelay(500);
      let filteredTeachers = [...store_services_index.mock.mockTeachers];
      if (queryParams.school) {
        filteredTeachers = filteredTeachers.filter(
          (teacher) => teacher.school.includes(queryParams.school)
        );
      }
      if (queryParams.major) {
        filteredTeachers = filteredTeachers.filter(
          (teacher) => teacher.major.includes(queryParams.major)
        );
      }
      if (queryParams.sortBy === "rating") {
        filteredTeachers.sort((a, b) => {
          const getScore = (scoreStr) => {
            if (!scoreStr)
              return 0;
            const match2 = String(scoreStr).match(/\d+/);
            return match2 ? parseInt(match2[0]) : 0;
          };
          const scoreA = getScore(a.score);
          const scoreB = getScore(b.score);
          return queryParams.order === "desc" ? scoreB - scoreA : scoreA - scoreB;
        });
      }
      const result = {
        success: true,
        data: {
          teachers: filteredTeachers,
          total: filteredTeachers.length,
          page: queryParams.page
        }
      };
      if (result.success) {
        const { teachers, total, page } = result.data;
        commit(SET_RECOMMENDED, { teachers, total, page });
        return teachers;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:303", "获取推荐老师失败:", error);
      commit(SET_ERROR, error.message || "获取推荐老师失败");
      return [];
    } finally {
      commit(SET_LOADING, false);
    }
  },
  /**
   * @description 重置筛选条件并获取最新推荐
   */
  async resetAndGetRecommended({ commit, dispatch }) {
    commit(RESET_FILTERS);
    return await dispatch("getRecommendedTeachers");
  },
  /**
   * @description 设置筛选条件
   * @param {Object} filters 筛选条件
   */
  setFilters({ commit }, filters) {
    commit(SET_FILTERS, filters);
  },
  /**
   * @description 搜索老师
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 结果对象
   */
  async searchTeachers({ commit, state: state2 }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: "teachers", value: true });
      commit(SET_ERROR, null);
      const response = await store_services_match_api.searchTeachers({
        ...state2.filters,
        page: state2.currentPage,
        limit: state2.pageSize
      });
      if (!response.success) {
        throw response.error || { message: "搜索老师失败" };
      }
      commit(SET_TEACHERS, {
        list: response.data.list,
        pagination: response.data.pagination
      });
      return { success: true, data: response.data.list };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:355", "搜索老师失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || "搜索老师失败" };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: "teachers", value: false });
    }
  },
  /**
   * @description 加载学校列表
   * @param {Object} context - Vuex上下文
   * @param {String} keyword - 搜索关键词
   * @returns {Promise<Object>} 结果对象
   */
  async loadSchoolList({ commit }, keyword = "") {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: "schools", value: true });
      commit(SET_ERROR, null);
      const response = await store_services_match_api.getSchoolList(keyword);
      if (!response.success) {
        throw response.error || { message: "获取学校列表失败" };
      }
      commit(SET_SCHOOL_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:385", "获取学校列表失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || "获取学校列表失败" };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: "schools", value: false });
    }
  },
  /**
   * @description 加载专业列表
   * @param {Object} context - Vuex上下文
   * @param {String} school - 学校名称
   * @returns {Promise<Object>} 结果对象
   */
  async loadMajorList({ commit }, school = "") {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: "majors", value: true });
      commit(SET_ERROR, null);
      const response = await store_services_match_api.getMajorList(school);
      if (!response.success) {
        throw response.error || { message: "获取专业列表失败" };
      }
      commit(SET_MAJOR_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:415", "获取专业列表失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || "获取专业列表失败" };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: "majors", value: false });
    }
  },
  /**
   * @description 应用筛选条件
   * @param {Object} context - Vuex上下文
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Object>} 结果对象
   */
  async applyFilters({ commit, dispatch }, filters) {
    commit(SET_FILTERS, filters);
    return dispatch("searchTeachers");
  },
  /**
   * @description 申请与老师沟通
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 参数
   * @returns {Promise<Object>} 结果对象
   */
  async applyForCommunication({ commit }, { teacherId, message = "" }) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: "communication", value: true });
      commit(SET_ERROR, null);
      const response = await store_services_match_api.applyForCommunication(teacherId, message);
      if (!response.success) {
        throw response.error || { message: "申请沟通失败" };
      }
      return { success: true, data: response.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:455", "申请沟通失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || "申请沟通失败" };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: "communication", value: false });
    }
  },
  /**
   * @description 获取老师详情
   * @param {Object} context - Vuex上下文
   * @param {Number} id - 老师ID
   * @returns {Promise<Object>} 结果对象
   */
  async getTeacherDetail({ commit }, id) {
    try {
      commit(SET_LOADING, true);
      commit(SET_LOADING_TYPE, { type: "teacherDetail", value: true });
      commit(SET_ERROR, null);
      commit(SET_SELECTED_TEACHER, id);
      const response = await store_services_match_api.getTeacherDetail(id);
      if (!response.success) {
        throw response.error || { message: "获取老师详情失败" };
      }
      commit(SET_TEACHER_DETAIL, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/match.js:486", "获取老师详情失败:", error);
      commit(SET_ERROR, error);
      return { success: false, error, message: error.message || "获取老师详情失败" };
    } finally {
      commit(SET_LOADING, false);
      commit(SET_LOADING_TYPE, { type: "teacherDetail", value: false });
    }
  },
  /**
   * @description 清除错误信息
   * @param {Object} context - Vuex上下文
   */
  clearError({ commit }) {
    commit(SET_ERROR, null);
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
