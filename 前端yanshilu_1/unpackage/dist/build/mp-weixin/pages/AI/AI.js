"use strict";const e=require("../../common/vendor.js"),c=e.defineComponent({components:{choiceSelected:()=>"../../components/combobox/combobox.js"},data:()=>({choiceList:[new UTSJSONObject({choiceItemId:"0",choiceItemContent:"请选择"}),new UTSJSONObject({choiceItemId:"P",choiceItemContent:"苹果"}),new UTSJSONObject({choiceItemId:"L",choiceItemContent:"荔枝"}),new UTSJSONObject({choiceItemId:"X",choiceItemContent:"西瓜"}),new UTSJSONObject({choiceItemId:"H",choiceItemContent:"哈密瓜"})],choiceContent:"请选择",choiceIndex:0}),methods:{onChoiceClick:function(e=null){console.log("+++++++"+e);var c=this;c.choiceIndex=e,c.choiceContent=c.choiceList[e].choiceItemContent}}});if(!Array){e.resolveComponent("choice-selected")()}const o=e._export_sfc(c,[["render",function(c,o,t,n,i,h){return{a:e.o(h.onChoiceClick),b:e.p({choiceContent:i.choiceContent,choiceIndex:i.choiceIndex,choiceList:i.choiceList}),c:e.sei(c.virtualHostId,"view")}}]]);wx.createPage(o);
