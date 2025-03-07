/**
 * 获取学长学姐列表
 * @param {Object} event
 * @param {String} event.school 学校（可选）
 * @param {String} event.major 专业（可选）
 * @param {Number} event.page 页码
 * @param {Number} event.pageSize 每页条数
 * @returns {Object} 学长学姐列表
 */
'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const { school, major, page = 1, pageSize = 10 } = event;
	const collection = db.collection('users');
	
	// 构建查询条件
	let where = 'role == "senior"';
	if (school) {
		where += ` && school == "${school}"`;
	}
	if (major) {
		where += ` && major == "${major}"`;
	}
	
	try {
		// 获取总数
		const countResult = await collection.where(where).count();
		const total = countResult.total;
		
		// 分页查询
		const list = await collection.where(where)
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('followers_count desc')
			.get();
			
		return {
			code: 0,
			data: {
				list: list.data,
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