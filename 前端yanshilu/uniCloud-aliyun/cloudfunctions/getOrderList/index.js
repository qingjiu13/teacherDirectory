/**
 * 获取订单列表
 * @param {Object} event
 * @param {String} event.userId 用户ID
 * @param {String} event.role 角色 student/senior
 * @param {String} event.status 订单状态 pending/completed/canceled
 * @param {Number} event.page 页码
 * @param {Number} event.pageSize 每页条数
 * @returns {Object} 订单列表
 */
'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const { userId, role, status, page = 1, pageSize = 10 } = event;
	
	if (!userId || !role) {
		return {
			code: -1,
			data: null,
			msg: '参数错误'
		};
	}
	
	// 构建查询条件
	let whereObj = {};
	if (role === 'student') {
		whereObj.student_id = userId;
	} else if (role === 'senior') {
		whereObj.senior_id = userId;
	}
	
	if (status) {
		whereObj.status = status;
	}
	
	try {
		// 获取总数
		const countResult = await db.collection('orders').where(whereObj).count();
		const total = countResult.total;
		
		// 分页查询
		const listResult = await db.collection('orders')
			.aggregate()
			.match(whereObj)
			.lookup({
				from: 'users',
				localField: 'student_id',
				foreignField: '_id',
				as: 'studentInfo'
			})
			.lookup({
				from: 'users',
				localField: 'senior_id',
				foreignField: '_id',
				as: 'seniorInfo'
			})
			.unwind({
				path: '$studentInfo',
				preserveNullAndEmptyArrays: true
			})
			.unwind({
				path: '$seniorInfo',
				preserveNullAndEmptyArrays: true
			})
			.project({
				_id: 1,
				order_no: 1,
				service_content: 1,
				price: 1,
				status: 1,
				create_time: 1,
				update_time: 1,
				'studentInfo._id': 1,
				'studentInfo.nickname': 1,
				'studentInfo.avatar': 1,
				'seniorInfo._id': 1,
				'seniorInfo.nickname': 1,
				'seniorInfo.avatar': 1,
				'seniorInfo.school': 1,
				'seniorInfo.major': 1
			})
			.sort({
				create_time: -1
			})
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.end();
			
		return {
			code: 0,
			data: {
				list: listResult.data,
				total,
				page,
				pageSize
			},
			msg: '获取成功'
		};
	} catch (e) {
		return {
			code: -1,
			data: null,
			msg: '获取失败：' + e.message
		};
	}
}; 