"use strict";
const common_vendor = require("../../common/vendor.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      // 筛选相关数据
      selectedSchool: "",
      selectedMajor: "",
      selectedSort: "综合排序",
      schools: ["北京大学", "清华大学", "复旦大学", "浙江大学", "南京大学"],
      majors: ["计算机科学", "软件工程", "数学", "物理", "化学", "生物"],
      // 环境检测
      isWebEnv: true,
      // 加载状态
      isLoading: false,
      // 自动关闭定时器
      autoCloseTimer: null,
      // 老师数据
      teachers: [
        new UTSJSONObject({
          id: 1,
          nickname: "王教授",
          avatar: "/static/image/default_avatar.png",
          school: "北京大学",
          major: "计算机科学",
          title: "教授",
          score: "考研400分",
          tags: ["认证学校", "经验丰富"]
        }),
        new UTSJSONObject({
          id: 2,
          nickname: "李博士",
          avatar: "/static/image/default_avatar.png",
          school: "清华大学",
          major: "软件工程",
          title: "副教授",
          score: "考研390分",
          tags: ["认证学校", "教学认真"]
        }),
        new UTSJSONObject({
          id: 3,
          nickname: "张老师",
          avatar: "/static/image/default_avatar.png",
          school: "复旦大学",
          major: "数学",
          title: "讲师",
          score: "考研380分",
          tags: ["认证学校", "耐心细致"]
        }),
        new UTSJSONObject({
          id: 4,
          nickname: "刘教授",
          avatar: "/static/image/default_avatar.png",
          school: "浙江大学",
          major: "物理",
          title: "教授",
          score: "考研410分",
          tags: ["认证学校", "通俗易懂"]
        }),
        new UTSJSONObject({
          id: 5,
          nickname: "陈老师",
          avatar: "/static/image/default_avatar.png",
          school: "南京大学",
          major: "化学",
          title: "副教授",
          score: "考研385分",
          tags: ["认证学校", "答疑及时"]
        })
      ]
    };
  },
  computed: {
    /**
     * @description 根据筛选条件过滤老师列表
     * @return {Array} 过滤后的老师列表
     */
    filteredTeachers() {
      let result = [...this.teachers];
      try {
        if (this.selectedSchool) {
          result = result.filter((teacher) => {
            return teacher.school === this.selectedSchool;
          });
        }
        if (this.selectedMajor) {
          result = result.filter((teacher) => {
            return teacher.major === this.selectedMajor;
          });
        }
        if (this.selectedSort === "评分排序") {
          result.sort((a, b) => {
            try {
              const scoreA = parseInt(a.score.match(/\d+/)[0]);
              const scoreB = parseInt(b.score.match(/\d+/)[0]);
              return scoreB - scoreA;
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/match/match.uvue:176", "分数排序异常:", error);
              return 0;
            }
          });
        } else {
          result.sort((a, b) => {
            return a.id - b.id;
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/match/match.uvue:186", "筛选处理异常:", error);
        return this.teachers;
      }
      return result;
    }
  },
  // 页面加载时的处理
  onLoad() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:196", "Match page loaded");
    setTimeout(() => {
      this.detectEnvironment();
      this.setupGlobalClickListener();
    }, 300);
  },
  // 确保此页面能被正确路由
  onReady() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:206", "Match page ready");
    this.initFilterData();
    this.detectEnvironment();
    common_vendor.index.__f__("log", "at pages/match/match.uvue:213", "初始下拉菜单状态:", this.selectedSchool, this.selectedMajor, this.selectedSort);
  },
  // 页面显示时添加点击事件监听
  onShow() {
    setTimeout(() => {
      if (this.isWebEnv) {
        document.removeEventListener("click", this.handleGlobalClick);
        document.addEventListener("click", this.handleGlobalClick);
        common_vendor.index.__f__("log", "at pages/match/match.uvue:225", "全局点击事件监听已添加");
      }
    }, 200);
  },
  // 页面隐藏时移除点击事件监听
  onHide() {
    if (this.isWebEnv) {
      document.removeEventListener("click", this.handleGlobalClick);
      common_vendor.index.__f__("log", "at pages/match/match.uvue:234", "全局点击事件监听已移除");
    }
  },
  // 页面卸载时移除点击事件监听
  onUnload() {
    if (this.isWebEnv) {
      document.removeEventListener("click", this.handleGlobalClick);
    }
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  },
  watch: {
    /**
     * @description 监听筛选条件变化
     */
    selectedSchool() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:255", "学校变更为:", this.selectedSchool);
    },
    selectedMajor() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:259", "专业变更为:", this.selectedMajor);
    },
    selectedSort() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:262", "排序方式变更为:", this.selectedSort);
    }
  },
  methods: {
    /**
     * @description 检测当前运行环境
     */
    detectEnvironment() {
      try {
        this.isWebEnv = typeof document !== "undefined" && !!document.body;
        const systemInfo = common_vendor.index.getSystemInfoSync();
        common_vendor.index.__f__("log", "at pages/match/match.uvue:277", "当前环境:", systemInfo);
        if (systemInfo.uniPlatform === "app") {
          this.isWebEnv = false;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/match/match.uvue:284", "环境检测失败:", e);
        this.isWebEnv = false;
      }
    },
    /**
     * @description 初始化筛选数据
     */
    initFilterData() {
      const cachedSchool = common_vendor.index.getStorageSync("selectedSchool");
      const cachedMajor = common_vendor.index.getStorageSync("selectedMajor");
      const cachedSort = common_vendor.index.getStorageSync("selectedSort");
      if (cachedSchool)
        this.selectedSchool = cachedSchool;
      if (cachedMajor)
        this.selectedMajor = cachedMajor;
      if (cachedSort)
        this.selectedSort = cachedSort;
      common_vendor.index.__f__("log", "at pages/match/match.uvue:307", "初始化筛选数据完成:", new UTSJSONObject({
        schools: this.schools,
        majors: this.majors,
        selectedSchool: this.selectedSchool,
        selectedMajor: this.selectedMajor
      }));
    },
    /**
     * @description 设置全局点击监听器
     */
    setupGlobalClickListener() {
      if (!this.isWebEnv) {
        common_vendor.index.__f__("log", "at pages/match/match.uvue:321", "小程序环境：使用更简单的处理方式");
      } else {
        common_vendor.index.__f__("log", "at pages/match/match.uvue:328", "Web环境：使用document点击事件监听");
        try {
          document.removeEventListener("click", this.handleGlobalClick);
          document.addEventListener("click", this.handleGlobalClick);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:335", "添加点击监听失败:", e);
        }
      }
    },
    /**
     * @description 处理页面点击事件（小程序环境）
     */
    handlePageTap(event = null) {
      if (!this.selectedSchool && !this.selectedMajor && !this.selectedSort) {
        return null;
      }
      this.closeAllDropdowns();
      common_vendor.index.__f__("log", "at pages/match/match.uvue:351", "小程序环境：页面点击，关闭所有下拉菜单");
    },
    /**
     * @description 处理全局点击事件，用于关闭下拉菜单
     * @param {Event} event - 点击事件对象
     */
    handleGlobalClick(event = null) {
      if (!this.selectedSchool && !this.selectedMajor && !this.selectedSort) {
        return null;
      }
      const target = event.target;
      let isFilterItem = false;
      let isDropdownMenu = false;
      let currentElement = target;
      while (currentElement && currentElement !== document.body) {
        if (currentElement.classList) {
          if (currentElement.classList.contains("filter-item")) {
            isFilterItem = true;
            break;
          }
          if (currentElement.classList.contains("dropdown-menu")) {
            isDropdownMenu = true;
            break;
          }
        }
        currentElement = currentElement.parentElement;
      }
      if (!isFilterItem && !isDropdownMenu) {
        common_vendor.index.__f__("log", "at pages/match/match.uvue:389", "点击了筛选区域外部，关闭所有下拉菜单");
        this.closeAllDropdowns();
      } else {
        common_vendor.index.__f__("log", "at pages/match/match.uvue:392", "点击了筛选区域，保持菜单状态");
      }
    },
    /**
     * @description 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * @description 显示原生操作表单
     * @param {String} type - 操作表单类型
     */
    showNativeActionSheet(type = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:408", "显示选择操作表:", type);
      let itemList = [];
      let titleText = "";
      if (type === "school") {
        itemList = this.schools;
        titleText = "选择学校";
      } else if (type === "major") {
        itemList = this.majors;
        titleText = "选择专业";
      } else if (type === "sort") {
        itemList = ["综合排序", "评分排序"];
        titleText = "选择排序方式";
      }
      common_vendor.index.showActionSheet({
        title: titleText,
        itemList,
        success: (res) => {
          const selectedValue = itemList[res.tapIndex];
          common_vendor.index.__f__("log", "at pages/match/match.uvue:431", "用户选择了:", selectedValue);
          if (type === "school") {
            this.selectedSchool = selectedValue;
            try {
              common_vendor.index.setStorageSync("selectedSchool", selectedValue);
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/match/match.uvue:441", "保存学校选择失败", e);
            }
            common_vendor.index.__f__("log", "at pages/match/match.uvue:444", "已选择学校:", selectedValue);
          } else if (type === "major") {
            this.selectedMajor = selectedValue;
            try {
              common_vendor.index.setStorageSync("selectedMajor", selectedValue);
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/match/match.uvue:452", "保存专业选择失败", e);
            }
            common_vendor.index.__f__("log", "at pages/match/match.uvue:455", "已选择专业:", selectedValue);
          } else if (type === "sort") {
            this.selectedSort = selectedValue;
            try {
              common_vendor.index.setStorageSync("selectedSort", selectedValue);
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/match/match.uvue:463", "保存排序选择失败", e);
            }
            common_vendor.index.__f__("log", "at pages/match/match.uvue:466", "已选择排序方式:", selectedValue);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/match/match.uvue:470", "操作表单关闭:", err);
        }
      });
    },
    /**
     * @description 关闭所有下拉菜单
     */
    closeAllDropdowns() {
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }
      this.selectedSchool = "";
      this.selectedMajor = "";
      this.selectedSort = "综合排序";
    },
    /**
     * @description 处理"马上沟通"按钮点击
     * @param {Number} teacherId - 老师的ID
     */
    handleCommunicate(teacherId = null) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        try {
          common_vendor.index.__f__("log", "at pages/match/match.uvue:503", `打开与老师${teacherId}的聊天窗口`);
          if (window.boxIM && typeof window.boxIM.openChat === "function") {
            window.boxIM.openChat(teacherId);
          } else {
            common_vendor.index.showToast({
              title: "正在打开聊天窗口",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:521", "打开聊天窗口失败:", error);
          common_vendor.index.showToast({
            title: "老师当前不在线，请稍后再试",
            icon: "none"
          });
        }
      }, 1e3);
    }
  }
});
if (!Array) {
  const _easycom_tab_bar2 = common_vendor.resolveComponent("tab-bar");
  _easycom_tab_bar2();
}
const _easycom_tab_bar = () => "../../components/tab-bar/tab-bar.js";
if (!Math) {
  _easycom_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sei("step1", "view"),
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.selectedSchool || "请选择学校"),
    d: common_vendor.o(($event) => $options.showNativeActionSheet("school")),
    e: common_vendor.t($data.selectedMajor || "请选择专业"),
    f: common_vendor.o(($event) => $options.showNativeActionSheet("major")),
    g: common_vendor.t($data.selectedSort || "排序筛选"),
    h: common_vendor.o(($event) => $options.showNativeActionSheet("sort")),
    i: common_vendor.f($options.filteredTeachers, (teacher, index, i0) => {
      return {
        a: teacher.avatar || "/static/image/default_avatar.png",
        b: common_vendor.t(teacher.nickname),
        c: common_vendor.t(teacher.title || "教授"),
        d: common_vendor.t(teacher.major),
        e: common_vendor.t(teacher.score),
        f: common_vendor.f(teacher.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        }),
        g: common_vendor.o(($event) => $options.handleCommunicate(teacher.id), index),
        h: index
      };
    }),
    j: $options.filteredTeachers.length === 0
  }, $options.filteredTeachers.length === 0 ? {} : {}, {
    k: common_vendor.sei("step2", "scroll-view"),
    l: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    m: common_vendor.p({
      pageName: "none"
    }),
    n: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map
