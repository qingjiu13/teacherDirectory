"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  data() {
    return {
      overallRating: 0,
      professionalRating: 0,
      attitudeRating: 0,
      comment: ""
    };
  },
  methods: new UTSJSONObject({
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
      common_vendor.index.showToast({
        title: "评价提交成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.overallRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("overall", index + 1), index)
      };
    }),
    b: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.professionalRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("professional", index + 1), index)
      };
    }),
    c: common_vendor.f(5, (star, index, i0) => {
      return {
        a: index,
        b: index < $data.attitudeRating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating("attitude", index + 1), index)
      };
    }),
    d: $data.comment,
    e: common_vendor.o(($event) => $data.comment = $event.detail.value),
    f: common_vendor.t($data.comment.length),
    g: common_vendor.o((...args) => $options.submitAppraise && $options.submitAppraise(...args)),
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/mine/order/appraise/appraise.js.map
