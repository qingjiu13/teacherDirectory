<template>
	<view class="container">
		<view class="header">
			<text class="title">院校对比</text>
		</view>
		<view class="compare-list">
			<!-- 院校对比列表 -->
			<view class="compare-item" v-for="(item, index) in compareList" :key="index">
				<text class="compare-name">{{item.name}}</text>
				<text class="compare-desc">{{item.desc}}</text>
			</view>
		</view>
		<button class="compare-btn" @click="handleCompare">开始对比</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				compareList: [
					{ name: '北京大学', desc: '985/211院校' },
					{ name: '清华大学', desc: '985/211院校' },
					{ name: '复旦大学', desc: '985/211院校' }
				]
			}
		},
		methods: {
			/**
			 * 处理对比操作
			 */
			handleCompare() {
				uni.showToast({
					title: '正在为您对比院校...',
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.header {
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
	}

	.compare-list {
		margin-top: 20rpx;
	}

	.compare-item {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.compare-name {
		font-size: 32rpx;
		font-weight: bold;
	}

	.compare-desc {
		font-size: 28rpx;
		color: #666;
	}

	.compare-btn {
		margin-top: 20rpx;
		background-color: #007aff;
		color: #fff;
		border-radius: 30rpx;
	}
</style>