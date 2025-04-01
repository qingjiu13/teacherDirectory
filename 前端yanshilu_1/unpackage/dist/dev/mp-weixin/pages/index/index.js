"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const AICartoon = () => "../../components/AI-cartoon/AI-cartoon.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    AICartoon
  },
  methods: {
    /**
     * @description 导航到匹配页面
     */
    navigateToMatch() {
      router_Router.Navigator.toMatch();
    }
  }
});
if (!Array) {
  const _component_AICartoon = common_vendor.resolveComponent("AICartoon");
  _component_AICartoon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navigateToMatch && $options.navigateToMatch(...args)),
    b: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
