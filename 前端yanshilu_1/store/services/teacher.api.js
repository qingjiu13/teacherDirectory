/**
 * @description 老师匹配相关API服务
 */

/**
 * @description 获取老师列表
 * @param {Object} params - 查询参数
 * @param {string} [params.subject] - 科目
 * @param {string} [params.level] - 级别
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @returns {Promise<Object>} 老师列表
 */
export const getTeachers = (params = {}) => {
  const { subject, level, page = 1, pageSize = 10 } = params;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟从服务器获取数据
      const totalCount = 100;
      const teachers = Array.from({ length: Math.min(pageSize, totalCount - (page - 1) * pageSize) }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1;
        return {
          id: `t${id}`,
          name: `老师${id}`,
          avatar: `https://example.com/avatars/teacher${id}.png`,
          subject: subject || ['数学', '英语', '物理', '化学', '生物'][id % 5],
          level: level || ['小学', '初中', '高中', '大学'][id % 4],
          rating: 4 + (id % 10) / 10,
          price: 100 + (id % 20) * 5,
          intro: `我是一名有着多年教学经验的${['数学', '英语', '物理', '化学', '生物'][id % 5]}老师，擅长${['小学', '初中', '高中', '大学'][id % 4]}课程辅导。`,
          tags: ['耐心', '专业', '经验丰富'].slice(0, 1 + id % 3),
          availableTime: [
            { day: '周一', slots: ['9:00-11:00', '14:00-16:00'] },
            { day: '周三', slots: ['9:00-11:00', '14:00-16:00'] },
            { day: '周五', slots: ['9:00-11:00', '14:00-16:00'] }
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

/**
 * @description 获取老师详情
 * @param {string} teacherId - 老师ID
 * @returns {Promise<Object>} 老师详情
 */
export const getTeacherDetail = (teacherId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = parseInt(teacherId.replace('t', ''));
      
      // 返回符合teacher.js期望的数据结构
      resolve({
        success: true,
        data: {
          teacher: {
            id: teacherId,
            nickname: `老师${id}`, // 从name改为nickname
            avatar: `https://example.com/avatars/teacher${id}.png`,
            school: '北京大学', // 新增字段
            major: ['数学', '英语', '物理', '化学', '生物'][id % 5], // 新增字段
            score: (4 + (id % 10) / 10).toFixed(1), // 评分
            tags: ['耐心', '专业', '经验丰富'].slice(0, 1 + id % 3),
            introduction: `我是一名有着多年教学经验的${['数学', '英语', '物理', '化学', '生物'][id % 5]}老师，擅长${['小学', '初中', '高中', '大学'][id % 4]}课程辅导。` // 从intro改为introduction
          },
          services: [
            { 
              id: `s${id}1`, 
              title: '数学提高班', 
              price: 200, 
              duration: '10课时',
              description: '适合需要提高数学成绩的学生'
            },
            { 
              id: `s${id}2`, 
              title: '一对一辅导', 
              price: 300, 
              duration: '按需',
              description: '根据学生需求定制的个性化辅导课程'
            }
          ]
        }
      });
    }, 600);
  });
};

/**
 * @description 预约老师
 * @param {Object} bookingInfo - 预约信息
 * @param {string} bookingInfo.teacherId - 老师ID
 * @param {string} bookingInfo.day - 预约日期
 * @param {string} bookingInfo.timeSlot - 预约时间段
 * @param {string} bookingInfo.subject - 科目
 * @param {string} bookingInfo.message - 留言
 * @returns {Promise<Object>} 预约结果
 */
export const bookTeacher = (bookingInfo) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          bookingId: `booking_${Date.now()}`,
          teacherId: bookingInfo.teacherId,
          studentId: 's1', // 假设当前学生ID
          status: 'pending',
          day: bookingInfo.day,
          timeSlot: bookingInfo.timeSlot,
          subject: bookingInfo.subject,
          message: bookingInfo.message,
          createdAt: new Date().toISOString()
        },
        message: '预约请求已发送，等待老师确认'
      });
    }, 800);
  });
};

/**
 * @description 获取预约列表
 * @param {Object} params - 查询参数
 * @param {string} [params.role='student'] - 角色(student/teacher)
 * @param {string} [params.status] - 状态(pending/confirmed/cancelled/completed)
 * @returns {Promise<Object>} 预约列表
 */
export const getBookings = (params = {}) => {
  const { role = 'student', status } = params;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = Array.from({ length: 5 }, (_, index) => {
        const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        const currentStatus = status || statuses[index % statuses.length];
        
        return {
          id: `booking_${Date.now() - index * 86400000}`,
          teacherId: `t${index + 1}`,
          teacherName: `老师${index + 1}`,
          teacherAvatar: `https://example.com/avatars/teacher${index + 1}.png`,
          studentId: 's1',
          studentName: '当前学生',
          studentAvatar: 'https://example.com/avatars/student1.png',
          status: currentStatus,
          day: ['周一', '周三', '周五'][index % 3],
          timeSlot: ['9:00-11:00', '14:00-16:00'][index % 2],
          subject: ['数学', '英语', '物理'][index % 3],
          message: `我想学习${['数学', '英语', '物理'][index % 3]}中的难点问题`,
          createdAt: new Date(Date.now() - index * 86400000).toISOString()
        };
      });
      
      resolve({
        success: true,
        data: bookings
      });
    }, 500);
  });
}; 