/**
 * match模块的actions
 * @module store/user/match/actions
 */
// API 基础URL
// const API_BASE_URL = 'http://x62e45a8.natappfree.cc';
import { 
  getTeacherDetail,
  getNonProfessionalOptions,
  getSortModeOptions
} from '../APIroute/match_api/match_api.js';
import { apiRequest } from '../JWT.js';
import { useGlobalStore } from '../../global.js';
const getApiPrefix = () => {
  const globalStore = useGlobalStore()
  return globalStore.apiBaseUrl
}
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
export const fetchMatchTeacherList = async ({ commit, rootState, state }, payload = {}) => {
  try {
    const isLoadMore = payload.loadMore === true;
    const currentPage = isLoadMore ? state.currentPage + 1 : 1;

    const nonProfessionalList = {
      mathId: state.nonProfessionalList?.math?.selectedId || null,
      englishId: state.nonProfessionalList?.english?.selectedId || null,
      politicsId: state.nonProfessionalList?.politics?.selectedId || null,
      otherId: state.nonProfessionalList?.other?.selectedId || null
    };

    const selectedSchool = rootState?.user?.schoolMajorRequest?.graduateSchoolSearch?.selectedSchoolId;
    const selectedMajor = rootState?.user?.schoolMajorRequest?.graduateMajorSearch?.selectedMajorId;

    const params = {
      school: selectedSchool,
      professional: selectedMajor,
      nonProfessionalList,
      sortMode: state.sortMode?.selectedId || null,
      pageNum: currentPage,
      pageSize: payload.pageSize || state.pageSize || 10,
      searchKey: state.searchKey || ''
    };

    const response = await apiRequest(`${getApiPrefix()}/yanshilu/teacher/match`, 'POST', params);
    console.log('匹配老师列表响应:', response);
    if (response?.success && response.data.code === 200) {
      const matchData = response.data.data;
      const teacherList = matchData.data || [];

      if (isLoadMore) {
        commit('APPEND_MATCH_LIST', teacherList);
      } else {
        commit('SET_MATCH_LIST', teacherList);
      }

      commit('SET_PAGINATION', {
        currentPage,
        hasMore: matchData.hasMore || false
      });

      console.log('匹配老师列表更新成功:', teacherList);
    } else {
      console.warn('匹配接口返回数据格式异常:', response);
    }

    return response;
  } catch (error) {
    console.error('获取匹配老师列表失败:', error);
    throw error;
  }
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
 * 选择非专业课
 * @param {Object} context - Vuex上下文对象
 * @param {Object} payload - 非专业课信息
 * @param {string} payload.type - 非专业课类型
 * @param {number} payload.id - 选项ID
 * @param {string} payload.name - 选项名称
 */
export const selectNonProfessional = ({ commit }, { type, id, name }) => {
  commit('SET_NON_PROFESSIONAL_SELECTION', { type, id, name });
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
 * @param {number} payload.teacherId - 老师ID（数字类型）
 * @returns {Promise} 返回老师详细信息
 */
export const fetchTeacherDetail = ({ commit, rootState }, { teacherId }) => {
  console.log('=== fetchTeacherDetail 开始执行 ===');
  console.log('teacherId:', teacherId, '类型:', typeof teacherId);
  
  // 确保teacherId是数字类型
  const normalizedTeacherId = Number(teacherId);
  
  if (!normalizedTeacherId || isNaN(normalizedTeacherId)) {
    console.error('teacherId 无效，退出');
    return Promise.reject(new Error('老师ID不能为空或无效'));
  }
  
  // 构建请求参数
  const params = {
    teacherId: normalizedTeacherId
  };
  
  console.log('构建的请求参数:', params);
  
  return new Promise((resolve, reject) => {
    console.log('准备调用 getTeacherDetail API...');
    
    getTeacherDetail(params)
      .then(response => {
        console.log('=== API 响应完整数据 ===');
        console.log('response:', JSON.stringify(response, null, 2));
        
        // 检查返回的数据结构 - 格式：{success: true, data: {msg, code, data: {service: [...]}}}
        if (response && response.success && response.data && response.data.code === 200) {
          console.log('response.success 为 true，response.data.code 为 200，请求成功');
          
          if (response.data.data) {
            console.log('response.data.data 存在');
            console.log('response.data.data:', JSON.stringify(response.data.data, null, 2));
            
            const teacherDetail = response.data.data;
            
            console.log('准备调用 SET_TEACHER_DETAIL mutation...');
            console.log('teacherId:', normalizedTeacherId);
            console.log('detail:', JSON.stringify(teacherDetail, null, 2));
            console.log('服务数量:', teacherDetail.service?.length || 0);
            
            // 更新老师详情到store
            commit('SET_TEACHER_DETAIL', {
              teacherId: normalizedTeacherId,
              detail: teacherDetail
            });
            
            console.log('SET_TEACHER_DETAIL mutation 调用完成');
          } else {
            console.error('response.data.data 不存在');
            reject(new Error('响应数据中缺少data.data字段'));
            return;
          }
        } else {
          console.error('请求失败，success:', response?.success, 'code:', response?.data?.code, 'msg:', response?.data?.msg);
          reject(new Error(response?.data?.msg || '获取老师详情失败'));
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
  setSearchKey,
  fetchMatchTeacherList,
  fetchNonProfessionalOptions,
  fetchSortModeOptions,
  selectNonProfessional,
  selectSortMode,
  fetchTeacherDetail
};
