/**
 * @description 保存择校分析请求
 * @returns {Object} 保存结果，包含分析ID
 */
'use strict';

// 引入自定义数据库和适配器
const { uniCloud, context } = require('../common/unicloud-adapter');

exports.main = async (event, context) => {
	try {
		const db = uniCloud.database();
		const { formData } = event;
		
		// 验证表单数据
		if (!formData) {
			return {
				code: -1,
				msg: '表单数据不能为空'
			};
		}
		
		// 生成记录
		const now = new Date();
		const record = {
			form_data: formData,
			user_id: context.OPENID,
			status: 0, // 0: 待分析, 1: 分析中, 2: 分析完成, -1: 分析失败
			create_time: now,
			update_time: now,
			analysis_result: null
		};
		
		// 保存到数据库
		const collection = db.collection('analysis_requests');
		const result = await collection.add(record);
		
		return {
			code: 0,
			data: {
				id: result.id
			},
			msg: '保存成功'
		};
	} catch (error) {
		console.error('保存分析请求失败:', error);
		return {
			code: -1,
			msg: '保存分析请求失败: ' + error.message
		};
	}
}; 