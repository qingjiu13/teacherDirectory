/**
 * @description 获取本科专业列表（简单字符串数组）
 * @returns {Object} 专业列表
 */
'use strict';

// 引入自定义数据库和适配器
const { uniCloud, context } = require('../common/unicloud-adapter');

exports.main = async (event, context) => {
	try {
		const db = uniCloud.database();
		const { school, keyword } = event;
		
		// 构建查询条件
		const query = {};
		if (school) {
			query.school = school;
		}
		
		// 尝试从数据库获取专业列表
		let dbResult = [];
		try {
			const collection = db.collection('undergraduate_majors');
			const queryResult = await collection.where(query).limit(200).get();
			
			if (queryResult && queryResult.data && queryResult.data.length > 0) {
				dbResult = queryResult.data.map(item => item.name);
			}
		} catch (dbError) {
			console.error('数据库查询失败:', dbError);
		}
		
		// 如果数据库有数据，返回数据库结果
		if (dbResult.length > 0) {
			console.log('使用数据库本科专业数据');
			
			// 如果有搜索关键词，则过滤结果
			if (keyword) {
				const lowerKeyword = keyword.toLowerCase();
				return {
					code: 0,
					data: dbResult.filter(major => 
						major.toLowerCase().includes(lowerKeyword))
				};
			}
			
			return {
				code: 0,
				data: dbResult
			};
		}
		
		// 数据库无数据，使用模拟数据
		console.log('使用模拟本科专业数据');
		const majors = [
			'计算机科学与技术', '软件工程', '电子信息工程', '通信工程', '自动化',
			'机械工程', '土木工程', '化学工程与工艺', '材料科学与工程', '电气工程及其自动化',
			'经济学', '金融学', '国际经济与贸易', '会计学', '工商管理',
			'市场营销', '人力资源管理', '法学', '汉语言文学', '英语',
			'日语', '新闻学', '广告学', '教育学', '心理学',
			'数学与应用数学', '物理学', '化学', '生物科学', '医学'
		];
		
		// 如果有搜索关键词，则过滤结果
		if (keyword) {
			const lowerKeyword = keyword.toLowerCase();
			return {
				code: 0,
				data: majors.filter(major => major.toLowerCase().includes(lowerKeyword))
			};
		}
		
		return {
			code: 0,
			data: majors
		};
	} catch (error) {
		console.error('获取本科专业列表失败:', error);
		return {
			code: -1,
			msg: '获取本科专业列表失败: ' + error.message,
			data: []
		};
	}
}; 