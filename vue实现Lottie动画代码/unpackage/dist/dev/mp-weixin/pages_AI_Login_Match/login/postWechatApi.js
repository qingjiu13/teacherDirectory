"use strict";
const common_vendor = require("../../common/vendor.js");
function postUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: "用户信息接口",
      // 需替换为实际接口
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      data: {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        openid: userInfo.openid,
        timestamp: Date.now()
      },
      success: (res) => {
        if (res.data.r === "T") {
          resolve(res.data);
        } else {
          reject(new Error(res.data.msg || "提交用户信息失败"));
        }
      },
      fail: (error) => {
        reject(new Error("网络请求失败"));
      }
    });
  });
}
exports.postUserInfo = postUserInfo;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_AI_Login_Match/login/postWechatApi.js.map
