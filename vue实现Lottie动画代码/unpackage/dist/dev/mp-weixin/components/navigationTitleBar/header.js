"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  name: "Header",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * 返回按钮点击事件处理
     * @event back
     */
    onBack() {
      this.$emit("back");
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$4,
    b: common_vendor.o((...args) => $options.onBack && $options.onBack(...args)),
    c: common_vendor.t($props.title),
    d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-73efb244"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/navigationTitleBar/header.js.map
