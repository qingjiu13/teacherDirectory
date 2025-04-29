"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      overallRating: 0,
      professionalRating: 0,
      attitudeRating: 0,
      comment: "",
      courseInfo: new UTSJSONObject({
        id: "",
        name: "",
        teacher: "",
        price: 0
      })
    };
  },
  onLoad(options) {
    if (options) {
      this.courseInfo = {
        id: options.courseId || "",
        name: options.courseName || "XXXX课程",
        teacher: options.teacherName || "XXXX老师",
        price: options.price || "100.00"
      };
    }
  },
  methods: {
    setRating(type = null, rating = null) {
      switch (type) {
        case "overall":
          this.overallRating = rating;
          break;
        case "professional":
          this.professionalRating = rating;
          break;
        case "attitude":
          this.attitudeRating = rating;
          break;
      }
    },
    submitAppraise() {
      if (this.overallRating === 0 || this.professionalRating === 0 || this.attitudeRating === 0) {
        common_vendor.index.showToast({
          title: "请完成所有评分项",
          icon: "none"
        });
        return null;
      }
      const appraiseData = new UTSJSONObject({
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        teacher: this.courseInfo.teacher,
        ratings: new UTSJSONObject({
          overall: this.overallRating,
          professional: this.professionalRating,
          attitude: this.attitudeRating
        }),
        comment: this.comment,
        submitTime: (/* @__PURE__ */ new Date()).toLocaleString()
      });
      common_vendor.index.__f__("log", "at pages/mine/order/appraise/appraise.vue:166", "提交评价:", appraiseData);
      common_vendor.index.showToast({
        title: "评价提交成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    getCurrentDate() {
      const date = /* @__PURE__ */ new Date();
      return date.toLocaleString();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.courseInfo.teacher ? $data.courseInfo.teacher.substring(0, 1) : "讲"),
    b: common_vendor.t($data.courseInfo.teacher || "XXXX老师"),
    c: common_vendor.t($data.courseInfo.name || "XXXX课程"),
    d: common_vendor.t($options.getCurrentDate()),
    e: common_vendor.t($data.courseInfo.price),
    f: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.overallRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("overall", index + 1), index)
      };
    }),
    g: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.professionalRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("professional", index + 1), index)
      };
    }),
    h: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.attitudeRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("attitude", index + 1), index)
      };
    }),
    i: $data.comment,
    j: common_vendor.o(($event) => $data.comment = $event.detail.value),
    k: common_vendor.t($data.comment.length),
    l: common_vendor.o((...args) => $options.submitAppraise && $options.submitAppraise(...args)),
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/mine/order/appraise/appraise.js.map
