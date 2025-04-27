"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      courseList: [
        new UTSJSONObject({
          name: "前端开发基础",
          teacher: "张老师",
          time: "2023-12-15 14:00",
          price: 199
        }),
        new UTSJSONObject({
          name: "Vue.js实战",
          teacher: "李老师",
          time: "2023-12-16 10:00",
          price: 299
        }),
        new UTSJSONObject({
          name: "小程序开发",
          teacher: "王老师",
          time: "2023-12-17 15:00",
          price: 249
        })
      ],
      currentCourseIndex: null,
      selectedDate: null
      // 新增用于存储选择的日期
    };
  },
  methods: new UTSJSONObject({
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
    getToday() {
      const today = /* @__PURE__ */ new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    }
  })
}));
if (!Array) {
  const _easycom_uni_calendar2 = common_vendor.resolveComponent("uni-calendar");
  _easycom_uni_calendar2();
}
const _easycom_uni_calendar = () => "../../../uni_modules/uni-calendar/components/uni-calendar/uni-calendar.js";
if (!Math) {
  _easycom_uni_calendar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("calendar", "0cb8e478-0"),
    b: common_vendor.o($options.onCalendarConfirm),
    c: common_vendor.p({
      insert: false,
      ["start-date"]: $options.getToday()
    }),
    d: common_vendor.f($data.courseList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.teacher),
        c: common_vendor.t(item.time),
        d: common_vendor.t(item.price),
        e: common_vendor.o(($event) => $options.handleReserve(index), index),
        f: index
      };
    }),
    e: common_assets._imports_0$1,
    f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/course/course.js.map
