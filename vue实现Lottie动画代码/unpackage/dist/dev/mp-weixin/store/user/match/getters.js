"use strict";
const getters = {
  /**
   * 获取筛选后的老师列表
   * @param {Object} state - match模块的state
   * @returns {Array} - 返回筛选后的老师列表
   */
  filteredMatchList: (state) => {
    return state.matchList || [];
  },
  /**
   * 根据ID获取特定老师的信息
   * @param {Object} state - match模块的state
   * @returns {Function} - 返回一个函数，该函数接收teacherId并返回对应的老师信息
   */
  teacherInfo: (state) => (teacherId) => {
    if (!state.matchList || state.matchList.length === 0) {
      return null;
    }
    return state.matchList.find((teacher) => teacher.id === teacherId) || null;
  }
};
exports.getters = getters;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/getters.js.map
