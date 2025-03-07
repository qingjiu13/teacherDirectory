'use strict';

const db = uniCloud.database();
const ordersCollection = db.collection('orders');
const coursesCollection = db.collection('courses');
const refundsCollection = db.collection('refunds');
const userCouponsCollection = db.collection('user_coupons');

/**
 * 订单相关云函数
 * @description 处理订单创建、查询、退款等功能
 */
exports.main = async (event, context) => {
  const { action, params } = event;
  
  // 根据action执行不同的操作
  switch (action) {
    case 'createOrder':
      return await createOrder(params);
    case 'getOrderDetail':
      return await getOrderDetail(params);
    case 'getUserOrders':
      return await getUserOrders(params);
    case 'getMentorOrders':
      return await getMentorOrders(params);
    case 'updateOrderStatus':
      return await updateOrderStatus(params);
    case 'applyRefund':
      return await applyRefund(params);
    case 'getRefundDetail':
      return await getRefundDetail(params);
    case 'processRefund':
      return await processRefund(params);
    default:
      return {
        code: -1,
        message: '未知操作'
      };
  }
};

/**
 * 创建订单
 * @param {Object} params - 订单参数
 * @param {String} params.userId - 用户ID
 * @param {String} params.courseId - 课程ID
 * @param {String} params.couponId - 优惠券ID
 * @param {Number} params.discountAmount - 优惠金额
 * @param {String} params.paymentMethod - 支付方式
 * @param {String} params.remark - 备注
 * @returns {Object} 创建结果
 */
async function createOrder(params) {
  const { userId, courseId, couponId, discountAmount, paymentMethod, remark } = params;
  
  if (!userId || !courseId) {
    return {
      code: -1,
      message: '订单信息不完整'
    };
  }
  
  try {
    // 查询课程信息
    const courseResult = await coursesCollection.doc(courseId).get();
    
    if (courseResult.data.length === 0) {
      return {
        code: -1,
        message: '课程不存在'
      };
    }
    
    const course = courseResult.data[0];
    
    // 检查课程状态
    if (course.status !== 1) {
      return {
        code: -1,
        message: '课程已下架'
      };
    }
    
    // 生成订单号
    const orderNo = generateOrderNo();
    
    // 计算实际支付金额
    const price = course.price;
    const discount = discountAmount || 0;
    const actualAmount = Math.max(0, price - discount);
    
    // 创建订单
    const now = new Date();
    const orderData = {
      order_no: orderNo,
      user_id: userId,
      course_id: courseId,
      mentor_id: course.mentor_id,
      course_title: course.title,
      price: price,
      discount_amount: discount,
      actual_amount: actualAmount,
      payment_method: paymentMethod,
      status: 0, // 待支付
      remark: remark || '',
      create_date: now,
      update_date: now
    };
    
    const orderResult = await ordersCollection.add(orderData);
    
    // 如果使用了优惠券，更新优惠券状态
    if (couponId) {
      await userCouponsCollection.where({
        user_id: userId,
        coupon_id: couponId,
        status: 0 // 未使用
      }).update({
        status: 1, // 已使用
        use_time: now,
        order_id: orderResult.id
      });
    }
    
    return {
      code: 0,
      message: '订单创建成功',
      data: {
        orderId: orderResult.id,
        orderNo: orderNo,
        actualAmount: actualAmount
      }
    };
  } catch (error) {
    console.error('创建订单失败', error);
    return {
      code: -1,
      message: '创建订单失败，请稍后重试'
    };
  }
}

/**
 * 获取订单详情
 * @param {Object} params - 查询参数
 * @param {String} params.orderId - 订单ID
 * @param {String} params.userId - 用户ID
 * @returns {Object} 订单详情
 */
async function getOrderDetail(params) {
  const { orderId, userId } = params;
  
  if (!orderId) {
    return {
      code: -1,
      message: '订单ID不能为空'
    };
  }
  
  try {
    // 查询订单
    const orderResult = await ordersCollection.doc(orderId).get();
    
    if (orderResult.data.length === 0) {
      return {
        code: -1,
        message: '订单不存在'
      };
    }
    
    const order = orderResult.data[0];
    
    // 检查权限
    if (userId && order.user_id !== userId && order.mentor_id !== userId) {
      return {
        code: -1,
        message: '无权查看此订单'
      };
    }
    
    // 查询退款信息
    let refund = null;
    if (order.status === 3) { // 已退款
      const refundResult = await refundsCollection.where({
        order_id: orderId
      }).get();
      
      if (refundResult.data.length > 0) {
        refund = refundResult.data[0];
      }
    }
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        order: order,
        refund: refund
      }
    };
  } catch (error) {
    console.error('获取订单详情失败', error);
    return {
      code: -1,
      message: '获取订单详情失败，请稍后重试'
    };
  }
}

/**
 * 获取用户订单列表
 * @param {Object} params - 查询参数
 * @param {String} params.userId - 用户ID
 * @param {Number} params.status - 订单状态
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Object} 订单列表
 */
async function getUserOrders(params) {
  const { userId, status, page = 1, pageSize = 10 } = params;
  
  if (!userId) {
    return {
      code: -1,
      message: '用户ID不能为空'
    };
  }
  
  try {
    // 构建查询条件
    const query = {
      user_id: userId
    };
    
    if (status !== undefined) {
      query.status = status;
    }
    
    // 查询订单总数
    const countResult = await ordersCollection.where(query).count();
    const total = countResult.total;
    
    // 查询订单列表
    const orderResult = await ordersCollection.where(query)
      .orderBy('create_date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list: orderResult.data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    console.error('获取用户订单列表失败', error);
    return {
      code: -1,
      message: '获取用户订单列表失败，请稍后重试'
    };
  }
}

/**
 * 获取导师订单列表
 * @param {Object} params - 查询参数
 * @param {String} params.mentorId - 导师ID
 * @param {Number} params.status - 订单状态
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Object} 订单列表
 */
async function getMentorOrders(params) {
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
    
    // 查询订单总数
    const countResult = await ordersCollection.where(query).count();
    const total = countResult.total;
    
    // 查询订单列表
    const orderResult = await ordersCollection.where(query)
      .orderBy('create_date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        list: orderResult.data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    };
  } catch (error) {
    console.error('获取导师订单列表失败', error);
    return {
      code: -1,
      message: '获取导师订单列表失败，请稍后重试'
    };
  }
}

/**
 * 更新订单状态
 * @param {Object} params - 更新参数
 * @param {String} params.orderId - 订单ID
 * @param {Number} params.status - 订单状态
 * @param {String} params.paymentMethod - 支付方式
 * @returns {Object} 更新结果
 */
async function updateOrderStatus(params) {
  const { orderId, status, paymentMethod } = params;
  
  if (!orderId || status === undefined) {
    return {
      code: -1,
      message: '更新信息不完整'
    };
  }
  
  try {
    // 查询订单
    const orderResult = await ordersCollection.doc(orderId).get();
    
    if (orderResult.data.length === 0) {
      return {
        code: -1,
        message: '订单不存在'
      };
    }
    
    const order = orderResult.data[0];
    
    // 更新数据
    const updateData = {
      status: status,
      update_date: new Date()
    };
    
    // 如果是支付成功，记录支付时间和方式
    if (status === 1) {
      updateData.payment_time = new Date();
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
      
      // 更新课程学生数量
      await coursesCollection.doc(order.course_id).update({
        student_count: db.command.inc(1)
      });
    }
    
    // 更新订单
    await ordersCollection.doc(orderId).update(updateData);
    
    return {
      code: 0,
      message: '更新成功'
    };
  } catch (error) {
    console.error('更新订单状态失败', error);
    return {
      code: -1,
      message: '更新订单状态失败，请稍后重试'
    };
  }
}

/**
 * 申请退款
 * @param {Object} params - 退款参数
 * @param {String} params.orderId - 订单ID
 * @param {String} params.userId - 用户ID
 * @param {String} params.reason - 退款原因
 * @returns {Object} 申请结果
 */
async function applyRefund(params) {
  const { orderId, userId, reason } = params;
  
  if (!orderId || !userId || !reason) {
    return {
      code: -1,
      message: '退款信息不完整'
    };
  }
  
  try {
    // 查询订单
    const orderResult = await ordersCollection.doc(orderId).get();
    
    if (orderResult.data.length === 0) {
      return {
        code: -1,
        message: '订单不存在'
      };
    }
    
    const order = orderResult.data[0];
    
    // 检查订单状态
    if (order.status !== 1) {
      return {
        code: -1,
        message: '只有已支付的订单才能申请退款'
      };
    }
    
    // 检查权限
    if (order.user_id !== userId) {
      return {
        code: -1,
        message: '无权操作此订单'
      };
    }
    
    // 检查是否已申请退款
    const refundCheck = await refundsCollection.where({
      order_id: orderId
    }).get();
    
    if (refundCheck.data.length > 0) {
      return {
        code: -1,
        message: '已申请退款，请勿重复操作'
      };
    }
    
    // 创建退款申请
    const now = new Date();
    const refundData = {
      order_id: orderId,
      user_id: userId,
      amount: order.actual_amount,
      reason: reason,
      status: 0, // 申请中
      create_date: now,
      update_date: now
    };
    
    const refundResult = await refundsCollection.add(refundData);
    
    // 更新订单状态为退款中
    await ordersCollection.doc(orderId).update({
      status: 3, // 退款中
      update_date: now
    });
    
    return {
      code: 0,
      message: '退款申请提交成功',
      data: {
        refundId: refundResult.id
      }
    };
  } catch (error) {
    console.error('申请退款失败', error);
    return {
      code: -1,
      message: '申请退款失败，请稍后重试'
    };
  }
}

/**
 * 获取退款详情
 * @param {Object} params - 查询参数
 * @param {String} params.refundId - 退款ID
 * @param {String} params.userId - 用户ID
 * @returns {Object} 退款详情
 */
async function getRefundDetail(params) {
  const { refundId, userId } = params;
  
  if (!refundId) {
    return {
      code: -1,
      message: '退款ID不能为空'
    };
  }
  
  try {
    // 查询退款
    const refundResult = await refundsCollection.doc(refundId).get();
    
    if (refundResult.data.length === 0) {
      return {
        code: -1,
        message: '退款记录不存在'
      };
    }
    
    const refund = refundResult.data[0];
    
    // 检查权限
    if (userId && refund.user_id !== userId) {
      // 查询订单，检查是否为导师
      const orderResult = await ordersCollection.doc(refund.order_id).get();
      
      if (orderResult.data.length === 0 || orderResult.data[0].mentor_id !== userId) {
        return {
          code: -1,
          message: '无权查看此退款记录'
        };
      }
    }
    
    // 查询订单信息
    const orderResult = await ordersCollection.doc(refund.order_id).get();
    
    return {
      code: 0,
      message: '获取成功',
      data: {
        refund: refund,
        order: orderResult.data.length > 0 ? orderResult.data[0] : null
      }
    };
  } catch (error) {
    console.error('获取退款详情失败', error);
    return {
      code: -1,
      message: '获取退款详情失败，请稍后重试'
    };
  }
}

/**
 * 处理退款申请
 * @param {Object} params - 处理参数
 * @param {String} params.refundId - 退款ID
 * @param {String} params.mentorId - 导师ID
 * @param {Number} params.status - 处理结果：1-通过，2-拒绝
 * @param {String} params.refuseReason - 拒绝原因
 * @returns {Object} 处理结果
 */
async function processRefund(params) {
  const { refundId, mentorId, status, refuseReason } = params;
  
  if (!refundId || !mentorId || status === undefined) {
    return {
      code: -1,
      message: '处理信息不完整'
    };
  }
  
  try {
    // 查询退款
    const refundResult = await refundsCollection.doc(refundId).get();
    
    if (refundResult.data.length === 0) {
      return {
        code: -1,
        message: '退款记录不存在'
      };
    }
    
    const refund = refundResult.data[0];
    
    // 检查退款状态
    if (refund.status !== 0) {
      return {
        code: -1,
        message: '退款已处理，请勿重复操作'
      };
    }
    
    // 查询订单
    const orderResult = await ordersCollection.doc(refund.order_id).get();
    
    if (orderResult.data.length === 0) {
      return {
        code: -1,
        message: '订单不存在'
      };
    }
    
    const order = orderResult.data[0];
    
    // 检查权限
    if (order.mentor_id !== mentorId) {
      return {
        code: -1,
        message: '无权处理此退款申请'
      };
    }
    
    // 更新退款状态
    const now = new Date();
    const updateData = {
      status: status,
      update_date: now
    };
    
    if (status === 1) { // 通过
      updateData.refund_time = now;
    } else if (status === 2) { // 拒绝
      if (!refuseReason) {
        return {
          code: -1,
          message: '请填写拒绝原因'
        };
      }
      updateData.refuse_reason = refuseReason;
    }
    
    await refundsCollection.doc(refundId).update(updateData);
    
    // 更新订单状态
    const orderStatus = status === 1 ? 3 : 1; // 1-已通过退款，3-已拒绝退款
    await ordersCollection.doc(refund.order_id).update({
      status: orderStatus,
      update_date: now
    });
    
    // 如果退款通过，更新课程学生数量
    if (status === 1) {
      await coursesCollection.doc(order.course_id).update({
        student_count: db.command.inc(-1)
      });
    }
    
    return {
      code: 0,
      message: status === 1 ? '退款已通过' : '退款已拒绝'
    };
  } catch (error) {
    console.error('处理退款申请失败', error);
    return {
      code: -1,
      message: '处理退款申请失败，请稍后重试'
    };
  }
}

/**
 * 生成订单号
 * @returns {String} 订单号
 */
function generateOrderNo() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ORD${year}${month}${day}${hour}${minute}${second}${random}`;
} 