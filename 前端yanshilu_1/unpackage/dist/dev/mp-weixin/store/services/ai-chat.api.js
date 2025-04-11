"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const API_PREFIX = `${config_index.API_BASE_URL}/ai-chat`;
const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查您的网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后再试",
  SERVER_ERROR: "服务器错误，请稍后再试",
  AUTH_ERROR: "身份验证失败，请重新登录",
  INVALID_PARAM: "参数错误",
  RATE_LIMIT: "请求过于频繁，请稍后再试",
  UNKNOWN_ERROR: "未知错误，请稍后再试"
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url,
      data: options.data,
      method: options.method || "GET",
      header: options.headers || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const handleError = (error) => {
  let errorMessage = "";
  if (error.data && error.data.message) {
    errorMessage = error.data.message;
  } else if (error.data && error.data.error && error.data.error.message) {
    errorMessage = error.data.error.message;
  } else if (error.statusCode) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = "请求的资源不存在";
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else {
    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
  }
  return {
    message: errorMessage,
    originalError: error,
    statusCode: error.statusCode || 0
  };
};
const getConversations = async () => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations`
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:90", "获取会话列表失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const getMessages = async (conversationId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/${conversationId}/messages`
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:107", "获取会话消息失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const sendMessage = async (params) => {
  try {
    const requestData = {
      message: params.message,
      conversationId: params.conversationId,
      context: params.context || {}
    };
    const response = await request({
      url: `${API_PREFIX}/chat`,
      method: "POST",
      data: requestData
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:135", "发送消息失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const createConversation = async () => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations`,
      method: "POST"
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:152", "创建会话失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const deleteConversation = async (conversationId) => {
  try {
    const response = await request({
      url: `${API_PREFIX}/conversations/${conversationId}`,
      method: "DELETE"
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:170", "删除会话失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const testAIQA = async (question, contextInfo = {}) => {
  try {
    const response = await request({
      url: config_index.AIQA_TEST_URL,
      method: "POST",
      data: {
        question,
        context: contextInfo
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:194", "测试AIQA失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const aiChat = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  sendMessage,
  testAIQA
}, Symbol.toStringTag, { value: "Module" }));
exports.aiChat = aiChat;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/ai-chat.api.js.map
