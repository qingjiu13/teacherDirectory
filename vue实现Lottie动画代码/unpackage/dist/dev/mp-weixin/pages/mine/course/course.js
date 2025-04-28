"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      courseList: [
        new UTSJSONObject({
          name: "前端开发基础",
          teacher: "张老师",
          time: "2023-12-15 14:00",
          price: 199,
          status: "ongoing"
        }),
        new UTSJSONObject({
          name: "Vue.js实战",
          teacher: "李老师",
          time: "2023-12-16 10:00",
          price: 299,
          status: "upcoming"
        }),
        new UTSJSONObject({
          name: "小程序开发",
          teacher: "王老师",
          time: "2023-12-17 15:00",
          price: 249,
          status: "completed"
        })
      ],
      tabList: ["全部", "进行中", "即将开始", "已结束"],
      currentTab: 0,
      searchText: "",
      currentCourseIndex: null,
      selectedDate: null
    };
  },
  computed: new UTSJSONObject({
    // 筛选后的课程列表
    filteredCourses() {
      let filtered = [...this.courseList];
      if (this.currentTab === 1) {
        filtered = filtered.filter((course) => {
          return course.status === "ongoing";
        });
      } else if (this.currentTab === 2) {
        filtered = filtered.filter((course) => {
          return course.status === "upcoming";
        });
      } else if (this.currentTab === 3) {
        filtered = filtered.filter((course) => {
          return course.status === "completed";
        });
      }
      if (this.searchText) {
        filtered = filtered.filter((course) => {
          return course.name.includes(this.searchText) || course.teacher.includes(this.searchText);
        });
      }
      return filtered;
    }
  }),
  methods: {
    // 预约流程
    handleReserve(index = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const course = this.courseList[index];
        const confirm = (yield common_vendor.index.showModal(new UTSJSONObject({
          title: "确认预约",
          content: `确定要预约《${course.name}》课程吗？`,
          confirmText: "确认",
          cancelText: "取消"
        }))).confirm;
        if (!confirm)
          return Promise.resolve(null);
        this.currentCourseIndex = index;
        common_vendor.index.showToast({
          title: "请选择预约日期",
          icon: "none",
          duration: 1500
        });
        this.$refs.calendar.open();
      });
    },
    // 日历确认
    onCalendarConfirm(e = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.selectedDate = e.fulldate;
        yield common_vendor.index.showToast({
          title: `已选择日期: ${e.fulldate}
请选择时间段`,
          icon: "none",
          duration: 1500
        });
        yield this.selectReserveTime();
      });
    },
    // 选择时间段
    selectReserveTime() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const time = (yield new Promise((resolve) => {
          common_vendor.index.showActionSheet({
            title: "选择预约时间段",
            itemList: ["上午 9:00-11:00", "下午 14:00-16:00", "晚上 19:00-21:00"],
            success: (res) => {
              const times = ["9:00-11:00", "14:00-16:00", "19:00-21:00"];
              resolve({ time: times[res.tapIndex] });
            },
            fail: () => {
              return resolve({ time: null });
            }
          });
        })).time;
        if (!time)
          return Promise.resolve(null);
        const course = this.courseList[this.currentCourseIndex];
        common_vendor.index.showToast({
          title: `已成功预约: ${course.name}
日期: ${this.selectedDate}
时间: ${time}`,
          icon: "success",
          duration: 3e3
        });
        this.currentCourseIndex = null;
        this.selectedDate = null;
      });
    },
    // 获取今天日期
    getToday() {
      const today = /* @__PURE__ */ new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    },
    // 切换tab
    changeTab(index = null) {
      this.currentTab = index;
    },
    // 搜索课程
    searchCourse(e = null) {
      this.searchText = e.detail.value;
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    },
    // 获取状态文本
    getStatusText(status = null) {
      const statusMap = new UTSJSONObject({
        ongoing: "进行中",
        upcoming: "即将开始",
        completed: "已结束"
      });
      return statusMap[status] || "未知状态";
    }
  }
});
if (!Array) {
  const _component_uni_calendar = common_vendor.resolveComponent("uni-calendar");
  _component_uni_calendar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("calendar", "0cb8e478-0"),
    b: common_vendor.o($options.onCalendarConfirm),
    c: common_vendor.p({
      insert: false,
      ["start-date"]: $options.getToday()
    }),
    d: common_vendor.f($data.tabList, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: common_vendor.n($data.currentTab === index ? "active" : ""),
        d: common_vendor.o(($event) => $options.changeTab(index), index)
      };
    }),
    e: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.searchCourse && $options.searchCourse(...args)]),
    f: $data.searchText,
    g: common_vendor.f($options.filteredCourses, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.teacher),
        c: common_vendor.t(item.time),
        d: common_vendor.t($options.getStatusText(item.status)),
        e: common_vendor.t(item.price),
        f: common_vendor.o(($event) => $options.handleReserve(index), index),
        g: index
      };
    }),
    h: common_assets._imports_0$1,
    i: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course.js.map
