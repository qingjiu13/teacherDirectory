"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "MessageItem",
  props: {
    role: new UTSJSONObject({
      type: String,
      default: "user",
      validator: (value = null) => {
        return ["user", "AI", "system"].includes(value);
      }
    }),
    content: new UTSJSONObject({
      type: String,
      default: ""
    }),
    status: new UTSJSONObject({
      type: String,
      default: "sent",
      validator: (value = null) => {
        return ["sending", "sent", "error"].includes(value);
      }
    }),
    streaming: new UTSJSONObject({
      type: Boolean,
      default: false
    }),
    aiTitle: new UTSJSONObject({
      type: String,
      default: "研师录AI"
    })
  },
  computed: new UTSJSONObject({
    /**
     * @description 获取消息类型（小写），用于CSS类名
     * @returns {String} 消息类型
     */
    messageType() {
      return this.role === "AI" ? "ai" : this.role;
    }
  }),
  methods: new UTSJSONObject({
    /**
     * @description 重试发送消息
     */
    onRetry() {
      this.$emit("retry");
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.messageType === "ai"
  }, $options.messageType === "ai" ? {
    b: common_vendor.t($props.aiTitle)
  } : {}, {
    c: common_vendor.t($props.content),
    d: $props.status === "sending"
  }, $props.status === "sending" ? {} : {}, {
    e: $props.status === "error"
  }, $props.status === "error" ? {
    f: common_vendor.o((...args) => $options.onRetry && $options.onRetry(...args))
  } : {}, {
    g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    h: common_vendor.n($options.messageType),
    i: common_vendor.n({
      "streaming": $props.streaming
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ai-chat/MessageItem.js.map
