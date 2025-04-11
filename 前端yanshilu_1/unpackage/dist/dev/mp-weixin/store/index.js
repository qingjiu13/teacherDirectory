"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_common_auth = require("./modules/common/auth.js");
const store_modules_common_app = require("./modules/common/app.js");
const store_modules_common_message = require("./modules/common/message.js");
const store_modules_common_settings = require("./modules/common/settings.js");
const store_modules_common_aiChat = require("./modules/common/ai-chat.js");
const store_modules_common_match = require("./modules/common/match.js");
const store_modules_common_user = require("./modules/common/user.js");
const store_modules_teacher_index = require("./modules/teacher/index.js");
const store_modules_student_index = require("./modules/student/index.js");
const store_modules_common_courses = require("./modules/common/courses.js");
const store_modules_common_orders = require("./modules/common/orders.js");
const store = common_vendor.createStore({
  modules: {
    // 共享模块
    auth: store_modules_common_auth.auth,
    // 认证相关
    app: store_modules_common_app.app,
    // 应用全局状态
    message: store_modules_common_message.message,
    // 消息通知
    settings: store_modules_common_settings.settings,
    // 用户设置
    // 用户信息模块
    user: store_modules_common_user.user,
    // 用户基本信息
    // 角色模块
    teacher: store_modules_teacher_index.teacher,
    // 教师特有功能
    student: store_modules_student_index.student,
    // 学生特有功能
    // 功能模块
    aiChat: store_modules_common_aiChat.aiChat,
    // AI聊天功能
    courses: store_modules_common_courses.courses,
    // 课程相关
    orders: store_modules_common_orders.orders,
    // 订单相关
    match: store_modules_common_match.match
    // 匹配功能
  }
});
const initializeApp = async () => {
  try {
    const userInfo = await store.dispatch("auth/checkAuthStatus");
    return {
      success: true,
      userInfo
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/index.js:75", "应用初始化失败:", error);
    return { success: false, error };
  }
};
const loadTeacherData = async () => {
  try {
    await store.dispatch("teacher/loadInitialData");
    return { success: true };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/index.js:90", "加载教师数据失败:", error);
    return { success: false, error };
  }
};
const loadStudentData = async () => {
  try {
    await store.dispatch("student/loadInitialData");
    return { success: true };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/index.js:105", "加载学生数据失败:", error);
    return { success: false, error };
  }
};
const loadMatchRecommendations = async () => {
  try {
    const teachers = await store.dispatch("match/getRecommendedTeachers");
    return {
      success: true,
      data: teachers
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at store/index.js:125", "加载匹配推荐失败:", error);
    return { success: false, error };
  }
};
exports.initializeApp = initializeApp;
exports.loadMatchRecommendations = loadMatchRecommendations;
exports.loadStudentData = loadStudentData;
exports.loadTeacherData = loadTeacherData;
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
