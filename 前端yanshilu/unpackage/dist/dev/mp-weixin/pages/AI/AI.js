"use strict";const e=require("../../common/vendor.js"),s=require("../../utils/routes.js"),t=e.defineComponent({data:()=>({userInfo:new UTSJSONObject({school:"",major:""}),inputValue:"",currentFunction:null,messages:[]}),onLoad(){this.getUserInfo()},methods:{getUserInfo(){try{const s=e.index.getStorageSync("userInfo");s&&(this.userInfo=UTS.JSON.parse(s))}catch(s){e.index.__f__("error","at pages/AI/AI.uvue:110","获取用户信息失败:",s)}},saveUserInfo(){try{e.index.setStorageSync("userInfo",UTS.JSON.stringify(this.userInfo)),e.index.showToast({title:"保存成功",icon:"success"})}catch(s){e.index.__f__("error","at pages/AI/AI.uvue:125","保存用户信息失败:",s),e.index.showToast({title:"保存失败",icon:"none"})}},switchFunction(e=null){this.currentFunction=e;let s="通用";"school"===e?s="择校":"career"===e&&(s="职业规划"),this.messages.push({type:"system",content:`已切换到${s}模式`})},sendMessage(){if(!this.inputValue.trim())return null;this.messages.push({type:"user",content:this.inputValue}),new UTSJSONObject({content:this.inputValue,function:this.currentFunction,userInfo:this.userInfo}),setTimeout((()=>{let e="";e="school"===this.currentFunction?`关于择校问题，基于您就读的${this.userInfo.school||"(未设置学校)"}，${this.userInfo.major||"(未设置专业)"}专业，我的建议是...`:"career"===this.currentFunction?`关于职业规划，考虑到您在${this.userInfo.school||"(未设置学校)"}学习${this.userInfo.major||"(未设置专业)"}，您可以考虑以下职业方向...`:`您好，我是研师录AI助手，很高兴为您服务。您的问题是"${this.inputValue}"，我的回答是...`,this.messages.push({type:"ai",content:e})}),500),this.inputValue=""},goBack(){try{s.Routes.navigator.navigateBack()}catch(t){e.index.__f__("error","at pages/AI/AI.uvue:205","返回失败:",t),s.Routes.navigator.reLaunch(s.Routes.main.INDEX)}}}});const n=e._export_sfc(t,[["render",function(s,t,n,o,r,u){return e.e({a:r.userInfo.school,b:e.o((e=>r.userInfo.school=e.detail.value)),c:r.userInfo.major,d:e.o((e=>r.userInfo.major=e.detail.value)),e:e.o(((...e)=>u.saveUserInfo&&u.saveUserInfo(...e))),f:0===r.messages.length},0===r.messages.length?{}:{g:e.f(r.messages,((s,t,n)=>({a:e.t(s.content),b:t,c:e.n(s.type)})))},{h:null===r.currentFunction?1:"",i:e.o((e=>u.switchFunction(null))),j:"school"===r.currentFunction?1:"",k:e.o((e=>u.switchFunction("school"))),l:"career"===r.currentFunction?1:"",m:e.o((e=>u.switchFunction("career"))),n:e.o(((...e)=>u.sendMessage&&u.sendMessage(...e))),o:r.inputValue,p:e.o((e=>r.inputValue=e.detail.value)),q:e.o(((...e)=>u.sendMessage&&u.sendMessage(...e))),r:e.sei(s.virtualHostId,"view")})}]]);wx.createPage(n);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
