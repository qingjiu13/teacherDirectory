"use strict";const e=require("../../../common/vendor.js"),n=e.defineComponent({name:"AISelectionStep3",data:()=>({englishLevels:["已过六级","已过四级","四级未过"],rankingLevels:["前10%","10%-40%","40%-70%","70%-100%"],selectedEnglishLevel:"",selectedRanking:""}),onLoad(){const n=e.index.getStorageSync("step3_english"),t=e.index.getStorageSync("step3_ranking");n&&(this.selectedEnglishLevel=n),t&&(this.selectedRanking=t)},methods:{selectEnglishLevel(n=null){this.selectedEnglishLevel=n,e.index.setStorageSync("step3_english",n)},selectRanking(n=null){this.selectedRanking=n,e.index.setStorageSync("step3_ranking",n)},prevPage(){e.index.navigateBack()},nextPage(){if(!this.selectedEnglishLevel||!this.selectedRanking)return e.index.showToast({title:"请选择完整信息",icon:"none"}),null;e.index.navigateTo({url:"/pages/AI/selection/step4"})}}});const t=e._export_sfc(n,[["render",function(n,t,s,i,l,a){return{a:e.f(l.englishLevels,((n,t,s)=>({a:e.t(n),b:t,c:e.n(l.selectedEnglishLevel===n?"active":""),d:e.o((e=>a.selectEnglishLevel(n)),t)}))),b:e.f(l.rankingLevels,((n,t,s)=>({a:e.t(n),b:t,c:e.n(l.selectedRanking===n?"active":""),d:e.o((e=>a.selectRanking(n)),t)}))),c:e.o(((...e)=>a.prevPage&&a.prevPage(...e))),d:e.o(((...e)=>a.nextPage&&a.nextPage(...e))),e:e.sei(n.virtualHostId,"view")}}]]);wx.createPage(t);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/AI/selection/step3.js.map
