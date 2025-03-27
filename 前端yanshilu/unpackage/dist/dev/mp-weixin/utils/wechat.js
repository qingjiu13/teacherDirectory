"use strict";const e=require("../common/vendor.js");exports.wxLogin=function(){return new Promise(((r,o)=>{e.index.login({provider:"weixin",success:e=>{e.code?r({code:e.code}):o(new Error("微信登录失败"))},fail:e=>{o(new Error("微信登录失败: "+JSON.stringify(e)))}})}))};
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/wechat.js.map
