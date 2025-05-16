/**
 * courses模块的状态
 * @module store/user/courses/state
 */

export default {
    // 待预约课程
    pendingCourses: [],
    
    // 已预约课程
    reservedCourses: [],
    
    // 已完成课程
    completedCourses: [],
    
    // 老师待接受课程
    teacherPendingCourses: [],
    
    // 老师进行中课程
    teacherActiveCourses: [],
    
    // 老师已完成课程
    teacherCompletedCourses: [],
    
    // 课程详情缓存 (id -> 详情)
    courseDetails: {},
    
    // 可选时间段
    timeSlots: [
        { period: '上午', slots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'] },
        { period: '下午', slots: ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] },
        { period: '晚上', slots: ['18:00-19:00', '19:00-20:00', '20:00-21:00'] }
    ],
    
    // 当前选择的日期和时间
    selectedDate: null,
    selectedTimeSlot: '',
    selectedTimePeriod: ''
}; 