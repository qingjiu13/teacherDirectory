/**
 * User模块的actions
 * @module store/user/User/actions
 */

import { apiRequest } from '../JWT';
import { PAY_GENERATE_PAYMENT_URL } from '../../../api/index';

export default {
    /**
     * 获取用户所有订单信息
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.commit - 提交mutation的函数
     * @param {Object} [options={}] - 请求选项
     * @returns {Promise<Object>} 包含订单数据的Promise
     */
    async fetchUserOrders({ commit }, options = {}) {
        try {
            const response = await apiRequest('/api/user/orders', 'GET', options);
            
            // 提交mutation更新状态
            commit('fetchAllOrders', response.data);
            
            return response.data;
        } catch (error) {
            console.error('获取用户订单失败:', error);
            throw error;
        }
    },
    
    /**
     * 获取订单详情
     * @param {Object} context - Vuex上下文对象 
     * @param {String} orderId - 订单ID
     * @returns {Promise<Object>} 包含订单详情的Promise
     */
    async getOrderDetail(_, orderId) {
        try {
            const response = await apiRequest(`/api/user/orders/${orderId}`, 'GET');
            return response.data;
        } catch (error) {
            console.error('获取订单详情失败:', error);
            throw error;
        }
    },
    
    /**
     * 取消订单
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.dispatch - 派发action的函数
     * @param {String} orderId - 订单ID
     * @returns {Promise<Object>} 操作结果Promise
     */
    async cancelOrder({ dispatch }, orderId) {
        try {
            const response = await apiRequest(`/api/user/orders/${orderId}/cancel`, 'POST');
            
            // 取消成功后重新获取订单列表
            await dispatch('fetchUserOrders');
            
            return response.data;
        } catch (error) {
            console.error('取消订单失败:', error);
            throw error;
        }
    },
    
    /**
     * 创建新订单
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.dispatch - 派发action的函数
     * @param {Object} orderData - 订单数据
     * @returns {Promise<Object>} 创建结果Promise，包含订单ID
     */
    async createOrder({ dispatch }, orderData) {
        try {
            // 创建订单
            const response = await apiRequest('/api/user/orders', 'POST', orderData);
            
            // 创建成功后生成支付链接
            if (response.success && response.data.orderId) {
                // 尝试生成支付链接
                await dispatch('generatePaymentUrl', {
                    orderId: response.data.orderId,
                    paymentMethod: orderData.paymentMethod || 'wechat'
                });
            }
            
            // 重新获取订单列表
            await dispatch('fetchUserOrders');
            
            return response.data;
        } catch (error) {
            console.error('创建订单失败:', error);
            throw error;
        }
    },
    
    /**
     * 生成支付URL
     * @param {Object} context - Vuex上下文对象
     * @param {Object} paymentData - 支付数据
     * @param {String} paymentData.orderId - 订单ID
     * @param {String} paymentData.paymentMethod - 支付方式
     * @returns {Promise<Object>} 包含支付URL的Promise
     */
    async generatePaymentUrl(_, paymentData) {
        try {
            const response = await apiRequest(PAY_GENERATE_PAYMENT_URL, 'POST', paymentData);
            return response.data;
        } catch (error) {
            console.error('生成支付链接失败:', error);
            throw error;
        }
    },
    
    /**
     * 支付订单
     * @param {Object} context - Vuex上下文对象
     * @param {Function} context.dispatch - 派发action的函数
     * @param {Object} paymentData - 支付数据
     * @param {String} paymentData.orderId - 订单ID
     * @param {String} paymentData.paymentMethod - 支付方式
     * @returns {Promise<Object>} 支付结果Promise
     */
    async payOrder({ dispatch }, paymentData) {
        try {
            // 先生成支付URL
            const paymentUrlData = await dispatch('generatePaymentUrl', paymentData);
            
            // 然后处理支付请求
            const response = await apiRequest('/api/user/orders/pay', 'POST', {
                ...paymentData,
                paymentUrl: paymentUrlData.paymentUrl
            });
            
            // 支付成功后重新获取订单列表
            await dispatch('fetchUserOrders');
            
            return {
                ...response.data,
                paymentUrl: paymentUrlData.paymentUrl
            };
        } catch (error) {
            console.error('支付订单失败:', error);
            throw error;
        }
    }
}; 