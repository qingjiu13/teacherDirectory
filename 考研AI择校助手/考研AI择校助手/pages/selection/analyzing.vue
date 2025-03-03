<template>
	<view class="analyzing-container">
		<view class="analysis-title">
			<text>AI 智能分析中</text>
		</view>
		
		<view class="progress-container">
			<view class="progress-bar">
				<view class="progress-filled" :style="{ width: progressPercent + '%' }"></view>
				<view class="robot-icon" :style="{ left: progressPercent + '%' }">
					<image src="/static/robot.png" mode="aspectFit"></image>
				</view>
			</view>
			<text class="progress-text">{{progressPercent}}%</text>
		</view>
		
		<view class="tips-container">
			<text class="tip-title">分析中，请稍候...</text>
			<text class="tip-content">{{currentTip}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				progressPercent: 0,
				intervalId: null,
				analysisId: '',
				tips: [
					'正在分析您的学术背景...',
					'正在匹配最适合的院校...',
					'正在评估录取可能性...',
					'正在生成个性化建议...',
					'即将完成分析，请稍等...'
				],
				currentTip: '正在分析您的学术背景...'
			}
		},
		onLoad(options) {
			this.analysisId = options.id || '';
			
			console.log('分析页面加载，ID:', this.analysisId);
			
			// 在本地存储中保存此ID，以防页面跳转时丢失
			if (this.analysisId) {
				uni.setStorageSync('current_analysis_id', this.analysisId);
			} else {
				uni.showModal({
					title: '错误',
					content: '未找到分析ID，请重新开始',
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
				return;
			}
			
			// 启动进度条动画（仅起到视觉反馈作用）
			this.startProgressAnimation();
			
			// 开始检查分析状态
			this.checkAnalysisStatus();
		},
		onUnload() {
			// 清除所有定时器
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
			if (this.statusCheckInterval) {
				clearInterval(this.statusCheckInterval);
			}
		},
		methods: {
			startProgressAnimation() {
				// 进度条初始值设为10%，给用户一些反馈
				this.progressPercent = 10;
				
				// 每5秒更换提示文字
				this.intervalId = setInterval(() => {
					const nextTipIndex = this.tips.indexOf(this.currentTip) + 1;
					this.currentTip = this.tips[nextTipIndex % this.tips.length];
				}, 5000);
			},
			checkAnalysisStatus() {
				// 每3秒检查一次分析状态
				this.statusCheckInterval = setInterval(async () => {
					try {
						console.log('检查分析状态，ID:', this.analysisId);
						
						// 真实请求API检查状态
						const result = await uniCloud.callFunction({
							name: 'getSchoolAnalysis',
							data: {
								action: 'get',
								id: this.analysisId
							},
							timeout: 15000
						});
						
						console.log('分析状态查询结果:', result);
						
						if (result.result && result.result.code === 0) {
							const data = result.result.data;
							
							if (data && data.analysis_status === 'completed') {
								// 分析完成，跳转到结果页
								console.log('分析已完成，准备展示结果');
								this.progressPercent = 100;
								clearInterval(this.intervalId);
								clearInterval(this.statusCheckInterval);
								
								setTimeout(() => {
									uni.redirectTo({
										url: './result?id=' + this.analysisId
									});
								}, 800);
							} else if (data && data.analysis_status === 'failed') {
								// 分析失败，显示错误信息
								clearInterval(this.intervalId);
								clearInterval(this.statusCheckInterval);
								uni.showModal({
									title: '分析失败',
									content: data.error_message || '很抱歉，分析过程中出现问题',
									showCancel: false,
									success: () => {
										uni.navigateBack();
									}
								});
							} else if (data && data.analysis_status === 'analyzing') {
								// 分析正在进行中，更新进度
								console.log('分析进行中...');
								if (this.progressPercent < 90) {
									// 让进度条显示分析进行中，但不要到100%
									this.progressPercent += 5;
									if (this.progressPercent > 90) this.progressPercent = 90;
								}
							} else if (data && data.analysis_status === 'pending') {
								// 等待分析开始
								console.log('等待分析开始...');
								if (this.progressPercent < 30) {
									this.progressPercent += 3;
								}
							}
						} else {
							console.error('检查状态API调用失败:', result);
							// 不自动关闭，继续尝试
						}
					} catch (e) {
						console.error('检查分析状态失败:', e);
						// 出现错误，显示给用户
						clearInterval(this.intervalId);
						clearInterval(this.statusCheckInterval);
						uni.showModal({
							title: '连接错误',
							content: '无法连接到服务器，请检查网络连接后重试',
							showCancel: false,
							success: () => {
								uni.navigateBack();
							}
						});
					}
				}, 3000); // 每3秒检查一次
			}
		}
	}
</script>

<style>
	.analyzing-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		min-height: 80vh;
	}
	
	.analysis-title {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 80rpx;
		color: #007AFF;
	}
	
	.progress-container {
		width: 100%;
		margin-bottom: 60rpx;
	}
	
	.progress-bar {
		height: 20rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
		position: relative;
		margin-bottom: 20rpx;
		overflow: visible;
	}
	
	.progress-filled {
		height: 100%;
		background: linear-gradient(to right, #3fadea, #007AFF);
		border-radius: 10rpx;
		transition: width 0.3s ease;
	}
	
	.robot-icon {
		position: absolute;
		top: -20rpx;
		transform: translateX(-50%);
		transition: left 0.3s ease;
	}
	
	.robot-icon image {
		width: 60rpx;
		height: 60rpx;
		animation: bounce 0.6s infinite alternate;
	}
	
	@keyframes bounce {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-10rpx);
		}
	}
	
	.progress-text {
		text-align: center;
		font-size: 28rpx;
		color: #007AFF;
		font-weight: bold;
	}
	
	.tips-container {
		background: #f8f8f8;
		padding: 30rpx;
		border-radius: 20rpx;
		width: 90%;
		text-align: center;
	}
	
	.tip-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.tip-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
</style> 