<template>
	<view class="container">
		<view class="header">
			<text class="title">AI智能择校推荐</text>
			<view class="subtitle">基于您的背景为您精选的最佳院校</view>
		</view>
		
		<view v-if="loading" class="loading-container">
			<image class="loading-image" src="/static/robot.png" mode="aspectFit"></image>
			<text class="loading-text">正在加载分析结果...</text>
		</view>
		
		<view class="analysis-result" v-else>
			<!-- 卡片滑动区域 -->
			<swiper class="recommendation-swiper" circular @change="swiperChange" :indicator-dots="false">
				<swiper-item v-for="(school, index) in displaySchools" :key="index" class="swiper-item">
					<view class="school-card">
						<view class="school-header">
							<text class="school-name">{{school.name}}</text>
							<view class="star-rating-wrapper">
								<view class="stars-outer">
									<!-- 底层灰色星星 -->
									<view class="stars-background">★★★★★</view>
									<!-- 上层金色星星，宽度根据评分动态计算 -->
									<view class="stars-foreground" :style="{width: (school.rating/5*100)+'%'}">★★★★★</view>
								</view>
								<text class="rating-number">{{formatRating(school.rating)}}</text>
							</view>
						</view>
						
						<view class="divider"></view>
						
						<view class="detail-row">
							<text class="label">推荐专业：</text>
							<text class="value highlight">{{school.recommendMajor}}</text>
						</view>
						
						<view class="detail-row">
							<text class="label">院校特点：</text>
							<text class="value">{{school.features}}</text>
						</view>
						
						<view class="detail-row">
							<text class="label">推荐理由：</text>
							<text class="value">{{school.reason}}</text>
						</view>
						
						<view class="detail-row">
							<text class="label">录取难度：</text>
							<text class="value">{{school.difficulty}}</text>
						</view>
						
						<view class="detail-row">
							<text class="label">针对性建议：</text>
							<text class="value">{{school.suggestion}}</text>
						</view>
						
						<view class="card-footer">
							<text class="page-indicator">{{currentIndex + 1}}/{{displaySchools.length}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			
			<!-- 卡片指示器 -->
			<view class="indicator-dots">
				<view 
					v-for="(_, index) in displaySchools" 
					:key="index"
					:class="['indicator-dot', currentIndex === index ? 'active' : '']"
					@click="jumpToCard(index)"
				></view>
			</view>
			
			<!-- 分析建议部分 -->
			<view class="section advice-section">
				<text class="section-title">分析建议</text>
				<view class="advice-card" v-if="analysisResult && analysisResult.analysis_result && analysisResult.analysis_result.advice">
					<view class="advice-item">
						<text class="advice-label">优势分析：</text>
						<view class="advice-content">
							<rich-text :nodes="formatAdviceContent(analysisResult.analysis_result.advice.advantages)"></rich-text>
						</view>
					</view>
					
					<view class="advice-item">
						<text class="advice-label">不足分析：</text>
						<view class="advice-content">
							<rich-text :nodes="formatAdviceContent(analysisResult.analysis_result.advice.disadvantages)"></rich-text>
						</view>
					</view>
					
					<view class="advice-item">
						<text class="advice-label">备考策略：</text>
						<view class="advice-content">
							<rich-text :nodes="formatAdviceContent(analysisResult.analysis_result.advice.strategy)"></rich-text>
						</view>
					</view>
					
					<view class="advice-item">
						<text class="advice-label">时间规划：</text>
						<view class="advice-content">
							<rich-text :nodes="formatAdviceContent(analysisResult.analysis_result.advice.timeline)"></rich-text>
						</view>
					</view>
					
					<view class="advice-item">
						<text class="advice-label">重点关注事项：</text>
						<view class="advice-content">
							<rich-text :nodes="formatAdviceContent(analysisResult.analysis_result.advice.keyPoints)"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="button-group">
			<button class="share-btn" @click="shareResult">分享结果</button>
			<button class="restart-btn" @click="restartAnalysis">重新选择</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				analysisId: '',
				currentIndex: 0,
				loading: true,
				analysisResult: null,
				displaySchools: [],
			}
		},
		onLoad(options) {
			console.log('结果页面加载，参数:', options);
			this.analysisId = options.id || '';
			this.loading = true;
			
			// 直接加载云端数据，不使用本地存储
			this.loadAnalysisResult();
		},
		methods: {
			// 格式化数字列表，使每个数字项换行
			formatNumberedList(text) {
				if (!text) return '';
				
				// 替换数字列表项
				let formattedText = text.replace(/(\d+\.\s*)([^\d\.])/g, '<p class="list-item">$1$2');
				
				// 如果没有检测到列表项，直接返回原文本
				if (formattedText === text) {
					return text;
				}
				
				// 确保所有列表项都有结束标签
				formattedText = formattedText.replace(/(<p class="list-item">.*?)(?=<p class="list-item">|$)/g, '$1</p>');
				
				return formattedText;
			},
			
			// 从云端加载数据
			async loadAnalysisResult() {
				try {
					this.loading = true;
					console.log('尝试从云端加载数据, ID:', this.analysisId);
					
					// 从云端API加载数据
					const result = await uniCloud.callFunction({
						name: 'getSchoolAnalysis',
						data: {
							action: 'get',
							id: this.analysisId
						},
						timeout: 15000
					});
					
					console.log('获取分析结果返回:', result);
					
					if (result.result && result.result.code === 0 && result.result.data) {
						// 处理API返回的数据
						const data = result.result.data;
						
						if (data.analysis_result) {
							this.analysisResult = data;
							
							if (data.analysis_result.recommendSchools && 
								data.analysis_result.recommendSchools.length > 0) {
								this.displaySchools = data.analysis_result.recommendSchools;
								console.log('成功加载AI推荐学校:', this.displaySchools.length);
							} else if (data.analysis_result.rawResponse) {
								// 如果存在原始响应但JSON解析失败
								console.log('API返回了原始响应但JSON解析失败');
								this.displaySchools = [{
									name: "API原始响应",
									features: "以下是DeepSeek API的原始返回内容",
									reason: data.analysis_result.rawResponse.substring(0, 300) + '...',
									difficulty: "解析失败: " + (data.analysis_result.parseError || "未知原因"),
									suggestion: "请尝试重新分析",
									rating: 0,
									recommendMajor: "无法解析"
								}];
							} else {
								// 没有推荐学校，显示错误
								this.showError('分析结果异常', '没有找到推荐学校信息，请尝试重新分析');
							}
						} else {
							// 缺少分析结果，显示错误
							this.showError('分析结果异常', '分析结果格式错误，请尝试重新分析');
						}
					} else {
						// API返回错误
						this.showError('获取分析结果失败', '无法获取分析结果，请尝试重新分析');
					}
				} catch (e) {
					// 捕获到异常
					this.showError('系统错误', '加载分析结果时发生错误: ' + e.message);
				} finally {
					this.loading = false;
				}
			},
			
			// 显示错误提示
			showError(title, content) {
				uni.showModal({
					title: title,
					content: content,
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
			},
			
			// 轮播图变化事件
			swiperChange(e) {
				this.currentIndex = e.detail.current;
			},
			
			// 跳转到指定卡片
			jumpToCard(index) {
				this.currentIndex = index;
			},
			
			// 重新开始分析
			restartAnalysis() {
				uni.navigateBack({
					delta: 10, // 返回到首页
					success: () => {
						uni.navigateTo({
							url: '/pages/selection/index'
						});
					}
				});
			},
			
			// 分享结果
			shareResult() {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			
			// 确保评分格式化为一位小数
			formatRating(rating) {
				const numRating = parseFloat(rating);
				return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
			},
			
			// 修复的格式化建议内容函数
			formatAdviceContent(text) {
				if (!text) return '暂无数据';
				
				// 处理编号列表，确保完整显示
				let html = '';
				
				// 按行分割处理
				const lines = text.split('\n');
				
				if (lines.length > 1) {
					// 多行文本，逐行处理
					for (const line of lines) {
						if (line.trim() === '') {
							html += '<br>';
							continue;
						}
						
						// 处理数字编号的行
						if (/^\d+\./.test(line.trim())) {
							html += `<div class="list-item">${line.trim()}</div>`;
						} else {
							html += line + '<br>';
						}
					}
				} else {
					// 单行文本，可能包含多个数字项
					const numberPattern = /(\d+\..*?)(?=\d+\.|$)/g;
					const matches = text.match(numberPattern);
					
					if (matches && matches.length > 0) {
						// 有数字编号的项目
						for (const item of matches) {
							html += `<div class="list-item">${item.trim()}</div>`;
						}
					} else {
						// 无编号，直接返回
						html = text;
					}
				}
				
				return html;
			},
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f8f8f8;
		min-height: 100vh;
	}
	
	.header {
		padding: 20rpx 0 40rpx;
		text-align: center;
	}
	
	.title {
		font-size: 42rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: #666;
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 60vh;
	}
	
	.loading-image {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 30rpx;
		animation: bounce 0.6s infinite alternate;
	}
	
	.loading-text {
		font-size: 32rpx;
		color: #666;
	}
	
	.recommendation-swiper {
		height: 700rpx;
		margin-bottom: 30rpx;
	}
	
	.swiper-item {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.school-card {
		width: 100%;
		height: 680rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
		position: relative;
		overflow: auto;
	}
	
	.school-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.school-name {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}
	
	.star-rating-wrapper {
		display: flex;
		align-items: center;
		margin-top: 5rpx;
	}
	
	.stars-outer {
		position: relative;
		display: inline-block;
		margin-right: 8rpx;
	}
	
	.stars-background {
		color: #E0E0E0;  /* 灰色 */
		font-size: 36rpx;
		letter-spacing: 2rpx;
	}
	
	.stars-foreground {
		color: #FFD700;  /* 金色 */
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		white-space: nowrap;
		font-size: 36rpx;
		letter-spacing: 2rpx;
	}
	
	.rating-number {
		font-size: 28rpx;
		color: #666;
		font-weight: bold;
		margin-left: 8rpx;
	}
	
	.divider {
		height: 1px;
		background: #EEEEEE;
		margin: 10rpx 0 20rpx;
	}
	
	.detail-row {
		margin-bottom: 28rpx;
	}
	
	.label {
		font-size: 28rpx;
		color: #666;
		margin-right: 10rpx;
	}
	
	/* 新增加粗样式的标签 */
	.advice-label {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		margin-right: 10rpx;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.value {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}
	
	/* 建议内容样式 */
	.advice-content {
		display: block;
		margin-top: 6rpx;
		padding-left: 10rpx;
	}
	
	/* 列表项样式 */
	.list-item {
		margin-bottom: 10rpx;
		display: block;
		padding-left: 10rpx;
		position: relative;
	}
	
	/* 确保列表项有足够的底部边距 */
	.advice-content .list-item:not(:last-child) {
		margin-bottom: 16rpx;
	}
	
	.highlight {
		color: #007AFF;
		font-weight: bold;
	}
	
	.card-footer {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
	}
	
	.page-indicator {
		font-size: 24rpx;
		color: #999;
		background: rgba(0,0,0,0.05);
		padding: 4rpx 12rpx;
		border-radius: 12rpx;
	}
	
	.indicator-dots {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}
	
	.indicator-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #ddd;
		margin: 0 6rpx;
		transition: all 0.3s;
	}
	
	.indicator-dot.active {
		background-color: #007AFF;
		width: 32rpx;
		border-radius: 8rpx;
	}
	
	.advice-section {
		margin-top: 40rpx;
	}
	
	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
		position: relative;
		padding-left: 20rpx;
	}
	
	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10rpx;
		height: 30rpx;
		width: 8rpx;
		background: #007AFF;
		border-radius: 4rpx;
	}
	
	.advice-card {
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
	}
	
	.button-group {
		margin-top: 60rpx;
		display: flex;
		justify-content: space-around;
	}
	
	.share-btn, .restart-btn {
		width: 45%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 30rpx;
		font-weight: bold;
	}
	
	.share-btn {
		background: linear-gradient(to right, #3fadea, #007AFF);
		color: #fff;
		box-shadow: 0 8rpx 16rpx rgba(0, 122, 255, 0.3);
	}
	
	.restart-btn {
		background: #fff;
		color: #007AFF;
		border: 1px solid #007AFF;
		box-shadow: 0 8rpx 16rpx rgba(0, 122, 255, 0.1);
	}
	
	/* 修改建议内容样式 */
	.advice-item {
		margin-bottom: 20rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px dashed #eee;
	}
	
	.advice-item:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}
	
	.advice-label {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		display: block;
		margin-bottom: 12rpx;
	}
	
	.advice-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
		padding-left: 16rpx;
	}
	
	.list-item {
		margin-bottom: 10rpx;
		display: block;
	}
</style> 