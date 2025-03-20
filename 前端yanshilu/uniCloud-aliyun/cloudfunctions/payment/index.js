'use strict';

const db = uniCloud.database();
const ordersCollection = db.collection('orders');

/**
 * 支付相关云函数
 * @description 处理支付和回调
 */
exports.main = async (event, context) => {
  const { action, params } = event;
  
  // 根据action执行不同的操作
  switch (action) {
    case 'createPayment':
      return await createPayment(params);
    case 'queryPaymentStatus':
      return await queryPaymentStatus(params);
    case 'mockPaymentCallback':
      return await mockPaymentCallback(params);
    default:
      return {
        code: -1,
        message: '未知操作'
      };
  }
};

/**
 * 创建支付
 * @param {Object} params - 支付参数
 * @param {String} params.orderId - 订单ID
 * @param {String} params.paymentMethod - 支付方式
 * @returns {Object} 支付结果
 */
async function createPayment(params) {
  const { orderId, paymentMethod } = params;
  
  if (!orderId || !paymentMethod) {
    return {
      code: -1,
      message: '支付信息不完整'
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
    if (order.status !== 0) {
      return {
        code: -1,
        message: '订单状态不正确，无法支付'
      };
    }
    
    // 实际应用中，这里应该调用微信支付或支付宝的API生成支付参数
    // 这里使用模拟数据
    const paymentData = {
      orderId: orderId,
      orderNo: order.order_no,
      amount: order.actual_amount,
      paymentMethod: paymentMethod,
      qrCodeUrl: paymentMethod === 'wechat' ? '/static/payment/wechat_qrcode.png' : '/static/payment/alipay_qrcode.png',
      expireTime: new Date(Date.now() + 15 * 60 * 1000) // 15分钟后过期
    };
    
    return {
      code: 0,
      message: '创建支付成功',
      data: paymentData
    };
  } catch (error) {
    console.error('创建支付失败', error);
    return {
      code: -1,
      message: '创建支付失败，请稍后重试'
    };
  }
}

/**
 * 查询支付状态
 * @param {Object} params - 查询参数
 * @param {String} params.orderId - 订单ID
 * @returns {Object} 支付状态
 */
async function queryPaymentStatus(params) {
  const { orderId } = params;
  
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
    
    // 返回支付状态
    return {
      code: 0,
      message: '查询成功',
      data: {
        orderId: orderId,
        orderNo: order.order_no,
        status: order.status,
        isPaid: order.status === 1,
        paymentTime: order.payment_time
      }
    };
  } catch (error) {
    console.error('查询支付状态失败', error);
    return {
      code: -1,
      message: '查询支付状态失败，请稍后重试'
    };
  }
}

/**
 * 模拟支付回调
 * @param {Object} params - 回调参数
 * @param {String} params.orderId - 订单ID
 * @param {Boolean} params.success - 是否支付成功
 * @returns {Object} 处理结果
 */
async function mockPaymentCallback(params) {
  const { orderId, success = true } = params;
  
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
    
    // 检查订单状态
    if (order.status !== 0) {
      return {
        code: -1,
        message: '订单状态不正确，无法处理支付回调'
      };
    }
    
    // 更新订单状态
    const now = new Date();
    const updateData = {
      status: success ? 1 : 2, // 1-已支付，2-已取消
      update_date: now
    };
    
    if (success) {
      updateData.payment_time = now;
      
      // 更新课程学生数量
      const courseId = order.course_id;
      await db.collection('courses').doc(courseId).update({
        student_count: db.command.inc(1)
      });
    }
    
    await ordersCollection.doc(orderId).update(updateData);
    
    return {
      code: 0,
      message: success ? '支付成功' : '支付失败',
      data: {
        orderId: orderId,
        orderNo: order.order_no,
        status: updateData.status
      }
    };
  } catch (error) {
    console.error('处理支付回调失败', error);
    return {
      code: -1,
      message: '处理支付回调失败，请稍后重试'
    };
  }
} 