"use strict";
let timer = null;
const loadingMixin = {
  onLoad() {
    const app = getApp();
    timer = setTimeout(() => {
      var _a, _b, _c;
      (_c = (_b = (_a = app.globalData) == null ? void 0 : _a.$loading) == null ? void 0 : _b.show) == null ? void 0 : _c.call(_b);
    }, 300);
  },
  onReady() {
    var _a, _b, _c;
    clearTimeout(timer);
    const app = getApp();
    (_c = (_b = (_a = app.globalData) == null ? void 0 : _a.$loading) == null ? void 0 : _b.hide) == null ? void 0 : _c.call(_b);
  }
};
exports.loadingMixin = loadingMixin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mixin/loading.mixin.js.map
