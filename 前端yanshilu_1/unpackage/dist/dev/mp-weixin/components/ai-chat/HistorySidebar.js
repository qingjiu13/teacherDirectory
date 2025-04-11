"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "HistorySidebar",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    historyChats: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentChatId: {
      type: String,
      default: ""
    }
  },
  methods: {
    /**
     * @description 加载聊天历史
     * @param {String} chatId - 聊天ID
     */
    loadChatHistory(chatId = null) {
      this.$emit("loadChat", chatId);
    },
    /**
     * @description 删除历史记录
     * @param {String} chatId - 聊天ID
     * @param {Event} e - 事件对象，用于阻止冒泡
     */
    deleteChatHistory(chatId = null, e = null) {
      e && e.stopPropagation();
      this.$emit("deleteChat", chatId);
    },
    /**
     * @description 格式化时间
     * @param {Date|String} time - 时间对象或时间字符串
     * @returns {String} 格式化后的时间字符串
     */
    formatTime(time = null) {
      if (!time)
        return "";
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.historyChats.length === 0
  }, $props.historyChats.length === 0 ? {} : {
    b: common_vendor.f($props.historyChats, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title || "对话 " + (index + 1)),
        b: common_vendor.t($options.formatTime(item.updatedAt || item.createdAt)),
        c: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), index),
        d: index,
        e: $props.currentChatId === item.id ? 1 : "",
        f: common_vendor.o(($event) => $options.loadChatHistory(item.id), index)
      };
    })
  }, {
    c: common_vendor.sei(_ctx.virtualHostId, "view"),
    d: $props.visible ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ai-chat/HistorySidebar.js.map
