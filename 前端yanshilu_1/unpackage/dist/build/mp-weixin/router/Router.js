"use strict";const e=require("../common/vendor.js"),t={INDEX:"/pages/index/index"},a="/pages/match/match",i="/pages/teacher/teacher",o="/pages/AI/AI",n={MESSAGE:"/pages/message/message",CHAT:"/pages/message/chat"},s="/pages/login/login",g="/pages/login/student/student",r="/pages/login/teacher/teacher",T="/pages/login/wechat_login",c={STUDENT_MINE:"/pages/mine/mine/student_mine",TEACHER_MINE:"/pages/mine/mine/teacher_mine",MINE_COMMON:"/pages/mine/mine/mine_common",MODIFY:"/pages/mine/modify",COURSE:"/pages/mine/course/course",COURSE_DETAIL:"/pages/mine/course/course_detail",ORDER:"/pages/mine/order",STUDENT_ORDER:"/pages/mine/order/student_order",TEACHER_ORDER:"/pages/mine/order/teacher_order",APPRAISE:"/pages/mine/order/appraise/appraise",ORDER_COMMON:"/pages/mine/order/order_common",QUALIFICATION:"/pages/mine/qualification",SERVICE:"/pages/mine/service",SETTINGS:"/pages/mine/settings",WALLET:"/pages/mine/wallet"},d={navigateTo(t,a=null){if(a){const e=Object.keys(a).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(a[e])}`)).join("&");t=t.includes("?")?`${t}&${e}`:`${t}?${e}`}e.index.navigateTo({url:t})},redirectTo(t,a=null){if(a){const e=Object.keys(a).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(a[e])}`)).join("&");t=t.includes("?")?`${t}&${e}`:`${t}?${e}`}e.index.redirectTo({url:t})},switchTab(t){e.index.switchTab({url:t})},navigateBack(t=1){e.index.navigateBack({delta:t})},reLaunch(a=t.INDEX){e.index.reLaunch({url:a})},toIndex(){this.navigateTo(t.INDEX)},toMatch(){this.navigateTo(a)},toTeacher(e){this.navigateTo(i,{id:e})},toAIServer(){this.navigateTo(o)},toMessage(){this.navigateTo(n.MESSAGE)},toChat(e){this.navigateTo(n.CHAT,{userId:e})},toLogin(){this.navigateTo(s)},toStudentLogin(){this.navigateTo(g)},toTeacherLogin(){this.navigateTo(r)},toWechatLogin(){this.navigateTo(T)},toModify(){this.navigateTo(c.MODIFY)},toCourse(){this.navigateTo(c.COURSE)},toCourseDetail(e){this.navigateTo(c.COURSE_DETAIL,{id:e})},toOrder(){this.navigateTo(c.ORDER_COMMON)},toAppraise(e){this.navigateTo(c.APPRAISE,{orderId:e})},toQualification(){this.navigateTo(c.QUALIFICATION)},toService(){this.navigateTo(c.SERVICE)},toSettings(){this.navigateTo(c.SETTINGS)},toWallet(){this.navigateTo(c.WALLET)},toMine(){this.navigateTo(c.MINE_COMMON)}};exports.IndexRoutes=t,exports.MessageRoutes=n,exports.MineRoutes=c,exports.Navigator=d;
