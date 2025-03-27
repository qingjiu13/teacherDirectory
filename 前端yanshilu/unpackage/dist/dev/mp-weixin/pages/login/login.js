"use strict";const e=require("../../common/vendor.js"),t=require("../../api/auth.js"),o=require("../../utils/routes.js"),i=require("../../utils/wechat.js"),n=require("../../utils/checkload.js"),s=require("../../common/assets.js"),r=e.defineComponent({data:()=>({mobile:"",code:"",countdown:0,loading:!1,timer:null,redirectUrl:"",isAgreed:!1,authSetting:new UTSJSONObject({}),showPhoneButton:!1}),onLoad(e){e.redirect&&(this.redirectUrl=decodeURIComponent(e.redirect)),this.checkAuthSetting()},onUnload(){this.timer&&(clearInterval(this.timer),this.timer=null)},methods:{checkAuthSetting(){if(e.wx$1.getAppAuthorizeSetting){const t=e.wx$1.getAppAuthorizeSetting();e.index.__f__("log","at pages/login/login.uvue:119","授权设置信息：",t),this.authSetting=t,"authorized"===t["scope.userInfo"]&&e.index.__f__("log","at pages/login/login.uvue:125","用户已授权获取用户信息"),"authorized"===t["scope.phoneNumber"]&&(e.index.__f__("log","at pages/login/login.uvue:130","用户已授权获取手机号"),this.showPhoneButton=!0)}else e.index.__f__("log","at pages/login/login.uvue:134","wx.getAppAuthorizeSetting API 不可用，请更新基础库版本")},customAgreementChange(e=null){this.isAgreed="agreed"===e.detail.value},handleMobileLogin(){return e.__awaiter(this,void 0,void 0,(function*(){if(!this.isAgreed)return e.index.showToast({title:"请先同意用户协议和隐私政策",icon:"none"}),Promise.resolve(null);if(!this.mobile||!/^1\d{10}$/.test(this.mobile))return e.index.showToast({title:"请输入有效的手机号",icon:"none"}),Promise.resolve(null);if(!this.code||6!==this.code.length)return e.index.showToast({title:"请输入6位验证码",icon:"none"}),Promise.resolve(null);this.loading=!0;try{const e=yield t.loginWithMobile(new UTSJSONObject({mobile:this.mobile,code:this.code}));e&&e.data&&n.updateLoginStatus(e.data.userInfo,e.data.token),this.loginSuccess()}catch(o){e.index.showToast({title:o.message||"登录失败，请重试",icon:"none"})}finally{this.loading=!1}}))},sendCode(){return e.__awaiter(this,void 0,void 0,(function*(){if(this.countdown>0||!this.mobile)return Promise.resolve(null);if(!/^1\d{10}$/.test(this.mobile))return e.index.showToast({title:"请输入有效的手机号",icon:"none"}),Promise.resolve(null);try{yield t.sendVerificationCode(this.mobile),this.startCountdown()}catch(o){e.index.showToast({title:o.message||"发送验证码失败",icon:"none"})}}))},startCountdown(){this.countdown=60,this.timer&&clearInterval(this.timer),this.timer=setInterval((()=>{this.countdown>0?this.countdown--:(clearInterval(this.timer),this.timer=null)}),1e3)},handleWechatLogin(){return e.__awaiter(this,void 0,void 0,(function*(){if(!this.isAgreed)return e.index.showToast({title:"请先同意用户协议和隐私政策",icon:"none"}),Promise.resolve(null);this.loading=!0;try{if(e.wx$1.getAppAuthorizeSetting){"authorized"!==e.wx$1.getAppAuthorizeSetting()["scope.userInfo"]?e.index.showModal({title:"提示",content:'需要获取您的用户信息才能登录，请在稍后的弹窗中点击"允许"',success:e=>{e.confirm?this.processWechatLogin():this.loading=!1}}):this.processWechatLogin()}else this.processWechatLogin()}catch(t){e.index.__f__("error","at pages/login/login.uvue:295","微信登录前检查授权失败：",t),this.processWechatLogin()}}))},processWechatLogin(){return e.__awaiter(this,void 0,void 0,(function*(){try{const e=(yield i.wxLogin()).code;if(!e)throw new Error("获取微信授权失败");const o=yield t.loginWithWechat(new UTSJSONObject({code:e}));o&&o.data&&n.updateLoginStatus(o.data.userInfo,o.data.token),this.loginSuccess()}catch(o){e.index.showToast({title:o.message||"微信登录失败，请重试",icon:"none"})}finally{this.loading=!1}}))},onGetUserInfo(o=null){return e.__awaiter(this,void 0,void 0,(function*(){if("getUserInfo:ok"!==o.detail.errMsg)return e.index.showToast({title:"请授权获取用户信息",icon:"none"}),Promise.resolve(null);if(!this.isAgreed)return e.index.showToast({title:"请先同意用户协议和隐私政策",icon:"none"}),Promise.resolve(null);this.loading=!0;try{const e=(yield i.wxLogin()).code;if(!e)throw new Error("获取微信授权失败");const s=yield t.loginWithWechat(new UTSJSONObject({code:e,userInfo:o.detail.userInfo}));s&&s.data&&n.updateLoginStatus(s.data.userInfo,s.data.token),this.loginSuccess()}catch(s){e.index.showToast({title:s.message||"微信登录失败，请重试",icon:"none"})}finally{this.loading=!1}}))},loginSuccess(){e.index.showToast({title:"登录成功",icon:"success"}),setTimeout((()=>{this.redirectUrl?o.Navigator.reLaunch(this.redirectUrl):o.Navigator.reLaunch(o.MainRoutes.INDEX)}),1500)},goToTerms(){o.Navigator.navigateTo(o.CommonRoutes.TERMS)},goToPrivacy(){o.Navigator.navigateTo(o.CommonRoutes.PRIVACY)}}});const a=e._export_sfc(r,[["render",function(t,o,i,n,r,a){return e.e({a:r.mobile,b:e.o((e=>r.mobile=e.detail.value)),c:r.code,d:e.o((e=>r.code=e.detail.value)),e:r.countdown<=0},r.countdown<=0?{f:e.o(((...e)=>a.sendCode&&a.sendCode(...e)))}:{},{g:e.o(((...e)=>a.handleMobileLogin&&a.handleMobileLogin(...e))),h:r.loading,i:r.isAgreed,j:e.o(((...e)=>a.customAgreementChange&&a.customAgreementChange(...e))),k:e.o(((...e)=>a.goToTerms&&a.goToTerms(...e))),l:e.o(((...e)=>a.goToPrivacy&&a.goToPrivacy(...e))),m:s._imports_0$4,n:e.o(((...e)=>a.onGetUserInfo&&a.onGetUserInfo(...e))),o:e.sei(t.virtualHostId,"view")})}]]);wx.createPage(a);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
