"use strict";
const getServiceTypeByName = (typename) => {
  const baseType = { typename };
  switch (typename) {
    case "一对一课程":
      return {
        ...baseType,
        coursenum: 12,
        fulllength: {
          hours: "120小时",
          minutes: "30分钟"
        }
      };
    case "一对多课程":
      return {
        ...baseType,
        coursenum: 12,
        fulllength: {
          hours: "120小时",
          minutes: "30分钟"
        },
        studentnum: 4
      };
    case "学习资料":
      return {
        ...baseType,
        fileLink: "https://www.baidu.com"
      };
    default:
      return baseType;
  }
};
const state = {
  service: [
    {
      id: "service001",
      name: "考研规划咨询",
      type: getServiceTypeByName("一对一课程"),
      price: "200元",
      description: "提供考研全程规划指导",
      image: "/static/image/service/plan.png"
    },
    {
      id: "service002",
      name: "一对多课程",
      type: getServiceTypeByName("一对多课程"),
      price: "300元",
      description: "计算机专业课一对一辅导",
      image: "/static/image/service/course.png"
    },
    {
      id: "service003",
      name: "经济学基础课程",
      type: getServiceTypeByName("学习资料"),
      price: "150元",
      description: "经济学基础理论讲解",
      image: "/static/image/service/economics.png"
    }
  ]
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/myService/state.js.map
