"use strict";const e=require("../../../common/vendor.js"),t=require("../../../config.js"),a=e.defineComponent({data:()=>({areaA:["北京市","上海市","浙江省","江苏省","湖北省","广东省","吉林省","天津市"],areaB:["四川省","安徽省","陕西省","黑龙江省","湖南省","山东省","福建省","辽宁省","重庆市","河南省","江西省","山西省"],selectedAreas:[]}),onLoad(){const t=e.index.getStorageSync("step6_areas");t&&Array.isArray(t)&&(this.selectedAreas=t)},methods:{toggleArea(t=null){const a=this.selectedAreas.indexOf(t);-1===a?this.selectedAreas.push(t):this.selectedAreas.splice(a,1),e.index.setStorageSync("step6_areas",this.selectedAreas)},prevPage(){e.index.navigateBack()},submitData(){var a;return e.__awaiter(this,void 0,void 0,(function*(){if(0===this.selectedAreas.length)return e.index.showToast({title:"请至少选择一个目标省份",icon:"none"}),Promise.resolve(null);try{e.index.showLoading({title:"准备分析..."});const s=new UTSJSONObject({identity:e.index.getStorageSync("step1_data")||"",university:e.index.getStorageSync("step2_school")||"",major:e.index.getStorageSync("step2_major")||"",englishLevel:e.index.getStorageSync("step3_english")||"",ranking:e.index.getStorageSync("step3_ranking")||"",targetMajor:e.index.getStorageSync("step4_major")||"",studyMode:e.index.getStorageSync("step4_mode")||"",targetType:e.index.getStorageSync("step5_target")||"",considerResearch:e.index.getStorageSync("step5_research")||"",targetAreas:this.selectedAreas});e.index.__f__("log","at pages/ai/selection/step6.uvue:123","提交数据:",s);const n=yield e.Zs.callFunction({name:t.aiSelectionApis.saveAnalysisRequest,data:new UTSJSONObject({formData:s}),timeout:1e4});if(e.index.hideLoading(),!n.result||0!==n.result.code)throw new Error((null===(a=n.result)||void 0===a?void 0:a.msg)||"准备分析失败");{const a=n.result.data.id;e.index.navigateTo({url:"/pages/ai/selection/analyzing?id="+a}),e.Zs.callFunction({name:t.aiSelectionApis.startAnalysis,data:new UTSJSONObject({id:a}),success:(t=null)=>{e.index.__f__("log","at pages/ai/selection/step6.uvue:149","分析开始:",t)},fail:(t=null)=>{e.index.__f__("error","at pages/ai/selection/step6.uvue:152","启动分析失败:",t)}})}}catch(s){e.index.hideLoading(),e.index.showModal({title:"提示",content:s.message||"准备分析失败，请重试",showCancel:!1})}}))}}});const s=e._export_sfc(a,[["render",function(t,a,s,n,i,r){return{a:e.f(i.areaA,((t,a,s)=>({a:e.t(t),b:a,c:e.n(i.selectedAreas.includes(t)?"active":""),d:e.o((e=>r.toggleArea(t)),a)}))),b:e.f(i.areaB,((t,a,s)=>({a:e.t(t),b:a,c:e.n(i.selectedAreas.includes(t)?"active":""),d:e.o((e=>r.toggleArea(t)),a)}))),c:e.o(((...e)=>r.prevPage&&r.prevPage(...e))),d:e.o(((...e)=>r.submitData&&r.submitData(...e))),e:e.sei(t.virtualHostId,"view")}}]]);wx.createPage(s);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/ai/selection/step6.js.map
