"use strict";
const mutations = {
  /**
   * 设置学校列表
   * @param {Object} state - 状态对象
   * @param {String} schoolName - 学校名称
   */
  SET_SCHOOL_LIST(state, schoolName) {
    state.schoolList = schoolName;
  },
  /**
   * 设置专业课列表
   * @param {Object} state - 状态对象
   * @param {String} professionalName - 专业课名称
   */
  SET_PROFESSIONAL_LIST(state, professionalName) {
    state.professionalList = professionalName;
  },
  /**
   * 设置筛选模式
   * @param {Object} state - 状态对象
   * @param {Object} filterMode - 筛选模式对象
   */
  SET_FILTER_MODE(state, filterMode) {
    state.filterMode = filterMode;
  },
  /**
   * 设置匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} matchList - 匹配列表数组
   */
  SET_MATCH_LIST(state, matchList) {
    state.matchList = matchList;
  },
  /**
   * 追加匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} additionalMatches - 追加的匹配列表数组
   */
  APPEND_MATCH_LIST(state, additionalMatches) {
    state.matchList = [...state.matchList, ...additionalMatches];
  },
  /**
   * 更新特定教师的详细信息
   * @param {Object} state - match模块的state
   * @param {Object} payload - 包含教师ID和详细信息的对象
   * @param {String} payload.id - 教师ID
   * @param {Object} payload.detailInfo - 教师详细信息
   */
  UPDATE_TEACHER_DETAIL(state, { id, detailInfo }) {
    if (!state.matchList || state.matchList.length === 0) {
      state.matchList = [{ id, ...detailInfo }];
      return;
    }
    const teacherIndex = state.matchList.findIndex((teacher) => teacher.id === id);
    if (teacherIndex !== -1) {
      state.matchList[teacherIndex] = {
        ...state.matchList[teacherIndex],
        ...detailInfo
      };
    } else {
      state.matchList.push({ id, ...detailInfo });
    }
  },
  /**
   * 清空匹配老师列表
   * @param {Object} state - match模块的state
   */
  CLEAR_MATCH_LIST(state) {
    state.matchList = [];
  },
  /**
   * 设置非专业课列表
   * @param {Object} state - 状态对象
   * @param {Object} nonProfessionalList - 非专业课列表对象
   */
  SET_NON_PROFESSIONAL_LIST(state, nonProfessionalList) {
    state.nonProfessionalList = nonProfessionalList;
  },
  /**
   * 设置排序模式
   * @param {Object} state - 状态对象
   * @param {String} sortMode - 排序模式
   */
  SET_SORT_MODE(state, sortMode) {
    state.sortMode = sortMode;
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/mutations.js.map
