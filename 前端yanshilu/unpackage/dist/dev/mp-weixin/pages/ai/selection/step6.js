"use strict";
const common_vendor = require("../../../common/vendor.js");
const config = require("../../../config.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      areaA: ["北京市", "上海市", "浙江省", "江苏省", "湖北省", "广东省", "吉林省", "天津市"],
      areaB: [
        "四川省",
        "安徽省",
        "陕西省",
        "黑龙江省",
        "湖南省",
        "山东省",
        "福建省",
        "辽宁省",
        "重庆市",
        "河南省",
        "江西省",
        "山西省"
      ],
      selectedAreas: []
    };
  },
  onLoad() {
    const savedAreas = common_vendor.index.getStorageSync("step6_areas");
    if (savedAreas && Array.isArray(savedAreas)) {
      this.selectedAreas = savedAreas;
    }
  },
  methods: {
    /**
     * @description 切换选择区域
     * @param {String} area - 区域名称
     */
    toggleArea(area = null) {
      const index = this.selectedAreas.indexOf(area);
      if (index === -1) {
        this.selectedAreas.push(area);
      } else {
        this.selectedAreas.splice(index, 1);
      }
      common_vendor.index.setStorageSync("step6_areas", this.selectedAreas);
    },
    /**
     * @description 返回上一步
     */
    prevPage() {
      common_vendor.index.navigateBack();
    },
    /**
     * @description 提交数据，开始分析
     */
    submitData() {
      var _a;
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (this.selectedAreas.length === 0) {
          common_vendor.index.showToast({
            title: "请至少选择一个目标省份",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading({
            title: "准备分析..."
          });
          const formData = new UTSJSONObject({
            identity: common_vendor.index.getStorageSync("step1_data") || "",
            university: common_vendor.index.getStorageSync("step2_school") || "",
            major: common_vendor.index.getStorageSync("step2_major") || "",
            englishLevel: common_vendor.index.getStorageSync("step3_english") || "",
            ranking: common_vendor.index.getStorageSync("step3_ranking") || "",
            targetMajor: common_vendor.index.getStorageSync("step4_major") || "",
            studyMode: common_vendor.index.getStorageSync("step4_mode") || "",
            targetType: common_vendor.index.getStorageSync("step5_target") || "",
            considerResearch: common_vendor.index.getStorageSync("step5_research") || "",
            targetAreas: this.selectedAreas
          });
          common_vendor.index.__f__("log", "at pages/ai/selection/step6.uvue:123", "提交数据:", formData);
          const saveResult = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.saveAnalysisRequest,
            data: new UTSJSONObject({
              formData
            }),
            timeout: 1e4
            // 增加超时时间到10秒
          });
          common_vendor.index.hideLoading();
          if (saveResult.result && saveResult.result.code === 0) {
            const analysisId = saveResult.result.data.id;
            common_vendor.index.navigateTo({
              url: "/pages/ai/selection/analyzing?id=" + analysisId
            });
            common_vendor.Zs.callFunction({
              name: config.aiSelectionApis.startAnalysis,
              data: new UTSJSONObject({ id: analysisId }),
              success: (res = null) => {
                common_vendor.index.__f__("log", "at pages/ai/selection/step6.uvue:149", "分析开始:", res);
              },
              fail: (err = null) => {
                common_vendor.index.__f__("error", "at pages/ai/selection/step6.uvue:152", "启动分析失败:", err);
              }
            });
          } else {
            throw new Error(((_a = saveResult.result) === null || _a === void 0 ? void 0 : _a.msg) || "准备分析失败");
          }
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "提示",
            content: e.message || "准备分析失败，请重试",
            showCancel: false
          });
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.areaA, (area, index, i0) => {
      return {
        a: common_vendor.t(area),
        b: index,
        c: common_vendor.n($data.selectedAreas.includes(area) ? "active" : ""),
        d: common_vendor.o(($event) => $options.toggleArea(area), index)
      };
    }),
    b: common_vendor.f($data.areaB, (area, index, i0) => {
      return {
        a: common_vendor.t(area),
        b: index,
        c: common_vendor.n($data.selectedAreas.includes(area) ? "active" : ""),
        d: common_vendor.o(($event) => $options.toggleArea(area), index)
      };
    }),
    c: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    d: common_vendor.o((...args) => $options.submitData && $options.submitData(...args)),
    e: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step6.js.map
