"use strict";
const api = {
  /**
   * @description 获取学生订单列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.status - 订单状态
   * @returns {Promise<Object>} 订单列表
   */
  getStudentOrders(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { status } = params;
        let orders = [];
        switch (status) {
          case "pendingPayment":
            orders = [
              { id: "s1", title: "待付款订单1", price: 199, teacherName: "王老师", serviceName: "学术指导", createTime: Date.now() - 864e5 },
              { id: "s2", title: "待付款订单2", price: 299, teacherName: "李老师", serviceName: "论文修改", createTime: Date.now() - 1728e5 }
            ];
            break;
          case "pendingService":
            orders = [
              { id: "s3", title: "待服务订单1", price: 299, teacherName: "李老师", serviceName: "论文修改", createTime: Date.now() - 1728e5 },
              { id: "s4", title: "待服务订单2", price: 399, teacherName: "张老师", serviceName: "职业规划", createTime: Date.now() - 2592e5 }
            ];
            break;
          case "completed":
            orders = [
              { id: "s5", title: "已完成订单1", price: 399, teacherName: "张老师", serviceName: "职业规划", createTime: Date.now() - 2592e5, completeTime: Date.now() - 864e5 },
              { id: "s6", title: "已完成订单2", price: 499, teacherName: "赵老师", serviceName: "简历指导", createTime: Date.now() - 3456e5, completeTime: Date.now() - 1728e5 }
            ];
            break;
          case "cancelled":
            orders = [
              { id: "s7", title: "已取消订单1", price: 499, teacherName: "赵老师", serviceName: "简历指导", createTime: Date.now() - 3456e5, cancelTime: Date.now() - 1728e5 },
              { id: "s8", title: "已取消订单2", price: 599, teacherName: "钱老师", serviceName: "留学规划", createTime: Date.now() - 432e6, cancelTime: Date.now() - 2592e5 }
            ];
            break;
          default:
            orders = [];
        }
        resolve({
          success: true,
          data: orders
        });
      }, 500);
    });
  },
  /**
   * @description 获取教师订单列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.status - 订单状态
   * @returns {Promise<Object>} 订单列表
   */
  getTeacherOrders(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { status } = params;
        let orders = [];
        switch (status) {
          case "pendingService":
            orders = [
              { id: "t1", title: "待服务订单1", price: 199, studentName: "小明", serviceName: "学术指导", createTime: Date.now() - 864e5 },
              { id: "t2", title: "待服务订单2", price: 299, studentName: "小红", serviceName: "论文修改", createTime: Date.now() - 1728e5 }
            ];
            break;
          case "completed":
            orders = [
              { id: "t3", title: "已完成订单1", price: 299, studentName: "小红", serviceName: "论文修改", createTime: Date.now() - 1728e5, completeTime: Date.now() - 864e5 },
              { id: "t4", title: "已完成订单2", price: 399, studentName: "小张", serviceName: "职业规划", createTime: Date.now() - 2592e5, completeTime: Date.now() - 1728e5 }
            ];
            break;
          case "cancelled":
            orders = [
              { id: "t5", title: "已取消订单1", price: 399, studentName: "小张", serviceName: "职业规划", createTime: Date.now() - 2592e5, cancelTime: Date.now() - 1728e5 },
              { id: "t6", title: "已取消订单2", price: 499, studentName: "小李", serviceName: "简历指导", createTime: Date.now() - 3456e5, cancelTime: Date.now() - 2592e5 }
            ];
            break;
          default:
            orders = [];
        }
        resolve({
          success: true,
          data: orders
        });
      }, 500);
    });
  },
  /**
   * @description 获取订单详情
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.orderId - 订单ID
   * @returns {Promise<Object>} 订单详情
   */
  getOrderDetail(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { orderId } = params;
        const orderDetail = {
          id: orderId,
          title: `订单${orderId}`,
          price: 299,
          teacherName: "李老师",
          studentName: "小明",
          serviceName: "论文修改",
          createTime: Date.now() - 1728e5,
          payTime: Date.now() - 864e5,
          status: "pendingService",
          description: "提供论文修改和指导服务",
          comments: "请帮忙审核一下论文格式",
          serviceTime: [
            { date: "2023-06-15", time: "14:00-16:00" },
            { date: "2023-06-18", time: "10:00-12:00" }
          ]
        };
        resolve({
          success: true,
          data: orderDetail
        });
      }, 300);
    });
  },
  /**
   * @description 创建订单
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {Object} params.orderData - 订单数据
   * @returns {Promise<Object>} 创建结果
   */
  createOrder(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { orderData } = params;
        resolve({
          success: true,
          data: {
            id: `new_${Date.now()}`,
            ...orderData,
            createTime: Date.now(),
            status: "pendingPayment"
          }
        });
      }, 600);
    });
  },
  /**
   * @description 支付订单
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.orderId - 订单ID
   * @returns {Promise<Object>} 支付结果
   */
  payOrder(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.orderId,
            payTime: Date.now(),
            status: "pendingService"
          }
        });
      }, 800);
    });
  },
  /**
   * @description 取消订单
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.orderId - 订单ID
   * @param {string} params.reason - 取消原因
   * @returns {Promise<Object>} 取消结果
   */
  cancelOrder(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.orderId,
            cancelTime: Date.now(),
            status: "cancelled",
            cancelReason: params.reason || "用户取消"
          }
        });
      }, 500);
    });
  },
  /**
   * @description 确认完成订单
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.orderId - 订单ID
   * @returns {Promise<Object>} 确认结果
   */
  completeOrder(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.orderId,
            completeTime: Date.now(),
            status: "completed"
          }
        });
      }, 500);
    });
  },
  /**
   * @description 评价订单
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.orderId - 订单ID
   * @param {Object} params.reviewData - 评价数据
   * @returns {Promise<Object>} 评价结果
   */
  reviewOrder(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.orderId,
            reviewTime: Date.now(),
            rating: params.reviewData.rating,
            comment: params.reviewData.comment
          }
        });
      }, 500);
    });
  }
};
const state = {
  studentOrders: {
    pendingPayment: [],
    pendingService: [],
    completed: [],
    cancelled: []
  },
  teacherOrders: {
    pendingService: [],
    completed: [],
    cancelled: []
  },
  currentOrder: null,
  loading: false,
  error: null
};
const mutations = {
  /**
   * @description 设置学生订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {Array} payload.orders - 订单列表
   */
  SET_STUDENT_ORDERS(state2, { status, orders }) {
    state2.studentOrders[status] = orders;
  },
  /**
   * @description 设置教师订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {Array} payload.orders - 订单列表
   */
  SET_TEACHER_ORDERS(state2, { status, orders }) {
    state2.teacherOrders[status] = orders;
  },
  /**
   * @description 设置当前订单
   * @param {Object} state - Vuex状态
   * @param {Object} order - 订单详情
   */
  SET_CURRENT_ORDER(state2, order2) {
    state2.currentOrder = order2;
  },
  /**
   * @description 设置加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} loading - 是否加载中
   */
  SET_LOADING(state2, loading) {
    state2.loading = loading;
  },
  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {string|Object|null} error - 错误信息
   */
  SET_ERROR(state2, error) {
    state2.error = error;
  },
  /**
   * @description 添加学生订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {Object} payload.order - 订单数据
   */
  ADD_STUDENT_ORDER(state2, { status, order: order2 }) {
    state2.studentOrders[status].unshift(order2);
  },
  /**
   * @description 添加教师订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {Object} payload.order - 订单数据
   */
  ADD_TEACHER_ORDER(state2, { status, order: order2 }) {
    state2.teacherOrders[status].unshift(order2);
  },
  /**
   * @description 更新学生订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {string} payload.orderId - 订单ID
   * @param {Object} payload.order - 更新的订单数据
   */
  UPDATE_STUDENT_ORDER(state2, { status, orderId, order: order2 }) {
    const index = state2.studentOrders[status].findIndex((o) => o.id === orderId);
    if (index !== -1) {
      state2.studentOrders[status].splice(index, 1, { ...state2.studentOrders[status][index], ...order2 });
    }
  },
  /**
   * @description 更新教师订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {string} payload.orderId - 订单ID
   * @param {Object} payload.order - 更新的订单数据
   */
  UPDATE_TEACHER_ORDER(state2, { status, orderId, order: order2 }) {
    const index = state2.teacherOrders[status].findIndex((o) => o.id === orderId);
    if (index !== -1) {
      state2.teacherOrders[status].splice(index, 1, { ...state2.teacherOrders[status][index], ...order2 });
    }
  },
  /**
   * @description 移除学生订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {string} payload.orderId - 订单ID
   */
  REMOVE_STUDENT_ORDER(state2, { status, orderId }) {
    state2.studentOrders[status] = state2.studentOrders[status].filter((o) => o.id !== orderId);
  },
  /**
   * @description 移除教师订单
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.status - 订单状态
   * @param {string} payload.orderId - 订单ID
   */
  REMOVE_TEACHER_ORDER(state2, { status, orderId }) {
    state2.teacherOrders[status] = state2.teacherOrders[status].filter((o) => o.id !== orderId);
  }
};
const actions = {
  /**
   * @description 获取学生订单列表
   * @param {Object} context - Vuex上下文
   * @param {string} status - 订单状态
   * @returns {Promise<Object>} 获取结果
   */
  async getStudentOrders({ commit, rootState }, status) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getStudentOrders({ token, status });
      if (response.success) {
        commit("SET_STUDENT_ORDERS", { status, orders: response.data });
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "获取学生订单失败");
      return { success: false, message: "获取学生订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "获取学生订单失败");
      return { success: false, message: error.message || "获取学生订单失败" };
    }
  },
  /**
   * @description 获取教师订单列表
   * @param {Object} context - Vuex上下文
   * @param {string} status - 订单状态
   * @returns {Promise<Object>} 获取结果
   */
  async getTeacherOrders({ commit, rootState }, status) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getTeacherOrders({ token, status });
      if (response.success) {
        commit("SET_TEACHER_ORDERS", { status, orders: response.data });
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "获取教师订单失败");
      return { success: false, message: "获取教师订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "获取教师订单失败");
      return { success: false, message: error.message || "获取教师订单失败" };
    }
  },
  /**
   * @description 获取订单详情
   * @param {Object} context - Vuex上下文
   * @param {string} orderId - 订单ID
   * @returns {Promise<Object>} 获取结果
   */
  async getOrderDetail({ commit, rootState }, orderId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.getOrderDetail({ token, orderId });
      if (response.success) {
        commit("SET_CURRENT_ORDER", response.data);
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "获取订单详情失败");
      return { success: false, message: "获取订单详情失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "获取订单详情失败");
      return { success: false, message: error.message || "获取订单详情失败" };
    }
  },
  /**
   * @description 创建订单
   * @param {Object} context - Vuex上下文
   * @param {Object} orderData - 订单数据
   * @returns {Promise<Object>} 创建结果
   */
  async createOrder({ commit, rootState }, orderData) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.createOrder({ token, orderData });
      if (response.success) {
        commit("ADD_STUDENT_ORDER", { status: "pendingPayment", order: response.data });
        commit("SET_CURRENT_ORDER", response.data);
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "创建订单失败");
      return { success: false, message: "创建订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "创建订单失败");
      return { success: false, message: error.message || "创建订单失败" };
    }
  },
  /**
   * @description 支付订单
   * @param {Object} context - Vuex上下文
   * @param {string} orderId - 订单ID
   * @returns {Promise<Object>} 支付结果
   */
  async payOrder({ commit, rootState }, orderId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.payOrder({ token, orderId });
      if (response.success) {
        commit("REMOVE_STUDENT_ORDER", { status: "pendingPayment", orderId });
        commit("ADD_STUDENT_ORDER", { status: "pendingService", order: response.data });
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "支付订单失败");
      return { success: false, message: "支付订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "支付订单失败");
      return { success: false, message: error.message || "支付订单失败" };
    }
  },
  /**
   * @description 取消订单
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.orderId - 订单ID
   * @param {string} params.status - 订单当前状态
   * @param {string} params.reason - 取消原因
   * @param {string} params.role - 用户角色
   * @returns {Promise<Object>} 取消结果
   */
  async cancelOrder({ commit, rootState }, { orderId, status, reason, role }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.cancelOrder({ token, orderId, reason });
      if (response.success) {
        if (role === "student") {
          commit("REMOVE_STUDENT_ORDER", { status, orderId });
          commit("ADD_STUDENT_ORDER", { status: "cancelled", order: response.data });
        } else if (role === "teacher") {
          commit("REMOVE_TEACHER_ORDER", { status, orderId });
          commit("ADD_TEACHER_ORDER", { status: "cancelled", order: response.data });
        }
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "取消订单失败");
      return { success: false, message: "取消订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "取消订单失败");
      return { success: false, message: error.message || "取消订单失败" };
    }
  },
  /**
   * @description 完成订单
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.orderId - 订单ID
   * @param {string} params.role - 用户角色
   * @returns {Promise<Object>} 完成结果
   */
  async completeOrder({ commit, rootState }, { orderId, role }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.completeOrder({ token, orderId });
      if (response.success) {
        if (role === "student") {
          commit("REMOVE_STUDENT_ORDER", { status: "pendingService", orderId });
          commit("ADD_STUDENT_ORDER", { status: "completed", order: response.data });
        } else if (role === "teacher") {
          commit("REMOVE_TEACHER_ORDER", { status: "pendingService", orderId });
          commit("ADD_TEACHER_ORDER", { status: "completed", order: response.data });
        }
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "完成订单失败");
      return { success: false, message: "完成订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "完成订单失败");
      return { success: false, message: error.message || "完成订单失败" };
    }
  },
  /**
   * @description 评价订单
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.orderId - 订单ID
   * @param {Object} params.reviewData - 评价数据
   * @returns {Promise<Object>} 评价结果
   */
  async reviewOrder({ commit, rootState }, { orderId, reviewData }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const token = rootState.auth.token;
      const response = await api.reviewOrder({ token, orderId, reviewData });
      if (response.success) {
        commit("UPDATE_STUDENT_ORDER", {
          status: "completed",
          orderId,
          order: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            reviewTime: response.data.reviewTime
          }
        });
        commit("SET_LOADING", false);
        return { success: true, data: response.data };
      }
      commit("SET_LOADING", false);
      commit("SET_ERROR", "评价订单失败");
      return { success: false, message: "评价订单失败" };
    } catch (error) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", error.message || "评价订单失败");
      return { success: false, message: error.message || "评价订单失败" };
    }
  }
};
const getters = {
  /**
   * @description 获取学生待付款订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待付款订单列表
   */
  studentPendingPaymentOrders: (state2) => state2.studentOrders.pendingPayment,
  /**
   * @description 获取学生待服务订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待服务订单列表
   */
  studentPendingServiceOrders: (state2) => state2.studentOrders.pendingService,
  /**
   * @description 获取学生已完成订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已完成订单列表
   */
  studentCompletedOrders: (state2) => state2.studentOrders.completed,
  /**
   * @description 获取学生已取消订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已取消订单列表
   */
  studentCancelledOrders: (state2) => state2.studentOrders.cancelled,
  /**
   * @description 获取教师待服务订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 待服务订单列表
   */
  teacherPendingServiceOrders: (state2) => state2.teacherOrders.pendingService,
  /**
   * @description 获取教师已完成订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已完成订单列表
   */
  teacherCompletedOrders: (state2) => state2.teacherOrders.completed,
  /**
   * @description 获取教师已取消订单
   * @param {Object} state - Vuex状态
   * @returns {Array} 已取消订单列表
   */
  teacherCancelledOrders: (state2) => state2.teacherOrders.cancelled,
  /**
   * @description 获取当前订单
   * @param {Object} state - Vuex状态
   * @returns {Object|null} 当前订单
   */
  currentOrder: (state2) => state2.currentOrder,
  /**
   * @description 获取是否加载中
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否加载中
   */
  isLoading: (state2) => state2.loading,
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {string|Object|null} 错误信息
   */
  error: (state2) => state2.error,
  /**
   * @description 获取学生订单总数
   * @param {Object} state - Vuex状态
   * @returns {number} 学生订单总数
   */
  studentOrdersCount: (state2) => {
    return state2.studentOrders.pendingPayment.length + state2.studentOrders.pendingService.length + state2.studentOrders.completed.length + state2.studentOrders.cancelled.length;
  },
  /**
   * @description 获取教师订单总数
   * @param {Object} state - Vuex状态
   * @returns {number} 教师订单总数
   */
  teacherOrdersCount: (state2) => {
    return state2.teacherOrders.pendingService.length + state2.teacherOrders.completed.length + state2.teacherOrders.cancelled.length;
  }
};
const order = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
exports.order = order;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/order.js.map
