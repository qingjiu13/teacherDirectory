"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const HistorySidebar = () => "../../components/ai-chat/HistorySidebar.js";
const MessageList = () => "../../components/ai-chat/MessageList.js";
const FilterSection = () => "../../components/ai-chat/FilterSection.js";
const ModeSelector = () => "../../components/ai-chat/ModeSelector.js";
const InputSection = () => "../../components/ai-chat/InputSection.js";
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
    choiceSelected,
    HistorySidebar,
    MessageList,
    FilterSection,
    ModeSelector,
    InputSection
  },
  computed: {
    // 从Vuex中获取状态
    testResult() {
      return store_index.store.getters["aiChat/testResult"];
    },
    isTesting() {
      return store_index.store.getters["aiChat/isTesting"];
    },
    isLoading() {
      return store_index.store.getters["aiChat/isLoading"];
    },
    // 历史会话摘要
    historySummaries() {
      return store_index.store.getters["aiChat/historySummaries"] || [];
    },
    // 历史会话
    historyChats() {
      return store_index.store.getters["aiChat/historyChats"] || [];
    },
    // 当前选择的学校名称
    currentSchool() {
      return this.schoolIndex >= 0 ? this.schoolList[this.schoolIndex].choiceItemContent : "";
    },
    // 当前选择的专业名称
    currentMajor() {
      return this.majorIndex >= 0 ? this.majorList[this.majorIndex].choiceItemContent : "";
    },
    // 获取当前模式名称
    currentModeName() {
      const modeNames = new UTSJSONObject({
        [CHAT_MODE.GENERAL]: "通用",
        [CHAT_MODE.SCHOOL]: "择校",
        [CHAT_MODE.CAREER]: "职业规划"
      });
      return modeNames[this.currentMode] || "通用";
    }
  },
  data() {
    return {
      // 用户基本信息
      userInfo: new UTSJSONObject({
        school: "",
        major: ""
      }),
      // 消息相关
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
      contextInfo: new UTSJSONObject({}),
      // 导航栏和侧边栏相关
      sidebarVisible: false,
      currentChatId: null
      // 当前会话ID
    };
  },
  watch: {
    // 监听historyChats变化
    historyChats: {
      handler(newVal = null) {
        if (newVal && newVal.length)
          ;
      },
      immediate: true
    }
  },
  onLoad() {
    this.getUserInfo();
    this.addSystemMessage("欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问");
    this.loadChatHistoryFromStorage();
  },
  onShow() {
    this.loadChatHistoryFromStorage();
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
     * @description 处理页面点击事件，用于关闭所有打开的下拉框
     */
    onPageClick() {
      if (this.$refs && this.$refs.filterSection) {
        this.$refs.filterSection.closeAllDropdowns();
      }
    },
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
          this.setUserSelectionIndexes();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:301", "获取用户信息失败:", e);
      }
    },
    /**
     * @description 根据用户信息设置学校和专业的索引
     */
    setUserSelectionIndexes() {
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
    },
    /**
     * @description 保存用户信息
     */
    saveUserInfo() {
      try {
        common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userInfo));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:335", "保存用户信息失败:", e);
        this.showToast("保存用户信息失败，可能影响后续对话");
      }
    },
    /**
     * @description 学校选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onSchoolClick(position = null) {
      this.schoolIndex = position;
      this.userInfo.school = this.currentSchool;
      this.saveUserInfo();
      this.updateContextInfo();
    },
    /**
     * @description 专业选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onMajorClick(position = null) {
      this.majorIndex = position;
      this.userInfo.major = this.currentMajor;
      this.saveUserInfo();
      this.updateContextInfo();
    },
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onSchoolSearch(keyword = null) {
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
      this.addSystemMessage(`已切换到${this.currentModeName}模式`);
    },
    /**
     * @description 更新对话上下文信息
     */
    updateContextInfo() {
      this.contextInfo = new UTSJSONObject({
        mode: this.currentMode,
        userSchool: this.currentSchool,
        userMajor: this.currentMajor
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
     * @description 开始新对话
     */
    startNewChat() {
      this.messages = [];
      this.currentChatId = "chat_" + Date.now();
      store_index.store.dispatch("aiChat/setCurrentChat", this.currentChatId);
      this.addSystemMessage("开始新对话，请输入您的问题");
      this.closeSidebar();
    },
    /**
     * @description 处理消息发送和重试的统一方法
     * @param {String} messageContent - 消息内容
     * @param {Number} [retryIndex] - 重试消息的索引，如果是新消息则为null
     */
    handleMessage(messageContent = null, retryIndex = null) {
      var _a;
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!messageContent || this.isProcessing)
          return Promise.resolve(null);
        let aiMessageIndex = null;
        if (retryIndex === null) {
          this.messages.length;
          this.messages.push({
            type: MESSAGE_TYPE.USER,
            content: messageContent,
            status: MESSAGE_STATUS.SENT
          });
          aiMessageIndex = this.messages.length;
          this.messages.push({
            type: MESSAGE_TYPE.AI,
            content: "",
            status: MESSAGE_STATUS.SENDING,
            streaming: false
          });
        } else {
          aiMessageIndex = retryIndex;
          this.messages[aiMessageIndex].content = "";
          this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENDING;
          this.messages[aiMessageIndex].streaming = false;
        }
        this.scrollToBottom();
        this.isProcessing = true;
        try {
          this.updateContextInfo();
          if (!this.currentChatId) {
            this.currentChatId = "chat_" + Date.now();
            store_index.store.dispatch("aiChat/setCurrentChat", this.currentChatId);
          }
          const response = yield store_index.store.dispatch("aiChat/testAIQA", new UTSJSONObject({
            question: messageContent,
            contextInfo: this.contextInfo,
            chatId: this.currentChatId
          }));
          if (response.success) {
            this.messages[aiMessageIndex].content = response.data;
            this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENT;
            this.saveChatHistory();
          } else {
            this.messages[aiMessageIndex].content = ((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || response.message || "获取回复失败";
            this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
          }
        } catch (error) {
          this.messages[aiMessageIndex].content = "与服务器通信异常";
          this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
        } finally {
          this.isProcessing = false;
          this.messages[aiMessageIndex].streaming = false;
          this.scrollToBottom();
        }
      });
    },
    /**
     * @description 发送消息
     * @param {String} messageContent - 消息内容
     */
    sendMessage(messageContent = null) {
      this.handleMessage(messageContent);
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
      this.handleMessage(userMessage.content, index);
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
     * @description 处理滚动到顶部事件
     */
    onScrollToUpper(e = null) {
    },
    /**
     * @description 处理滚动事件
     */
    onScroll(e = null) {
    },
    /**
     * @description 显示提示
     * @param {String} message - 提示信息
     * @param {String} [icon='none'] - 提示图标
     * @param {Number} [duration=2000] - 提示持续时间
     */
    showToast(message = null, icon = "none", duration = 2e3) {
      common_vendor.index.showToast({
        title: message,
        icon,
        duration
      });
    },
    /**
     * @description 显示/隐藏加载提示
     * @param {String|Boolean} text - 加载提示文本，如果为false则隐藏
     */
    toggleLoading(text = "正在加载...") {
      if (text === false) {
        this.isFullLoading = false;
      } else {
        this.loadingText = text;
        this.isFullLoading = true;
      }
    },
    // 侧边栏相关方法
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    closeSidebar() {
      this.sidebarVisible = false;
    },
    /**
     * @description 加载指定的聊天历史
     * @param {String} chatId - 聊天历史ID
     */
    loadChatHistory(chatId = null) {
      if (!chatId)
        return null;
      try {
        this.toggleLoading("正在加载对话内容...");
        store_index.store.dispatch("aiChat/loadChat", chatId).then((response = null) => {
          if (response.success) {
            this.currentChatId = chatId;
            this.messages = response.data.messages || [];
            this.closeSidebar();
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          } else {
            this.showToast("加载对话内容失败");
          }
        }).finally(() => {
          this.toggleLoading(false);
        });
      } catch (error) {
        this.showToast("加载对话内容失败");
        this.toggleLoading(false);
      }
    },
    /**
     * @description 从Vuex加载历史会话摘要
     */
    loadChatHistoryFromStorage() {
      store_index.store.dispatch("aiChat/getHistoryChats");
    },
    /**
     * @description 保存聊天历史摘要到Vuex
     */
    saveChatHistory() {
      if (!this.currentChatId || this.messages.length === 0)
        return null;
      const firstUserMessage = UTS.arrayFind(this.messages, (msg) => {
        return msg.type === MESSAGE_TYPE.USER;
      });
      const title = firstUserMessage ? firstUserMessage.content.substring(0, 20) : "新对话";
      const chatData = new UTSJSONObject({
        id: this.currentChatId,
        title: title + (title.length >= 20 ? "..." : ""),
        // 完整消息内容由后端存储，客户端只保存摘要信息
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      store_index.store.dispatch("aiChat/saveChat", chatData);
    },
    /**
     * @description 删除历史记录
     * @param {String} chatId - 历史记录ID
     */
    deleteChatHistory(chatId = null) {
      if (!chatId) {
        common_vendor.index.__f__("error", "at pages/AI/AI.uvue:667", "删除历史记录失败: 无效的chatId");
        this.showToast("删除失败: 无效的记录ID");
        return null;
      }
      common_vendor.index.__f__("log", "at pages/AI/AI.uvue:672", "请求删除历史记录:", chatId);
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条对话记录吗？",
        success: (res) => {
          if (res.confirm) {
            store_index.store.dispatch("aiChat/deleteChat", chatId).then((response = null) => {
              if (response.success) {
                if (this.currentChatId === chatId) {
                  this.startNewChat();
                }
                this.showToast("删除成功");
              } else {
                common_vendor.index.__f__("error", "at pages/AI/AI.uvue:689", "删除失败:", response.message || "未知错误");
                this.showToast(response.message || "删除失败");
              }
            }).catch((error = null) => {
              common_vendor.index.__f__("error", "at pages/AI/AI.uvue:693", "删除过程发生异常:", error);
              this.showToast("删除失败: " + (error.message || "系统错误"));
            });
          }
        }
      });
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
if (!Array) {
  const _easycom_history_sidebar2 = common_vendor.resolveComponent("history-sidebar");
  const _easycom_filter_section2 = common_vendor.resolveComponent("filter-section");
  const _easycom_message_list2 = common_vendor.resolveComponent("message-list");
  const _easycom_mode_selector2 = common_vendor.resolveComponent("mode-selector");
  const _easycom_input_section2 = common_vendor.resolveComponent("input-section");
  (_easycom_history_sidebar2 + _easycom_filter_section2 + _easycom_message_list2 + _easycom_mode_selector2 + _easycom_input_section2)();
}
const _easycom_history_sidebar = () => "../../components/ai-chat/HistorySidebar2.js";
const _easycom_filter_section = () => "../../components/ai-chat/FilterSection2.js";
const _easycom_message_list = () => "../../components/ai-chat/MessageList2.js";
const _easycom_mode_selector = () => "../../components/ai-chat/ModeSelector2.js";
const _easycom_input_section = () => "../../components/ai-chat/InputSection2.js";
if (!Math) {
  (_easycom_history_sidebar + _easycom_filter_section + _easycom_message_list + _easycom_mode_selector + _easycom_input_section)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.sidebarVisible
  }, $data.sidebarVisible ? {
    b: common_vendor.o((...args) => $options.closeSidebar && $options.closeSidebar(...args)),
    c: $data.sidebarVisible ? 0.5 : 0
  } : {}, {
    d: common_vendor.o($options.loadChatHistory),
    e: common_vendor.o($options.deleteChatHistory),
    f: common_vendor.p({
      visible: $data.sidebarVisible,
      ["history-summaries"]: $options.historySummaries,
      ["current-chat-id"]: $data.currentChatId
    }),
    g: common_vendor.o((...args) => $options.toggleSidebar && $options.toggleSidebar(...args)),
    h: common_vendor.o((...args) => $options.startNewChat && $options.startNewChat(...args)),
    i: common_vendor.sr("filterSection", "be726fe0-1"),
    j: common_vendor.o($options.onSchoolClick),
    k: common_vendor.o($options.onMajorClick),
    l: common_vendor.o($options.onSchoolSearch),
    m: common_vendor.p({
      ["school-index"]: $data.schoolIndex,
      ["school-list"]: $data.schoolList,
      ["major-index"]: $data.majorIndex,
      ["major-list"]: $data.majorList
    }),
    n: common_vendor.sr("messageList", "be726fe0-2"),
    o: common_vendor.o($options.onScrollToUpper),
    p: common_vendor.o($options.onScroll),
    q: common_vendor.o($options.retryMessage),
    r: common_vendor.o(($event) => $data.autoScrollId = $event),
    s: common_vendor.p({
      messages: $data.messages,
      ["auto-scroll-id"]: $data.autoScrollId
    }),
    t: common_vendor.o($options.switchMode),
    v: common_vendor.p({
      ["current-mode"]: $data.currentMode
    }),
    w: common_vendor.o($options.sendMessage),
    x: common_vendor.p({
      ["is-processing"]: $data.isProcessing
    }),
    y: $data.sidebarVisible ? 1 : "",
    z: $data.isFullLoading
  }, $data.isFullLoading ? {
    A: common_vendor.t($data.loadingText)
  } : {}, {
    B: common_vendor.sei(_ctx.virtualHostId, "view"),
    C: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
