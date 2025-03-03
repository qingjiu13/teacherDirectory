const createConfig = require('uni-config-center')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
}).config()

module.exports = {
	// 验证码配置
	code: {
		// 验证码长度
		size: 4,
		// 是否包含字母
		alphabet: false,
		// 验证码过期时间，单位：秒
		ttl: 180
	},
	// 验证码服务商，可选值：uniCaptcha、dingtalk
	provider: 'uniCaptcha',
	// 验证码存储位置，可选值：cache、redis
	storage: 'cache'
} 