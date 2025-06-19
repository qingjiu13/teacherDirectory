/**
 * 学校专业请求模块的mutations
 * @module store/user/schoolMajorRequest/mutations
 */

export default {
  
  // ========== 本科学校搜索相关 mutations ==========
  
  /**
   * 设置本科学校搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} keyword - 搜索关键词
   */
  SET_UNDERGRADUATE_SCHOOL_SEARCH_KEYWORD(state, keyword) {
    state.undergraduateSchoolSearch.searchKeyword = keyword;
  },
  
  /**
   * 设置本科学校选项列表
   * @param {Object} state - 状态对象
   * @param {Object} payload - 载荷对象
   * @param {Array} payload.options - 学校选项列表 [{schoolId, schoolName}]
   * @param {boolean} [payload.isLoadMore=false] - 是否为加载更多
   */
  SET_UNDERGRADUATE_SCHOOL_OPTIONS(state, { options, isLoadMore = false }) {
    if (isLoadMore) {
      state.undergraduateSchoolSearch.options = [...state.undergraduateSchoolSearch.options, ...options];
    } else {
      state.undergraduateSchoolSearch.options = options;
    }
  },
  
  /**
   * 设置本科学校分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   * @param {number} [pagination.currentPage] - 当前页码
   * @param {boolean} [pagination.hasMore] - 是否还有更多数据
   * @param {boolean} [pagination.isLoading] - 是否正在加载
   */
  SET_UNDERGRADUATE_SCHOOL_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.undergraduateSchoolSearch.currentPage = currentPage;
    if (hasMore !== undefined) state.undergraduateSchoolSearch.hasMore = hasMore;
    if (isLoading !== undefined) state.undergraduateSchoolSearch.isLoading = isLoading;
  },
  
  /**
   * 设置选中的本科学校
   * @param {Object} state - 状态对象
   * @param {Object} school - 学校信息
   * @param {number} school.id - 学校ID
   * @param {string} school.name - 学校名称
   */
  SET_SELECTED_UNDERGRADUATE_SCHOOL(state, { id, name }) {
    state.undergraduateSchoolSearch.selectedSchoolId = id;
    state.undergraduateSchoolSearch.selectedSchool = name;
  },
  
  // ========== 本科专业搜索相关 mutations ==========
  
  /**
   * 设置本科专业搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} keyword - 搜索关键词
   */
  SET_UNDERGRADUATE_MAJOR_SEARCH_KEYWORD(state, keyword) {
    state.undergraduateMajorSearch.searchKeyword = keyword;
  },
  
  /**
   * 设置本科专业选项列表
   * @param {Object} state - 状态对象
   * @param {Object} payload - 载荷对象
   * @param {Array} payload.options - 专业选项列表 [{professionalId, professionalName}]
   * @param {boolean} [payload.isLoadMore=false] - 是否为加载更多
   */
  SET_UNDERGRADUATE_MAJOR_OPTIONS(state, { options, isLoadMore = false }) {
    if (isLoadMore) {
      state.undergraduateMajorSearch.options = [...state.undergraduateMajorSearch.options, ...options];
    } else {
      state.undergraduateMajorSearch.options = options;
    }
  },
  
  /**
   * 设置本科专业分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   * @param {number} [pagination.currentPage] - 当前页码
   * @param {boolean} [pagination.hasMore] - 是否还有更多数据
   * @param {boolean} [pagination.isLoading] - 是否正在加载
   */
  SET_UNDERGRADUATE_MAJOR_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.undergraduateMajorSearch.currentPage = currentPage;
    if (hasMore !== undefined) state.undergraduateMajorSearch.hasMore = hasMore;
    if (isLoading !== undefined) state.undergraduateMajorSearch.isLoading = isLoading;
  },
  
  /**
   * 设置选中的本科专业
   * @param {Object} state - 状态对象
   * @param {Object} major - 专业信息
   * @param {number} major.id - 专业ID
   * @param {string} major.name - 专业名称
   */
  SET_SELECTED_UNDERGRADUATE_MAJOR(state, { id, name }) {
    state.undergraduateMajorSearch.selectedMajorId = id;
    state.undergraduateMajorSearch.selectedMajor = name;
  },
  
  // ========== 研究生学校搜索相关 mutations ==========
  
  /**
   * 设置研究生学校搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} keyword - 搜索关键词
   */
  SET_GRADUATE_SCHOOL_SEARCH_KEYWORD(state, keyword) {
    state.graduateSchoolSearch.searchKeyword = keyword;
  },
  
  /**
   * 设置研究生学校选项列表
   * @param {Object} state - 状态对象
   * @param {Object} payload - 载荷对象
   * @param {Array} payload.options - 学校选项列表 [{schoolId, schoolName}]
   * @param {boolean} [payload.isLoadMore=false] - 是否为加载更多
   */
  SET_GRADUATE_SCHOOL_OPTIONS(state, { options, isLoadMore = false }) {
    if (isLoadMore) {
      state.graduateSchoolSearch.options = [...state.graduateSchoolSearch.options, ...options];
    } else {
      state.graduateSchoolSearch.options = options;
    }
  },
  
  /**
   * 设置研究生学校分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   * @param {number} [pagination.currentPage] - 当前页码
   * @param {boolean} [pagination.hasMore] - 是否还有更多数据
   * @param {boolean} [pagination.isLoading] - 是否正在加载
   */
  SET_GRADUATE_SCHOOL_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.graduateSchoolSearch.currentPage = currentPage;
    if (hasMore !== undefined) state.graduateSchoolSearch.hasMore = hasMore;
    if (isLoading !== undefined) state.graduateSchoolSearch.isLoading = isLoading;
  },
  
  /**
   * 设置选中的研究生学校
   * @param {Object} state - 状态对象
   * @param {Object} school - 学校信息
   * @param {number} school.id - 学校ID
   * @param {string} school.name - 学校名称
   */
  SET_SELECTED_GRADUATE_SCHOOL(state, { id, name }) {
    state.graduateSchoolSearch.selectedSchoolId = id;
    state.graduateSchoolSearch.selectedSchool = name;
  },
  
  // ========== 研究生专业搜索相关 mutations ==========
  
  /**
   * 设置研究生专业搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} keyword - 搜索关键词
   */
  SET_GRADUATE_MAJOR_SEARCH_KEYWORD(state, keyword) {
    state.graduateMajorSearch.searchKeyword = keyword;
  },
  
  /**
   * 设置研究生专业选项列表
   * @param {Object} state - 状态对象
   * @param {Object} payload - 载荷对象
   * @param {Array} payload.options - 专业选项列表 [{professionalId, professionalName}]
   * @param {boolean} [payload.isLoadMore=false] - 是否为加载更多
   */
  SET_GRADUATE_MAJOR_OPTIONS(state, { options, isLoadMore = false }) {
    if (isLoadMore) {
      state.graduateMajorSearch.options = [...state.graduateMajorSearch.options, ...options];
    } else {
      state.graduateMajorSearch.options = options;
    }
  },
  
  /**
   * 设置研究生专业分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   * @param {number} [pagination.currentPage] - 当前页码
   * @param {boolean} [pagination.hasMore] - 是否还有更多数据
   * @param {boolean} [pagination.isLoading] - 是否正在加载
   */
  SET_GRADUATE_MAJOR_PAGINATION(state, { currentPage, hasMore, isLoading }) {
    if (currentPage !== undefined) state.graduateMajorSearch.currentPage = currentPage;
    if (hasMore !== undefined) state.graduateMajorSearch.hasMore = hasMore;
    if (isLoading !== undefined) state.graduateMajorSearch.isLoading = isLoading;
  },
  
  /**
   * 设置选中的研究生专业
   * @param {Object} state - 状态对象
   * @param {Object} major - 专业信息
   * @param {number} major.id - 专业ID
   * @param {string} major.name - 专业名称
   */
  SET_SELECTED_GRADUATE_MAJOR(state, { id, name }) {
    state.graduateMajorSearch.selectedMajorId = id;
    state.graduateMajorSearch.selectedMajor = name;
  },
  
  // ========== 清空相关 mutations ==========
  
  /**
   * 清空研究生专业选择（当学校改变时）
   * @param {Object} state - 状态对象
   */
  CLEAR_GRADUATE_MAJOR_SELECTION(state) {
    state.graduateMajorSearch.selectedMajorId = null;
    state.graduateMajorSearch.selectedMajor = '';
    state.graduateMajorSearch.options = [];
    state.graduateMajorSearch.searchKeyword = '';
    state.graduateMajorSearch.currentPage = 1;
    state.graduateMajorSearch.hasMore = true;
  }
}; 