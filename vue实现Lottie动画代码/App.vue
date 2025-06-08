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

<script>
import { ref, provide, nextTick, reactive, watchEffect } from 'vue'
import GlobalLoading from '@/components/loading/GlobalLoading.vue'
import { useGlobalAnimationState, preloadAnimations } from '@/components/loading/useAnimationCache.js'
import store from './store/index.js';
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

export default {
	components: {
		GlobalLoading
	},
	
	data() {
		return {
			firstBackTime: 0,
			// 用 uni 全局变量控制 loading 状态
			loadingRef: null,
			
			// 提供全局loading状态控制
			isLoading: false,
			isLoadingPreloaded: false,
			
			/**
			 * 预定义的动画源列表，用于预加载
			 * @type {Array<string>}
			 */
			predefinedAnimations: [
				'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
				// 可以在这里添加其他需要预加载的动画
			],
			
			// 全局动画状态对象
			globalState: null,
			getGlobalStats: null,
			isAllAnimationsLoaded: null,
			getAnimationFromCache: null,
			preloadSingleAnimation: null,
			
			/**
			 * 动画加载状态
			 * 可被其他组件监听的状态对象
			 */
			animationStatus: {
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
			}
		}
	},
	
	provide() {
		return {
			globalLoading: {
				isLoading: ref(this.isLoading),
				isPreloaded: ref(this.isLoadingPreloaded),
				preload: this.preloadGlobalLoading,
				preloadSingle: this.preloadSingleAnimationSource,
				preloadBatch: this.startBatchPreload,
				show: this.showGlobalLoading,
				hide: this.hideGlobalLoading,
				getStatus: this.getAnimationStatus,
				getFromCache: this.getAnimationFromCache,
				globalState: this.globalState
			}
		}
	},
	
	beforeMount() {
		console.log('App 即将挂载，尝试预加载加载动画')
		
		// 再次确保全局对象存在
		this.ensureGlobalLoadingExists()
		
		// 尝试预加载默认动画
		this.preloadSingleAnimationSource('https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json')
			.then(() => {
				this.isLoadingPreloaded = true
			})
	},
	
	mounted() {
		const app = getApp()
		app.globalData = app.globalData || {}
		
		// 确保组件引用已经存在
		if (this.loadingRef) {
			console.log('加载组件引用已就绪')
			// 立即尝试预加载并更新全局对象
			this.preloadGlobalLoading().then(success => {
				if (success) {
					this.updateGlobalLoadingObject(true)
				}
			})
		} else {
			console.warn('加载组件引用尚未就绪，下一个时钟周期中检查')
			// 给DOM留出时间渲染
			setTimeout(async () => {
				if (this.loadingRef) {
					console.log('加载组件引用现在已就绪')
					const success = await this.preloadGlobalLoading()
					if (success) {
						this.updateGlobalLoadingObject(true)
					}
				} else {
					console.error('加载组件引用仍未就绪')
				}
			}, 100)
		}
		
		// 确保全局对象已更新
		this.updateGlobalLoadingObject()
		
		// 定期更新动画统计信息（开发环境下使用）
		if (process.env.NODE_ENV !== 'production') {
			setInterval(() => {
				this.updateAnimationStats()
			}, 2000)
		}
		
		// 监听组件引用变化
		watchEffect(() => {
			if (this.loadingRef) {
				console.log('检测到loadingRef已就绪，更新全局对象')
				this.animationStatus.isComponentMounted = true
				this.updateGlobalLoadingObject(true)
			}
		})
	},
	
	methods: {
		/**
		 * 处理LoadingOverlay组件挂载事件
		 */
		handleLoadingMounted() {
			console.log('GlobalLoading组件已挂载，更新全局控制')
			this.animationStatus.isComponentMounted = true
			
			// 立即更新全局$loading对象
			this.updateGlobalLoadingObject(true)
			
			// 尝试预加载预定义的动画
			this.startBatchPreload()
			
			// 处理所有待处理的调用
			const app = getApp();
			if (app?.globalData?._pendingLoadingCalls?.length > 0) {
				console.log(`处理${app.globalData._pendingLoadingCalls.length}个待处理的loading调用`);
				const pendingCalls = [...app.globalData._pendingLoadingCalls];
				app.globalData._pendingLoadingCalls = [];
				
				pendingCalls.forEach(call => {
					try {
						if (call.method === 'show') this.showGlobalLoading();
						else if (call.method === 'hide') this.hideGlobalLoading();
						else if (call.method === 'preload') this.preloadGlobalLoading();
					} catch (e) {
						console.error('执行待处理调用失败:', e);
					}
				});
			}
		},
		
		/**
		 * 处理加载错误
		 * @param {Object} error - 错误信息
		 */
		handleLoadingError(error) {
			console.error('加载动画出错:', error)
		},
		
		/**
		 * 处理加载超时
		 * @param {string} src - 超时的动画源
		 */
		handleLoadingTimeout(src) {
			console.warn('加载动画超时:', src)
		},
		
		/**
		 * 开始批量预加载动画
		 */
		startBatchPreload() {
			if (this.predefinedAnimations.length === 0) return
			
			this.animationStatus.batchPreloadStatus.inProgress = true
			this.animationStatus.batchPreloadStatus.completed = 0
			this.animationStatus.batchPreloadStatus.total = this.predefinedAnimations.length
			this.animationStatus.batchPreloadStatus.progress = 0
			
			// 批量预加载
			preloadAnimations(this.predefinedAnimations, (progress) => {
				// 更新预加载进度
				this.animationStatus.batchPreloadStatus.completed = progress.completed
				this.animationStatus.batchPreloadStatus.progress = progress.progress
				
				console.log(`预加载进度: ${progress.progress.toFixed(2)}% (${progress.completed}/${progress.total})`)
			}).then((result) => {
				console.log(`预加载完成: 成功${result.totalSuccess}个, 失败${result.totalFailed}个`)
				this.animationStatus.batchPreloadStatus.inProgress = false
				
				// 更新统计信息
				this.updateAnimationStats()
			}).catch(error => {
				console.error('批量预加载出错:', error)
				this.animationStatus.batchPreloadStatus.inProgress = false
			})
		},
		
		/**
		 * 确保全局$loading对象存在
		 * 在页面加载前尽早初始化
		 */
		ensureGlobalLoadingExists() {
			try {
				// 确保全局app存在
				if (typeof getApp === 'function') {
					const app = getApp()
					if (app) {
						app.globalData = app.globalData || {}
						app.globalData._pendingLoadingCalls = app.globalData._pendingLoadingCalls || []
						
						// 如果loadingRef已经存在，使用真实的方法
						if (this.loadingRef) {
							app.globalData.$loading = {
								show: this.showGlobalLoading,
								hide: this.hideGlobalLoading,
								preload: this.preloadGlobalLoading,
								preloadBatch: this.startBatchPreload,
								isPreloaded: this.isLoadingPreloaded,
								getStatus: this.getAnimationStatus,
								getFromCache: this.getAnimationFromCache,
								globalState: this.globalState,
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
								if (this.loadingRef) {
									this.loadingRef.show()
									return true
								} else {
									app.globalData._pendingLoadingCalls.push({ 
										method: 'show', 
										time: Date.now() 
									})
									
									setTimeout(() => {
										if (this.loadingRef) {
											this.loadingRef.show()
											return true
										}
									}, 200)
									return false
								}
							}
							
							const tempHide = () => {
								console.log('Loading组件尚未挂载，hide方法延迟执行')
								if (this.loadingRef) {
									this.loadingRef.hide()
									return true
								} else {
									app.globalData._pendingLoadingCalls.push({ 
										method: 'hide', 
										time: Date.now() 
									})
									
									setTimeout(() => {
										if (this.loadingRef) {
											this.loadingRef.hide()
											return true
										}
									}, 200)
									return false
								}
							}
							
							const tempPreload = async () => {
								console.log('Loading组件尚未挂载，preload方法延迟执行')
								if (this.loadingRef) {
									return await this.loadingRef.preload()
								} else {
									app.globalData._pendingLoadingCalls.push({ 
										method: 'preload', 
										time: Date.now() 
									})
									
									return new Promise((resolve) => {
										setTimeout(async () => {
											if (this.loadingRef) {
												const result = await this.loadingRef.preload()
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
								preloadBatch: this.startBatchPreload,
								isPreloaded: this.isLoadingPreloaded,
								getStatus: this.getAnimationStatus,
								getFromCache: this.getAnimationFromCache,
								globalState: this.globalState,
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
		},
		
		/**
		 * 预加载单个动画
		 * @param {string} src - 动画资源地址
		 * @returns {Promise<boolean>} 预加载结果
		 */
		async preloadSingleAnimationSource(src) {
			try {
				await this.preloadSingleAnimation(src)
				console.log(`预加载动画成功: ${src}`)
				
				// 更新统计信息
				this.updateAnimationStats()
				
				return true
			} catch (error) {
				console.error(`预加载动画失败: ${src}`, error)
				return false
			}
		},
		
		/**
		 * 预加载全局加载动画
		 * @returns {Promise<boolean>} 预加载结果
		 */
		async preloadGlobalLoading() {
			// 再次确保全局对象存在
			this.ensureGlobalLoadingExists()
			
			if (!this.loadingRef) {
				console.warn('加载组件引用未就绪，尝试从全局获取')
				
				// 如果当前动画已经在缓存中，直接标记为预加载成功
				const defaultSrc = 'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
				if (this.getAnimationFromCache(defaultSrc)) {
					this.isLoadingPreloaded = true
					console.log('默认动画已在缓存中，标记为预加载成功')
					return true
				}
				
				// 尝试直接使用全局函数预加载
				return await this.preloadSingleAnimationSource(defaultSrc)
			}
			
			try {
				if (typeof this.loadingRef.preload === 'function') {
					await this.loadingRef.preload()
					this.isLoadingPreloaded = true
					console.log('全局加载动画预加载成功')
					
					// 更新统计信息
					this.updateAnimationStats()
					
					// 更新全局$loading对象
					this.updateGlobalLoadingObject()
					
					return true
				}
			} catch (err) {
				console.error('全局加载动画预加载失败:', err)
			}
			
			return false
		},
		
		/**
		 * 更新全局$loading对象
		 * 确保它包含最新的方法引用
		 * @param {Boolean} force - 是否强制更新
		 */
		updateGlobalLoadingObject(force = false) {
			try {
				const app = getApp()
				if (app && app.globalData) {
					// 只有当loadingRef存在或force为true时才更新
					if (this.loadingRef || force) {
						// 更新全局对象，但保留原始方法
						const oldLoading = app.globalData.$loading || {}
						
						app.globalData.$loading = {
							show: this.showGlobalLoading,
							hide: this.hideGlobalLoading,
							preload: this.preloadGlobalLoading,
							preloadBatch: this.startBatchPreload,
							preloadSingle: this.preloadSingleAnimationSource,
							isPreloaded: this.isLoadingPreloaded,
							getStatus: this.getAnimationStatus,
							getFromCache: this.getAnimationFromCache,
							globalState: this.globalState,
							isReady: true,
							componentMounted: Boolean(this.loadingRef),
							
							// 保留一些原始属性，如果存在的话
							...oldLoading.extraData
						}
						
						console.log('已更新全局$loading对象，组件已挂载:', Boolean(this.loadingRef))
						
						// 如果之前有待处理的调用，现在可以执行
						if (app.globalData._pendingLoadingCalls?.length > 0) {
							const pendingCalls = [...app.globalData._pendingLoadingCalls];
							app.globalData._pendingLoadingCalls = [];
							
							console.log(`处理${pendingCalls.length}个待处理的loading调用`);
							pendingCalls.forEach(call => {
								try {
									if (call.method === 'show') this.showGlobalLoading();
									else if (call.method === 'hide') this.hideGlobalLoading();
									else if (call.method === 'preload') this.preloadGlobalLoading();
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
		},
		
		/**
		 * 更新动画统计信息
		 */
		updateAnimationStats() {
			if (this.loadingRef && this.loadingRef.getAnimationStats) {
				this.animationStatus.stats = this.loadingRef.getAnimationStats()
			} else {
				this.animationStatus.stats = this.getGlobalStats()
			}
			
			this.animationStatus.allLoaded = this.isAllAnimationsLoaded()
			this.animationStatus.lastUpdated = Date.now()
		},
		
		/**
		 * 获取当前动画加载状态
		 * @returns {Object} 动画加载状态
		 */
		getAnimationStatus() {
			this.updateAnimationStats()
			return this.animationStatus
		},
		
		/**
		 * 显示全局加载动画
		 * @returns {boolean} 是否成功显示
		 */
		showGlobalLoading() {
			this.isLoading = true
			if (this.loadingRef) {
				this.loadingRef.show()
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
					if (this.loadingRef) {
						this.loadingRef.show()
						return true
					}
				})
				return false
			}
		},
		
		/**
		 * 隐藏全局加载动画
		 * @returns {boolean} 是否成功隐藏
		 */
		hideGlobalLoading() {
			this.isLoading = false
			if (this.loadingRef) {
				this.loadingRef.hide()
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
					if (this.loadingRef) {
						this.loadingRef.hide()
						return true
					}
				})
				return false
			}
		},
		
		/**
		 * 安卓返回键处理
		 */
		handleLastPageBackPress() {
			console.log('App LastPageBackPress')
			if (this.firstBackTime == 0) {
				uni.showToast({
					title: '再按一次退出应用',
					position: 'bottom',
				})
				this.firstBackTime = Date.now()
				setTimeout(() => {
					this.firstBackTime = 0
				}, 2000)
			} else if (Date.now() - this.firstBackTime < 2000) {
				this.firstBackTime = Date.now()
				uni.exit()
			}
		},
		
		/**
		 * 应用退出时
		 */
		handleExit() {
			console.log('App Exit')
		}
	},
	
	created() {
		// 获取全局动画状态
		const { 
			globalState, 
			getGlobalStats, 
			isAllAnimationsLoaded,
			getAnimationFromCache,
			preloadAnimation: preloadSingleAnimation
		} = useGlobalAnimationState()
		
		// 保存全局动画状态到组件实例
		this.globalState = globalState
		this.getGlobalStats = getGlobalStats
		this.isAllAnimationsLoaded = isAllAnimationsLoaded
		this.getAnimationFromCache = getAnimationFromCache
		this.preloadSingleAnimation = preloadSingleAnimation
		
		// 立即尝试初始化全局对象
		this.ensureGlobalLoadingExists()
	},
	
	// uni-app 生命周期
	onLaunch() {
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
		this.ensureGlobalLoadingExists()
		
		// 预加载默认动画
		this.preloadSingleAnimationSource('https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json');
		
		// 将处理函数挂载到全局
		if (uni) {
			// #ifdef APP-ANDROID
			uni.$onLastPageBackPress = this.handleLastPageBackPress
			// #endif
			uni.$onExit = this.handleExit
		}
	},
	
	onShow() {
		console.log('App Show')
		// 应用显示时也尝试预加载
		if (!this.isLoadingPreloaded) {
			setTimeout(() => {
				this.preloadGlobalLoading().then(success => {
					if (success) {
						this.updateGlobalLoadingObject(true)
					}
				})
			}, 50)
		}
		
		// 更新动画统计
		this.updateAnimationStats()
	},
	
	onHide() {
		console.log('App Hide')
	}
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