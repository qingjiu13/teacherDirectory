"use strict";const e=require("../../../common/vendor.js"),r=e.defineComponent({data:()=>({userRole:"",userName:"",userData:new UTSJSONObject({})}),onLoad(){this.userRole=e.index.getStorageSync("userRole"),this.loadUserData()},methods:{loadUserData(){}}});if(!Array){e.resolveComponent("include")()}const t=e._export_sfc(r,[["render",function(r,t,s,o,u,a){return e.e({a:e.t(u.userName),b:"teacher"===u.userRole},"teacher"===u.userRole?{c:e.p({src:"./teacher_order.uvue"})}:"student"===u.userRole?{e:e.p({src:"./student_order.uvue"})}:{},{d:"student"===u.userRole,f:e.sei(r.virtualHostId,"view")})}]]);wx.createPage(t);
