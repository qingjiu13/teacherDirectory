"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_http = require("../../../utils/http.js");
const state = {
  fileLink: ""
  // 后端返回的文件下载链接
};
const mutations = {
  SET_FILE_LINK(state2, link) {
    state2.fileLink = link;
  }
};
const actions = {
  async uploadUserFile({ commit }, { userId, filePath }) {
    try {
      const res = await utils_http.uploadFile(filePath, userId);
      commit("SET_FILE_LINK", res.data.url);
      return res;
    } catch (err) {
      common_vendor.index.__f__("error", "at store/user/uploadFile/upload.js:21", "上传失败", err);
      throw err;
    }
  }
};
const uploadFile = {
  namespaced: true,
  state,
  mutations,
  actions
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/uploadFile/upload.js.map
