'use strict';
exports.main = async (event, context) => {
	try {
		// 先尝试从数据库获取专业列表
		const db = uniCloud.database();
		const collection = db.collection('majors');
		
		// 尝试查询数据库
		let dbResult = [];
		try {
			const queryResult = await collection.limit(100).get();
			if (queryResult && queryResult.data && queryResult.data.length > 0) {
				dbResult = queryResult.data.map(item => item.name || item.majorName);
			}
		} catch (dbError) {
			console.error('数据库查询失败:', dbError);
		}
		
		// 如果数据库有数据，返回数据库结果
		if (dbResult.length > 0) {
			console.log('使用数据库专业数据');
			
			// 如果有搜索关键词，则过滤结果
			if (event.keyword) {
				const keyword = event.keyword.toLowerCase();
				return {
					code: 0,
					data: dbResult.filter(major => 
						major.toLowerCase().includes(keyword))
				};
			}
			
			return {
				code: 0,
				data: dbResult
			};
		}
		
		// 数据库无数据，使用模拟数据
		console.log('使用模拟专业数据');
		const majors = [
			'计算机科学与技术', '软件工程', '人工智能', '数据科学与大数据技术',
			'网络空间安全', '电子信息工程', '通信工程', '自动化', '机械工程',
			'土木工程', '建筑学', '工商管理', '会计学', '金融学', '经济学',
			'法学', '医学', '生物科学', '化学', '物理学', '数学', '英语',
			'汉语言文学', '新闻学', '心理学', '教育学', '历史学', '哲学',
			'社会学', '政治学', '国际关系', '艺术设计', '音乐学', '表演',
			'广告学', '市场营销', '旅游管理', '物流管理', '信息管理', '行政管理'
		];
		
		// 如果有搜索关键词，则过滤结果
		if (event.keyword) {
			const keyword = event.keyword.toLowerCase();
			return {
				code: 0,
				data: majors.filter(major => major.toLowerCase().includes(keyword))
			};
		}
		
		return {
			code: 0,
			data: majors
		};
	} catch (error) {
		console.error('获取专业列表失败:', error);
		return {
			code: -1,
			msg: '获取专业列表失败: ' + error.message,
			data: []
		};
	}
}; 