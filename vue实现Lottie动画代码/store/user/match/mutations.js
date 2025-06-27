/**
 * 匹配模块的mutations
 * @module store/user/match/mutations
 */

export default {

  /**
   * 设置搜索关键词
   * @param {Object} state - 状态对象
   * @param {string} searchKey - 搜索关键词
   */
  SET_SEARCH_KEY(state, searchKey) {
    state.searchKey = searchKey
  },

  /**
   * 设置匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} matchList - 匹配列表数组
   */
  SET_MATCH_LIST(state, matchList) {
    state.matchList = matchList
  },

  /**
   * 追加匹配列表
   * @param {Object} state - 状态对象
   * @param {Array} additionalMatches - 追加的匹配列表数组
   */
  APPEND_MATCH_LIST(state, additionalMatches) {
    state.matchList = [...state.matchList, ...additionalMatches]
  },
  

  /**
   * 下面是对接api函数页码相关的mutations
   * 设置分页信息
   * @param {Object} state - 当前模块的state
   * @param {Object} pagination - 分页信息
   * @param {number} pagination.currentPage - 当前页码
   * @param {boolean} pagination.hasMore - 是否还有更多数据
   */
  SET_PAGINATION(state, { currentPage, hasMore }) {
    state.currentPage = currentPage;
    state.hasMore = hasMore;
  },
  
  /**
   * 设置老师详细信息
   * @param {Object} state - 当前模块的state
   * @param {number} payload.teacherId - 老师ID（数字类型）
   * @param {Object} payload.detail - 老师详细信息
   */
  SET_TEACHER_DETAIL(state, { teacherId, detail }) {
    console.log('=== SET_TEACHER_DETAIL mutation 开始执行 ===');
    console.log('接收到的参数 - teacherId:', teacherId, '类型:', typeof teacherId);
    console.log('接收到的参数 - detail:', JSON.stringify(detail, null, 2));
    console.log('当前 matchList 长度:', state.matchList.length);
    
    // 确保teacherId是数字类型
    const normalizedTeacherId = Number(teacherId);
    console.log('标准化后的 teacherId:', normalizedTeacherId);
    
    // 找到匹配列表中对应的老师
    const teacherIndex = state.matchList.findIndex(teacher => Number(teacher.id) === normalizedTeacherId);
    console.log('查找到的老师索引:', teacherIndex);
    
    if (teacherIndex !== -1) {
      console.log('找到了对应的老师，准备更新...');
      const originalTeacher = state.matchList[teacherIndex];
      console.log('原始老师数据:', JSON.stringify(originalTeacher, null, 2));
      
      // 更新老师的服务信息
      const updatedTeacher = {
        ...originalTeacher,
        // 更新服务列表 - 直接使用API返回的service数组
        service: detail.service || []
      };
      
      console.log('合并后的老师数据:', JSON.stringify(updatedTeacher, null, 2));
      
      // 使用splice保证响应式更新
      state.matchList.splice(teacherIndex, 1, updatedTeacher);
      
      console.log('老师信息已更新到matchList');
      console.log('更新后的服务数量:', updatedTeacher.service?.length || 0);
    } else {
      console.warn('=== 未找到对应的老师 ===');
      console.warn('查找的 teacherId:', normalizedTeacherId, '类型:', typeof normalizedTeacherId);
      console.warn('matchList 中的所有 ID:');
      state.matchList.forEach((teacher, index) => {
        console.warn(`[${index}] id: ${teacher.id} (类型: ${typeof teacher.id})`);
      });
    }
    
    console.log('=== SET_TEACHER_DETAIL mutation 执行完成 ===');
  },

  /**
   * 设置非专业课选择
   * @param {Object} state - 当前模块的state
   * @param {Object} payload - 非专业课信息
   * @param {string} payload.type - 非专业课类型 ('math', 'english', 'politics', 'other')
   * @param {number} payload.id - 选项ID
   * @param {string} payload.name - 选项名称
   */
  SET_NON_PROFESSIONAL_SELECTION(state, { type, id, name }) {
    if (state.nonProfessionalList[type]) {
      state.nonProfessionalList[type].selectedId = id;
      state.nonProfessionalList[type].selected = name;
    }
  },

  /**
   * 清空非专业课选择
   * @param {Object} state - 当前模块的state
   */
  CLEAR_NON_PROFESSIONAL_SELECTION(state) {
    Object.keys(state.nonProfessionalList).forEach(key => {
      state.nonProfessionalList[key].selectedId = null;
      state.nonProfessionalList[key].selected = '';
    });
  },

  /**
   * 设置排序选项列表
   * @param {Object} state - 当前模块的state
   * @param {Array} options - 排序选项列表 [{id, name}]
   */
  SET_SORT_OPTIONS(state, options) {
    state.sortMode.options = options;
  },

  /**
   * 设置选中的排序方式
   * @param {Object} state - 当前模块的state
   * @param {Object} sortMode - 排序信息
   * @param {number} sortMode.id - 排序ID
   * @param {string} sortMode.name - 排序名称
   */
  SET_SELECTED_SORT_MODE(state, { id, name }) {
    state.sortMode.selectedId = id;
    state.sortMode.selected = name;
  }
} 