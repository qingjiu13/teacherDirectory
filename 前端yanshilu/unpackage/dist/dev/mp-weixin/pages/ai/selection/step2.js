"use strict";
const common_vendor = require("../../../common/vendor.js");
const config = require("../../../config.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      selectedSchool: "",
      selectedMajor: "",
      showSchoolList: false,
      showMajorList: false,
      searchText: "",
      searchMajorText: "",
      schools: [],
      majors: [],
      // 添加本地备用数据，防止云函数失败
      localSchools: [
        "北京大学",
        "清华大学",
        "复旦大学",
        "上海交通大学",
        "浙江大学",
        "南京大学",
        "中国人民大学",
        "武汉大学",
        "中山大学",
        "华中科技大学",
        "北京师范大学",
        "厦门大学",
        "南开大学",
        "吉林大学",
        "西安交通大学",
        "哈尔滨工业大学",
        "电子科技大学",
        "东南大学",
        "四川大学",
        "中南大学"
      ],
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
     * @description 过滤后的学校列表
     * @returns {Array} 过滤后的学校列表
     */
    filteredSchools() {
      if (!this.searchText)
        return this.schools.length > 0 ? this.schools : this.localSchools;
      const keyword = this.searchText.toLowerCase();
      return (this.schools.length > 0 ? this.schools : this.localSchools).filter((school) => {
        return school.toLowerCase().includes(keyword);
      });
    },
    /**
     * @description 过滤后的专业列表
     * @returns {Array} 过滤后的专业列表
     */
    filteredMajors() {
      if (!this.searchMajorText)
        return this.majors.length > 0 ? this.majors : this.localMajors;
      const keyword = this.searchMajorText.toLowerCase();
      return (this.majors.length > 0 ? this.majors : this.localMajors).filter((major) => {
        return major.toLowerCase().includes(keyword);
      });
    }
  },
  onLoad() {
    this.loadSchools();
    const savedSchool = common_vendor.index.getStorageSync("step2_school");
    const savedMajor = common_vendor.index.getStorageSync("step2_major");
    if (savedSchool) {
      this.selectedSchool = savedSchool;
      this.searchText = savedSchool;
    }
    if (savedMajor) {
      this.selectedMajor = savedMajor;
      this.searchMajorText = savedMajor;
    }
  },
  methods: {
    /**
     * @description 加载学校列表
     */
    loadSchools() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getSchools,
            data: new UTSJSONObject({}),
            timeout: 1e4
            // 增加超时时间
          }).catch((err = null) => {
            common_vendor.index.__f__("error", "at pages/ai/selection/step2.uvue:158", "获取学校列表失败:", err);
            return new UTSJSONObject({ result: new UTSJSONObject({ code: -1, msg: err.message }) });
          });
          common_vendor.index.hideLoading();
          if (result.result && result.result.code === 0) {
            this.schools = result.result.data || [];
            common_vendor.index.__f__("log", "at pages/ai/selection/step2.uvue:166", "获取到学校列表:", this.schools);
          } else {
            common_vendor.index.__f__("warn", "at pages/ai/selection/step2.uvue:168", "使用本地学校列表");
            this.schools = this.localSchools;
          }
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/ai/selection/step2.uvue:173", "加载学校列表异常:", e);
          this.schools = this.localSchools;
        }
      });
    },
    /**
     * @description 选择学校
     * @param {String} school - 选择的学校
     */
    selectSchool(school = null) {
      this.selectedSchool = school;
      this.searchText = school;
      this.showSchoolList = false;
      common_vendor.index.setStorageSync("step2_school", school);
    },
    /**
     * @description 加载专业列表
     */
    loadMajors() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          if (!this.selectedSchool) {
            return Promise.resolve(null);
          }
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          const result = yield common_vendor.Zs.callFunction({
            name: config.aiSelectionApis.getUndergraduateMajors,
            data: new UTSJSONObject({
              school: this.selectedSchool
              // 传入学校参数
            }),
            timeout: 1e4
            // 增加超时时间
          }).catch((err = null) => {
            common_vendor.index.__f__("error", "at pages/ai/selection/step2.uvue:210", "获取专业列表失败:", err);
            return new UTSJSONObject({ result: new UTSJSONObject({ code: -1, msg: err.message }) });
          });
          common_vendor.index.hideLoading();
          if (result.result && result.result.code === 0) {
            this.majors = result.result.data || [];
            common_vendor.index.__f__("log", "at pages/ai/selection/step2.uvue:219", "获取到专业列表:", this.majors);
          } else {
            common_vendor.index.__f__("warn", "at pages/ai/selection/step2.uvue:221", "使用本地专业列表");
            this.majors = this.localMajors;
          }
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/ai/selection/step2.uvue:226", "加载专业列表异常:", e);
          this.majors = this.localMajors;
        }
      });
    },
    /**
     * @description 选择专业
     * @param {String} major - 选择的专业
     */
    selectMajor(major = null) {
      this.selectedMajor = major;
      this.searchMajorText = major;
      this.showMajorList = false;
      common_vendor.index.setStorageSync("step2_major", major);
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
      if (!this.selectedSchool) {
        common_vendor.index.showToast({
          title: "请选择就读学校",
          icon: "none"
        });
        return null;
      }
      if (!this.selectedMajor) {
        common_vendor.index.showToast({
          title: "请输入就读专业",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: "/pages/ai/selection/step3"
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.showSchoolList = true),
    b: $data.searchText,
    c: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    d: $data.showSchoolList
  }, $data.showSchoolList ? {
    e: common_vendor.f($options.filteredSchools, (school, index, i0) => {
      return {
        a: common_vendor.t(school),
        b: index,
        c: common_vendor.o(($event) => $options.selectSchool(school), index)
      };
    })
  } : {}, {
    f: common_vendor.o(($event) => $data.showMajorList = true),
    g: $data.searchMajorText,
    h: common_vendor.o(($event) => $data.searchMajorText = $event.detail.value),
    i: $data.showMajorList
  }, $data.showMajorList ? {
    j: common_vendor.f($options.filteredMajors, (major, index, i0) => {
      return {
        a: common_vendor.t(major),
        b: index,
        c: common_vendor.o(($event) => $options.selectMajor(major), index)
      };
    })
  } : {}, {
    k: common_vendor.o((...args) => $options.prevPage && $options.prevPage(...args)),
    l: common_vendor.o((...args) => $options.nextPage && $options.nextPage(...args)),
    m: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step2.js.map
