"use strict";const n={data(){return{}},created(){this.popup=this.getParent()},methods:{getParent(p="uniPopup"){let t=this.$parent,e=t.$options.name;for(;e!==p;){if(t=t.$parent,!t)return!1;e=t.$options.name}return t}}};exports.popup=n;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-popup/components/uni-popup/popup.js.map
