<template>
	<view class="container">
		<view class="header">
			<text class="title">AI智能择校</text>
		</view>
		
		<view class="content">
			<view class="intro-section">
				<text class="intro-text">欢迎使用AI智能择校系统</text>
				<text class="desc-text">基于深度学习模型，为您提供个性化的择校建议</text>
			</view>
			
			<button class="start-btn" @click="startAnalysis">开始智能分析</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			startAnalysis() {
				uni.navigateTo({
					url: '/pages/selection/selection'
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}
	
	.header {
		text-align: center;
		margin-bottom: 60rpx;
	}
	
	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.intro-section {
		text-align: center;
		margin-bottom: 80rpx;
	}
	
	.intro-text {
		font-size: 36rpx;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.desc-text {
		font-size: 28rpx;
		color: #666;
		display: block;
	}
	
	.start-btn {
		width: 80%;
		height: 90rpx;
		line-height: 90rpx;
		background: #007AFF;
		color: #FFFFFF;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
</style> 