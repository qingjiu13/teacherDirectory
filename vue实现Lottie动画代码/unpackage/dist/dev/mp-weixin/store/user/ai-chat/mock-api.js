"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_aiChat_mockData = require("./mock-data.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const questionAI = async (data) => {
  try {
    await delay(1e3);
    let chatId = data.chatId;
    if (!chatId) {
      chatId = `conv-${Date.now()}`;
    }
    const answer = store_user_aiChat_mockData.generateMockAIResponse(data.question, data.contextInfo);
    return {
      success: true,
      data: answer,
      chatId
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/ai-chat/mock-api.js:51", "模拟AI问答出错:", error);
    return {
      success: false,
      error: {
        message: "请求失败"
      }
    };
  }
};
const abortRequest = (requestTask) => {
  common_vendor.index.__f__("log", "at store/user/ai-chat/mock-api.js:66", "模拟中断请求:", requestTask);
};
const getConversationHistory = async (data) => {
  try {
    await delay(800);
    return store_user_aiChat_mockData.mockApiResponse(true, store_user_aiChat_mockData.MOCK_CONVERSATIONS);
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/ai-chat/mock-api.js:83", "模拟获取历史记录失败:", error);
    return store_user_aiChat_mockData.mockApiResponse(false, null, {
      message: "获取历史记录失败"
    });
  }
};
const getConversationDetail = async (data) => {
  try {
    await delay(600);
    const conversation = store_user_aiChat_mockData.MOCK_CONVERSATION_DETAILS[data.conversationId];
    if (!conversation) {
      return store_user_aiChat_mockData.mockApiResponse(false, null, {
        message: "对话不存在"
      });
    }
    return store_user_aiChat_mockData.mockApiResponse(true, conversation);
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/ai-chat/mock-api.js:111", "模拟获取对话详情失败:", error);
    return store_user_aiChat_mockData.mockApiResponse(false, null, {
      message: "获取对话详情失败"
    });
  }
};
const deleteConversationHistory = async (data) => {
  try {
    await delay(500);
    const conversation = store_user_aiChat_mockData.MOCK_CONVERSATION_DETAILS[data.conversationId];
    if (!conversation) {
      return store_user_aiChat_mockData.mockApiResponse(false, null, {
        message: "对话不存在"
      });
    }
    return store_user_aiChat_mockData.mockApiResponse(true, { message: "删除成功" });
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/ai-chat/mock-api.js:141", "模拟删除对话失败:", error);
    return store_user_aiChat_mockData.mockApiResponse(false, null, {
      message: "删除对话失败"
    });
  }
};
const saveConversation = async (data) => {
  try {
    await delay(700);
    return store_user_aiChat_mockData.mockApiResponse(true, { message: "保存成功", id: data.id });
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/ai-chat/mock-api.js:163", "模拟保存对话失败:", error);
    return store_user_aiChat_mockData.mockApiResponse(false, null, {
      message: "保存对话失败"
    });
  }
};
const mockApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  abortRequest,
  deleteConversationHistory,
  getConversationDetail,
  getConversationHistory,
  questionAI,
  saveConversation
}, Symbol.toStringTag, { value: "Module" }));
exports.mockApi = mockApi;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/mock-api.js.map
