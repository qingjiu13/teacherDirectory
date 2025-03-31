"use strict";
const common_vendor = require("../../../common/vendor.js");
const TabBar = () => "../../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
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
  const _easycom_tab_bar2 = common_vendor.resolveComponent("tab-bar");
  (_component_include + _easycom_tab_bar2)();
}
const _easycom_tab_bar = () => "../../../components/tab-bar/tab-bar.js";
if (!Math) {
  _easycom_tab_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userName),
    b: $data.userRole === "teacher"
  }, $data.userRole === "teacher" ? {
    c: common_vendor.p({
      src: "./teacher_mine.uvue"
    })
  } : $data.userRole === "student" ? {
    e: common_vendor.p({
      src: "./student_mine.uvue"
    })
  } : {}, {
    d: $data.userRole === "student",
    f: common_vendor.p({
      pageName: "mine"
    }),
    g: common_vendor.sei(_ctx.virtualHostId, "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/mine/mine_common.js.map
