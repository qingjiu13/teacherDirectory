"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_c_lottie_1 = common_vendor.resolveComponent("c-lottie");
  _easycom_c_lottie_1();
}
const _easycom_c_lottie = () => "../../uni_modules/c-lottie/components/c-lottie/c-lottie.js";
if (!Math) {
  _easycom_c_lottie();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "test",
  setup(__props) {
    const cLottieRef = common_vendor.ref();
    let src = common_vendor.ref("https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json");
    const onLoopComplete = (val = null) => {
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sr(cLottieRef, "74c39be4-0", {
          "k": "cLottieRef"
        }),
        b: common_vendor.o(onLoopComplete),
        c: common_vendor.p({
          src: common_vendor.unref(src),
          width: "750rpx",
          height: "750rpx",
          loop: true
        }),
        d: common_vendor.o(($event = null) => {
          return common_vendor.isRef(src) ? src.value = "https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json" : src = "https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json";
        }),
        e: common_vendor.o(($event = null) => {
          return common_vendor.isRef(src) ? src.value = "https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json" : src = "https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json";
        }),
        f: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("play");
        }),
        g: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("setDirection", -1);
        }),
        h: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("pause");
        }),
        i: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("stop");
        }),
        j: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("setSpeed", 1);
        }),
        k: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("setSpeed", 2);
        }),
        l: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("goToAndStop", [2e3, false]);
        }),
        m: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("goToAndPlay", [2e3, false]);
        }),
        n: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("goToAndStop", [2, true]);
        }),
        o: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("goToAndPlay", [2, true]);
        }),
        p: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("playSegments", [[10, 20], false]);
        }),
        q: common_vendor.o(($event = null) => {
          return cLottieRef.value.call("playSegments", [[[0, 5], [10, 18]], true]);
        }),
        r: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
}));
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/test.js.map
