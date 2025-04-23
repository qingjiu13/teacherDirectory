"use strict";
const common_vendor = require("../../common/vendor.js");
const CascadeSelector = () => "./cascade-selector.js";
const _sfc_main = common_vendor.defineComponent({
  name: "CascadeContainer",
  components: {
    CascadeSelector
  },
  props: {
    /**
     * 是否直接应用选中的值（不需要点击筛选按钮）
     * @type {Boolean}
     * @default false
     */
    autoApply: new UTSJSONObject({
      type: Boolean,
      default: false
    })
  },
  data() {
    return {
      selectedSchool: "",
      selectedMajor: "",
      selectedSubject: ""
    };
  },
  computed: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapGetters("filter", [
    "schoolOptions",
    "majorOptions",
    "subjectOptions",
    "filteredSchoolOptions",
    "filteredMajorOptions",
    "filteredSubjectOptions"
  ])), {
    /**
     * @description 将vuex中的学校选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的学校选项
     */
    formattedSchoolOptions() {
      return this.filteredSchoolOptions.map((option = null) => {
        return new UTSJSONObject({
          label: option.choiceItemContent,
          value: option.choiceItemValue
        });
      });
    },
    /**
     * @description 将vuex中的专业选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的专业选项
     */
    formattedMajorOptions() {
      return this.filteredMajorOptions.map((option = null) => {
        return new UTSJSONObject({
          label: option.choiceItemContent,
          value: option.choiceItemValue
        });
      });
    },
    /**
     * @description 将vuex中的考研科目选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的考研科目选项
     */
    formattedSubjectOptions() {
      return this.filteredSubjectOptions.map((option = null) => {
        return new UTSJSONObject({
          label: option.choiceItemContent,
          value: option.choiceItemValue
        });
      });
    }
  })),
  methods: new UTSJSONObject(Object.assign(Object.assign({}, common_vendor.mapActions("filter", [
    "selectSchool",
    "selectMajor",
    "selectSubject",
    "searchSchool",
    "searchMajor",
    "searchSubject",
    "resetFilters"
  ])), {
    /**
     * @description 学校选择改变事件处理
     * @param {Object} school 选中的学校对象
     */
    onSchoolChange(school = null) {
      this.selectedSchool = school.value;
      this.selectedMajor = "";
      this.selectedSubject = "";
      this.selectSchool(school.value);
      this.$emit("school-change", school.value);
      if (this.autoApply) {
        this.$emit("apply-filter", new UTSJSONObject({
          school: this.selectedSchool,
          major: "",
          subject: ""
        }));
      }
    },
    /**
     * @description 专业选择改变事件处理
     * @param {Object} major 选中的专业对象
     */
    onMajorChange(major = null) {
      this.selectedMajor = major.value;
      this.selectedSubject = "";
      this.selectMajor(major.value);
      this.$emit("major-change", major.value);
      if (this.autoApply) {
        this.$emit("apply-filter", new UTSJSONObject({
          school: this.selectedSchool,
          major: this.selectedMajor,
          subject: ""
        }));
      }
    },
    /**
     * @description 考研科目选择改变事件处理
     * @param {Object} subject 选中的考研科目对象
     */
    onSubjectChange(subject = null) {
      this.selectedSubject = subject.value;
      this.selectSubject(subject.value);
      this.$emit("subject-change", subject.value);
      if (this.autoApply) {
        this.$emit("apply-filter", new UTSJSONObject({
          school: this.selectedSchool,
          major: this.selectedMajor,
          subject: this.selectedSubject
        }));
      }
    },
    /**
     * @description 学校搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSchoolSearch(keyword = null) {
      this.searchSchool(keyword);
    },
    /**
     * @description 专业搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onMajorSearch(keyword = null) {
      this.searchMajor(keyword);
    },
    /**
     * @description 考研科目搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSubjectSearch(keyword = null) {
      this.searchSubject(keyword);
    },
    /**
     * @description 应用筛选条件
     */
    applyFilter() {
      this.$emit("apply-filter", new UTSJSONObject({
        school: this.selectedSchool,
        major: this.selectedMajor,
        subject: this.selectedSubject
      }));
    },
    /**
     * @description 重置筛选条件
     */
    reset() {
      this.selectedSchool = "";
      this.selectedMajor = "";
      this.selectedSubject = "";
      this.resetFilters();
      this.$emit("reset");
    },
    /**
     * @description 获取当前选中的筛选值
     * @returns {Object} 当前选中的筛选值对象
     */
    getSelectedValues() {
      return new UTSJSONObject({
        school: this.selectedSchool,
        major: this.selectedMajor,
        subject: this.selectedSubject
      });
    }
  }))
});
if (!Array) {
  const _component_cascade_selector = common_vendor.resolveComponent("cascade-selector");
  _component_cascade_selector();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onSchoolChange),
    b: common_vendor.o($options.onSchoolSearch),
    c: common_vendor.o(($event) => $data.selectedSchool = $event),
    d: common_vendor.p({
      options: $options.formattedSchoolOptions,
      placeholder: "选择学校",
      searchable: true,
      ["search-placeholder"]: "搜索学校",
      modelValue: $data.selectedSchool
    }),
    e: common_vendor.o($options.onMajorChange),
    f: common_vendor.o(($event) => $data.selectedMajor = $event),
    g: common_vendor.p({
      options: $options.formattedMajorOptions,
      placeholder: "选择专业",
      disabled: !$data.selectedSchool,
      modelValue: $data.selectedMajor
    }),
    h: common_vendor.o($options.onSubjectSearch),
    i: common_vendor.o($options.onSubjectChange),
    j: common_vendor.o(($event) => $data.selectedSubject = $event),
    k: common_vendor.p({
      options: $options.formattedSubjectOptions,
      placeholder: "选择考研科目",
      disabled: !$data.selectedMajor,
      searchable: true,
      ["search-placeholder"]: "搜索考研科目",
      modelValue: $data.selectedSubject
    }),
    l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/cascade-container/cascade-container.js.map
