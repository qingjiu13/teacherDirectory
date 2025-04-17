/**
 * @description 课程状态管理模块
 */

// 模拟API请求
const api = {
  /**
   * @description 获取教师课程列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @returns {Promise<Object>} 课程列表
   */
  getTeacherCourses(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courses = [
          {
            id: 'c1',
            title: '学术写作指导',
            description: '帮助学生掌握学术写作技巧',
            price: 299,
            totalHours: 10,
            students: 5,
            rating: 4.8,
            coverImage: 'https://example.com/course1.jpg',
            status: 'active',
            createTime: Date.now() - 30 * 86400000,
            tags: ['学术', '写作']
          },
          {
            id: 'c2',
            title: '研究方法论',
            description: '系统讲解研究方法与实践',
            price: 399,
            totalHours: 15,
            students: 8,
            rating: 4.5,
            coverImage: 'https://example.com/course2.jpg',
            status: 'active',
            createTime: Date.now() - 60 * 86400000,
            tags: ['研究', '方法论']
          },
          {
            id: 'c3',
            title: '学术论文写作进阶',
            description: '针对高级学术论文写作的专业指导',
            price: 499,
            totalHours: 20,
            students: 3,
            rating: 4.9,
            coverImage: 'https://example.com/course3.jpg',
            status: 'draft',
            createTime: Date.now() - 15 * 86400000,
            tags: ['论文', '写作', '进阶']
          }
        ];
        
        resolve({
          success: true,
          data: courses
        });
      }, 500);
    });
  },
  
  /**
   * @description 获取学生课程列表
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @returns {Promise<Object>} 课程列表
   */
  getStudentCourses(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const courses = [
          {
            id: 's1',
            courseId: 'c1',
            title: '学术写作指导',
            teacher: '王老师',
            teacherId: 'teacher1',
            teacherAvatar: 'https://example.com/teacher1.jpg',
            progress: 60,
            rating: 5.0,
            startTime: Date.now() - 15 * 86400000,
            endTime: Date.now() + 15 * 86400000,
            nextClass: Date.now() + 86400000,
            coverImage: 'https://example.com/course1.jpg'
          },
          {
            id: 's2',
            courseId: 'c2',
            title: '研究方法论',
            teacher: '李老师',
            teacherId: 'teacher2',
            teacherAvatar: 'https://example.com/teacher2.jpg',
            progress: 30,
            rating: 4.5,
            startTime: Date.now() - 30 * 86400000,
            endTime: Date.now() + 30 * 86400000,
            nextClass: Date.now() + 3 * 86400000,
            coverImage: 'https://example.com/course2.jpg'
          }
        ];
        
        resolve({
          success: true,
          data: courses
        });
      }, 500);
    });
  },
  
  /**
   * @description 获取课程详情
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.courseId - 课程ID
   * @returns {Promise<Object>} 课程详情
   */
  getCourseDetail(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = {
          id: params.courseId,
          title: params.courseId === 'c1' ? '学术写作指导' : '研究方法论',
          description: params.courseId === 'c1' 
            ? '帮助学生掌握学术写作技巧' 
            : '系统讲解研究方法与实践',
          price: params.courseId === 'c1' ? 299 : 399,
          totalHours: params.courseId === 'c1' ? 10 : 15,
          students: params.courseId === 'c1' ? 5 : 8,
          rating: params.courseId === 'c1' ? 4.8 : 4.5,
          coverImage: `https://example.com/course${params.courseId.slice(1)}.jpg`,
          status: 'active',
          createTime: Date.now() - (params.courseId === 'c1' ? 30 : 60) * 86400000,
          tags: params.courseId === 'c1' ? ['学术', '写作'] : ['研究', '方法论'],
          syllabus: [
            {
              id: '1',
              title: '第一章：导论',
              content: '课程介绍和基本概念',
              duration: 60,
              materials: ['导论PPT', '参考文献']
            },
            {
              id: '2',
              title: '第二章：基础知识',
              content: '核心概念和理论框架',
              duration: 90,
              materials: ['基础知识PPT', '阅读材料']
            },
            {
              id: '3',
              title: '第三章：实践应用',
              content: '案例分析和实践指导',
              duration: 120,
              materials: ['案例分析PPT', '实践作业']
            }
          ],
          teacher: {
            id: 'teacher1',
            name: params.courseId === 'c1' ? '王老师' : '李老师',
            avatar: `https://example.com/teacher${params.courseId === 'c1' ? '1' : '2'}.jpg`,
            title: '副教授',
            introduction: '多年教学经验，专注于学术指导',
            rating: params.courseId === 'c1' ? 4.9 : 4.7
          },
          reviews: [
            {
              id: 'r1',
              studentId: 'student1',
              studentName: '小明',
              rating: 5,
              content: '老师讲解很清晰，收获很多',
              time: Date.now() - 5 * 86400000
            },
            {
              id: 'r2',
              studentId: 'student2',
              studentName: '小红',
              rating: 4,
              content: '内容丰富，但希望能有更多实践环节',
              time: Date.now() - 10 * 86400000
            }
          ]
        };
        
        resolve({
          success: true,
          data: course
        });
      }, 500);
    });
  },
  
  /**
   * @description 创建课程
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {Object} params.courseData - 课程数据
   * @returns {Promise<Object>} 创建结果
   */
  createCourse(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: `course_${Date.now()}`,
            ...params.courseData,
            status: 'draft',
            createTime: Date.now(),
            students: 0,
            rating: 0
          }
        });
      }, 800);
    });
  },
  
  /**
   * @description 更新课程
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.courseId - 课程ID
   * @param {Object} params.courseData - 课程数据
   * @returns {Promise<Object>} 更新结果
   */
  updateCourse(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.courseId,
            ...params.courseData,
            updateTime: Date.now()
          }
        });
      }, 600);
    });
  },
  
  /**
   * @description 删除课程
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.courseId - 课程ID
   * @returns {Promise<Object>} 删除结果
   */
  deleteCourse(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.courseId,
            deleted: true,
            deleteTime: Date.now()
          }
        });
      }, 500);
    });
  },
  
  /**
   * @description 发布课程
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.courseId - 课程ID
   * @returns {Promise<Object>} 发布结果
   */
  publishCourse(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: params.courseId,
            status: 'active',
            publishTime: Date.now()
          }
        });
      }, 500);
    });
  },
  
  /**
   * @description 评价课程
   * @param {Object} params - 请求参数
   * @param {string} params.token - 用户令牌
   * @param {string} params.courseId - 课程ID
   * @param {Object} params.reviewData - 评价数据
   * @returns {Promise<Object>} 评价结果
   */
  reviewCourse(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: `review_${Date.now()}`,
            courseId: params.courseId,
            studentId: 'currentUser',
            studentName: '当前用户',
            ...params.reviewData,
            time: Date.now()
          }
        });
      }, 500);
    });
  }
};

// 初始状态
const state = {
  teacherCourses: [],
  studentCourses: [],
  currentCourse: null,
  loading: false,
  error: null
};

// Mutations
const mutations = {
  /**
   * @description 设置教师课程列表
   * @param {Object} state - Vuex状态
   * @param {Array} courses - 课程列表
   */
  SET_TEACHER_COURSES(state, courses) {
    state.teacherCourses = courses;
  },
  
  /**
   * @description 设置学生课程列表
   * @param {Object} state - Vuex状态
   * @param {Array} courses - 课程列表
   */
  SET_STUDENT_COURSES(state, courses) {
    state.studentCourses = courses;
  },
  
  /**
   * @description 设置当前课程
   * @param {Object} state - Vuex状态
   * @param {Object} course - 课程详情
   */
  SET_CURRENT_COURSE(state, course) {
    state.currentCourse = course;
  },
  
  /**
   * @description 添加教师课程
   * @param {Object} state - Vuex状态
   * @param {Object} course - 课程数据
   */
  ADD_TEACHER_COURSE(state, course) {
    state.teacherCourses.unshift(course);
  },
  
  /**
   * @description 更新教师课程
   * @param {Object} state - Vuex状态
   * @param {Object} course - 课程数据
   */
  UPDATE_TEACHER_COURSE(state, course) {
    const index = state.teacherCourses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      state.teacherCourses.splice(index, 1, { ...state.teacherCourses[index], ...course });
    }
  },
  
  /**
   * @description 删除教师课程
   * @param {Object} state - Vuex状态
   * @param {string} courseId - 课程ID
   */
  REMOVE_TEACHER_COURSE(state, courseId) {
    state.teacherCourses = state.teacherCourses.filter(c => c.id !== courseId);
  },
  
  /**
   * @description 添加学生课程
   * @param {Object} state - Vuex状态
   * @param {Object} course - 课程数据
   */
  ADD_STUDENT_COURSE(state, course) {
    state.studentCourses.unshift(course);
  },
  
  /**
   * @description 更新学生课程
   * @param {Object} state - Vuex状态
   * @param {Object} course - 课程数据
   */
  UPDATE_STUDENT_COURSE(state, course) {
    const index = state.studentCourses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      state.studentCourses.splice(index, 1, { ...state.studentCourses[index], ...course });
    }
  },
  
  /**
   * @description 设置加载状态
   * @param {Object} state - Vuex状态
   * @param {boolean} loading - 是否加载中
   */
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  /**
   * @description 设置错误信息
   * @param {Object} state - Vuex状态
   * @param {string|Object|null} error - 错误信息
   */
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  /**
   * @description 添加课程评价
   * @param {Object} state - Vuex状态
   * @param {Object} review - 评价数据
   */
  ADD_COURSE_REVIEW(state, review) {
    if (state.currentCourse) {
      if (!state.currentCourse.reviews) {
        state.currentCourse.reviews = [];
      }
      state.currentCourse.reviews.unshift(review);
    }
  },
  
  /**
   * @description 更新课程状态
   * @param {Object} state - Vuex状态
   * @param {Object} payload - 载荷
   * @param {string} payload.courseId - 课程ID
   * @param {string} payload.status - 课程状态
   */
  UPDATE_COURSE_STATUS(state, { courseId, status }) {
    const index = state.teacherCourses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      state.teacherCourses[index].status = status;
    }
    
    if (state.currentCourse && state.currentCourse.id === courseId) {
      state.currentCourse.status = status;
    }
  }
};

// Actions
const actions = {
  /**
   * @description 获取教师课程列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 获取结果
   */
  async getTeacherCourses({ commit, rootState }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.getTeacherCourses({ token });
      
      if (response.success) {
        commit('SET_TEACHER_COURSES', response.data);
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '获取教师课程失败');
      return { success: false, message: '获取教师课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '获取教师课程失败');
      return { success: false, message: error.message || '获取教师课程失败' };
    }
  },
  
  /**
   * @description 获取学生课程列表
   * @param {Object} context - Vuex上下文
   * @returns {Promise<Object>} 获取结果
   */
  async getStudentCourses({ commit, rootState }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.getStudentCourses({ token });
      
      if (response.success) {
        commit('SET_STUDENT_COURSES', response.data);
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '获取学生课程失败');
      return { success: false, message: '获取学生课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '获取学生课程失败');
      return { success: false, message: error.message || '获取学生课程失败' };
    }
  },
  
  /**
   * @description 获取课程详情
   * @param {Object} context - Vuex上下文
   * @param {string} courseId - 课程ID
   * @returns {Promise<Object>} 获取结果
   */
  async getCourseDetail({ commit, rootState }, courseId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.getCourseDetail({ token, courseId });
      
      if (response.success) {
        commit('SET_CURRENT_COURSE', response.data);
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '获取课程详情失败');
      return { success: false, message: '获取课程详情失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '获取课程详情失败');
      return { success: false, message: error.message || '获取课程详情失败' };
    }
  },
  
  /**
   * @description 创建课程
   * @param {Object} context - Vuex上下文
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} 创建结果
   */
  async createCourse({ commit, rootState }, courseData) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.createCourse({ token, courseData });
      
      if (response.success) {
        commit('ADD_TEACHER_COURSE', response.data);
        commit('SET_CURRENT_COURSE', response.data);
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '创建课程失败');
      return { success: false, message: '创建课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '创建课程失败');
      return { success: false, message: error.message || '创建课程失败' };
    }
  },
  
  /**
   * @description 更新课程
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.courseId - 课程ID
   * @param {Object} params.courseData - 课程数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateCourse({ commit, rootState }, { courseId, courseData }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.updateCourse({ token, courseId, courseData });
      
      if (response.success) {
        commit('UPDATE_TEACHER_COURSE', response.data);
        if (state.currentCourse && state.currentCourse.id === courseId) {
          commit('SET_CURRENT_COURSE', { ...state.currentCourse, ...response.data });
        }
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '更新课程失败');
      return { success: false, message: '更新课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '更新课程失败');
      return { success: false, message: error.message || '更新课程失败' };
    }
  },
  
  /**
   * @description 删除课程
   * @param {Object} context - Vuex上下文
   * @param {string} courseId - 课程ID
   * @returns {Promise<Object>} 删除结果
   */
  async deleteCourse({ commit, rootState }, courseId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.deleteCourse({ token, courseId });
      
      if (response.success) {
        commit('REMOVE_TEACHER_COURSE', courseId);
        if (state.currentCourse && state.currentCourse.id === courseId) {
          commit('SET_CURRENT_COURSE', null);
        }
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '删除课程失败');
      return { success: false, message: '删除课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '删除课程失败');
      return { success: false, message: error.message || '删除课程失败' };
    }
  },
  
  /**
   * @description 发布课程
   * @param {Object} context - Vuex上下文
   * @param {string} courseId - 课程ID
   * @returns {Promise<Object>} 发布结果
   */
  async publishCourse({ commit, rootState }, courseId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.publishCourse({ token, courseId });
      
      if (response.success) {
        commit('UPDATE_COURSE_STATUS', { courseId, status: 'active' });
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '发布课程失败');
      return { success: false, message: '发布课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '发布课程失败');
      return { success: false, message: error.message || '发布课程失败' };
    }
  },
  
  /**
   * @description 评价课程
   * @param {Object} context - Vuex上下文
   * @param {Object} params - 请求参数
   * @param {string} params.courseId - 课程ID
   * @param {Object} params.reviewData - 评价数据
   * @returns {Promise<Object>} 评价结果
   */
  async reviewCourse({ commit, rootState }, { courseId, reviewData }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      const token = rootState.auth.token;
      const response = await api.reviewCourse({ token, courseId, reviewData });
      
      if (response.success) {
        commit('ADD_COURSE_REVIEW', response.data);
        commit('SET_LOADING', false);
        return { success: true, data: response.data };
      }
      
      commit('SET_LOADING', false);
      commit('SET_ERROR', '评价课程失败');
      return { success: false, message: '评价课程失败' };
    } catch (error) {
      commit('SET_LOADING', false);
      commit('SET_ERROR', error.message || '评价课程失败');
      return { success: false, message: error.message || '评价课程失败' };
    }
  }
};

// Getters
const getters = {
  /**
   * @description 获取教师课程列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 教师课程列表
   */
  teacherCourses: state => state.teacherCourses,
  
  /**
   * @description 获取学生课程列表
   * @param {Object} state - Vuex状态
   * @returns {Array} 学生课程列表
   */
  studentCourses: state => state.studentCourses,
  
  /**
   * @description 获取当前课程
   * @param {Object} state - Vuex状态
   * @returns {Object|null} 当前课程
   */
  currentCourse: state => state.currentCourse,
  
  /**
   * @description 获取教师草稿课程
   * @param {Object} state - Vuex状态
   * @returns {Array} 草稿课程列表
   */
  draftCourses: state => state.teacherCourses.filter(course => course.status === 'draft'),
  
  /**
   * @description 获取教师已发布课程
   * @param {Object} state - Vuex状态
   * @returns {Array} 已发布课程列表
   */
  activeCourses: state => state.teacherCourses.filter(course => course.status === 'active'),
  
  /**
   * @description 获取教师课程总数
   * @param {Object} state - Vuex状态
   * @returns {number} 教师课程总数
   */
  teacherCoursesCount: state => state.teacherCourses.length,
  
  /**
   * @description 获取学生课程总数
   * @param {Object} state - Vuex状态
   * @returns {number} 学生课程总数
   */
  studentCoursesCount: state => state.studentCourses.length,
  
  /**
   * @description 获取教师草稿课程数量
   * @param {Object} state - Vuex状态
   * @returns {number} 草稿课程数量
   */
  draftCoursesCount: state => state.teacherCourses.filter(course => course.status === 'draft').length,
  
  /**
   * @description 获取教师发布课程数量
   * @param {Object} state - Vuex状态
   * @returns {number} 发布课程数量
   */
  activeCoursesCount: state => state.teacherCourses.filter(course => course.status === 'active').length,
  
  /**
   * @description 获取教师学生总数
   * @param {Object} state - Vuex状态
   * @returns {number} 学生总数
   */
  totalStudents: state => state.teacherCourses.reduce((sum, course) => sum + (course.students || 0), 0),
  
  /**
   * @description 获取教师平均评分
   * @param {Object} state - Vuex状态
   * @returns {number} 平均评分
   */
  averageRating: state => {
    const courses = state.teacherCourses.filter(course => course.rating > 0);
    if (courses.length === 0) return 0;
    return courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;
  },
  
  /**
   * @description 获取是否加载中
   * @param {Object} state - Vuex状态
   * @returns {boolean} 是否加载中
   */
  isLoading: state => state.loading,
  
  /**
   * @description 获取错误信息
   * @param {Object} state - Vuex状态
   * @returns {string|Object|null} 错误信息
   */
  error: state => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 