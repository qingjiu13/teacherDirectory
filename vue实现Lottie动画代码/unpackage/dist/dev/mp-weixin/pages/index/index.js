"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
if (!Array) {
  const _easycom_c_lottie_1 = common_vendor.resolveComponent("c-lottie");
  _easycom_c_lottie_1();
}
const _easycom_c_lottie = () => "../../uni_modules/c-lottie/components/c-lottie/c-lottie.js";
if (!Math) {
  (_easycom_c_lottie + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    src: new UTSJSONObject({
      type: String,
      default: "https://lottie.host/aa045d36-86ee-46d3-9705-1eeb65b38465/V6aAFX4Fmk.json"
    })
  },
  setup(__props) {
    const cLottieRef = common_vendor.ref();
    const matchAnimation = () => {
      cLottieRef.value.call("play");
      setTimeout(() => {
        cLottieRef.value.call("stop");
        navigateToMatch();
      }, 5e3);
    };
    const navigateToMatch = () => {
      router_Router.Navigator.toMatch();
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sr(cLottieRef, "74acbeb4-0", {
          "k": "cLottieRef"
        }),
        b: common_vendor.p({
          src: __props.src,
          width: "600rpx",
          autoPlay: false,
          height: "600rpx",
          loop: true
        }),
        c: common_vendor.o(matchAnimation),
        d: common_vendor.p({
          pageName: "index"
        }),
        e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
