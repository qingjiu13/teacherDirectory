<template>
	<view class="container">
		<view class="progress-bar">
			<text class="progress-text">3/6</text>
		</view>

		<view class="question-container">
			<view class="emoji">😊</view>
			<text class="question">您的大学英语水平是？</text>
			
			<view class="options-container">
				<view 
					v-for="(option, index) in englishLevels" 
					:key="index"
					:class="['option-item', selectedEnglishLevel === option ? 'active' : '']"
					@click="selectEnglishLevel(option)"
				>
					{{option}}
				</view>
			</view>
			
			<text class="question second-question">您的本科专业排名是？</text>
			<view class="options-container">
				<view 
					v-for="(option, index) in rankingLevels" 
					:key="index"
					:class="['option-item', selectedRanking === option ? 'active' : '']"
					@click="selectRanking(option)"
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
				englishLevels: ['已过六级', '已过四级', '四级未过'],
				rankingLevels: ['前10%', '10%-40%', '40%-70%', '70%-100%'],
				selectedEnglishLevel: '',
				selectedRanking: ''
			}
		},
		methods: {
			selectEnglishLevel(level) {
				this.selectedEnglishLevel = level;
				uni.setStorageSync('step3_english', level);
			},
			selectRanking(ranking) {
				this.selectedRanking = ranking;
				uni.setStorageSync('step3_ranking', ranking);
			},
			prevPage() {
				uni.navigateBack();
			},
			nextPage() {
				if (!this.selectedEnglishLevel || !this.selectedRanking) {
					uni.showToast({
						title: '请选择完整信息',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/selection/step4'
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