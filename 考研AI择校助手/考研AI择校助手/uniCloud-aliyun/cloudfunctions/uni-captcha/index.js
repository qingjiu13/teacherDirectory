'use strict';
// 临时移除原有依赖
// const createConfig = require('uni-config-center')
// const uniCaptcha = require('uni-captcha')

exports.main = async (event, context) => {
	// 提供一个临时的验证码实现
	// const config = createConfig({
	// 	pluginId: 'uni-captcha'
	// }).config()
	// const captcha = uniCaptcha(config)
	
	let params = event.params || {}
	// let res = await captcha[event.action](params)
	
	// 临时模拟验证码结果
	let res = {
		code: 0,
		msg: 'success'
	};
	
	// 根据不同的action返回不同的模拟数据
	if (event.action === 'create') {
		res.captchaId = 'mock_captcha_' + Date.now();
		res.captchaBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAC/klEQVR4Xu2UTWgTQRiGZzO72U0CodGgF38OHrxI9OTBiyAeRPCgUBD14EH04sGDeBEUD4J4kEiPiigiiIj6ryGJSUyExCY1iTH+JdW0IQ1NbPO3O83sgj+IVXbB+J3mgWlm2W++eXffb-fboihBCGH4NL3D87w0/SHZbJZ+SlEUhiENqqqOUUouEkLuE0LWeJ53h5klkOu6pmEY41LKGwBwkhDytxMD4Hme2RZyzVZVdZRS+oQQcqQf3JskxMywUGmjOSClvA0Ac-2CY4kQM8NOnaODrusrAPCs33AsFmJm2OnQBNM0VwDgaj/hmBnrQnwg5Jg1gk7UwDCMvQRgYzVhZqwL8YGQfuDTJYC1D/s4AWBbq3ATziDEmJmeWW/Rg9UE3QLWF9dv36EKMTMsFAr9Kg2WxN1H+qJ6Vys+nZdleoujOI5fA/Dbo7FYbA8hpKSq6goAZBhjRVVVDUIIEkIwxthvxlg+Eolsdl23bJpmdXx8/INpmgsAsFwoFDYRQn4VRdEJBAI0FAodjUaj+23bbk9OTh7M5XJr6XT6vWVZF13Xve+6ruE4zvdEIvElFovtdxxHSik3pc2hZkhHSLVa/VYul+/ZtjsNgKelPJzPb32Qz2dOWZYlKaUvtgcizw3j2zXLstKO47ybnp6+lErtgHR6GFLJ7XDzBVQqzYwQ8okxNkoIuRMMkrOlEn1SKk1CsVg8nEzuhtPn94DjOD/a7fZbQkhKUZRoKpVSS6USlEolIITkh4aG7lUqlc9SykPj42OhaHRqjlJK6vU6+L6/SRRlNBAIPAqFQvuGh4d3A0DQtm2glC52DzPr7QVq8vwsWJbVqteTQCkF26Y40+2RkQlqmuZ6NFJt/ZCBDLPeofZ+9BCKM/8/aB5CDdNc18PhTdl2Ndrt96BeX+2ug6HRCIbDmwAhBIGADtVqDWq1FnDoJoQI8X1oNOrQ7XMRnV/OdVvzRnR+ecJgHvgqxbLSyFn6/wAAAP//iYC2QomVlXUAAAAASUVORK5CYII=';
	} else if (event.action === 'verify') {
		// 始终返回验证成功
		res.match = true;
	}
	
	return res
}; 