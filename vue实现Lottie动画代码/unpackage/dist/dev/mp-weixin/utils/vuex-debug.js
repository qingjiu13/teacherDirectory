"use strict";
const common_vendor = require("../common/vendor.js");
const installDebugPlugin = (store) => {
  store.subscribeAction({
    before: (action, state) => {
      common_vendor.index.__f__("log", "at utils/vuex-debug.js:15", `即将执行action: ${action.type}，参数:`, action.payload);
    },
    after: (action, state) => {
      common_vendor.index.__f__("log", "at utils/vuex-debug.js:18", `action: ${action.type} 执行完成`);
    }
  });
  if (typeof window !== "undefined") {
    window.debugVuex = {
      // 检查store是否可用
      checkStore: () => {
        var _a, _b;
        const result = {
          storeExists: !!store,
          modules: store ? Object.keys(((_b = (_a = store._modules) == null ? void 0 : _a.root) == null ? void 0 : _b.children) || {}) : [],
          modulesNamespaceMap: store ? Object.keys(store._modulesNamespaceMap || {}) : [],
          state: store ? JSON.parse(JSON.stringify(store.state)) : null
        };
        common_vendor.index.__f__("log", "at utils/vuex-debug.js:33", "Vuex Store 状态:", result);
        return result;
      },
      // 检查特定模块是否存在
      checkModule: (modulePath) => {
        const exists = !!(store == null ? void 0 : store._modulesNamespaceMap[`${modulePath}/`]);
        common_vendor.index.__f__("log", "at utils/vuex-debug.js:40", `模块 ${modulePath} ${exists ? "存在" : "不存在"}`);
        return exists;
      },
      // 检查特定state是否存在
      getState: (path) => {
        try {
          const parts = path.split(".");
          let current = store.state;
          for (const part of parts) {
            current = current[part];
            if (current === void 0) {
              common_vendor.index.__f__("warn", "at utils/vuex-debug.js:52", `路径 ${path} 在 ${part} 处中断`);
              return void 0;
            }
          }
          common_vendor.index.__f__("log", "at utils/vuex-debug.js:56", `状态 ${path}:`, current);
          return current;
        } catch (error) {
          common_vendor.index.__f__("error", "at utils/vuex-debug.js:59", `获取状态 ${path} 时出错:`, error);
          return void 0;
        }
      }
    };
    common_vendor.index.__f__("log", "at utils/vuex-debug.js:65", "Vuex调试工具已安装，可以使用 debugVuex 对象进行调试");
  }
};
const installDebugForVue3 = (app, store) => {
  if (!app || !store) {
    common_vendor.index.__f__("error", "at utils/vuex-debug.js:76", "应用或store不可用，无法安装调试工具");
    return;
  }
  app.provide("store", store);
  app.mixin({
    created() {
      if (!this.$parent) {
        common_vendor.index.__f__("log", "at utils/vuex-debug.js:88", "根组件创建，Vue 3环境");
        const storeRef = this.$store || app.config.globalProperties.$store;
        if (!storeRef) {
          common_vendor.index.__f__("error", "at utils/vuex-debug.js:94", "$store在根组件中未定义 (Vue 3)");
        } else {
          common_vendor.index.__f__("log", "at utils/vuex-debug.js:96", "$store在根组件中可用 (Vue 3)");
          try {
            common_vendor.index.__f__("log", "at utils/vuex-debug.js:100", "检查Vuex模块...");
            const userModuleExists = store._modulesNamespaceMap["user/"];
            common_vendor.index.__f__("log", "at utils/vuex-debug.js:102", "user模块存在:", !!userModuleExists);
            const baseInfoModuleExists = store._modulesNamespaceMap["user/baseInfo/"];
            common_vendor.index.__f__("log", "at utils/vuex-debug.js:105", "user/baseInfo模块存在:", !!baseInfoModuleExists);
          } catch (error) {
            common_vendor.index.__f__("error", "at utils/vuex-debug.js:107", "检查模块时出错:", error);
          }
        }
      }
    }
  });
  common_vendor.index.__f__("log", "at utils/vuex-debug.js:114", "Vue 3调试混入已安装");
};
exports.installDebugForVue3 = installDebugForVue3;
exports.installDebugPlugin = installDebugPlugin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/vuex-debug.js.map
