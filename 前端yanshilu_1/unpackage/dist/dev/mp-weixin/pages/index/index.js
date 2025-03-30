"use strict";
const common_vendor = require("../../common/vendor.js");
const Router = require("../../Router.js");
const _sfc_main = common_vendor.defineComponent({
  methods: {
    navigateToMatch() {
      Router.Router.navigator.toMatch();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navigateToMatch && $options.navigateToMatch(...args)),
    b: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
