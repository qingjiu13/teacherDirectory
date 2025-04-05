"use strict";
const common_vendor = require("../../../common/vendor.js");
const router_Router = require("../../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      MineRoutes: router_Router.MineRoutes
    };
  },
  methods: {
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      if (!this.$parent.isLoggedIn) {
        router_Router.Navigator.toLogin();
        return null;
      }
      router_Router.Navigator.navigateTo(url);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.ORDER_COMMON)),
    b: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.COURSE)),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/subscribe/subscribe")),
    d: common_vendor.o(($event) => $options.navigateTo($data.MineRoutes.SETTINGS)),
    e: _ctx.$parent.isLoggedIn
  }, _ctx.$parent.isLoggedIn ? {
    f: common_vendor.o(($event) => _ctx.$parent.handleLogout())
  } : {}, {
    g: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/student_mine.js.map
