/**
 * baseInfo模块的actions
 * @module store/user/baseInfo/actions
 */

import { getApiImplementation } from './config';

// 根据配置动态导入API实现（真实API或模拟API）
const api = getApiImplementation();
const { getUserInfo, updateUserInfo, updateRole } = api;

export default {
    /**
     * @description 获取用户信息
     * @param {Object} context - Vuex上下文对象
     * @returns {Promise} - 返回Promise对象
     */
    async getUserInfo({ commit }) {
        try {
            const response = await getUserInfo();
            
            if (response.success) {
                // 将返回的用户信息提交到mutations处理
                commit('SET_USER_INFO', response.data);
                return response.data;
            } else {
                return Promise.reject(response.error || { message: '获取用户信息失败' });
            }
        } catch (error) {
            console.error('获取用户信息失败', error);
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 更新用户信息
     * @param {Object} context - Vuex上下文对象
     * @param {Object} userInfo - 用户信息
     * @returns {Promise} - 返回Promise对象
     */
    async updateUserInfo({ commit }, userInfo) {
        try {
            const response = await updateUserInfo(userInfo);
            
            if (response.success) {
                // 将返回的用户信息提交到mutations处理
                commit('UPDATE_USER_INFO', response.data.userInfo || userInfo);
                return response.data;
            } else {
                return Promise.reject(response.error || { message: '更新用户信息失败' });
            }
        } catch (error) {
            console.error('更新用户信息失败', error);
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 更新用户角色
     * @param {Object} context - Vuex上下文对象
     * @param {string} role - 用户角色
     * @returns {Promise} - 返回Promise对象
     */
    async updateRole({ commit }, role) {
        try {
            // 调用API更新角色
            const response = await updateRole(role);
            
            if (response.success) {
                // 提交角色更新到mutations
                commit('updateRole', role);
                
                // 保存到本地存储
                uni.setStorageSync('userRole', role);
                
                return { success: true, role };
            } else {
                return Promise.reject(response.error || { message: '更新用户角色失败' });
            }
        } catch (error) {
            console.error('更新用户角色失败:', error);
            
            // 即使API调用失败，也尝试在本地更新
            try {
                commit('updateRole', role);
                uni.setStorageSync('userRole', role);
            } catch (e) {
                console.error('本地更新角色失败', e);
            }
            
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 用户登出
     * @param {Object} context - Vuex上下文对象
     * @returns {Promise} - 返回Promise对象
     */
    async logout({ commit }) {
        try {
            // 清除用户信息
            commit('CLEAR_USER_INFO');
            
            // 清除本地存储中的认证信息
            uni.removeStorageSync('userId');
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('user-token');
            uni.removeStorageSync('userBaseInfo');
            
            // 保留角色和模拟数据设置，以便体验一致性
            // 不清除：userRole, use_mock_api
            
            return { success: true, message: '退出登录成功' };
        } catch (error) {
            console.error('退出登录失败:', error);
            return Promise.reject({ message: '退出登录失败' });
        }
    }
}; 