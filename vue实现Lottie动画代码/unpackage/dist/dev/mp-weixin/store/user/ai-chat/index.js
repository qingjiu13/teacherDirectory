"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_aiChat_state = require("./state.js");
const store_user_aiChat_mutations = require("./mutations.js");
const store_user_aiChat_actions = require("./actions.js");
const store_user_aiChat_getters = require("./getters.js");
const store_user_aiChat_mockData = require("./mock-data.js");
const aiChat = {
  namespaced: true,
  state: store_user_aiChat_state.state,
  mutations: store_user_aiChat_mutations.mutations,
  actions: store_user_aiChat_actions.actions,
  getters: store_user_aiChat_getters.getters
};
store_user_aiChat_actions.actions.saveChat = ({ commit, state }, chatData) => {
  return new Promise((resolve) => {
    try {
      let chats = [...state.historyChats];
      const existingChatIndex = chats.findIndex((chat) => chat.id === chatData.id);
      if (existingChatIndex >= 0) {
        chats[existingChatIndex] = {
          ...chats[existingChatIndex],
          title: chatData.title,
          abstract: chatData.abstract || chatData.title,
          // 确保abstract字段存在
          updatedAt: /* @__PURE__ */ new Date()
        };
      } else {
        chats.unshift({
          id: chatData.id,
          title: chatData.title,
          abstract: chatData.abstract || chatData.title,
          // 确保abstract字段存在
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      commit("setHistoryChats", chats);
      setTimeout(() => {
        resolve(store_user_aiChat_mockData.mockApiResponse(true, { success: true }));
      }, 100);
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/ai-chat/index.js:59", "保存聊天摘要失败:", error);
      resolve(store_user_aiChat_mockData.mockApiResponse(false, null, { message: "保存聊天摘要失败" }));
    }
  });
};
exports.aiChat = aiChat;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/index.js.map
