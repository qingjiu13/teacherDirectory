"use strict";
const common_vendor = require("../../../common/vendor.js");
const topNavbar = () => "../../../components/top-navbar/top-navbar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    topNavbar
  },
  data() {
    return {
      currentTab: 0,
      teacherCurrentTab: 0,
      // 更具体的时间段选择
      timeSlots: [
        new UTSJSONObject({ period: "上午", slots: ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00"] }),
        new UTSJSONObject({ period: "下午", slots: ["13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"] }),
        new UTSJSONObject({ period: "晚上", slots: ["18:00-19:00", "19:00-20:00", "20:00-21:00"] })
      ],
      selectedTimeSlot: "",
      selectedTimePeriod: "",
      // 待预约课程数据 - 修改为考研相关课程
      pendingCourses: [
        new UTSJSONObject({
          id: 1,
          name: "考研政治精讲班",
          teacher: "王老师",
          time: "2023-12-15 14:00",
          price: 399,
          image: "/static/images/default_avatar.png",
          description: "系统讲解考研政治马原、毛中特、思修法基、当代世界经济与政治重点内容。"
        }),
        new UTSJSONObject({
          id: 2,
          name: "考研数学基础班",
          teacher: "李老师",
          time: "2023-12-16 10:00",
          price: 499,
          image: "/static/images/default_avatar.png",
          description: "覆盖高等数学、线性代数、概率论与数理统计核心知识点，夯实数学基础。"
        }),
        new UTSJSONObject({
          id: 3,
          name: "考研英语词汇班",
          teacher: "张老师",
          time: "2023-12-17 15:00",
          price: 349,
          image: "/static/images/default_avatar.png",
          description: "掌握考研英语必备5500词汇，提高阅读理解和写作能力。"
        }),
        new UTSJSONObject({
          id: 4,
          name: "计算机专业课辅导",
          teacher: "陈老师",
          time: "2023-12-18 19:00",
          price: 549,
          image: "/static/images/default_avatar.png",
          description: "针对计算机专业考生，讲解数据结构、操作系统、计算机网络等核心科目。"
        })
      ],
      // 已预约课程数据
      reservedCourses: [
        new UTSJSONObject({
          id: 5,
          name: "考研专业课强化班",
          teacher: "赵老师",
          price: 599,
          reservedTime: "2023-12-18 14:00",
          image: "/static/images/default_avatar.png",
          description: "针对专业课考试，深入讲解重点难点，提供真题分析和解题技巧。"
        }),
        new UTSJSONObject({
          id: 6,
          name: "考研政治冲刺班",
          teacher: "孙老师",
          price: 449,
          reservedTime: "2023-12-19 10:00",
          image: "/static/images/default_avatar.png",
          description: "考前政治热点分析，提供答题模板和背诵要点，助力考研政治高分。"
        })
      ],
      // 已完成课程数据
      completedCourses: [
        new UTSJSONObject({
          id: 7,
          name: "考研英语写作班",
          teacher: "黄老师",
          price: 399,
          completedTime: "2023-12-10 15:00",
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=5fcc0283-6d70-4b56-8710-5ef9318c475b&from=3"
        }),
        new UTSJSONObject({
          id: 8,
          name: "考研复试指导课",
          teacher: "周老师",
          price: 499,
          completedTime: "2023-12-15 09:00",
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=7e9f8d62-34a1-4b12-9f80-5c31d9b52ec8&from=3"
        })
      ],
      currentCourseIndex: null,
      selectedDate: null,
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      teacherPendingCourses: [],
      teacherActiveCourses: [],
      teacherCompletedCourses: []
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/mine/course/course.vue:298", "课程页面 onLoad", options);
    this.loadUserData();
    const globalData = getApp().globalData;
    const storedUserRole = common_vendor.index.getStorageSync("userRole");
    if (globalData && globalData.userRole) {
      this.userRole = globalData.userRole;
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:310", "使用全局角色状态:", this.userRole);
    } else if (storedUserRole) {
      this.userRole = storedUserRole;
      if (globalData) {
        globalData.userRole = this.userRole;
      }
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:319", "使用存储的角色:", this.userRole);
    }
    this.loadCourseData();
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/mine/course/course.vue:326", "课程页面 onShow, 当前角色:", this.userRole);
    const globalData = getApp().globalData;
    if (globalData && globalData.userRole && globalData.userRole !== this.userRole) {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:331", "全局角色变更:", globalData.userRole);
      const previousRole = this.userRole;
      this.userRole = globalData.userRole;
      if (previousRole !== this.userRole) {
        this.resetRoleRelatedState();
        common_vendor.index.setStorageSync("userRole", this.userRole);
        this.loadCourseData();
      }
    }
    const storedUserRole = common_vendor.index.getStorageSync("userRole");
    if (storedUserRole && storedUserRole !== this.userRole) {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:346", "存储角色与当前不一致, 存储:", storedUserRole, "当前:", this.userRole);
      const previousRole = this.userRole;
      this.userRole = storedUserRole;
      if (globalData) {
        globalData.userRole = this.userRole;
      }
      if (previousRole !== this.userRole) {
        this.resetRoleRelatedState();
        this.loadCourseData();
      }
    }
  },
  // 页面卸载时保存状态
  onUnload() {
    common_vendor.index.__f__("log", "at pages/mine/course/course.vue:364", "课程页面 onUnload, 保存当前角色:", this.userRole);
    common_vendor.index.setStorageSync("userRole", this.userRole);
    const globalData = getApp().globalData;
    if (globalData) {
      globalData.userRole = this.userRole;
    }
  },
  methods: {
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          try {
            this.userData = typeof userInfo === "string" ? UTS.JSON.parse(userInfo) : userInfo;
            this.userName = this.userData.nickname || "用户";
            const previousRole = this.userRole;
            if (this.userData.role) {
              this.userRole = this.userData.role;
              common_vendor.index.__f__("log", "at pages/mine/course/course.vue:396", "从用户数据中设置角色:", this.userRole);
              common_vendor.index.setStorageSync("userRole", this.userData.role);
              const globalData = getApp().globalData;
              if (globalData) {
                globalData.userRole = this.userRole;
              }
              if (previousRole !== this.userRole) {
                this.resetRoleRelatedState();
              }
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/mine/course/course.vue:413", "解析用户信息失败:", e);
          }
        }
      } else {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:422", "未登录，保持当前角色:", this.userRole);
      }
    },
    // 重置与角色相关的状态
    resetRoleRelatedState() {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:428", "重置角色相关状态");
      if (this.userRole === "student") {
        this.currentTab = 0;
      } else {
        this.teacherCurrentTab = 0;
      }
      this.selectedDate = null;
      this.selectedTimeSlot = "";
      this.selectedTimePeriod = "";
    },
    // 处理顶部导航栏组件的标签切换事件 - 学生
    onTabChange(index = null) {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:441", "学生模式标签切换:", index);
      this.currentTab = index;
      if (index === 0) {
        this.selectedTimeSlot = "";
        this.selectedTimePeriod = "";
      }
    },
    // 重置日期选择
    resetDateSelection() {
      this.selectedDate = null;
      this.selectedTimeSlot = "";
      this.selectedTimePeriod = "";
    },
    // 处理预约 - 修改为显示日历
    handleReserve(index = null) {
      this.currentCourseIndex = index;
      if (this.selectedDate) {
        this.showTimeSelectionDialog();
      } else {
        this.$refs.calendar.open();
      }
    },
    // 日历确认事件
    onCalendarConfirm(e = null) {
      this.selectedDate = e.fulldate;
      this.$nextTick(() => {
        this.showTimeSelectionDialog();
      });
    },
    // 显示时间选择弹窗
    showTimeSelectionDialog() {
      const periodOptions = this.timeSlots.map((item) => {
        return item.period;
      });
      common_vendor.index.showActionSheet({
        itemList: periodOptions,
        success: (res) => {
          this.selectedTimePeriod = periodOptions[res.tapIndex];
          const selectedPeriod = this.timeSlots[res.tapIndex];
          setTimeout(() => {
            common_vendor.index.showActionSheet({
              itemList: selectedPeriod.slots,
              success: (timeRes) => {
                this.selectedTimeSlot = selectedPeriod.slots[timeRes.tapIndex];
                this.confirmReservation();
              }
            });
          }, 300);
        }
      });
    },
    // 确认预约
    confirmReservation() {
      const course = this.pendingCourses[this.currentCourseIndex];
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认预约",
        content: `课程：${course.name}
日期：${this.selectedDate}
时间：${this.selectedTimeSlot}`,
        success: (res) => {
          if (res.confirm) {
            this.reservedCourses.push(Object.assign(Object.assign({}, course), { reservedTime: `${this.selectedDate} ${this.selectedTimeSlot}` }));
            this.pendingCourses.splice(this.currentCourseIndex, 1);
            common_vendor.index.showToast({
              title: "预约成功",
              icon: "success",
              duration: 2e3
            });
            this.currentCourseIndex = null;
            this.selectedDate = null;
            this.selectedTimeSlot = "";
            this.selectedTimePeriod = "";
          }
        }
      }));
    },
    // 完成课程时添加回放链接
    completeClass(index = null) {
      const course = this.teacherActiveCourses[index];
      common_vendor.index.showModal(new UTSJSONObject({
        title: "添加课程回放",
        editable: true,
        placeholderText: "请输入课程回放链接 (可选)",
        success: (res) => {
          let replayUrl = "";
          if (res.confirm && res.content) {
            replayUrl = res.content;
          }
          common_vendor.index.showModal(new UTSJSONObject({
            title: "确认下课",
            content: `确定完成${course.studentName}的${course.name}课程吗？`,
            success: (confirmRes) => {
              if (confirmRes.confirm) {
                this.teacherCompletedCourses.push(Object.assign(Object.assign({}, course), { completedTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], replayUrl }));
                this.teacherActiveCourses.splice(index, 1);
                common_vendor.index.showToast({
                  title: "课程已完成",
                  icon: "success",
                  duration: 2e3
                });
              }
            }
          }));
        }
      }));
    },
    // 修改预约时间
    modifyReservationTime(index = null) {
      this.currentCourseIndex = index;
      if (this.selectedDate) {
        this.showTimeSelectionDialog();
      } else {
        this.$refs.calendar.open();
      }
    },
    // 查看回访/回放
    viewFeedback(course = null) {
      if (course.replayUrl) {
        common_vendor.index.showModal(new UTSJSONObject({
          title: "查看回放",
          content: "是否跳转到课程回放网页？",
          success: (res) => {
            if (res.confirm) {
              this.openExternalLink(course.replayUrl);
            }
          }
        }));
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/mine/order/appraise/appraise?courseId=${course.id}&courseName=${course.name}&teacherName=${course.teacher}&price=${course.price}`
        });
      }
    },
    // 获取今天的日期
    getToday() {
      const today = /* @__PURE__ */ new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    },
    // 获取一个月后的日期（日历结束日期）
    getNextMonth() {
      const today = /* @__PURE__ */ new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-${String(nextMonth.getDate()).padStart(2, "0")}`;
    },
    // 加载课程数据
    loadCourseData() {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:639", "加载课程数据，当前角色:", this.userRole);
      if (this.userRole === "teacher") {
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:643", "加载老师课程数据");
        this.initTeacherData();
        this.teacherCurrentTab = 0;
      } else {
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:649", "加载学生课程数据");
        this.currentTab = 0;
      }
    },
    // 处理老师界面的导航栏切换事件
    onTeacherTabChange(index = null) {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:660", "老师模式标签切换:", index);
      this.teacherCurrentTab = index;
      if (index === 0) {
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:666", "切换到老师-待接受课程标签");
      } else if (index === 1) {
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:669", "切换到老师-进行中课程标签");
      } else if (index === 2) {
        common_vendor.index.__f__("log", "at pages/mine/course/course.vue:672", "切换到老师-已完成课程标签");
      }
    },
    // 初始化教师数据
    initTeacherData() {
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:678", "初始化教师数据");
      this.teacherPendingCourses = [
        {
          id: 101,
          name: "考研政治精讲班",
          studentName: "张同学",
          price: 399,
          image: "/static/images/default_avatar.png"
        },
        {
          id: 102,
          name: "考研数学基础班",
          studentName: "李同学",
          price: 499,
          image: "/static/images/default_avatar.png"
        }
      ];
      this.teacherActiveCourses = [
        {
          id: 103,
          name: "考研英语词汇班",
          studentName: "王同学",
          price: 349,
          classTime: "2023-12-20 15:00",
          image: "/static/images/default_avatar.png"
        }
      ];
      this.teacherCompletedCourses = [
        {
          id: 104,
          name: "计算机专业课辅导",
          studentName: "赵同学",
          price: 549,
          completedTime: "2023-12-10",
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=9a0c7f38-5e12-4d1d-a53e-94ed126aa3bb&from=3"
        }
      ];
    },
    // 实现老师界面的各个功能方法
    acceptCourse(index = null) {
      const course = this.teacherPendingCourses[index];
      common_vendor.index.showModal(new UTSJSONObject({
        title: "接受预约",
        content: `确定接受${course.studentName}的${course.name}课程预约吗？`,
        success: (res) => {
          if (res.confirm) {
            this.teacherActiveCourses.push(Object.assign(Object.assign({}, course), { classTime: this.getRandomFutureTime() }));
            this.teacherPendingCourses.splice(index, 1);
            common_vendor.index.showToast({
              title: "已接受预约",
              icon: "success",
              duration: 2e3
            });
          }
        }
      }));
    },
    rescheduleClass(index = null) {
      const course = this.teacherActiveCourses[index];
      common_vendor.index.showModal(new UTSJSONObject({
        title: "调整时间",
        content: `当前时间：${course.classTime}
是否需要重新安排时间？`,
        success: (res) => {
          if (res.confirm) {
            const newTime = this.getRandomFutureTime();
            this.teacherActiveCourses[index].classTime = newTime;
            common_vendor.index.showToast({
              title: "时间已调整",
              icon: "success",
              duration: 2e3
            });
          }
        }
      }));
    },
    viewClassFeedback(item = null) {
      if (item.replayUrl) {
        common_vendor.index.showModal(new UTSJSONObject({
          title: "查看回放",
          content: "是否跳转到课程回放网页？",
          success: (res) => {
            if (res.confirm) {
              this.openExternalLink(item.replayUrl);
            }
          }
        }));
      } else {
        common_vendor.index.showModal(new UTSJSONObject({
          title: "学生评价",
          content: `${item.studentName}对本课程的评价：
非常棒的课程，讲解清晰，收获很多！`,
          showCancel: false
        }));
      }
    },
    // 生成随机未来时间（辅助方法）
    getRandomFutureTime() {
      const now = /* @__PURE__ */ new Date();
      const futureDate = new Date(now.getTime() + (1 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1e3);
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, "0");
      const day = String(futureDate.getDate()).padStart(2, "0");
      const hours = ["09", "10", "14", "15", "16", "19", "20"][Math.floor(Math.random() * 7)];
      const minutes = ["00", "30"][Math.floor(Math.random() * 2)];
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 通用方法：打开外部链接（兼容多端）
    openExternalLink(url = null) {
      common_vendor.index.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
      });
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:828", "跳转到外部链接:", url);
    },
    // 确认下课
    confirmClassEnd(index = null) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认下课",
        content: "确定要确认下课吗？",
        success: (res) => {
          if (res.confirm) {
            const completedCourse = this.reservedCourses[index];
            this.completedCourses.push(Object.assign(Object.assign({}, completedCourse), { completedTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }));
            this.reservedCourses.splice(index, 1);
            common_vendor.index.showToast({
              title: "已确认下课",
              icon: "success",
              duration: 2e3
            });
          }
        }
      }));
    }
  }
});
if (!Array) {
  const _easycom_uni_calendar2 = common_vendor.resolveComponent("uni-calendar");
  const _easycom_top_navbar2 = common_vendor.resolveComponent("top-navbar");
  (_easycom_uni_calendar2 + _easycom_top_navbar2)();
}
const _easycom_uni_calendar = () => "../../../uni_modules/uni-calendar/components/uni-calendar/uni-calendar.js";
const _easycom_top_navbar = () => "../../../components/top-navbar/top-navbar2.js";
if (!Math) {
  (_easycom_uni_calendar + _easycom_top_navbar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userRole === "student"
  }, $data.userRole === "student" ? common_vendor.e({
    b: $data.selectedDate
  }, $data.selectedDate ? {
    c: common_vendor.t($data.selectedDate),
    d: common_vendor.o((...args) => $options.resetDateSelection && $options.resetDateSelection(...args))
  } : {}, {
    e: common_vendor.f($data.pendingCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.teacher),
        c: common_vendor.o(($event) => $options.handleReserve(index), index),
        d: index
      };
    }),
    f: $data.pendingCourses.length === 0
  }, $data.pendingCourses.length === 0 ? {} : {}, {
    g: common_vendor.sr("calendar", "0cb8e478-1,0cb8e478-0"),
    h: common_vendor.o($options.onCalendarConfirm),
    i: common_vendor.p({
      insert: false,
      ["start-date"]: $options.getToday(),
      ["end-date"]: $options.getNextMonth()
    }),
    j: common_vendor.f($data.reservedCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.teacher),
        c: common_vendor.t(item.reservedTime),
        d: common_vendor.o(($event) => $options.modifyReservationTime(index), index),
        e: index
      };
    }),
    k: $data.reservedCourses.length === 0
  }, $data.reservedCourses.length === 0 ? {} : {}, {
    l: common_vendor.f($data.completedCourses, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.teacher),
        c: common_vendor.t(item.completedTime),
        d: item.rating
      }, item.rating ? {
        e: common_vendor.f(5, (i, k1, i1) => {
          return {
            a: common_vendor.t(i <= item.rating ? "★" : "☆"),
            b: i
          };
        })
      } : {}, {
        f: common_vendor.o(($event) => $options.viewFeedback(item), index),
        g: index
      });
    }),
    m: $data.completedCourses.length === 0
  }, $data.completedCourses.length === 0 ? {} : {}, {
    n: common_vendor.o($options.onTabChange),
    o: common_vendor.p({
      navHeight: 60,
      userRole: $data.userRole
    })
  }) : common_vendor.e({
    p: common_vendor.f($data.teacherPendingCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.studentName || "暂无"),
        c: common_vendor.o(($event) => $options.acceptCourse(index), index),
        d: index
      };
    }),
    q: $data.teacherPendingCourses.length === 0
  }, $data.teacherPendingCourses.length === 0 ? {} : {}, {
    r: common_vendor.f($data.teacherActiveCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.studentName || "暂无"),
        c: common_vendor.t(item.classTime),
        d: common_vendor.o(($event) => $options.completeClass(index), index),
        e: common_vendor.o(($event) => $options.rescheduleClass(index), index),
        f: index
      };
    }),
    s: $data.teacherActiveCourses.length === 0
  }, $data.teacherActiveCourses.length === 0 ? {} : {}, {
    t: common_vendor.f($data.teacherCompletedCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.studentName || "暂无"),
        c: common_vendor.t(item.completedTime),
        d: common_vendor.o(($event) => $options.viewClassFeedback(item), index),
        e: index
      };
    }),
    v: $data.teacherCompletedCourses.length === 0
  }, $data.teacherCompletedCourses.length === 0 ? {} : {}, {
    w: common_vendor.o($options.onTeacherTabChange),
    x: common_vendor.p({
      navHeight: 60,
      userRole: $data.userRole
    })
  }), {
    y: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course.js.map
