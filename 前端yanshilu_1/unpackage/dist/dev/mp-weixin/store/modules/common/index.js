"use strict";
const store_modules_common_state = require("./state.js");
const store_modules_common_mutations = require("./mutations.js");
const store_modules_common_actions = require("./actions.js");
const store_modules_common_getters = require("./getters.js");
const common = {
  namespaced: true,
  state: store_modules_common_state.state,
  mutations: store_modules_common_mutations.mutations,
  actions: store_modules_common_actions.actions,
  getters: store_modules_common_getters.getters
};
exports.common = common;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/common/index.js.map
