'use strict';
/**
 * @description 获取研究生专业列表云函数
 */
exports.main = async (event, context) => {
	try {
		// 先尝试从数据库获取专业列表
		const db = uniCloud.database();
		const collection = db.collection('graduate_majors');
		
		// 获取查询参数
		const { keyword } = event;
		
		// 尝试查询数据库
		let dbResult = [];
		try {
			const queryResult = await collection.limit(100).get();
			if (queryResult && queryResult.data && queryResult.data.length > 0) {
				dbResult = queryResult.data;
			}
		} catch (dbError) {
			console.error('数据库查询失败:', dbError);
		}
		
		// 如果数据库有数据，返回数据库结果
		if (dbResult.length > 0) {
			console.log('使用数据库研究生专业数据');
			
			// 如果有搜索关键词，则过滤结果
			if (keyword) {
				const keywordLower = keyword.toLowerCase();
				return {
					code: 0,
					data: dbResult.filter(major => 
						major.name.toLowerCase().includes(keywordLower) || 
						major.code.includes(keyword) ||
						major.category.toLowerCase().includes(keywordLower)
					)
				};
			}
			
			return {
				code: 0,
				data: dbResult
			};
		}
		
		// 数据库无数据，使用模拟数据
		console.log('使用模拟研究生专业数据');
		const majors = [
			{ code: '0801', name: '计算机科学与技术', category: '学术学位' },
			{ code: '0835', name: '软件工程', category: '学术学位' },
			{ code: '0854', name: '电子信息', category: '专业学位' },
			{ code: '0812', name: '计算机技术', category: '专业学位' },
			{ code: '0251', name: '金融', category: '专业学位' },
			{ code: '0351', name: '法律', category: '专业学位' },
			{ code: '0452', name: '体育', category: '专业学位' },
			{ code: '0451', name: '教育', category: '专业学位' },
			{ code: '0551', name: '翻译', category: '专业学位' },
			{ code: '0501', name: '中国语言文学', category: '学术学位' },
			{ code: '0701', name: '数学', category: '学术学位' },
			{ code: '0702', name: '物理学', category: '学术学位' },
			{ code: '0703', name: '化学', category: '学术学位' },
			{ code: '0710', name: '生物学', category: '学术学位' },
			{ code: '1002', name: '临床医学', category: '学术学位' },
			{ code: '1001', name: '基础医学', category: '学术学位' },
			{ code: '0202', name: '应用经济学', category: '学术学位' },
			{ code: '0201', name: '理论经济学', category: '学术学位' },
			{ code: '0303', name: '社会学', category: '学术学位' },
			{ code: '0304', name: '民族学', category: '学术学位' },
			{ code: '0305', name: '马克思主义理论', category: '学术学位' },
			{ code: '0101', name: '哲学', category: '学术学位' },
			{ code: '0401', name: '教育学', category: '学术学位' },
			{ code: '0501', name: '中国语言文学', category: '学术学位' },
			{ code: '0502', name: '外国语言文学', category: '学术学位' },
			{ code: '0503', name: '新闻传播学', category: '学术学位' },
			{ code: '1201', name: '管理科学与工程', category: '学术学位' },
			{ code: '1202', name: '工商管理', category: '学术学位' },
			{ code: '1253', name: '会计', category: '专业学位' },
			{ code: '1204', name: '公共管理', category: '学术学位' },
			{ code: '1351', name: '公共管理硕士', category: '专业学位' },
			{ code: '1252', name: '工商管理硕士', category: '专业学位' },
			{ code: '0452', name: '体育硕士', category: '专业学位' },
			{ code: '0854', name: '电子信息硕士', category: '专业学位' },
			{ code: '0454', name: '应用心理硕士', category: '专业学位' },
			{ code: '0552', name: '新闻与传播硕士', category: '专业学位' }
		];
		
		// 如果有搜索关键词，则过滤结果
		if (keyword) {
			const keywordLower = keyword.toLowerCase();
			return {
				code: 0,
				data: majors.filter(major => 
					major.name.toLowerCase().includes(keywordLower) || 
					major.code.includes(keyword) ||
					major.category.toLowerCase().includes(keywordLower)
				)
			};
		}
		
		return {
			code: 0,
			data: majors
		};
	} catch (error) {
		console.error('获取研究生专业列表失败:', error);
		return {
			code: -1,
			msg: '获取研究生专业列表失败: ' + error.message,
			data: []
		};
	}
}; 