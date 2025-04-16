"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/common`;
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
const getNotifications = (params = {}) => {
  return request({
    url: `${API_PREFIX}/notifications`,
    data: params
  });
};
const markNotificationAsRead = (notificationId) => {
  return request({
    url: `${API_PREFIX}/notifications/${notificationId}/read`,
    method: "PUT"
  });
};
const getMessages = (params = {}) => {
  return request({
    url: `${API_PREFIX}/messages`,
    data: params
  });
};
const sendMessage = (messageData) => {
  return request({
    url: `${API_PREFIX}/messages`,
    method: "POST",
    data: messageData
  });
};
const getUserSettings = () => {
  return request({
    url: `${API_PREFIX}/settings`
  });
};
const updateUserSettings = (settings) => {
  return request({
    url: `${API_PREFIX}/settings`,
    method: "PUT",
    data: settings
  });
};
const common = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getMessages,
  getNotifications,
  getUserSettings,
  markNotificationAsRead,
  sendMessage,
  updateUserSettings
}, Symbol.toStringTag, { value: "Module" }));
exports.common = common;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/common.api.js.map
