"use strict";
const common_vendor = require("../../../common/vendor.js");
const topNavbar = () => "../../../components/top-navbar/top-navbar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    topNavbar
  },
  data() {
    return {
      currentTab: 0,
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
          image: "/static/images/default_avatar.png"
        }),
        new UTSJSONObject({
          id: 8,
          name: "考研复试指导课",
          teacher: "周老师",
          price: 499,
          completedTime: "2023-12-15 09:00",
          image: "/static/images/default_avatar.png"
        })
      ],
      currentCourseIndex: null,
      selectedDate: null
    };
  },
  onLoad() {
    this.loadCourseData();
  },
  methods: new UTSJSONObject({
    // 处理顶部导航栏组件的标签切换事件
    onTabChange(index = null) {
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
    // 取消预约
    cancelReservation(index = null) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认取消",
        content: "确定要取消此预约吗？",
        success: (res) => {
          if (res.confirm) {
            const canceledCourse = this.reservedCourses[index];
            this.pendingCourses.push(Object.assign(Object.assign({}, canceledCourse), { time: canceledCourse.reservedTime.split(" ")[1] }));
            this.reservedCourses.splice(index, 1);
            common_vendor.index.showToast({
              title: "已取消预约",
              icon: "success",
              duration: 2e3
            });
          }
        }
      }));
    },
    // 跳转到评价页面
    goToAppraise(course = null) {
      common_vendor.index.navigateTo({
        url: `/pages/mine/order/appraise/appraise?courseId=${course.id}&courseName=${course.name}&teacherName=${course.teacher}&price=${course.price}`
      });
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
      common_vendor.index.__f__("log", "at pages/mine/course/course.vue:352", "加载课程数据");
    }
  })
}));
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
    a: $data.selectedDate
  }, $data.selectedDate ? {
    b: common_vendor.t($data.selectedDate),
    c: common_vendor.o((...args) => $options.resetDateSelection && $options.resetDateSelection(...args))
  } : {}, {
    d: common_vendor.f($data.pendingCourses, (item, index, i0) => {
      return {
        a: item.image || "/static/images/default_avatar.png",
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.teacher),
        d: common_vendor.t(item.time),
        e: common_vendor.t(item.price),
        f: common_vendor.o(($event) => $options.handleReserve(index), index),
        g: index
      };
    }),
    e: $data.pendingCourses.length === 0
  }, $data.pendingCourses.length === 0 ? {} : {}, {
    f: common_vendor.sr("calendar", "0cb8e478-1,0cb8e478-0"),
    g: common_vendor.o($options.onCalendarConfirm),
    h: common_vendor.p({
      insert: false,
      ["start-date"]: $options.getToday(),
      ["end-date"]: $options.getNextMonth()
    }),
    i: common_vendor.f($data.reservedCourses, (item, index, i0) => {
      return {
        a: item.image || "/static/images/default_avatar.png",
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.teacher),
        d: common_vendor.t(item.reservedTime),
        e: common_vendor.t(item.price),
        f: common_vendor.o(($event) => $options.cancelReservation(index), index),
        g: index
      };
    }),
    j: $data.reservedCourses.length === 0
  }, $data.reservedCourses.length === 0 ? {} : {}, {
    k: common_vendor.f($data.completedCourses, (item, index, i0) => {
      return common_vendor.e({
        a: item.image || "/static/images/default_avatar.png",
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.teacher),
        d: common_vendor.t(item.completedTime),
        e: common_vendor.t(item.price),
        f: item.rating
      }, item.rating ? {
        g: common_vendor.f(5, (i, k1, i1) => {
          return {
            a: common_vendor.t(i <= item.rating ? "★" : "☆"),
            b: i
          };
        })
      } : {}, {
        h: common_vendor.o(($event) => $options.goToAppraise(item), index),
        i: index
      });
    }),
    l: $data.completedCourses.length === 0
  }, $data.completedCourses.length === 0 ? {} : {}, {
    m: common_vendor.o($options.onTabChange),
    n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course.js.map
