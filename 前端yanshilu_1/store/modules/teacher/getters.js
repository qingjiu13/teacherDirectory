/**
 * @description 老师匹配模块的getters
 */

export default {
  /**
   * @description 获取老师列表
   * @param {Object} state - 状态对象
   * @returns {Array} 老师列表
   */
  teachers: state => state.teachers,
  
  /**
   * @description 获取当前选中的老师
   * @param {Object} state - 状态对象
   * @returns {Object|null} 当前老师
   */
  currentTeacher: state => state.currentTeacher,
  
  /**
   * @description 获取筛选条件
   * @param {Object} state - 状态对象
   * @returns {Object} 筛选条件
   */
  filters: state => state.filters,
  
  /**
   * @description 获取分页信息
   * @param {Object} state - 状态对象
   * @returns {Object} 分页信息
   */
  pagination: state => state.pagination,
  
  /**
   * @description 获取预约列表
   * @param {Object} state - 状态对象
   * @returns {Array} 预约列表
   */
  bookings: state => state.bookings,
  
  /**
   * @description 获取待确认的预约
   * @param {Object} state - 状态对象
   * @returns {Array} 待确认预约列表
   */
  pendingBookings: state => state.bookings.filter(b => b.status === 'pending'),
  
  /**
   * @description 获取已确认的预约
   * @param {Object} state - 状态对象
   * @returns {Array} 已确认预约列表
   */
  confirmedBookings: state => state.bookings.filter(b => b.status === 'confirmed'),
  
  /**
   * @description 获取已取消的预约
   * @param {Object} state - 状态对象
   * @returns {Array} 已取消预约列表
   */
  cancelledBookings: state => state.bookings.filter(b => b.status === 'cancelled'),
  
  /**
   * @description 获取已完成的预约
   * @param {Object} state - 状态对象
   * @returns {Array} 已完成预约列表
   */
  completedBookings: state => state.bookings.filter(b => b.status === 'completed'),
  
  /**
   * @description 获取加载状态
   * @param {Object} state - 状态对象
   * @returns {Object} 加载状态
   */
  loading: state => state.loading,
  
  /**
   * @description 获取是否正在加载老师列表
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否加载中
   */
  isLoadingTeachers: state => state.loading.teachers,
  
  /**
   * @description 获取是否正在加载老师详情
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否加载中
   */
  isLoadingTeacher: state => state.loading.teacher,
  
  /**
   * @description 获取是否正在加载预约列表
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否加载中
   */
  isLoadingBookings: state => state.loading.bookings,
  
  /**
   * @description 获取是否正在处理预约操作
   * @param {Object} state - 状态对象
   * @returns {boolean} 是否处理中
   */
  isProcessingBooking: state => state.loading.booking,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - 状态对象
   * @returns {string|Object|null} 错误信息
   */
  error: state => state.error
}; 