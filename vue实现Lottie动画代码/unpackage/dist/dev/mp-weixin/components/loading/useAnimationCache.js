"use strict";
const common_vendor = require("../../common/vendor.js");
const globalAnimationCache = /* @__PURE__ */ new Map();
const globalStats = common_vendor.ref({
  totalCached: 0,
  totalLoaded: 0,
  totalFailed: 0,
  animations: []
});
const globalLoading = common_vendor.ref(false);
const getAnimationKey = (url) => {
  return url.split("/").pop().split(".")[0];
};
const useAnimationCache = () => {
  const isAnimationCached = (url) => {
    return globalAnimationCache.has(url);
  };
  const getAnimationFromCache = (url) => {
    return globalAnimationCache.get(url) || null;
  };
  const saveAnimationToCache = (url, data) => {
    globalAnimationCache.set(url, data);
    const animIndex = globalStats.value.animations.findIndex((a) => a.url === url);
    if (animIndex === -1) {
      globalStats.value.animations.push({
        url,
        key: getAnimationKey(url),
        cached: true,
        loadTime: Date.now()
      });
    } else {
      globalStats.value.animations[animIndex].cached = true;
      globalStats.value.animations[animIndex].loadTime = Date.now();
    }
    globalStats.value.totalCached = globalAnimationCache.size;
    try {
      const key = `lottie_${getAnimationKey(url)}`;
      common_vendor.index.setStorageSync(key, data);
      common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:73", "动画数据已保存到本地存储", key);
    } catch (e) {
      common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:75", "保存到本地存储失败", e);
    }
  };
  const restoreAnimationFromStorage = (url) => {
    const key = `lottie_${getAnimationKey(url)}`;
    try {
      const data = common_vendor.index.getStorageSync(key);
      if (data) {
        globalAnimationCache.set(url, data);
        const animIndex = globalStats.value.animations.findIndex((a) => a.url === url);
        if (animIndex === -1) {
          globalStats.value.animations.push({
            url,
            key: getAnimationKey(url),
            cached: true,
            loadTime: Date.now(),
            fromStorage: true
          });
        } else {
          globalStats.value.animations[animIndex].cached = true;
          globalStats.value.animations[animIndex].loadTime = Date.now();
          globalStats.value.animations[animIndex].fromStorage = true;
        }
        globalStats.value.totalCached = globalAnimationCache.size;
        common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:109", "已从本地存储恢复动画数据到缓存", key);
        return true;
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:113", "从本地存储恢复失败", e);
    }
    return false;
  };
  const loadAnimationData = async (url) => {
    if (globalLoading.value) {
      common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:125", "已有加载任务正在进行");
      return null;
    }
    globalLoading.value = true;
    const startTime = Date.now();
    const animIndex = globalStats.value.animations.findIndex((a) => a.url === url);
    if (animIndex === -1) {
      globalStats.value.animations.push({
        url,
        key: getAnimationKey(url),
        cached: false,
        loading: true,
        startTime
      });
    } else {
      globalStats.value.animations[animIndex].loading = true;
      globalStats.value.animations[animIndex].startTime = startTime;
    }
    if (isAnimationCached(url)) {
      common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:149", "从内存缓存获取动画数据");
      const idx = globalStats.value.animations.findIndex((a) => a.url === url);
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false;
        globalStats.value.animations[idx].loadedFromCache = true;
        globalStats.value.animations[idx].loadTime = Date.now() - startTime;
      }
      globalLoading.value = false;
      return getAnimationFromCache(url);
    }
    if (restoreAnimationFromStorage(url)) {
      common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:165", "从本地存储恢复动画数据");
      const idx = globalStats.value.animations.findIndex((a) => a.url === url);
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false;
        globalStats.value.animations[idx].loadedFromStorage = true;
        globalStats.value.animations[idx].loadTime = Date.now() - startTime;
      }
      globalStats.value.totalLoaded++;
      globalLoading.value = false;
      return getAnimationFromCache(url);
    }
    common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:181", "从网络加载动画数据", url);
    try {
      const { data } = await common_vendor.index.request({
        url,
        method: "GET"
      });
      saveAnimationToCache(url, data);
      const idx = globalStats.value.animations.findIndex((a) => a.url === url);
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false;
        globalStats.value.animations[idx].loadedFromNetwork = true;
        globalStats.value.animations[idx].loadTime = Date.now() - startTime;
      }
      globalStats.value.totalLoaded++;
      globalLoading.value = false;
      return data;
    } catch (e) {
      common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:203", "网络加载动画数据失败", e);
      const idx = globalStats.value.animations.findIndex((a) => a.url === url);
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false;
        globalStats.value.animations[idx].failed = true;
        globalStats.value.animations[idx].error = e.message || "未知错误";
      }
      globalStats.value.totalFailed++;
      globalLoading.value = false;
      return null;
    }
  };
  const clearAnimationCache = (url) => {
    const key = `lottie_${getAnimationKey(url)}`;
    try {
      const deleted = globalAnimationCache.delete(url);
      common_vendor.index.removeStorageSync(key);
      if (deleted) {
        const idx = globalStats.value.animations.findIndex((a) => a.url === url);
        if (idx !== -1) {
          globalStats.value.animations[idx].cached = false;
          globalStats.value.animations[idx].cleared = true;
          globalStats.value.animations[idx].clearTime = Date.now();
        }
        globalStats.value.totalCached = globalAnimationCache.size;
      }
      return deleted;
    } catch (e) {
      common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:248", "清除动画缓存失败", e);
      return false;
    }
  };
  const clearAllAnimationCache = () => {
    try {
      const urls = Array.from(globalAnimationCache.keys());
      urls.forEach((url) => {
        clearAnimationCache(url);
      });
      common_vendor.index.__f__("log", "at components/loading/useAnimationCache.js:266", "已清除所有动画缓存");
      return true;
    } catch (e) {
      common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:269", "清除所有动画缓存失败", e);
      return false;
    }
  };
  const getAnimationStats = () => {
    return {
      ...globalStats.value,
      timestamp: Date.now()
    };
  };
  const preloadAnimations2 = async (urls, progressCallback) => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return { totalSuccess: 0, totalFailed: 0 };
    }
    const total = urls.length;
    let completed = 0;
    let success = 0;
    let failed = 0;
    const progress = {
      total,
      completed,
      success,
      failed,
      progress: 0
    };
    for (const url of urls) {
      try {
        const result = await loadAnimationData(url);
        completed++;
        if (result) {
          success++;
        } else {
          failed++;
        }
        progress.completed = completed;
        progress.success = success;
        progress.failed = failed;
        progress.progress = completed / total * 100;
        if (typeof progressCallback === "function") {
          progressCallback(progress);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at components/loading/useAnimationCache.js:333", `预加载动画失败: ${url}`, e);
        completed++;
        failed++;
        progress.completed = completed;
        progress.failed = failed;
        progress.progress = completed / total * 100;
        if (typeof progressCallback === "function") {
          progressCallback(progress);
        }
      }
    }
    return {
      totalSuccess: success,
      totalFailed: failed,
      total
    };
  };
  const isAllAnimationsLoaded = () => {
    if (globalStats.value.animations.length === 0) {
      return true;
    }
    return globalStats.value.animations.every((a) => a.cached && !a.loading);
  };
  return {
    isAnimationCached,
    getAnimationFromCache,
    saveAnimationToCache,
    restoreAnimationFromStorage,
    loadAnimationData,
    clearAnimationCache,
    clearAllAnimationCache,
    getAnimationStats,
    preloadAnimations: preloadAnimations2,
    isAllAnimationsLoaded,
    globalStats
  };
};
const useGlobalAnimationState = () => {
  const methods = useAnimationCache();
  return {
    globalState: globalStats,
    getGlobalStats: methods.getAnimationStats,
    isAllAnimationsLoaded: methods.isAllAnimationsLoaded,
    preloadAnimation: methods.loadAnimationData,
    preloadAnimations: methods.preloadAnimations,
    getAnimationFromCache: methods.getAnimationFromCache,
    clearAnimationCache: methods.clearAnimationCache,
    clearAllAnimationCache: methods.clearAllAnimationCache
  };
};
const preloadAnimations = async (urls, progressCallback) => {
  const { preloadAnimations: preload } = useAnimationCache();
  return await preload(urls, progressCallback);
};
exports.preloadAnimations = preloadAnimations;
exports.useAnimationCache = useAnimationCache;
exports.useGlobalAnimationState = useGlobalAnimationState;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/loading/useAnimationCache.js.map
