"use strict";
const store_user_baseInfo_state = require("./state.js");
const store_user_baseInfo_getters = require("./getters.js");
const store_user_baseInfo_mutations = require("./mutations.js");
const store_user_baseInfo_actions = require("./actions.js");
const baseInfoModule = {
  namespaced: true,
  state: store_user_baseInfo_state.state,
  getters: store_user_baseInfo_getters.getters,
  mutations: store_user_baseInfo_mutations.mutations,
  actions: store_user_baseInfo_actions.actions
};
exports.baseInfoModule = baseInfoModule;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/index.js.map
