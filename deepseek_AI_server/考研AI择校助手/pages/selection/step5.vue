<template>
	<view class="container">
		<view class="progress-bar">
			<text class="progress-text">5/6</text>
		</view>

		<view class="question-container">
			<view class="emoji">🎯</view>
			<text class="question">您的考研目标是？</text>
			
			<view class="options-container">
				<view 
					v-for="(option, index) in targetOptions" 
					:key="index"
					:class="['option-item', selectedTarget === option ? 'active' : '']"
					@click="selectTarget(option)"
				>
					{{option}}
				</view>
			</view>
			
			<text class="question second-question">您是否考虑研究院所？</text>
			<view class="options-container">
				<view 
					v-for="(option, index) in researchOptions" 
					:key="index"
					:class="['option-item', selectedResearch === option ? 'active' : '']"
					@click="selectResearch(option)"
				>
					{{option}}
				</view>
			</view>
		</view>

		<view class="button-group">
			<button class="prev-btn" @click="prevPage">上一步</button>
			<button class="next-btn" @click="nextPage">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				targetOptions: ['985', '211及以上', '一本及以上', '普通院校及以上'],
				researchOptions: ['考虑', '不考虑'],
				selectedTarget: '',
				selectedResearch: ''
			}
		},
		methods: {
			selectTarget(target) {
				this.selectedTarget = target;
				uni.setStorageSync('step5_target', target);
			},
			selectResearch(research) {
				this.selectedResearch = research;
				uni.setStorageSync('step5_research', research);
			},
			prevPage() {
				uni.navigateBack();
			},
			nextPage() {
				if (!this.selectedTarget || !this.selectedResearch) {
					uni.showToast({
						title: '请选择完整信息',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/selection/step6'
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}
	
	.progress-bar {
		text-align: center;
		margin-bottom: 40rpx;
	}
	
	.progress-text {
		font-size: 32rpx;
		color: #FF9853;
		background: #FFF;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
	}
	
	.question-container {
		margin-top: 40rpx;
	}
	
	.emoji {
		font-size: 48rpx;
		margin-bottom: 20rpx;
	}
	
	.question {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 40rpx;
		display: block;
	}
	
	.second-question {
		margin-top: 60rpx;
	}
	
	.options-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 30rpx;
		justify-content: center;
	}
	
	.option-item {
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #F5F5F5;
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.active {
		background: #007AFF;
		color: #FFFFFF;
	}
	
	.button-group {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.prev-btn, .next-btn {
		width: 45%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
	
	.prev-btn {
		background: #FFFFFF;
		color: #007AFF;
		border: 1rpx solid #007AFF;
	}
	
	.next-btn {
		background: #007AFF;
		color: #FFFFFF;
	}
</style> 