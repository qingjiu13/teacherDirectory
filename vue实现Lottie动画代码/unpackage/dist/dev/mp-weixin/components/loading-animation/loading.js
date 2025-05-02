"use strict";
const common_vendor = require("../../common/vendor.js");
const components_loadingAnimation_useLottieReady = require("./useLottieReady.js");
if (!Array) {
  const _easycom_c_lottie_1 = common_vendor.resolveComponent("c-lottie");
  _easycom_c_lottie_1();
}
const _easycom_c_lottie = () => "../../uni_modules/c-lottie/components/c-lottie/c-lottie.js";
if (!Math) {
  _easycom_c_lottie();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "loading",
  props: {
    src: new UTSJSONObject({
      type: String,
      default: "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
    })
  },
  setup(__props, _a) {
    var __expose = _a.expose;
    const visible = common_vendor.ref(false);
    const lottieRef = common_vendor.ref(null);
    const isReady = components_loadingAnimation_useLottieReady.useLottieReady(lottieRef).isReady;
    const show = () => {
      visible.value = true;
    };
    const hide = () => {
      visible.value = false;
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at components/loading-animation/loading.vue:60", "加载动画组件已挂载");
    });
    __expose(new UTSJSONObject({
      show,
      hide,
      isReady
    }));
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sr(lottieRef, "c93adc7b-0", {
          "k": "lottieRef"
        }),
        b: common_vendor.p({
          src: __props.src,
          width: "300rpx",
          height: "300rpx",
          loop: true,
          autoplay: true
        }),
        c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        d: visible.value
      };
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c93adc7b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/loading-animation/loading.js.map
