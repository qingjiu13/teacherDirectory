"use strict";
const common_vendor = require("../../../common/vendor.js");
const config = require("../../../config.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      progressPercent: 0,
      intervalId: null,
      statusCheckInterval: null,
      analysisId: "",
      tips: [
        "正在分析您的学术背景...",
        "正在匹配最适合的院校...",
        "正在评估录取可能性...",
        "正在生成个性化建议...",
        "即将完成分析，请稍等..."
      ],
      currentTip: "正在分析您的学术背景...",
      checkCount: 0,
      maxChecks: 30
      // 最多检查30次（约1.5分钟）
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:55", "分析页面加载，ID:", options.id);
    this.analysisId = options.id || "";
    if (this.analysisId) {
      common_vendor.index.setStorageSync("current_analysis_id", this.analysisId);
    } else {
      common_vendor.index.showModal({
        title: "错误",
        content: "未找到分析ID，请重新开始",
        showCancel: false,
        success: () => {
          common_vendor.index.navigateBack();
        }
      });
      return null;
    }
    this.startProgressAnimation();
    this.checkAnalysisStatus();
  },
  onUnload() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  },
  methods: {
    /**
     * @description 启动进度条动画
     */
    startProgressAnimation() {
      this.progressPercent = 10;
      this.intervalId = setInterval(() => {
        const nextTipIndex = this.tips.indexOf(this.currentTip) + 1;
        this.currentTip = this.tips[nextTipIndex % this.tips.length];
        if (this.progressPercent < 85) {
          this.progressPercent += Math.floor(Math.random() * 3) + 1;
        }
      }, 3e3);
    },
    /**
     * @description 检查分析状态
     */
    checkAnalysisStatus() {
      this.statusCheckInterval = setInterval(() => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          try {
            this.checkCount++;
            common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:116", "检查分析状态，ID:", this.analysisId, "次数:", this.checkCount);
            if (this.checkCount > this.maxChecks) {
              clearInterval(this.statusCheckInterval);
              common_vendor.index.showModal({
                title: "分析超时",
                content: "分析时间超过预期，您可以继续等待或稍后查看结果",
                confirmText: "继续等待",
                cancelText: "稍后查看",
                success: (res) => {
                  if (res.confirm) {
                    this.checkCount = 0;
                    this.checkAnalysisStatus();
                  } else {
                    common_vendor.index.navigateBack();
                  }
                }
              });
              return Promise.resolve(null);
            }
            const result = yield common_vendor.Zs.callFunction({
              name: config.aiSelectionApis.getSchoolAnalysis,
              data: new UTSJSONObject({
                action: "get",
                id: this.analysisId
              }),
              timeout: 15e3
            });
            common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:149", "分析状态查询结果:", result);
            if (result.result && result.result.code === 0) {
              const data = result.result.data;
              if (data && data.analysis_status === "completed") {
                common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:156", "分析已完成，准备展示结果");
                this.progressPercent = 100;
                clearInterval(this.intervalId);
                clearInterval(this.statusCheckInterval);
                setTimeout(() => {
                  common_vendor.index.redirectTo({
                    url: "/pages/ai/selection/result?id=" + this.analysisId
                  });
                }, 800);
              } else if (data && data.analysis_status === "failed") {
                clearInterval(this.intervalId);
                clearInterval(this.statusCheckInterval);
                common_vendor.index.showModal({
                  title: "分析失败",
                  content: data.error_message || "很抱歉，分析过程中出现问题",
                  showCancel: false,
                  success: () => {
                    common_vendor.index.navigateBack();
                  }
                });
              } else if (data && data.analysis_status === "analyzing") {
                common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:180", "分析进行中...");
                if (this.progressPercent < 90) {
                  this.progressPercent += 2;
                  if (this.progressPercent > 90)
                    this.progressPercent = 90;
                }
              } else if (data && data.analysis_status === "pending") {
                common_vendor.index.__f__("log", "at pages/ai/selection/analyzing.uvue:188", "等待分析开始...");
                if (this.progressPercent < 30) {
                  this.progressPercent += 2;
                }
              }
            } else {
              common_vendor.index.__f__("error", "at pages/ai/selection/analyzing.uvue:194", "检查状态API调用失败:", result);
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/ai/selection/analyzing.uvue:198", "检查分析状态失败:", e);
          }
        });
      }, 3e3);
    },
    /**
     * @description 取消分析
     */
    cancelAnalysis() {
      common_vendor.index.showModal({
        title: "取消分析",
        content: "确定要取消当前分析吗？",
        success: (res) => {
          if (res.confirm) {
            if (this.intervalId) {
              clearInterval(this.intervalId);
            }
            if (this.statusCheckInterval) {
              clearInterval(this.statusCheckInterval);
            }
            common_vendor.index.navigateBack();
          }
        }
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.progressPercent + "%",
    b: common_assets._imports_0$3,
    c: $data.progressPercent + "%",
    d: common_vendor.t($data.progressPercent),
    e: common_vendor.t($data.currentTip),
    f: common_vendor.o((...args) => $options.cancelAnalysis && $options.cancelAnalysis(...args)),
    g: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/analyzing.js.map
