/**
 * match模块的actions
 * @module store/user/match/actions
 */

import { 
  getMatchTeacherList, 
  getTeacherDetail,
  searchSchoolList,
  searchMajorList,
  getNonProfessionalOptions,
  getSortModeOptions
} from '../APIroute/match_api/match_api.js';

/**
 * 获取匹配的老师列表
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 请求参数
 * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
 * @returns {Promise} 返回匹配的老师列表结果
 */
export const fetchMatchTeacherList = ({ commit, rootState, state }, payload = {}) => {
  // 从根state获取用户ID
  const userId = rootState.user.baseInfo.id;
  
  // 判断是加载更多还是重新加载第一页
  const isLoadMore = payload.loadMore === true;
  
  // 如果是加载更多，则页码加1，否则重置为第1页
  const currentPage = isLoadMore ? state.currentPage + 1 : 1;
  
  // 构建非专业课参数
  const nonProfessionalList = {
    mathId: state.nonProfessionalList.math.selectedId,
    englishId: state.nonProfessionalList.english.selectedId,
    politicsId: state.nonProfessionalList.politics.selectedId,
    otherId: state.nonProfessionalList.other.selectedId
  };
  
  // 构建请求参数
  const params = {
    userId: userId,
    schoolId: state.schoolList.selectedSchoolId,
    professionalId: state.professionalList.selectedMajorId,
    nonProfessionalList: nonProfessionalList,
    sortModeId: state.sortMode.selectedId,
    currentPage: currentPage,
    pageSize: payload.pageSize || state.pageSize
  };
  
  return new Promise((resolve, reject) => {
    getMatchTeacherList(params)
      .then(response => {
        // 更新matchList
        if (response && response.data) {
          if (isLoadMore) {
            // 加载更多时，追加到现有列表
            commit('APPEND_MATCH_LIST', response.data);
          } else {
            // 重新加载时，替换列表
            commit('SET_MATCH_LIST', response.data);
          }
          
          // 更新分页信息
          commit('SET_PAGINATION', {
            currentPage: currentPage,
            hasMore: response.hasMore || false
          });
        }
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * 搜索学校列表
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 请求参数
 * @param {string} payload.keyword - 搜索关键词
 * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
 * @returns {Promise} 返回学校搜索结果
 */
export const searchSchools = ({ commit, rootState, state }, { keyword, loadMore = false }) => {
  const userId = rootState.user.baseInfo.id;
  
  // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
  const currentPage = loadMore ? state.schoolList.currentPage + 1 : 1;
  
  // 设置加载状态
  commit('SET_SCHOOL_PAGINATION', { isLoading: true });
  
  // 更新搜索关键词
  if (!loadMore) {
    commit('SET_SCHOOL_SEARCH_KEYWORD', keyword);
  }
  
  const params = {
    userId: userId,
    keyword: keyword,
    currentPage: currentPage,
    pageSize: state.schoolList.pageSize
  };
  
  return new Promise((resolve, reject) => {
    searchSchoolList(params)
      .then(response => {
        if (response && response.data) {
          // 更新学校选项列表
          commit('SET_SCHOOL_OPTIONS', {
            options: response.data,
            isLoadMore: loadMore
          });
          
          // 更新分页信息
          commit('SET_SCHOOL_PAGINATION', {
            currentPage: currentPage,
            hasMore: response.hasMore || false,
            isLoading: false
          });
        }
        resolve(response);
      })
      .catch(error => {
        commit('SET_SCHOOL_PAGINATION', { isLoading: false });
        reject(error);
      });
  });
};

/**
 * 搜索专业列表
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 请求参数
 * @param {string} payload.keyword - 搜索关键词
 * @returns {Promise} 返回专业搜索结果
 */
export const searchMajors = ({ commit, rootState, state }, { keyword }) => {
  const userId = rootState.user.baseInfo.id;
  const schoolId = state.schoolList.selectedSchoolId;
  
  if (!schoolId) {
    return Promise.reject(new Error('请先选择学校'));
  }
  
  // 更新搜索关键词
  commit('SET_PROFESSIONAL_SEARCH_KEYWORD', keyword);
  
  const params = {
    userId: userId,
    schoolId: schoolId,
    keyword: keyword
  };
  
  return new Promise((resolve, reject) => {
    searchMajorList(params)
      .then(response => {
        if (response && response.data) {
          // 更新专业选项列表
          commit('SET_PROFESSIONAL_OPTIONS', response.data);
        }
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * 获取非专业课选项
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 请求参数
 * @param {string} payload.type - 非专业课类型
 * @returns {Promise} 返回非专业课选项列表
 */
export const fetchNonProfessionalOptions = ({ commit, rootState }, { type }) => {
  const userId = rootState.user.baseInfo.id;
  
  const params = {
    userId: userId,
    type: type
  };
  
  return new Promise((resolve, reject) => {
    getNonProfessionalOptions(params)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * 获取排序方式选项
 * @param {Object} context - Vuex上下文对象
 * @returns {Promise} 返回排序方式选项列表
 */
export const fetchSortModeOptions = ({ commit, rootState }) => {
  const userId = rootState.user.baseInfo.id;
  
  const params = {
    userId: userId
  };
  
  return new Promise((resolve, reject) => {
    getSortModeOptions(params)
      .then(response => {
        if (response && response.data) {
          // 更新排序选项列表
          commit('SET_SORT_OPTIONS', response.data);
        }
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * 选择学校
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 学校信息
 * @param {number} payload.id - 学校ID
 * @param {string} payload.name - 学校名称
 */
export const selectSchool = ({ commit }, { id, name }) => {
  commit('SET_SELECTED_SCHOOL', { id, name });
  // 清空专业选择
  commit('SET_SELECTED_PROFESSIONAL', { id: null, name: '' });
  commit('SET_PROFESSIONAL_OPTIONS', []);
};

/**
 * 选择专业
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 专业信息
 * @param {number} payload.id - 专业ID
 * @param {string} payload.name - 专业名称
 */
export const selectMajor = ({ commit }, { id, name }) => {
  commit('SET_SELECTED_PROFESSIONAL', { id, name });
  // 清空非专业课选择
  commit('CLEAR_NON_PROFESSIONAL_SELECTION');
};

/**
 * 选择非专业课
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 非专业课信息
 * @param {string} payload.type - 非专业课类型
 * @param {number} payload.id - 选项ID
 * @param {string} payload.name - 选项名称
 */
export const selectNonProfessional = ({ commit }, { type, id, name }) => {
  commit('SET_NON_PROFESSIONAL_SELECTION', { type, id, name });
  // 清空专业课选择
  commit('SET_SELECTED_PROFESSIONAL', { id: null, name: '' });
};

/**
 * 选择排序方式
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 排序信息
 * @param {number} payload.id - 排序ID
 * @param {string} payload.name - 排序名称
 */
export const selectSortMode = ({ commit }, { id, name }) => {
  commit('SET_SELECTED_SORT_MODE', { id, name });
};

/**
 * 获取老师详细信息
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 请求参数
 * @param {string} payload.teacherId - 老师ID
 * @returns {Promise} 返回老师详细信息
 */
export const fetchTeacherDetail = ({ commit, rootState }, { teacherId }) => {
  // 从根state获取用户ID
  const userId = rootState.user.baseInfo.id;
  
  if (!teacherId) {
    return Promise.reject(new Error('老师ID不能为空'));
  }
  
  // 构建请求参数
  const params = {
    userId: userId,
    teacherId: teacherId
  };
  
  return new Promise((resolve, reject) => {
    getTeacherDetail(params)
      .then(response => {
        // 更新老师详情
        if (response && response.data) {
          commit('SET_TEACHER_DETAIL', {
            teacherId: teacherId,
            detail: response.data
          });
        }
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default {
  fetchMatchTeacherList,
  searchSchools,
  searchMajors,
  fetchNonProfessionalOptions,
  fetchSortModeOptions,
  selectSchool,
  selectMajor,
  selectNonProfessional,
  selectSortMode,
  fetchTeacherDetail
};
