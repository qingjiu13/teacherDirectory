'use strict';
exports.main = async (event, context) => {
	try {
		// 先尝试从数据库获取学校列表
		const db = uniCloud.database();
		const collection = db.collection('schools');
		
		// 尝试查询数据库
		let dbResult = [];
		try {
			const queryResult = await collection.limit(100).get();
			if (queryResult && queryResult.data && queryResult.data.length > 0) {
				dbResult = queryResult.data.map(item => item.name || item.schoolName);
			}
		} catch (dbError) {
			console.error('数据库查询失败:', dbError);
		}
		
		// 如果数据库有数据，返回数据库结果
		if (dbResult.length > 0) {
			console.log('使用数据库学校数据');
			
			// 如果有搜索关键词，则过滤结果
			if (event.keyword) {
				const keyword = event.keyword.toLowerCase();
				return {
					code: 0,
					data: dbResult.filter(school => 
						school.toLowerCase().includes(keyword))
				};
			}
			
			return {
				code: 0,
				data: dbResult
			};
		}
		
		// 数据库无数据，使用模拟数据
		console.log('使用模拟学校数据');
		const schools = [
			'北京大学', '清华大学', '复旦大学', '上海交通大学', '浙江大学',
			'南京大学', '中国人民大学', '武汉大学', '中山大学', '华中科技大学',
			'北京师范大学', '厦门大学', '南开大学', '吉林大学', '西安交通大学',
			'哈尔滨工业大学', '电子科技大学', '东南大学', '四川大学', '中南大学',
			'同济大学', '山东大学', '北京航空航天大学', '中国科学技术大学', '华南理工大学',
			'西北工业大学', '重庆大学', '天津大学', '南开大学', '兰州大学'
		];
		
		// 如果有搜索关键词，则过滤结果
		if (event.keyword) {
			const keyword = event.keyword.toLowerCase();
			return {
				code: 0,
				data: schools.filter(school => school.toLowerCase().includes(keyword))
			};
		}
		
		return {
			code: 0,
			data: schools
		};
	} catch (error) {
		console.error('获取学校列表失败:', error);
		return {
			code: -1,
			msg: '获取学校列表失败: ' + error.message,
			data: []
		};
	}
}; 