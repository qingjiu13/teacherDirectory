/**
 * courses模块的getters
 * @module store/user/courses/getters
 */

export default {
    /**
     * 获取待预约课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 待预约课程数组
     */
    getPendingCourses: state => state.pendingCourses,
    
    /**
     * 获取已预约课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 已预约课程数组
     */
    getReservedCourses: state => state.reservedCourses,
    
    /**
     * 获取已完成课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 已完成课程数组
     */
    getCompletedCourses: state => state.completedCourses,
    
    /**
     * 获取老师待接受课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 老师待接受课程数组
     */
    getTeacherPendingCourses: state => state.teacherPendingCourses,
    
    /**
     * 获取老师进行中课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 老师进行中课程数组
     */
    getTeacherActiveCourses: state => state.teacherActiveCourses,
    
    /**
     * 获取老师已完成课程
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 老师已完成课程数组
     */
    getTeacherCompletedCourses: state => state.teacherCompletedCourses,
    
    /**
     * 通过ID获取课程详情
     * @param {Object} state - Vuex状态对象
     * @returns {Function} 返回一个接受课程ID并返回课程详情的函数
     */
    getCourseById: state => id => {
        // 先尝试从详情缓存中获取
        if (state.courseDetails[id]) {
            return state.courseDetails[id];
        }
        
        // 然后依次在各个列表中查找
        const allCourses = [
            ...state.pendingCourses,
            ...state.reservedCourses,
            ...state.completedCourses,
            ...state.teacherPendingCourses,
            ...state.teacherActiveCourses,
            ...state.teacherCompletedCourses
        ];
        
        return allCourses.find(course => course.id === id);
    },
    
    /**
     * 获取课程总数（学生视角）
     * @param {Object} state - Vuex状态对象
     * @returns {Number} 课程总数
     */
    getStudentCourseCount: state => 
        state.pendingCourses.length + 
        state.reservedCourses.length + 
        state.completedCourses.length,
    
    /**
     * 获取课程总数（老师视角）
     * @param {Object} state - Vuex状态对象
     * @returns {Number} 课程总数
     */
    getTeacherCourseCount: state => 
        state.teacherPendingCourses.length + 
        state.teacherActiveCourses.length + 
        state.teacherCompletedCourses.length,
    
    /**
     * 获取选择的日期
     * @param {Object} state - Vuex状态对象
     * @returns {String|null} 选择的日期
     */
    getSelectedDate: state => state.selectedDate,
    
    /**
     * 获取选择的时间段
     * @param {Object} state - Vuex状态对象
     * @returns {String} 选择的时间段
     */
    getSelectedTimePeriod: state => state.selectedTimePeriod,
    
    /**
     * 获取选择的时间
     * @param {Object} state - Vuex状态对象
     * @returns {String} 选择的时间
     */
    getSelectedTimeSlot: state => state.selectedTimeSlot,
    
    /**
     * 获取可选时间段
     * @param {Object} state - Vuex状态对象
     * @returns {Array} 时间段数组
     */
    getTimeSlots: state => state.timeSlots,
    
    /**
     * 获取按时间段分组的时间选项
     * @param {Object} state - Vuex状态对象
     * @returns {Object} 按时间段分组的时间选项
     */
    getTimeSlotsByPeriod: state => {
        const result = {};
        state.timeSlots.forEach(item => {
            result[item.period] = item.slots;
        });
        return result;
    }
}; 