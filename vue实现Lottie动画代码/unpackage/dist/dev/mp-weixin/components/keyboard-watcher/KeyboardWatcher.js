"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "KeyboardWatcher",
  setup(__props, _a) {
    var __expose = _a.expose;
    const keyboardHeight = common_vendor.ref(0);
    const isKeyboardOpen = common_vendor.ref(false);
    const pending = [];
    function onKbChange(e = null) {
      var _a2;
      const h = ((_a2 = e.detail) === null || _a2 === void 0 ? void 0 : _a2.height) || 0;
      keyboardHeight.value = h;
      isKeyboardOpen.value = h > 0;
    }
    common_vendor.onMounted(() => {
      common_vendor.index.onKeyboardHeightChange(onKbChange);
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.offKeyboardHeightChange(onKbChange);
    });
    function openWhenReady(dropdownRef = null) {
      if (!dropdownRef || typeof dropdownRef.openDropdown !== "function")
        return null;
      if (isKeyboardOpen.value) {
        dropdownRef.openDropdown();
      } else {
        pending.push(dropdownRef);
      }
    }
    common_vendor.watch(isKeyboardOpen, (val) => {
      if (val && pending.length) {
        pending.forEach((ref) => {
          return ref.openDropdown();
        });
        pending.length = 0;
      }
    });
    __expose(new UTSJSONObject({ openWhenReady }));
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        b: keyboardHeight.value + "px"
      };
      return __returned__;
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-92a14c50"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/keyboard-watcher/KeyboardWatcher.js.map
