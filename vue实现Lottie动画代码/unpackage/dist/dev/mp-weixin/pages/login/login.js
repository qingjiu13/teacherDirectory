"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  methods: new UTSJSONObject({
    /**
     * 选择用户身份并更新到Vuex中
     * @param {string} identity - 用户身份类型 ('student'或'teacher')
     */
    selectIdentity(identity = null) {
      common_vendor.index.__f__("log", "at pages/login/login.vue:32", "选中的身份是:", identity);
      try {
        store_index.store.commit("user/baseInfo/updateRole", identity);
        router_Router.Navigator.toLoginDetail();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:42", "选择身份时出错:", error);
        common_vendor.index.showToast({
          title: "系统错误，请重试",
          icon: "none"
        });
      }
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_1,
    b: common_vendor.o(($event) => $options.selectIdentity("student")),
    c: common_assets._imports_1,
    d: common_vendor.o(($event) => $options.selectIdentity("teacher")),
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
