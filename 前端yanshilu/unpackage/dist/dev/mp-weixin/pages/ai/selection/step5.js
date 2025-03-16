"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      targetOptions: ["985", "211及以上", "一本及以上", "普通院校及以上"],
      researchOptions: ["考虑", "不考虑"],
      selectedTarget: "",
      selectedResearch: ""
    };
  },
  onLoad() {
    const savedTarget = common_vendor.index.getStorageSync("step5_target");
    const savedResearch = common_vendor.index.getStorageSync("step5_research");
    if (savedTarget) {
      this.selectedTarget = savedTarget;
    }
    if (savedResearch) {
      this.selectedResearch = savedResearch;
    }
  },
  methods: {
    /**
     * @description 选择目标院校类型
     * @param {String} target - 选择的目标院校类型
     */
    selectTarget(target = null) {
      this.selectedTarget = target;
      common_vendor.index.setStorageSync("step5_target", target);
    },
    /**
     * @description 选择是否考虑研究院所
     * @param {String} research - 选择是否考虑研究院所
     */
    selectResearch(research = null) {
      this.selectedResearch = research;
      common_vendor.index.setStorageSync("step5_research", research);
    },
    /**
     * @description 返回上一步
     */
    prevPage() {
      common_vendor.index.navigateBack();
    },
    /**
     * @description 进入下一步
     */
    nextPage() {
      if (!this.selectedTarget || !this.selectedResearch) {
        common_vendor.index.showToast({
          title: "请选择完整信息",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ai/selection/step6"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.targetOptions, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedTarget === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectTarget(option), index)
      };
    }),
    b: common_vendor.f($data.researchOptions, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedResearch === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectResearch(option), index)
      };
    }),
    c: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    d: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    e: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step5.js.map
