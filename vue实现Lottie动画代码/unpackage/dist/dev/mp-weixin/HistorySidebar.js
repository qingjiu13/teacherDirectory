"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "HistorySidebar",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState(new UTSJSONObject({
    conversations: (state = null) => {
      try {
        return state.user && state.user.aiChat && state.user.aiChat.aiChat ? state.user.aiChat.aiChat.conversations || [] : [];
      } catch (e) {
        common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:61", "获取 conversations 状态出错:", e);
        return [];
      }
    },
    activeConversation: (state = null) => {
      try {
        return state.user && state.user.aiChat && state.user.aiChat.aiChat ? state.user.aiChat.aiChat.activeConversation : null;
      } catch (e) {
        common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:71", "获取 activeConversation 状态出错:", e);
        return null;
      }
    }
  }))), {
    /**
     * @description 历史聊天摘要数组（只包含ID、标题等基本信息）
     * @returns {Array} 历史聊天摘要数组
     */
    historySummaries() {
      if (!this.conversations) {
        common_vendor.index.__f__("warn", "at components/ai-chat/HistorySidebar.vue:84", "conversations 是 undefined");
        return [];
      }
      try {
        return this.conversations.map((conv = null) => {
          return new UTSJSONObject({
            id: conv.id,
            abstract: conv.abstract,
            chatMode: conv.chatMode,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt
          });
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:97", "处理 historySummaries 出错:", e);
        return [];
      }
    },
    /**
     * @description 当前选中的聊天ID
     * @returns {String} 当前选中的聊天ID
     */
    currentChatId() {
      return this.activeConversation;
    }
  }),
  created() {
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:112", "=================== 调试信息开始 ===================");
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:113", "完整的 Vuex store:", this.$store);
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:114", "Vuex store状态:", this.$store.state);
    if (this.$store.state.user) {
      common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:117", "user模块状态:", this.$store.state.user);
      if (this.$store.state.user.aiChat) {
        common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:120", "aiChat模块状态:", this.$store.state.user.aiChat);
        if (this.$store.state.user.aiChat.aiChat) {
          common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:123", "内层 aiChat:", this.$store.state.user.aiChat.aiChat);
          common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:124", "内层 aiChat conversations:", this.$store.state.user.aiChat.aiChat.conversations);
        } else {
          common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:126", "无法访问内层 aiChat!");
          common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:127", "aiChat 模块完整内容:", UTS.JSON.stringify(this.$store.state.user.aiChat));
        }
      } else {
        common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:130", "无法访问 aiChat 模块!");
      }
    } else {
      common_vendor.index.__f__("error", "at components/ai-chat/HistorySidebar.vue:133", "无法访问 user 模块!");
    }
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:136", "组件计算的 conversations:", this.conversations);
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:137", "组件计算的 historySummaries:", this.historySummaries);
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:138", "组件计算的 currentChatId:", this.currentChatId);
    common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:139", "=================== 调试信息结束 ===================");
  },
  methods: Object.assign(Object.assign({}, common_vendor.mapActions(new UTSJSONObject({
    setActiveConversation: "user/aiChat/setCurrentChat",
    deleteConversation: "user/aiChat/deleteChat"
  }))), {
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
      this.setActiveConversation(chatId);
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
      common_vendor.index.__f__("log", "at components/ai-chat/HistorySidebar.vue:188", "删除历史记录:", chatId);
      this.deleteConversation(chatId);
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
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.historySummaries.length === 0
  }, $options.historySummaries.length === 0 ? {} : {
    b: common_vendor.f($options.historySummaries, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.abstract || item.title || "对话 " + (index + 1)),
        b: common_vendor.t($options.formatTime(item.updatedAt || item.createdAt)),
        c: item.chatMode
      }, item.chatMode ? {
        d: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        e: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        f: item.id,
        g: $options.currentChatId === item.id ? 1 : "",
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
