"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
let dropdownInstances = [];
const _sfc_main = common_vendor.defineComponent({
  name: "ChoiceSelected",
  data() {
    return {
      isShowChoice: false,
      dropdownTop: 0,
      dropdownLeft: 0,
      dropdownWidth: 0,
      displayContent: this.defaultText,
      searchKeyword: "",
      searchTimer: null,
      filteredList: [],
      isFocused: false
      // 是否处于聚焦状态
    };
  },
  props: {
    choiceIndex: {
      type: Number,
      default: -1
      // 默认-1表示未选择
    },
    choiceList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    defaultText: {
      type: String,
      default: "请选择"
    },
    mode: {
      type: String,
      default: "select",
      validator: (value = null) => {
        return ["select", "search"].includes(value);
      }
    },
    debounce: {
      type: Number,
      default: 300
    },
    searchPlaceholder: {
      type: String,
      default: "请输入关键词"
    }
  },
  created() {
    dropdownInstances.push(this);
  },
  beforeDestroy() {
    const index = dropdownInstances.indexOf(this);
    if (index > -1) {
      dropdownInstances.splice(index, 1);
    }
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },
  computed: {
    /**
     * @description 根据搜索关键词过滤选项列表
     * @returns {Array} 过滤后的选项列表
     */
    filteredChoiceList() {
      if (!this.searchKeyword || this.mode === "select") {
        return this.choiceList;
      }
      const keyword = this.searchKeyword.toLowerCase();
      return this.choiceList.filter((item = null) => {
        if (typeof item === "string") {
          return item.toLowerCase().includes(keyword);
        } else if (item && item.choiceItemContent) {
          return item.choiceItemContent.toLowerCase().includes(keyword);
        }
        return false;
      });
    }
  },
  watch: {
    choiceIndex(newVal = null) {
      if (newVal >= 0 && newVal < this.choiceList.length) {
        const selectedItem = this.choiceList[newVal];
        this.displayContent = typeof selectedItem === "string" ? selectedItem : selectedItem.choiceItemContent;
        if (this.mode === "search") {
          this.searchKeyword = typeof selectedItem === "string" ? selectedItem : selectedItem.choiceItemContent;
        }
      } else {
        this.displayContent = this.defaultText;
        if (this.mode === "search") {
          this.searchKeyword = "";
        }
      }
    },
    defaultText(newVal = null) {
      if (this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) {
        this.displayContent = newVal;
      }
    }
  },
  methods: {
    /**
     * @description 处理选项点击事件，关闭下拉框并触发选择事件
     * @param {Number} position - 选中项的索引位置
     */
    btnChoiceClick: function(position = null) {
      var _this = this;
      _this.isShowChoice = false;
      if (_this.mode === "search" && _this.searchKeyword) {
        const selectedItem = _this.filteredChoiceList[position];
        if (typeof selectedItem === "string") {
          const originalIndex = _this.choiceList.findIndex((item = null) => {
            return typeof item === "string" && item === selectedItem;
          });
          if (originalIndex !== -1) {
            _this.$emit("onChoiceClick", originalIndex);
            return null;
          }
        } else if (selectedItem && selectedItem.choiceItemId) {
          const originalIndex = _this.choiceList.findIndex((item = null) => {
            return item && item.choiceItemId && item.choiceItemId === selectedItem.choiceItemId;
          });
          if (originalIndex !== -1) {
            _this.$emit("onChoiceClick", originalIndex);
            return null;
          }
        }
      }
      _this.$emit("onChoiceClick", position);
    },
    /**
     * @description 切换下拉框的显示与隐藏状态
     * @param {Event} event - 点击事件对象
     */
    btnShowHideClick: function(event = null) {
      event.stopPropagation();
      var _this = this;
      if (_this.isShowChoice) {
        _this.isShowChoice = false;
      } else {
        this.closeOtherDropdowns();
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select(".drop-down-box, .drop-down-box-selected").boundingClientRect((data = null) => {
          if (data) {
            _this.dropdownTop = data.top + data.height;
            _this.dropdownLeft = data.left;
            _this.dropdownWidth = data.width;
            _this.isShowChoice = true;
          }
        }).exec();
      }
    },
    /**
     * @description 关闭其他下拉框，只保留当前实例的下拉框
     */
    closeOtherDropdowns() {
      dropdownInstances.forEach((instance) => {
        if (instance !== this && instance.isShowChoice) {
          instance.isShowChoice = false;
        }
      });
    },
    /**
     * @description 处理搜索输入事件，带防抖
     * @param {Event} event - 输入事件对象
     */
    onSearchInput(event = null) {
      const _this = this;
      if (_this.searchTimer) {
        clearTimeout(_this.searchTimer);
      }
      _this.searchTimer = setTimeout(() => {
        _this.$emit("search-input", _this.searchKeyword);
        if (!_this.isShowChoice) {
          _this.btnShowHideClick(event);
        }
      }, _this.debounce);
    },
    /**
     * @description 处理输入框聚焦事件
     * @param {Event} event - 聚焦事件对象
     */
    onInputFocus(event = null) {
      this.isFocused = true;
      event.stopPropagation();
      if (!this.isShowChoice) {
        this.btnShowHideClick(event);
      }
    },
    /**
     * @description 关闭当前下拉框
     * @public 供外部调用
     */
    closeDropdown() {
      if (this.isShowChoice) {
        this.isShowChoice = false;
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.mode === "select"
  }, $props.mode === "select" ? {
    b: common_vendor.t($data.displayContent),
    c: common_vendor.n($props.choiceIndex === -1 ? "input-placeholder" : "input-text")
  } : {
    d: $props.searchPlaceholder,
    e: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    f: common_vendor.o((...args) => $options.onInputFocus && $options.onInputFocus(...args)),
    g: $data.searchKeyword
  }, {
    h: $data.isShowChoice ? 1 : "",
<<<<<<< HEAD
    i: common_assets._imports_0$2,
    j: common_vendor.sei("r0-deccda20", "view", "dropdownTrigger"),
=======
    i: common_assets._imports_0$1,
    j: common_vendor.sei("r0-3004c378", "view", "dropdownTrigger"),
>>>>>>> a2bf9657a39810a133593f8de99b785a81f8875d
    k: common_vendor.n($data.isShowChoice ? "drop-down-box-selected" : "drop-down-box"),
    l: common_vendor.o((...args) => $options.btnShowHideClick && $options.btnShowHideClick(...args)),
    m: $data.isShowChoice
  }, $data.isShowChoice ? common_vendor.e({
    n: $options.filteredChoiceList.length > 0
  }, $options.filteredChoiceList.length > 0 ? {
    o: common_vendor.f($options.filteredChoiceList, (item, index, i0) => {
      return {
        a: common_vendor.t(typeof item === "string" ? item : item.choiceItemContent),
        b: $props.choiceIndex == index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.btnChoiceClick(index), index)
      };
    })
  } : {}, {
    p: $data.isShowChoice ? 1 : "",
    q: $data.dropdownTop + "px",
    r: $data.dropdownLeft + "px",
    s: $data.dropdownWidth + "px",
    t: common_vendor.o(() => {
    })
  }) : {}, {
    v: common_vendor.sei(_ctx.virtualHostId, "view"),
    w: common_vendor.o(() => {
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/combobox/combobox.js.map
