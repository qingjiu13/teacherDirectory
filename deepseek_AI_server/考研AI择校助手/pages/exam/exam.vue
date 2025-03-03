<template>
	<view class="container">
		<view class="header">
			<text class="title">同考试科目查询</text>
		</view>
		
		<view class="search-box">
			<input class="search-input" 
				v-model="searchText" 
				placeholder="请输入专业或科目关键词"
				@confirm="handleSearch"
			/>
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		
		<view class="result-list" v-if="examList.length > 0">
			<view class="exam-item" v-for="(item, index) in examList" :key="index">
				<text class="major-name">{{item.major}}</text>
				<view class="subject-list">
					<text class="subject-item" v-for="(subject, sIndex) in item.subjects" :key="sIndex">
						{{subject}}
					</text>
				</view>
			</view>
		</view>
		
		<view class="empty-tip" v-else>
			<text>暂无相关数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				examList: [
					{
						major: '计算机科学与技术',
						subjects: ['数学一', '英语一', '计算机专业基础']
					},
					{
						major: '软件工程',
						subjects: ['数学一', '英语一', '计算机专业基础']
					}
				]
			}
		},
		methods: {
			handleSearch() {
				// 实现搜索逻辑
				if (!this.searchText.trim()) {
					uni.showToast({
						title: '请输入搜索关键词',
						icon: 'none'
					});
					return;
				}
				
				// 这里添加实际的搜索逻辑
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}
	
	.header {
		margin-bottom: 30rpx;
	}
	
	.title {
		font-size: 40rpx;
		font-weight: bold;
	}
	
	.search-box {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.search-input {
		flex: 1;
		height: 80rpx;
		background: #F5F5F5;
		border-radius: 40rpx;
		padding: 0 30rpx;
		margin-right: 20rpx;
	}
	
	.search-btn {
		width: 160rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #007AFF;
		color: #FFFFFF;
		border-radius: 40rpx;
	}
	
	.exam-item {
		background: #FFFFFF;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}
	
	.major-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.subject-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}
	
	.subject-item {
		font-size: 28rpx;
		color: #666;
		background: #F5F5F5;
		padding: 6rpx 20rpx;
		border-radius: 20rpx;
	}
	
	.empty-tip {
		text-align: center;
		color: #999;
		margin-top: 100rpx;
	}
</style> 