"use strict";
const mockUsers = [
  {
    id: "123456",
    username: "zhangsan",
    password: "123456",
    avatar: "/static/image/tab-bar/default_avatar.png",
    nickname: "张三",
    name: "张三",
    gender: "男",
    introduction: "我是一个热爱学习的学生",
    selfIntroduction: "我是一个热爱学习的学生",
    wechat: "zhangsan123",
    wechatNumber: "zhangsan123",
    phone: "13800138000",
    phoneNumber: "13800138000",
    role: "student",
    userInfo: {
      certificate: 1,
      // 是否认证，0为未认证，1为已认证
      role: "学生",
      // 学生或老师
      school: "北京大学",
      // 学校
      major: "计算机科学",
      // 专业
      targetSchool: "清华大学",
      // 目标学校
      targetMajor: "软件工程",
      // 目标专业
      studentGrade: "大三",
      // 学生年级
      teacherGrade: "",
      // 老师年级
      teacherScore: 0
      // 老师考研成绩
    }
  },
  {
    id: "654321",
    username: "lisi",
    password: "654321",
    avatar: "/static/image/tab-bar/default_avatar.png",
    nickname: "李四",
    name: "李四",
    gender: "女",
    introduction: "我是一个有经验的考研辅导老师",
    selfIntroduction: "我是一个有经验的考研辅导老师",
    wechat: "lisi456",
    wechatNumber: "lisi456",
    phone: "13900139000",
    phoneNumber: "13900139000",
    role: "teacher",
    userInfo: {
      certificate: 1,
      role: "老师",
      school: "清华大学",
      major: "软件工程",
      targetSchool: "",
      targetMajor: "",
      studentGrade: "",
      teacherGrade: "研一",
      teacherScore: 380
    }
  }
];
const DEFAULT_USER_INFO = {
  id: "",
  avatar: "/static/image/tab-bar/default_avatar.png",
  nickname: "游客",
  name: "游客",
  gender: "",
  introduction: "",
  selfIntroduction: "",
  wechat: "",
  wechatNumber: "",
  phone: "",
  phoneNumber: "",
  role: "student",
  userInfo: {
    certificate: 0,
    role: "学生",
    school: "",
    major: "",
    targetSchool: "",
    targetMajor: "",
    studentGrade: "",
    teacherGrade: "",
    teacherScore: 0
  }
};
const mockApiResponse = (success, data, error = null) => {
  if (success) {
    return {
      success: true,
      data
    };
  } else {
    return {
      success: false,
      error: error || {
        message: "请求失败"
      }
    };
  }
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.DEFAULT_USER_INFO = DEFAULT_USER_INFO;
exports.delay = delay;
exports.mockApiResponse = mockApiResponse;
exports.mockUsers = mockUsers;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/baseInfo/mock-data.js.map
