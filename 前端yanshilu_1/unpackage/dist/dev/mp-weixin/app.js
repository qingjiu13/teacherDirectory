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
}
const _sfc_main = common_vendor.defineComponent({
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.uvue:7", "App Launch");
    this.initAppState();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.uvue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.uvue:15", "App Hide");
  },
  onExit: function() {
    common_vendor.index.__f__("log", "at App.uvue:36", "App Exit");
  },
  methods: {
    /**
     * @description 初始化应用状态
     * @returns {Promise<void>}
     */
    initAppState() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield store_index.initializeApp();
          common_vendor.index.__f__("log", "at App.uvue:47", "应用状态初始化成功");
        } catch (error) {
          common_vendor.index.__f__("error", "at App.uvue:49", "应用状态初始化失败:", error);
        }
      });
    }
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
