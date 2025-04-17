/**
 * @description 老师匹配模块的mutations
 */

export default {
  /**
   * @description 设置老师列表
   * @param {Object} state - 状态对象
   * @param {Array} teachers - 老师列表
   */
  SET_TEACHERS(state, teachers) {
    state.teachers = teachers;
  },
  
  /**
   * @description 设置当前选中的老师
   * @param {Object} state - 状态对象
   * @param {Object} teacher - 老师对象
   */
  SET_CURRENT_TEACHER(state, teacher) {
    state.currentTeacher = teacher;
  },
  
  /**
   * @description 更新筛选条件
   * @param {Object} state - 状态对象
   * @param {Object} filters - 筛选条件
   */
  UPDATE_FILTERS(state, filters) {
    state.filters = {
      ...state.filters,
      ...filters
    };
  },
  
  /**
   * @description 重置筛选条件
   * @param {Object} state - 状态对象
   */
  RESET_FILTERS(state) {
    state.filters = {
      subject: '',
      level: '',
      page: 1,
      pageSize: 10
    };
  },
  
  /**
   * @description 设置分页信息
   * @param {Object} state - 状态对象
   * @param {Object} pagination - 分页信息
   */
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
  
  /**
   * @description 设置预约列表
   * @param {Object} state - 状态对象
   * @param {Array} bookings - 预约列表
   */
  SET_BOOKINGS(state, bookings) {
    state.bookings = bookings;
  },
  
  /**
   * @description 添加预约
   * @param {Object} state - 状态对象
   * @param {Object} booking - 预约对象
   */
  ADD_BOOKING(state, booking) {
    state.bookings.unshift(booking);
  },
  
  /**
   * @description 更新预约状态
   * @param {Object} state - 状态对象
   * @param {Object} bookingUpdate - 预约更新信息
   * @param {string} bookingUpdate.id - 预约ID
   * @param {string} bookingUpdate.status - 预约状态
   */
  UPDATE_BOOKING_STATUS(state, { id, status }) {
    const booking = state.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
    }
  },
  
  /**
   * @description 设置加载状态
   * @param {Object} state - 状态对象
   * @param {Object} loadingState - 加载状态
   */
  SET_LOADING(state, loadingState) {
    state.loading = {
      ...state.loading,
      ...loadingState
    };
  },
  
  /**
   * @description 设置错误信息
   * @param {Object} state - 状态对象
   * @param {string|Object|null} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 清除错误信息
   * @param {Object} state - 状态对象
   */
  CLEAR_ERROR(state) {
    state.error = null;
  }
}; 