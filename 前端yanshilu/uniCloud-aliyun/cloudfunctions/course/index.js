'use strict';

const db = uniCloud.database();
const coursesCollection = db.collection('courses');
const usersCollection = db.collection('users');
const userAuthInfoCollection = db.collection('user_auth_info');
const reviewsCollection = db.collection('reviews');

/**
 * 课程相关云函数
 * @description 处理课程发布、查询等功能
 */
exports.main = async (event, context) => {
  const { action, params } = event;
  
  // 根据action执行不同的操作
  switch (action) {
    case 'publishCourse':
      return await publishCourse(params);
    case 'updateCourse':
      return await updateCourse(params);
    case 'getCourseDetail':
      return await getCourseDetail(params);
    case 'getCourseList':
      return await getCourseList(params);
    case 'getMentorCourses':
      return await getMentorCourses(params);
    case 'addReview':
      return await addReview(params);
    case 'getCourseReviews':
      return await getCourseReviews(params);
    default:
      return {
        code: -1,
        message: '未知操作'
      };
  }
};

/**
 * 发布课程
 * @param {Object} params - 课程参数
 * @param {String} params.mentorId - 导师ID
 * @param {String} params.title - 课程标题
 * @param {String} params.image - 课程封面图URL
 * @param {Number} params.price - 课程价格
 * @param {String} params.category - 课程类别
 * @param {String} params.introduction - 课程简介
 * @param {Array} params.chapters - 课程章节
 * @param {Array} params.targetAudience - 适合人群
 * @returns {Object} 发布结果
 */
async function publishCourse(params) {
  const { mentorId, title, image, price, category, introduction, chapters, targetAudience } = params;
  
  if (!mentorId || !title || !price || !category) {
    return {
      code: -1,
      message: '课程信息不完整'
    };
  }
  
  try {
    // 检查用户是否存在且为导师
    const userResult = await usersCollection.doc(mentorId).get();
    
    if (userResult.data.length === 0) {
      return {
        code: -1,
        message: '用户不存在'
      };
    }
    
    const user = userResult.data[0];
    
    if (user.role !== 'mentor') {
      return {
        code: -1,
        message: '只有导师才能发布课程'
      };
    }
    
    // 检查导师是否已认证
    if (!user.is_authenticated) {
      return {
        code: -1,
        message: '请先完成身份认证'
      };
    }
    
    // 创建课程
    const now = new Date();
    const courseData = {
      title,
      mentor_id: mentorId,
      image: image || '',
      price: parseFloat(price),
      category,
      introduction: introduction || '',
      chapters: chapters || [],
      target_audience: targetAudience || [],
      student_count: 0,
      rating: 5.0, // 默认评分
      review_count: 0,
      status: 1, // 上架状态
      create_date: now,
      update_date: now
    };
    
    const courseResult = await coursesCollection.add(courseData);
    
    return {
      code: 0,
      message: '课程发布成功',
      data: {
        courseId: courseResult.id
      }
    };
  } catch (error) {
    console.error('发布课程失败', error);
    return {
      code: -1,
      message: '发布课程失败，请稍后重试'
    };
  }
}

/**
 * 更新课程
 * @param {Object} params - 更新参数
 * @param {String} params.courseId - 课程ID
 * @param {String} params.mentorId - 导师ID
 * @param {Object} params.courseData - 课程数据
 * @returns {Object} 更新结果
 */
async function updateCourse(params) {
  const { courseId, mentorId, courseData } = params;
  
  if (!courseId || !mentorId || !courseData) {
    return {
      code: -1,
      message: '更新信息不完整'
    };
  }
  
  try {
    // 查询课程
    const courseResult = await coursesCollection.doc(courseId).get();
    
    if (courseResult.data.length === 0) {
      return {
        code: -1,
        message: '课程不存在'
      };
    }
    
    const course = courseResult.data[0];
    
    // 检查权限
    if (course.mentor_id !== mentorId) {
      return {
        code: -1,
        message: '无权更新此课程'
      };
    }
    
    // 更新数据
    const updateData = {};
    
    if (courseData.title) {
      updateData.title = courseData.title;
    }
    
    if (courseData.image) {
      updateData.image = courseData.image;
    }
    
    if (courseData.price !== undefined) {
      updateData.price = parseFloat(courseData.price);
    }
    
    if (courseData.category) {
      updateData.category = courseData.category;
    }
    
    if (courseData.introduction) {
      updateData.introduction = courseData.introduction;
    }
    
    if (courseData.chapters) {
      updateData.chapters = courseData.chapters;
    }
    
    if (courseData.targetAudience) {
      updateData.target_audience = courseData.targetAudience;
    }
    
    if (courseData.status !== undefined) {
      updateData.status = courseData.status;
    }
    
    updateData.update_date = new Date();
    
    // 更新课程
    await coursesCollection.doc(courseId).update(updateData);
    
    return {
      code: 0,
      message: '课程更新成功'
    };
  } catch (error) {
    console.error('更新课程失败', error);
    return {
      code: -1,
      message: '更新课程失败，请稍后重试'
    };
  }
}

/**
 * 获取课程详情
 * @param {Object} params - 查询参数
 * @param {String} params.courseId - 课程ID
 * @returns {Object} 课程详情
 */
async function getCourseDetail(params) {
  const { courseId } = params;
  
  if (!courseId) {
    return {
      code: -1,
      message: '课程ID不能为空'
    };
  }
  
  try {
    // 查询课程
    const courseResult = await coursesCollection.doc(courseId).get();
    
    if (courseResult.data.length === 0) {
      return {
        code: -1,
        message: '课程不存在'
      };
    }
    
    const course = courseResult.data[0];
    
    // 查询导师信息
    const mentorResult = await usersCollection.doc(course.mentor_id).get();
    let mentor = null;
    
    if (mentorResult.data.length > 0) {
      mentor = mentorResult.data[0];
      
      // 查询导师认证信息
      const authResult = await userAuthInfoCollection.where({
        user_id: mentor._id
      }).get();
      
      if (authResult.data.length > 0) {
        mentor.authInfo = authResult.data[0];
      }
    }
    
    // 查询评价
    const reviewResult = await reviewsCollection.where({
      course_id: courseId
    }).limit(3).orderBy('create_date', 'desc').get();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        course,
        mentor: mentor ? {
          id: mentor._id,
          username: mentor.username,
          avatar: mentor.avatar,
          authInfo: mentor.authInfo
        } : null,
        reviews: reviewResult.data
      }
    };
  } catch (error) {
    console.error('获取课程详情失败', error);
    return {
      code: -1,
      message: '获取课程详情失败，请稍后重试'
    };
  }
}

/**
 * 获取课程列表
 * @param {Object} params - 查询参数
 * @param {String} params.category - 课程类别
 * @param {String} params.keyword - 搜索关键词
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Object} 课程列表
 */
async function getCourseList(params) {
  const { category, keyword, page = 1, pageSize = 10 } = params;
  
  try {
    // 构建查询条件
    const query = {
      status: 1 // 只查询上架的课程
    };
    
    if (category) {
      query.category = category;
    }
    
    if (keyword) {
      query.title = new RegExp(keyword, 'i');
    }
    
    // 查询课程总数
    const countResult = await coursesCollection.where(query).count();
    const total = countResult.total;
    
    // 查询课程列表
    const courseResult = await coursesCollection.where(query)
      .orderBy('create_date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    
    // 查询导师信息
    const courses = courseResult.data;
    const mentorIds = [...new Set(courses.map(course => course.mentor_id))];
    
    const mentorResult = await usersCollection.where({
      _id: db.command.in(mentorIds)
    }).field({
      _id: true,
      username: true,
      avatar: true
    }).get();
    
    const mentorMap = {};
    mentorResult.data.forEach(mentor => {
      mentorMap[mentor._id] = mentor;
    });
    
    // 组装数据
    const list = courses.map(course => {
      const mentor = mentorMap[course.mentor_id] || {};
      return {
        ...course,
        mentorName: mentor.username || '',
        mentorAvatar: mentor.avatar || ''
      };
    });
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    console.error('获取课程列表失败', error);
    return {
      code: -1,
      message: '获取课程列表失败，请稍后重试'
    };
  }
}

/**
 * 获取导师课程列表
 * @param {Object} params - 查询参数
 * @param {String} params.mentorId - 导师ID
 * @param {Number} params.status - 课程状态
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Object} 课程列表
 */
async function getMentorCourses(params) {
  const { mentorId, status, page = 1, pageSize = 10 } = params;
  
  if (!mentorId) {
    return {
      code: -1,
      message: '导师ID不能为空'
    };
  }
  
  try {
    // 构建查询条件
    const query = {
      mentor_id: mentorId
    };
    
    if (status !== undefined) {
      query.status = status;
    }
    
    // 查询课程总数
    const countResult = await coursesCollection.where(query).count();
    const total = countResult.total;
    
    // 查询课程列表
    const courseResult = await coursesCollection.where(query)
      .orderBy('create_date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list: courseResult.data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    console.error('获取导师课程列表失败', error);
    return {
      code: -1,
      message: '获取导师课程列表失败，请稍后重试'
    };
  }
}

/**
 * 添加课程评价
 * @param {Object} params - 评价参数
 * @param {String} params.courseId - 课程ID
 * @param {String} params.userId - 用户ID
 * @param {String} params.orderId - 订单ID
 * @param {Number} params.rating - 评分
 * @param {String} params.content - 评价内容
 * @returns {Object} 添加结果
 */
async function addReview(params) {
  const { courseId, userId, orderId, rating, content } = params;
  
  if (!courseId || !userId || !rating || !content) {
    return {
      code: -1,
      message: '评价信息不完整'
    };
  }
  
  try {
    // 查询课程
    const courseResult = await coursesCollection.doc(courseId).get();
    
    if (courseResult.data.length === 0) {
      return {
        code: -1,
        message: '课程不存在'
      };
    }
    
    const course = courseResult.data[0];
    
    // 检查是否已评价
    if (orderId) {
      const reviewCheck = await reviewsCollection.where({
        course_id: courseId,
        user_id: userId,
        order_id: orderId
      }).get();
      
      if (reviewCheck.data.length > 0) {
        return {
          code: -1,
          message: '已评价，请勿重复操作'
        };
      }
    }
    
    // 添加评价
    const reviewData = {
      course_id: courseId,
      user_id: userId,
      mentor_id: course.mentor_id,
      order_id: orderId || '',
      rating: parseFloat(rating),
      content,
      create_date: new Date()
    };
    
    const reviewResult = await reviewsCollection.add(reviewData);
    
    // 更新课程评分和评价数量
    const reviewCount = course.review_count + 1;
    const totalRating = course.rating * course.review_count + parseFloat(rating);
    const newRating = totalRating / reviewCount;
    
    await coursesCollection.doc(courseId).update({
      rating: newRating,
      review_count: reviewCount
    });
    
    return {
      code: 0,
      message: '评价成功',
      data: {
        reviewId: reviewResult.id
      }
    };
  } catch (error) {
    console.error('添加评价失败', error);
    return {
      code: -1,
      message: '添加评价失败，请稍后重试'
    };
  }
}

/**
 * 获取课程评价列表
 * @param {Object} params - 查询参数
 * @param {String} params.courseId - 课程ID
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Object} 评价列表
 */
async function getCourseReviews(params) {
  const { courseId, page = 1, pageSize = 10 } = params;
  
  if (!courseId) {
    return {
      code: -1,
      message: '课程ID不能为空'
    };
  }
  
  try {
    // 查询评价总数
    const countResult = await reviewsCollection.where({
      course_id: courseId
    }).count();
    const total = countResult.total;
    
    // 查询评价列表
    const reviewResult = await reviewsCollection.where({
      course_id: courseId
    }).orderBy('create_date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    
    // 查询用户信息
    const reviews = reviewResult.data;
    const userIds = [...new Set(reviews.map(review => review.user_id))];
    
    const userResult = await usersCollection.where({
      _id: db.command.in(userIds)
    }).field({
      _id: true,
      username: true,
      avatar: true
    }).get();
    
    const userMap = {};
    userResult.data.forEach(user => {
      userMap[user._id] = user;
    });
    
    // 组装数据
    const list = reviews.map(review => {
      const user = userMap[review.user_id] || {};
      return {
        ...review,
        userName: user.username || '',
        userAvatar: user.avatar || ''
      };
    });
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    console.error('获取课程评价列表失败', error);
    return {
      code: -1,
      message: '获取课程评价列表失败，请稍后重试'
    };
  }
} 