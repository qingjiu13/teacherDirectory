"use strict";
const common_vendor = require("../common/vendor.js");
const store_getters = require("./getters.js");
const store_mutations = require("./mutations.js");
const store_actions = require("./actions.js");
const store_modules_auth = require("./modules/auth.js");
const state = {
  isLoading: false,
  error: null,
  appVersion: "1.0.0"
};
const store = common_vendor.createStore({
  state,
  getters: store_getters.rootGetters,
  mutations: store_mutations.rootMutations,
  actions: store_actions.rootActions,
  modules: {
    auth: store_modules_auth.auth
    // 用户认证模块
  },
  // 严格模式，防止直接修改状态
  strict: true
});
const initializeApp = async () => {
  await store.dispatch("initApp");
};
exports.initializeApp = initializeApp;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
