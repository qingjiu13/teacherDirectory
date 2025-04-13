"use strict";
const common_vendor = require("../../common/vendor.js");
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
const mockChatSummaries = [
  {
    id: "chat_1001",
    title: "北京大学计算机专业考研难度",
    createdAt: new Date(Date.now() - 864e5 * 2),
    // 2天前
    updatedAt: new Date(Date.now() - 864e5 * 2)
  },
  {
    id: "chat_1002",
    title: "如何备考软件工程专业",
    createdAt: new Date(Date.now() - 864e5 * 5),
    // 5天前
    updatedAt: new Date(Date.now() - 864e5 * 4)
  },
  {
    id: "chat_1003",
    title: "考研英语复习方法",
    createdAt: new Date(Date.now() - 864e5 * 10),
    // 10天前
    updatedAt: new Date(Date.now() - 864e5 * 10)
  },
  {
    id: "chat_1004",
    title: "复旦大学和浙江大学哪个更...",
    createdAt: new Date(Date.now() - 864e5 * 15),
    // 15天前
    updatedAt: new Date(Date.now() - 864e5 * 15)
  },
  {
    id: "chat_1005",
    title: "考研复习时间规划",
    createdAt: new Date(Date.now() - 864e5 * 20),
    // 20天前
    updatedAt: new Date(Date.now() - 864e5 * 18)
  }
];
const mockChatDetails = {
  // 对话1: 北京大学计算机专业考研难度
  "chat_1001": {
    id: "chat_1001",
    title: "北京大学计算机专业考研难度",
    messages: [
      {
        id: "1001_msg_1",
        type: "system",
        content: "欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 2 - 36e5).toISOString()
      },
      {
        id: "1001_msg_2",
        type: "user",
        content: "我想了解北京大学计算机专业的考研难度",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 2 - 3e6).toISOString()
      },
      {
        id: "1001_msg_3",
        type: "ai",
        content: "北京大学计算机专业是全国顶尖的计算机专业之一，考研难度较大。根据历年数据，其考研分数线通常在370-390分之间，录取比例约为8:1左右。\n\n专业课方面，需要重点掌握数据结构、算法分析、操作系统、计算机网络和计算机组成原理等核心课程。\n\n建议您提前一年半开始准备，重点关注数学和专业课的复习。此外，北大计算机系偏向于基础理论与研究，对数学和算法的要求较高。",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 2 - 29e5).toISOString()
      },
      {
        id: "1001_msg_4",
        type: "user",
        content: "有没有什么参考书推荐？",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 2 - 28e5).toISOString()
      },
      {
        id: "1001_msg_5",
        type: "ai",
        content: "针对北京大学计算机专业考研，以下是一些重要的参考书籍推荐：\n\n1. 数学类：\n- 《高等数学》同济大学编\n- 《线性代数》同济大学编\n- 《概率论与数理统计》浙江大学编\n- 《数学分析》华东师范大学编\n\n2. 专业课：\n- 《数据结构》严蔚敏版\n- 《计算机组成原理》唐朔飞版\n- 《计算机网络：自顶向下方法》James F. Kurose\n- 《操作系统概念》Abraham Silberschatz\n- 《算法导论》Thomas H. Cormen等\n\n建议你也可以查阅北京大学计算机学院官网，了解最新的考研大纲和参考书目。",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 2 - 27e5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 864e5 * 2),
    updatedAt: new Date(Date.now() - 864e5 * 2)
  },
  // 对话2: 如何备考软件工程专业
  "chat_1002": {
    id: "chat_1002",
    title: "如何备考软件工程专业",
    messages: [
      {
        id: "1002_msg_1",
        type: "system",
        content: "欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 5 - 36e5).toISOString()
      },
      {
        id: "1002_msg_2",
        type: "user",
        content: "如何备考软件工程专业？",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 5 - 3e6).toISOString()
      },
      {
        id: "1002_msg_3",
        type: "ai",
        content: "备考软件工程专业考研需要合理规划和系统学习，以下是一些建议：\n\n1. 了解考试内容：\n软件工程专业通常考察数据结构、操作系统、软件工程、计算机网络等课程，以及数学（高数、线代、概率论）和英语。\n\n2. 制定学习计划：\n- 早期（1年前）：打好基础，了解考试范围\n- 中期（6-9个月前）：系统学习各科内容\n- 后期（3个月前）：做真题和模拟题，查漏补缺\n\n3. 重点复习内容：\n- 软件工程：软件过程、需求分析、系统设计、测试方法等\n- 数据结构：各种数据结构及其算法实现\n- 操作系统：进程管理、内存管理、文件系统等\n\n4. 选择合适的参考书：\n- 《软件工程》（第4版）Roger S. Pressman\n- 《软件工程：实践者的研究方法》Ian Sommerville\n- 《数据结构》严蔚敏版\n\n5. 做往年真题，了解出题规律和难度\n\n祝你考研成功！",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 5 - 29e5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 864e5 * 5),
    updatedAt: new Date(Date.now() - 864e5 * 4)
  },
  // 对话3: 考研英语复习方法
  "chat_1003": {
    id: "chat_1003",
    title: "考研英语复习方法",
    messages: [
      {
        id: "1003_msg_1",
        type: "system",
        content: "欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 10 - 36e5).toISOString()
      },
      {
        id: "1003_msg_2",
        type: "user",
        content: "考研英语复习方法",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 10 - 3e6).toISOString()
      },
      {
        id: "1003_msg_3",
        type: "ai",
        content: "考研英语复习方法建议如下：\n\n1. 词汇积累：\n- 背诵考研大纲要求的词汇（5500词左右）\n- 使用词根词缀记忆法提高效率\n- 每天坚持记忆30-50个单词\n\n2. 阅读理解：\n- 精读历年真题，分析出题思路\n- 练习速读能力，掌握文章脉络\n- 学习各类题型的解题技巧\n\n3. 完形填空：\n- 注重上下文理解\n- 积累常用搭配和固定表达\n\n4. 新题型：\n- 练习段落匹配和信息匹配能力\n- 提高逻辑分析能力\n\n5. 翻译：\n- 积累常用句式和表达\n- 练习长难句分析和翻译\n\n6. 写作：\n- 背诵优秀范文\n- 积累常用表达和句型\n- 练习框架式写作\n\n7. 复习资料推荐：\n- 《考研英语词汇词根+联想记忆法》\n- 《考研英语历年真题解析》\n- 《考研英语高分写作》\n\n坚持每日复习，循序渐进，分阶段重点突破，祝你考研成功！",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 10 - 29e5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 864e5 * 10),
    updatedAt: new Date(Date.now() - 864e5 * 10)
  },
  // 对话4: 复旦大学和浙江大学比较
  "chat_1004": {
    id: "chat_1004",
    title: "复旦大学和浙江大学哪个更适合考研",
    messages: [
      {
        id: "1004_msg_1",
        type: "system",
        content: "欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 15 - 36e5).toISOString()
      },
      {
        id: "1004_msg_2",
        type: "user",
        content: "复旦大学和浙江大学哪个更适合考研？",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 15 - 3e6).toISOString()
      },
      {
        id: "1004_msg_3",
        type: "ai",
        content: "复旦大学和浙江大学都是中国顶尖的高校，各有特色和优势。选择哪所更适合考研，需要考虑多方面因素：\n\n1. 学科优势：\n- 复旦大学：人文社科、医学、经济、新闻传播等领域优势明显\n- 浙江大学：工科、计算机、理学等理工科领域实力雄厚\n\n2. 地理位置：\n- 复旦大学：位于上海，国际化程度高，就业机会多\n- 浙江大学：位于杭州，互联网产业发达，生活成本相对较低\n\n3. 录取难度：\n- 整体而言，复旦大学的考研分数线略高于浙江大学，但具体专业差异很大\n- 复旦的文科类专业竞争更为激烈，浙大的理工科专业报考人数更多\n\n4. 培养特色：\n- 复旦注重人文素养和国际视野\n- 浙大注重综合创新能力和学科交叉\n\n建议根据你的专业方向、兴趣爱好、职业规划来选择。可以具体查询两校各专业的培养方案、就业情况和导师资源，再做决定。你的专业是什么呢？可以给你更有针对性的建议。",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 15 - 29e5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 864e5 * 15),
    updatedAt: new Date(Date.now() - 864e5 * 15)
  },
  // 对话5: 考研复习时间规划
  "chat_1005": {
    id: "chat_1005",
    title: "考研复习时间规划",
    messages: [
      {
        id: "1005_msg_1",
        type: "system",
        content: "欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 20 - 36e5).toISOString()
      },
      {
        id: "1005_msg_2",
        type: "user",
        content: "考研复习时间如何规划比较合理？",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 20 - 3e6).toISOString()
      },
      {
        id: "1005_msg_3",
        type: "ai",
        content: "考研复习时间规划建议（以一年为例）：\n\n【3-6月（早期准备阶段）】\n1. 确定目标院校和专业，了解考试科目和大纲\n2. 收集复习资料和参考书目\n3. 开始基础课程学习，打好基础\n4. 每天背诵英语单词，累积词汇量\n5. 制定详细的学习计划表\n\n【7-9月（强化阶段）】\n1. 进入系统复习阶段，各科全面铺开\n2. 政治开始初步接触，了解基本概念\n3. 英语加强阅读理解训练\n4. 数学完成基础知识学习，开始刷题\n5. 专业课深入学习核心内容\n\n【10-11月（冲刺阶段）】\n1. 开始做真题和模拟题，检验学习效果\n2. 政治开始背诵重点内容\n3. 英语强化写作和翻译能力\n4. 数学归纳解题方法，总结错题\n5. 专业课查漏补缺，整理知识点\n\n【12月（临考阶段）】\n1. 政治重点关注时政热点和预测题\n2. 英语做最后的模拟训练\n3. 数学和专业课做最后的查漏补缺\n4. 保持良好心态，规律作息\n5. 准备考试用品，熟悉考场环境\n\n每日时间分配建议：\n- 早上：记忆类科目（政治、英语单词）\n- 上午：需要高度集中注意力的科目（数学、专业课）\n- 下午：理解性内容（专业课、英语阅读）\n- 晚上：复习当天内容，准备第二天学习\n\n祝你考研成功！",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 20 - 29e5).toISOString()
      },
      {
        id: "1005_msg_4",
        type: "user",
        content: "如果我是跨专业考研，该怎么规划？",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 18 - 3e6).toISOString()
      },
      {
        id: "1005_msg_5",
        type: "ai",
        content: "跨专业考研需要更系统、更早的规划，以下是针对跨专业考研的时间规划建议：\n\n【提前1.5年（基础建立阶段）】\n1. 确定目标专业和院校，深入了解专业课考试内容\n2. 购买目标专业的本科教材和参考书\n3. 系统学习专业基础知识，补足学科短板\n4. 可以考虑旁听相关专业课程或在线学习\n5. 寻找相同跨专业经历的学长学姐取经\n\n【提前1年（全面复习阶段）】\n1. 专业课：建立知识体系，掌握核心概念和原理\n2. 英语：每天背单词，培养阅读习惯\n3. 数学：从基础开始，打好地基\n4. 开始接触政治基本概念\n\n【提前8-10个月（强化阶段）】\n1. 专业课：深化理解，开始做习题\n2. 重视实践性知识和应用能力培养\n3. 其他公共课按常规考研规划推进\n\n【提前3-6个月（冲刺阶段）】\n1. 专业课：大量做真题和模拟题，查漏补缺\n2. 整理专业课笔记和重点知识点\n3. 其他科目同常规考研规划\n\n跨专业考研的特别建议：\n1. 提前半年到一年开始准备，给自己更多学习专业知识的时间\n2. 对专业课投入更多精力，至少占总复习时间的50%\n3. 利用互联网资源，如MOOC、B站教学视频等辅助学习\n4. 多与目标专业的学生交流，了解学科思维方式\n5. 可以考虑报考目标院校和专业的预科班或辅导班\n6. 突出自己跨专业的优势，如知识面广、思维多元等\n\n跨专业考研虽然困难，但也有独特优势。保持信心，系统学习，一定能够成功！",
        status: "sent",
        timestamp: new Date(Date.now() - 864e5 * 18 - 29e5).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 864e5 * 20),
    updatedAt: new Date(Date.now() - 864e5 * 18)
  }
};
const mockStudentData = {
  id: "student456",
  nickname: "小明同学",
  avatarUrl: "/static/image/tab-bar/default_avatar.png",
  tag: "学生",
  role: "student",
  school: "清华大学",
  major: "机械工程",
  grade: "大二",
  gender: "male",
  phone: "13900139000",
  wechat: "student456",
  hasPassword: false,
  introduction: "大二学生，正在备战考研，希望能考上理想的大学。",
  tags: ["考研", "计算机", "自律"],
  courses: [
    { id: 101, title: "高等数学", progress: 60 },
    { id: 102, title: "C++编程基础", progress: 85 }
  ],
  // 学生特有数据
  targetSchools: ["北京大学", "清华大学", "上海交通大学"],
  targetMajors: ["计算机科学", "软件工程"],
  studyPlan: {
    startDate: "2023-09-01",
    examDate: "2024-12-20",
    dailyHours: 8,
    focusAreas: ["数学", "英语", "专业课"]
  },
  testScores: [
    { subject: "模拟政治", score: 65, date: "2023-10-15" },
    { subject: "模拟英语", score: 72, date: "2023-10-15" },
    { subject: "模拟数学", score: 68, date: "2023-10-15" },
    { subject: "模拟专业课", score: 75, date: "2023-10-15" }
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
  gender: "male",
  phone: "13800138000",
  wechat: "teacher123",
  hasPassword: true,
  introduction: "资深教育工作者，专注于考研辅导多年。熟悉各高校计算机专业考研要求，擅长数据结构与算法教学。",
  tags: ["认证学校", "经验丰富", "答疑及时", "通俗易懂"],
  // 教师特有数据
  title: "教授",
  education: "博士",
  teachingYears: 15,
  specialities: ["数据结构", "算法", "计算机网络"],
  wallet: {
    balance: 2580.5,
    income: 5e3,
    transactions: [
      { id: "t001", amount: 300, type: "income", date: "2023-11-01", desc: "一对一辅导" },
      { id: "t002", amount: 250, type: "income", date: "2023-10-28", desc: "答疑服务" }
    ]
  },
  qualifications: {
    isVerified: true,
    certificates: ["教师资格证", "心理咨询师证"],
    verifiedDate: "2022-05-15"
  },
  services: [
    { id: 1, title: "高数一对一", price: 300, sessions: 8, bookings: 12 },
    { id: 2, title: "编程辅导", price: 250, sessions: 6, bookings: 8 }
  ],
  schedule: [
    { day: "周一", timeSlots: ["9:00-11:00", "14:00-16:00"] },
    { day: "周三", timeSlots: ["9:00-11:00", "14:00-16:00"] },
    { day: "周五", timeSlots: ["9:00-11:00", "14:00-16:00"] }
  ],
  studentReviews: [
    { id: "r001", studentName: "张同学", content: "王教授讲课非常清晰，很有耐心", rating: 5, date: "2023-10-15" },
    { id: "r002", studentName: "李同学", content: "通过王教授的辅导，我的成绩有了明显提升", rating: 5, date: "2023-09-30" }
  ]
};
const mockApiResponse = (data, success = true, message = "") => {
  return {
    success,
    data,
    message
  };
};
const getMockTeacherDetailWithServices = (teacherId) => {
  const teacher = mockTeachers.find((t) => t.id === parseInt(teacherId)) || mockTeachers[0];
  const teacherDetail = {
    id: teacher.id,
    nickname: teacher.nickname,
    avatar: teacher.avatar || "/static/image/tab-bar/default_avatar.png",
    school: teacher.school,
    major: teacher.major,
    score: teacher.score,
    tags: teacher.tags || [],
    introduction: teacher.introduction || "暂无介绍"
  };
  return {
    success: true,
    data: {
      teacher: teacherDetail,
      services: mockServices || []
    }
  };
};
const getMockUserProfile = (role) => {
  common_vendor.index.__f__("log", "at store/services/mock-data.js:455", "【模拟数据】获取用户资料:", role);
  let userData;
  if (role === "teacher") {
    userData = {
      avatar: mockTeacherData.avatarUrl,
      nickname: mockTeacherData.nickname,
      tags: mockTeacherData.tags || [],
      introduction: mockTeacherData.introduction,
      gender: mockTeacherData.gender,
      phone: mockTeacherData.phone,
      wechat: mockTeacherData.wechat,
      hasPassword: mockTeacherData.hasPassword,
      school: mockTeacherData.school,
      major: mockTeacherData.major,
      title: mockTeacherData.title,
      tag: mockTeacherData.tag
      // 确保有tag字段
    };
  } else {
    userData = {
      avatar: mockStudentData.avatarUrl,
      nickname: mockStudentData.nickname,
      tags: mockStudentData.tags || [],
      introduction: mockStudentData.introduction,
      gender: mockStudentData.gender,
      phone: mockStudentData.phone,
      wechat: mockStudentData.wechat,
      hasPassword: mockStudentData.hasPassword,
      school: mockStudentData.school,
      major: mockStudentData.major,
      grade: mockStudentData.grade,
      tag: mockStudentData.tag
      // 确保有tag字段
    };
  }
  common_vendor.index.__f__("log", "at store/services/mock-data.js:490", "【模拟数据】返回用户资料:", userData);
  return userData;
};
const mockData = {
  mockDelay,
  mockTeachers,
  mockServices,
  mockChatSummaries,
  mockChatDetails,
  mockStudentData,
  mockTeacherData,
  mockApiResponse,
  getMockTeacherDetailWithServices,
  getMockUserProfile
};
exports.getMockTeacherDetailWithServices = getMockTeacherDetailWithServices;
exports.getMockUserProfile = getMockUserProfile;
exports.mockApiResponse = mockApiResponse;
exports.mockChatDetails = mockChatDetails;
exports.mockChatSummaries = mockChatSummaries;
exports.mockData = mockData;
exports.mockDelay = mockDelay;
exports.mockTeachers = mockTeachers;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/mock-data.js.map
