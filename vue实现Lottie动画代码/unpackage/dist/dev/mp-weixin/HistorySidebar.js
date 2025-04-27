"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "HistorySidebar",
  props: {
    visible: new UTSJSONObject({
      type: Boolean,
      default: false
    }),
    historySummaries: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    }),
    currentChatId: new UTSJSONObject({
      type: String,
      default: ""
    })
  },
  watch: {
    historySummaries: {
      handler(newVal = null) {
        common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:61", "HistorySidebar 接收到历史摘要数据:", newVal && newVal.length);
      },
      immediate: true
    }
  },
  methods: {
    /**
     * @description 获取对话模式的中文标签
     * @param {String} mode - 对话模式
     * @returns {String} 对话模式的中文标签
     */
    getModeLabel(mode = null) {
      const modeLabels = new UTSJSONObject({
        "general": "通用",
        "school": "择校",
        "career": "职业规划"
      });
      return modeLabels[mode] || "通用";
    },
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
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:101", "删除历史记录:", chatId);
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
    a: $props.historySummaries.length === 0
  }, $props.historySummaries.length === 0 ? {} : {
    b: common_vendor.f($props.historySummaries, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.abstract || item.title || "对话 " + (index + 1)),
        b: common_vendor.t($options.formatTime(item.updatedAt || item.createdAt)),
        c: item.chatMode
      }, item.chatMode ? {
        d: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        e: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        f: item.id,
        g: $props.currentChatId === item.id ? 1 : "",
        h: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      });
    })
  }, {
    c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    d: $props.visible ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/HistorySidebar.js.map
