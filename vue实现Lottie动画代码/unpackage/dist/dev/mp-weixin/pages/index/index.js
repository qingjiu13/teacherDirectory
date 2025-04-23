"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const router_Router = require("../../router/Router.js");
const AICartoon = () => "../../components/AI-cartoon/AI-cartoon.js";
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    AICartoon,
    TabBar
  },
  data() {
    return {
      animation: null
    };
  },
  mounted() {
    this.initLottie();
  },
  methods: new UTSJSONObject({
    initLottie() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select("#lottie-canvas").fields(new UTSJSONObject({ node: true, size: true })).exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
          canvas.width = 300 * dpr;
          canvas.height = 300 * dpr;
          ctx.scale(dpr, dpr);
          const lottie = require("../../components/lottie/miniprogram_dist/index.js");
          this.animation = lottie.loadAnimation(new UTSJSONObject({
            loop: true,
            autoplay: true,
            animationData: null,
            path: "https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json",
            rendererSettings: new UTSJSONObject({
              context: ctx,
              clearCanvas: true
            })
          }));
        });
      });
    },
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
  }),
  beforeDestroy() {
    var _a;
    (_a = this.animation) === null || _a === void 0 ? void 0 : _a.destroy();
  }
}));
if (!Array) {
  const _component_AICartoon = common_vendor.resolveComponent("AICartoon");
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  (_component_AICartoon + _component_TabBar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sei("lottie-canvas", "canvas"),
    b: common_vendor.o((...args) => $options.navigateToMatch && $options.navigateToMatch(...args)),
    c: common_vendor.p({
      pageName: "index"
    }),
    d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
