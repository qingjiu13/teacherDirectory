"use strict";
const common_vendor = require("../../common/vendor.js");
const components_loading_useAnimationCache = require("./useAnimationCache.js");
if (!Math) {
  LoadingAnimation();
}
const LoadingAnimation = () => "./LoadingAnimation.js";
const _sfc_main$1 = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "GlobalLoading",
  props: {
    src: new UTSJSONObject({
      type: String,
      default: "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
    }),
    width: new UTSJSONObject({
      type: String,
      default: "200rpx"
    }),
    height: new UTSJSONObject({
      type: String,
      default: "200rpx"
    }),
    fullscreen: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    transparent: new UTSJSONObject({
      type: Boolean,
      default: false
    }),
    backgroundColor: new UTSJSONObject({
      type: String,
      default: "rgba(255, 255, 255, 0.9)"
    }),
    autoPlay: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    preload: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    showText: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    text: new UTSJSONObject({
      type: String,
      default: "加载中..."
    }),
    zIndex: new UTSJSONObject({
      type: Number,
      default: 9999
    })
  },
  emits: ["mounted", "dataReady", "error", "timeout"],
  setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const loadingRef = common_vendor.ref(null);
    const visible = common_vendor.ref(false);
    const isPreloaded = common_vendor.ref(false);
    const _b = components_loading_useAnimationCache.useGlobalAnimationState(), getGlobalStats = _b.getGlobalStats;
    const wrapperStyle = common_vendor.computed(() => {
      return new UTSJSONObject({
        backgroundColor: props.transparent ? "transparent" : props.backgroundColor,
        zIndex: props.zIndex
      });
    });
    const show = () => {
      visible.value = true;
      if (loadingRef.value) {
        loadingRef.value.show();
      }
    };
    const hide = () => {
      visible.value = false;
      if (loadingRef.value) {
        loadingRef.value.hide();
      }
    };
    const preload = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isPreloaded.value) {
          return true;
        }
        try {
          if (loadingRef.value) {
            const result = yield loadingRef.value.preload();
            if (result) {
              isPreloaded.value = true;
            }
            return result;
          }
          return false;
        } catch (error) {
          common_vendor.index.__f__("error", "at components/loading/GlobalLoading.vue:157", "预加载全局动画失败", error);
          return false;
        }
      });
    };
    const getLottieRef = () => {
      if (loadingRef.value && loadingRef.value.lottieRef) {
        return loadingRef.value.lottieRef.value;
      }
      return null;
    };
    const getAnimationStats = () => {
      return getGlobalStats();
    };
    const onDataReady = () => {
      isPreloaded.value = true;
      emit("dataReady");
    };
    const onError = (error = null) => {
      emit("error", error);
    };
    const onTimeout = (src = null) => {
      emit("timeout", src);
    };
    const onMounted = () => {
      if (props.preload) {
        preload();
      }
      emit("mounted");
    };
    __expose(new UTSJSONObject({
      show,
      hide,
      preload,
      isPreloaded: common_vendor.computed(() => {
        return isPreloaded.value;
      }),
      getLottieRef,
      getAnimationStats
    }));
    common_vendor.provide("globalLoading", new UTSJSONObject({
      show,
      hide,
      preload,
      isPreloaded: common_vendor.computed(() => {
        return isPreloaded.value;
      }),
      stats: getGlobalStats
    }));
    onMounted();
    common_vendor.onBeforeUnmount(() => {
      const globalApp = getApp();
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        globalApp.globalData.$loading.componentMounted = false;
      }
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.sr(loadingRef, "52456a73-0", {
          "k": "loadingRef"
        }),
        b: common_vendor.o(onDataReady),
        c: common_vendor.o(onError),
        d: common_vendor.o(onTimeout),
        e: common_vendor.o(onMounted),
        f: common_vendor.p({
          src: __props.src,
          width: __props.width,
          height: __props.height,
          showText: __props.showText,
          text: __props.text,
          autoPlay: __props.autoPlay
        }),
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        h: common_vendor.s(wrapperStyle.value),
        i: visible.value ? 1 : "",
        j: __props.fullscreen ? 1 : ""
      };
      return __returned__;
    };
  }
});
if (!Array) {
  const _easycom_c_lottie_1 = common_vendor.resolveComponent("c-lottie");
  _easycom_c_lottie_1();
}
const _easycom_c_lottie = () => "../../uni_modules/c-lottie/components/c-lottie/c-lottie.js";
if (!Math) {
  _easycom_c_lottie();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "LoadingAnimation",
  props: {
    src: new UTSJSONObject({
      type: String,
      default: "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
    }),
    width: new UTSJSONObject({
      type: String,
      default: "200rpx"
    }),
    height: new UTSJSONObject({
      type: String,
      default: "200rpx"
    }),
    autoPlay: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    showText: new UTSJSONObject({
      type: Boolean,
      default: true
    }),
    text: new UTSJSONObject({
      type: String,
      default: "加载中..."
    })
  },
  emits: ["mounted", "dataReady", "error", "timeout"],
  setup(__props, _a) {
    var __expose = _a.expose, __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const lottieRef = common_vendor.ref(null);
    const visible = common_vendor.ref(false);
    const animationSrc = common_vendor.ref(props.src);
    const isLoaded = common_vendor.ref(false);
    const isPlaying = common_vendor.ref(false);
    const loadingTimeout = common_vendor.ref(null);
    const _b = components_loading_useAnimationCache.useAnimationCache(), isAnimationCached = _b.isAnimationCached, loadAnimationData = _b.loadAnimationData, getAnimationStats = _b.getAnimationStats;
    const show = () => {
      if (!isLoaded.value) {
        preload();
      }
      visible.value = true;
      if (lottieRef.value && isLoaded.value) {
        lottieRef.value.call("play");
        isPlaying.value = true;
      }
    };
    const hide = () => {
      visible.value = false;
      if (lottieRef.value && isPlaying.value) {
        lottieRef.value.call("stop");
        isPlaying.value = false;
      }
    };
    const preload = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isLoaded.value) {
          return true;
        }
        try {
          if (loadingTimeout.value) {
            clearTimeout(loadingTimeout.value);
          }
          loadingTimeout.value = setTimeout(() => {
            common_vendor.index.__f__("warn", "at components/loading/LoadingAnimation.vue:128", "动画加载超时", animationSrc.value);
            emit("timeout", animationSrc.value);
          }, 5e3);
          const animationData = yield loadAnimationData(animationSrc.value);
          if (animationData) {
            if (loadingTimeout.value) {
              clearTimeout(loadingTimeout.value);
              loadingTimeout.value = null;
            }
            isLoaded.value = true;
            return true;
          }
          return false;
        } catch (error) {
          common_vendor.index.__f__("error", "at components/loading/LoadingAnimation.vue:147", "预加载动画失败", error);
          emit("error", error);
          if (loadingTimeout.value) {
            clearTimeout(loadingTimeout.value);
            loadingTimeout.value = null;
          }
          return false;
        }
      });
    };
    const onDataReady = () => {
      common_vendor.index.__f__("log", "at components/loading/LoadingAnimation.vue:163", "动画数据准备完成");
      isLoaded.value = true;
      if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
        loadingTimeout.value = null;
      }
      emit("dataReady");
      if (visible.value && !isPlaying.value) {
        lottieRef.value.call("play");
        isPlaying.value = true;
      }
    };
    common_vendor.watch(() => {
      return props.src;
    }, (newSrc) => {
      if (newSrc !== animationSrc.value) {
        animationSrc.value = newSrc;
        isLoaded.value = false;
        if (visible.value) {
          preload();
        }
      }
    });
    __expose(new UTSJSONObject({
      show,
      hide,
      preload,
      isLoaded: common_vendor.computed(() => {
        return isLoaded.value;
      }),
      isPlaying: common_vendor.computed(() => {
        return isPlaying.value;
      }),
      lottieRef,
      getAnimationStats
    }));
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at components/loading/LoadingAnimation.vue:210", "加载动画组件已挂载");
      if (isAnimationCached(animationSrc.value)) {
        common_vendor.index.__f__("log", "at components/loading/LoadingAnimation.vue:214", "动画已缓存，直接标记为已加载");
        isLoaded.value = true;
      } else {
        preload().then(() => {
          common_vendor.index.__f__("log", "at components/loading/LoadingAnimation.vue:219", "动画预加载完成", isLoaded.value);
        });
      }
      emit("mounted");
    });
    common_vendor.onBeforeUnmount(() => {
      if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
        loadingTimeout.value = null;
      }
      if (lottieRef.value && isPlaying.value) {
        lottieRef.value.call("stop");
        isPlaying.value = false;
      }
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.sr(lottieRef, "f6494e84-0", new UTSJSONObject({
          "k": "lottieRef"
        })),
        b: common_vendor.o(onDataReady),
        c: common_vendor.p(new UTSJSONObject({
          src: animationSrc.value,
          width: __props.width,
          height: __props.height,
          loop: true,
          autoPlay: __props.autoPlay
        })),
        d: __props.showText
      }), __props.showText ? new UTSJSONObject({
        e: common_vendor.t(__props.text)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        g: visible.value ? 1 : ""
      }));
      return __returned__;
    };
  }
});
function install(app, options = {}) {
  app.component("GlobalLoading", _sfc_main$1);
  app.component("LottieLoading", _sfc_main);
  app.config.globalProperties.$loading = {
    show: () => {
      const globalApp = getApp();
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return globalApp.globalData.$loading.show();
      }
      return false;
    },
    hide: () => {
      const globalApp = getApp();
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return globalApp.globalData.$loading.hide();
      }
      return false;
    },
    preload: async () => {
      const globalApp = getApp();
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return await globalApp.globalData.$loading.preload();
      }
      return false;
    }
  };
  const {
    globalState,
    getGlobalStats,
    isAllAnimationsLoaded,
    preloadAnimation
  } = components_loading_useAnimationCache.useGlobalAnimationState();
  app.provide("animationState", {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded,
    preload: preloadAnimation
  });
  app.mixin({
    beforeCreate() {
      this.$animationState = {
        globalState,
        getStats: getGlobalStats,
        isAllLoaded: isAllAnimationsLoaded,
        preload: preloadAnimation
      };
    }
  });
  if (options.preload) {
    const { animations } = options.preload;
    if (animations && Array.isArray(animations) && animations.length > 0) {
      setTimeout(() => {
        components_loading_useAnimationCache.preloadAnimations(animations, (progress) => {
          common_vendor.index.__f__("log", "at components/loading/index.js:75", `预加载进度: ${progress.progress.toFixed(2)}%`);
        }).then((result) => {
          common_vendor.index.__f__("log", "at components/loading/index.js:78", `预加载完成: 成功${result.totalSuccess}个, 失败${result.totalFailed}个`);
        });
      }, 100);
    }
  }
}
const LoadingPlugin = {
  install
};
exports.LoadingPlugin = LoadingPlugin;
exports._sfc_main = _sfc_main;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/loading/index.js.map
