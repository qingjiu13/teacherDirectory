"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    function selectIdentity(identity = null) {
      common_vendor.index.__f__("log", "at pages/login/login.vue:30", "选中的身份是:", identity);
      const role = identity === "student" ? "学生" : "老师";
      store_index.store.commit("user/baseInfo/updateRole", role);
      router_Router.Navigator.toLoginDetail();
    }
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_assets._imports_1,
        b: common_vendor.o(($event = null) => {
          return selectIdentity("student");
        }),
        c: common_assets._imports_1,
        d: common_vendor.o(($event = null) => {
          return selectIdentity("teacher");
        }),
        e: common_vendor.sei(_ctx.virtualHostId, "view")
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
