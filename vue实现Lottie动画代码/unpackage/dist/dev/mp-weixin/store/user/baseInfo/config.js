"use strict";
require("../../../common/vendor.js");
require("../../../router/Router.js");
const store_user_baseInfo_mockApi = require("./mock-api.js");
const USE_MOCK_DATA = true;
const getApiImplementation = () => {
  {
    return store_user_baseInfo_mockApi.mockApi;
  }
};
exports.USE_MOCK_DATA = USE_MOCK_DATA;
exports.getApiImplementation = getApiImplementation;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/config.js.map
