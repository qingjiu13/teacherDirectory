/**
 * match模块的actions
 * @module store/user/match/actions
 */

import { getMatchTeachers } from '@/api/MATCH_API.js';

export default {
    /**
     * 根据筛选条件获取匹配的老师列表
     * @param {Object} context - Vuex context对象
     * @param {Object} filters - 筛选条件
     * @param {String} filters.school - 学校筛选
     * @param {String} filters.major - 专业筛选
     * @param {String} filters.sort - 排序方式
     * @returns {Promise} - 返回获取结果的Promise
     */
    getFilteredMatchList({ commit }, filters = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                // 调用API获取数据
                const result = await getMatchTeachers(filters);
                
                // 将数据更新到state
                commit('SET_MATCH_LIST', result.matchList || []);
                
                resolve({
                    success: true,
                    data: result.matchList || []
                });
            } catch (error) {
                // 直接将后端的错误返回
                reject({
                    success: false,
                    message: error.message || '获取老师列表失败',
                    error
                });
            }
        });
    },
    
    /**
     * 获取特定老师的详细信息
     * @param {Object} context - Vuex context对象
     * @param {String} teacherId - 老师ID
     * @returns {Promise} - 返回获取结果的Promise
     */
    getTeacherById({ state }, teacherId) {
        return new Promise((resolve, reject) => {
            try {
                // 从state中查找对应ID的老师
                const teacher = state.matchList.find(item => item.id === teacherId);
                
                if (teacher) {
                    resolve({
                        success: true,
                        data: teacher
                    });
                } else {
                    reject({
                        success: false,
                        message: '未找到该老师信息'
                    });
                }
            } catch (error) {
                reject({
                    success: false,
                    message: error.message || '获取老师详情失败',
                    error
                });
            }
        });
    }
}; 