"use strict";const t=require("../common/vendor.js"),r=require("./jwt.js"),e=0,n=1;exports.isLoggedIn=function(){return r.hasToken()&&function(){try{const r=t.index.getStorageSync("loginStatus");return""!==r?r:e}catch(r){return t.index.__f__("error","at utils/auth.js:72","获取登录状态失败:",r),e}}()===n};
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
