"use strict";
const common_vendor = require("../../common/vendor.js");
const choiceSelected = () => "../../components/combobox/combobox.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    choiceSelected
  },
  data() {
    return {
      choiceList: [new UTSJSONObject({
        choiceItemId: "0",
        choiceItemContent: "请选择"
      }), new UTSJSONObject({
        choiceItemId: "P",
        choiceItemContent: "苹果"
      }), new UTSJSONObject({
        choiceItemId: "L",
        choiceItemContent: "荔枝"
      }), new UTSJSONObject({
        choiceItemId: "X",
        choiceItemContent: "西瓜"
      }), new UTSJSONObject({
        choiceItemId: "H",
        choiceItemContent: "哈密瓜"
      })],
      choiceContent: "请选择",
      choiceIndex: 0
      //选择位置
    };
  },
  methods: {
    // 修改选择的数据
    onChoiceClick: function(position = null) {
      common_vendor.index.__f__("log", "at pages/AI/AI.uvue:46", "+++++++" + position);
      var _this = this;
      _this.choiceIndex = position;
      _this.choiceContent = _this.choiceList[position].choiceItemContent;
    }
  }
});
if (!Array) {
  const _component_choice_selected = common_vendor.resolveComponent("choice-selected");
  _component_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onChoiceClick),
    b: common_vendor.p({
      choiceContent: $data.choiceContent,
      choiceIndex: $data.choiceIndex,
      choiceList: $data.choiceList
    }),
    c: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
