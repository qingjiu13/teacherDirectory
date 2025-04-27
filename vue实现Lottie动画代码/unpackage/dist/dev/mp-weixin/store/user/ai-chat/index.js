"use strict";
const store_user_aiChat_state = require("./state.js");
const store_user_aiChat_mutations = require("./mutations.js");
const store_user_aiChat_actions = require("./actions.js");
const store_user_aiChat_getters = require("./getters.js");
const aiChat = {
  namespaced: true,
  state: store_user_aiChat_state.state,
  mutations: store_user_aiChat_mutations.mutations,
  actions: store_user_aiChat_actions.actions,
  getters: store_user_aiChat_getters.getters
};
exports.aiChat = aiChat;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/index.js.map
