"use strict";
const common_vendor = require("../../../common/vendor.js");
const config = require("../../../config.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      analysisId: "",
      currentIndex: 0,
      loading: true,
      analysisResult: null,
      displaySchools: []
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/ai/selection/result.uvue:136", "结果页面加载，参数:", options);
    this.analysisId = options.id || "";
    this.loading = true;
    this.loadAnalysisResult();
  },
  methods: {
    /**
     * @description 从云端加载数据
     */
    loadAnalysisResult() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          this.loading = true;
          common_vendor.index.__f__("log", "at pages/ai/selection/result.uvue:150", "尝试从云端加载数据, ID:", this.analysisId);
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getSchoolAnalysis,
            data: new UTSJSONObject({
              action: "get",
              id: this.analysisId
            }),
            timeout: 15e3
          });
          common_vendor.index.__f__("log", "at pages/ai/selection/result.uvue:162", "获取分析结果返回:", result);
          if (result.result && result.result.code === 0 && result.result.data) {
            const data = result.result.data;
            if (data.analysis_result) {
              this.analysisResult = data;
              if (data.analysis_result.recommendSchools && data.analysis_result.recommendSchools.length > 0) {
                this.displaySchools = data.analysis_result.recommendSchools;
                common_vendor.index.__f__("log", "at pages/ai/selection/result.uvue:174", "成功加载AI推荐学校:", this.displaySchools.length);
              } else if (data.analysis_result.rawResponse) {
                common_vendor.index.__f__("log", "at pages/ai/selection/result.uvue:177", "API返回了原始响应但JSON解析失败");
                this.displaySchools = [{
                  name: "API原始响应",
                  features: "以下是DeepSeek API的原始返回内容",
                  reason: data.analysis_result.rawResponse.substring(0, 300) + "...",
                  difficulty: "解析失败: " + (data.analysis_result.parseError || "未知原因"),
                  suggestion: "请尝试重新分析",
                  rating: 0,
                  recommendMajor: "无法解析"
                }];
              } else {
                this.showError("分析结果异常", "没有找到推荐学校信息，请尝试重新分析");
              }
            } else {
              this.showError("分析结果异常", "分析结果格式错误，请尝试重新分析");
            }
          } else {
            this.showError("获取分析结果失败", "无法获取分析结果，请尝试重新分析");
          }
        } catch (e) {
          this.showError("系统错误", "加载分析结果时发生错误: " + e.message);
        } finally {
          this.loading = false;
        }
      });
    },
    /**
     * @description 显示错误提示
     * @param {String} title - 错误标题
     * @param {String} content - 错误内容
     */
    showError(title = null, content = null) {
      common_vendor.index.showModal({
        title,
        content,
        showCancel: false,
        success: () => {
          common_vendor.index.navigateBack();
        }
      });
    },
    /**
     * @description 轮播图变化事件
     * @param {Object} e - 事件对象
     */
    swiperChange(e = null) {
      this.currentIndex = e.detail.current;
    },
    /**
     * @description 跳转到指定卡片
     * @param {Number} index - 卡片索引
     */
    jumpToCard(index = null) {
      this.currentIndex = index;
    },
    /**
     * @description 重新开始分析
     */
    restartAnalysis() {
      common_vendor.index.navigateBack({
        delta: 10,
        success: () => {
          common_vendor.index.navigateTo({
            url: "/pages/ai/selection/selection"
          });
        }
      });
    },
    /**
     * @description 分享结果
     */
    shareResult() {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
    },
    /**
     * @description 生成星星文本
     * @param {Number} rating - 评分
     * @returns {String} 星星文本
     */
    getStarText(rating = null) {
      if (!rating && rating !== 0)
        return "☆☆☆☆☆";
      const score = parseFloat(rating) || 0;
      const fullStars = Math.floor(score);
      const hasHalfStar = score - fullStars >= 0.5;
      let stars = "★".repeat(fullStars);
      if (hasHalfStar) {
        stars += "☆";
      }
      const emptyStars = 5 - stars.length;
      stars += "☆".repeat(emptyStars);
      return stars;
    },
    /**
     * @description 格式化建议内容
     * @param {String} text - 建议内容
     * @returns {String} 格式化后的HTML
     */
    formatAdviceContent(text = null) {
      if (!text)
        return "暂无数据";
      const lines = text.split("\n");
      let html = "";
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line)
          continue;
        const numberMatch = line.match(/^(\d+)\.\s*(.*)$/);
        if (numberMatch) {
          html += `<div class="list-item"><strong>${numberMatch[1]}.</strong> ${numberMatch[2]}</div>`;
        } else {
          html += `<div>${line}</div>`;
        }
      }
      return html || text;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {
    b: common_assets._imports_0$3
  } : common_vendor.e({
    c: common_vendor.f($data.displaySchools, (school, index, i0) => {
      return {
        a: common_vendor.t(school.name),
        b: common_vendor.t($options.getStarText(school.rating)),
        c: common_vendor.t(school.rating.toFixed(1)),
        d: common_vendor.t(school.recommendMajor),
        e: common_vendor.t(school.features),
        f: common_vendor.t(school.reason),
        g: common_vendor.t(school.difficulty),
        h: common_vendor.t(school.suggestion),
        i: index
      };
    }),
    d: common_vendor.t($data.currentIndex + 1),
    e: common_vendor.t($data.displaySchools.length),
    f: common_vendor.o((...args) => $options.swiperChange && $options.swiperChange(...args)),
    g: common_vendor.f($data.displaySchools, (_, index, i0) => {
      return {
        a: index,
        b: common_vendor.n($data.currentIndex === index ? "active" : ""),
        c: common_vendor.o(($event) => $options.jumpToCard(index), index)
      };
    }),
    h: $data.analysisResult && $data.analysisResult.analysis_result && $data.analysisResult.analysis_result.advice
  }, $data.analysisResult && $data.analysisResult.analysis_result && $data.analysisResult.analysis_result.advice ? {
    i: $options.formatAdviceContent($data.analysisResult.analysis_result.advice.advantages),
    j: $options.formatAdviceContent($data.analysisResult.analysis_result.advice.disadvantages),
    k: $options.formatAdviceContent($data.analysisResult.analysis_result.advice.strategy),
    l: $options.formatAdviceContent($data.analysisResult.analysis_result.advice.timeline),
    m: $options.formatAdviceContent($data.analysisResult.analysis_result.advice.keyPoints)
  } : {}), {
    n: common_vendor.o((...args) => $options.shareResult && $options.shareResult(...args)),
    o: common_vendor.o((...args) => $options.restartAnalysis && $options.restartAnalysis(...args)),
    p: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/result.js.map
