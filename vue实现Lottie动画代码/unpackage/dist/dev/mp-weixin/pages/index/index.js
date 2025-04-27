"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
const router_Router = require("../../router/Router.js");
const AICartoon = () => "../../components/AI-cartoon/AI-cartoon.js";
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    AICartoon,
    TabBar
  },
<<<<<<< HEAD
  navigateToMatch() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        yield store_index.store.dispatch("match/getFilteredMatchList", new UTSJSONObject({}));
        common_vendor.index.hideLoading();
        router_Router.Navigator.toMatch();
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "数据加载失败，请重试",
          icon: "none"
        });
      }
    });
  }
});
=======
  methods: new UTSJSONObject({
    navigateToMatch() {
      router_Router.Navigator.toMatch();
    }
  })
}));
>>>>>>> a2bf9657a39810a133593f8de99b785a81f8875d
if (!Array) {
  const _component_AICartoon = common_vendor.resolveComponent("AICartoon");
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  (_component_AICartoon + _component_TabBar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navigateToMatch && $options.navigateToMatch(...args)),
    b: common_vendor.p({
      pageName: "index"
    }),
    c: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
