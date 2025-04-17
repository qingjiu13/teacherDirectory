"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/orders`;
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url,
      data: options.data,
      method: options.method || "GET",
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const createOrder = (orderData) => {
  return request({
    url: `${API_PREFIX}`,
    method: "POST",
    data: orderData
  });
};
const getOrders = (params = {}) => {
  return request({
    url: `${API_PREFIX}`,
    data: params
  });
};
const getOrderDetails = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}`
  });
};
const cancelOrder = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}/cancel`,
    method: "POST"
  });
};
const payOrder = (orderId, paymentData) => {
  return request({
    url: `${API_PREFIX}/${orderId}/pay`,
    method: "POST",
    data: paymentData
  });
};
const getPaymentStatus = (orderId) => {
  return request({
    url: `${API_PREFIX}/${orderId}/payment-status`
  });
};
const order = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelOrder,
  createOrder,
  getOrderDetails,
  getOrders,
  getPaymentStatus,
  payOrder
}, Symbol.toStringTag, { value: "Module" }));
exports.order = order;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/order.api.js.map
