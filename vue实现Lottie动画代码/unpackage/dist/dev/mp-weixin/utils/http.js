"use strict";
const common_vendor = require("../common/vendor.js");
const store_user_API = require("../store/user/API.js");
const uploadFile = (filePath, userId, fileType = "file") => {
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: store_user_API.UPLOAD_FILE_URL,
      filePath,
      name: fileType,
      formData: {
        userId
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/http.js.map
