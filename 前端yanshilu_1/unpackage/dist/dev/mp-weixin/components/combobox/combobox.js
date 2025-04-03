"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  name: "ChoiceSelected",
  data() {
    return {
      isShowChoice: false
    };
  },
  props: {
    choiceIndex: {},
    choiceList: {},
    choiceContent: {}
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
        _this.isShowChoice = true;
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.choiceContent),
    b: common_assets._imports_0,
    c: common_vendor.n($data.isShowChoice ? "drop-down-box-selected" : "drop-down-box"),
    d: common_vendor.o((...args) => $options.btnShowHideClick && $options.btnShowHideClick(...args)),
    e: $data.isShowChoice
  }, $data.isShowChoice ? {
    f: common_vendor.f($props.choiceList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.choiceItemContent),
        b: common_vendor.n($props.choiceIndex == index ? "dialog-title-selected" : "dialog-title"),
        c: item.choiceItemId,
        d: common_vendor.o(($event) => $options.btnChoiceClick(index), item.choiceItemId)
      };
    })
  } : {}, {
    g: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/combobox/combobox.js.map
