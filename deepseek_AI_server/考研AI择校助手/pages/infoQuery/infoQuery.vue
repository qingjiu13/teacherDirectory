<template>
	<view class="container">
		<view class="header">
			<text class="title">信息查询</text>
		</view>
		<view class="search-box">
			<input class="search-input" placeholder="请输入查询内容" v-model="searchText" />
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		<view class="result-list">
			<!-- 查询结果列表 -->
			<view class="result-item" v-for="(item, index) in resultList" :key="index">
				<text class="result-title">{{item.title}}</text>
				<text class="result-content">{{item.content}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				resultList: [
					{ title: '考研报名时间', content: '2023年考研报名时间为10月5日至10月25日。' },
					{ title: '考研初试时间', content: '2023年考研初试时间为12月24日至12月26日。' },
					{ title: '考研复试时间', content: '2023年考研复试时间预计在3月至4月进行。' }
				]
			}
		},
		methods: {
			/**
			 * 处理搜索操作
			 */
			handleSearch() {
				if (this.searchText.trim() === '') {
					uni.showToast({
						title: '请输入查询内容',
						icon: 'none'
					});
					return;
				}
				// 模拟搜索逻辑
				this.resultList = this.resultList.filter(item => item.title.includes(this.searchText));
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

	.search-box {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.search-input {
		flex: 1;
		height: 60rpx;
		border: 1px solid #ccc;
		border-radius: 30rpx;
		padding: 0 20rpx;
	}

	.search-btn {
		margin-left: 20rpx;
		background-color: #007aff;
		color: #fff;
		border-radius: 30rpx;
	}

	.result-list {
		margin-top: 20rpx;
	}

	.result-item {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.result-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.result-content {
		font-size: 28rpx;
		color: #666;
		margin-top: 10rpx;
	}
</style>
