"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "InputSection",
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: ""
    };
  },
  methods: {
    /**
     * @description 发送消息
     */
    sendMessage() {
      if (!this.inputValue.trim() || this.isProcessing) {
        return null;
      }
      this.$emit("send", this.inputValue.trim());
      this.inputValue = "";
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.isProcessing,
    b: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    c: $data.inputValue,
    d: common_vendor.o(($event) => $data.inputValue = $event.detail.value),
    e: common_vendor.t($props.isProcessing ? "请稍候" : "确认"),
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: !$data.inputValue.trim(),
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ai-chat/InputSection.js.map
