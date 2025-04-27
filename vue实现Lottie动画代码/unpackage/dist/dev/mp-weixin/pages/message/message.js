"use strict";
const common_vendor = require("../../common/vendor.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  components: {
    TabBar
  },
  data() {
    return {
      // 消息数据
    };
  },
  onLoad() {
  },
  methods: new UTSJSONObject({
    /**
     * @description 加载消息列表
     */
    loadMessages() {
    }
  })
}));
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      pageName: "message"
    }),
    b: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
