"use strict";const e=require("../common/vendor.js"),r=require("../config.js");exports.callCloudFunction=function(t){const{name:o,data:s,timeout:n=5e3}=t;return o?new Promise(((t,a)=>{e.index.request({url:`${r.CUSTOM_API_URL}/call/${o}`,method:"POST",data:{data:s},timeout:n,header:{"Content-Type":"application/json","X-Platform":e.index.getSystemInfoSync().platform,"X-AppId":"__UNI__92532B9"},success:e=>{200===e.statusCode?t({result:e.data,requestId:e.header["x-request-id"]||"",success:!0,errCode:0}):a(new Error(`HTTP错误: ${e.statusCode}`))},fail:e=>{a(new Error(`请求失败: ${e.errMsg}`))}})})):Promise.reject(new Error("云函数名称不能为空"))};
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cloudFunction.js.map
