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
      selectedMajor: null,
      selectedMode: "",
      loading: false,
      // 添加本地备用数据，防止云函数失败 - 包含考研专业的名称、编号和类别
      localMajors: [
        new UTSJSONObject({ code: "0801", name: "计算机科学与技术", category: "学术学位" }),
        new UTSJSONObject({ code: "0835", name: "软件工程", category: "学术学位" }),
        new UTSJSONObject({ code: "0854", name: "电子信息", category: "专业学位" }),
        new UTSJSONObject({ code: "0812", name: "计算机技术", category: "专业学位" }),
        new UTSJSONObject({ code: "0251", name: "金融", category: "专业学位" }),
        new UTSJSONObject({ code: "0351", name: "法律", category: "专业学位" }),
        new UTSJSONObject({ code: "0452", name: "体育", category: "专业学位" }),
        new UTSJSONObject({ code: "0451", name: "教育", category: "专业学位" }),
        new UTSJSONObject({ code: "0551", name: "翻译", category: "专业学位" }),
        new UTSJSONObject({ code: "0501", name: "中国语言文学", category: "学术学位" }),
        new UTSJSONObject({ code: "0701", name: "数学", category: "学术学位" }),
        new UTSJSONObject({ code: "0702", name: "物理学", category: "学术学位" }),
        new UTSJSONObject({ code: "0703", name: "化学", category: "学术学位" }),
        new UTSJSONObject({ code: "0710", name: "生物学", category: "学术学位" }),
        new UTSJSONObject({ code: "1002", name: "临床医学", category: "学术学位" }),
        new UTSJSONObject({ code: "1001", name: "基础医学", category: "学术学位" }),
        new UTSJSONObject({ code: "0202", name: "应用经济学", category: "学术学位" }),
        new UTSJSONObject({ code: "0201", name: "理论经济学", category: "学术学位" }),
        new UTSJSONObject({ code: "0303", name: "社会学", category: "学术学位" }),
        new UTSJSONObject({ code: "0304", name: "民族学", category: "学术学位" })
      ]
    };
  },
  computed: {
    /**
     * @description 过滤后的专业列表
     * @returns {Array} 过滤后的专业列表
     */
    filteredMajors() {
      const majorsToFilter = this.majors.length > 0 ? this.majors : this.localMajors;
      if (!this.searchText)
        return majorsToFilter;
      const keyword = this.searchText.toLowerCase();
      return majorsToFilter.filter((major) => {
        return major.name.toLowerCase().includes(keyword) || major.code.includes(keyword) || major.category.toLowerCase().includes(keyword);
      });
    }
  },
  onLoad() {
    this.getMajorData();
    const savedMajorJSON = common_vendor.index.getStorageSync("step4_major");
    const savedMode = common_vendor.index.getStorageSync("step4_mode");
    if (savedMajorJSON) {
      try {
        this.selectedMajor = UTS.JSON.parse(savedMajorJSON);
        this.searchText = this.selectedMajor.name;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/ai/selection/step4.uvue:135", "解析已保存专业数据失败:", e);
      }
    }
    if (savedMode) {
      this.selectedMode = savedMode;
    }
  },
  methods: {
    /**
     * @description 获取报考专业数据
     */
    getMajorData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.loading = true;
        try {
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getGraduateMajors,
            data: new UTSJSONObject({})
          });
          if (result.result && result.result.code === 0) {
            this.majors = result.result.data || [];
            common_vendor.index.__f__("log", "at pages/ai/selection/step4.uvue:156", "获取到专业数据:", this.majors);
          } else {
            common_vendor.index.__f__("warn", "at pages/ai/selection/step4.uvue:158", "使用本地专业列表");
            this.majors = this.localMajors;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/ai/selection/step4.uvue:162", "获取专业数据失败:", e);
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
            name: config.aiSelectionApis.getGraduateMajors,
            data: new UTSJSONObject({ keyword })
          });
          if (result.result && result.result.code === 0) {
            if (result.result.data && result.result.data.length > 0) {
              this.majors = result.result.data;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/ai/selection/step4.uvue:192", "搜索专业失败:", e);
        } finally {
          this.loading = false;
        }
      });
    },
    /**
     * @description 选择专业
     * @param {Object} major - 选择的专业对象，包含编号、名称和类别
     */
    selectMajor(major = null) {
      this.searchText = major.name;
      this.selectedMajor = major;
      this.showMajorList = false;
      common_vendor.index.setStorageSync("step4_major", UTS.JSON.stringify(major));
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
        a: common_vendor.t(major.name),
        b: common_vendor.t(major.code),
        c: common_vendor.t(major.category),
        d: index,
        e: common_vendor.o(($event) => $options.selectMajor(major), index)
      };
    })
  } : {}, {
    f: $data.selectedMajor
  }, $data.selectedMajor ? {
    g: common_vendor.t($data.selectedMajor.name),
    h: common_vendor.t($data.selectedMajor.code),
    i: common_vendor.t($data.selectedMajor.category)
  } : {}, {
    j: common_vendor.f($data.studyModes, (option, index, i0) => {
      return {
        a: common_vendor.t(option),
        b: index,
        c: common_vendor.n($data.selectedMode === option ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectMode(option), index)
      };
    }),
    k: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    l: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    m: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step4.js.map
