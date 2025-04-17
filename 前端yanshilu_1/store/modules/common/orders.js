/**
 * @description 订单管理模块
 * @module store/modules/common/orders
 */

/**
 * @description 初始状态
 * @type {Object}
 */
const state = {
  orderList: [],        // 订单列表
  currentOrder: null,   // 当前查看的订单
  loading: false,       // 加载状态
  error: null,          // 错误信息
  pagination: {         // 分页信息
    total: 0,
    current: 1,
    pageSize: 10
  }
};

/**
 * @description getters
 * @type {Object}
 */
const getters = {
  /**
   * @description 获取所有订单
   * @param {Object} state - 状态对象
   * @returns {Array} 订单列表
   */
  allOrders: (state) => state.orderList,
  
  /**
   * @description 获取当前订单
   * @param {Object} state - 状态对象
   * @returns {Object} 当前订单
   */
  currentOrder: (state) => state.currentOrder,
  
  /**
   * @description 获取订单总数
   * @param {Object} state - 状态对象
   * @returns {number} 订单总数
   */
  totalOrders: (state) => state.pagination.total,
  
  /**
   * @description 按状态筛选订单
   * @param {Object} state - 状态对象
   * @returns {Function} 筛选函数
   */
  ordersByStatus: (state) => (status) => {
    return state.orderList.filter(order => order.status === status);
  }
};

/**
 * @description mutations
 * @type {Object}
 */
const mutations = {
  /**
   * @description 设置订单列表
   * @param {Object} state - 状态对象
   * @param {Array} orders - 订单列表
   */
  SET_ORDER_LIST(state, orders) {
    state.orderList = orders;
  },
  
  /**
   * @description 设置当前订单
   * @param {Object} state - 状态对象
   * @param {Object} order - 订单对象
   */
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {boolean} loading - 加载状态
   */
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {Object} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 设置分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   */
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },
  
  /**
   * @description 更新订单状态
   * @param {Object} state - 状态对象
   * @param {Object} param - 参数
   * @param {string|number} param.orderId - 订单ID
   * @param {string} param.status - 订单状态
   */
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const index = state.orderList.findIndex(order => order.id === orderId);
    if (index !== -1) {
      state.orderList[index].status = status;
      
      // 如果是当前查看的订单，也更新当前订单
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
      }
    }
  }
};

/**
 * @description actions
 * @type {Object}
 */
const actions = {
  /**
   * @description 获取订单列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Array>} 订单列表
   */
  async fetchOrders({ commit }, params = {}) {
    commit('SET_LOADING', true);
    try {
      // 这里添加API调用，获取订单列表
      // const response = await api.getOrders(params);
      const orders = []; // 替换为实际API返回的数据
      const pagination = { total: 0, current: 1, pageSize: 10 }; // 替换为实际分页数据
      
      commit('SET_ORDER_LIST', orders);
      commit('SET_PAGINATION', pagination);
      commit('SET_ERROR', null);
      return orders;
    } catch (error) {
      console.error('获取订单列表失败:', error);
      commit('SET_ERROR', error);
      return [];
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * @description 获取订单详情
   * @param {Object} context - Vuex上下文
   * @param {string|number} orderId - 订单ID
   * @returns {Promise<Object>} 订单详情
   */
  async fetchOrderDetail({ commit }, orderId) {
    commit('SET_LOADING', true);
    try {
      // 这里添加API调用，获取订单详情
      // const response = await api.getOrderDetail(orderId);
      const order = null; // 替换为实际API返回的数据
      
      commit('SET_CURRENT_ORDER', order);
      return order;
    } catch (error) {
      console.error('获取订单详情失败:', error);
      commit('SET_ERROR', error);
      return null;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * @description 创建新订单
   * @param {Object} context - Vuex上下文
   * @param {Object} orderData - 订单数据
   * @returns {Promise<Object>} 创建结果
   */
  async createOrder({ commit }, orderData) {
    commit('SET_LOADING', true);
    try {
      // 这里添加API调用，创建订单
      // const response = await api.createOrder(orderData);
      const newOrder = null; // 替换为实际API返回的数据
      
      // 更新当前订单
      commit('SET_CURRENT_ORDER', newOrder);
      return { success: true, data: newOrder };
    } catch (error) {
      console.error('创建订单失败:', error);
      commit('SET_ERROR', error);
      return { success: false, error };
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * @description 支付订单
   * @param {Object} context - Vuex上下文
   * @param {string|number} orderId - 订单ID
   * @returns {Promise<Object>} 支付结果
   */
  async payOrder({ commit }, orderId) {
    try {
      // 这里添加API调用，支付订单
      // const response = await api.payOrder(orderId);
      
      // 更新订单状态
      commit('UPDATE_ORDER_STATUS', { orderId, status: 'paid' });
      return { success: true };
    } catch (error) {
      console.error('支付订单失败:', error);
      return { success: false, error };
    }
  },
  
  /**
   * @description 取消订单
   * @param {Object} context - Vuex上下文
   * @param {string|number} orderId - 订单ID
   * @returns {Promise<Object>} 取消结果
   */
  async cancelOrder({ commit }, orderId) {
    try {
      // 这里添加API调用，取消订单
      // const response = await api.cancelOrder(orderId);
      
      // 更新订单状态
      commit('UPDATE_ORDER_STATUS', { orderId, status: 'cancelled' });
      return { success: true };
    } catch (error) {
      console.error('取消订单失败:', error);
      return { success: false, error };
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 