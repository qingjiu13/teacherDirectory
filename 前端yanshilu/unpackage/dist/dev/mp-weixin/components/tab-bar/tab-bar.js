"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  props: {
    pageName: {
      type: String,
      default: "index"
    }
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
      const pageMap = new UTSJSONObject({
        "index": "/pages/index/index",
        "message": "/pages/message/message",
        "publish": "/pages/publish/publish",
        "mine": "/pages/mine/mine"
      });
      try {
        common_vendor.index.switchTab({
          url: pageMap[page]
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at components/tab-bar/tab-bar.uvue:60", "Tab切换失败:", e);
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.pageName === "index" ? "/static/image/home_24dp_active.svg" : "/static/image/home_24dp_E3E3E3.svg",
    b: $props.pageName === "index" ? 1 : "",
    c: common_vendor.o(($event) => $options.switchPage("index")),
    d: $props.pageName === "message" ? "/static/image/mail_outline_24dp_active.svg" : "/static/image/mail_outline_24dp_E3E3E3.svg",
    e: $props.pageName === "message" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchPage("message")),
    g: $props.pageName === "publish" ? "/static/image/location_on_24dp_active.svg" : "/static/image/location_on_24dp_E3E3E3.svg",
    h: $props.pageName === "publish" ? 1 : "",
    i: common_vendor.o(($event) => $options.switchPage("publish")),
    j: $props.pageName === "mine" ? "/static/image/person_24dp_active.svg" : "/static/image/person_24dp_E3E3E3.svg",
    k: $props.pageName === "mine" ? 1 : "",
    l: common_vendor.o(($event) => $options.switchPage("mine")),
    m: common_vendor.sei(_ctx.virtualHostId, "view")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tab-bar/tab-bar.js.map
