/**
 * match模块的getters
 * @module store/user/match/getters
 */

export default {
  /**
   * 获取搜索关键词
   * @param {Object} state - 状态对象
   * @returns {string} 搜索关键词
   */
  searchKey: state => state.searchKey,

  /**
   * 获取匹配的老师列表
   * @param {Object} state - 状态对象
   * @returns {Array} 老师列表
   */
  matchTeachers: state => state.matchList || [],

  /**
   * 获取分页信息
   * @param {Object} state - 状态对象
   * @returns {Object} 分页信息
   */
  pagination: state => ({
    currentPage: state.currentPage,
    hasMore: state.hasMore,
    isLoading: state.isLoading
  })
}; 