<template>
	<view class="container">
		<view class="header">
			<text class="title">院校库</text>
		</view>
		<view class="search-box">
			<input class="search-input" placeholder="请输入院校名称" v-model="searchText" />
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		<view class="institution-list">
			<!-- 院校列表 -->
			<view class="institution-item" v-for="(item, index) in institutionList" :key="index">
				<text class="institution-name">{{item.name}}</text>
				<text class="institution-desc">{{item.desc}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				institutionList: [
					{ name: '北京大学', desc: '985/211院校' },
					{ name: '清华大学', desc: '985/211院校' },
					{ name: '复旦大学', desc: '985/211院校' }
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
						title: '请输入院校名称',
						icon: 'none'
					});
					return;
				}
				// 模拟搜索逻辑
				this.institutionList = this.institutionList.filter(item => item.name.includes(this.searchText));
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

	.institution-list {
		margin-top: 20rpx;
	}

	.institution-item {
		padding: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.institution-name {
		font-size: 32rpx;
		font-weight: bold;
	}

	.institution-desc {
		font-size: 28rpx;
		color: #666;
	}
</style>