"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "EnhancedDropdown",
  props: {
    // 选项列表
    options: {
      type: Array,
      default: () => {
        return [];
      },
      validator: (value = null) => {
        return value.every((item = null) => {
          return item.label && item.value !== void 0;
        });
      }
    },
    // 当前值（支持多选）
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: null
    },
    // 占位文本
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 是否可搜索
    searchable: {
      type: Boolean,
      default: false
    },
    // 搜索框占位文本
    searchPlaceholder: {
      type: String,
      default: "搜索..."
    },
    // 无数据时显示的文本
    emptyText: {
      type: String,
      default: "无匹配数据"
    },
    // 是否自动关闭下拉菜单
    autoClose: {
      type: Boolean,
      default: true
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选时最大选择数量
    maxSelections: {
      type: Number,
      default: null
    },
    // 是否分组显示
    grouped: {
      type: Boolean,
      default: false
    },
    // 自定义显示值的格式化函数
    displayFormatter: {
      type: Function,
      default: null
    },
    // 是否收集完整数据（而不仅仅是value）
    collectFullData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      searchText: "",
      selectedValue: this.value,
      selectedItems: Array.isArray(this.value) ? [...this.value] : this.value ? [this.value] : [],
      tempSelection: null
    };
  },
  computed: {
    /**
     * @description 显示的值（支持自定义格式化）
     * @returns {String} 格式化后的显示文本
     */
    displayValue() {
      if (this.displayFormatter) {
        return this.displayFormatter(this.selectedItems);
      }
      if (this.multiple) {
        return this.selectedItems.length > 0 ? this.selectedItems.map((item = null) => {
          if (typeof item === "object" && item.label) {
            return item.label;
          } else {
            const option = UTS.arrayFind(this.options, (opt = null) => {
              return opt.value === item;
            });
            return option ? option.label : item;
          }
        }).join(", ") : "";
      }
      if (this.selectedItems.length > 0) {
        const item = this.selectedItems[0];
        if (typeof item === "object" && item.label) {
          return item.label;
        } else {
          const option = UTS.arrayFind(this.options, (opt = null) => {
            return opt.value === item;
          });
          return option ? option.label : item;
        }
      }
      return "";
    },
    /**
     * @description 过滤后的选项
     * @returns {Array} 过滤后的选项列表
     */
    filteredOptions() {
      if (!this.searchText)
        return this.options;
      const searchText = this.searchText.toLowerCase();
      return this.options.filter((item = null) => {
        return item.label.toLowerCase().includes(searchText) || item.tags && item.tags.some((tag = null) => {
          return tag.toLowerCase().includes(searchText);
        });
      });
    },
    /**
     * @description 分组后的选项
     * @returns {Object} 分组后的选项对象
     */
    groupedOptions() {
      if (!this.grouped)
        return {};
      return this.filteredOptions.reduce((groups = null, item = null) => {
        const groupName = item.group || "";
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(item);
        return groups;
      }, {});
    },
    /**
     * @description 是否显示空状态
     * @returns {Boolean} 是否显示空状态
     */
    showEmpty() {
      if (this.grouped) {
        return Object.keys(this.groupedOptions).length === 0;
      }
      return this.filteredOptions.length === 0;
    }
  },
  watch: {
    value(newVal = null) {
      if (this.multiple) {
        this.selectedItems = Array.isArray(newVal) ? [...newVal] : [];
      } else {
        this.selectedItems = newVal ? [newVal] : [];
      }
    }
  },
  methods: {
    /**
     * @description 切换下拉框状态
     */
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchText = "";
        this.tempSelection = null;
      }
    },
    /**
     * @description 关闭下拉框
     */
    closeDropdown() {
      this.isOpen = false;
    },
    /**
     * @description 判断项目是否被选中
     * @param {Object} item - 需要判断的选项
     * @returns {Boolean} 是否选中
     */
    isItemSelected(item = null) {
      return this.selectedItems.some((selected = null) => {
        return this.compareItems(selected, item);
      });
    },
    /**
     * @description 比较两个项目是否相同
     * @param {Object} item1 - 第一个项目
     * @param {Object} item2 - 第二个项目
     * @returns {Boolean} 是否相同
     */
    compareItems(item1 = null, item2 = null) {
      if (typeof item1 === "object" && typeof item2 === "object") {
        return item1.value === item2.value;
      }
      return item1 === item2;
    },
    /**
     * @description 选择项目
     * @param {Object} item - 选择的项目
     */
    selectItem(item = null) {
      if (this.multiple) {
        this.handleMultipleSelection(item);
      } else {
        this.handleSingleSelection(item);
      }
    },
    /**
     * @description 处理单选
     * @param {Object} item - 选择的项目
     */
    handleSingleSelection(item = null) {
      this.selectedItems = [this.collectFullData ? item : item.value];
      this.emitChanges();
      if (this.autoClose) {
        this.closeDropdown();
      }
    },
    /**
     * @description 处理多选
     * @param {Object} item - 选择的项目
     */
    handleMultipleSelection(item = null) {
      const itemValue = this.collectFullData ? item : item.value;
      const index = this.selectedItems.findIndex((selected = null) => {
        return this.compareItems(selected, itemValue);
      });
      if (index >= 0) {
        this.selectedItems.splice(index, 1);
        this.emitChanges();
      } else {
        if (this.maxSelections && this.selectedItems.length >= this.maxSelections) {
          common_vendor.index.showToast({
            title: `最多选择 ${this.maxSelections} 项`,
            icon: "none"
          });
          return null;
        }
        this.selectedItems.push(itemValue);
        this.emitChanges();
      }
    },
    /**
     * @description 确认多选
     */
    confirmSelection() {
      this.closeDropdown();
    },
    /**
     * @description 取消多选
     */
    cancelSelection() {
      if (this.value) {
        this.selectedItems = Array.isArray(this.value) ? [...this.value] : [this.value];
      } else {
        this.selectedItems = [];
      }
      this.emitChanges();
      this.closeDropdown();
    },
    /**
     * @description 触发变更事件
     */
    emitChanges() {
      if (this.multiple) {
        const values = this.selectedItems.map((item = null) => {
          return this.collectFullData ? item : item.value;
        });
        this.$emit("input", values);
        this.$emit("change", this.selectedItems);
      } else {
        const value = this.selectedItems.length > 0 ? this.collectFullData ? this.selectedItems[0] : this.selectedItems[0].value : null;
        this.$emit("input", value);
        this.$emit("change", this.selectedItems[0] || null);
      }
    },
    /**
     * @description 处理搜索
     */
    handleSearch() {
    },
    /**
     * @description 获取当前选中的数据（完整对象或值）
     * @returns {Any} 选中的数据
     */
    getSelectedData() {
      if (this.multiple) {
        return this.collectFullData ? this.selectedItems : this.selectedItems.map((item = null) => {
          return item.value;
        });
      }
      return this.selectedItems.length > 0 ? this.collectFullData ? this.selectedItems[0] : this.selectedItems[0].value : null;
    },
    /**
     * @description 获取当前搜索条件
     * @returns {String} 搜索条件
     */
    getSearchCondition() {
      return this.searchable ? this.searchText : "";
    },
    /**
     * @description 获取选中的原始数据（总是返回完整对象）
     * @returns {Any} 选中的原始数据
     */
    getSelectedRawData() {
      if (this.multiple) {
        return this.selectedItems.map((item = null) => {
          return typeof item === "object" ? item : UTS.arrayFind(this.options, (opt = null) => {
            return opt.value === item;
          });
        }).filter(Boolean);
      }
      return this.selectedItems.length > 0 ? typeof this.selectedItems[0] === "object" ? this.selectedItems[0] : UTS.arrayFind(this.options, (opt = null) => {
        return opt.value === this.selectedItems[0];
      }) : null;
    },
    /**
     * @description 获取可用于提交给后端的数据
     * @returns {Any} 后端数据
     */
    getPayloadData() {
      const data = this.getSelectedRawData();
      if (data === null)
        return null;
      if (Array.isArray(data)) {
        return data.map((item = null) => {
          return this.transformItemForBackend(item);
        });
      }
      return this.transformItemForBackend(data);
    },
    /**
     * @description 转换单个项目为后端需要的格式
     * @param {Object} item - 项目对象
     * @returns {Object} 转换后的对象
     */
    transformItemForBackend(item = null) {
      if (!item)
        return null;
      return new UTSJSONObject(Object.assign(
        { id: item.value, name: item.label },
        item.metadata
        // 包含任何额外的元数据
      ));
    },
    /**
     * @description 重置选择
     */
    reset() {
      this.selectedItems = [];
      this.searchText = "";
      this.emitChanges();
    },
    /**
     * @description 清空搜索
     */
    clearSearch() {
      this.searchText = "";
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.displayValue || $props.placeholder),
    b: common_vendor.t($data.isOpen ? "▲" : "▼"),
    c: common_vendor.o((...args) => $options.toggleDropdown && $options.toggleDropdown(...args)),
    d: $data.isOpen
  }, $data.isOpen ? common_vendor.e({
    e: $props.searchable
  }, $props.searchable ? {
    f: $props.searchPlaceholder,
    g: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.handleSearch && $options.handleSearch(...args)]),
    h: $data.searchText
  } : {}, {
    i: $props.grouped
  }, $props.grouped ? {
    j: common_vendor.f($options.groupedOptions, (group, groupName, i0) => {
      return common_vendor.e({
        a: groupName
      }, groupName ? {
        b: common_vendor.t(groupName)
      } : {}, {
        c: common_vendor.f(group, (item, index, i1) => {
          return common_vendor.e({
            a: item.icon
          }, item.icon ? {
            b: common_vendor.t(item.icon)
          } : {}, {
            c: common_vendor.t(item.label),
            d: item.tags
          }, item.tags ? {
            e: common_vendor.f(item.tags, (tag, ti, i2) => {
              return {
                a: common_vendor.t(tag),
                b: ti
              };
            })
          } : {}, {
            f: $options.isItemSelected(item)
          }, $options.isItemSelected(item) ? {} : $props.multiple && item === $data.tempSelection ? {} : {}, {
            g: $props.multiple && item === $data.tempSelection,
            h: index,
            i: common_vendor.o(($event) => $options.selectItem(item), index)
          });
        }),
        d: groupName
      });
    })
  } : {
    k: common_vendor.f($options.filteredOptions, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon
      }, item.icon ? {
        b: common_vendor.t(item.icon)
      } : {}, {
        c: common_vendor.t(item.label),
        d: item.tags
      }, item.tags ? {
        e: common_vendor.f(item.tags, (tag, ti, i1) => {
          return {
            a: common_vendor.t(tag),
            b: ti
          };
        })
      } : {}, {
        f: $options.isItemSelected(item)
      }, $options.isItemSelected(item) ? {} : $props.multiple && item === $data.tempSelection ? {} : {}, {
        g: $props.multiple && item === $data.tempSelection,
        h: index,
        i: common_vendor.o(($event) => $options.selectItem(item), index)
      });
    })
  }, {
    l: $options.showEmpty
  }, $options.showEmpty ? {
    m: common_vendor.t($props.emptyText)
  } : {}, {
    n: $props.multiple && $data.selectedItems.length > 0
  }, $props.multiple && $data.selectedItems.length > 0 ? {
    o: common_vendor.t($data.selectedItems.length),
    p: common_vendor.o((...args) => $options.confirmSelection && $options.confirmSelection(...args)),
    q: common_vendor.o((...args) => $options.cancelSelection && $options.cancelSelection(...args))
  } : {}, {
    r: common_vendor.o((...args) => $options.closeDropdown && $options.closeDropdown(...args)),
    s: common_vendor.o(() => {
    }),
    t: common_vendor.o((...args) => $options.closeDropdown && $options.closeDropdown(...args))
  }) : {}, {
    v: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a531acfb"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/combobox/combobox.js.map
