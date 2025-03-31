"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/match/match.js";
  "./pages/teacher/teacher.js";
  "./pages/AI/AI.js";
  "./pages/message/message.js";
  "./pages/message/chat.js";
  "./pages/login/login.js";
  "./pages/login/student/student.js";
  "./pages/login/teacher/teacher.js";
  "./pages/login/wechat_login.js";
  "./pages/mine/mine/student_mine.js";
  "./pages/mine/mine/teacher_mine.js";
  "./pages/mine/modify.js";
  "./pages/mine/course/course.js";
  "./pages/mine/course/course_detail.js";
  "./pages/mine/order.js";
  "./pages/mine/order/student_order.js";
  "./pages/mine/order/teacher_order.js";
  "./pages/mine/order/appraise/appraise.js";
  "./pages/mine/qualification.js";
  "./pages/mine/service.js";
  "./pages/mine/settings.js";
  "./pages/mine/wallet.js";
  "./pages/mine/mine/mine_common.js";
  "./pages/mine/order/order_common.js";
}
const _sfc_main = common_vendor.defineComponent({
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.uvue:5", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.uvue:8", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.uvue:11", "App Hide");
  },
  onExit: function() {
    common_vendor.index.__f__("log", "at App.uvue:32", "App Exit");
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
