<template>
	<view class="container">
		<view class="progress-bar">
			<text class="progress-text">1/6</text>
		</view>

		<view class="question-container">
			<view class="emoji">😍</view>
			<text class="question">您目前的身份是？</text>
			
			<view class="options-container">
				<view 
					v-for="(option, index) in identityOptions" 
					:key="index"
					:class="['option-item', selectedIdentity === option ? 'active' : '']"
					@click="selectIdentity(option)"
				>
					{{option}}
				</view>
			</view>
		</view>

		<view class="button-group">
			<button class="next-btn" @click="nextPage">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentStep: 1,
				identityOptions: ['大一', '大二', '大三', '大四', '在职'],
				selectedIdentity: '',
				formData: {
					identity: '',
					university: '',
					major: '',
					englishLevel: '',
					ranking: '',
					targetSchool: '',
					studyMode: '',
					targetArea: []
				}
			}
		},
		methods: {
			selectIdentity(option) {
				this.selectedIdentity = option;
				// 保存到本地存储
				uni.setStorageSync('step1_data', option);
			},
			nextPage() {
				if (!this.selectedIdentity) {
					uni.showToast({
						title: '请选择您的身份',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/selection/step2'
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
	
	.options-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20rpx;
		margin-top: 40rpx;
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
		color: #FFF;
	}
	
	.button-group {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		padding: 0 30rpx;
	}
	
	.next-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background: #007AFF;
		color: #FFF;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
</style>