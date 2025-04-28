"use strict";
const common_vendor = require("./common/vendor.js");
const ChoiceSelected = () => "./components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  name: "FilterSection",
  components: {
    ChoiceSelected
  },
  props: {
    schoolIndex: new UTSJSONObject({
      type: Number,
      default: -1
    }),
    schoolList: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    }),
    majorIndex: new UTSJSONObject({
      type: Number,
      default: -1
    }),
    majorList: new UTSJSONObject({
      type: Array,
      default: () => {
        return [];
      }
    })
  },
  methods: new UTSJSONObject({
    /**
     * @description 学校选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onSchoolClick(position = null) {
      this.$emit("schoolChange", position);
    },
    /**
     * @description 专业选择事件处理
     * @param {Number} position - 选择的索引位置
     */
    onMajorClick(position = null) {
      this.$emit("majorChange", position);
    },
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onSchoolSearch(keyword = null) {
      this.$emit("schoolSearch", keyword);
    },
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    onMajorSearch(keyword = null) {
      this.$emit("majorSearch", keyword);
    },
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      if (this.$refs && this.$refs.schoolDropdown) {
        this.$refs.schoolDropdown.closeDropdown && this.$refs.schoolDropdown.closeDropdown();
      }
      if (this.$refs && this.$refs.majorDropdown) {
        this.$refs.majorDropdown.closeDropdown && this.$refs.majorDropdown.closeDropdown();
      }
    }
  })
});
if (!Array) {
  const _component_ChoiceSelected = common_vendor.resolveComponent("ChoiceSelected");
  _component_ChoiceSelected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("schoolDropdown", "874fd1f0-0"),
    b: common_vendor.o($options.onSchoolClick),
    c: common_vendor.o($options.onSchoolSearch),
    d: common_vendor.p({
      defaultText: "请选择学校",
      choiceIndex: $props.schoolIndex,
      choiceList: $props.schoolList,
      componentType: "undergraduate",
      mode: "search",
      searchPlaceholder: "输入学校名称"
    }),
    e: common_vendor.o(() => {
    }),
    f: common_vendor.sr("majorDropdown", "874fd1f0-1"),
    g: common_vendor.o($options.onMajorClick),
    h: common_vendor.o($options.onMajorSearch),
    i: common_vendor.p({
      defaultText: "请选择专业",
      choiceIndex: $props.majorIndex,
      choiceList: $props.majorList,
      componentType: "undergraduate",
      mode: "search",
      searchPlaceholder: "输入专业名称",
      enablePagination: false,
      debounce: 200
    }),
    j: common_vendor.o(() => {
    }),
    k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    l: common_vendor.o(() => {
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/FilterSection.js.map
