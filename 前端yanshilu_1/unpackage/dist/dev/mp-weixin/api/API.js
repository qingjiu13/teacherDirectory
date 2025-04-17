"use strict";
const common_vendor = require("../common/vendor.js");
const API_CONFIG = {
  BASE_URL: "https://api.yourserviceurl.com",
  // 修改为您的实际API地址
  TIMEOUT: 3e4,
  // 默认超时时间（30秒）
  RETRY_COUNT: 2,
  // 失败重试次数
  VERSION: "v1"
  // API版本
};
const API_PATHS = {
  CHAT: "/chat",
  USER: "/user"
};
const ERROR_MESSAGES = {
  NETWORK_ERROR: "网络连接失败，请检查您的网络设置",
  TIMEOUT_ERROR: "请求超时，请稍后再试",
  SERVER_ERROR: "服务器错误，请稍后再试",
  AUTH_ERROR: "身份验证失败，请重新登录",
  INVALID_PARAM: "参数错误",
  RATE_LIMIT: "请求过于频繁，请稍后再试",
  UNKNOWN_ERROR: "未知错误，请稍后再试",
  ABORT_ERROR: "请求已被取消"
};
const createHeaders = (customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "X-Client-Version": API_CONFIG.VERSION,
    ...customHeaders
  };
  try {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    common_vendor.index.__f__("error", "at api/API.js:50", "获取token失败:", e);
  }
  return headers;
};
const createApiUrl = (path) => {
  return `${API_CONFIG.BASE_URL}${path}`;
};
const handleResponseError = (error) => {
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
  if (error.name === "AbortError") {
    return new Error(ERROR_MESSAGES.ABORT_ERROR);
  }
  if (typeof error === "string") {
    return new Error(error);
  }
  if (error.statusCode) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    } else if (error.statusCode === 404) {
      errorMessage = "请求的资源不存在";
    } else if (error.statusCode === 429) {
      errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else if (error.statusCode >= 500) {
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.errMsg) {
    if (error.errMsg.includes("timeout")) {
      errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
    } else if (error.errMsg.includes("fail")) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }
  }
  const enhancedError = new Error(errorMessage);
  enhancedError.originalError = error;
  return enhancedError;
};
const sendChatMessage = async (params, onChunk, signal) => {
  var _a, _b, _c;
  const url = createApiUrl(API_PATHS.CHAT);
  const headers = createHeaders({
    "Accept": "text/event-stream",
    "X-Stream-Mode": "true"
  });
  try {
    const requestData = {
      message: params.message,
      mode: ((_a = params.context) == null ? void 0 : _a.mode) || "general",
      userInfo: {
        school: (_b = params.context) == null ? void 0 : _b.userSchool,
        major: (_c = params.context) == null ? void 0 : _c.userMajor
      },
      history: params.history || []
    };
    return await handleWeixinChatRequest(url, headers, requestData, onChunk);
    return true;
  } catch (error) {
    throw handleResponseError(error);
  }
};
const handleWeixinChatRequest = async (url, headers, requestData, onChunk) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url,
      method: "POST",
      header: headers,
      data: requestData,
      timeout: API_CONFIG.TIMEOUT,
      success: (res) => {
        if (res.statusCode !== 200) {
          return reject({
            statusCode: res.statusCode,
            message: `HTTP错误 ${res.statusCode}`
          });
        }
        const simulateStreamResponse = (text) => {
          if (!text)
            return resolve(true);
          const chunkSize = 5;
          const interval = 50;
          let index = 0;
          const sendChunk = () => {
            if (index >= text.length) {
              return resolve(true);
            }
            const end = Math.min(index + chunkSize, text.length);
            const chunk = text.substring(index, end);
            onChunk(chunk);
            index = end;
            setTimeout(sendChunk, interval);
          };
          sendChunk();
        };
        if (typeof res.data === "string") {
          simulateStreamResponse(res.data);
        } else if (res.data && res.data.content) {
          simulateStreamResponse(res.data.content);
        } else {
          resolve(true);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.sendChatMessage = sendChatMessage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/API.js.map
