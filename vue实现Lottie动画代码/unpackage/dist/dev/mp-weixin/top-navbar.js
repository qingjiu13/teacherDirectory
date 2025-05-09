"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "top-navbar",
  props: {
    // 用户角色
    userRole: {
      type: String,
      default: "student"
    },
    // 导航栏高度
    navHeight: {
      type: Number,
      default: 60
    },
    // 自定义标签页
    customTabs: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      studentTabs: [
        new UTSJSONObject({ name: "待预约", id: "tab1" }),
        new UTSJSONObject({ name: "待开始", id: "tab2" }),
        new UTSJSONObject({ name: "已完成", id: "tab3" })
      ],
      teacherTabs: [
        new UTSJSONObject({ name: "待接受", id: "tab1" }),
        new UTSJSONObject({ name: "进行中", id: "tab2" }),
        new UTSJSONObject({ name: "已完成", id: "tab3" })
      ],
      currentTab: 0
    };
  },
  computed: {
    // 根据角色或自定义标签返回显示的标签列表
    tabList() {
      if (this.customTabs) {
        return this.customTabs;
      }
      return this.userRole === "teacher" ? this.teacherTabs : this.studentTabs;
    }
  },
  methods: {
    // 切换Tab
    switchTab(index = null) {
      this.currentTab = index;
      this.$emit("change", index);
    },
    // 重置Tab
    resetTab() {
      this.currentTab = 0;
    }
  },
  watch: {
    // 监听角色变化，重置标签页
    userRole() {
      this.resetTab();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($options.tabList, (tab, index, i0) => {
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
