"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      currentStep: 1,
      identityOptions: ["大一", "大二", "大三", "大四", "在职"],
      selectedIdentity: "",
      formData: new UTSJSONObject({
        identity: "",
        university: "",
        major: "",
        englishLevel: "",
        ranking: "",
        targetSchool: "",
        studyMode: "",
        targetArea: []
      })
    };
  },
  onLoad() {
    const savedIdentity = common_vendor.index.getStorageSync("step1_data");
    if (savedIdentity) {
      this.selectedIdentity = savedIdentity;
    }
  },
  methods: {
    /**
     * @description 选择身份
     * @param {String} option - 选择的身份选项
     */
    selectIdentity(option = null) {
      this.selectedIdentity = option;
      common_vendor.index.setStorageSync("step1_data", option);
    },
    /**
     * @description 跳转到下一页
     */
    nextPage() {
      if (!this.selectedIdentity) {
        common_vendor.index.showToast({
          title: "请选择您的身份",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ai/selection/step2"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.identityOptions, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedIdentity === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectIdentity(option), index)
      };
    }),
    b: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    c: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/selection.js.map
