"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    pageName: {
      type: String,
      default: "index"
    }
  },
  data() {
    return {
      /**
       * @description 页面路径映射
       */
      tabRoutes: new UTSJSONObject({
        "index": router_Router.IndexRoutes.INDEX,
        "message": router_Router.MessageRoutes.MESSAGE,
        "mine": router_Router.MineRoutes.MINE_COMMON
      })
    };
  },
  methods: {
    /**
     * @description 切换到指定页面
     * @param {string} page - 页面名称
     */
    switchPage(page = null) {
      if (page === this.pageName) {
        return null;
      }
      if (!this.tabRoutes[page]) {
        common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.uvue:58", "页面不存在:", page);
        return null;
      }
      try {
        switch (page) {
          case "index":
            router_Router.Navigator.switchTab(router_Router.IndexRoutes.INDEX);
            break;
          case "message":
            router_Router.Navigator.switchTab(router_Router.MessageRoutes.MESSAGE);
            break;
          case "mine":
            router_Router.Navigator.switchTab(router_Router.MineRoutes.MINE_COMMON);
            break;
          default:
            common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.uvue:75", "未知的页面类型:", page);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.uvue:78", "Tab切换失败:", e);
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.pageName === "index" ? "/static/image/tab-bar/home_24dp_active.svg" : "/static/image/tab-bar/home_24dp_E3E3E3.svg",
    b: $props.pageName === "index" ? 1 : "",
    c: common_vendor.o(($event) => $options.switchPage("index")),
    d: $props.pageName === "message" ? "/static/image/tab-bar/mail_outline_24dp_active.svg" : "/static/image/tab-bar/mail_outline_24dp_E3E3E3.svg",
    e: $props.pageName === "message" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchPage("message")),
    g: $props.pageName === "mine" ? "/static/image/tab-bar/person_24dp_active.svg" : "/static/image/tab-bar/person_24dp_E3E3E3.svg",
    h: $props.pageName === "mine" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchPage("mine")),
    j: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tab-bar/tab-bar.js.map
