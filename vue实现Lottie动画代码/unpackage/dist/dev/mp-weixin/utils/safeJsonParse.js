"use strict";const s=require("../common/vendor.js");function o(r,e=null){if(!r)return e;if(typeof r=="object"&&r!==null)return r;if(typeof r!="string")return e;try{return JSON.parse(r)}catch(n){return s.index.__f__("error","at utils/safeJsonParse.js:30","JSON解析失败:",n,"原始数据:",r),e}}exports.safeJsonParse=o;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/safeJsonParse.js.map
