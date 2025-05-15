/**
 * courses模块的actions
 * @module store/user/courses/actions
 */

import { apiRequest } from '../JWT';

export default {
    /**
     * 获取学生待预约课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchPendingCourses({ commit }) {
        try {
            const response = await apiRequest('/api/courses/pending', 'GET');
            
            if (response.success) {
                commit('SET_PENDING_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取待预约课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取学生已预约课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchReservedCourses({ commit }) {
        try {
            const response = await apiRequest('/api/courses/reserved', 'GET');
            
            if (response.success) {
                commit('SET_RESERVED_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取已预约课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取学生已完成课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchCompletedCourses({ commit }) {
        try {
            const response = await apiRequest('/api/courses/completed', 'GET');
            
            if (response.success) {
                commit('SET_COMPLETED_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取已完成课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取老师待接受课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchTeacherPendingCourses({ commit }) {
        try {
            const response = await apiRequest('/api/teacher/courses/pending', 'GET');
            
            if (response.success) {
                commit('SET_TEACHER_PENDING_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取老师待接受课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取老师进行中课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchTeacherActiveCourses({ commit }) {
        try {
            const response = await apiRequest('/api/teacher/courses/active', 'GET');
            
            if (response.success) {
                commit('SET_TEACHER_ACTIVE_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取老师进行中课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取老师已完成课程列表
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @returns {Promise<Array>} 课程列表Promise
     */
    async fetchTeacherCompletedCourses({ commit }) {
        try {
            const response = await apiRequest('/api/teacher/courses/completed', 'GET');
            
            if (response.success) {
                commit('SET_TEACHER_COMPLETED_COURSES', response.data || []);
            }
            
            return response.data || [];
        } catch (error) {
            console.error('获取老师已完成课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取所有课程数据（根据用户角色）
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.dispatch - 派发action的函数
     * @param {String} role - 用户角色（student或teacher）
     * @returns {Promise<Object>} 所有课程数据Promise
     */
    async fetchAllCoursesByRole({ dispatch }, role) {
        try {
            if (role === 'student') {
                // 获取学生所有课程数据
                await Promise.all([
                    dispatch('fetchPendingCourses'),
                    dispatch('fetchReservedCourses'),
                    dispatch('fetchCompletedCourses')
                ]);
            } else if (role === 'teacher') {
                // 获取老师所有课程数据
                await Promise.all([
                    dispatch('fetchTeacherPendingCourses'),
                    dispatch('fetchTeacherActiveCourses'),
                    dispatch('fetchTeacherCompletedCourses')
                ]);
            }
            
            return { success: true };
        } catch (error) {
            console.error('获取课程数据失败:', error);
            return { success: false, error };
        }
    },
    
    /**
     * 学生预约课程
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {Object} reservation - 预约信息
     * @returns {Promise<Object>} 预约结果Promise
     */
    async reserveCourse({ commit }, reservation) {
        try {
            const response = await apiRequest('/api/courses/reserve', 'POST', reservation);
            
            if (response.success) {
                // 更新本地状态
                commit('ADD_COURSE_RESERVATION', reservation);
            }
            
            return response;
        } catch (error) {
            console.error('预约课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 老师预约课程
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {Object} reservation - 预约信息
     * @returns {Promise<Object>} 预约结果Promise
     */
    async teacherReserveCourse({ commit }, reservation) {
        try {
            const response = await apiRequest('/api/teacher/courses/reserve', 'POST', reservation);
            
            if (response.success) {
                // 更新本地状态
                commit('ADD_TEACHER_COURSE_RESERVATION', reservation);
            }
            
            return response;
        } catch (error) {
            console.error('老师预约课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 老师完成课程
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {Object} completion - 完成信息
     * @returns {Promise<Object>} 完成结果Promise
     */
    async completeCourse({ commit }, completion) {
        try {
            const response = await apiRequest(`/api/teacher/courses/${completion.courseId}/complete`, 'POST', completion);
            
            if (response.success) {
                // 更新本地状态
                commit('COMPLETE_COURSE', {
                    ...completion,
                    completedTime: new Date().toISOString().split('T')[0]
                });
            }
            
            return response;
        } catch (error) {
            console.error('完成课程失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取课程详情
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {String} courseId - 课程ID
     * @returns {Promise<Object>} 课程详情Promise
     */
    async fetchCourseDetail({ commit, state }, courseId) {
        // 如果已经有缓存数据，直接返回
        if (state.courseDetails[courseId]) {
            return { success: true, data: state.courseDetails[courseId] };
        }
        
        try {
            const response = await apiRequest(`/api/courses/${courseId}`, 'GET');
            
            if (response.success) {
                // 缓存课程详情
                commit('SET_COURSE_DETAIL', response.data);
            }
            
            return response;
        } catch (error) {
            console.error('获取课程详情失败:', error);
            throw error;
        }
    },
    
    /**
     * 设置选择的日期
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {String} date - 日期字符串
     */
    setSelectedDate({ commit }, date) {
        commit('SET_SELECTED_DATE', date);
    },
    
    /**
     * 设置选择的时间
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {Object} timeInfo - 时间信息对象
     */
    setSelectedTime({ commit }, timeInfo) {
        commit('SET_SELECTED_TIME', timeInfo);
    },
    
    /**
     * 重置时间选择
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     */
    resetTimeSelection({ commit }) {
        commit('RESET_TIME_SELECTION');
    }
}; 