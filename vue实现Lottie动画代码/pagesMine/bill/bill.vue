<template>
	<view class="bill-container">		<!-- 交易记录标题 -->		<view class="transaction-title">			<text>交易记录</text>		</view>		
		<!-- 交易记录列表 -->
		<scroll-view 
			class="transaction-list" 
			scroll-y 
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="refresh"
		>
			<block v-if="transactionList.length > 0">
				<!-- 按日期分组 -->
				<view v-for="(group, date) in groupedTransactions" :key="date" class="date-group">
					<view class="date-title">{{formatGroupDate(date)}}</view>
					
					<!-- 交易项目 -->
					<view 
						v-for="(item, index) in group" 
						:key="item.id" 
						class="transaction-item"
					>
						<view class="transaction-icon" :class="item.amount > 0 ? 'income' : 'expense'">
							<text class="icon-text">{{item.amount > 0 ? '入' : '出'}}</text>
						</view>
						<view class="transaction-info">
							<view class="transaction-title">{{item.name}}</view>
							<view class="transaction-time">{{formatTime(item.date)}}</view>
						</view>
						<view class="transaction-amount" :class="item.amount > 0 ? 'income' : 'expense'">
							<text>{{item.amount > 0 ? '+' : ''}}{{item.amount.toFixed(2)}}</text>
						</view>
					</view>
				</view>
				
				<!-- 加载状态 -->
				<view class="loading-state">
					<text v-if="isLoading">加载中...</text>
					<text v-else-if="!hasMore">—— 没有更多了 ——</text>
				</view>
			</block>
			
			<!-- 空状态 -->
			<view v-else-if="!isLoading" class="empty-state">
				<view class="empty-icon">
					<image src="/static/image/empty-bill.png" mode="aspectFit"></image>
				</view>
				<text class="empty-text">暂无交易记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
// 导入模拟数据
import moneyState from '@/store/user/money/state.js';

export default {
	data() {
		return {
			refreshing: false,
			// 直接使用模拟数据
			localTransactionList: moneyState.transactionList,
			isLoading: false,
			hasMore: false
		}
	},
	computed: {
		// 使用本地数据
		transactionList() {
			return this.localTransactionList;
		},
		
		// 按日期分组的交易记录 - 显示所有记录，不再按月筛选
		groupedTransactions() {
			const grouped = {};
			
			// 直接使用所有交易记录，不再按月筛选
			if (this.transactionList && this.transactionList.length > 0) {
				this.transactionList.forEach(item => {
					const date = this.formatDate(item.date);
					if (!grouped[date]) {
						grouped[date] = [];
					}
					grouped[date].push(item);
				});
			}
			
			return grouped;
		}
	},
	onLoad() {
		// 初始化加载交易记录
		console.log('加载交易记录:', this.transactionList);
		this.fetchData();
	},
	// 下拉触底加载更多
	onReachBottom() {
		this.loadMore();
	},
	methods: {
		// 初始化加载交易数据 - 使用模拟数据，无需实际请求
		fetchData() {
			// 模拟加载中状态
			this.isLoading = true;
			
			setTimeout(() => {
				// 确保交易记录数据已正确加载
				if (!this.localTransactionList || this.localTransactionList.length === 0) {
					this.localTransactionList = moneyState.transactionList || [];
				}
				
				// 重置加载状态
				this.isLoading = false;
				// 设置是否有更多数据
				this.hasMore = moneyState.hasMore;
			}, 500);
		},
		
		// 加载更多交易数据
		loadMore() {
			// 如果没有更多数据或正在加载中，则不执行
			if (!this.hasMore || this.isLoading) return;
			
			// 模拟加载更多 - 实际应用中应该调用API
			this.isLoading = true;
			
			setTimeout(() => {
				this.isLoading = false;
				// 模拟没有更多数据
				this.hasMore = false;
			}, 500);
		},
		
		// 下拉刷新
		refresh() {
			this.refreshing = true;
			setTimeout(() => {
				// 重新获取数据
				this.fetchData();
				// 模拟刷新完成
				this.refreshing = false;
			}, 1000);
		},
		
		// 格式化日期分组标题
		formatGroupDate(dateStr) {
			const date = new Date(dateStr);
			return `${date.getMonth() + 1}月${date.getDate()}日`;
		},
		
		// 格式化日期为YYYY-MM-DD
		formatDate(timestamp) {
			const date = new Date(timestamp);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		},
		
		// 格式化时间为HH:mm
		formatTime(timestamp) {
			const date = new Date(timestamp);
			return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
		}
	}
};
</script>

<style lang="scss">
.bill-container {
	min-height: 100vh;
	background-color: #F5F7FA;
	padding: 30rpx;
	box-sizing: border-box;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
}

/* 交易记录标题 */
.transaction-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 20rpx;
	padding: 0 10rpx;
}

/* 交易记录列表 */
.transaction-list {
	height: calc(100vh - 100rpx); /* 调整高度 */
	background-color: #FFFFFF;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.date-group {
	margin-bottom: 30rpx;
}

.date-title {
	padding: 20rpx 30rpx;
	font-size: 26rpx;
	color: #999999;
	background-color: #F9FAFC;
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.transaction-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	
	&.income {
		background-color: rgba(52, 211, 153, 0.1);
	}
	
	&.expense {
		background-color: rgba(239, 68, 68, 0.1);
	}
}

.icon-text {
	font-size: 26rpx;
	font-weight: 500;
	
	.income & {
		color: #34D399;
	}
	
	.expense & {
		color: #EF4444;
	}
}

.transaction-info {
	flex: 1;
	margin-right: 20rpx;
}

.transaction-info .transaction-title {
	font-size: 30rpx;
	color: #333333;
	margin-bottom: 8rpx;
	font-weight: normal;
}

.transaction-time {
	font-size: 24rpx;
	color: #999999;
}

.transaction-amount {
	font-size: 32rpx;
	font-weight: 500;
	
	&.income {
		color: #34D399;
	}
	
	&.expense {
		color: #EF4444;
	}
}

.loading-state {
	text-align: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #999999;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
}

.empty-icon {
	margin-bottom: 30rpx;
	
	image {
		width: 200rpx;
		height: 200rpx;
	}
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}
</style>