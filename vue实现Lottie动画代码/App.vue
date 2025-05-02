<template>
  <App>
    <LoadingOverlay ref="loadingRef" />
  </App>
</template>

<script setup>
	import { ref, onMounted, provide, nextTick } from 'vue'
	import LoadingOverlay from '@/components/loading-animation/loading.vue'
	import store from './store/index.js';
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
	
	let firstBackTime = 0
	// 用 uni 全局变量控制 loading 状态
	const loadingRef = ref(null)
	
	// 提供全局loading状态控制
	const isLoading = ref(false)
	
	/**
	 * 显示全局加载动画
	 */
	const showGlobalLoading = () => {
		isLoading.value = true
		if (loadingRef.value) {
			loadingRef.value.show()
		} else {
			console.warn('加载组件引用未就绪')
			// 等待下一个DOM更新周期再试一次
			nextTick(() => {
				loadingRef.value?.show?.()
			})
		}
	}
	
	/**
	 * 隐藏全局加载动画
	 */
	const hideGlobalLoading = () => {
		isLoading.value = false
		if (loadingRef.value) {
			loadingRef.value.hide()
		} else {
			console.warn('加载组件引用未就绪')
		}
	}
	
	// 提供全局加载状态
	provide('globalLoading', {
		isLoading,
		show: showGlobalLoading,
		hide: hideGlobalLoading
	})
	
	// 全局变量控制
	onMounted(() => {
		const app = getApp()
		app.globalData = app.globalData || {}
		
		// 确保组件引用已经存在
		if (loadingRef.value) {
			console.log('加载组件引用已就绪')
		} else {
			console.warn('加载组件引用尚未就绪，下一个时钟周期中检查')
			// 给DOM留出时间渲染
			setTimeout(() => {
				if (loadingRef.value) {
					console.log('加载组件引用现在已就绪')
				} else {
					console.error('加载组件引用仍未就绪')
				}
			}, 100)
		}
		
		app.globalData.$loading = {
			show: showGlobalLoading,
			hide: hideGlobalLoading
		}
	})

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