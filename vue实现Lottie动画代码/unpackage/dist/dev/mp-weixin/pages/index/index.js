"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
if (!Array) {
  const _easycom_c_lottie_1 = common_vendor.resolveComponent("c-lottie");
  _easycom_c_lottie_1();
}
const _easycom_c_lottie = () => "../../uni_modules/c-lottie/components/c-lottie/c-lottie.js";
if (!Math) {
  (_easycom_c_lottie + TabBar)();
}
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const defaultSrc = "https://lottie.host/aa045d36-86ee-46d3-9705-1eeb65b38465/V6aAFX4Fmk.json";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    src: new UTSJSONObject({
      type: String,
      default: defaultSrc
    })
  },
  setup(__props) {
    const cLottieRef = common_vendor.ref();
    const animationSrc = common_vendor.ref("");
    const animationLoaded = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const pageReady = common_vendor.ref(false);
    let loadTimeout = null;
    const props = __props;
    const getAnimationKey = (url = null) => {
      return url.split("/").pop().split(".")[0];
    };
    const checkCached = (key = null) => {
      const storageKey = `lottie_${key}`;
      try {
        const stored = common_vendor.index.getStorageSync(storageKey);
        return !!stored;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:79", "检查缓存状态失败", e);
        return false;
      }
    };
    const preloadLottieAnimation = (url = null, key = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (loading.value)
          return false;
        loading.value = true;
        const storageKey = `lottie_${key}`;
        if (checkCached(key)) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:98", "动画已缓存，无需预加载");
          loading.value = false;
          return true;
        }
        common_vendor.index.__f__("log", "at pages/index/index.vue:104", "从网络预加载Lottie动画");
        try {
          const data = (yield common_vendor.index.request({
            url,
            method: "GET"
          })).data;
          try {
            common_vendor.index.setStorageSync(storageKey, data);
            common_vendor.index.__f__("log", "at pages/index/index.vue:114", "Lottie动画已缓存到本地");
            loading.value = false;
            return true;
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/index/index.vue:118", "保存缓存失败", e);
            loading.value = false;
            return false;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:123", "获取动画文件失败", e);
          loading.value = false;
          return false;
        }
      });
    };
    const initAnimation = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (loadTimeout) {
          clearTimeout(loadTimeout);
        }
        pageReady.value = false;
        animationSrc.value = props.src;
        const animationKey = getAnimationKey(props.src);
        const isCached = checkCached(animationKey);
        preloadLottieAnimation(props.src, animationKey);
        loadTimeout = setTimeout(() => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:153", "动画加载超时，强制显示页面");
          pageReady.value = true;
        }, 3e3);
        if (isCached) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:159", "检测到缓存数据，预先设置动画加载状态");
          animationLoaded.value = true;
          setTimeout(() => {
            pageReady.value = true;
          }, 500);
        }
      });
    };
    const onDataReady = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:172", "动画数据准备完成，触发dataReady事件");
      animationLoaded.value = true;
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:183", "设置页面为可显示状态");
        pageReady.value = true;
      }, 100);
    };
    const matchAnimation = () => {
      if (!animationLoaded.value) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:193", "动画尚未加载完成");
        return null;
      }
      cLottieRef.value.call("play");
      setTimeout(() => {
        cLottieRef.value.call("stop");
        navigateToMatch();
      }, 1e3);
    };
    const navigateToMatch = () => {
      router_Router.Navigator.toMatch();
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:213", "组件挂载，初始化动画");
      initAnimation();
    });
    common_vendor.onActivated(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:219", "页面激活");
      if (!animationSrc.value) {
        initAnimation();
      } else {
        if (!pageReady.value) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:225", "动画源已存在但页面未准备好，强制显示");
          pageReady.value = true;
        }
      }
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: !pageReady.value
      }), !pageReady.value ? new UTSJSONObject({}) : new UTSJSONObject({
        b: common_vendor.sr(cLottieRef, "74acbeb4-0", new UTSJSONObject({
          "k": "cLottieRef"
        })),
        c: common_vendor.o(onDataReady),
        d: common_vendor.p(new UTSJSONObject({
          src: animationSrc.value,
          width: "600rpx",
          autoPlay: false,
          height: "600rpx",
          loop: true
        })),
        e: common_vendor.o(matchAnimation),
        f: common_vendor.p(new UTSJSONObject({
          pageName: "index"
        }))
      }), new UTSJSONObject({
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
