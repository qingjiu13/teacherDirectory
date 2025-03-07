"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/publish/publish.js";
  "./pages/mine/mine.js";
  "./pages/match/match.js";
}
const _sfc_main = common_vendor.defineComponent({
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.uvue:5", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.uvue:8", "App Show");
    common_vendor.index.hideTabBar();
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.uvue:13", "App Hide");
  },
  onExit: function() {
    common_vendor.index.__f__("log", "at App.uvue:34", "App Exit");
  },
  onPageNotFound: function(obj = null) {
    common_vendor.index.__f__("log", "at App.uvue:37", "App onPageNotFound");
  },
  onError: function(err = null) {
    common_vendor.index.__f__("log", "at App.uvue:40", "App onError");
  },
  onUniNViewMessage: function(e = null) {
    common_vendor.index.__f__("log", "at App.uvue:43", "App onUniNViewMessage");
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
