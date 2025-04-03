"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      userRole: "",
      userName: "",
      userData: new UTSJSONObject({})
    };
  },
  onLoad() {
    this.userRole = common_vendor.index.getStorageSync("userRole");
    this.loadUserData();
  },
  methods: {
    /**
     * @description 加载用户数据
     */
    loadUserData() {
    }
  }
});
if (!Array) {
  const _component_include = common_vendor.resolveComponent("include");
  _component_include();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userName),
    b: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    c: common_vendor.p({
      src: "./teacher_order.uvue"
    })
  } : $data.userRole === "student" ? {
    e: common_vendor.p({
      src: "./student_order.uvue"
    })
  } : {}, {
    d: $data.userRole === "student",
    f: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/order/order_common.js.map
