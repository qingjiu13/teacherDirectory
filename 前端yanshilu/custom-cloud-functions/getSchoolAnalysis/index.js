/**
 * @description 获取学校分析结果
 * @returns {Object} 分析结果
 */
'use strict';

// 引入自定义数据库和适配器
const { uniCloud, context } = require('../common/unicloud-adapter');

exports.main = async (event, context) => {
	try {
		const db = uniCloud.database();
		const { action, id } = event;
		
		if (!id) {
			return {
				code: -1,
				msg: '分析ID不能为空'
			};
		}
		
		// 查询分析请求
		const collection = db.collection('analysis_requests');
		const queryResult = await collection.doc(id).get();
		
		if (!queryResult.data || queryResult.data.length === 0) {
			return {
				code: -1,
				msg: '分析记录不存在'
			};
		}
		
		const analysisRequest = queryResult.data[0];
		
		// 根据action执行不同操作
		switch (action) {
			case 'get':
				// 返回分析结果
				return {
					code: 0,
					data: analysisRequest,
					msg: '获取成功'
				};
				
			case 'status':
				// 仅返回分析状态
				return {
					code: 0,
					data: {
						status: analysisRequest.status,
						updateTime: analysisRequest.update_time
					},
					msg: '获取成功'
				};
				
			default:
				return {
					code: -1,
					msg: '未知操作'
				};
		}
	} catch (error) {
		console.error('获取分析结果失败:', error);
		return {
			code: -1,
			msg: '获取分析结果失败: ' + error.message
		};
	}
}; 