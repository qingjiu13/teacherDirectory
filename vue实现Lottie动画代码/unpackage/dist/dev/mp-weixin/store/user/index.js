"use strict";
const store_user_myService_index = require("./myService/index.js");
const store_user_money_index = require("./money/index.js");
const store_user_baseInfo_index = require("./baseInfo/index.js");
const store_user_chat_index = require("./chat/index.js");
const store_user_match_index = require("./match/index.js");
const store_user_aiChat_index = require("./ai-chat/index.js");
const store_user_uploadFile_upload = require("./uploadFile/upload.js");
const user = {
  namespaced: true,
  modules: {
    myService: store_user_myService_index.myService,
    money: store_user_money_index.money,
    baseInfo: store_user_baseInfo_index.baseInfo,
    chat: store_user_chat_index.chat,
    match: store_user_match_index.match,
    aiChat: store_user_aiChat_index.aiChat,
    uploadFile: store_user_uploadFile_upload.uploadFile
  }
};
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/user/index.js.map
