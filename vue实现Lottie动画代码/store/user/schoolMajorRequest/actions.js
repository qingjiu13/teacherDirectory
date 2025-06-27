/**
 * 学校专业请求模块的actions
 * @module store/user/schoolMajorRequest/actions
 */

import { 
  getUndergraduateSchoolList,
  getUndergraduateMajorList,
  getGraduateSchoolList,
  getGraduateMajorList
} from '../APIroute/schoolMajorRequest_api/schoolMajorRequest_api.js';

export default {
  
  // ========== 本科学校搜索相关 actions ==========
  
  /**
   * 搜索本科学校列表
   * @param {Object} context - Vuex上下文对象
   * @param {Object} payload - 请求参数
   * @param {string} [payload.keyword] - 搜索关键词
   * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
   * @returns {Promise} 返回学校搜索结果
   */
  searchUndergraduateSchools({ commit, state }, { keyword = '', loadMore = false }) {
    // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
    const currentPage = loadMore ? state.undergraduateSchoolSearch.currentPage + 1 : 1;
    
    // 设置加载状态
    commit('SET_UNDERGRADUATE_SCHOOL_PAGINATION', { isLoading: true });
    
    // 更新搜索关键词（仅在新搜索时）
    if (!loadMore) {
      commit('SET_UNDERGRADUATE_SCHOOL_SEARCH_KEYWORD', keyword);
    }
    
    const params = {
      keyword: keyword,
      pageNum: currentPage,
      pageSize: state.undergraduateSchoolSearch.pageSize
    };
    
    return new Promise((resolve, reject) => {
      getUndergraduateSchoolList(params)
        .then(response => {
          if (response && response.success && response.data) {
            const schoolData = response.data;
            const schoolList = schoolData.rows || [];
            
            // 转换数据格式，只提取需要的字段：schoolId和schoolName
            const formattedSchools = schoolList.map(school => ({
              schoolId: school.schoolId,
              schoolName: school.schoolName
            }));
            
            // 更新学校选项列表
            commit('SET_UNDERGRADUATE_SCHOOL_OPTIONS', {
              options: formattedSchools,
              isLoadMore: loadMore
            });
            
            // 计算是否还有更多数据
            const total = schoolData.total || 0;
            const currentTotal = loadMore 
              ? state.undergraduateSchoolSearch.options.length + formattedSchools.length
              : formattedSchools.length;
            const hasMore = currentTotal < total;
            
            // 更新分页信息
            commit('SET_UNDERGRADUATE_SCHOOL_PAGINATION', {
              currentPage: currentPage,
              hasMore: hasMore,
              isLoading: false
            });
            
            resolve(response);
          } else {
            throw new Error('获取本科学校列表失败');
          }
        })
        .catch(error => {
          console.error('搜索本科学校失败:', error);
          commit('SET_UNDERGRADUATE_SCHOOL_PAGINATION', { isLoading: false });
          reject(error);
        });
    });
  },
  
  /**
   * 选择本科学校
   * @param {Object} context - Vuex上下文对象
   * @param {Object} school - 学校信息
   * @param {number} school.schoolId - 学校ID
   * @param {string} school.schoolName - 学校名称
   */
  selectUndergraduateSchool({ commit }, { schoolId, schoolName }) {
    commit('SET_SELECTED_UNDERGRADUATE_SCHOOL', { id: schoolId, name: schoolName });
  },
  
  // ========== 本科专业搜索相关 actions ==========
  
  /**
   * 搜索本科专业列表（独立搜索，不依赖学校）
   * @param {Object} context - Vuex上下文对象
   * @param {Object} payload - 请求参数
   * @param {string} [payload.keyword] - 搜索关键词
   * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
   * @returns {Promise} 返回专业搜索结果
   */
  searchUndergraduateMajors({ commit, state }, { keyword = '', loadMore = false }) {
    // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
    const currentPage = loadMore ? state.undergraduateMajorSearch.currentPage + 1 : 1;
    
    // 设置加载状态
    commit('SET_UNDERGRADUATE_MAJOR_PAGINATION', { isLoading: true });
    
    // 更新搜索关键词（仅在新搜索时）
    if (!loadMore) {
      commit('SET_UNDERGRADUATE_MAJOR_SEARCH_KEYWORD', keyword);
    }
    
    const params = {
      keyword: keyword,
      pageNum: currentPage,
      pageSize: state.undergraduateMajorSearch.pageSize
    };
    
    return new Promise((resolve, reject) => {
      getUndergraduateMajorList(params)
        .then(response => {
          if (response && response.success && response.data) {
            const majorData = response.data;
            const majorList = majorData.rows || [];
            
            // 转换数据格式，只提取需要的字段：professionalId和professionalName
            const formattedMajors = majorList.map(major => ({
              professionalId: major.professionalId,
              professionalName: major.professionalName
            }));
            
            // 更新专业选项列表
            commit('SET_UNDERGRADUATE_MAJOR_OPTIONS', {
              options: formattedMajors,
              isLoadMore: loadMore
            });
            
            // 计算是否还有更多数据
            const total = majorData.total || 0;
            const currentTotal = loadMore 
              ? state.undergraduateMajorSearch.options.length + formattedMajors.length
              : formattedMajors.length;
            const hasMore = currentTotal < total;
            
            // 更新分页信息
            commit('SET_UNDERGRADUATE_MAJOR_PAGINATION', {
              currentPage: currentPage,
              hasMore: hasMore,
              isLoading: false
            });
            
            resolve(response);
          } else {
            throw new Error('获取本科专业列表失败');
          }
        })
        .catch(error => {
          console.error('搜索本科专业失败:', error);
          commit('SET_UNDERGRADUATE_MAJOR_PAGINATION', { isLoading: false });
          reject(error);
        });
    });
  },
  
  /**
   * 选择本科专业
   * @param {Object} context - Vuex上下文对象
   * @param {Object} major - 专业信息
   * @param {number} major.professionalId - 专业ID
   * @param {string} major.professionalName - 专业名称
   */
  selectUndergraduateMajor({ commit }, { professionalId, professionalName }) {
    commit('SET_SELECTED_UNDERGRADUATE_MAJOR', { id: professionalId, name: professionalName });
  },
  
  // ========== 研究生学校搜索相关 actions ==========
  
  /**
   * 搜索研究生学校列表
   * @param {Object} context - Vuex上下文对象
   * @param {Object} payload - 请求参数
   * @param {string} [payload.keyword] - 搜索关键词
   * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
   * @returns {Promise} 返回学校搜索结果
   */
  searchGraduateSchools({ commit, state }, { keyword = '', loadMore = false }) {
    // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
    const currentPage = loadMore ? state.graduateSchoolSearch.currentPage + 1 : 1;
    
    // 设置加载状态
    commit('SET_GRADUATE_SCHOOL_PAGINATION', { isLoading: true });
    
    // 更新搜索关键词（仅在新搜索时）
    if (!loadMore) {
      commit('SET_GRADUATE_SCHOOL_SEARCH_KEYWORD', keyword);
    }
    
    const params = {
      keyword: keyword,
      pageNum: currentPage,
      pageSize: state.graduateSchoolSearch.pageSize
    };
    
    return new Promise((resolve, reject) => {
      getGraduateSchoolList(params)
        .then(response => {
          if (response && response.success && response.data) {
            const schoolData = response.data;
            const schoolList = schoolData.rows || [];
            
            // 转换数据格式，只提取需要的字段：schoolId和schoolName
            const formattedSchools = schoolList.map(school => ({
              schoolId: school.schoolId,
              schoolName: school.schoolName
            }));
            
            // 更新学校选项列表
            commit('SET_GRADUATE_SCHOOL_OPTIONS', {
              options: formattedSchools,
              isLoadMore: loadMore
            });
            
            // 计算是否还有更多数据
            const total = schoolData.total || 0;
            const currentTotal = loadMore 
              ? state.graduateSchoolSearch.options.length + formattedSchools.length
              : formattedSchools.length;
            const hasMore = currentTotal < total;
            
            // 更新分页信息
            commit('SET_GRADUATE_SCHOOL_PAGINATION', {
              currentPage: currentPage,
              hasMore: hasMore,
              isLoading: false
            });
            
            resolve(response);
          } else {
            throw new Error('获取研究生学校列表失败');
          }
        })
        .catch(error => {
          console.error('搜索研究生学校失败:', error);
          commit('SET_GRADUATE_SCHOOL_PAGINATION', { isLoading: false });
          reject(error);
        });
    });
  },
  
  /**
   * 选择研究生学校
   * @param {Object} context - Vuex上下文对象
   * @param {Object} school - 学校信息
   * @param {number} school.schoolId - 学校ID
   * @param {string} school.schoolName - 学校名称
   */
  selectGraduateSchool({ commit }, { schoolId, schoolName }) {
    commit('SET_SELECTED_GRADUATE_SCHOOL', { id: schoolId, name: schoolName });
    // 选择学校后，清空专业选择
    commit('CLEAR_GRADUATE_MAJOR_SELECTION');
  },
  
  // ========== 研究生专业搜索相关 actions ==========
  
  /**
   * 搜索研究生专业列表（依赖学校ID）
   * @param {Object} context - Vuex上下文对象
   * @param {Object} payload - 请求参数
   * @param {number} payload.schoolId - 学校ID
   * @param {string} [payload.keyword] - 搜索关键词
   * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
   * @returns {Promise} 返回专业搜索结果
   */
  searchGraduateMajors({ commit, state }, { schoolId, keyword = '', loadMore = false }) {
    if (!schoolId) {
      return Promise.reject(new Error('请先选择学校'));
    }
    
    // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
    const currentPage = loadMore ? state.graduateMajorSearch.currentPage + 1 : 1;
    
    // 设置加载状态
    commit('SET_GRADUATE_MAJOR_PAGINATION', { isLoading: true });
    
    // 更新搜索关键词（仅在新搜索时）
    if (!loadMore) {
      commit('SET_GRADUATE_MAJOR_SEARCH_KEYWORD', keyword);
    }
    
    const params = {
      schoolId: schoolId,
      keyword: keyword,
      pageNum: currentPage,
      pageSize: state.graduateMajorSearch.pageSize
    };
    
    return new Promise((resolve, reject) => {
      getGraduateMajorList(params)
        .then(response => {
          if (response && response.success && response.data) {
            const majorData = response.data;
            const majorList = majorData.rows || [];
            
            // 转换数据格式，只提取需要的字段：professionalId和professionalName
            const formattedMajors = majorList.map(major => ({
              professionalId: major.professionalId,
              professionalName: major.professionalName
            }));
            
            // 更新专业选项列表
            commit('SET_GRADUATE_MAJOR_OPTIONS', {
              options: formattedMajors,
              isLoadMore: loadMore
            });
            
            // 计算是否还有更多数据
            const total = majorData.total || 0;
            const currentTotal = loadMore 
              ? state.graduateMajorSearch.options.length + formattedMajors.length
              : formattedMajors.length;
            const hasMore = currentTotal < total;
            
            // 更新分页信息
            commit('SET_GRADUATE_MAJOR_PAGINATION', {
              currentPage: currentPage,
              hasMore: hasMore,
              isLoading: false
            });
            
            resolve(response);
          } else {
            throw new Error('获取研究生专业列表失败');
          }
        })
        .catch(error => {
          console.error('搜索研究生专业失败:', error);
          commit('SET_GRADUATE_MAJOR_PAGINATION', { isLoading: false });
          reject(error);
        });
    });
  },
  
  /**
   * 选择研究生专业
   * @param {Object} context - Vuex上下文对象
   * @param {Object} major - 专业信息
   * @param {number} major.professionalId - 专业ID
   * @param {string} major.professionalName - 专业名称
   */
  selectGraduateMajor({ commit }, { professionalId, professionalName }) {
    commit('SET_SELECTED_GRADUATE_MAJOR', { id: professionalId, name: professionalName });
  }
}; 