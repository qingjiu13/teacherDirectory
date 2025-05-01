"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    pageName: new UTSJSONObject({
      type: String,
      default: "index"
    })
  },
  data() {
    return {
      /**
       * @description 页面路径映射
       */
      tabRoutes: new UTSJSONObject({
        "index": router_Router.IndexRoutes.INDEX,
        "AI": router_Router.AIRoutes.AI_SERVER,
        "message": router_Router.MessageRoutes.MESSAGE,
        "mine": router_Router.MineRoutes.MINE
      }),
      /**
       * @description 页面图标路径映射
       */
      iconPaths: new UTSJSONObject({
        "index": new UTSJSONObject({
          normal: "/static/image/tab-bar/wechat.png",
          active: "/static/image/tab-bar/default_avatar.png"
        }),
        "AI": new UTSJSONObject({
          normal: "/static/image/tab-bar/wechat.png",
          active: "/static/image/tab-bar/default_avatar.png"
        }),
        "message": new UTSJSONObject({
          normal: "/static/image/tab-bar/wechat.png",
          active: "/static/image/tab-bar/default_avatar.png"
        }),
        "mine": new UTSJSONObject({
          normal: "/static/image/tab-bar/wechat.png",
          active: "/static/image/tab-bar/default_avatar.png"
        })
      })
    };
  },
  methods: new UTSJSONObject({
    /**
     * @description 获取页面对应的图标路径
     * @param {string} page - 页面名称
     * @returns {string} 图标路径
     */
    getIconPath(page = null) {
      const isActive = page === this.pageName;
      const iconConfig = this.iconPaths[page];
      return isActive ? iconConfig.active : iconConfig.normal;
    },
    /**
     * @description 切换到指定页面
     * @param {string} page - 页面名称
     */
    switchPage(page = null) {
      if (page === this.pageName) {
        return null;
      }
      if (!this.tabRoutes[page]) {
        common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.vue:95", "页面不存在:", page);
        return null;
      }
      try {
        const pages = getCurrentPages();
        const stackDepth = pages.length;
        if (stackDepth >= 8) {
          common_vendor.index.__f__("warn", "at components/tab-bar/tab-bar.vue:107", "页面栈接近上限，使用reLaunch清空页面栈");
          switch (page) {
            case "index":
              router_Router.Navigator.reLaunch(router_Router.IndexRoutes.INDEX);
              break;
            case "message":
              router_Router.Navigator.reLaunch(router_Router.MessageRoutes.MESSAGE);
              break;
            case "mine":
              router_Router.Navigator.reLaunch(router_Router.MineRoutes.MINE);
              break;
            case "AI":
              router_Router.Navigator.reLaunch(router_Router.AIRoutes.AI_SERVER);
              break;
            default:
              common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.vue:122", "未知的页面类型:", page);
          }
          return null;
        }
        switch (page) {
          case "index":
            router_Router.Navigator.redirectTo(router_Router.IndexRoutes.INDEX);
            break;
          case "message":
            router_Router.Navigator.redirectTo(router_Router.MessageRoutes.MESSAGE);
            break;
          case "mine":
            router_Router.Navigator.redirectTo(router_Router.MineRoutes.MINE);
            break;
          case "AI":
            router_Router.Navigator.redirectTo(router_Router.AIRoutes.AI_SERVER);
            break;
          default:
            common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.vue:143", "未知的页面类型:", page);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.vue:146", "Tab切换失败:", e);
      }
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getIconPath("index"),
    b: $props.pageName === "index" ? 1 : "",
    c: common_vendor.o(($event) => $options.switchPage("index")),
    d: $options.getIconPath("AI"),
    e: $props.pageName === "AI" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchPage("AI")),
    g: $options.getIconPath("message"),
    h: $props.pageName === "message" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchPage("message")),
    j: $options.getIconPath("mine"),
    k: $props.pageName === "mine" ? 1 : "",
    l: common_vendor.o(($event) => $options.switchPage("mine")),
    m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tab-bar/tab-bar.js.map
