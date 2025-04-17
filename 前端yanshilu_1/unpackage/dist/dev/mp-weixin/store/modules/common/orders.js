"use strict";
const common_vendor = require("../../../common/vendor.js");
const state = {
  orderList: [],
  // 订单列表
  currentOrder: null,
  // 当前查看的订单
  loading: false,
  // 加载状态
  error: null,
  // 错误信息
  pagination: {
    // 分页信息
    total: 0,
    current: 1,
    pageSize: 10
  }
};
const getters = {
  /**
   * @description 获取所有订单
   * @param {Object} state - 状态对象
   * @returns {Array} 订单列表
   */
  allOrders: (state2) => state2.orderList,
  /**
   * @description 获取当前订单
   * @param {Object} state - 状态对象
   * @returns {Object} 当前订单
   */
  currentOrder: (state2) => state2.currentOrder,
  /**
   * @description 获取订单总数
   * @param {Object} state - 状态对象
   * @returns {number} 订单总数
   */
  totalOrders: (state2) => state2.pagination.total,
  /**
   * @description 按状态筛选订单
   * @param {Object} state - 状态对象
   * @returns {Function} 筛选函数
   */
  ordersByStatus: (state2) => (status) => {
    return state2.orderList.filter((order) => order.status === status);
  }
};
const mutations = {
  /**
   * @description 设置订单列表
   * @param {Object} state - 状态对象
   * @param {Array} orders - 订单列表
   */
  SET_ORDER_LIST(state2, orders2) {
    state2.orderList = orders2;
  },
  /**
   * @description 设置当前订单
   * @param {Object} state - 状态对象
   * @param {Object} order - 订单对象
   */
  SET_CURRENT_ORDER(state2, order) {
    state2.currentOrder = order;
  },
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {boolean} loading - 加载状态
   */
  SET_LOADING(state2, loading) {
    state2.loading = loading;
  },
  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {Object} error - 错误信息
   */
  SET_ERROR(state2, error) {
    state2.error = error;
  },
  /**
   * @description 设置分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   */
  SET_PAGINATION(state2, pagination) {
    state2.pagination = { ...state2.pagination, ...pagination };
  },
  /**
   * @description 更新订单状态
   * @param {Object} state - 状态对象
   * @param {Object} param - 参数
   * @param {string|number} param.orderId - 订单ID
   * @param {string} param.status - 订单状态
   */
  UPDATE_ORDER_STATUS(state2, { orderId, status }) {
    const index = state2.orderList.findIndex((order) => order.id === orderId);
    if (index !== -1) {
      state2.orderList[index].status = status;
      if (state2.currentOrder && state2.currentOrder.id === orderId) {
        state2.currentOrder.status = status;
      }
    }
  }
};
const actions = {
  /**
   * @description 获取订单列表
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 查询参数
   * @returns {Promise<Array>} 订单列表
   */
  async fetchOrders({ commit }, params = {}) {
    commit("SET_LOADING", true);
    try {
      const orders2 = [];
      const pagination = { total: 0, current: 1, pageSize: 10 };
      commit("SET_ORDER_LIST", orders2);
      commit("SET_PAGINATION", pagination);
      commit("SET_ERROR", null);
      return orders2;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/orders.js:152", "获取订单列表失败:", error);
      commit("SET_ERROR", error);
      return [];
    } finally {
      commit("SET_LOADING", false);
    }
  },
  /**
   * @description 获取订单详情
   * @param {Object} context - Vuex上下文
   * @param {string|number} orderId - 订单ID
   * @returns {Promise<Object>} 订单详情
   */
  async fetchOrderDetail({ commit }, orderId) {
    commit("SET_LOADING", true);
    try {
      const order = null;
      commit("SET_CURRENT_ORDER", order);
      return order;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/orders.js:176", "获取订单详情失败:", error);
      commit("SET_ERROR", error);
      return null;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  /**
   * @description 创建新订单
   * @param {Object} context - Vuex上下文
   * @param {Object} orderData - 订单数据
   * @returns {Promise<Object>} 创建结果
   */
  async createOrder({ commit }, orderData) {
    commit("SET_LOADING", true);
    try {
      const newOrder = null;
      commit("SET_CURRENT_ORDER", newOrder);
      return { success: true, data: newOrder };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/orders.js:201", "创建订单失败:", error);
      commit("SET_ERROR", error);
      return { success: false, error };
    } finally {
      commit("SET_LOADING", false);
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
      commit("UPDATE_ORDER_STATUS", { orderId, status: "paid" });
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/orders.js:224", "支付订单失败:", error);
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
      commit("UPDATE_ORDER_STATUS", { orderId, status: "cancelled" });
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/modules/common/orders.js:244", "取消订单失败:", error);
      return { success: false, error };
    }
  }
};
const orders = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
exports.orders = orders;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/orders.js.map
