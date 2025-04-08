"use strict";
const state = {
  // 老师列表
  teachers: [],
  // 当前选中的老师
  currentTeacher: null,
  // 筛选条件
  filters: {
    subject: "",
    level: "",
    page: 1,
    pageSize: 10
  },
  // 分页信息
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    pageSize: 10
  },
  // 预约列表
  bookings: [],
  // 加载状态
  loading: {
    teachers: false,
    teacher: false,
    bookings: false,
    booking: false
  },
  // 错误状态
  error: null
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/modules/teacher/state.js.map
