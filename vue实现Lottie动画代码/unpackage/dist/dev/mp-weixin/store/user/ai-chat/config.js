"use strict";
require("../../../common/vendor.js");
const store_user_aiChat_mockApi = require("./mock-api.js");
const getApiImplementation = () => {
  {
    return store_user_aiChat_mockApi.mockApi;
  }
};
exports.getApiImplementation = getApiImplementation;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/ai-chat/config.js.map
