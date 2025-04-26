"use strict";
const common_vendor = require("../common/vendor.js");
const checkStoreAvailability = (store) => {
  if (!store) {
    common_vendor.index.__f__("error", "at store/inject-checker.js:14", "store参数未提供");
    return false;
  }
  try {
    const userState = store.state.user;
    if (!userState) {
      common_vendor.index.__f__("error", "at store/inject-checker.js:22", "user模块不存在");
      return false;
    }
    if (!userState.baseInfo) {
      common_vendor.index.__f__("error", "at store/inject-checker.js:28", "user/baseInfo模块不存在");
      return false;
    }
    common_vendor.index.__f__("log", "at store/inject-checker.js:32", "Vuex store正常可用");
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/inject-checker.js:35", "检查Vuex模块时出错:", error);
    return false;
  }
};
const injectStoreSafety = {
  beforeCreate() {
    this.$safeStore = createSafeStoreAccess();
  }
};
function createSafeStoreAccess() {
  return {
    // 安全获取state
    state: (path) => {
      try {
        const store = getStoreFromComponent();
        if (!store)
          return null;
        const parts = path.split(".");
        let current = store.state;
        for (const part of parts) {
          if (!current || typeof current !== "object")
            return null;
          current = current[part];
        }
        return current;
      } catch (error) {
        common_vendor.index.__f__("error", "at store/inject-checker.js:74", `安全获取state路径 ${path} 时出错:`, error);
        return null;
      }
    },
    // 安全调用getter
    getter: (name) => {
      try {
        const store = getStoreFromComponent();
        return store && store.getters[name];
      } catch (error) {
        common_vendor.index.__f__("error", "at store/inject-checker.js:85", `安全获取getter ${name} 时出错:`, error);
        return null;
      }
    },
    // 安全dispatch
    dispatch: (type, payload) => {
      try {
        const store = getStoreFromComponent();
        if (!store) {
          common_vendor.index.__f__("warn", "at store/inject-checker.js:95", `store不可用，dispatch ${type} 被跳过`);
          return Promise.resolve(null);
        }
        return store.dispatch(type, payload);
      } catch (error) {
        common_vendor.index.__f__("error", "at store/inject-checker.js:100", `安全调用dispatch ${type} 时出错:`, error);
        return Promise.reject(error);
      }
    },
    // 安全commit
    commit: (type, payload) => {
      try {
        const store = getStoreFromComponent();
        if (!store) {
          common_vendor.index.__f__("warn", "at store/inject-checker.js:110", `store不可用，commit ${type} 被跳过`);
          return;
        }
        store.commit(type, payload);
      } catch (error) {
        common_vendor.index.__f__("error", "at store/inject-checker.js:115", `安全调用commit ${type} 时出错:`, error);
      }
    }
  };
}
function getStoreFromComponent() {
  const instance = common_vendor.getCurrentInstance();
  if (instance && instance.proxy && instance.proxy.$store) {
    return instance.proxy.$store;
  }
  try {
    const storeFromInject = common_vendor.inject("store", null);
    if (storeFromInject) {
      return storeFromInject;
    }
  } catch (e) {
    common_vendor.index.__f__("debug", "at store/inject-checker.js:143", "注入store失败:", e);
  }
  try {
    const app = getApp();
    if (app && app.$vm && app.$vm.$store) {
      return app.$vm.$store;
    }
  } catch (e) {
    common_vendor.index.__f__("warn", "at store/inject-checker.js:153", "无法从app获取store:", e);
  }
  if (typeof common_vendor.index !== "undefined" && common_vendor.index.$store) {
    return common_vendor.index.$store;
  }
  common_vendor.index.__f__("warn", "at store/inject-checker.js:162", "无法获取store实例");
  return null;
}
exports.checkStoreAvailability = checkStoreAvailability;
exports.injectStoreSafety = injectStoreSafety;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/inject-checker.js.map
