"use strict";
const common_vendor = require("../../../common/vendor.js");
const config = require("../../../config.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      searchText: "",
      showMajorList: false,
      majors: [],
      studyModes: ["全日制", "非全日制"],
      selectedMajor: "",
      selectedMode: "",
      loading: false,
      // 添加本地备用数据，防止云函数失败
      localMajors: [
        "计算机科学与技术",
        "软件工程",
        "人工智能",
        "数据科学与大数据技术",
        "网络空间安全",
        "电子信息工程",
        "通信工程",
        "自动化",
        "机械工程",
        "土木工程",
        "建筑学",
        "工商管理",
        "会计学",
        "金融学",
        "经济学",
        "法学",
        "医学",
        "生物科学",
        "化学",
        "物理学",
        "数学",
        "英语",
        "汉语言文学",
        "新闻学",
        "心理学",
        "教育学"
      ]
    };
  },
  computed: {
    /**
     * @description 过滤后的专业列表
     * @returns {Array} 过滤后的专业列表
     */
    filteredMajors() {
      if (!this.searchText)
        return this.majors.length > 0 ? this.majors : this.localMajors;
      const keyword = this.searchText.toLowerCase();
      return (this.majors.length > 0 ? this.majors : this.localMajors).filter((major) => {
        return major.toLowerCase().includes(keyword);
      });
    }
  },
  onLoad() {
    this.getMajorData();
    const savedMajor = common_vendor.index.getStorageSync("step4_major");
    const savedMode = common_vendor.index.getStorageSync("step4_mode");
    if (savedMajor) {
      this.selectedMajor = savedMajor;
      this.searchText = savedMajor;
    }
    if (savedMode) {
      this.selectedMode = savedMode;
    }
  },
  methods: {
    /**
     * @description 获取专业数据
     */
    getMajorData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.loading = true;
        try {
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getMajors,
            data: new UTSJSONObject({})
          });
          if (result.result && result.result.code === 0) {
            this.majors = result.result.data || [];
            common_vendor.index.__f__("log", "at pages/ai/selection/step4.uvue:124", "获取到专业数据:", this.majors);
          } else {
            common_vendor.index.__f__("warn", "at pages/ai/selection/step4.uvue:126", "使用本地专业列表");
            this.majors = this.localMajors;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/ai/selection/step4.uvue:130", "获取专业数据失败:", e);
          this.majors = this.localMajors;
          common_vendor.index.showToast({
            title: "获取专业数据失败",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      });
    },
    /**
     * @description 根据关键词搜索专业
     * @param {String} keyword - 搜索关键词
     */
    searchMajors(keyword = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!keyword)
          return Promise.resolve(null);
        this.loading = true;
        try {
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getMajors,
            data: new UTSJSONObject({ keyword })
          });
          if (result.result && result.result.code === 0) {
            if (result.result.data && result.result.data.length > 0) {
              this.majors = result.result.data;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/ai/selection/step4.uvue:160", "搜索专业失败:", e);
        } finally {
          this.loading = false;
        }
      });
    },
    /**
     * @description 选择专业
     * @param {String} major - 选择的专业
     */
    selectMajor(major = null) {
      this.searchText = major;
      this.selectedMajor = major;
      this.showMajorList = false;
      common_vendor.index.setStorageSync("step4_major", major);
    },
    /**
     * @description 选择学习方式
     * @param {String} mode - 选择的学习方式
     */
    selectMode(mode = null) {
      this.selectedMode = mode;
      common_vendor.index.setStorageSync("step4_mode", mode);
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
      if (!this.selectedMajor || !this.selectedMode) {
        common_vendor.index.showToast({
          title: "请选择完整信息",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ai/selection/step5"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.showMajorList = true),
    b: $data.searchText,
    c: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    d: $data.showMajorList
  }, $data.showMajorList ? {
    e: common_vendor.f($options.filteredMajors, (major, index, i0) => {
      return {
        a: common_vendor.t(major),
        b: index,
        c: common_vendor.o(($event) => $options.selectMajor(major), index)
      };
    })
  } : {}, {
    f: common_vendor.f($data.studyModes, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedMode === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectMode(option), index)
      };
    }),
    g: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    h: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    i: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step4.js.map
