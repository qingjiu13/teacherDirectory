import { UPLOAD_FILE_URL, API_BASE_URL } from "@/store/user/API.js";
import { safeJsonParse } from "@/utils/safeJsonParse.js";

export const http = (options) => {
  return new Promise((resolve, reject) => {
    const header = { "Content-Type": "application/json" };
    const jwtToken = uni.getStorageSync("jwtToken");
    if (jwtToken) {
      header.Authorization = jwtToken;
    }
    uni.request({
      url: API_BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const uploadFile = (filePath, userId, fileType = "file") => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: UPLOAD_FILE_URL,
      filePath,
      name: fileType,
      formData: {
        userId: userId,
      },
      success: (res) => {
        const data = safeJsonParse(res.data, {
          code: 500,
          message: "响应数据格式错误",
        });

        if (data.code === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
