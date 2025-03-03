<template>
	<view class="container">
		<view class="header">
			<text class="title">专业库</text>
		</view>
		
		<view class="search-box">
			<input class="search-input" 
				v-model="searchText" 
				placeholder="请输入专业名称"
				@confirm="handleSearch"
			/>
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		
		<view class="category-list">
			<view class="category-item" 
				v-for="(category, index) in categories" 
				:key="index"
				:class="{'active': selectedCategory === category}"
				@click="selectCategory(category)"
			>
				{{category}}
			</view>
		</view>
		
		<view class="major-list">
			<view class="major-item" v-for="(major, index) in filteredMajors" :key="index">
				<text class="major-name">{{major.name}}</text>
				<text class="major-code">专业代码：{{major.code}}</text>
				<text class="major-desc">{{major.description}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				selectedCategory: '全部',
				categories: ['全部', '理学', '工学', '经济学', '管理学', '文学'],
				majors: [
					{
						name: '计算机科学与技术',
						code: '081200',
						category: '工学',
						description: '计算机科学与技术是一门研究计算机系统结构、软件理论与技术等的学科。'
					},
					{
						name: '软件工程',
						code: '083500',
						category: '工学',
						description: '软件工程是一门研究用工程化方法构建和维护有效的、实用的和高质量的软件的学科。'
					}
				]
			}
		},
		computed: {
			filteredMajors() {
				return this.majors.filter(major => {
					const categoryMatch = this.selectedCategory === '全部' || major.category === this.selectedCategory;
					const searchMatch = !this.searchText || 
						major.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
						major.code.includes(this.searchText);
					return categoryMatch && searchMatch;
				});
			}
		},
		methods: {
			selectCategory(category) {
				this.selectedCategory = category;
			},
			handleSearch() {
				// 搜索功能已通过计算属性实现
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
	
	.category-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}
	
	.category-item {
		padding: 10rpx 30rpx;
		background: #F5F5F5;
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.category-item.active {
		background: #007AFF;
		color: #FFFFFF;
	}
	
	.major-item {
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
	
	.major-code {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.major-desc {
		font-size: 28rpx;
		color: #999;
		display: block;
	}
</style> 