"use strict";
const mutations = {
  /**
   * 设置匹配的老师列表
   * @param {Object} state - match模块的state
   * @param {Array} matchList - 老师列表数据
   */
  SET_MATCH_LIST(state, matchList) {
    state.matchList = matchList;
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
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/mutations.js.map
