"use strict";const s=require("../../../common/vendor.js"),e=require("../../../config.js"),t=require("../../../common/assets.js"),a=s.defineComponent({name:"AISelectionResult",data:()=>({analysisId:"",currentIndex:0,loading:!0,analysisResult:null,displaySchools:[]}),onLoad(e){s.index.__f__("log","at pages/AI/selection/result.uvue:137","结果页面加载，参数:",e),this.analysisId=e.id||"",this.loading=!0,this.loadAnalysisResult()},methods:{loadAnalysisResult(){return s.__awaiter(this,void 0,void 0,(function*(){try{this.loading=!0,s.index.__f__("log","at pages/AI/selection/result.uvue:151","尝试从云端加载数据, ID:",this.analysisId);const t=yield s.Zs.callFunction({name:e.aiSelectionApis.getSchoolAnalysis,data:new UTSJSONObject({action:"get",id:this.analysisId}),timeout:15e3});if(s.index.__f__("log","at pages/AI/selection/result.uvue:163","获取分析结果返回:",t),t.result&&0===t.result.code&&t.result.data){const e=t.result.data;e.analysis_result?(this.analysisResult=e,e.analysis_result.recommendSchools&&e.analysis_result.recommendSchools.length>0?(this.displaySchools=e.analysis_result.recommendSchools,s.index.__f__("log","at pages/AI/selection/result.uvue:175","成功加载AI推荐学校:",this.displaySchools.length)):e.analysis_result.rawResponse?(s.index.__f__("log","at pages/AI/selection/result.uvue:178","API返回了原始响应但JSON解析失败"),this.displaySchools=[{name:"API原始响应",features:"以下是DeepSeek API的原始返回内容",reason:e.analysis_result.rawResponse.substring(0,300)+"...",difficulty:"解析失败: "+(e.analysis_result.parseError||"未知原因"),suggestion:"请尝试重新分析",rating:0,recommendMajor:"无法解析"}]):this.showError("分析结果异常","没有找到推荐学校信息，请尝试重新分析")):this.showError("分析结果异常","分析结果格式错误，请尝试重新分析")}else this.showError("获取分析结果失败","无法获取分析结果，请尝试重新分析")}catch(t){this.showError("系统错误","加载分析结果时发生错误: "+t.message)}finally{this.loading=!1}}))},showError(e=null,t=null){s.index.showModal({title:e,content:t,showCancel:!1,success:()=>{s.index.navigateBack()}})},swiperChange(s=null){this.currentIndex=s.detail.current},jumpToCard(s=null){this.currentIndex=s},restartAnalysis(){s.index.navigateBack({delta:10,success:()=>{s.index.navigateTo({url:"/pages/AI/selection/selection"})}})},shareResult(){s.index.showToast({title:"分享功能开发中",icon:"none"})},getStarText(s=null){if(!s&&0!==s)return"☆☆☆☆☆";const e=parseFloat(s)||0,t=Math.floor(e),a=e-t>=.5;let n="★".repeat(t);a&&(n+="☆");const l=5-n.length;return n+="☆".repeat(l),n},formatAdviceContent(s=null){if(!s)return"暂无数据";const e=s.split("\n");let t="";for(let a=0;a<e.length;a++){const s=e[a].trim();if(!s)continue;const n=s.match(/^(\d+)\.\s*(.*)$/);t+=n?`<div class="list-item"><strong>${n[1]}.</strong> ${n[2]}</div>`:`<div>${s}</div>`}return t||s}}});const n=s._export_sfc(a,[["render",function(e,a,n,l,i,o){return s.e({a:i.loading},i.loading?{b:t._imports_0$4}:s.e({c:s.f(i.displaySchools,((e,t,a)=>({a:s.t(e.name),b:s.t(o.getStarText(e.rating)),c:s.t(e.rating.toFixed(1)),d:s.t(e.recommendMajor),e:s.t(e.features),f:s.t(e.reason),g:s.t(e.difficulty),h:s.t(e.suggestion),i:t}))),d:s.t(i.currentIndex+1),e:s.t(i.displaySchools.length),f:s.o(((...s)=>o.swiperChange&&o.swiperChange(...s))),g:s.f(i.displaySchools,((e,t,a)=>({a:t,b:s.n(i.currentIndex===t?"active":""),c:s.o((s=>o.jumpToCard(t)),t)}))),h:i.analysisResult&&i.analysisResult.analysis_result&&i.analysisResult.analysis_result.advice},i.analysisResult&&i.analysisResult.analysis_result&&i.analysisResult.analysis_result.advice?{i:o.formatAdviceContent(i.analysisResult.analysis_result.advice.advantages),j:o.formatAdviceContent(i.analysisResult.analysis_result.advice.disadvantages),k:o.formatAdviceContent(i.analysisResult.analysis_result.advice.strategy),l:o.formatAdviceContent(i.analysisResult.analysis_result.advice.timeline),m:o.formatAdviceContent(i.analysisResult.analysis_result.advice.keyPoints)}:{}),{n:s.o(((...s)=>o.shareResult&&o.shareResult(...s))),o:s.o(((...s)=>o.restartAnalysis&&o.restartAnalysis(...s))),p:s.sei(e.virtualHostId,"view")})}]]);wx.createPage(n);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/AI/selection/result.js.map
