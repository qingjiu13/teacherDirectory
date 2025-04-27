"use strict";
const store_user_myService_state = require("./state.js");
const store_user_myService_mutations = require("./mutations.js");
const store_user_myService_actions = require("./actions.js");
const store_user_myService_getters = require("./getters.js");
const myService = {
  namespaced: true,
  state: store_user_myService_state.state,
  mutations: store_user_myService_mutations.mutations,
  actions: store_user_myService_actions.actions,
  getters: store_user_myService_getters.getters
};
exports.myService = myService;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/myService/index.js.map
