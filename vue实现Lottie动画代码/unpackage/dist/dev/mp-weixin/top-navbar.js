"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent(new UTSJSONObject({
  name: "top-navbar",
  data() {
    return {
      tabs: [
        new UTSJSONObject({ name: "待预约", id: "tab1" }),
        new UTSJSONObject({ name: "已预约", id: "tab2" }),
        new UTSJSONObject({ name: "已完成", id: "tab3" })
      ],
      currentTab: 0
    };
  },
  methods: new UTSJSONObject({
    // 切换Tab
    switchTab(index = null) {
      this.currentTab = index;
      this.$emit("change", index);
    }
  })
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: common_vendor.sei("tab-" + index, "view"),
        c: index,
        d: $data.currentTab === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: "tab-" + $data.currentTab,
    c: $data.currentTab === 0
  }, $data.currentTab === 0 ? {} : $data.currentTab === 1 ? {} : $data.currentTab === 2 ? {} : {}, {
    d: $data.currentTab === 1,
    e: $data.currentTab === 2,
    f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/top-navbar.js.map
