/**
 * 学校专业请求模块的getters
 * @module store/user/schoolMajorRequest/getters
 */

export default {
  
  // ========== 本科学校相关 getters ==========
  
  /**
   * 获取本科学校搜索选项列表
   * @param {Object} state - 状态对象
   * @returns {Array} 学校选项列表
   */
  undergraduateSchoolOptions: state => state.undergraduateSchoolSearch.options,
  
  /**
   * 获取选中的本科学校信息
   * @param {Object} state - 状态对象
   * @returns {Object} 选中的学校信息
   */
  selectedUndergraduateSchool: state => ({
    id: state.undergraduateSchoolSearch.selectedSchoolId,
    name: state.undergraduateSchoolSearch.selectedSchool
  }),
  
  /**
   * 获取本科学校搜索状态
   * @param {Object} state - 状态对象
   * @returns {Object} 搜索状态信息
   */
  undergraduateSchoolSearchStatus: state => ({
    keyword: state.undergraduateSchoolSearch.searchKeyword,
    isLoading: state.undergraduateSchoolSearch.isLoading,
    hasMore: state.undergraduateSchoolSearch.hasMore,
    currentPage: state.undergraduateSchoolSearch.currentPage
  }),
  
  // ========== 本科专业相关 getters ==========
  
  /**
   * 获取本科专业搜索选项列表
   * @param {Object} state - 状态对象
   * @returns {Array} 专业选项列表
   */
  undergraduateMajorOptions: state => state.undergraduateMajorSearch.options,
  
  /**
   * 获取选中的本科专业信息
   * @param {Object} state - 状态对象
   * @returns {Object} 选中的专业信息
   */
  selectedUndergraduateMajor: state => ({
    id: state.undergraduateMajorSearch.selectedMajorId,
    name: state.undergraduateMajorSearch.selectedMajor
  }),
  
  /**
   * 获取本科专业搜索状态
   * @param {Object} state - 状态对象
   * @returns {Object} 搜索状态信息
   */
  undergraduateMajorSearchStatus: state => ({
    keyword: state.undergraduateMajorSearch.searchKeyword,
    isLoading: state.undergraduateMajorSearch.isLoading,
    hasMore: state.undergraduateMajorSearch.hasMore,
    currentPage: state.undergraduateMajorSearch.currentPage
  }),
  
  // ========== 研究生学校相关 getters ==========
  
  /**
   * 获取研究生学校搜索选项列表
   * @param {Object} state - 状态对象
   * @returns {Array} 学校选项列表
   */
  graduateSchoolOptions: state => state.graduateSchoolSearch.options,
  
  /**
   * 获取选中的研究生学校信息
   * @param {Object} state - 状态对象
   * @returns {Object} 选中的学校信息
   */
  selectedGraduateSchool: state => ({
    id: state.graduateSchoolSearch.selectedSchoolId,
    name: state.graduateSchoolSearch.selectedSchool
  }),
  
  /**
   * 获取研究生学校搜索状态
   * @param {Object} state - 状态对象
   * @returns {Object} 搜索状态信息
   */
  graduateSchoolSearchStatus: state => ({
    keyword: state.graduateSchoolSearch.searchKeyword,
    isLoading: state.graduateSchoolSearch.isLoading,
    hasMore: state.graduateSchoolSearch.hasMore,
    currentPage: state.graduateSchoolSearch.currentPage
  }),
  
  // ========== 研究生专业相关 getters ==========
  
  /**
   * 获取研究生专业搜索选项列表
   * @param {Object} state - 状态对象
   * @returns {Array} 专业选项列表
   */
  graduateMajorOptions: state => state.graduateMajorSearch.options,
  
  /**
   * 获取选中的研究生专业信息
   * @param {Object} state - 状态对象
   * @returns {Object} 选中的专业信息
   */
  selectedGraduateMajor: state => ({
    id: state.graduateMajorSearch.selectedMajorId,
    name: state.graduateMajorSearch.selectedMajor
  }),
  
  /**
   * 获取研究生专业搜索状态
   * @param {Object} state - 状态对象
   * @returns {Object} 搜索状态信息
   */
  graduateMajorSearchStatus: state => ({
    keyword: state.graduateMajorSearch.searchKeyword,
    isLoading: state.graduateMajorSearch.isLoading,
    hasMore: state.graduateMajorSearch.hasMore,
    currentPage: state.graduateMajorSearch.currentPage
  }),
  
  // ========== 验证相关 getters ==========
  
  /**
   * 检查本科信息是否完整
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否选择了学校和专业
   */
  isUndergraduateInfoComplete: state => {
    return !!(state.undergraduateSchoolSearch.selectedSchoolId && 
              state.undergraduateMajorSearch.selectedMajorId);
  },
  
  /**
   * 检查研究生信息是否完整
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否选择了学校和专业
   */
  isGraduateInfoComplete: state => {
    return !!(state.graduateSchoolSearch.selectedSchoolId && 
              state.graduateMajorSearch.selectedMajorId);
  },
  
  /**
   * 获取完整的本科信息
   * @param {Object} state - 状态对象
   * @returns {Object} 本科完整信息
   */
  undergraduateFullInfo: state => ({
    school: {
      id: state.undergraduateSchoolSearch.selectedSchoolId,
      name: state.undergraduateSchoolSearch.selectedSchool
    },
    major: {
      id: state.undergraduateMajorSearch.selectedMajorId,
      name: state.undergraduateMajorSearch.selectedMajor
    }
  }),
  
  /**
   * 获取完整的研究生信息
   * @param {Object} state - 状态对象
   * @returns {Object} 研究生完整信息
   */
  graduateFullInfo: state => ({
    school: {
      id: state.graduateSchoolSearch.selectedSchoolId,
      name: state.graduateSchoolSearch.selectedSchool
    },
    major: {
      id: state.graduateMajorSearch.selectedMajorId,
      name: state.graduateMajorSearch.selectedMajor
    }
  })
}; 