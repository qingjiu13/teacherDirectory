/**
 * courses模块的mutations
 * @module store/user/courses/mutations
 */

export default {
    /**
     * 设置待预约课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_PENDING_COURSES(state, courses) {
        state.pendingCourses = courses;
    },
    
    /**
     * 设置已预约课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_RESERVED_COURSES(state, courses) {
        state.reservedCourses = courses;
    },
    
    /**
     * 设置已完成课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_COMPLETED_COURSES(state, courses) {
        state.completedCourses = courses;
    },
    
    /**
     * 设置老师待接受课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_TEACHER_PENDING_COURSES(state, courses) {
        state.teacherPendingCourses = courses;
    },
    
    /**
     * 设置老师进行中课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_TEACHER_ACTIVE_COURSES(state, courses) {
        state.teacherActiveCourses = courses;
    },
    
    /**
     * 设置老师已完成课程列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} courses - 课程数组
     */
    SET_TEACHER_COMPLETED_COURSES(state, courses) {
        state.teacherCompletedCourses = courses;
    },
    
    /**
     * 添加课程预约
     * @param {Object} state - Vuex状态对象
     * @param {Object} reservation - 预约信息
     */
    ADD_COURSE_RESERVATION(state, reservation) {
        // 找到对应的课程
        const courseIndex = state.pendingCourses.findIndex(course => course.id === reservation.courseId);
        
        if (courseIndex !== -1) {
            // 获取课程并添加预约信息
            const course = state.pendingCourses[courseIndex];
            
            // 添加到已预约列表
            state.reservedCourses.push({
                ...course,
                reservedTime: `${reservation.date} ${reservation.timeSlot}`
            });
            
            // 从待预约列表中删除
            state.pendingCourses.splice(courseIndex, 1);
        }
    },
    
    /**
     * 添加老师课程预约
     * @param {Object} state - Vuex状态对象
     * @param {Object} reservation - 预约信息
     */
    ADD_TEACHER_COURSE_RESERVATION(state, reservation) {
        const courseIndex = state.teacherPendingCourses.findIndex(course => course.id === reservation.courseId);
        
        if (courseIndex !== -1) {
            // 获取课程并添加预约信息
            const course = state.teacherPendingCourses[courseIndex];
            
            // 添加到进行中课程列表
            state.teacherActiveCourses.push({
                ...course,
                classTime: `${reservation.date} ${reservation.timeSlot}`
            });
            
            // 从待接受列表中删除
            state.teacherPendingCourses.splice(courseIndex, 1);
        }
    },
    
    /**
     * 完成课程
     * @param {Object} state - Vuex状态对象
     * @param {Object} completion - 完成信息
     */
    COMPLETE_COURSE(state, completion) {
        const courseIndex = state.teacherActiveCourses.findIndex(course => course.id === completion.courseId);
        
        if (courseIndex !== -1) {
            // 获取课程并添加完成信息
            const course = state.teacherActiveCourses[courseIndex];
            
            // 添加到已完成课程列表
            state.teacherCompletedCourses.push({
                ...course,
                completedTime: completion.completedTime,
                replayUrl: completion.replayUrl || ''
            });
            
            // 从进行中列表中删除
            state.teacherActiveCourses.splice(courseIndex, 1);
        }
    },
    
    /**
     * 设置课程详情
     * @param {Object} state - Vuex状态对象
     * @param {Object} detail - 课程详情
     */
    SET_COURSE_DETAIL(state, detail) {
        state.courseDetails = {
            ...state.courseDetails,
            [detail.id]: detail
        };
    },
    
    /**
     * 设置选择的日期
     * @param {Object} state - Vuex状态对象
     * @param {String} date - 日期字符串
     */
    SET_SELECTED_DATE(state, date) {
        state.selectedDate = date;
    },
    
    /**
     * 设置选择的时间段
     * @param {Object} state - Vuex状态对象
     * @param {Object} timeInfo - 时间信息
     */
    SET_SELECTED_TIME(state, timeInfo) {
        state.selectedTimePeriod = timeInfo.period;
        state.selectedTimeSlot = timeInfo.slot;
    },
    
    /**
     * 重置时间选择
     * @param {Object} state - Vuex状态对象
     */
    RESET_TIME_SELECTION(state) {
        state.selectedDate = null;
        state.selectedTimeSlot = '';
        state.selectedTimePeriod = '';
    }
}; 