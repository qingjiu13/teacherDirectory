"use strict";
var _a, _b, _c;
const common_vendor = require("../../../common/vendor.js");
const state = {
  // 应用加载状态
  isLoading: false,
  // 全局错误信息
  error: null,
  // 应用版本
  appVersion: "1.0.0",
  // 应用配置
  appConfig: {
    theme: ((_a = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _a.theme) || "light",
    fontSize: ((_b = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _b.fontSize) || "medium",
    language: ((_c = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _c.language) || "zh-CN"
  },
  // 全局通知
  notifications: [],
  // 系统信息
  systemInfo: null
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/state.js.map
