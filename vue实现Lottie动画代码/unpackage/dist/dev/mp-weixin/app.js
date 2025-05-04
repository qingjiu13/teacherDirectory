"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_vuexDebug = require("./utils/vuex-debug.js");
const store_injectChecker = require("./store/inject-checker.js");
const mixin_loading_mixin = require("./mixin/loading.mixin.js");
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
  "./pages/mine/order.js";
  "./pages/mine/order/order_common.js";
  "./pages/mine/order/appraise/appraise.js";
  "./pages/mine/qualification.js";
  "./pages/mine/service.js";
  "./pages/mine/settings.js";
  "./pages/mine/wallet.js";
  "./pages/test/test.js";
  "./pages/mine/service_newbuilt.js";
}
const settings = new UTSJSONObject({
  miniprogram: new UTSJSONObject({
    libVersion: "2.9.0"
  })
});
const App = new UTSJSONObject({
  settings
});
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(store_index.store);
  app.provide("store", store_index.store);
  app.config.globalProperties.$store = store_index.store;
  app.mixin(mixin_loading_mixin.loadingMixin);
  app.mixin(store_injectChecker.injectStoreSafety);
  const handleError = (err) => {
    common_vendor.index.__f__("error", "at main.js:27", "捕获到全局错误:", err);
  };
  app.config.errorHandler = (err, vm, info) => {
    common_vendor.index.__f__("error", "at main.js:32", "Vue错误:", err);
    common_vendor.index.__f__("info", "at main.js:33", "错误来源:", info);
    handleError(err);
  };
  {
    try {
      utils_vuexDebug.installDebugPlugin(store_index.store);
      utils_vuexDebug.installDebugForVue3(app, store_index.store);
      store_injectChecker.checkStoreAvailability(store_index.store);
      common_vendor.index.__f__("log", "at main.js:43", "初始Vuex状态:", store_index.store.state);
    } catch (e) {
      common_vendor.index.__f__("error", "at main.js:45", "调试插件初始化失败:", e);
    }
  }
  if (common_vendor.index.getSystemInfoSync().platform === "mp-weixin") {
    common_vendor.index.__f__("log", "at main.js:51", "当前运行环境: 微信小程序");
    try {
      common_vendor.index.onError((err) => {
        common_vendor.index.__f__("error", "at main.js:57", "小程序错误:", err);
        handleError(err);
      });
      common_vendor.index.onNetworkStatusChange((res) => {
        common_vendor.index.__f__("log", "at main.js:63", "网络状态变化:", res.isConnected ? "已连接" : "已断开");
        store_index.store.commit("app/setNetworkStatus", res.isConnected);
      });
      const app2 = getApp();
      if (app2 && !app2.globalData) {
        app2.globalData = {};
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at main.js:73", "微信小程序配置失败:", e);
    }
  }
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
