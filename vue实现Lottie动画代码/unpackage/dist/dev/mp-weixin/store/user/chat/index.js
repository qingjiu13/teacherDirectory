"use strict";
const store_user_chat_state = require("./state.js");
const store_user_chat_mutations = require("./mutations.js");
const store_user_chat_actions = require("./actions.js");
const store_user_chat_getters = require("./getters.js");
const chat = {
  namespaced: true,
  state: store_user_chat_state.state,
  mutations: store_user_chat_mutations.mutations,
  actions: store_user_chat_actions.actions,
  getters: store_user_chat_getters.getters
};
exports.chat = chat;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/chat/index.js.map
