"use strict";var k=function(){function _(i,t){return t!=null&&i instanceof t}var v;try{v=Map}catch{v=function(){}}var g;try{g=Set}catch{g=function(){}}var j;try{j=Promise}catch{j=function(){}}function o(i,t,s,a,E){typeof t=="object"&&(s=t.depth,a=t.prototype,E=t.includeNonEnumerable,t=t.circular);var D=[],R=[],T=typeof Buffer<"u";typeof t>"u"&&(t=!0),typeof s>"u"&&(s=1/0);function r(e,c){if(e===null)return null;if(c===0)return e;var f,x;if(typeof e!="object")return e;if(_(e,v))f=new v;else if(_(e,g))f=new g;else if(_(e,j))f=new j(function(u,y){e.then(function(b){u(r(b,c-1))},function(b){y(r(b,c-1))})});else if(o.__isArray(e))f=[];else if(o.__isRegExp(e))f=new RegExp(e.source,d(e)),e.lastIndex&&(f.lastIndex=e.lastIndex);else if(o.__isDate(e))f=new Date(e.getTime());else{if(T&&Buffer.isBuffer(e))return Buffer.from?f=Buffer.from(e):(f=new Buffer(e.length),e.copy(f)),f;_(e,Error)?f=Object.create(e):typeof a>"u"?(x=Object.getPrototypeOf(e),f=Object.create(x)):(f=Object.create(a),x=a)}if(t){var B=D.indexOf(e);if(B!=-1)return R[B];D.push(e),R.push(f)}_(e,v)&&e.forEach(function(u,y){var b=r(y,c-1),M=r(u,c-1);f.set(b,M)}),_(e,g)&&e.forEach(function(u){var y=r(u,c-1);f.add(y)});for(var n in e){var m=Object.getOwnPropertyDescriptor(e,n);m&&(f[n]=r(e[n],c-1));try{var F=Object.getOwnPropertyDescriptor(e,n);if(F.set==="undefined")continue;f[n]=r(e[n],c-1)}catch(u){if(u instanceof TypeError)continue;if(u instanceof ReferenceError)continue}}if(Object.getOwnPropertySymbols)for(var S=Object.getOwnPropertySymbols(e),n=0;n<S.length;n++){var w=S[n],l=Object.getOwnPropertyDescriptor(e,w);l&&!l.enumerable&&!E||(f[w]=r(e[w],c-1),Object.defineProperty(f,w,l))}if(E)for(var h=Object.getOwnPropertyNames(e),n=0;n<h.length;n++){var P=h[n],l=Object.getOwnPropertyDescriptor(e,P);l&&l.enumerable||(f[P]=r(e[P],c-1),Object.defineProperty(f,P,l))}return f}return r(i,s)}o.clonePrototype=function(t){if(t===null)return null;var s=function(){};return s.prototype=t,new s};function O(i){return Object.prototype.toString.call(i)}o.__objToStr=O;function C(i){return typeof i=="object"&&O(i)==="[object Date]"}o.__isDate=C;function A(i){return typeof i=="object"&&O(i)==="[object Array]"}o.__isArray=A;function I(i){return typeof i=="object"&&O(i)==="[object RegExp]"}o.__isRegExp=I;function d(i){var t="";return i.global&&(t+="g"),i.ignoreCase&&(t+="i"),i.multiline&&(t+="m"),t}return o.__getRegExpFlags=d,o}();exports.clone=k;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/uview-plus/libs/luch-request/utils/clone.js.map
