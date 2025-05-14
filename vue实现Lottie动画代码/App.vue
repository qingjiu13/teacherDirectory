<template>
  <App>
    <GlobalLoading 
      ref="loadingRef" 
      :preload="true" 
      @mounted="handleLoadingMounted" 
      @error="handleLoadingError" 
      @timeout="handleLoadingTimeout" 
    />
  </App>
</template>

<script setup>
	import { ref, onMounted, provide, nextTick, onBeforeMount, reactive, getCurrentInstance, watchEffect } from 'vue'
	import GlobalLoading from '@/components/loading/GlobalLoading.vue'
	import { useGlobalAnimationState, preloadAnimations } from '@/components/loading/useAnimationCache.js'
	import store from './store/index.js';
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
	
	let firstBackTime = 0
	// 用 uni 全局变量控制 loading 状态
	const loadingRef = ref(null)
	
	// 提供全局loading状态控制
	const isLoading = ref(false)
	const isLoadingPreloaded = ref(false)
	
	/**
	 * 预定义的动画源列表，用于预加载
	 * @type {Array<string>}
	 */
	const predefinedAnimations = [
		'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
		// 可以在这里添加其他需要预加载的动画
	]
	
	// 获取全局动画状态
	const { 
		globalState, 
		getGlobalStats, 
		isAllAnimationsLoaded,
		getAnimationFromCache,
		preloadAnimation: preloadSingleAnimation
	} = useGlobalAnimationState()
	
	/**
	 * 动画加载状态
	 * 可被其他组件监听的状态对象
	 */
	const animationStatus = reactive({
		/**
		 * 是否所有动画已加载完成
		 * @type {Boolean}
		 */
		allLoaded: false,
		
		/**
		 * 动画加载统计信息
		 * @type {Object}
		 */
		stats: null,
		
		/**
		 * 最后更新时间
		 * @type {Number}
		 */
		lastUpdated: 0,
		
		/**
		 * LoadingOverlay组件是否已挂载
		 * @type {Boolean}
		 */
		isComponentMounted: false,
		
		/**
		 * 批量预加载状态
		 * @type {Object}
		 */
		batchPreloadStatus: {
			inProgress: false,
			completed: 0,
			total: 0,
			progress: 0
		}
	})
	
	/**
	 * 处理LoadingOverlay组件挂载事件
	 */
	const handleLoadingMounted = () => {
		console.log('GlobalLoading组件已挂载，更新全局控制')
		animationStatus.isComponentMounted = true
		
		// 立即更新全局$loading对象
		updateGlobalLoadingObject(true)
		
		// 尝试预加载预定义的动画
		startBatchPreload()
		
		// 处理所有待处理的调用
		const app = getApp();
		if (app?.globalData?._pendingLoadingCalls?.length > 0) {
			console.log(`处理${app.globalData._pendingLoadingCalls.length}个待处理的loading调用`);
			const pendingCalls = [...app.globalData._pendingLoadingCalls];
			app.globalData._pendingLoadingCalls = [];
			
			pendingCalls.forEach(call => {
				try {
					if (call.method === 'show') showGlobalLoading();
					else if (call.method === 'hide') hideGlobalLoading();
					else if (call.method === 'preload') preloadGlobalLoading();
				} catch (e) {
					console.error('执行待处理调用失败:', e);
				}
			});
		}
	}
	
	/**
	 * 处理加载错误
	 * @param {Object} error - 错误信息
	 */
	const handleLoadingError = (error) => {
		console.error('加载动画出错:', error)
	}
	
	/**
	 * 处理加载超时
	 * @param {string} src - 超时的动画源
	 */
	const handleLoadingTimeout = (src) => {
		console.warn('加载动画超时:', src)
	}
	
	/**
	 * 开始批量预加载动画
	 */
	const startBatchPreload = () => {
		if (predefinedAnimations.length === 0) return
		
		animationStatus.batchPreloadStatus.inProgress = true
		animationStatus.batchPreloadStatus.completed = 0
		animationStatus.batchPreloadStatus.total = predefinedAnimations.length
		animationStatus.batchPreloadStatus.progress = 0
		
		// 批量预加载
		preloadAnimations(predefinedAnimations, (progress) => {
			// 更新预加载进度
			animationStatus.batchPreloadStatus.completed = progress.completed
			animationStatus.batchPreloadStatus.progress = progress.progress
			
			console.log(`预加载进度: ${progress.progress.toFixed(2)}% (${progress.completed}/${progress.total})`)
		}).then((result) => {
			console.log(`预加载完成: 成功${result.totalSuccess}个, 失败${result.totalFailed}个`)
			animationStatus.batchPreloadStatus.inProgress = false
			
			// 更新统计信息
			updateAnimationStats()
		}).catch(error => {
			console.error('批量预加载出错:', error)
			animationStatus.batchPreloadStatus.inProgress = false
		})
	}
	
	/**
	 * 确保全局$loading对象存在
	 * 在页面加载前尽早初始化
	 */
	const ensureGlobalLoadingExists = () => {
		try {
			// 确保全局app存在
			if (typeof getApp === 'function') {
				const app = getApp()
				if (app) {
					app.globalData = app.globalData || {}
					app.globalData._pendingLoadingCalls = app.globalData._pendingLoadingCalls || []
					
					// 如果loadingRef已经存在，使用真实的方法
					if (loadingRef.value) {
						app.globalData.$loading = {
							show: showGlobalLoading,
							hide: hideGlobalLoading,
							preload: preloadGlobalLoading,
							preloadBatch: startBatchPreload,
							isPreloaded: isLoadingPreloaded,
							getStatus: getAnimationStatus,
							getFromCache: getAnimationFromCache,
							globalState,
							isReady: true,
							componentMounted: true
						}
						console.log('App.vue: 已使用真实组件更新全局$loading对象')
						return
					}
					
					// 创建临时的$loading对象
					if (!app.globalData.$loading) {
						// 临时方法，但会在组件挂载后自动转发到真实方法
						const tempShow = () => {
							console.log('Loading组件尚未挂载，show方法延迟执行')
							// 添加一个延迟执行的机制
							if (loadingRef.value) {
								loadingRef.value.show()
								return true
							} else {
								app.globalData._pendingLoadingCalls.push({ 
									method: 'show', 
									time: Date.now() 
								})
								
								setTimeout(() => {
									if (loadingRef.value) {
										loadingRef.value.show()
										return true
									}
								}, 200)
								return false
							}
						}
						
						const tempHide = () => {
							console.log('Loading组件尚未挂载，hide方法延迟执行')
							if (loadingRef.value) {
								loadingRef.value.hide()
								return true
							} else {
								app.globalData._pendingLoadingCalls.push({ 
									method: 'hide', 
									time: Date.now() 
								})
								
								setTimeout(() => {
									if (loadingRef.value) {
										loadingRef.value.hide()
										return true
									}
								}, 200)
								return false
							}
						}
						
						const tempPreload = async () => {
							console.log('Loading组件尚未挂载，preload方法延迟执行')
							if (loadingRef.value) {
								return await loadingRef.value.preload()
							} else {
								app.globalData._pendingLoadingCalls.push({ 
									method: 'preload', 
									time: Date.now() 
								})
								
								return new Promise((resolve) => {
									setTimeout(async () => {
										if (loadingRef.value) {
											const result = await loadingRef.value.preload()
											resolve(result)
										} else {
											resolve(false)
										}
									}, 200)
								})
							}
						}
						
						app.globalData.$loading = {
							show: tempShow,
							hide: tempHide,
							preload: tempPreload,
							preloadBatch: startBatchPreload,
							isPreloaded: isLoadingPreloaded,
							getStatus: getAnimationStatus,
							getFromCache: getAnimationFromCache,
							globalState,
							isReady: false,
							componentMounted: false
						}
						console.log('App.vue: 已创建自动转发的临时$loading对象')
					}
				}
			}
		} catch (err) {
			console.error('确保全局$loading对象存在失败:', err)
		}
	}
	
	// 立即尝试初始化全局对象
	ensureGlobalLoadingExists()
	
	// 监听组件引用变化
	watchEffect(() => {
		if (loadingRef.value) {
			console.log('检测到loadingRef已就绪，更新全局对象')
			animationStatus.isComponentMounted = true
			updateGlobalLoadingObject(true)
		}
	})
	
	/**
	 * 预加载单个动画
	 * @param {string} src - 动画资源地址
	 * @returns {Promise<boolean>} 预加载结果
	 */
	const preloadSingleAnimationSource = async (src) => {
		try {
			await preloadSingleAnimation(src)
			console.log(`预加载动画成功: ${src}`)
			
			// 更新统计信息
			updateAnimationStats()
			
			return true
		} catch (error) {
			console.error(`预加载动画失败: ${src}`, error)
			return false
		}
	}
	
	/**
	 * 预加载全局加载动画
	 * @returns {Promise<boolean>} 预加载结果
	 */
	const preloadGlobalLoading = async () => {
		// 再次确保全局对象存在
		ensureGlobalLoadingExists()
		
		if (!loadingRef.value) {
			console.warn('加载组件引用未就绪，尝试从全局获取')
			
			// 如果当前动画已经在缓存中，直接标记为预加载成功
			const defaultSrc = 'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
			if (getAnimationFromCache(defaultSrc)) {
				isLoadingPreloaded.value = true
				console.log('默认动画已在缓存中，标记为预加载成功')
				return true
			}
			
			// 尝试直接使用全局函数预加载
			return await preloadSingleAnimationSource(defaultSrc)
		}
		
		try {
			if (typeof loadingRef.value.preload === 'function') {
				await loadingRef.value.preload()
				isLoadingPreloaded.value = true
				console.log('全局加载动画预加载成功')
				
				// 更新统计信息
				updateAnimationStats()
				
				// 更新全局$loading对象
				updateGlobalLoadingObject()
				
				return true
			}
		} catch (err) {
			console.error('全局加载动画预加载失败:', err)
		}
		
		return false
	}
	
	/**
	 * 更新全局$loading对象
	 * 确保它包含最新的方法引用
	 * @param {Boolean} force - 是否强制更新
	 */
	const updateGlobalLoadingObject = (force = false) => {
		try {
			const app = getApp()
			if (app && app.globalData) {
				// 只有当loadingRef存在或force为true时才更新
				if (loadingRef.value || force) {
					// 更新全局对象，但保留原始方法
					const oldLoading = app.globalData.$loading || {}
					
					app.globalData.$loading = {
						show: showGlobalLoading,
						hide: hideGlobalLoading,
						preload: preloadGlobalLoading,
						preloadBatch: startBatchPreload,
						preloadSingle: preloadSingleAnimationSource,
						isPreloaded: isLoadingPreloaded,
						getStatus: getAnimationStatus,
						getFromCache: getAnimationFromCache,
						globalState,
						isReady: true,
						componentMounted: Boolean(loadingRef.value),
						
						// 保留一些原始属性，如果存在的话
						...oldLoading.extraData
					}
					
					console.log('已更新全局$loading对象，组件已挂载:', Boolean(loadingRef.value))
					
					// 如果之前有待处理的调用，现在可以执行
					if (app.globalData._pendingLoadingCalls?.length > 0) {
						const pendingCalls = [...app.globalData._pendingLoadingCalls];
						app.globalData._pendingLoadingCalls = [];
						
						console.log(`处理${pendingCalls.length}个待处理的loading调用`);
						pendingCalls.forEach(call => {
							try {
								if (call.method === 'show') showGlobalLoading();
								else if (call.method === 'hide') hideGlobalLoading();
								else if (call.method === 'preload') preloadGlobalLoading();
							} catch (e) {
								console.error('执行待处理调用失败:', e);
							}
						});
					}
				}
			}
		} catch (err) {
			console.error('更新全局$loading对象失败:', err)
		}
	}
	
	/**
	 * 更新动画统计信息
	 */
	const updateAnimationStats = () => {
		if (loadingRef.value && loadingRef.value.getAnimationStats) {
			animationStatus.stats = loadingRef.value.getAnimationStats()
		} else {
			animationStatus.stats = getGlobalStats()
		}
		
		animationStatus.allLoaded = isAllAnimationsLoaded()
		animationStatus.lastUpdated = Date.now()
	}
	
	/**
	 * 获取当前动画加载状态
	 * @returns {Object} 动画加载状态
	 */
	const getAnimationStatus = () => {
		updateAnimationStats()
		return animationStatus
	}
	
	/**
	 * 显示全局加载动画
	 * @returns {boolean} 是否成功显示
	 */
	const showGlobalLoading = () => {
		isLoading.value = true
		if (loadingRef.value) {
			loadingRef.value.show()
			return true
		} else {
			console.warn('加载组件引用未就绪，尝试延迟显示')
			// 添加到待处理队列
			const app = getApp();
			if (app && app.globalData) {
				app.globalData._pendingLoadingCalls = app.globalData._pendingLoadingCalls || [];
				app.globalData._pendingLoadingCalls.push({ method: 'show', time: Date.now() });
			}
			
			// 等待下一个DOM更新周期再试一次
			nextTick(() => {
				if (loadingRef.value) {
					loadingRef.value.show()
					return true
				}
			})
			return false
		}
	}
	
	/**
	 * 隐藏全局加载动画
	 * @returns {boolean} 是否成功隐藏
	 */
	const hideGlobalLoading = () => {
		isLoading.value = false
		if (loadingRef.value) {
			loadingRef.value.hide()
			return true
		} else {
			console.warn('加载组件引用未就绪，尝试延迟隐藏')
			// 添加到待处理队列
			const app = getApp();
			if (app && app.globalData) {
				app.globalData._pendingLoadingCalls = app.globalData._pendingLoadingCalls || [];
				app.globalData._pendingLoadingCalls.push({ method: 'hide', time: Date.now() });
			}
			
			nextTick(() => {
				if (loadingRef.value) {
					loadingRef.value.hide()
					return true
				}
			})
			return false
		}
	}
	
	// 提供全局加载状态
	provide('globalLoading', {
		isLoading,
		isPreloaded: isLoadingPreloaded,
		preload: preloadGlobalLoading,
		preloadSingle: preloadSingleAnimationSource,
		preloadBatch: startBatchPreload,
		show: showGlobalLoading,
		hide: hideGlobalLoading,
		getStatus: getAnimationStatus,
		getFromCache: getAnimationFromCache,
		globalState
	})
	
	// 应用加载前进行预加载准备
	onBeforeMount(() => {
		console.log('App 即将挂载，尝试预加载加载动画')
		
		// 再次确保全局对象存在
		ensureGlobalLoadingExists()
		
		// 尝试预加载默认动画
		preloadSingleAnimationSource('https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json')
			.then(() => {
				isLoadingPreloaded.value = true
			})
	})
	
	// 全局变量控制
	onMounted(() => {
		const app = getApp()
		app.globalData = app.globalData || {}
		
		// 确保组件引用已经存在
		if (loadingRef.value) {
			console.log('加载组件引用已就绪')
			// 立即尝试预加载并更新全局对象
			preloadGlobalLoading().then(success => {
				if (success) {
					updateGlobalLoadingObject(true)
				}
			})
		} else {
			console.warn('加载组件引用尚未就绪，下一个时钟周期中检查')
			// 给DOM留出时间渲染
			setTimeout(async () => {
				if (loadingRef.value) {
					console.log('加载组件引用现在已就绪')
					const success = await preloadGlobalLoading()
					if (success) {
						updateGlobalLoadingObject(true)
					}
				} else {
					console.error('加载组件引用仍未就绪')
				}
			}, 100)
		}
		
		// 确保全局对象已更新
		updateGlobalLoadingObject()
		
		// 定期更新动画统计信息（开发环境下使用）
		if (process.env.NODE_ENV !== 'production') {
			setInterval(() => {
				updateAnimationStats()
			}, 2000)
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
			avatar: '/static/image/defaultAvatar/teacher-man.png'
		});
		
		// 确保全局动画对象存在
		ensureGlobalLoadingExists()
		
		// 预加载默认动画
		preloadSingleAnimationSource('https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json');
	})
	
	// 应用显示时
	onShow(() => {
		console.log('App Show')
		// 应用显示时也尝试预加载
		if (!isLoadingPreloaded.value) {
			setTimeout(() => {
				preloadGlobalLoading().then(success => {
					if (success) {
						updateGlobalLoadingObject(true)
					}
				})
			}, 50)
		}
		
		// 更新动画统计
		updateAnimationStats()
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