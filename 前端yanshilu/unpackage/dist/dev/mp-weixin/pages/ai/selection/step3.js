"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      englishLevels: ["已过六级", "已过四级", "四级未过"],
      rankingLevels: ["前10%", "10%-40%", "40%-70%", "70%-100%"],
      selectedEnglishLevel: "",
      selectedRanking: ""
    };
  },
  onLoad() {
    const savedEnglish = common_vendor.index.getStorageSync("step3_english");
    const savedRanking = common_vendor.index.getStorageSync("step3_ranking");
    if (savedEnglish) {
      this.selectedEnglishLevel = savedEnglish;
    }
    if (savedRanking) {
      this.selectedRanking = savedRanking;
    }
  },
  methods: {
    /**
     * @description 选择英语水平
     * @param {String} level - 选择的英语水平
     */
    selectEnglishLevel(level = null) {
      this.selectedEnglishLevel = level;
      common_vendor.index.setStorageSync("step3_english", level);
    },
    /**
     * @description 选择专业排名
     * @param {String} ranking - 选择的专业排名
     */
    selectRanking(ranking = null) {
      this.selectedRanking = ranking;
      common_vendor.index.setStorageSync("step3_ranking", ranking);
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
      if (!this.selectedEnglishLevel || !this.selectedRanking) {
        common_vendor.index.showToast({
          title: "请选择完整信息",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ai/selection/step4"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.englishLevels, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedEnglishLevel === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectEnglishLevel(option), index)
      };
    }),
    b: common_vendor.f($data.rankingLevels, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedRanking === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectRanking(option), index)
      };
    }),
    c: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    d: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    e: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step3.js.map
