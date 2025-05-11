"use strict";const l=require("../common/vendor.js"),n=require("../store/user/API.js"),t=(r,a,i="file")=>new Promise((u,o)=>{l.index.uploadFile({url:n.UPLOAD_FILE_URL,filePath:r,name:i,formData:{userId:a},success:e=>{const s=JSON.parse(e.data);s.code===200?u(s):o(s)},fail:e=>{o(e)}})});exports.uploadFile=t;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/http.js.map
