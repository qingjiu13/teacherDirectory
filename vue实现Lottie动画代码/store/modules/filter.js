// 通用筛选器管理模块
import schoolGraduateData from '../data/school_graduate.json'

const state = {
  // 筛选数据
  filterData: schoolGraduateData,
  
  // 当前选择项
  selectedSchool: '',
  selectedMajor: '',
  selectedSubject: '',
  
  // 筛选列表缓存
  schoolList: [],
  majorList: [],
  subjectList: [],
  
  // 搜索关键词
  schoolSearchKeyword: '',
  majorSearchKeyword: '',
  subjectSearchKeyword: ''
}

const getters = {
  /**
   * @description 获取学校列表
   * @return {Array} 学校列表数据
   */
  schoolOptions: (state) => {
    if (state.schoolList.length > 0) {
      return state.schoolList;
    }
    
    // 从原始数据生成学校列表
    const schools = state.filterData['学校'] || [];
    return schools.map(school => ({
      choiceItemContent: school.name,
      choiceItemValue: school.name
    }));
  },
  
  /**
   * @description 获取专业列表
   * @return {Array} 专业列表数据
   */
  majorOptions: (state) => {
    // 如果没有选择学校，返回空列表
    if (!state.selectedSchool) {
      return [];
    }
    
    // 根据选择的学校筛选专业
    const schools = state.filterData['学校'] || [];
    const school = schools.find(s => s.name === state.selectedSchool);
    
    if (!school) {
      return [];
    }
    
    // 从选中的学校中提取专业列表
    const majors = school['专业'] || [];
    return majors.map(major => ({
      choiceItemContent: major.name,
      choiceItemValue: major.name
    }));
  },
  
  /**
   * @description 获取考研科目列表
   * @return {Array} 考研科目列表数据
   */
  subjectOptions: (state) => {
    // 如果没有选择学校或专业，返回空列表
    if (!state.selectedSchool || !state.selectedMajor) {
      return [];
    }
    
    // 根据选择的学校和专业筛选考研科目
    const schools = state.filterData['学校'] || [];
    const school = schools.find(s => s.name === state.selectedSchool);
    
    if (!school) {
      return [];
    }
    
    const majors = school['专业'] || [];
    const major = majors.find(m => m.name === state.selectedMajor);
    
    if (!major) {
      return [];
    }
    
    // 从选中的专业中提取考研科目列表
    const subjects = major['考研科目'] || [];
    return subjects.map(subject => ({
      choiceItemContent: subject,
      choiceItemValue: subject
    }));
  },
  
  /**
   * @description 根据搜索关键词过滤学校列表
   * @return {Array} 过滤后的学校列表
   */
  filteredSchoolOptions: (state, getters) => {
    const options = getters.schoolOptions;
    
    if (!state.schoolSearchKeyword) {
      return options;
    }
    
    return options.filter(option => 
      option.choiceItemContent.toLowerCase().includes(state.schoolSearchKeyword.toLowerCase())
    );
  },
  
  /**
   * @description 根据搜索关键词过滤专业列表
   * @return {Array} 过滤后的专业列表
   */
  filteredMajorOptions: (state, getters) => {
    const options = getters.majorOptions;
    
    if (!state.majorSearchKeyword) {
      return options;
    }
    
    return options.filter(option => 
      option.choiceItemContent.toLowerCase().includes(state.majorSearchKeyword.toLowerCase())
    );
  },
  
  /**
   * @description 根据搜索关键词过滤考研科目列表
   * @return {Array} 过滤后的考研科目列表
   */
  filteredSubjectOptions: (state, getters) => {
    const options = getters.subjectOptions;
    
    if (!state.subjectSearchKeyword) {
      return options;
    }
    
    return options.filter(option => 
      option.choiceItemContent.toLowerCase().includes(state.subjectSearchKeyword.toLowerCase())
    );
  }
}

const mutations = {
  /**
   * @description 设置选中的学校
   * @param {Object} state Vuex状态
   * @param {String} school 选中的学校名称
   */
  SET_SELECTED_SCHOOL(state, school) {
    state.selectedSchool = school;
    // 重置专业和考研科目的选择
    state.selectedMajor = '';
    state.selectedSubject = '';
  },
  
  /**
   * @description 设置选中的专业
   * @param {Object} state Vuex状态
   * @param {String} major 选中的专业名称
   */
  SET_SELECTED_MAJOR(state, major) {
    state.selectedMajor = major;
    // 重置考研科目的选择
    state.selectedSubject = '';
  },
  
  /**
   * @description 设置选中的考研科目
   * @param {Object} state Vuex状态
   * @param {String} subject 选中的考研科目
   */
  SET_SELECTED_SUBJECT(state, subject) {
    state.selectedSubject = subject;
  },
  
  /**
   * @description 设置学校搜索关键词
   * @param {Object} state Vuex状态
   * @param {String} keyword 搜索关键词
   */
  SET_SCHOOL_SEARCH_KEYWORD(state, keyword) {
    state.schoolSearchKeyword = keyword;
  },
  
  /**
   * @description 设置专业搜索关键词
   * @param {Object} state Vuex状态
   * @param {String} keyword 搜索关键词
   */
  SET_MAJOR_SEARCH_KEYWORD(state, keyword) {
    state.majorSearchKeyword = keyword;
  },
  
  /**
   * @description 设置考研科目搜索关键词
   * @param {Object} state Vuex状态
   * @param {String} keyword 搜索关键词
   */
  SET_SUBJECT_SEARCH_KEYWORD(state, keyword) {
    state.subjectSearchKeyword = keyword;
  },
  
  /**
   * @description 重置所有筛选条件
   * @param {Object} state Vuex状态
   */
  RESET_FILTERS(state) {
    state.selectedSchool = '';
    state.selectedMajor = '';
    state.selectedSubject = '';
    state.schoolSearchKeyword = '';
    state.majorSearchKeyword = '';
    state.subjectSearchKeyword = '';
  }
}

const actions = {
  /**
   * @description 选择学校
   * @param {Object} context Vuex上下文
   * @param {String} school 学校名称
   */
  selectSchool({ commit }, school) {
    commit('SET_SELECTED_SCHOOL', school);
  },
  
  /**
   * @description 选择专业
   * @param {Object} context Vuex上下文
   * @param {String} major 专业名称
   */
  selectMajor({ commit }, major) {
    commit('SET_SELECTED_MAJOR', major);
  },
  
  /**
   * @description 选择考研科目
   * @param {Object} context Vuex上下文
   * @param {String} subject 考研科目
   */
  selectSubject({ commit }, subject) {
    commit('SET_SELECTED_SUBJECT', subject);
  },
  
  /**
   * @description 设置学校搜索关键词
   * @param {Object} context Vuex上下文
   * @param {String} keyword 关键词
   */
  searchSchool({ commit }, keyword) {
    commit('SET_SCHOOL_SEARCH_KEYWORD', keyword);
  },
  
  /**
   * @description 设置专业搜索关键词
   * @param {Object} context Vuex上下文
   * @param {String} keyword 关键词
   */
  searchMajor({ commit }, keyword) {
    commit('SET_MAJOR_SEARCH_KEYWORD', keyword);
  },
  
  /**
   * @description 设置考研科目搜索关键词
   * @param {Object} context Vuex上下文
   * @param {String} keyword 关键词
   */
  searchSubject({ commit }, keyword) {
    commit('SET_SUBJECT_SEARCH_KEYWORD', keyword);
  },
  
  /**
   * @description 重置所有筛选条件
   * @param {Object} context Vuex上下文
   */
  resetFilters({ commit }) {
    commit('RESET_FILTERS');
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 