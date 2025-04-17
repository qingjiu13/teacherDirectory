"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "MessageItem",
  props: {
    type: {
      type: String,
      default: "user",
      validator: (value = null) => {
        return ["user", "ai", "system"].includes(value);
      }
    },
    content: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "sent",
      validator: (value = null) => {
        return ["sending", "sent", "error"].includes(value);
      }
    },
    streaming: {
      type: Boolean,
      default: false
    },
    aiTitle: {
      type: String,
      default: "研师录AI"
    }
  },
  methods: {
    /**
     * @description 重试发送消息
     */
    onRetry() {
      this.$emit("retry");
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.type === "ai"
  }, $props.type === "ai" ? {
    b: common_vendor.t($props.aiTitle)
  } : {}, {
    c: common_vendor.t($props.content),
    d: $props.status === "sending"
  }, $props.status === "sending" ? {} : {}, {
    e: $props.status === "error"
  }, $props.status === "error" ? {
    f: common_vendor.o((...args) => $options.onRetry && $options.onRetry(...args))
  } : {}, {
    g: common_vendor.sei(_ctx.virtualHostId, "view"),
    h: common_vendor.n($props.type),
    i: common_vendor.n({
      "streaming": $props.streaming
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ai-chat/MessageItem.js.map
