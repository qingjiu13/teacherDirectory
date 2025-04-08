"use strict";
const store_services_auth_api = require("./auth.api.js");
const store_services_aiChat_api = require("./ai-chat.api.js");
const store_services_teacher_api = require("./teacher.api.js");
const store_services_student_api = require("./student.api.js");
const store_services_course_api = require("./course.api.js");
const store_services_order_api = require("./order.api.js");
const store_services_common_api = require("./common.api.js");
const services = {
  auth: store_services_auth_api.auth,
  // 认证相关API
  aiChat: store_services_aiChat_api.aiChat,
  // AI聊天相关API
  teacher: store_services_teacher_api.teacher,
  // 教师特有API
  student: store_services_student_api.student,
  // 学生特有API
  course: store_services_course_api.course,
  // 课程相关API
  order: store_services_order_api.order,
  // 订单相关API
  common: store_services_common_api.common
  // 通用API
};
exports.services = services;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/index.js.map
