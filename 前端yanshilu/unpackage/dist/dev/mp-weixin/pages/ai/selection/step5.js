"use strict";const e=require("../../../common/vendor.js"),t=e.defineComponent({name:"AISelectionStep5",data:()=>({targetOptions:["985","211及以上","一本及以上","普通院校及以上"],researchOptions:["考虑","不考虑"],selectedTarget:"",selectedResearch:""}),onLoad(){const t=e.index.getStorageSync("step5_target"),s=e.index.getStorageSync("step5_research");t&&(this.selectedTarget=t),s&&(this.selectedResearch=s)},methods:{selectTarget(t=null){this.selectedTarget=t,e.index.setStorageSync("step5_target",t)},selectResearch(t=null){this.selectedResearch=t,e.index.setStorageSync("step5_research",t)},prevPage(){e.index.navigateBack()},nextPage(){if(!this.selectedTarget||!this.selectedResearch)return e.index.showToast({title:"请选择完整信息",icon:"none"}),null;e.index.navigateTo({url:"/pages/AI/selection/step6"})}}});const s=e._export_sfc(t,[["render",function(t,s,a,r,c,n){return{a:e.f(c.targetOptions,((t,s,a)=>({a:e.t(t),b:s,c:e.n(c.selectedTarget===t?"active":""),d:e.o((e=>n.selectTarget(t)),s)}))),b:e.f(c.researchOptions,((t,s,a)=>({a:e.t(t),b:s,c:e.n(c.selectedResearch===t?"active":""),d:e.o((e=>n.selectResearch(t)),s)}))),c:e.o(((...e)=>n.prevPage&&n.prevPage(...e))),d:e.o(((...e)=>n.nextPage&&n.nextPage(...e))),e:e.sei(t.virtualHostId,"view")}}]]);wx.createPage(s);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/AI/selection/step5.js.map
