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
 * 设置搜索关键词
 * @param {Object} context - Vuex上下文对象
 * @param {string} searchKey - 搜索关键词
 * @returns {Promise} 返回Promise对象
 */
export const setSearchKey = ({ commit, dispatch }, searchKey) => {
  commit('SET_SEARCH_KEY', searchKey);
  
  // 当搜索关键词改变时，重新获取匹配的老师列表
  return dispatch('fetchMatchTeacherList');
};

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
    school: state.schoolList.selectedSchoolId,
    professional: state.professionalList.selectedMajorId,
    nonProfessionalList: nonProfessionalList,
    sortMode: state.sortMode.selectedId,
    pageNum: currentPage,
    pageSize: payload.pageSize || state.pageSize,
    searchKey: state.searchKey // 使用store中的searchKey
  };
  
  return new Promise((resolve, reject) => {
    getMatchTeacherList(params)
      .then(response => {
        // JWT.js的apiRequest返回 {success: true, data: ...} 格式
        if (response && response.success && response.data) {
          // response.data 是API响应的data字段：{ data: [...], hasMore: false }
          const matchData = response.data;
          
          // 获取老师列表数组
          const teacherList = matchData.data || [];
          
          if (isLoadMore) {
            // 加载更多时，追加到现有列表
            commit('APPEND_MATCH_LIST', teacherList);
          } else {
            // 重新加载时，替换列表
            commit('SET_MATCH_LIST', teacherList);
          }
          
          // 更新分页信息
          commit('SET_PAGINATION', {
            currentPage: currentPage,
            hasMore: matchData.hasMore || false
          });
          
          console.log('匹配老师列表更新成功:', teacherList);
        }
        resolve(response);
      })
      .catch(error => {
        console.error('获取匹配老师列表失败:', error);
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
        // JWT.js的apiRequest返回 {success: true, data: ...} 格式
        if (response && response.success && response.data) {
          const schoolData = response.data;
          
          // 更新学校选项列表
          commit('SET_SCHOOL_OPTIONS', {
            options: schoolData.list || schoolData,
            isLoadMore: loadMore
          });
          
          // 更新分页信息
          commit('SET_SCHOOL_PAGINATION', {
            currentPage: currentPage,
            hasMore: schoolData.hasMore || false,
            isLoading: false
          });
        }
        resolve(response);
      })
      .catch(error => {
        console.error('搜索学校失败:', error);
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
  
  // 设置加载状态
  commit('SET_PROFESSIONAL_PAGINATION', { isLoading: true });
  
  // 更新搜索关键词
  commit('SET_PROFESSIONAL_SEARCH_KEYWORD', keyword);
  
  const params = {
    userId: userId,
    schoolId: schoolId,
    keyword: keyword,
    currentPage: state.professionalList.currentPage,
    pageSize: state.professionalList.pageSize // 使用99999一次性获取所有数据
  };
  
  return new Promise((resolve, reject) => {
    searchMajorList(params)
      .then(response => {
        // JWT.js的apiRequest返回 {success: true, data: ...} 格式
        if (response && response.success && response.data) {
          const majorData = response.data;
          
          // 更新专业选项列表
          commit('SET_PROFESSIONAL_OPTIONS', majorData.list || majorData);
          
          // 更新分页信息
          commit('SET_PROFESSIONAL_PAGINATION', {
            currentPage: state.professionalList.currentPage,
            hasMore: majorData.hasMore || false,
            isLoading: false
          });
        }
        resolve(response);
      })
      .catch(error => {
        console.error('搜索专业失败:', error);
        commit('SET_PROFESSIONAL_PAGINATION', { isLoading: false });
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
        // JWT.js的apiRequest返回 {success: true, data: ...} 格式
        if (response && response.success && response.data) {
          const sortData = response.data;
          // 更新排序选项列表
          commit('SET_SORT_OPTIONS', sortData.list || sortData);
        }
        resolve(response);
      })
      .catch(error => {
        console.error('获取排序选项失败:', error);
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
  console.log('=== fetchTeacherDetail 开始执行 ===');
  console.log('teacherId:', teacherId);
  
  // 从根state获取用户ID
  const userId = rootState.user.baseInfo.id;
  console.log('userId:', userId);
  
  if (!teacherId) {
    console.error('teacherId 为空，退出');
    return Promise.reject(new Error('老师ID不能为空'));
  }
  
  // 构建请求参数
  const params = {
    userId: userId,
    teacherId: teacherId
  };
  
  console.log('构建的请求参数:', params);
  
  return new Promise((resolve, reject) => {
    console.log('准备调用 getTeacherDetail API...');
    
    getTeacherDetail(params)
      .then(response => {
        console.log('=== API 响应完整数据 ===');
        console.log('response:', JSON.stringify(response, null, 2));
        
        // 检查返回的数据结构
        if (response && response.success) {
          console.log('response.success 为 true');
          
          if (response.data) {
            console.log('response.data 存在');
            console.log('response.data:', JSON.stringify(response.data, null, 2));
            
            const teacherDetail = response.data;
            
            console.log('准备调用 SET_TEACHER_DETAIL mutation...');
            console.log('teacherId:', teacherId);
            console.log('detail:', JSON.stringify(teacherDetail, null, 2));
            
            // 更新老师详情到store
            commit('SET_TEACHER_DETAIL', {
              teacherId: teacherId,
              detail: teacherDetail
            });
            
            console.log('SET_TEACHER_DETAIL mutation 调用完成');
          } else {
            console.error('response.data 不存在');
          }
        } else {
          console.error('response.success 不为 true 或 response 不存在');
          console.log('响应格式不正确:', response);
          reject(new Error('响应数据格式不正确'));
          return;
        }
        
        console.log('=== fetchTeacherDetail 成功完成 ===');
        resolve(response);
      })
      .catch(error => {
        console.error('=== fetchTeacherDetail 发生错误 ===');
        console.error('错误详情:', error);
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
