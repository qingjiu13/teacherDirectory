"use strict";
const common_vendor = require("../../common/vendor.js");
const EnhancedDropdown = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    EnhancedDropdown
  },
  data() {
    return {
      // 页面数据
      inputMessage: "",
      messages: [
        new UTSJSONObject({
          type: "ai",
          content: "你好！我是AI助手，有什么可以帮助你的吗？"
        })
      ],
      // 筛选相关数据
      selectedType: null,
      selectedTags: [],
      // 模拟问题类型数据
      problemTypes: [
        new UTSJSONObject({
          value: "technical",
          label: "技术问题",
          icon: "🔧",
          tags: ["常见"],
          group: "常用问题",
          metadata: new UTSJSONObject({
            priority: "high",
            responseTime: "fast"
          })
        }),
        new UTSJSONObject({
          value: "product",
          label: "产品咨询",
          icon: "📱",
          tags: ["热门"],
          group: "常用问题",
          metadata: new UTSJSONObject({
            priority: "medium",
            responseTime: "normal"
          })
        }),
        new UTSJSONObject({
          value: "account",
          label: "账户问题",
          icon: "👤",
          tags: ["紧急"],
          group: "常用问题",
          metadata: new UTSJSONObject({
            priority: "high",
            responseTime: "fast"
          })
        }),
        new UTSJSONObject({
          value: "billing",
          label: "计费问题",
          icon: "💰",
          tags: ["复杂"],
          group: "其他问题",
          metadata: new UTSJSONObject({
            priority: "medium",
            responseTime: "slow"
          })
        }),
        new UTSJSONObject({
          value: "feedback",
          label: "意见反馈",
          icon: "💡",
          tags: ["非紧急"],
          group: "其他问题",
          metadata: new UTSJSONObject({
            priority: "low",
            responseTime: "normal"
          })
        }),
        new UTSJSONObject({
          value: "bug",
          label: "软件缺陷",
          icon: "🐞",
          tags: ["紧急"],
          group: "技术支持",
          metadata: new UTSJSONObject({
            priority: "high",
            responseTime: "fast"
          })
        }),
        new UTSJSONObject({
          value: "feature",
          label: "功能建议",
          icon: "✨",
          tags: ["非紧急"],
          group: "技术支持",
          metadata: new UTSJSONObject({
            priority: "low",
            responseTime: "slow"
          })
        })
      ],
      // 标签筛选器选项（初始为空，会根据选择的问题类型动态变化）
      relatedTags: []
    };
  },
  methods: {
    /**
     * @description 发送消息
     */
    sendMessage() {
      if (this.inputMessage.trim()) {
        this.messages.push({
          type: "user",
          content: this.inputMessage
        });
        const selectedTypeInfo = this.selectedType ? `问题类型：${this.selectedType.label}` : "";
        const selectedTagsInfo = this.selectedTags.length > 0 ? `，标签：${this.selectedTags.map((tag) => {
          return tag.label;
        }).join(", ")}` : "";
        setTimeout(() => {
          this.messages.push({
            type: "ai",
            content: `我已收到您的问题"${this.inputMessage}"。${selectedTypeInfo}${selectedTagsInfo}。我们将尽快为您解答！`
          });
        }, 500);
        this.inputMessage = "";
      }
    },
    /**
     * @description 处理问题类型变更
     * @param {Object} selectedType - 选中的问题类型
     */
    handleTypeChange(selectedType = null) {
      if (selectedType) {
        common_vendor.index.__f__("log", "at pages/AI/AI.uvue:206", "选择的问题类型:", selectedType);
        this.generateRelatedTags(selectedType.value);
        this.selectedTags = [];
      } else {
        this.relatedTags = [];
      }
    },
    /**
     * @description 处理标签变更
     * @param {Array} selectedTags - 选中的标签列表
     */
    handleTagsChange(selectedTags = null) {
      common_vendor.index.__f__("log", "at pages/AI/AI.uvue:223", "选择的标签:", selectedTags);
    },
    /**
     * @description 生成相关标签
     * @param {String} problemType - 问题类型值
     */
    generateRelatedTags(problemType = null) {
      const tagMappings = new UTSJSONObject({
        "technical": [
          new UTSJSONObject({ value: "framework", label: "框架问题", icon: "🔨" }),
          new UTSJSONObject({ value: "api", label: "API调用", icon: "🔄" }),
          new UTSJSONObject({ value: "performance", label: "性能问题", icon: "⚡" }),
          new UTSJSONObject({ value: "compatibility", label: "兼容性", icon: "🔗" })
        ],
        "product": [
          new UTSJSONObject({ value: "usage", label: "使用方法", icon: "📝" }),
          new UTSJSONObject({ value: "feature", label: "功能咨询", icon: "✨" }),
          new UTSJSONObject({ value: "comparison", label: "产品对比", icon: "⚖️" })
        ],
        "account": [
          new UTSJSONObject({ value: "login", label: "登录问题", icon: "🔑" }),
          new UTSJSONObject({ value: "security", label: "安全相关", icon: "🔒" }),
          new UTSJSONObject({ value: "profile", label: "个人资料", icon: "📋" })
        ],
        "billing": [
          new UTSJSONObject({ value: "invoice", label: "发票问题", icon: "📄" }),
          new UTSJSONObject({ value: "payment", label: "支付方式", icon: "💳" }),
          new UTSJSONObject({ value: "pricing", label: "价格咨询", icon: "💲" })
        ],
        "feedback": [
          new UTSJSONObject({ value: "suggestion", label: "建议", icon: "💬" }),
          new UTSJSONObject({ value: "complaint", label: "投诉", icon: "⚠️" }),
          new UTSJSONObject({ value: "praise", label: "表扬", icon: "👍" })
        ],
        "bug": [
          new UTSJSONObject({ value: "crash", label: "崩溃", icon: "💥" }),
          new UTSJSONObject({ value: "ui", label: "UI问题", icon: "🖼️" }),
          new UTSJSONObject({ value: "logic", label: "逻辑错误", icon: "🧩" })
        ],
        "feature": [
          new UTSJSONObject({ value: "enhancement", label: "功能增强", icon: "🚀" }),
          new UTSJSONObject({ value: "new", label: "新功能", icon: "🆕" }),
          new UTSJSONObject({ value: "integration", label: "集成需求", icon: "🔄" })
        ]
      });
      this.relatedTags = tagMappings[problemType] || [];
    },
    /**
     * @description 获取提交给后端的数据
     * @returns {Object} 用于提交给后端的数据
     */
    getSubmitData() {
      return new UTSJSONObject({
        problemType: this.$refs.typeDropdown.getPayloadData(),
        tags: this.$refs.tagDropdown.getPayloadData(),
        message: this.inputMessage
      });
    }
  }
});
if (!Array) {
  const _component_enhanced_dropdown = common_vendor.resolveComponent("enhanced-dropdown");
  _component_enhanced_dropdown();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("typeDropdown", "be726fe0-0"),
    b: common_vendor.o($options.handleTypeChange),
    c: common_vendor.o(($event) => $data.selectedType = $event),
    d: common_vendor.p({
      options: $data.problemTypes,
      placeholder: "请选择问题类型",
      searchable: true,
      grouped: true,
      ["collect-full-data"]: true,
      modelValue: $data.selectedType
    }),
    e: $data.selectedType
  }, $data.selectedType ? {
    f: common_vendor.sr("tagDropdown", "be726fe0-1"),
    g: common_vendor.o($options.handleTagsChange),
    h: common_vendor.o(($event) => $data.selectedTags = $event),
    i: common_vendor.p({
      options: $data.relatedTags,
      placeholder: "请选择相关标签",
      searchable: true,
      multiple: true,
      ["max-selections"]: 3,
      modelValue: $data.selectedTags
    })
  } : {}, {
    j: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: index,
        c: common_vendor.n(message.type === "ai" ? "ai-message" : "user-message")
      };
    }),
    k: $data.inputMessage,
    l: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    n: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
