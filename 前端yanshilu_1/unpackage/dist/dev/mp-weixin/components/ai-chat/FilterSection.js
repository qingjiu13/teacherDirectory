"use strict";
const common_vendor = require("../../common/vendor.js");
const choiceSelected = () => "../combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  name: "FilterSection",
  components: {
    choiceSelected
  },
  props: {
    schoolIndex: {
      type: Number,
      default: -1
    },
    schoolList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    majorIndex: {
      type: Number,
      default: -1
    },
    majorList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
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
  }
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  _component_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("schoolDropdown", "4e509468-0"),
    b: common_vendor.o($options.onSchoolClick),
    c: common_vendor.o($options.onSchoolSearch),
    d: common_vendor.p({
      defaultText: "请选择学校",
      choiceIndex: $props.schoolIndex,
      choiceList: $props.schoolList,
      mode: "search",
      searchPlaceholder: "搜索学校"
    }),
    e: common_vendor.sr("majorDropdown", "4e509468-1"),
    f: common_vendor.o($options.onMajorClick),
    g: common_vendor.p({
      defaultText: "请选择专业",
      choiceIndex: $props.majorIndex,
      choiceList: $props.majorList
    }),
    h: common_vendor.sei(_ctx.virtualHostId, "view"),
    i: common_vendor.o(() => {
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ai-chat/FilterSection.js.map
