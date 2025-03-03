<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<button class="start-btn" @click="goToSelection">考研AI择校助手</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '考研AI择校助手'
			}
		},
		onLoad() {

		},
		methods: {
			/**
			 * 跳转到选择页面
			 */
			goToSelection() {
				uni.navigateTo({
					url: '/pages/selection/selection'
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.start-btn {
		margin-top: 50rpx;
		width: 300rpx;
		background-color: #007aff;
		color: #ffffff;
		border-radius: 50rpx;
	}
</style>
