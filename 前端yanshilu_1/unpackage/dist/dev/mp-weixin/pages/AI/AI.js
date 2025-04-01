"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      // 页面数据
      inputMessage: "",
      messages: [
        new UTSJSONObject({
          type: "ai",
          content: "你好！我是AI助手，有什么可以帮助你的吗？"
        })
      ]
    };
  },
  methods: {
    /**
     * @description 发送消息
     */
    sendMessage() {
      if (this.inputMessage.trim()) {
        this.inputMessage = "";
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
