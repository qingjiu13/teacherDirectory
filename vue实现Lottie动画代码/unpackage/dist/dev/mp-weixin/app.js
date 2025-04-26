"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:9", "App Launch");
      if (common_vendor.index && !common_vendor.index.$store) {
        common_vendor.index.$store = store_index.store;
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:19", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:24", "App Hide");
    });
    const handleExit = () => {
      common_vendor.index.__f__("log", "at App.vue:47", "App Exit");
    };
    if (common_vendor.index) {
      common_vendor.index.$onExit = handleExit;
    }
    return () => {
    };
  }
});
const handleError = (err) => {
  common_vendor.index.__f__("error", "at main.js:8", "捕获到全局错误:", err);
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.errorHandler = (err, vm, info) => {
    common_vendor.index.__f__("error", "at main.js:18", "Vue错误:", err);
    common_vendor.index.__f__("info", "at main.js:19", "错误来源:", info);
    handleError(err);
  };
  if (common_vendor.index.getSystemInfoSync().platform === "mp-weixin") {
    common_vendor.index.__f__("log", "at main.js:26", "当前运行环境: 微信小程序");
    common_vendor.index.onError((err) => {
      common_vendor.index.__f__("error", "at main.js:31", "小程序错误:", err);
      handleError(err);
    });
  }
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
