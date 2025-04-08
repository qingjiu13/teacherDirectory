"use strict";
const getTeachers = (params = {}) => {
  const { subject, level, page = 1, pageSize = 10 } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalCount = 100;
      const teachers = Array.from({ length: Math.min(pageSize, totalCount - (page - 1) * pageSize) }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1;
        return {
          id: `t${id}`,
          name: `老师${id}`,
          avatar: `https://example.com/avatars/teacher${id}.png`,
          subject: subject || ["数学", "英语", "物理", "化学", "生物"][id % 5],
          level: level || ["小学", "初中", "高中", "大学"][id % 4],
          rating: 4 + id % 10 / 10,
          price: 100 + id % 20 * 5,
          intro: `我是一名有着多年教学经验的${["数学", "英语", "物理", "化学", "生物"][id % 5]}老师，擅长${["小学", "初中", "高中", "大学"][id % 4]}课程辅导。`,
          tags: ["耐心", "专业", "经验丰富"].slice(0, 1 + id % 3),
          availableTime: [
            { day: "周一", slots: ["9:00-11:00", "14:00-16:00"] },
            { day: "周三", slots: ["9:00-11:00", "14:00-16:00"] },
            { day: "周五", slots: ["9:00-11:00", "14:00-16:00"] }
          ]
        };
      });
      resolve({
        success: true,
        data: {
          list: teachers,
          pagination: {
            page,
            pageSize,
            total: totalCount,
            totalPages: Math.ceil(totalCount / pageSize)
          }
        }
      });
    }, 500);
  });
};
const getTeacherDetail = (teacherId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = parseInt(teacherId.replace("t", ""));
      resolve({
        success: true,
        data: {
          id: teacherId,
          name: `老师${id}`,
          avatar: `https://example.com/avatars/teacher${id}.png`,
          subject: ["数学", "英语", "物理", "化学", "生物"][id % 5],
          level: ["小学", "初中", "高中", "大学"][id % 4],
          rating: 4 + id % 10 / 10,
          price: 100 + id % 20 * 5,
          intro: `我是一名有着多年教学经验的${["数学", "英语", "物理", "化学", "生物"][id % 5]}老师，擅长${["小学", "初中", "高中", "大学"][id % 4]}课程辅导。`,
          education: "北京大学硕士",
          experience: `${5 + id % 10}年教学经验`,
          tags: ["耐心", "专业", "经验丰富"].slice(0, 1 + id % 3),
          availableTime: [
            { day: "周一", slots: ["9:00-11:00", "14:00-16:00"] },
            { day: "周三", slots: ["9:00-11:00", "14:00-16:00"] },
            { day: "周五", slots: ["9:00-11:00", "14:00-16:00"] }
          ],
          courses: [
            { id: "c1", title: "数学提高班", price: 200, duration: "10课时" },
            { id: "c2", title: "一对一辅导", price: 300, duration: "按需" }
          ],
          comments: [
            { id: "cm1", user: "学生A", content: "老师讲解非常清晰", rating: 5, date: "2023-09-01" },
            { id: "cm2", user: "学生B", content: "课程安排合理，进步很大", rating: 4, date: "2023-08-15" }
          ]
        }
      });
    }, 600);
  });
};
const bookTeacher = (bookingInfo) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          bookingId: `booking_${Date.now()}`,
          teacherId: bookingInfo.teacherId,
          studentId: "s1",
          // 假设当前学生ID
          status: "pending",
          day: bookingInfo.day,
          timeSlot: bookingInfo.timeSlot,
          subject: bookingInfo.subject,
          message: bookingInfo.message,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        message: "预约请求已发送，等待老师确认"
      });
    }, 800);
  });
};
const getBookings = (params = {}) => {
  const { role = "student", status } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = Array.from({ length: 5 }, (_, index) => {
        const statuses = ["pending", "confirmed", "cancelled", "completed"];
        const currentStatus = status || statuses[index % statuses.length];
        return {
          id: `booking_${Date.now() - index * 864e5}`,
          teacherId: `t${index + 1}`,
          teacherName: `老师${index + 1}`,
          teacherAvatar: `https://example.com/avatars/teacher${index + 1}.png`,
          studentId: "s1",
          studentName: "当前学生",
          studentAvatar: "https://example.com/avatars/student1.png",
          status: currentStatus,
          day: ["周一", "周三", "周五"][index % 3],
          timeSlot: ["9:00-11:00", "14:00-16:00"][index % 2],
          subject: ["数学", "英语", "物理"][index % 3],
          message: `我想学习${["数学", "英语", "物理"][index % 3]}中的难点问题`,
          createdAt: new Date(Date.now() - index * 864e5).toISOString()
        };
      });
      resolve({
        success: true,
        data: bookings
      });
    }, 500);
  });
};
exports.bookTeacher = bookTeacher;
exports.getBookings = getBookings;
exports.getTeacherDetail = getTeacherDetail;
exports.getTeachers = getTeachers;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/services/teacher.api.js.map
