"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_filter = require("./modules/filter.js");
const store_user_index = require("./user/index.js");
const store = common_vendor.createStore({
  modules: {
    filter: store_modules_filter.filter,
    user: store_user_index.user
    // 加载其他模块
    // TODO: 添加其他现有模块
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
