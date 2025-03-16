"use strict";
const common_vendor = require("../../common/vendor.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      title: "研师录"
    };
  },
  onLoad() {
  },
  onShow() {
    common_vendor.index.hideTabBar();
  },
  methods: {
    /**
     * @description 跳转到匹配页面
     */
    goToMatch() {
      try {
        common_vendor.index.navigateTo({
          url: "/pages/match/match"
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:59", e);
        common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "none"
        });
      }
    },
    /**
     * @description 跳转到AI择校页面
     */
    goToAISelection() {
      try {
        common_vendor.index.navigateTo({
          url: "/pages/ai/selection/selection"
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:76", e);
        common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "none"
        });
      }
    }
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
    a: common_vendor.o((...args) => $options.goToMatch && $options.goToMatch(...args)),
    b: common_vendor.o((...args) => $options.goToAISelection && $options.goToAISelection(...args)),
    c: common_vendor.p({
      pageName: "index"
    }),
    d: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
