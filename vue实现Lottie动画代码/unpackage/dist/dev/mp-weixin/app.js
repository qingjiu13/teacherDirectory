"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_vuexDebug = require("./utils/vuex-debug.js");
const store_injectChecker = require("./store/inject-checker.js");
const components_loading_index = require("./components/loading/index.js");
const components_loading_useAnimationCache = require("./components/loading/useAnimationCache.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/match/match.js";
  "./pages/teacher/teacher.js";
  "./pages/AI/AI.js";
  "./pages/message/message.js";
  "./pages/message/chat.js";
  "./pages/login/login.js";
  "./pages/login/login_detail.js";
  "./pages/login/wechat_login.js";
  "./pages/mine/mine/mine_common.js";
  "./pages/mine/modify.js";
  "./pages/mine/course/course.js";
  "./pages/mine/order.js";
  "./pages/mine/order/order_common.js";
  "./pages/mine/order/appraise/appraise.js";
  "./pages/mine/qualification.js";
  "./pages/mine/service.js";
  "./pages/mine/settings.js";
  "./pages/mine/wallet.js";
  "./pages/test/test.js";
  "./pages/mine/service_newbuilt.js";
}
const settings = new UTSJSONObject({
  miniprogram: new UTSJSONObject({
    libVersion: "2.9.0"
  })
});
const App = new UTSJSONObject({
  settings
});
try {
  const { globalState, getGlobalStats, isAllAnimationsLoaded } = components_loading_useAnimationCache.useGlobalAnimationState();
  if (typeof getApp === "function") {
    try {
      const app = getApp();
      if (app) {
        app.globalData = app.globalData || {};
        if (!app.globalData.$loading) {
          app.globalData.$loading = {
            show: () => common_vendor.index.__f__("log", "at main.js:24", "Loading组件尚未挂载，show方法未生效"),
            hide: () => common_vendor.index.__f__("log", "at main.js:25", "Loading组件尚未挂载，hide方法未生效"),
            preload: () => common_vendor.index.__f__("log", "at main.js:26", "Loading组件尚未挂载，preload方法未生效"),
            isPreloaded: { value: false },
            getStatus: () => ({ allLoaded: false, stats: null }),
            globalState
          };
        }
        common_vendor.index.__f__("log", "at main.js:33", "全局动画状态已提前初始化");
      }
    } catch (e) {
      common_vendor.index.__f__("log", "at main.js:36", "全局App尚未初始化，将在createApp中完成初始化");
    }
  }
} catch (err) {
  common_vendor.index.__f__("error", "at main.js:40", "提前初始化全局动画状态失败:", err);
}
async function preloadResources() {
  var _a, _b;
  try {
    const globalApp = getApp();
    if ((_b = (_a = globalApp == null ? void 0 : globalApp.globalData) == null ? void 0 : _a.$loading) == null ? void 0 : _b.preload) {
      common_vendor.index.__f__("log", "at main.js:51", "通过全局变量预加载动画资源");
      await globalApp.globalData.$loading.preload();
      if (!globalApp.globalData.$animationState) {
        const { getGlobalStats, isAllAnimationsLoaded } = components_loading_useAnimationCache.useGlobalAnimationState();
        globalApp.globalData.$animationState = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded
        };
      }
    } else {
      common_vendor.index.__f__("log", "at main.js:63", "全局变量未就绪，将在组件挂载时预加载");
    }
  } catch (err) {
    common_vendor.index.__f__("error", "at main.js:66", "预加载资源失败:", err);
  }
}
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(store_index.store);
  app.use(components_loading_index.LoadingPlugin, {
    preload: {
      animations: [
        "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
      ]
    }
  });
  app.provide("store", store_index.store);
  app.config.globalProperties.$store = store_index.store;
  const { globalState, getGlobalStats, isAllAnimationsLoaded } = components_loading_useAnimationCache.useGlobalAnimationState();
  app.provide("animationState", {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded
  });
  app.config.globalProperties.$animationState = {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded
  };
  try {
    const globalApp = getApp();
    if (globalApp) {
      globalApp.globalData = globalApp.globalData || {};
      if (!globalApp.globalData.$loading) {
        globalApp.globalData.$loading = {
          show: () => common_vendor.index.__f__("log", "at main.js:116", "Loading组件尚未挂载，show方法未生效"),
          hide: () => common_vendor.index.__f__("log", "at main.js:117", "Loading组件尚未挂载，hide方法未生效"),
          preload: () => common_vendor.index.__f__("log", "at main.js:118", "Loading组件尚未挂载，preload方法未生效"),
          isPreloaded: { value: false },
          getStatus: () => ({ allLoaded: false, stats: null }),
          globalState
        };
      }
      globalApp.globalData.$animationState = {
        getStats: getGlobalStats,
        isAllLoaded: isAllAnimationsLoaded,
        globalState
      };
      common_vendor.index.__f__("log", "at main.js:132", "全局动画状态已在createApp中初始化");
    }
  } catch (e) {
    common_vendor.index.__f__("error", "at main.js:135", "初始化全局App对象失败:", e);
  }
  app.mixin(store_injectChecker.injectStoreSafety);
  const handleError = (err) => {
    common_vendor.index.__f__("error", "at main.js:143", "捕获到全局错误:", err);
  };
  app.config.errorHandler = (err, vm, info) => {
    common_vendor.index.__f__("error", "at main.js:148", "Vue错误:", err);
    common_vendor.index.__f__("info", "at main.js:149", "错误来源:", info);
    handleError(err);
  };
  {
    try {
      utils_vuexDebug.installDebugPlugin(store_index.store);
      utils_vuexDebug.installDebugForVue3(app, store_index.store);
      store_injectChecker.checkStoreAvailability(store_index.store);
      common_vendor.index.__f__("log", "at main.js:159", "初始Vuex状态:", store_index.store.state);
      if (typeof window !== "undefined") {
        window.__ANIMATION_DEBUG__ = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded,
          globalState
        };
        common_vendor.index.__f__("log", "at main.js:168", "已注册动画状态调试工具，可通过 window.__ANIMATION_DEBUG__ 访问");
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at main.js:171", "调试插件初始化失败:", e);
    }
  }
  if (common_vendor.index.getSystemInfoSync().platform === "mp-weixin") {
    common_vendor.index.__f__("log", "at main.js:177", "当前运行环境: 微信小程序");
    try {
      common_vendor.index.onError((err) => {
        common_vendor.index.__f__("error", "at main.js:183", "小程序错误:", err);
        handleError(err);
      });
      common_vendor.index.onNetworkStatusChange((res) => {
        common_vendor.index.__f__("log", "at main.js:189", "网络状态变化:", res.isConnected ? "已连接" : "已断开");
        store_index.store.commit("app/setNetworkStatus", res.isConnected);
      });
      const app2 = getApp();
      if (app2 && !app2.globalData) {
        app2.globalData = {};
      }
      if (app2 && app2.globalData) {
        app2.globalData.$animationState = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded,
          globalState
        };
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at main.js:208", "微信小程序配置失败:", e);
    }
  }
  preloadResources();
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
