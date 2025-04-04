"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  name: "ChoiceSelected",
  data() {
    return {
      isShowChoice: false,
      dropdownTop: 0,
      dropdownLeft: 0,
      dropdownWidth: 0,
      displayContent: this.defaultText
      // 使用传入的默认文本
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
    }
  },
  watch: {
    choiceIndex(newVal = null) {
      if (newVal >= 0 && newVal < this.choiceList.length) {
        this.displayContent = this.choiceList[newVal].choiceItemContent;
      } else {
        this.displayContent = this.defaultText;
      }
    },
    defaultText(newVal = null) {
      if (this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) {
        this.displayContent = newVal;
      }
    }
  },
  methods: {
    // 选择
    btnChoiceClick: function(position = null) {
      var _this = this;
      _this.isShowChoice = false;
      _this.$emit("onChoiceClick", position);
    },
    // 显示与隐藏选择内容
    btnShowHideClick: function() {
      var _this = this;
      if (_this.isShowChoice) {
        _this.isShowChoice = false;
      } else {
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
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.displayContent),
    b: $data.isShowChoice ? 1 : "",
    c: common_assets._imports_0,
    d: common_vendor.sei("r0-83613ed8", "view", "dropdownTrigger"),
    e: common_vendor.n($data.isShowChoice ? "drop-down-box-selected" : "drop-down-box"),
    f: common_vendor.o((...args) => $options.btnShowHideClick && $options.btnShowHideClick(...args)),
    g: $data.isShowChoice
  }, $data.isShowChoice ? {
    h: common_vendor.f($props.choiceList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.choiceItemContent),
        b: $props.choiceIndex == index ? 1 : "",
        c: item.choiceItemId,
        d: common_vendor.o(($event) => $options.btnChoiceClick(index), item.choiceItemId)
      };
    }),
    i: $data.isShowChoice ? 1 : "",
    j: $data.dropdownTop + "px",
    k: $data.dropdownLeft + "px",
    l: $data.dropdownWidth + "px"
  } : {}, {
    m: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/combobox/combobox.js.map
