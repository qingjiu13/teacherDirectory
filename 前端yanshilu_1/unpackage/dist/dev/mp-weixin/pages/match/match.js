"use strict";
const common_vendor = require("../../common/vendor.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:21", "匹配页面已加载");
  },
  data() {
    return {};
  }
});
if (!Array) {
  const _easycom_tab_bar2 = common_vendor.resolveComponent("tab-bar");
  _easycom_tab_bar2();
}
const _easycom_tab_bar = () => "../../components/tab-bar/tab-bar.js";
if (!Math) {
  _easycom_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      pageName: "match"
    }),
    b: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map
