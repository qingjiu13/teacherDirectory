"use strict";
const store_user_match_state = require("./state.js");
const store_user_match_getters = require("./getters.js");
const store_user_match_mutations = require("./mutations.js");
const store_user_match_actions = require("./actions.js");
const match = {
  namespaced: true,
  state: store_user_match_state.state,
  getters: store_user_match_getters.getters,
  mutations: store_user_match_mutations.mutations,
  actions: store_user_match_actions.actions
};
exports.match = match;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/index.js.map
