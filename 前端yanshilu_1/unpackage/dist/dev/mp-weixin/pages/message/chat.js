"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      teacherId: "",
      teacherName: "老师",
      inputMessage: "",
      messages: [
        new UTSJSONObject({
          content: "您好，我是您的专业辅导老师，有什么可以帮助您的？",
          isSelf: false
        })
      ]
    };
  },
  onLoad(options) {
    if (options.userId) {
      this.teacherId = options.userId;
      this.loadTeacherInfo();
    }
  },
  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * 加载教师信息
     */
    loadTeacherInfo() {
      setTimeout(() => {
        const teachers = new UTSJSONObject({
          "1": "王教授",
          "2": "李博士",
          "3": "张老师",
          "4": "刘教授",
          "5": "陈老师"
        });
        this.teacherName = teachers[this.teacherId] || "老师";
      }, 100);
    },
    /**
     * 发送消息
     */
    sendMessage() {
      if (!this.inputMessage.trim())
        return null;
      this.messages.push({
        content: this.inputMessage,
        isSelf: true
      });
      const userMessage = this.inputMessage;
      this.inputMessage = "";
      setTimeout(() => {
        this.messages.push({
          content: `收到您的消息："${userMessage}"，我会尽快回复您。`,
          isSelf: false
        });
      }, 1e3);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.teacherName),
    c: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: common_vendor.n(message.isSelf ? "self-message" : "teacher-message"),
        c: index
      };
    }),
    d: common_vendor.sei("msg-bottom", "view"),
    e: $data.inputMessage,
    f: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    g: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    h: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/chat.js.map
