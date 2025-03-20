/**
 * 获取帖子列表
 * @param {Object} event
 * @param {String} event.userId 用户ID（可选，获取指定用户的帖子）
 * @param {Number} event.page 页码
 * @param {Number} event.pageSize 每页条数
 * @returns {Object} 帖子列表
 */
'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const dbCmd = db.command;
	const $ = db.command.aggregate;
	const { userId, page = 1, pageSize = 10 } = event;
	
	try {
		const aggregateObj = db.collection('posts')
			.aggregate()
			.lookup({
				from: 'users',
				localField: 'user_id',
				foreignField: '_id',
				as: 'userInfo'
			})
			.unwind('$userInfo')
			.project({
				_id: 1,
				content: 1,
				images: 1,
				create_time: 1,
				likes_count: 1,
				comments_count: 1,
				favorites_count: 1,
				shares_count: 1,
				views_count: 1,
				'userInfo._id': 1,
				'userInfo.nickname': 1,
				'userInfo.avatar': 1,
				'userInfo.school': 1,
				'userInfo.major': 1
			});
			
		if (userId) {
			aggregateObj.match({
				user_id: userId
			});
		}
		
		// 获取总数
		const countResult = await aggregateObj.count('total').end();
		const total = countResult.data[0] ? countResult.data[0].total : 0;
		
		// 分页查询
		const listResult = await aggregateObj
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