"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
const ____ = require("../../本科专业.js");
const components_combobox_undergraduate = require("../../components/combobox/undergraduate.js");
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
    HistorySidebar,
    MessageList,
    FilterSection,
    ModeSelector,
    InputSection
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState("user/aiChat", new UTSJSONObject({
    storeHistorySummaries: (state = null) => {
      return state.aiChat.historySummaries;
    },
    storeHistoryChats: (state = null) => {
      return state.aiChat.conversations;
    },
    storeActiveConversation: (state = null) => {
      return state.aiChat.activeConversation;
    },
    storeChatMode: (state = null) => {
      return state.aiChat.chatMode;
    }
  }))), {
    // 当前选择的学校和专业
    currentSchool() {
      return this.schoolIndex >= 0 ? this.schoolList[this.schoolIndex] : "";
    },
    currentMajor() {
      return this.majorIndex >= 0 ? this.majorList[this.majorIndex].choiceItemContent : "";
    },
    // 当前模式名称
    currentModeName() {
      const modeNames = new UTSJSONObject({
        [CHAT_MODE.GENERAL]: "通用",
        [CHAT_MODE.SCHOOL]: "择校",
        [CHAT_MODE.CAREER]: "职业规划"
      });
      return modeNames[this.currentMode] || "通用";
    },
    // 兼容计算属性
    historySummaries() {
      return this.storeHistorySummaries;
    },
    historyChats() {
      return this.storeHistoryChats || [];
    },
    activeConversation() {
      return this.storeActiveConversation;
    },
    chatMode() {
      return this.storeChatMode;
    },
    // 筛选后的学校列表
    filteredSchoolList() {
      return this.schoolDataModule.getters.filteredData(this.schoolDataModule.state);
    }
  }),
  data() {
    return {
      // 用户信息
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
      // 学校和专业选择
      schoolIndex: -1,
      majorIndex: -1,
      schoolList: [],
      majorList: [],
      // 搜索相关
      schoolDataModule: null,
      majorDataModule: null,
      // 滚动相关
      isAutoScrollEnabled: true,
      // 当前会话控制器
      currentController: null,
      // 上下文信息
      contextInfo: new UTSJSONObject({}),
      // 导航栏和侧边栏
      sidebarVisible: false,
      currentChatId: null
    };
  },
  watch: {
    // 监听activeConversation的变化
    storeActiveConversation: {
      handler(newVal = null) {
        if (newVal && typeof newVal === "object" && newVal.chatId) {
          this.currentChatId = newVal.chatId;
          if (newVal.chatMode) {
            this.currentMode = newVal.chatMode;
          }
        } else if (newVal) {
          this.currentChatId = newVal;
        }
      },
      immediate: true
    }
  },
  onLoad() {
    this.loadUniversityData();
    this.getUserInfo();
    this.addSystemMessage("欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问");
    this.loadChatHistoryFromStorage();
  },
  onShow() {
    this.loadChatHistoryFromStorage();
  },
  onUnload() {
    this.abortCurrentRequest();
    this.clearUserSelections();
  },
  methods: {
    /**
     * @description 从JSON文件加载大学数据
     */
    loadUniversityData() {
      try {
        const universities = ____.schoolData || [];
        this.schoolList = universities;
        this.schoolDataModule = components_combobox_undergraduate.createDataModule(universities);
        this.schoolDataModule.mutations.initFuse(this.schoolDataModule.state);
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:272", "专业数据类型:", typeof ____.majorData);
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:273", "专业数据示例:", Array.isArray(____.majorData) ? ____.majorData.slice(0, 3) : ____.majorData);
        const majors = Array.isArray(____.majorData) ? ____.majorData : [];
        this.majorList = majors.map((majorName) => {
          return new UTSJSONObject({
            choiceItemId: String(majorName).replace(/\s+/g, "").toLowerCase(),
            choiceItemContent: String(majorName)
          });
        });
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:286", "处理后的专业列表:", this.majorList.slice(0, 3));
        const majorNames = this.majorList.map((item) => {
          return item.choiceItemContent;
        });
        this.majorDataModule = components_combobox_undergraduate.createDataModule(majorNames);
        this.majorDataModule.mutations.initFuse(this.majorDataModule.state);
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:293", "加载大学数据成功，共", universities.length, "所学校");
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:294", "加载专业数据成功，共", this.majorList.length, "个专业");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:296", "加载数据失败:", error);
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:297", "错误详情:", error.message, error.stack);
        if (!this.schoolDataModule) {
          this.schoolDataModule = components_combobox_undergraduate.createDataModule(this.schoolList);
          this.schoolDataModule.mutations.initFuse(this.schoolDataModule.state);
        }
        if (!this.majorDataModule) {
          const majorNames = this.majorList.map((item) => {
            return item.choiceItemContent;
          });
          this.majorDataModule = components_combobox_undergraduate.createDataModule(majorNames);
          this.majorDataModule.mutations.initFuse(this.majorDataModule.state);
        }
      }
    },
    /**
     * @description 处理页面点击事件，关闭下拉框
     */
    onPageClick() {
      setTimeout(() => {
        if (this.$refs && this.$refs.filterSection) {
          this.$refs.filterSection.closeAllDropdowns();
        }
      }, 10);
    },
    /**
     * @description 获取用户信息
     */
    getUserInfo() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          let parsedInfo = null;
          if (typeof userInfo === "object" && userInfo !== null) {
            parsedInfo = userInfo;
          } else {
            try {
              parsedInfo = UTS.JSON.parse(userInfo);
            } catch (parseError) {
              parsedInfo = new UTSJSONObject({ school: "", major: "" });
            }
          }
          this.userInfo = parsedInfo;
          this.setUserSelectionIndexes();
        }
      } catch (e) {
        this.userInfo = { school: "", major: "" };
      }
    },
    /**
     * @description 根据用户信息设置学校和专业索引
     */
    setUserSelectionIndexes() {
      if (!this.userInfo || typeof this.userInfo !== "object") {
        this.userInfo = { school: "", major: "" };
        return null;
      }
      if (this.userInfo.school) {
        const schoolIndex = this.schoolList.indexOf(this.userInfo.school);
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
        if (!this.userInfo || typeof this.userInfo !== "object") {
          this.userInfo = { school: "", major: "" };
        }
        common_vendor.index.setStorageSync("userInfo", UTS.JSON.stringify(this.userInfo));
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:389", "保存用户信息失败:", e);
      }
    },
    /**
     * @description 学校选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onSchoolClick(position = null) {
      if (position >= 0 && position < this.schoolList.length) {
        this.schoolIndex = position;
        this.userInfo.school = this.currentSchool;
        this.saveUserInfo();
        this.updateContextInfo();
      } else {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:405", "无效的学校选择位置:", position);
      }
    },
    /**
     * @description 专业选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onMajorClick(position = null) {
      if (position >= 0 && position < this.majorList.length) {
        this.majorIndex = position;
        this.userInfo.major = this.currentMajor;
        this.saveUserInfo();
        this.updateContextInfo();
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:422", "已选择专业:", this.currentMajor);
      } else {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:424", "无效的专业选择位置:", position);
      }
    },
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onSchoolSearch(keyword = null) {
      if (this.schoolDataModule) {
        this.schoolDataModule.mutations.setFilterKeyword(this.schoolDataModule.state, keyword);
        this.schoolList = this.filteredSchoolList;
      }
    },
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onMajorSearch(keyword = null) {
      try {
        if (!this.majorDataModule) {
          common_vendor.index.__f__("error", "at pages/AI/AI.vue:450", "专业数据模块未初始化");
          return null;
        }
        this.majorDataModule.mutations.setFilterKeyword(this.majorDataModule.state, keyword);
        const filteredMajorNames = this.majorDataModule.getters.filteredData(this.majorDataModule.state);
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:465", "筛选后的专业数量:", filteredMajorNames.length);
        if (filteredMajorNames.length === 0 && keyword) {
          this.majorList = [
            {
              choiceItemId: keyword.replace(/\s+/g, "").toLowerCase(),
              choiceItemContent: keyword
            }
          ];
        } else {
          this.majorList = filteredMajorNames.map((majorName = null) => {
            return new UTSJSONObject({
              choiceItemId: majorName.replace(/\s+/g, "").toLowerCase(),
              choiceItemContent: majorName
            });
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:483", "专业搜索处理错误:", error);
      }
    },
    /**
     * @description 切换对话模式
     * @param {String} mode - 对话模式
     */
    switchMode(mode = null) {
      if (this.currentMode === mode)
        return null;
      this.currentMode = mode;
      this.messages = [];
      this.currentChatId = "chat_" + Date.now();
      this.updateContextInfo();
      this.$store.dispatch("user/aiChat/setCurrentChat", new UTSJSONObject({
        chatId: this.currentChatId,
        chatMode: this.currentMode
      }));
      this.closeSidebar();
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
      this.updateContextInfo();
      this.$store.dispatch("user/aiChat/setCurrentChat", new UTSJSONObject({
        chatId: this.currentChatId,
        chatMode: this.currentMode
      }));
      this.addSystemMessage("开始新对话，请输入您的问题");
      this.closeSidebar();
    },
    /**
     * @description 处理消息发送和重试
     * @param {String} messageContent - 消息内容
     * @param {Number} [retryIndex] - 重试消息的索引
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
            this.$store.dispatch("user/aiChat/setCurrentChat", new UTSJSONObject({
              chatId: this.currentChatId,
              chatMode: this.currentMode
            }));
          }
          const response = yield this.$store.dispatch("user/aiChat/testAIQA", new UTSJSONObject({
            question: messageContent,
            contextInfo: this.contextInfo,
            chatId: this.currentChatId,
            chatMode: this.currentMode
          }));
          if (response.success) {
            this.messages[aiMessageIndex].content = response.data;
            this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENT;
            this.saveChatHistory();
          } else {
            const errorMessage = ((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || response.message || "获取回复失败，请稍后重试";
            this.messages[aiMessageIndex].content = `抱歉，无法获取回复：${errorMessage}`;
            this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
            this.showToast(errorMessage, "none", 3e3);
          }
        } catch (error) {
          const errorMsg = error.message || "系统异常，请稍后再试";
          this.messages[aiMessageIndex].content = `抱歉，发生了错误：${errorMsg}`;
          this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
          this.showToast(errorMsg, "none", 3e3);
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
      if (this.currentController && this.currentController.abort) {
        this.currentController.abort();
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
        const conversations = this.historyChats || [];
        const conversation = conversations.find((chat = null) => {
          return chat.id === chatId;
        });
        if (conversation) {
          this.currentChatId = chatId;
          if (conversation.chatMode) {
            this.currentMode = conversation.chatMode;
            this.updateContextInfo();
          }
          const messages = conversation.messages ? conversation.messages.map((msg = null) => {
            let type = MESSAGE_TYPE.AI;
            if (msg.id.includes("msg-user")) {
              type = MESSAGE_TYPE.USER;
            } else if (msg.id.includes("msg-system")) {
              type = MESSAGE_TYPE.SYSTEM;
            }
            return new UTSJSONObject({
              type,
              content: msg.content,
              status: MESSAGE_STATUS.SENT,
              streaming: false
            });
          }) : [];
          this.messages = messages;
          this.closeSidebar();
          this.$nextTick(() => {
            this.scrollToBottom();
          });
          this.toggleLoading(false);
        } else {
          this.$store.dispatch("user/aiChat/loadChat", chatId).then((response = null) => {
            var _a, _b;
            if (response.success) {
              this.currentChatId = chatId;
              if (response.data.chatMode) {
                this.currentMode = response.data.chatMode;
                this.updateContextInfo();
              }
              this.messages = response.data.messages || [];
              this.closeSidebar();
              this.$nextTick(() => {
                this.scrollToBottom();
              });
            } else {
              const errorMsg = ((_a = response.error) === null || _a === void 0 ? void 0 : _a.message) || response.message || "加载对话失败";
              this.showToast(`加载失败: ${errorMsg}`, "none", 3e3);
              if (((_b = response.error) === null || _b === void 0 ? void 0 : _b.statusCode) >= 500) {
                this.startNewChat();
              }
            }
          }).finally(() => {
            this.toggleLoading(false);
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:797", "加载对话内容失败:", error);
        this.toggleLoading(false);
        this.startNewChat();
      }
    },
    /**
     * @description 从Vuex加载历史会话摘要
     */
    loadChatHistoryFromStorage() {
      const conversations = this.historyChats;
      if (conversations && conversations.length > 0) {
        const historySummaries = conversations.map((chat = null) => {
          return new UTSJSONObject({
            id: chat.id,
            title: chat.abstract,
            abstract: chat.abstract,
            chatMode: chat.chatMode,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
          });
        });
        this.$store.commit("user/aiChat/SET_HISTORY_SUMMARIES", historySummaries);
      }
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
        abstract: title,
        chatMode: this.currentMode,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        messages: this.messages.map((msg, index) => {
          return new UTSJSONObject({
            id: `msg-${msg.type === MESSAGE_TYPE.USER ? "user" : "ai"}-${this.currentChatId}-${index}`,
            content: msg.content,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        })
      });
      this.$store.commit("user/aiChat/ADD_CONVERSATION", chatData);
      const summaryData = new UTSJSONObject({
        id: chatData.id,
        title: chatData.title,
        abstract: chatData.abstract,
        chatMode: chatData.chatMode,
        createdAt: chatData.createdAt,
        updatedAt: chatData.updatedAt
      });
      this.$store.commit("user/aiChat/ADD_HISTORY_SUMMARY", summaryData);
    },
    /**
     * @description 删除历史记录
     * @param {String} chatId - 历史记录ID
     */
    deleteChatHistory(chatId = null) {
      if (!chatId)
        return null;
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认删除",
        content: "确定要删除这条对话记录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "正在删除...",
              mask: true
            });
            try {
              this.$store.commit("user/aiChat/REMOVE_CONVERSATION", chatId);
              this.$store.commit("user/aiChat/REMOVE_HISTORY_SUMMARY", chatId);
              common_vendor.index.hideLoading();
              if (this.currentChatId === chatId) {
                this.startNewChat();
              }
              this.showToast("删除成功");
            } catch (error) {
              common_vendor.index.hideLoading();
              this.showToast("删除失败: " + (error.message || "系统错误"), "none", 3e3);
            }
          }
        }
      }));
    },
    /**
     * @description 清除用户选择的学校和专业信息
     */
    clearUserSelections() {
      this.schoolIndex = -1;
      this.majorIndex = -1;
      this.userInfo = {
        school: "",
        major: ""
      };
      this.saveUserInfo();
      this.updateContextInfo();
      common_vendor.index.__f__("log", "at pages/AI/AI.vue:918", "已清除用户的学校和专业选择");
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
    i: common_vendor.sr("filterSection", "4e6adde4-1"),
    j: common_vendor.o($options.onSchoolClick),
    k: common_vendor.o($options.onMajorClick),
    l: common_vendor.o($options.onSchoolSearch),
    m: common_vendor.o($options.onMajorSearch),
    n: common_vendor.p({
      ["school-index"]: $data.schoolIndex,
      ["school-list"]: $data.schoolList,
      ["major-index"]: $data.majorIndex,
      ["major-list"]: $data.majorList
    }),
    o: common_vendor.sr("messageList", "4e6adde4-2"),
    p: common_vendor.o($options.retryMessage),
    q: common_vendor.o(($event) => $data.autoScrollId = $event),
    r: common_vendor.p({
      messages: $data.messages,
      ["auto-scroll-id"]: $data.autoScrollId
    }),
    s: common_vendor.o($options.switchMode),
    t: common_vendor.p({
      ["current-mode"]: $data.currentMode
    }),
    v: common_vendor.o($options.sendMessage),
    w: common_vendor.p({
      ["is-processing"]: $data.isProcessing
    }),
    x: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    y: $data.sidebarVisible ? 1 : "",
    z: $data.isFullLoading
  }, $data.isFullLoading ? {
    A: common_vendor.t($data.loadingText)
  } : {}, {
    B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    C: common_vendor.o((...args) => $options.onPageClick && $options.onPageClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
