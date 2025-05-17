/**
 * 匹配模块的mutations
 * @module store/user/match/mutations
 */

export default {

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
   * 下面是对接api函数页码相关的mutations
   * 设置分页信息
   * @param {Object} state - 当前模块的state
   * @param {Object} pagination - 分页信息
   * @param {number} pagination.currentPage - 当前页码
   * @param {boolean} pagination.hasMore - 是否还有更多数据
   */
  SET_PAGINATION(state, { currentPage, hasMore }) {
    state.currentPage = currentPage;
    state.hasMore = hasMore;
  },
  
  /**
   * 设置老师详细信息
   * @param {Object} state - 当前模块的state
   * @param {string} payload.teacherId - 老师ID
   * @param {Object} payload.detail - 老师详细信息
   */
  SET_TEACHER_DETAIL(state, { teacherId, detail }) {
    // 找到匹配列表中对应的老师
    const teacherIndex = state.matchList.findIndex(teacher => teacher.id === teacherId);
    
    if (teacherIndex !== -1) {
      // 如果存在，则更新详细信息
      const updatedTeacher = {
        ...state.matchList[teacherIndex],
        selfIntroduction: detail.selfIntroduction || state.matchList[teacherIndex].selfIntroduction,
        service: detail.service || state.matchList[teacherIndex].service
      };
      
      // 使用Vue.set保证响应式更新
      state.matchList.splice(teacherIndex, 1, updatedTeacher);
    }
  },
  
  /**
   * 设置学校列表筛选
   * @param {Object} state - 当前模块的state
   * @param {string} schoolList - 学校名称
   */
  SET_SCHOOL_LIST(state, schoolList) {
    state.schoolList = schoolList;
  },
  
  /**
   * 设置专业课筛选
   * @param {Object} state - 当前模块的state
   * @param {string} professionalList - 专业课名称
   */
  SET_PROFESSIONAL_LIST(state, professionalList) {
    state.professionalList = professionalList;
  },
  
  /**
   * 设置非专业课筛选
   * @param {Object} state - 当前模块的state
   * @param {Object} nonProfessionalList - 非专业课列表
   * @param {string} nonProfessionalList.math - 数学类型
   * @param {string} nonProfessionalList.english - 英语类型
   * @param {string} nonProfessionalList.politics - 政治类型
   * @param {string} nonProfessionalList.other - 其他类型
   */
  SET_NON_PROFESSIONAL_LIST(state, nonProfessionalList) {
    state.nonProfessionalList = { ...nonProfessionalList };
  },
  
  /**
   * 设置排序方式
   * @param {Object} state - 当前模块的state
   * @param {string} sortMode - 排序方式
   */
  SET_SORT_MODE(state, sortMode) {
    state.sortMode = sortMode;
  }
} 