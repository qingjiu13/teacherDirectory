/**
 * 获取用户信息
 * @returns {Object} 用户信息
 */
'use strict';
exports.main = async (event, context) => {
	const db = uniCloud.database();
	const { uid } = event;
	
	try {
		const userInfo = await db.collection('users').doc(uid || context.OPENID).get();
		return {
			code: 0,
			data: userInfo.data[0],
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