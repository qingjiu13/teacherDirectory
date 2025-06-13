"use strict";
const common_vendor = require("../../common/vendor.js");
function getWechatLoginCode() {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error("获取微信登录code失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
function getOpenidAndSessionKey(code) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "登录接口",
      // 需替换为实际接口
      method: "POST",
      data: {
        account: "1514382701",
        jscode: code
      },
      header: {
        "content-type": "application/json"
      },
      success: (res) => {
        if (res.data.r === "T") {
          common_vendor.index.setStorage({
            key: "openid",
            data: res.data.openid
          });
          common_vendor.index.setStorage({
            key: "sessionkey",
            data: res.data.sessionkey
          });
          resolve({
            openid: res.data.openid,
            sessionkey: res.data.sessionkey
          });
        } else {
          reject(new Error("获取openid失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
function getStoredOpenid() {
  return new Promise((resolve, reject) => {
    common_vendor.index.getStorage({
      key: "openid",
      success: (res) => {
        resolve(res.data);
      },
      fail: () => {
        reject(new Error("未找到存储的openid"));
      }
    });
  });
}
function getMaskedPhone() {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "获取遮罩手机号接口",
      // 需替换为实际接口
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve({
            maskedPhone: res.data.maskedPhone,
            isWechatBound: res.data.isWechatBound
          });
        } else {
          reject(new Error("获取遮罩手机号失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
exports.getMaskedPhone = getMaskedPhone;
exports.getOpenidAndSessionKey = getOpenidAndSessionKey;
exports.getStoredOpenid = getStoredOpenid;
exports.getWechatLoginCode = getWechatLoginCode;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_AI_Login_Match/login/phoneNumberApi.js.map
