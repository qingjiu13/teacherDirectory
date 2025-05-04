"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_API = require("../API.js");
const getBalanceAPI = (userId) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: store_user_API.BALANCE_GET_BALANCE_URL,
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      data: { userId },
      // 添加用户ID参数
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: reject
    });
  });
};
const withdrawAPI = (data) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: store_user_API.BALANCE_WITHDRAWAL_URL,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(data),
      // data中应包含userId
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: reject
    });
  });
};
exports.getBalanceAPI = getBalanceAPI;
exports.withdrawAPI = withdrawAPI;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/APIroute/money_api.js.map
