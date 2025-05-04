"use strict";
const store_user_money_state = require("./state.js");
const store_user_money_mutations = require("./mutations.js");
const store_user_money_actions = require("./actions.js");
const store_user_money_getters = require("./getters.js");
const money = {
  namespaced: true,
  state: store_user_money_state.state,
  mutations: store_user_money_mutations.mutations,
  actions: store_user_money_actions.actions,
  getters: store_user_money_getters.getters
};
exports.money = money;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/money/index.js.map
