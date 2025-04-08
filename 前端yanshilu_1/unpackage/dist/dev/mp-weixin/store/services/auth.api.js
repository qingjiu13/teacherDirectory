"use strict";
const common_vendor = require("../../common/vendor.js");
const login = (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { username, role } = credentials;
      const payload = {
        sub: `user_${Date.now()}`,
        name: username,
        role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 7200
        // 2小时后过期
      };
      const header = common_vendor.gBase64.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payloadBase64 = common_vendor.gBase64.encode(JSON.stringify(payload));
      const signature = common_vendor.gBase64.encode("mock_signature");
      const token = `${header}.${payloadBase64}.${signature}`;
      const refreshToken2 = `refresh_${header}.${common_vendor.gBase64.encode(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1e3) + 86400
        // 24小时后过期
      }))}.${signature}`;
      resolve({
        success: true,
        data: {
          token,
          refreshToken: refreshToken2,
          expiresIn: 7200,
          userInfo: {
            name: username,
            avatar: "https://example.com/avatar.png",
            tags: ["标签1", "标签2"],
            balance: role === "teacher" ? 1e3 : null,
            bio: role === "teacher" ? "资深导师，专注于学术指导" : "热爱学习的学生",
            contact: {
              phone: "138****1234",
              email: `${username}@example.com`,
              wechat: username
            }
          },
          role
        }
      });
    }, 500);
  });
};
const getUserInfo = (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const role = token && typeof token === "string" && token.startsWith("teacher") ? "teacher" : "student";
      resolve({
        success: true,
        data: {
          name: `${role}用户`,
          avatar: "https://example.com/avatar.png",
          tags: ["标签1", "标签2", "标签3"],
          balance: role === "teacher" ? 1500 : null,
          bio: role === "teacher" ? "资深导师，专注于学术指导" : "热爱学习的学生",
          contact: {
            phone: "138****1234",
            email: `${role}@example.com`,
            wechat: `${role}_user`
          },
          notifications: {
            unread: 3,
            messages: [
              { id: "m1", type: "system", content: "系统通知", read: false, time: Date.now() - 36e5 },
              { id: "m2", type: "chat", content: "新聊天消息", read: false, time: Date.now() - 72e5 },
              { id: "m3", type: "order", content: "订单状态更新", read: false, time: Date.now() - 108e5 }
            ]
          }
        }
      });
    }, 600);
  });
};
const refreshToken = (refreshToken2) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          token: `new_token_${Date.now()}`,
          refreshToken: `new_refresh_token_${Date.now()}`,
          expiresIn: 7200
          // 2小时有效期
        }
      });
    }, 300);
  });
};
const jwt = {
  /**
   * @description 解码JWT令牌
   * @param {string} token - JWT令牌
   * @returns {Object|null} 解码后的载荷
   */
  decode(token) {
    try {
      if (!token)
        return null;
      return common_vendor.jwtDecode(token);
    } catch (error) {
      common_vendor.index.__f__("error", "at store/services/auth.api.js:137", "Token解析失败:", error);
      return null;
    }
  },
  /**
   * @description 校验JWT令牌是否有效
   * @param {string} token - JWT令牌
   * @returns {boolean} 是否有效
   */
  isValid(token) {
    if (!token || typeof token !== "string")
      return false;
    try {
      const decoded = this.decode(token);
      if (!decoded)
        return false;
      const currentTime = Date.now() / 1e3;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};
const auth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getUserInfo,
  jwt,
  login,
  refreshToken
}, Symbol.toStringTag, { value: "Module" }));
exports.auth = auth;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/auth.api.js.map
