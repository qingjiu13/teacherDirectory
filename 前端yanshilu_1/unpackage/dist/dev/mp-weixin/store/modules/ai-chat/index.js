"use strict";
const store_modules_aiChat_state = require("./state.js");
const store_modules_aiChat_mutations = require("./mutations.js");
const store_modules_aiChat_actions = require("./actions.js");
const store_modules_aiChat_getters = require("./getters.js");
const aiChat = {
  namespaced: true,
  state: store_modules_aiChat_state.state,
  mutations: store_modules_aiChat_mutations.mutations,
  actions: store_modules_aiChat_actions.actions,
  getters: store_modules_aiChat_getters.getters
};
exports.aiChat = aiChat;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/ai-chat/index.js.map
