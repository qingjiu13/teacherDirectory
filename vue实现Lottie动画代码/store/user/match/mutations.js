/**
 * 匹配模块的mutations
 * @module store/user/match/mutations
 */

export default {

  /**
   * 设置搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} searchKey - 搜索关键词
   */
  SET_SEARCH_KEY(state, searchKey) {
    state.searchKey = searchKey
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
   * 设置学校搜索关键词
   * @param {Object} state - 当前模块的state
   * @param {string} keyword - 搜索关键词
   */
  SET_SCHOOL_SEARCH_KEYWORD(state, keyword) {
    state.schoolList.searchKeyword = keyword;
  },
  
  /**
   * 设置学校选项列表
   * @param {Object} state - 当前模块的state
   * @param {Array} options - 学校选项列表 [{id, name}]
   * @param {boolean} isLoadMore - 是否为加载更多
   */
  SET_SCHOOL_OPTIONS(state, { options, isLoadMore = false }) {
    if (isLoadMore) {
      state.schoolList.options = [...state.schoolList.options, ...options];
    } else {
      state.schoolList.options = options;
    }
  },
  
  /**
   * 设置学校分页信息
   * @param {Object} state - 当前模块的state
   * @param {Object} pagination - 分页信息
   * @param {number} pagination.currentPage - 当前页码
   * @param {boolean} pagination.hasMore - 是否还有更多数据
   * @param {boolean} pagination.isLoading - 是否正在加载
   */
  SET_SCHOOL_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.schoolList.currentPage = currentPage;
    if (hasMore !== undefined) state.schoolList.hasMore = hasMore;
    if (isLoading !== undefined) state.schoolList.isLoading = isLoading;
  },
  
  /**
   * 设置选中的学校
   * @param {Object} state - 当前模块的state
   * @param {Object} school - 学校信息
   * @param {number} school.id - 学校ID
   * @param {string} school.name - 学校名称
   */
  SET_SELECTED_SCHOOL(state, { id, name }) {
    state.schoolList.selectedSchoolId = id;
    state.schoolList.selectedSchool = name;
  },
  
  /**
   * 设置专业课搜索关键词
   * @param {Object} state - 当前模块的state
   * @param {string} keyword - 搜索关键词
   */
  SET_PROFESSIONAL_SEARCH_KEYWORD(state, keyword) {
    state.professionalList.searchKeyword = keyword;
  },
  
  /**
   * 设置专业课选项列表
   * @param {Object} state - 当前模块的state
   * @param {Array} options - 专业课选项列表 [{id, name}]
   */
  SET_PROFESSIONAL_OPTIONS(state, options) {
    state.professionalList.options = options;
  },
  
  /**
   * 设置专业课分页信息
   * @param {Object} state - 当前模块的state
   * @param {Object} pagination - 分页信息
   * @param {number} pagination.currentPage - 当前页码
   * @param {boolean} pagination.hasMore - 是否还有更多数据
   * @param {boolean} pagination.isLoading - 是否正在加载
   */
  SET_PROFESSIONAL_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.professionalList.currentPage = currentPage;
    if (hasMore !== undefined) state.professionalList.hasMore = hasMore;
    if (isLoading !== undefined) state.professionalList.isLoading = isLoading;
  },
  
  /**
   * 设置选中的专业课
   * @param {Object} state - 当前模块的state
   * @param {Object} major - 专业信息
   * @param {number} major.id - 专业ID
   * @param {string} major.name - 专业名称
   */
  SET_SELECTED_PROFESSIONAL(state, { id, name }) {
    state.professionalList.selectedMajorId = id;
    state.professionalList.selectedMajor = name;
  },
  
  /**
   * 设置非专业课选择
   * @param {Object} state - 当前模块的state
   * @param {Object} payload - 非专业课信息
   * @param {string} payload.type - 非专业课类型 ('math', 'english', 'politics', 'other')
   * @param {number} payload.id - 选项ID
   * @param {string} payload.name - 选项名称
   */
  SET_NON_PROFESSIONAL_SELECTION(state, { type, id, name }) {
    // 先清空其他类型的选择
    Object.keys(state.nonProfessionalList).forEach(key => {
      if (key !== type) {
        state.nonProfessionalList[key].selectedId = null;
        state.nonProfessionalList[key].selected = '';
      }
    });
    
    // 设置当前类型的选择
    state.nonProfessionalList[type].selectedId = id;
    state.nonProfessionalList[type].selected = name;
  },
  
  /**
   * 清空非专业课选择
   * @param {Object} state - 当前模块的state
   */
  CLEAR_NON_PROFESSIONAL_SELECTION(state) {
    Object.keys(state.nonProfessionalList).forEach(key => {
      state.nonProfessionalList[key].selectedId = null;
      state.nonProfessionalList[key].selected = '';
    });
  },
  
  /**
   * 设置排序方式选项列表
   * @param {Object} state - 当前模块的state
   * @param {Array} options - 排序选项列表 [{id, name}]
   */
  SET_SORT_OPTIONS(state, options) {
    state.sortMode.options = options;
  },
  
  /**
   * 设置选中的排序方式
   * @param {Object} state - 当前模块的state
   * @param {Object} sort - 排序信息
   * @param {number} sort.id - 排序ID
   * @param {string} sort.name - 排序名称
   */
  SET_SELECTED_SORT_MODE(state, { id, name }) {
    state.sortMode.selectedId = id;
    state.sortMode.selected = name;
  },
  
  // 为了兼容原有代码，保留旧的mutations
  /**
   * @deprecated 请使用 SET_SELECTED_SCHOOL
   * 设置学校列表筛选
   * @param {Object} state - 当前模块的state
   * @param {string} schoolList - 学校名称
   */
  SET_SCHOOL_LIST(state, schoolList) {
    state.schoolList.selectedSchool = schoolList;
  },
  
  /**
   * @deprecated 请使用 SET_SELECTED_PROFESSIONAL
   * 设置专业课筛选
   * @param {Object} state - 当前模块的state
   * @param {string} professionalList - 专业课名称
   */
  SET_PROFESSIONAL_LIST(state, professionalList) {
    state.professionalList.selectedMajor = professionalList;
  },
  
  /**
   * @deprecated 请使用 SET_NON_PROFESSIONAL_SELECTION
   * 设置非专业课筛选
   * @param {Object} state - 当前模块的state
   * @param {Object} nonProfessionalList - 非专业课列表
   * @param {string} nonProfessionalList.math - 数学类型
   * @param {string} nonProfessionalList.english - 英语类型
   * @param {string} nonProfessionalList.politics - 政治类型
   * @param {string} nonProfessionalList.other - 其他类型
   */
  SET_NON_PROFESSIONAL_LIST(state, nonProfessionalList) {
    Object.keys(nonProfessionalList).forEach(key => {
      if (state.nonProfessionalList[key]) {
        state.nonProfessionalList[key].selected = nonProfessionalList[key] || '';
      }
    });
  },
  
  /**
   * @deprecated 请使用 SET_SELECTED_SORT_MODE
   * 设置排序方式
   * @param {Object} state - 当前模块的state
   * @param {string} sortMode - 排序方式
   */
  SET_SORT_MODE(state, sortMode) {
    state.sortMode.selected = sortMode;
  }
} 