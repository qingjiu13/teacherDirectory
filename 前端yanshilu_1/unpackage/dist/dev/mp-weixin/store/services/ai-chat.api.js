"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const store_services_mockData = require("./mock-data.js");
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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          reject({
            statusCode: res.statusCode,
            data: res.data
          });
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const handleError = (error) => {
  let errorMessage = "";
  if (error.data) {
    if (error.data.message) {
      errorMessage = error.data.message;
    } else if (error.data.error && error.data.error.message) {
      errorMessage = error.data.error.message;
    } else if (error.data.msg) {
      errorMessage = error.data.msg;
    } else if (error.data.errMsg) {
      errorMessage = error.data.errMsg;
    } else if (typeof error.data === "string") {
      errorMessage = error.data;
    } else if (error.errMsg) {
      errorMessage = error.errMsg;
    }
  }
  if (!errorMessage && error.statusCode) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = "请求的资源不存在";
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    } else {
      errorMessage = `服务器返回错误: ${error.statusCode}`;
    }
  } else if (!errorMessage) {
    if (error.errno) {
      errorMessage = `网络错误 (${error.errno})`;
    } else {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }
  }
  common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:108", "处理到的错误信息:", {
    message: errorMessage,
    originalError: JSON.stringify(error).substring(0, 200)
    // 限制长度以便于日志查看
  });
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
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:131", "获取会话列表失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const getConversationSummaries = async () => {
  {
    await store_services_mockData.mockDelay(500);
    common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:145", "使用模拟数据: getConversationSummaries");
    return store_services_mockData.mockApiResponse({
      summaries: store_services_mockData.mockChatSummaries
    });
  }
};
const getMessages = async (conversationId) => {
  {
    await store_services_mockData.mockDelay(800);
    common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:173", "使用模拟数据: getMessages, conversationId =", conversationId);
    if (store_services_mockData.mockChatDetails[conversationId]) {
      return store_services_mockData.mockApiResponse(store_services_mockData.mockChatDetails[conversationId]);
    }
    return {
      success: false,
      error: handleError({
        statusCode: 404,
        message: "找不到指定的会话记录"
      })
    };
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
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:225", "发送消息失败:", error);
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
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:242", "创建会话失败:", error);
    return { success: false, error: handleError(error) };
  }
};
const deleteConversation = async (conversationId) => {
  {
    await store_services_mockData.mockDelay(300);
    common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:257", "使用模拟数据: deleteConversation, conversationId =", conversationId);
    return store_services_mockData.mockApiResponse({ message: "会话删除成功" });
  }
};
const saveConversation = async (conversationData) => {
  {
    await store_services_mockData.mockDelay(600);
    common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:284", "使用模拟数据: saveConversation, conversationId =", conversationData.id);
    common_vendor.index.__f__("log", "at store/services/ai-chat.api.js:286", "保存的对话数据:", JSON.stringify(conversationData).substring(0, 200) + "...");
    return store_services_mockData.mockApiResponse({ message: "会话保存成功", id: conversationData.id });
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
    if (!response.data) {
      common_vendor.index.__f__("warn", "at store/services/ai-chat.api.js:324", "testAIQA: 后端返回了空数据");
      return {
        success: true,
        data: "抱歉，服务器返回了空数据。请稍后再试。"
      };
    }
    return { success: true, data: response.data };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/services/ai-chat.api.js:333", "测试AIQA失败:", error);
    const formattedError = handleError(error);
    return {
      success: false,
      error: formattedError,
      message: formattedError.message || "请求失败，请稍后再试"
    };
  }
};
const aiChat = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createConversation,
  deleteConversation,
  getConversationSummaries,
  getConversations,
  getMessages,
  saveConversation,
  sendMessage,
  testAIQA
}, Symbol.toStringTag, { value: "Module" }));
exports.aiChat = aiChat;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/ai-chat.api.js.map
