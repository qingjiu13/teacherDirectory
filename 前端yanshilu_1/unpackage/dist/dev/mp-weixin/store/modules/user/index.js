"use strict";
const store_modules_user_state = require("./state.js");
const store_modules_user_mutations = require("./mutations.js");
const store_modules_user_actions = require("./actions.js");
const store_modules_user_getters = require("./getters.js");
const user = {
  namespaced: true,
  state: store_modules_user_state.state,
  mutations: store_modules_user_mutations.mutations,
  actions: store_modules_user_actions.actions,
  getters: store_modules_user_getters.getters
};
exports.user = user;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/user/index.js.map
