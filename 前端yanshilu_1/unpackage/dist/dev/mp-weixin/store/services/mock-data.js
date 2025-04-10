"use strict";
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const mockTeachers = [
  {
    id: 1,
    nickname: "王教授",
    avatar: "/static/image/tab-bar/default_avatar.png",
    school: "北京大学",
    major: "计算机科学",
    title: "教授",
    score: "考研400分",
    tags: ["认证学校", "经验丰富", "答疑及时", "通俗易懂"],
    introduction: "从事计算机教学20年，专注于算法和数据结构领域研究。曾指导多名学生成功考取清华、北大等名校研究生。教学风格深入浅出，善于将复杂概念简单化。"
  },
  {
    id: 2,
    nickname: "李博士",
    avatar: "/static/image/tab-bar/default_avatar.png",
    school: "清华大学",
    major: "软件工程",
    title: "副教授",
    score: "考研390分",
    tags: ["认证学校", "教学认真"],
    introduction: "清华大学软件工程博士，主攻软件测试和质量保障。曾在BAT企业担任技术主管，拥有丰富的实战经验。教学擅长将理论与实践相结合，帮助学生掌握核心竞争力。"
  },
  {
    id: 3,
    nickname: "张老师",
    avatar: "/static/image/tab-bar/default_avatar.png",
    school: "复旦大学",
    major: "数学",
    title: "讲师",
    score: "考研380分",
    tags: ["认证学校", "耐心细致"],
    introduction: "复旦大学数学系毕业，专注于高等数学和线性代数教学。擅长分析学生薄弱环节，因材施教。教学方法通俗易懂，深受学生喜爱。"
  },
  {
    id: 4,
    nickname: "刘教授",
    avatar: "/static/image/tab-bar/default_avatar.png",
    school: "浙江大学",
    major: "物理",
    title: "教授",
    score: "考研410分",
    tags: ["认证学校", "通俗易懂"],
    introduction: "浙江大学物理学院教授，在量子物理领域有深入研究。发表SCI论文20余篇，主持多项国家级课题。教学风格严谨而不失幽默，善于激发学生学习兴趣。"
  },
  {
    id: 5,
    nickname: "陈老师",
    avatar: "/static/image/tab-bar/default_avatar.png",
    school: "南京大学",
    major: "化学",
    title: "副教授",
    score: "考研385分",
    tags: ["认证学校", "答疑及时"],
    introduction: "南京大学化学系副教授，有机化学方向。曾获全国优秀教师称号，教学经验丰富。辅导过上百名学生成功考研，熟悉各大高校化学专业考研要求。"
  }
];
const mockServices = [
  {
    id: 1,
    title: "考研数学一对一辅导",
    price: 300,
    image: "/static/image/tab-bar/default_avatar.png",
    description: "针对考研数学难点，提供个性化辅导，帮助你掌握核心解题技巧。"
  },
  {
    id: 2,
    title: "计算机专业课指导",
    price: 250,
    image: "/static/image/tab-bar/default_avatar.png",
    description: "数据结构、操作系统、计算机网络、计算机组成原理全面指导。"
  },
  {
    id: 3,
    title: "考研复习规划制定",
    price: 180,
    image: "/static/image/tab-bar/default_avatar.png",
    description: "根据个人情况定制复习计划，科学规划时间，提高复习效率。"
  }
];
const mockChatHistory = [
  {
    isUser: false,
    content: "您好，欢迎使用研师录AI助手，有什么可以帮助您的吗？",
    timestamp: Date.now() - 6e4 * 5
  },
  {
    isUser: true,
    content: "我想了解北京大学计算机专业的考研难度",
    timestamp: Date.now() - 6e4 * 4
  },
  {
    isUser: false,
    content: "北京大学计算机专业是全国顶尖的计算机专业之一，考研难度较大。根据历年数据，其考研分数线通常在370-390分之间，录取比例约为8:1左右。建议您提前一年半开始准备，重点关注数学和专业课的复习。",
    timestamp: Date.now() - 6e4 * 3
  }
];
const mockStudentData = {
  id: "student456",
  nickname: "小明同学",
  avatarUrl: "/static/image/tab-bar/default_avatar.png",
  tag: "学生",
  role: "student",
  school: "清华大学",
  major: "机械工程",
  grade: "大二",
  courses: [
    { id: 101, title: "高等数学", progress: 60 },
    { id: 102, title: "C++编程基础", progress: 85 }
  ]
};
const mockTeacherData = {
  id: "teacher123",
  nickname: "王教授",
  avatarUrl: "/static/image/tab-bar/default_avatar.png",
  tag: "已认证",
  role: "teacher",
  school: "北京大学",
  major: "计算机科学",
  score: 4.9,
  wallet: {
    balance: 2580.5,
    income: 5e3
  },
  qualifications: {
    isVerified: true,
    certificates: ["教师资格证", "心理咨询师证"]
  },
  services: [
    { id: 1, title: "高数一对一", price: 300 },
    { id: 2, title: "编程辅导", price: 250 }
  ]
};
const mockApiResponse = (data, success = true, message = "") => {
  return {
    success,
    data,
    message
  };
};
const mockData = {
  mockDelay,
  mockTeachers,
  mockServices,
  mockChatHistory,
  mockStudentData,
  mockTeacherData,
  mockApiResponse
};
exports.mockData = mockData;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/mock-data.js.map
