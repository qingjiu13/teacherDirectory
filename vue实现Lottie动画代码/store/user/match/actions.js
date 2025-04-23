/**
 * match模块的actions
 * @module store/user/match/actions
 */

import { getMatchTeachers, getTeacherDetail } from './api';

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
                
                // 确保每个老师对象都有service数组
                const processedData = (result.matchList || []).map(teacher => {
                    // 确保service属性存在且为数组
                    if (!teacher.service) {
                        teacher.service = [];
                    }
                    return teacher;
                });
                
                resolve({
                    success: true,
                    data: processedData
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
    },

    /**
     * 获取教师详细介绍信息（包含自我介绍和服务列表）
     * @param {Object} context - Vuex context对象
     * @param {String} teacherId - 教师ID
     * @returns {Promise} - 返回获取结果的Promise
     */
    getTeacherDetailInfo({ commit }, teacherId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!teacherId) {
                    throw new Error('教师ID不能为空');
                }
                
                // 调用API获取教师详情
                const detailData = await getTeacherDetail(teacherId);
                
                // 更新state中的教师详情信息
                commit('UPDATE_TEACHER_DETAIL', {
                    id: teacherId,
                    detailInfo: detailData
                });
                
                resolve({
                    success: true,
                    data: detailData
                });
            } catch (error) {
                reject({
                    success: false,
                    message: error.message || '获取教师详情失败',
                    error
                });
            }
        });
    }
}; 