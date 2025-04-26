<script setup>
	import store from './store/index.js';
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
	
	let firstBackTime = 0
	
	// 应用启动时
	onLaunch(() => {
		console.log('App Launch')
		// 确保在应用启动时初始化store
		// 将store挂载到全局
		if (uni && !uni.$store) {
			uni.$store = store;
		}
		
		// 初始化默认用户数据
		store.dispatch('user/baseInfo/updateUserInfo', {
			userName: '默认用户',
			avatar: '/static/image/tab-bar/default_avatar.png'
		});
	})
	
	// 应用显示时
	onShow(() => {
		console.log('App Show')
	})
	
	// 应用隐藏时
	onHide(() => {
		console.log('App Hide')
	})
	
	// 安卓返回键处理
	const handleLastPageBackPress = () => {
		console.log('App LastPageBackPress')
		if (firstBackTime == 0) {
			uni.showToast({
				title: '再按一次退出应用',
				position: 'bottom',
			})
			firstBackTime = Date.now()
			setTimeout(() => {
				firstBackTime = 0
			}, 2000)
		} else if (Date.now() - firstBackTime < 2000) {
			firstBackTime = Date.now()
			uni.exit()
		}
	}
	
	// 应用退出时
	const handleExit = () => {
		console.log('App Exit')
	}
	
	// 将处理函数挂载到全局
	if (uni) {
		// #ifdef APP-ANDROID
		uni.$onLastPageBackPress = handleLastPageBackPress
		// #endif
		uni.$onExit = handleExit
	}
</script>

<style>
	/*每个页面公共css */
	.uni-row {
		flex-direction: row;
	}

	.uni-column {
		flex-direction: column;
	}
</style>