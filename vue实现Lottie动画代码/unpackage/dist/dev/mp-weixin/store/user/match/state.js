"use strict";
const state = {
  // 学校列表
  schoolList: "",
  // 专业课列表
  professionalList: "",
  // 非专业课列表
  nonProfessionalList: "",
  // 筛选列表
  filterMode: "",
  // 匹配列表
  matchList: [
    {
      id: "teacher001",
      name: "张老师",
      avatar: "/static/image/tab-bar/default_avatar.png",
      gender: "male",
      selfIntroduction: "清华大学计算机专业硕士，5年教学经验",
      certificate: 1,
      school: "清华大学",
      major: "计算机科学与技术",
      teacherScore: 420,
      service: [
        {
          id: "service001",
          name: "考研规划咨询",
          type: "咨询",
          price: 200,
          description: "提供考研全程规划指导",
          image: "/static/image/service/plan.png"
        },
        {
          id: "service002",
          name: "专业课辅导",
          type: "辅导",
          price: 300,
          description: "计算机专业课一对一辅导",
          image: "/static/image/service/course.png"
        }
      ]
    },
    {
      id: "teacher002",
      name: "李老师",
      avatar: "/static/image/tab-bar/default_avatar.png",
      gender: "female",
      selfIntroduction: "北京大学经济学博士，3年教学经验",
      certificate: 1,
      school: "北京大学",
      major: "经济学",
      teacherScore: 410,
      service: [
        {
          id: "service003",
          name: "经济学基础课程",
          type: "课程",
          price: 150,
          description: "经济学基础理论讲解",
          image: "/static/image/service/economics.png"
        }
      ]
    }
  ]
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/state.js.map
