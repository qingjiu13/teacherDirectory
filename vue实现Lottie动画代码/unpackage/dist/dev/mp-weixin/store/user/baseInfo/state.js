"use strict";
const state = {
  id: "123456",
  avatar: "/static/image/tab-bar/default_avatar.png",
  name: "张三",
  gender: "男",
  selfIntroduction: "我是一个热爱学习的学生",
  wechatNumber: "zhangsan123",
  phoneNumber: "13800138000",
  password: "123456",
  userInfo: {
    certificate: 1,
    //是否认证，0为未认证，1为已认证
    role: "学生",
    //学生或老师
    school: "北京大学",
    //学校
    major: "计算机科学",
    //专业
    targetSchool: "清华大学",
    //目标学校
    targetMajor: "软件工程",
    //目标专业
    studentGrade: "大三",
    //学生年级
    teacherGrade: "",
    //老师年级
    teacherScore: 0
    //老师考研成绩
  }
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/state.js.map
