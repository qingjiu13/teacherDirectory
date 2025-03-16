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
      activeDropdown: "",
      selectedSchool: "",
      selectedMajor: "",
      selectedSort: "综合排序",
      schools: ["北京大学", "清华大学", "复旦大学", "浙江大学", "南京大学"],
      majors: ["计算机科学", "软件工程", "数学", "物理", "化学", "生物"],
      // 环境检测
      isWebEnv: true,
      // 加载状态
      isLoading: false,
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
      ],
      showTeacherDetail: false,
      currentTeacher: null,
      activeTab: "chat",
      isMatching: false,
      matchingTime: 60,
      showCancelButton: true,
      matchingTimer: null
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
              common_vendor.index.__f__("error", "at pages/match/match.uvue:263", "分数排序异常:", error);
              return 0;
            }
          });
        } else {
          result.sort((a, b) => {
            return a.id - b.id;
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/match/match.uvue:273", "筛选处理异常:", error);
        return this.teachers;
      }
      return result;
    }
  },
  // 确保此页面能被正确路由
  onReady() {
    common_vendor.index.__f__("log", "at pages/match/match.uvue:283", "Match page ready");
    this.initFilterData();
    this.detectEnvironment();
    common_vendor.index.__f__("log", "at pages/match/match.uvue:290", "初始下拉菜单状态:", this.activeDropdown);
  },
  // 页面显示时添加点击事件监听
  onShow() {
    setTimeout(() => {
      if (this.isWebEnv) {
        document.removeEventListener("click", this.handleGlobalClick);
        document.addEventListener("click", this.handleGlobalClick);
        common_vendor.index.__f__("log", "at pages/match/match.uvue:302", "全局点击事件监听已添加");
      }
    }, 200);
  },
  // 页面隐藏时移除点击事件监听
  onHide() {
    if (this.isWebEnv) {
      document.removeEventListener("click", this.handleGlobalClick);
      common_vendor.index.__f__("log", "at pages/match/match.uvue:311", "全局点击事件监听已移除");
    }
  },
  // 页面卸载时移除点击事件监听
  onUnload() {
    if (this.isWebEnv) {
      document.removeEventListener("click", this.handleGlobalClick);
    }
  },
  watch: {
    /**
     * @description 监听筛选条件变化
     */
    selectedSchool() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:326", "学校变更为:", this.selectedSchool);
    },
    selectedMajor() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:330", "专业变更为:", this.selectedMajor);
    },
    selectedSort() {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:333", "排序方式变更为:", this.selectedSort);
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
        common_vendor.index.__f__("log", "at pages/match/match.uvue:348", "当前环境:", systemInfo);
        if (systemInfo.uniPlatform === "app") {
          this.isWebEnv = false;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/match/match.uvue:355", "环境检测失败:", e);
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
      common_vendor.index.__f__("log", "at pages/match/match.uvue:378", "初始化筛选数据完成:", new UTSJSONObject({
        schools: this.schools,
        majors: this.majors,
        selectedSchool: this.selectedSchool,
        selectedMajor: this.selectedMajor
      }));
    },
    /**
     * @description 处理全局点击事件，用于关闭下拉菜单
     * @param {Event} event - 点击事件对象
     */
    handleGlobalClick(event = null) {
      if (!this.activeDropdown) {
        return null;
      }
      try {
        const target = event.target;
        let isFilterItemOrDropdown = false;
        let currentElement = target;
        while (currentElement && currentElement !== document.body) {
          if (currentElement.classList) {
            if (currentElement.classList.contains("filter-item") || currentElement.classList.contains("dropdown-menu") || currentElement.classList.contains("dropdown-item")) {
              isFilterItemOrDropdown = true;
              break;
            }
          }
          currentElement = currentElement.parentElement;
        }
        if (!isFilterItemOrDropdown) {
          common_vendor.index.__f__("log", "at pages/match/match.uvue:417", "点击了筛选区域外部，关闭所有下拉菜单");
          this.closeAllDropdowns();
        } else {
          common_vendor.index.__f__("log", "at pages/match/match.uvue:420", "点击了筛选或下拉菜单区域，保持菜单状态");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/match/match.uvue:423", "处理全局点击事件失败:", error);
        this.closeAllDropdowns();
      }
    },
    /**
     * @description 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack();
    },
    /**
     * @description 切换下拉菜单的显示状态
     * @param {String} dropdown - 下拉菜单的标识
     */
    toggleDropdown(dropdown = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:441", "切换下拉菜单:", dropdown, "当前状态:", this.activeDropdown);
      if (this.activeDropdown === dropdown) {
        this.activeDropdown = "";
        common_vendor.index.__f__("log", "at pages/match/match.uvue:447", "关闭下拉菜单:", dropdown);
      } else {
        this.activeDropdown = dropdown;
        common_vendor.index.__f__("log", "at pages/match/match.uvue:451", "打开下拉菜单:", dropdown);
      }
    },
    /**
     * @description 关闭所有下拉菜单
     */
    closeAllDropdowns() {
      this.activeDropdown = "";
    },
    /**
     * @description 从下拉菜单中选择项目
     * @param {String} type - 类型（school、major、sort）
     * @param {String} value - 选择的值
     */
    selectFromDropdown(type = null, value = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:468", `选择${type}:`, value);
      if (type === "school") {
        this.selectedSchool = value;
        try {
          common_vendor.index.setStorageSync("selectedSchool", value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:478", "保存学校选择失败", e);
        }
        common_vendor.index.__f__("log", "at pages/match/match.uvue:481", "已选择学校:", value);
      } else if (type === "major") {
        this.selectedMajor = value;
        try {
          common_vendor.index.setStorageSync("selectedMajor", value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:489", "保存专业选择失败", e);
        }
        common_vendor.index.__f__("log", "at pages/match/match.uvue:492", "已选择专业:", value);
      } else if (type === "sort") {
        this.selectedSort = value;
        try {
          common_vendor.index.setStorageSync("selectedSort", value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:500", "保存排序选择失败", e);
        }
        common_vendor.index.__f__("log", "at pages/match/match.uvue:503", "已选择排序方式:", value);
      }
      this.closeAllDropdowns();
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
          common_vendor.index.__f__("log", "at pages/match/match.uvue:524", `打开与老师${teacherId}的聊天窗口`);
          if (window.boxIM && typeof window.boxIM.openChat === "function") {
            window.boxIM.openChat(teacherId);
          } else {
            common_vendor.index.showToast({
              title: "正在打开聊天窗口",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/match/match.uvue:542", "打开聊天窗口失败:", error);
          common_vendor.index.showToast({
            title: "老师当前不在线，请稍后再试",
            icon: "none"
          });
        }
      }, 1e3);
    },
    /**
     * @description 显示选择弹出框
     * @param {String} type - 弹出框类型
     */
    showPickerPopup(type = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:556", "显示选择弹出框:", type);
      this.$refs[`${type}Popup`].open();
    },
    /**
     * @description 关闭弹出框
     * @param {String} type - 弹出框类型
     */
    closePopup(type = null) {
      common_vendor.index.__f__("log", "at pages/match/match.uvue:567", "关闭弹出框:", type);
      this.$refs[`${type}Popup`].close();
    },
    /**
     * @description 处理无匹配结果的情况
     */
    handleNoMatchResult() {
      common_vendor.index.showModal({
        title: "暂无精确匹配",
        content: "是否查看相关推荐？（同专业其他学校或相关专业）",
        confirmText: "查看推荐",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.getRelatedTeachers();
          } else {
            common_vendor.index.__f__("log", "at pages/match/match.uvue:589", "用户取消查看推荐");
          }
        }
      });
    },
    /**
     * @description 获取相关推荐教师
     */
    getRelatedTeachers() {
      this.isLoading = true;
      const params = new UTSJSONObject({
        major: this.selectedMajor || "",
        isRelated: true
        // 标记为相关推荐请求
      });
      common_vendor.index.request({
        url: "您的API地址/api/related-teachers",
        method: "GET",
        data: params,
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.teachers = res.data.teachers || [];
            if (this.teachers.length > 0) {
              common_vendor.index.showToast({
                title: "已显示相关推荐",
                icon: "none"
              });
            } else {
              this.startMatchingTimer();
            }
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    },
    /**
     * @description 开始匹配计时器
     */
    startMatchingTimer() {
      this.isMatching = true;
      this.matchingTime = 60;
      this.showCancelButton = true;
      this.matchingTimer = setInterval(() => {
        this.matchingTime--;
        if (this.matchingTime <= 0) {
          clearInterval(this.matchingTimer);
          this.showLongTermMatchingTip();
        }
      }, 1e3);
    },
    /**
     * @description 取消匹配
     */
    cancelMatching() {
      if (this.matchingTimer) {
        clearInterval(this.matchingTimer);
        this.matchingTimer = null;
      }
      this.isMatching = false;
      this.showCancelButton = false;
      common_vendor.index.showToast({
        title: "已取消匹配",
        icon: "none"
      });
    },
    /**
     * @description 显示长期匹配提示
     */
    showLongTermMatchingTip() {
      this.isMatching = false;
      common_vendor.index.showModal({
        title: "匹配超时",
        content: "我们将在后台继续为您匹配合适的老师，并提供优惠。是否继续等待？",
        confirmText: "继续等待",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.startLongTermMatching();
          } else {
            common_vendor.index.showToast({
              title: "已取消匹配",
              icon: "none"
            });
          }
        }
      });
    },
    /**
     * @description 开始后台长期匹配
     */
    startLongTermMatching() {
      common_vendor.index.request({
        url: "您的API地址/api/long-term-matching",
        method: "POST",
        data: new UTSJSONObject({
          school: this.selectedSchool,
          major: this.selectedMajor,
          userId: "当前用户ID"
          // 需要从全局状态或存储中获取
        }),
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({
              title: "已启动后台匹配",
              icon: "none"
            });
          }
        }
      });
    },
    /**
     * @description 打开教师详情弹窗
     * @param {Object} teacher - 教师对象
     */
    showTeacherDetailPopup(teacher = null) {
      this.currentTeacher = teacher;
      this.showTeacherDetail = true;
      this.activeTab = "chat";
    },
    /**
     * @description 关闭教师详情弹窗
     */
    closeTeacherDetail() {
      this.showTeacherDetail = false;
    },
    /**
     * @description 切换选项卡
     * @param {String} tab - 选项卡名称
     */
    switchTab(tab = null) {
      this.activeTab = tab;
    },
    /**
     * @description 开始聊天
     */
    startChat() {
      this.closeTeacherDetail();
      if (this.currentTeacher) {
        this.handleCommunicate(this.currentTeacher.id);
      }
    },
    /**
     * @description 查看教师完整主页
     */
    viewTeacherProfile() {
      if (this.currentTeacher) {
        common_vendor.index.navigateTo({
          url: `/pages/teacher/profile?id=${this.currentTeacher.id}`
        });
      }
    },
    /**
     * @description 监听滚动到底部
     */
    onReachBottom() {
      if (!this.isMatching && this.filteredTeachers.length > 0) {
        if (this.isAllLoaded) {
          common_vendor.index.showToast({
            title: "已经到底啦~",
            icon: "none"
          });
        } else {
          this.loadMoreTeachers();
        }
      }
    },
    /**
     * @description 加载更多教师数据
     */
    loadMoreTeachers() {
      if (this.isLoadingMore)
        return null;
      this.isLoadingMore = true;
      this.page++;
      const params = new UTSJSONObject({
        page: this.page,
        pageSize: this.pageSize,
        school: this.selectedSchool || "",
        major: this.selectedMajor || "",
        sortType: this.selectedSort || "综合排序"
      });
      common_vendor.index.request({
        url: "您的API地址/api/teachers",
        method: "GET",
        data: params,
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            const newTeachers = res.data.teachers || [];
            if (newTeachers.length > 0) {
              this.teachers = [...this.teachers, ...newTeachers];
            } else {
              this.isAllLoaded = true;
            }
          }
        },
        complete: () => {
          this.isLoadingMore = false;
        }
      });
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
    d: $data.activeDropdown === "school"
  }, $data.activeDropdown === "school" ? {
    e: common_vendor.f($data.schools, (school, index, i0) => {
      return {
        a: common_vendor.t(school),
        b: $data.selectedSchool === school ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.selectFromDropdown("school", school), index)
      };
    })
  } : {}, {
    f: $data.activeDropdown === "school" ? 1 : "",
    g: common_vendor.o(($event) => $options.toggleDropdown("school")),
    h: common_vendor.t($data.selectedMajor || "请选择专业"),
    i: $data.activeDropdown === "major"
  }, $data.activeDropdown === "major" ? {
    j: common_vendor.f($data.majors, (major, index, i0) => {
      return {
        a: common_vendor.t(major),
        b: $data.selectedMajor === major ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.selectFromDropdown("major", major), index)
      };
    })
  } : {}, {
    k: $data.activeDropdown === "major" ? 1 : "",
    l: common_vendor.o(($event) => $options.toggleDropdown("major")),
    m: common_vendor.t($data.selectedSort || "排序筛选"),
    n: $data.activeDropdown === "sort"
  }, $data.activeDropdown === "sort" ? {
    o: common_vendor.f(["综合排序", "评分排序"], (sort, index, i0) => {
      return {
        a: common_vendor.t(sort),
        b: $data.selectedSort === sort ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.selectFromDropdown("sort", sort), index)
      };
    })
  } : {}, {
    p: $data.activeDropdown === "sort" ? 1 : "",
    q: common_vendor.o(($event) => $options.toggleDropdown("sort")),
    r: common_vendor.f($options.filteredTeachers, (teacher, index, i0) => {
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
    s: $options.filteredTeachers.length === 0
  }, $options.filteredTeachers.length === 0 ? {} : {}, {
    t: common_vendor.sei("step2", "scroll-view"),
    v: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    w: $data.showTeacherDetail
  }, $data.showTeacherDetail ? common_vendor.e({
    x: common_vendor.o((...args) => $options.closeTeacherDetail && $options.closeTeacherDetail(...args)),
    y: $data.currentTeacher.avatar || "/static/image/default_avatar.png",
    z: common_vendor.t($data.currentTeacher.nickname),
    A: common_vendor.t($data.currentTeacher.title),
    B: common_vendor.t($data.currentTeacher.school),
    C: $data.activeTab === "chat" ? 1 : "",
    D: common_vendor.o(($event) => $options.switchTab("chat")),
    E: $data.activeTab === "profile" ? 1 : "",
    F: common_vendor.o(($event) => $options.switchTab("profile")),
    G: $data.activeTab === "chat"
  }, $data.activeTab === "chat" ? {
    H: common_vendor.o((...args) => $options.startChat && $options.startChat(...args))
  } : {}, {
    I: $data.activeTab === "profile"
  }, $data.activeTab === "profile" ? {
    J: common_vendor.t($data.currentTeacher.background || "暂无介绍"),
    K: common_vendor.t($data.currentTeacher.experience || "暂无介绍"),
    L: common_vendor.f($data.currentTeacher.expertise || [], (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    M: common_vendor.o((...args) => $options.viewTeacherProfile && $options.viewTeacherProfile(...args))
  } : {}) : {}, {
    N: $data.isMatching
  }, $data.isMatching ? {
    O: common_vendor.t($data.matchingTime),
    P: common_vendor.o((...args) => $options.cancelMatching && $options.cancelMatching(...args))
  } : {}, {
    Q: common_vendor.p({
      pageName: "none"
    }),
    R: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map
