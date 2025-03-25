"use strict";const e=require("../../../common/vendor.js"),t=require("../../../utils/routes.js"),o=e.defineComponent({data:()=>({title:"AI智能择校",description:"通过多维度分析，帮助您找到最适合的学校",selectType:"",loading:!1}),onLoad(){e.index.__f__("log","at pages/AI/selection/selection.uvue:45","AI Selection page loaded")},methods:{selectUndergraduate(){this.selectType="undergraduate",this.goToNextStep()},selectGraduate(){this.selectType="graduate",this.goToNextStep()},goToNextStep(){t.Routes.navigator.navigateTo(t.Routes.ai.step2,new UTSJSONObject({type:this.selectType}))},goBack(){t.Routes.navigator.navigateBack()},goToHome(){t.Routes.navigator.switchTab(t.Routes.main.INDEX)}}});const a=e._export_sfc(o,[["render",function(t,o,a,s,i,r){return{a:e.t(i.title),b:e.t(i.description),c:e.o(((...e)=>r.selectUndergraduate&&r.selectUndergraduate(...e))),d:e.o(((...e)=>r.selectGraduate&&r.selectGraduate(...e))),e:e.o(((...e)=>r.goBack&&r.goBack(...e))),f:e.o(((...e)=>r.goToHome&&r.goToHome(...e))),g:e.sei(t.virtualHostId,"view")}}]]);wx.createPage(a);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/AI/selection/selection.js.map
