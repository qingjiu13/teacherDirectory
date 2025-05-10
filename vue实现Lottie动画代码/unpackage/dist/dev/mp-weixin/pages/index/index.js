"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
    const animationCache = /* @__PURE__ */ new Map();
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
    const isAnimationCached = (url = null) => {
      return animationCache.has(url);
    };
    const getAnimationFromCache = (url = null) => {
      return UTS.mapGet(animationCache, url) || null;
    };
    const saveAnimationToCache = (url = null, data = null) => {
      animationCache.set(url, data);
      try {
        const key = `lottie_${getAnimationKey(url)}`;
        common_vendor.index.setStorageSync(key, data);
        common_vendor.index.__f__("log", "at pages/index/index.vue:106", "动画数据已保存到本地存储", key);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:108", "保存到本地存储失败", e);
      }
    };
    const restoreAnimationFromStorage = (url = null) => {
      const key = `lottie_${getAnimationKey(url)}`;
      try {
        const data = common_vendor.index.getStorageSync(key);
        if (data) {
          animationCache.set(url, data);
          common_vendor.index.__f__("log", "at pages/index/index.vue:123", "已从本地存储恢复动画数据到缓存", key);
          return true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:127", "从本地存储恢复失败", e);
      }
      return false;
    };
    const loadAnimationData = (url = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (loading.value) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:139", "已有加载任务正在进行");
          return null;
        }
        loading.value = true;
        if (isAnimationCached(url)) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:147", "从内存缓存获取动画数据");
          loading.value = false;
          return getAnimationFromCache(url);
        }
        if (restoreAnimationFromStorage(url)) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:154", "从本地存储恢复动画数据");
          loading.value = false;
          return getAnimationFromCache(url);
        }
        common_vendor.index.__f__("log", "at pages/index/index.vue:160", "从网络加载动画数据", url);
        try {
          const data = (yield common_vendor.index.request({
            url,
            method: "GET"
          })).data;
          saveAnimationToCache(url, data);
          loading.value = false;
          return data;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:173", "网络加载动画数据失败", e);
          loading.value = false;
          return null;
        }
      });
    };
    const initAnimation = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (loadTimeout) {
          clearTimeout(loadTimeout);
        }
        pageReady.value = false;
        const targetSrc = props.src || defaultSrc;
        animationSrc.value = targetSrc;
        loadAnimationData(targetSrc).then((data = null) => {
          if (data) {
            common_vendor.index.__f__("log", "at pages/index/index.vue:198", "动画数据加载成功");
            animationLoaded.value = true;
          }
        });
        loadTimeout = setTimeout(() => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:205", "动画加载超时，强制显示页面");
          pageReady.value = true;
        }, 3e3);
        if (isAnimationCached(targetSrc)) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:211", "检测到缓存数据，预先设置动画加载状态");
          animationLoaded.value = true;
          setTimeout(() => {
            pageReady.value = true;
          }, 500);
        }
      });
    };
    const onDataReady = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:224", "动画数据准备完成，触发dataReady事件");
      animationLoaded.value = true;
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:235", "设置页面为可显示状态");
        pageReady.value = true;
      }, 100);
    };
    const matchAnimation = () => {
      if (!animationLoaded.value) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:245", "动画尚未加载完成");
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
    const cleanup = () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:275", "组件挂载，初始化动画");
      initAnimation();
    });
    common_vendor.onActivated(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:281", "页面激活");
      if (!animationSrc.value) {
        initAnimation();
      } else {
        if (!pageReady.value) {
          common_vendor.index.__f__("log", "at pages/index/index.vue:287", "动画源已存在但页面未准备好，强制显示");
          pageReady.value = true;
        }
      }
    });
    common_vendor.onBeforeUnmount(() => {
      cleanup();
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_assets._imports_0,
        b: common_vendor.sr(cLottieRef, "74acbeb4-0", {
          "k": "cLottieRef"
        }),
        c: common_vendor.o(onDataReady),
        d: common_vendor.p({
          src: animationSrc.value,
          width: "600rpx",
          autoPlay: false,
          height: "600rpx",
          loop: true
        }),
        e: common_assets._imports_1,
        f: common_vendor.o(matchAnimation),
        g: common_vendor.p({
          pageName: "index"
        }),
        h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
