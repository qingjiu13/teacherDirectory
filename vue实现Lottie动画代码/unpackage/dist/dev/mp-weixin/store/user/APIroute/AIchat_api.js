"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_API = require("../API.js");
const store_index = require("../../index.js");
const uniRequest = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url,
      data: options.data || options.params,
      method: options.method || "GET",
      header: options.header || {},
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const sendMessageToAI = async (messageData) => {
  try {
    const userId = store_index.store.state.user.baseInfo.id;
    const userSchool = store_index.store.state.user.baseInfo.userInfo.school;
    const userMajor = store_index.store.state.user.baseInfo.userInfo.major;
    const requestData = {
      userId,
      content: messageData.content,
      chatMode: messageData.chatMode,
      school: userSchool,
      major: userMajor,
      conversationId: messageData.conversationId
    };
    const response = await uniRequest({
      url: store_user_API.AIQA_QUESTION_URL,
      method: "POST",
      data: requestData
    });
    if (response.data && response.data.code === 200) {
      return {
        success: true,
        conversationId: response.data.data.conversationId,
        aiResponse: response.data.data.aiResponse,
        messageId: response.data.data.messageId
      };
    } else {
      common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:77", "AI回复失败:", response.data.message || "未知错误");
      return {
        success: false,
        message: response.data.message || "获取AI回复失败"
      };
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:84", "发送消息给AI时出错:", error);
    return {
      success: false,
      message: "网络错误，请稍后重试"
    };
  }
};
const getConversationHistory = async () => {
  try {
    const userId = store_index.store.state.user.baseInfo.id;
    const response = await uniRequest({
      url: store_user_API.AIQA_GET_HISTORY_URL,
      method: "GET",
      data: { userId }
    });
    if (response.data && response.data.code === 200) {
      return {
        success: true,
        conversations: response.data.data.conversations
      };
    } else {
      common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:115", "获取对话历史失败:", response.data.message || "未知错误");
      return {
        success: false,
        message: response.data.message || "获取对话历史失败"
      };
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:122", "获取对话历史时出错:", error);
    return {
      success: false,
      message: "网络错误，请稍后重试"
    };
  }
};
const getConversationDetail = async (conversationId) => {
  try {
    const userId = store_index.store.state.user.baseInfo.id;
    const response = await uniRequest({
      url: store_user_API.AIQA_GET_HISTORY_DETAIL_URL,
      method: "GET",
      data: {
        userId,
        conversationId
      }
    });
    if (response.data && response.data.code === 200) {
      return {
        success: true,
        messages: response.data.data.messages
      };
    } else {
      common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:157", "获取对话详情失败:", response.data.message || "未知错误");
      return {
        success: false,
        message: response.data.message || "获取对话详情失败"
      };
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:164", "获取对话详情时出错:", error);
    return {
      success: false,
      message: "网络错误，请稍后重试"
    };
  }
};
const deleteConversation = async (conversationId) => {
  try {
    const userId = store_index.store.state.user.baseInfo.id;
    const response = await uniRequest({
      url: store_user_API.AIQA_DELETE_HISTORY_URL,
      method: "POST",
      data: {
        userId,
        conversationId
      }
    });
    if (response.data && response.data.code === 200) {
      return {
        success: true,
        message: "对话已成功删除"
      };
    } else {
      common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:199", "删除对话失败:", response.data.message || "未知错误");
      return {
        success: false,
        message: response.data.message || "删除对话失败"
      };
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/APIroute/AIchat_api.js:206", "删除对话时出错:", error);
    return {
      success: false,
      message: "网络错误，请稍后重试"
    };
  }
};
exports.deleteConversation = deleteConversation;
exports.getConversationDetail = getConversationDetail;
exports.getConversationHistory = getConversationHistory;
exports.sendMessageToAI = sendMessageToAI;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/APIroute/AIchat_api.js.map
