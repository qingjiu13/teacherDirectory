<template>
	<view class="container">
		<view class="header">
			<text class="title">报考热度</text>
		</view>
		<view class="heat-list">
			<!-- 报考热度列表 -->
			<view class="heat-item" v-for="(item, index) in heatList" :key="index">
				<text class="heat-name">{{item.name}}</text>
				<text class="heat-desc">{{item.desc}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				heatList: [
					{ name: '北京大学', desc: '报考热度：高' },
					{ name: '清华大学', desc: '报考热度：高' },
					{ name: '复旦大学', desc: '报考热度：中' }
				]
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

	.heat-list {
		margin-top: 20rpx;
	}

	.heat-item {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.heat-name {
		font-size: 32rpx;
		font-weight: bold;
	}

	.heat-desc {
		font-size: 28rpx;
		color: #666;
	}
</style>