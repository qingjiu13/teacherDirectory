"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "ModeSelector",
  props: {
    currentMode: {
      type: String,
      default: "general",
      validator: (value = null) => {
        return ["general", "school", "career"].includes(value);
      }
    },
    inNav: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @description 切换对话模式
     * @param {String} mode - 对话模式
     */
    switchMode(mode = null) {
      if (this.currentMode === mode)
        return null;
      this.$emit("modeChange", mode);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.inNav
  }, $props.inNav ? common_vendor.e({
    b: $props.currentMode === "general"
  }, $props.currentMode === "general" ? {} : {}, {
    c: $props.currentMode === "general" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchMode("general")),
    e: $props.currentMode === "school"
  }, $props.currentMode === "school" ? {} : {}, {
    f: $props.currentMode === "school" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchMode("school")),
    h: $props.currentMode === "career"
  }, $props.currentMode === "career" ? {} : {}, {
    i: $props.currentMode === "career" ? 1 : "",
    j: common_vendor.o(($event) => $options.switchMode("career"))
  }) : {
    k: $props.currentMode === "general" ? 1 : "",
    l: common_vendor.o(($event) => $options.switchMode("general")),
    m: $props.currentMode === "school" ? 1 : "",
    n: common_vendor.o(($event) => $options.switchMode("school")),
    o: $props.currentMode === "career" ? 1 : "",
    p: common_vendor.o(($event) => $options.switchMode("career"))
  }, {
    q: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    r: $props.inNav ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/ModeSelector.js.map
