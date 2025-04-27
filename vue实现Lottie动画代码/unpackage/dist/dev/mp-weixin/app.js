"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_vuexDebug = require("./utils/vuex-debug.js");
const store_injectChecker = require("./store/inject-checker.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/match/match.js";
  "./pages/teacher/teacher.js";
  "./pages/AI/AI.js";
  "./pages/message/message.js";
  "./pages/message/chat.js";
  "./pages/login/login.js";
  "./pages/login/login_detail.js";
  "./pages/login/wechat_login.js";
  "./pages/mine/mine/mine_common.js";
  "./pages/mine/modify.js";
  "./pages/mine/course/course.js";
  "./pages/mine/course/course_detail.js";
  "./pages/mine/order.js";
  "./pages/mine/order/order_common.js";
  "./pages/mine/order/appraise/appraise.js";
  "./pages/mine/qualification.js";
  "./pages/mine/service.js";
  "./pages/mine/settings.js";
  "./pages/mine/wallet.js";
  "./pages/test/test.js";
}
const settings = new UTSJSONObject({
  miniprogram: new UTSJSONObject({
    libVersion: "2.9.0"
  })
});
const App = new UTSJSONObject({
  settings
});
const app = common_vendor.createApp(App);
app.use(store_index.store);
app.provide("store", store_index.store);
const handleError = (err) => {
  common_vendor.index.__f__("error", "at main.js:22", "捕获到全局错误:", err);
};
app.config.errorHandler = (err, vm, info) => {
  common_vendor.index.__f__("error", "at main.js:28", "Vue错误:", err);
  common_vendor.index.__f__("info", "at main.js:29", "错误来源:", info);
  handleError(err);
};
app.config.globalProperties.$store = store_index.store;
app.mixin(store_injectChecker.injectStoreSafety);
{
  utils_vuexDebug.installDebugPlugin(store_index.store);
  utils_vuexDebug.installDebugForVue3(app, store_index.store);
  store_injectChecker.checkStoreAvailability(store_index.store);
  common_vendor.index.__f__("log", "at main.js:50", "初始Vuex状态:", store_index.store.state);
}
if (common_vendor.index.getSystemInfoSync().platform === "mp-weixin") {
  common_vendor.index.__f__("log", "at main.js:55", "当前运行环境: 微信小程序");
  common_vendor.index.onError((err) => {
    common_vendor.index.__f__("error", "at main.js:59", "小程序错误:", err);
    handleError(err);
  });
}
app.mount("#app");
function createApp() {
  return {
    app
  };
}
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
