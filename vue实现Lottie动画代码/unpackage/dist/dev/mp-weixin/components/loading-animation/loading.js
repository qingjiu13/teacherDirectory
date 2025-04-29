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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "loading",
  props: {
    visible: Boolean,
    src: new UTSJSONObject({
      type: String,
      default: "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
    })
  },
  setup(__props) {
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: __props.visible
      }), __props.visible ? new UTSJSONObject({
        b: common_vendor.p(new UTSJSONObject({
          src: __props.src,
          width: "300rpx",
          height: "300rpx",
          loop: true,
          autoplay: true
        })),
        c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }) : new UTSJSONObject({}));
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c93adc7b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/loading-animation/loading.js.map
