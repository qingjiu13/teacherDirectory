"use strict";
const common_vendor = require("../../common/vendor.js");
const api_API = require("../../api/API.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const MESSAGE_TYPE = new UTSJSONObject(
  {
    USER: "user",
    AI: "ai",
    SYSTEM: "system"
  }
  // 消息状态常量
);
const MESSAGE_STATUS = new UTSJSONObject(
  {
    SENDING: "sending",
    SENT: "sent",
    ERROR: "error"
  }
  // 对话模式常量
);
const CHAT_MODE = new UTSJSONObject({
  GENERAL: "general",
  SCHOOL: "school",
  CAREER: "career"
});
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected
  },
  data() {
    return {
      // 用户基本信息
      userInfo: new UTSJSONObject({
        school: "",
        major: ""
      }),
      // 消息相关
      inputValue: "",
      messages: [],
      isProcessing: false,
      isFullLoading: false,
      loadingText: "正在加载...",
      autoScrollId: "",
      // 对话模式
      currentMode: CHAT_MODE.GENERAL,
      // 学校和专业选择相关
      schoolIndex: -1,
      majorIndex: -1,
      schoolList: [
        new UTSJSONObject({ choiceItemId: "bjdx", choiceItemContent: "北京大学" }),
        new UTSJSONObject({ choiceItemId: "qhdx", choiceItemContent: "清华大学" }),
        new UTSJSONObject({ choiceItemId: "fddx", choiceItemContent: "复旦大学" }),
        new UTSJSONObject({ choiceItemId: "zjdx", choiceItemContent: "浙江大学" }),
        new UTSJSONObject({ choiceItemId: "njdx", choiceItemContent: "南京大学" }),
        new UTSJSONObject({ choiceItemId: "scdx", choiceItemContent: "四川大学" }),
        new UTSJSONObject({ choiceItemId: "whdx", choiceItemContent: "武汉大学" }),
        new UTSJSONObject({ choiceItemId: "zsdx", choiceItemContent: "中山大学" }),
        new UTSJSONObject({ choiceItemId: "xjtu", choiceItemContent: "西安交通大学" }),
        new UTSJSONObject({ choiceItemId: "hust", choiceItemContent: "华中科技大学" }),
        new UTSJSONObject({ choiceItemId: "hit", choiceItemContent: "哈尔滨工业大学" }),
        new UTSJSONObject({ choiceItemId: "sjtu", choiceItemContent: "上海交通大学" })
      ],
      majorList: [
        new UTSJSONObject({ choiceItemId: "jsjkx", choiceItemContent: "计算机科学" }),
        new UTSJSONObject({ choiceItemId: "rjgc", choiceItemContent: "软件工程" }),
        new UTSJSONObject({ choiceItemId: "sx", choiceItemContent: "数学" }),
        new UTSJSONObject({ choiceItemId: "wl", choiceItemContent: "物理" }),
        new UTSJSONObject({ choiceItemId: "hx", choiceItemContent: "化学" }),
        new UTSJSONObject({ choiceItemId: "sw", choiceItemContent: "生物" }),
        new UTSJSONObject({ choiceItemId: "jdxy", choiceItemContent: "机电工程" }),
        new UTSJSONObject({ choiceItemId: "dqxy", choiceItemContent: "电气工程" }),
        new UTSJSONObject({ choiceItemId: "jzxy", choiceItemContent: "建筑学" }),
        new UTSJSONObject({ choiceItemId: "lyxy", choiceItemContent: "临床医学" }),
        new UTSJSONObject({ choiceItemId: "yyxy", choiceItemContent: "药学" }),
        new UTSJSONObject({ choiceItemId: "glxy", choiceItemContent: "管理学" }),
        new UTSJSONObject({ choiceItemId: "jjxy", choiceItemContent: "经济学" }),
        new UTSJSONObject({ choiceItemId: "flxy", choiceItemContent: "法学" })
      ],
      // 滚动相关
      isAutoScrollEnabled: true,
      // 当前会话的请求控制器
      currentController: null,
      // 自定义的上下文信息
      contextInfo: new UTSJSONObject({})
    };
  },
  onLoad() {
    this.getUserInfo();
    this.addSystemMessage("欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问");
  },
  onUnload() {
    this.abortCurrentRequest();
  },
  onReady() {
    setTimeout(() => {
      this.updateLayout();
    }, 300);
  },
  methods: {
    /**
     * @description 更新布局，解决可能的定位问题
     */
    updateLayout() {
    },
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          const parsedInfo = UTS.JSON.parse(userInfo);
          this.userInfo = parsedInfo;
          if (this.userInfo.school) {
            const schoolIndex = this.schoolList.findIndex((item) => {
              return item.choiceItemContent === this.userInfo.school;
            });
            if (schoolIndex !== -1) {
              this.schoolIndex = schoolIndex;
            }
          }
          if (this.userInfo.major) {
            const majorIndex = this.majorList.findIndex((item) => {
              return item.choiceItemContent === this.userInfo.major;
            });
            if (majorIndex !== -1) {
              this.majorIndex = majorIndex;
            }
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:289", "获取用户信息失败:", e);
      }
    },
    /**
     * @description 保存用户信息
     */
    saveUserInfo() {
      try {
        common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userInfo));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:300", "保存用户信息失败:", e);
        this.showToast("保存用户信息失败，可能影响后续对话");
      }
    },
    /**
     * @description 页面点击事件，用于关闭下拉框
     */
    onPageClick() {
    },
    /**
     * @description 学校选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onSchoolClick(position = null) {
      this.schoolIndex = position;
      this.userInfo.school = this.schoolList[position].choiceItemContent;
      this.saveUserInfo();
      this.updateContextInfo();
    },
    /**
     * @description 专业选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onMajorClick(position = null) {
      this.majorIndex = position;
      this.userInfo.major = this.majorList[position].choiceItemContent;
      this.saveUserInfo();
      this.updateContextInfo();
    },
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onSchoolSearch(keyword = null) {
      common_vendor.index.__f__("log", "at pages/AI/AI.uvue:341", "学校搜索:", keyword);
    },
    /**
     * @description 切换对话模式
     * @param {String} mode - 对话模式
     */
    switchMode(mode = null) {
      if (this.currentMode === mode)
        return null;
      this.currentMode = mode;
      this.updateContextInfo();
      let modeName = "通用";
      if (mode === CHAT_MODE.SCHOOL) {
        modeName = "择校";
      } else if (mode === CHAT_MODE.CAREER) {
        modeName = "职业规划";
      }
      this.addSystemMessage(`已切换到${modeName}模式`);
    },
    /**
     * @description 更新对话上下文信息
     */
    updateContextInfo() {
      this.contextInfo = new UTSJSONObject({
        mode: this.currentMode,
        userSchool: this.userInfo.school || "",
        userMajor: this.userInfo.major || ""
      });
    },
    /**
     * @description 添加系统消息
     * @param {String} content - 消息内容
     */
    addSystemMessage(content = null) {
      this.messages.push({
        type: MESSAGE_TYPE.SYSTEM,
        content,
        status: MESSAGE_STATUS.SENT
      });
      this.scrollToBottom();
    },
    /**
     * @description 发送消息
     */
    sendMessage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!this.inputValue.trim() || this.isProcessing) {
          return Promise.resolve(null);
        }
        const messageContent = this.inputValue.trim();
        this.inputValue = "";
        this.messages.length;
        this.messages.push({
          type: MESSAGE_TYPE.USER,
          content: messageContent,
          status: MESSAGE_STATUS.SENT
        });
        const aiMessageIndex = this.messages.length;
        this.messages.push({
          type: MESSAGE_TYPE.AI,
          content: "",
          status: MESSAGE_STATUS.SENDING,
          streaming: true
        });
        this.scrollToBottom();
        this.isProcessing = true;
        try {
          this.updateContextInfo();
          const params = new UTSJSONObject({
            message: messageContent,
            context: this.contextInfo,
            history: this.getMessageHistory()
          });
          this.abortCurrentRequest();
          let controller = null;
          this.currentController = controller;
          let signal = null;
          yield this.sendStreamRequest(params, aiMessageIndex, signal);
          this.updateMessageStatus(aiMessageIndex, MESSAGE_STATUS.SENT);
          this.messages[aiMessageIndex].streaming = false;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/AI/AI.uvue:460", "发送消息失败:", error);
          if (error.name === "AbortError") {
            common_vendor.index.__f__("log", "at pages/AI/AI.uvue:464", "请求被用户取消");
            this.messages.splice(aiMessageIndex, 1);
          } else {
            this.updateMessageStatus(aiMessageIndex, MESSAGE_STATUS.ERROR);
            this.messages[aiMessageIndex].streaming = false;
            this.messages[aiMessageIndex].content = error.message || "获取回复失败，请重试";
          }
        } finally {
          this.isProcessing = false;
          this.currentController = null;
        }
      });
    },
    /**
     * @description 发送流式请求并处理响应
     * @param {Object} params - 请求参数
     * @param {Number} messageIndex - 消息索引
     * @param {AbortSignal} signal - 中断信号
     */
    sendStreamRequest(params = null, messageIndex = null, signal = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield api_API.sendChatMessage(params, (chunk = null) => {
            if (chunk && typeof chunk === "string") {
              this.messages[messageIndex].content += chunk;
            }
            this.scrollToBottom();
          }, signal);
        } catch (error) {
          throw error;
        }
      });
    },
    /**
     * @description 重试发送失败的消息
     * @param {Number} index - 消息索引
     */
    retryMessage(index = null) {
      if (index < 1 || this.messages[index].type !== MESSAGE_TYPE.AI) {
        return null;
      }
      const userMessage = this.messages[index - 1];
      if (userMessage.type !== MESSAGE_TYPE.USER) {
        return null;
      }
      this.updateMessageStatus(index, MESSAGE_STATUS.SENDING);
      this.messages[index].content = "";
      this.messages[index].streaming = true;
      this.isProcessing = true;
      this.abortCurrentRequest();
      let controller = null;
      this.currentController = controller;
      const params = new UTSJSONObject({
        message: userMessage.content,
        context: this.contextInfo,
        history: this.getMessageHistory(index - 1)
        // 获取到失败消息之前的历史
      });
      let signal = null;
      this.sendStreamRequest(params, index, signal).then(() => {
        this.updateMessageStatus(index, MESSAGE_STATUS.SENT);
        this.messages[index].streaming = false;
      }).catch((error = null) => {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:559", "重试发送消息失败:", error);
        if (error.name === "AbortError") {
          common_vendor.index.__f__("log", "at pages/AI/AI.uvue:563", "重试请求被用户取消");
        } else {
          this.updateMessageStatus(index, MESSAGE_STATUS.ERROR);
          this.messages[index].content = error.message || "获取回复失败，请重试";
        }
      }).finally(() => {
        this.isProcessing = false;
        this.currentController = null;
      });
    },
    /**
     * @description 中断当前请求
     */
    abortCurrentRequest() {
      if (this.currentController) {
        this.currentController = null;
      }
    },
    /**
     * @description 更新消息状态
     * @param {Number} index - 消息索引
     * @param {String} status - 新状态
     */
    updateMessageStatus(index = null, status = null) {
      if (index >= 0 && index < this.messages.length) {
        this.messages[index].status = status;
      }
    },
    /**
     * @description 获取消息历史用于发送到API
     * @param {Number} [limit] - 可选，限制历史消息的数量
     * @returns {Array} 消息历史数组
     */
    getMessageHistory(limit = null) {
      let history = this.messages.filter((msg) => {
        return msg.type === MESSAGE_TYPE.USER || msg.type === MESSAGE_TYPE.AI && msg.status === MESSAGE_STATUS.SENT;
      });
      if (typeof limit === "number" && limit >= 0 && limit < history.length) {
        history = history.slice(0, limit);
      }
      return history.map((msg) => {
        return new UTSJSONObject({
          role: msg.type === MESSAGE_TYPE.USER ? "user" : "assistant",
          content: msg.content
        });
      });
    },
    /**
     * @description 滚动到底部
     */
    scrollToBottom() {
      if (!this.isAutoScrollEnabled)
        return null;
      if (this.messages.length > 0) {
        this.autoScrollId = "msg-" + (this.messages.length - 1);
      }
    },
    /**
     * @description 处理滚动到顶部事件（加载更多历史消息）
     */
    onScrollToUpper(e = null) {
      common_vendor.index.__f__("log", "at pages/AI/AI.uvue:639", "滚动到顶部");
    },
    /**
     * @description 处理滚动事件（用于控制是否启用自动滚动）
     */
    onScroll(e = null) {
    },
    /**
     * @description 显示提示
     * @param {String} message - 提示信息
     */
    showToast(message = null) {
      common_vendor.index.showToast({
        title: message,
        icon: "none",
        duration: 2e3
      });
    },
    /**
     * @description 显示加载提示
     * @param {String} [text] - 加载提示文本
     */
    showLoading(text = "正在加载...") {
      this.loadingText = text;
      this.isFullLoading = true;
    },
    /**
     * @description 隐藏加载提示
     */
    hideLoading() {
      this.isFullLoading = false;
    }
  }
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  _component_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onSchoolClick),
    b: common_vendor.o($options.onSchoolSearch),
    c: common_vendor.p({
      defaultText: "请选择学校",
      choiceIndex: $data.schoolIndex,
      choiceList: $data.schoolList,
      mode: "search",
      searchPlaceholder: "搜索学校"
    }),
    d: common_vendor.o($options.onMajorClick),
    e: common_vendor.p({
      defaultText: "请选择专业",
      choiceIndex: $data.majorIndex,
      choiceList: $data.majorList
    }),
    f: common_vendor.o(() => {
    }),
    g: $data.messages.length === 0
  }, $data.messages.length === 0 ? {} : {
    h: common_vendor.f($data.messages, (msg, index, i0) => {
      return common_vendor.e({
        a: msg.type === "ai"
      }, msg.type === "ai" ? {} : {}, {
        b: common_vendor.t(msg.content),
        c: msg.status === "sending"
      }, msg.status === "sending" ? {} : {}, {
        d: msg.status === "error"
      }, msg.status === "error" ? {
        e: common_vendor.o(($event) => $options.retryMessage(index), index)
      } : {}, {
        f: common_vendor.sei("msg-" + index, "view"),
        g: index,
        h: common_vendor.n(msg.type),
        i: common_vendor.n({
          "streaming": msg.streaming
        })
      });
    })
  }, {
    i: common_vendor.sei("r0-be726fe0", "scroll-view", "messageScroll"),
    j: $data.autoScrollId,
    k: common_vendor.o((...args) => $options.onScrollToUpper && $options.onScrollToUpper(...args)),
    l: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    m: $data.currentMode === "general" ? 1 : "",
    n: common_vendor.o(($event) => $options.switchMode("general")),
    o: $data.currentMode === "school" ? 1 : "",
    p: common_vendor.o(($event) => $options.switchMode("school")),
    q: $data.currentMode === "career" ? 1 : "",
    r: common_vendor.o(($event) => $options.switchMode("career")),
    s: $data.isProcessing,
    t: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    v: $data.inputValue,
    w: common_vendor.o(($event) => $data.inputValue = $event.detail.value),
    x: common_vendor.t($data.isProcessing ? "请稍候" : "发送"),
    y: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    z: $data.isProcessing || !$data.inputValue.trim(),
    A: $data.isFullLoading
  }, $data.isFullLoading ? {
    B: common_vendor.t($data.loadingText)
  } : {}, {
    C: common_vendor.sei(_ctx.virtualHostId, "view"),
    D: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
