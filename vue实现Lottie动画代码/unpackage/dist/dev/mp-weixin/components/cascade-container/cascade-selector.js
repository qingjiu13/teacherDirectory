"use strict";
const common_vendor = require("../../common/vendor.js");
const choiceSelected = () => "../combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  name: "CascadeSelector",
  components: {
    choiceSelected
  },
  props: {
    /**
     * 选项列表
     * @type {Array}
     * @default []
     */
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * 是否禁用
     * @type {Boolean}
     * @default false
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 占位文本
     * @type {String}
     * @default '请选择'
     */
    placeholder: {
      type: String,
      default: "请选择"
    },
    /**
     * 选中的值
     * @type {String|Number}
     * @default ''
     */
    value: {
      type: [String, Number],
      default: ""
    },
    /**
     * 是否支持搜索
     * @type {Boolean}
     * @default false
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * 搜索框占位文本
     * @type {String}
     * @default '搜索'
     */
    searchPlaceholder: {
      type: String,
      default: "搜索"
    },
    /**
     * 下拉框宽度
     * @type {String}
     * @default '100%'
     */
    width: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      selectedIndex: -1,
      searchKeyword: ""
    };
  },
  computed: {
    /**
     * 格式化选项，将options转换为combobox需要的格式
     * @returns {Array} 格式化后的选项列表
     */
    formattedOptions() {
      return this.options.map((item = null) => {
        return new UTSJSONObject({
          choiceItemId: item.value,
          choiceItemContent: item.label,
          choiceItemValue: item.value
        });
      });
    }
  },
  watch: {
    /**
     * 监听value变化，更新选中索引
     */
    value: {
      handler(newVal = null) {
        if (newVal) {
          const index = this.options.findIndex((item = null) => {
            return item.value === newVal;
          });
          this.selectedIndex = index;
        } else {
          this.selectedIndex = -1;
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.value) {
      const index = this.options.findIndex((item = null) => {
        return item.value === this.value;
      });
      this.selectedIndex = index;
    }
  },
  methods: {
    /**
     * 选择选项
     * @param {Number} index 选项索引
     */
    selectOption(index = null) {
      this.selectedIndex = index;
      const item = this.options[index];
      if (item) {
        this.$emit("input", item.value);
        this.$emit("change", item);
      }
    },
    /**
     * 搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSearch(keyword = null) {
      this.searchKeyword = keyword;
      this.$emit("search", keyword);
    },
    /**
     * 关闭下拉框
     */
    closeDropdown() {
      if (this.$refs.comboboxRef && this.$refs.comboboxRef.closeDropdown) {
        this.$refs.comboboxRef.closeDropdown();
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
    a: common_vendor.sr("comboboxRef", "a9af0ce4-0"),
    b: common_vendor.o($options.selectOption),
    c: common_vendor.o($options.onSearch),
    d: common_vendor.p({
      defaultText: $props.placeholder,
      choiceIndex: $data.selectedIndex,
      choiceList: $options.formattedOptions,
      mode: $props.searchable ? "search" : "select",
      searchPlaceholder: $props.searchPlaceholder,
      disabled: $props.disabled
    }),
    e: common_vendor.sei(_ctx.virtualHostId, "view"),
    f: $props.width
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/cascade-container/cascade-selector.js.map
