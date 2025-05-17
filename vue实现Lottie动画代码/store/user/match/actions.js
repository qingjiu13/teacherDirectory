/**
 * match模块的actions
 * @module store/user/match/actions
 */

import { getMatchTeacherList, getTeacherDetail } from '../APIroute/match_api/match_api.js';

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
  
  // 构建请求参数
  const params = {
    userId: userId,
    schoolList: payload.schoolList || state.schoolList,
    professionalList: payload.professionalList || state.professionalList,
    nonProfessionalList: payload.nonProfessionalList || state.nonProfessionalList,
    sortMode: payload.sortMode || state.sortMode,
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
  fetchTeacherDetail
};
