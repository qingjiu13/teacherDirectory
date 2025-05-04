"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "ModeSelector",
  props: {
    currentMode: new UTSJSONObject({
      type: String,
      default: "general",
      validator: (value = null) => {
        return ["general", "school", "career"].includes(value);
      }
    })
  },
  methods: new UTSJSONObject({
    /**
     * @description 切换对话模式
     * @param {String} mode - 对话模式
     */
    switchMode(mode = null) {
      if (this.currentMode === mode)
        return null;
      this.$emit("modeChange", mode);
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.currentMode === "general" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchMode("general")),
    c: $props.currentMode === "school" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchMode("school")),
    e: $props.currentMode === "career" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchMode("career")),
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/ModeSelector.js.map
