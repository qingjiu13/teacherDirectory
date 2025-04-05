"use strict";
var _a, _b, _c;
const common_vendor = require("../common/vendor.js");
const store_getters = require("./getters.js");
const store_mutations = require("./mutations.js");
const store_actions = require("./actions.js");
const store_modules_auth = require("./modules/auth.js");
const store_modules_message = require("./modules/message.js");
const store_modules_course = require("./modules/course.js");
const store_modules_order = require("./modules/order.js");
const state = {
  isLoading: false,
  error: null,
  appVersion: "1.0.0",
  appConfig: {
    theme: ((_a = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _a.theme) || "light",
    fontSize: ((_b = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _b.fontSize) || "medium",
    language: ((_c = common_vendor.index.getStorageSync("appConfig")) == null ? void 0 : _c.language) || "zh-CN"
  }
};
function createVuexStore() {
  return common_vendor.createStore({
    state,
    getters: store_getters.rootGetters,
    mutations: store_mutations.rootMutations,
    actions: store_actions.rootActions,
    modules: {
      auth: store_modules_auth.auth,
      message: store_modules_message.message,
      course: store_modules_course.course,
      order: store_modules_order.order
    },
    // 严格模式，防止直接修改状态
    strict: true
  });
}
const store = createVuexStore();
const initializeApp = async () => {
  try {
    await store.dispatch("initApp");
    common_vendor.index.__f__("log", "at store/index.js:63", "应用初始化成功");
    return { success: true };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/index.js:66", "应用初始化失败:", error);
    return { success: false, error };
  }
};
exports.initializeApp = initializeApp;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
