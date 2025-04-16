/**
 * User模块的mutations
 * @module store/user/User/mutations
 */

export default {
    /**
     * 拉取用户所有订单信息并替换现有数据
     * @param {Object} state - Vuex状态对象
     * @param {Object} orderData - 包含所有订单类型的数据对象
     * @param {Array} orderData.unpaid - 未支付订单列表
     * @param {Array} orderData.service - 服务中订单列表
     * @param {Array} orderData.finished - 已完成订单列表
     * @param {Array} orderData.cancel - 已取消订单列表
     */
    fetchAllOrders(state, orderData) {
        if (orderData.unpaid) {
            state.unpaid = orderData.unpaid;
        }
        
        if (orderData.service) {
            state.service = orderData.service;
        }
        
        if (orderData.finished) {
            state.finished = orderData.finished;
        }
        
        if (orderData.cancel) {
            state.cancel = orderData.cancel;
        }
    }
}; 