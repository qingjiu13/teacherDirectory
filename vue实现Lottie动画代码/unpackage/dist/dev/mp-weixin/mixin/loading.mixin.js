"use strict";
const common_vendor = require("../common/vendor.js");
let timer = null;
const loadingMixin = {
  onLoad() {
    const app = getApp();
    if (!app || !app.globalData || !app.globalData.$loading) {
      common_vendor.index.__f__("warn", "at mixin/loading.mixin.js:13", "全局加载控制尚未初始化");
      return;
    }
    timer = setTimeout(() => {
      try {
        app.globalData.$loading.show();
      } catch (err) {
        common_vendor.index.__f__("error", "at mixin/loading.mixin.js:22", "显示加载动画失败:", err);
      }
    }, 300);
  },
  onReady() {
    clearTimeout(timer);
    timer = null;
    const app = getApp();
    if (!app || !app.globalData || !app.globalData.$loading) {
      common_vendor.index.__f__("warn", "at mixin/loading.mixin.js:32", "全局加载控制尚未初始化");
      return;
    }
    try {
      app.globalData.$loading.hide();
    } catch (err) {
      common_vendor.index.__f__("error", "at mixin/loading.mixin.js:39", "隐藏加载动画失败:", err);
    }
  },
  onUnload() {
    var _a, _b;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const app = getApp();
    if ((_b = (_a = app == null ? void 0 : app.globalData) == null ? void 0 : _a.$loading) == null ? void 0 : _b.hide) {
      app.globalData.$loading.hide();
    }
  }
};
exports.loadingMixin = loadingMixin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mixin/loading.mixin.js.map
