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
      isFocused: false,
      lastSelectedValue: null,
      // 分页相关
      pageSize: 10,
      currentPage: 1,
      isLoadingMore: false,
      hasMoreItems: true
      // 是否还有更多数据
    };
  },
  props: new UTSJSONObject({
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
    },
    // 新增属性：组件类型，用于区分不同数据模式
    componentType: {
      type: String,
      default: "default",
      validator: (value = null) => {
        return ["default", "undergraduate", "graduateSchool", "graduateMajor"].includes(value);
      }
    },
    // 新增属性：父级选择的值，用于联动模式
    parentValue: {
      type: [String, Object, Number],
      default: null
    },
    // 新增属性：是否属于联动模式
    isLinkage: {
      type: Boolean,
      default: false
    },
    // 新增属性：是否自动关闭其他下拉框
    autoCloseOthers: {
      type: Boolean,
      default: true
    },
    // 新增属性：是否启用分页加载功能
    enablePagination: {
      type: Boolean,
      default: true
    }
  }),
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
  computed: new UTSJSONObject({
    /**
     * @description 获取当前页的选项列表
     * @returns {Array} 分页后的选项列表
     */
    pagedChoiceList() {
      if (!this.enablePagination) {
        return this.choiceList;
      }
      const startIndex = 0;
      const endIndex = this.currentPage * this.pageSize;
      return this.choiceList.slice(startIndex, endIndex);
    }
  }),
  watch: {
    choiceIndex(newVal = null) {
      if (newVal >= 0 && newVal < this.choiceList.length) {
        const selectedItem = this.choiceList[newVal];
        this.displayContent = typeof selectedItem === "string" ? selectedItem : selectedItem.choiceItemContent;
        this.lastSelectedValue = selectedItem;
        if (this.mode === "search") {
          this.searchKeyword = typeof selectedItem === "string" ? selectedItem : selectedItem.choiceItemContent;
        }
        if (this.componentType === "graduateSchool") {
          this.$emit("linkage-change", selectedItem);
        }
      } else {
        this.displayContent = this.defaultText;
        this.lastSelectedValue = null;
        if (this.mode === "search") {
          this.searchKeyword = "";
        }
        if (this.componentType === "graduateSchool") {
          this.$emit("linkage-change", null);
        }
      }
    },
    defaultText(newVal = null) {
      if (this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) {
        this.displayContent = newVal;
      }
    },
    // 监听父级选择变化，适用于联动模式
    parentValue(newVal = null) {
      if (this.isLinkage && this.componentType === "graduateMajor") {
        this.searchKeyword = "";
        this.displayContent = this.defaultText;
        this.$emit("reset-selection");
      }
    },
    // 监听选项列表变化，重新计算显示内容
    choiceList() {
      this.updateDisplayContent();
    },
    // 监听搜索关键词变化，重置分页
    searchKeyword() {
      this.resetPagination();
    }
  },
  methods: new UTSJSONObject({
    /**
     * @description 重置分页状态
     */
    resetPagination() {
      this.currentPage = 1;
      this.isLoadingMore = false;
      this.hasMoreItems = this.choiceList.length > this.pageSize;
    },
    /**
     * @description 加载更多数据
     */
    loadMore() {
      if (!this.hasMoreItems || this.isLoadingMore)
        return null;
      this.isLoadingMore = true;
      setTimeout(() => {
        this.currentPage++;
        this.isLoadingMore = false;
        this.hasMoreItems = this.choiceList.length > this.currentPage * this.pageSize;
      }, 300);
    },
    /**
     * @description 处理滚动到底部事件
     */
    onScrollToBottom() {
      if (this.enablePagination) {
        this.loadMore();
      }
    },
    /**
     * @description 查找选项在原始列表中的索引
     * @param {*} item - 选项项
     * @returns {Number} 原始索引位置
     */
    findOriginalIndex(item = null) {
      if (typeof item === "string") {
        return this.choiceList.findIndex((originalItem = null) => {
          return typeof originalItem === "string" && originalItem === item;
        });
      } else if (item && item.choiceItemId) {
        return this.choiceList.findIndex((originalItem = null) => {
          return originalItem && originalItem.choiceItemId && originalItem.choiceItemId === item.choiceItemId;
        });
      }
      return -1;
    },
    /**
     * @description 更新显示内容，在选项列表变化时调用
     */
    updateDisplayContent() {
      if (this.choiceIndex >= 0 && this.choiceIndex < this.choiceList.length) {
        const selectedItem = this.choiceList[this.choiceIndex];
        this.displayContent = typeof selectedItem === "string" ? selectedItem : selectedItem.choiceItemContent;
      } else {
        this.displayContent = this.defaultText;
      }
    },
    /**
     * @description 处理选项点击事件，关闭下拉框并触发选择事件
     * @param {Number} position - 选中项的索引位置
     */
    btnChoiceClick: function(position = null) {
      var _this = this;
      _this.isShowChoice = false;
      const selectedItem = _this.pagedChoiceList[position];
      if (_this.mode === "search" && _this.searchKeyword) {
        if (typeof selectedItem === "string") {
          const originalIndex = _this.choiceList.findIndex((item = null) => {
            return typeof item === "string" && item === selectedItem;
          });
          if (originalIndex !== -1) {
            _this.$emit("onChoiceClick", originalIndex, selectedItem);
            return null;
          }
        } else if (selectedItem && selectedItem.choiceItemId) {
          const originalIndex = _this.choiceList.findIndex((item = null) => {
            return item && item.choiceItemId && item.choiceItemId === selectedItem.choiceItemId;
          });
          if (originalIndex !== -1) {
            _this.$emit("onChoiceClick", originalIndex, selectedItem);
            return null;
          }
        }
      }
      _this.$emit("onChoiceClick", position, selectedItem);
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
        if (this.autoCloseOthers) {
          this.closeOtherDropdowns();
        }
        this.resetPagination();
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
        common_vendor.index.__f__("log", "at components/combobox/combobox.vue:384", "发送搜索请求:", _this.searchKeyword);
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
    },
    /**
     * @description 重置组件状态
     * @public 供外部调用
     */
    reset() {
      this.searchKeyword = "";
      this.displayContent = this.defaultText;
      this.isShowChoice = false;
      this.lastSelectedValue = null;
      this.resetPagination();
      this.$emit("reset-selection");
    },
    /**
     * @description 获取当前选中的值
     * @returns {*} 当前选中的值
     * @public 供外部调用
     */
    getSelectedValue() {
      if (this.choiceIndex >= 0 && this.choiceIndex < this.choiceList.length) {
        return this.choiceList[this.choiceIndex];
      }
      return null;
    }
  })
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
    i: common_assets._imports_0$1,
    j: common_vendor.sei("r0-4c16e9dc", "view", "dropdownTrigger"),
    k: common_vendor.n($data.isShowChoice ? "drop-down-box-selected" : "drop-down-box"),
    l: common_vendor.o((...args) => $options.btnShowHideClick && $options.btnShowHideClick(...args)),
    m: $data.isShowChoice
  }, $data.isShowChoice ? common_vendor.e({
    n: $options.pagedChoiceList.length > 0
  }, $options.pagedChoiceList.length > 0 ? {
    o: common_vendor.f($options.pagedChoiceList, (item, index, i0) => {
      return {
        a: common_vendor.t(typeof item === "string" ? item : item.choiceItemContent),
        b: $props.choiceIndex == $options.findOriginalIndex(item) ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.btnChoiceClick(index), index)
      };
    })
  } : {}, {
    p: $data.isLoadingMore
  }, $data.isLoadingMore ? {} : {}, {
    q: common_vendor.sei("r1-4c16e9dc", "scroll-view", "scrollView"),
    r: common_vendor.o((...args) => $options.onScrollToBottom && $options.onScrollToBottom(...args)),
    s: $data.isShowChoice ? 1 : "",
    t: $data.dropdownTop + "px",
    v: $data.dropdownLeft + "px",
    w: $data.dropdownWidth + "px",
    x: common_vendor.o(() => {
    })
  }) : {}, {
    y: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    z: common_vendor.o(() => {
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/combobox/combobox.js.map
