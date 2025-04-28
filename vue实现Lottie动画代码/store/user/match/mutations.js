/**
 * 匹配模块的mutations
 * @module store/user/match/mutations
 */

export default {
  /**
   * 设置学校列表
   * @param {Object} state - 状态对象
   * @param {String} schoolName - 学校名称
   */
  SET_SCHOOL_LIST(state, schoolName) {
    state.schoolList = schoolName
  },

  /**
   * 设置专业课列表
   * @param {Object} state - 状态对象
   * @param {String} professionalName - 专业课名称
   */
  SET_PROFESSIONAL_LIST(state, professionalName) {
    state.professionalList = professionalName
  },

  /**
   * 设置筛选模式
   * @param {Object} state - 状态对象
   * @param {Object} filterMode - 筛选模式对象
   */
  SET_FILTER_MODE(state, filterMode) {
    state.filterMode = filterMode
  },

  /**
   * 设置匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} matchList - 匹配列表数组
   */
  SET_MATCH_LIST(state, matchList) {
    state.matchList = matchList
  },

  /**
   * 追加匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} additionalMatches - 追加的匹配列表数组
   */
  APPEND_MATCH_LIST(state, additionalMatches) {
    state.matchList = [...state.matchList, ...additionalMatches]
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
      // 如果matchList不存在或为空，创建一个包含该教师的新列表
      state.matchList = [{ id, ...detailInfo }];
      return;
    }
    
    const teacherIndex = state.matchList.findIndex(teacher => teacher.id === id);
    if (teacherIndex !== -1) {
      // 合并现有信息和新的详细信息
      state.matchList[teacherIndex] = {
        ...state.matchList[teacherIndex],
        ...detailInfo
      };
    } else {
      // 如果在列表中找不到该教师，则添加到列表
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
    state.nonProfessionalList = nonProfessionalList
  },

  /**
   * 设置排序模式
   * @param {Object} state - 状态对象
   * @param {String} sortMode - 排序模式
   */
  SET_SORT_MODE(state, sortMode) {
    state.sortMode = sortMode
  },
} 