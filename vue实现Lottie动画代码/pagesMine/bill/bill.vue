<template>
	<view class="bill-container">
		<!-- 顶部导航栏 -->
		<Header :title="'账单'" @back="goBack" />
		
		<!-- 顶部日期筛选 -->
		<view class="date-filter-container">
			<view class="date-selector" @click="openDateSelector">
				<text class="current-month-text">{{currentMonth}}</text>
				<text class="dropdown-icon">▼</text>
			</view>
			
			<view class="filter-actions">
				<view 
					v-for="(filter, index) in filters" 
					:key="index" 
					class="filter-action-item" 
					:class="{ active: currentFilter === filter.value }"
					@click="setFilter(filter.value)"
				>
					<text>{{ filter.label }}</text>
				</view>
				<view class="statistics-btn" @click="showTimeIndexPanel = true">
					<text>统计</text>
				</view>
			</view>
		</view>
		
		<!-- 收支统计 -->
		<view class="income-expense-overview">
			<view class="overview-item">
				<text class="overview-label">支出</text>
				<text class="overview-amount expense">¥{{ totalExpense }}</text>
			</view>
			<view class="overview-item">
				<text class="overview-label">收入</text>
				<text class="overview-amount income">¥{{ totalIncome }}</text>
			</view>
		</view>
		
		<!-- 交易记录列表 -->
		<scroll-view 
			class="transaction-list" 
			scroll-y 
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="refresh"
		>
			<block v-if="filteredTransactions.length > 0">
				<!-- 交易项目 -->
				<view 
					v-for="(item, index) in filteredTransactions" 
					:key="item.id" 
					class="transaction-item"
					@click="showTransactionDetail(item)"
				>
					<view class="merchant-icon">
						<image :src="getTransactionIcon(item)" class="category-icon"></image>
					</view>
					<view class="transaction-info">
						<view class="transaction-title">{{item.name}}</view>
						<view class="transaction-time">{{formatDate(item.date)}} {{formatTime(item.date)}}</view>
					</view>
					<view class="transaction-amount" :class="item.amount > 0 ? 'income' : 'expense'">
						{{item.amount > 0 ? '+' : ''}}{{item.amount.toFixed(2)}}
					</view>
				</view>
				
				<!-- 加载状态 -->
				<view class="loading-state">
					<text v-if="isLoading">加载中...</text>
					<text v-else-if="!hasMore">—— 没有更多记录了 ——</text>
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
		
		<!-- 日期选择器 -->
		<uni-datetime-picker
			v-if="showDatePicker"
			:type="'date'"
			:value="currentDate"
			@confirm="onDateConfirm"
			@close="showDatePicker = false"
			return-type="timestamp"
			mode="date"
		/>
		
		<!-- 时间索引面板 -->
		<view class="overlay-mask" v-if="showTimeIndexPanel" @click="showTimeIndexPanel = false"></view>
		<view class="time-index-panel" v-if="showTimeIndexPanel">
			<view class="panel-header">
				<text class="panel-title">时间索引</text>
				<text class="panel-close" @click="showTimeIndexPanel = false">×</text>
			</view>
			<view class="index-content">
				<view class="year-list">
					<view 
						v-for="year in availableYears" 
						:key="year" 
						class="year-item"
						:class="{'active': currentYearIndex === year}"
						@click="selectYear(year)"
					>
						<text>{{ year }}年</text>
					</view>
				</view>
				<view class="month-list">
					<view 
						v-for="month in 12" 
						:key="month" 
						class="month-index-item"
						:class="{'active': isMonthActive(month)}"
						@click="selectMonthByIndex(month)"
					>
						<text>{{ month }}月</text>
					</view>
				</view>
			</view>
			<view class="panel-footer">
				<text @click="selectRecentMonths(3)">近3个月</text>
				<text @click="selectRecentMonths(6)">近6个月</text>
				<text @click="selectRecentMonths(12)">近12个月</text>
				<text @click="selectCurrentYear()">本年</text>
			</view>
		</view>
		
		<!-- 月份选择弹窗 -->
		<view class="overlay-mask" v-if="showMonthPicker" @click="showMonthPicker = false"></view>
		<view class="month-picker" v-if="showMonthPicker">
			<view class="panel-header">
				<text class="panel-title">请选择月份</text>
				<text class="panel-close" @click="showMonthPicker = false">×</text>
			</view>
			<view class="month-grid">
				<view 
					v-for="(month, index) in availableMonths" 
					:key="index" 
					class="month-item"
					:class="{ active: month === currentMonth }"
					@click="selectMonth(month)"
				>
					<text>{{ month }}</text>
				</view>
			</view>
		</view>
		
		<!-- 交易详情弹窗 -->
		<view class="overlay-mask" v-if="showDetail" @click="showDetail = false"></view>
		<view class="transaction-detail" v-if="showDetail && selectedTransaction">
			<view class="panel-header">
				<text class="panel-title">交易详情</text>
				<text class="panel-close" @click="showDetail = false">×</text>
			</view>
			<view class="detail-content">
				<view class="detail-header" :class="selectedTransaction.amount > 0 ? 'income-bg' : 'expense-bg'">
					<text class="detail-amount">{{ selectedTransaction.amount > 0 ? '+' : '' }}{{ selectedTransaction.amount.toFixed(2) }}</text>
					<text class="detail-type">{{ selectedTransaction.amount > 0 ? '收入' : '支出' }}</text>
				</view>
				
				<view class="detail-list">
					<view class="detail-item">
						<text class="detail-label">交易名称</text>
						<text class="detail-value">{{ selectedTransaction.name }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">交易时间</text>
						<text class="detail-value">{{ formatDetailDate(selectedTransaction.date) }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">交易渠道</text>
						<text class="detail-value">{{ selectedTransaction.channel || '中国银行APP' }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">交易单号</text>
						<text class="detail-value">{{ selectedTransaction.id }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">交易状态</text>
						<text class="detail-value success">已完成</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Header from '@/components/navigationTitleBar/header.vue';
import { Navigator } from '@/router/Router.js';
// 导入日期选择器组件
import uniDatetimePicker from '@/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue';
// 导入模拟数据
import moneyState from '@/store/user/money/state.js';

export default {
	components: { 
		Header,
		uniDatetimePicker
	},
	data() {
		return {
			refreshing: false,
			// 直接使用模拟数据
			localTransactionList: moneyState.transactionList,
			isLoading: false,
			hasMore: false,
			
			// 新增日期选择器控制
			showDatePicker: false,
			currentDate: Date.now(),
			
			// 账单数据
			currentMonth: this.getCurrentMonthLabel(), // 当前选择的月份
			showMonthPicker: false, // 是否显示月份选择器
			availableMonths: [], // 可选择的月份列表
			currentFilter: 'all', // 当前筛选类型
			filters: [
				{ label: '全部', value: 'all' },
				{ label: '收入', value: 'income' },
				{ label: '支出', value: 'expense' }
			],
			showDetail: false, // 是否显示交易详情
			selectedTransaction: null, // 当前选中的交易
			
			// 时间索引相关数据
			showTimeIndexPanel: false, // 是否显示时间索引面板
			availableYears: [2021, 2022, 2023, 2024, 2025], // 可选年份
			currentYearIndex: new Date().getFullYear(), // 当前选中的年份
			quickSelectType: '', // 快速选择类型
			
			// 交易类别图标映射
			categoryIcons: {
				income: {
					default: '/static/image/bill/income.png',
					course: '/static/image/bill/course.png',
					salary: '/static/image/bill/income.png',
					refund: '/static/image/bill/income.png',
					interest: '/static/image/bill/income.png'
				},
				expense: {
					default: '/static/image/bill/expense.png',
					withdraw: '/static/image/bill/withdraw.png',
					transfer: '/static/image/bill/expense.png',
					shopping: '/static/image/bill/expense.png',
					dining: '/static/image/bill/expense.png'
				}
			}
		};
	},
	computed: {
		// 使用本地数据
		transactionList() {
			return this.localTransactionList;
		},
		
		// 按筛选条件过滤的交易记录
		filteredTransactions() {
			if (!this.transactionList || this.transactionList.length === 0) {
				return [];
			}
			
			// 先按月份筛选
			const selectedMonth = this.parseMonthLabel(this.currentMonth);
			let monthFiltered = this.transactionList.filter(item => {
				const date = new Date(item.date);
				return date.getFullYear() === selectedMonth.year && date.getMonth() + 1 === selectedMonth.month;
			});
			
			// 再按类型筛选
			if (this.currentFilter === 'income') {
				monthFiltered = monthFiltered.filter(item => item.amount > 0);
			} else if (this.currentFilter === 'expense') {
				monthFiltered = monthFiltered.filter(item => item.amount < 0);
			}
			
			// 按时间排序（从新到旧）
			return monthFiltered.sort((a, b) => b.date - a.date);
		},
		
		// 总收入
		totalIncome() {
			return this.filteredTransactions
				.filter(item => item.amount > 0)
				.reduce((sum, item) => sum + item.amount, 0)
				.toFixed(2);
		},
		
		// 总支出
		totalExpense() {
			return this.filteredTransactions
				.filter(item => item.amount < 0)
				.reduce((sum, item) => sum + Math.abs(item.amount), 0)
				.toFixed(2);
		}
	},
	onLoad() {
		// 初始化月份列表
		this.generateAvailableMonths();
		// 初始化加载交易记录
		console.log('加载交易记录:', this.transactionList);
		this.fetchData();
	},
	// 下拉触底加载更多
	onReachBottom() {
		this.loadMore();
	},
	methods: {
		// 返回上一页
		goBack() {
			try {
				Navigator.toMine();
			} catch (error) {
				console.error('导航错误:', error);
				// 回退到原始导航方法
				uni.navigateBack({
					delta: 1
				});
			}
		},
		
		// 打开日期选择器
		openDateSelector() {
			// 优先使用月份选择器
			this.showMonthPicker = true;
			
			// 如果需要使用日期选择器，则使用下面的代码
			// const dateStr = this.parseMonthLabel(this.currentMonth);
			// const date = new Date(dateStr.year, dateStr.month - 1, 1);
			// this.currentDate = date.getTime();
			// this.showDatePicker = true;
		},
		
		// 初始化加载交易数据 - 使用模拟数据，无需实际请求
		fetchData() {
			// 模拟加载中状态
			this.isLoading = true;
			
			setTimeout(() => {
				// 确保交易记录数据已正确加载
				if (!this.localTransactionList || this.localTransactionList.length === 0) {
					this.localTransactionList = moneyState.transactionList || [];
				}
				
				// 扩充模拟数据
				if (this.localTransactionList.length < 10) {
					this.expandMockData();
				}
				
				// 重置加载状态
				this.isLoading = false;
				// 设置是否有更多数据
				this.hasMore = this.localTransactionList.length > 10;
			}, 500);
		},
		
		// 扩充模拟数据
		expandMockData() {
			// 添加更多模拟数据，微信支付风格的交易记录
			const newTransactions = [
				{
					id: 'tx003',
					name: '同济超市',
					date: 1743120000000, // 2025-03-28 08:00:00
					amount: -5.70,
					channel: '微信支付'
				},
				{
					id: 'tx004',
					name: '全家',
					date: 1742860800000, // 2025-03-25 08:00:00
					amount: -15.80,
					channel: '微信支付'
				},
				{
					id: 'tx005',
					name: '扫二维码付款-给曹殷杰',
					date: 1742774400000, // 2025-03-24 08:00:00
					amount: -6.00,
					channel: '微信支付'
				},
				{
					id: 'tx006',
					name: '微信红包-来自妈',
					date: 1742515200000, // 2025-03-21 08:00:00
					amount: 100.00,
					channel: '微信红包'
				},
				{
					id: 'tx007',
					name: 'luckin coffee',
					date: 1742256000000, // 2025-03-18 08:00:00
					amount: -14.35,
					channel: '微信支付'
				},
				{
					id: 'tx008',
					name: '同济大学',
					date: 1742083200000, // 2025-03-16 08:00:00
					amount: -30.00,
					channel: '微信支付'
				},
				{
					id: 'tx009',
					name: '嘉众越',
					date: 1741824000000, // 2025-03-13 08:00:00
					amount: -19.90,
					channel: '微信支付'
				},
				{
					id: 'tx010',
					name: '上海独美科技有限公司',
					date: 1741305600000, // 2025-03-07 08:00:00
					amount: -14.90,
					channel: '微信支付'
				},
				{
					id: 'tx011',
					name: '好利来',
					date: 1741132800000, // 2025-03-05 08:00:00
					amount: -35.50,
					channel: '微信支付'
				},
				{
					id: 'tx012',
					name: '中石化加油站',
					date: 1741046400000, // 2025-03-04 08:00:00
					amount: -208.56,
					channel: '微信支付'
				},
				{
					id: 'tx013',
					name: '春风十里',
					date: 1740873600000, // 2025-03-02 08:00:00
					amount: -158.00,
					channel: '微信支付'
				},
				{
					id: 'tx014',
					name: '美团外卖',
					date: 1740787200000, // 2025-03-01 08:00:00
					amount: -25.80,
					channel: '微信支付'
				},
				// 2月份数据
				{
					id: 'tx015',
					name: '工资',
					date: 1740096000000, // 2025-02-22 08:00:00
					amount: 6000.00,
					channel: '微信支付'
				},
				{
					id: 'tx016',
					name: '淘宝退款',
					date: 1739836800000, // 2025-02-19 08:00:00
					amount: 86.50,
					channel: '支付宝'
				},
				{
					id: 'tx017',
					name: '沃尔玛',
					date: 1739750400000, // 2025-02-18 08:00:00
					amount: -235.60,
					channel: '微信支付'
				},
				{
					id: 'tx018',
					name: '水费',
					date: 1739491200000, // 2025-02-15 08:00:00
					amount: -78.25,
					channel: '微信支付'
				}
			];
			
			this.localTransactionList = [...newTransactions];
			
			// 按日期排序，新的在前
			this.localTransactionList.sort((a, b) => b.date - a.date);
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
		
		// 日期确认选择
		onDateConfirm(e) {
			const date = new Date(e);
			this.currentMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
			this.showDatePicker = false;
		},
		
		// 格式化日期为MM月DD日
		formatGroupDate(dateStr) {
			const date = new Date(dateStr);
			return `${date.getMonth() + 1}月${date.getDate()}日`;
		},
		
		// 格式化日期为YYYY-MM-DD
		formatDate(timestamp) {
			const date = new Date(timestamp);
			const now = new Date();
			const yesterday = new Date(now);
			yesterday.setDate(now.getDate() - 1);
			
			// 如果是今天，显示"今天"
			if (date.toDateString() === now.toDateString()) {
				return "今天";
			}
			
			// 如果是昨天，显示"昨天"
			if (date.toDateString() === yesterday.toDateString()) {
				return "昨天";
			}
			
			// 否则显示月日
			return `${date.getMonth() + 1}月${date.getDate()}日`;
		},
		
		// 格式化时间为HH:mm
		formatTime(timestamp) {
			const date = new Date(timestamp);
			return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
		},
		
		// 详细格式化日期
		formatDetailDate(timestamp) {
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		
		// 获取当前月份标签
		getCurrentMonthLabel() {
			const now = new Date();
			return `${now.getFullYear()}年${now.getMonth() + 1}月`;
		},
		
		// 解析月份标签为年月对象
		parseMonthLabel(label) {
			const parts = label.match(/(\d+)年(\d+)月/);
			if (parts && parts.length === 3) {
				return {
					year: parseInt(parts[1]),
					month: parseInt(parts[2])
				};
			}
			
			// 默认返回当前年月
			const now = new Date();
			return {
				year: now.getFullYear(),
				month: now.getMonth() + 1
			};
		},
		
		// 生成可用月份列表
		generateAvailableMonths() {
			const months = [];
			const now = new Date();
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			
			// 添加最近12个月
			for (let i = 0; i < 12; i++) {
				let year = currentYear;
				let month = currentMonth - i;
				
				if (month <= 0) {
					month += 12;
					year -= 1;
				}
				
				months.push(`${year}年${month}月`);
			}
			
			this.availableMonths = months;
		},
		
		// 选择月份
		selectMonth(month) {
			this.currentMonth = month;
			this.showMonthPicker = false;
		},
		
		// 设置筛选类型
		setFilter(filterValue) {
			this.currentFilter = filterValue;
		},
		
		// 显示交易详情
		showTransactionDetail(transaction) {
			this.selectedTransaction = transaction;
			this.showDetail = true;
		},
		
		// 获取交易图标
		getTransactionIcon(transaction) {
			if (transaction.amount > 0) {
				// 收入类型图标
				if (transaction.name.includes('课程')) {
					return this.categoryIcons.income.course;
				} else if (transaction.name.includes('工资')) {
					return this.categoryIcons.income.salary;
				} else if (transaction.name.includes('退款')) {
					return this.categoryIcons.income.refund;
				} else if (transaction.name.includes('利息')) {
					return this.categoryIcons.income.interest;
				}
				return this.categoryIcons.income.default;
			} else {
				// 支出类型图标
				if (transaction.name.includes('提现')) {
					return this.categoryIcons.expense.withdraw;
				} else if (transaction.name.includes('转账')) {
					return this.categoryIcons.expense.transfer;
				} else if (transaction.name.includes('购物') || transaction.name.includes('购买')) {
					return this.categoryIcons.expense.shopping;
				} else if (transaction.name.includes('餐饮') || transaction.name.includes('肯德基')) {
					return this.categoryIcons.expense.dining;
				}
				return this.categoryIcons.expense.default;
			}
		},
		
		// 选择最近几个月
		selectRecentMonths(months) {
			this.quickSelectType = `recent${months}`;
			
			// 获取当前日期
			const now = new Date();
			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			
			// 计算开始月份
			let startYear = currentYear;
			let startMonth = currentMonth - months + 1;
			
			if (startMonth <= 0) {
				startMonth += 12;
				startYear -= 1;
			}
			
			// 更新当前月份为开始月份
			this.currentMonth = `${startYear}年${startMonth}月`;
			this.showTimeIndexPanel = false;
		},
		
		// 选择年份
		selectYear(year) {
			this.currentYearIndex = year;
		},
		
		// 判断月份是否为当前选中
		isMonthActive(month) {
			const selectedMonth = this.parseMonthLabel(this.currentMonth);
			return selectedMonth.year === this.currentYearIndex && selectedMonth.month === month;
		},
		
		// 通过索引选择月份
		selectMonthByIndex(month) {
			const selectedYear = this.currentYearIndex;
			this.currentMonth = `${selectedYear}年${month}月`;
			this.showTimeIndexPanel = false;
		},
		
		// 选择当前年份的所有月份
		selectCurrentYear() {
			const now = new Date();
			this.currentYearIndex = now.getFullYear();
			this.currentMonth = `${now.getFullYear()}年1月`;
			this.quickSelectType = 'currentYear';
			this.showTimeIndexPanel = false;
		}
	}
};
</script>

<style lang="scss">
.bill-container {
	min-height: 100vh;
	background-color: #ffffff;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
	color: #333333;
}

/* 顶部导航栏 */
.nav-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 40rpx;
	background-color: #ffffff;
	color: #333333;
}

.nav-back {
	font-size: 40rpx;
	color: #333333;
	padding: 0 10rpx;
	line-height: 1;
}

.nav-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
}

.nav-right {
	font-size: 28rpx;
	color: #1989fa;
	padding: 0 10rpx;
	line-height: 1;
}

/* 日期筛选容器 */
.date-filter-container {
	padding: 20rpx 30rpx;
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.date-selector {
	display: flex;
	align-items: center;
	padding: 10rpx 20rpx;
	background-color: #f8f8f8;
	border-radius: 10rpx;
}

.current-month-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.dropdown-icon {
	font-size: 24rpx;
	color: #999;
	margin-left: 10rpx;
}

.filter-actions {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.filter-action-item {
	padding: 10rpx 20rpx;
	margin-left: 10rpx;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #666;
	
	&.active {
		background-color: #e6f7ff;
		color: #1989fa;
	}
}

.statistics-btn {
	padding: 10rpx 20rpx;
	margin-left: 10rpx;
	background-color: #f2f2f2;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #1989fa;
}

/* 收支统计概览 */
.income-expense-overview {
	display: flex;
	padding: 20rpx 30rpx;
	background-color: #ffffff;
	border-bottom: 1rpx solid #f2f2f2;
}

.overview-item {
	display: flex;
	flex-direction: column;
	margin-right: 40rpx;
}

.overview-label {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 6rpx;
}

.overview-amount {
	font-size: 34rpx;
	font-weight: 500;
	
	&.income {
		color: #09BB07;
	}
	
	&.expense {
		color: #333333;
	}
}

/* 交易记录列表 */
.transaction-list {
	margin: 0;
	height: calc(100vh - 320rpx);
	background-color: #ffffff;
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #eaeaea;
	transition: background-color 0.3s;
	
	&:active {
		background-color: #f5f5f5;
	}
}

.merchant-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
	overflow: hidden;
	background-color: #f5f5f5;
}

.category-icon {
	width: 60rpx;
	height: 60rpx;
}

.transaction-info {
	flex: 1;
}

.transaction-title {
	font-size: 30rpx;
	color: #333333;
	font-weight: 400;
	max-width: 70%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-bottom: 10rpx;
}

.transaction-time {
	font-size: 24rpx;
	color: #8F8F8F;
}

.transaction-amount {
	font-size: 32rpx;
	font-weight: 500;
	
	&.income {
		color: #09BB07; // 微信支付绿色收入
	}
	
	&.expense {
		color: #333333; // 黑色支出
	}
}

.loading-state {
	text-align: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #8F8F8F;
	background-color: transparent;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
	background-color: transparent;
	height: 400rpx;
}

.empty-icon {
	margin-bottom: 30rpx;
	
	image {
		width: 200rpx;
		height: 200rpx;
		opacity: 0.8;
	}
}

.empty-text {
	font-size: 28rpx;
	color: #8F8F8F;
}

/* 通用遮罩层 */
.overlay-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}

/* 时间索引面板 */
.time-index-panel {
	position: fixed;
	top: 15%;
	left: 10%;
	width: 80%;
	background-color: #ffffff;
	border-radius: 20rpx;
	z-index: 101;
	padding: 30rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eaeaea;
	margin-bottom: 20rpx;
}

.panel-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
}

.panel-close {
	font-size: 40rpx;
	color: #8F8F8F;
	padding: 0 10rpx;
	line-height: 1;
}

.index-content {
	margin-bottom: 20rpx;
}

.year-list {
	display: flex;
	flex-wrap: wrap;
	padding: 10rpx 0;
	margin-bottom: 30rpx;
}

.year-item {
	font-size: 28rpx;
	color: #333333;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
	margin-bottom: 10rpx;
	transition: all 0.3s;
}

.year-item.active {
	background-color: #1989fa;
	color: #ffffff;
}

.month-list {
	display: flex;
	flex-wrap: wrap;
	padding: 10rpx 0;
}

.month-index-item {
	width: 25%;
	text-align: center;
	font-size: 28rpx;
	color: #333333;
	padding: 20rpx 0;
	border-radius: 10rpx;
	box-sizing: border-box;
	transition: all 0.3s;
}

.month-index-item.active {
	background-color: #1989fa;
	color: #ffffff;
}

.panel-footer {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
	border-top: 1rpx solid #eaeaea;
	margin-top: 20rpx;
}

.panel-footer text {
	font-size: 28rpx;
	color: #1989fa;
	padding: 12rpx 20rpx;
	border-radius: 10rpx;
	background-color: rgba(25, 137, 250, 0.1);
	transition: all 0.3s;
}

/* 月份选择弹窗 */
.month-picker {
	position: fixed;
	top: 20%;
	left: 10%;
	width: 80%;
	background-color: #ffffff;
	border-radius: 20rpx;
	z-index: 101;
	padding: 30rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
}

.month-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0;
}

.month-item {
	width: 33.33%;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	
	text {
		font-size: 28rpx;
		color: #333333;
		padding: 12rpx 20rpx;
		border-radius: 10rpx;
		transition: all 0.3s;
	}
	
	&.active text {
		background-color: #1989fa;
		color: #ffffff;
	}
}

/* 交易详情弹窗 */
.transaction-detail {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	z-index: 101;
	padding: 30rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.detail-content {
	padding: 20rpx 0;
}

.detail-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 0;
	margin: 20rpx 0 30rpx;
	border-radius: 20rpx;
	
	&.income-bg {
		background-color: rgba(9, 187, 7, 0.1);
	}
	
	&.expense-bg {
		background-color: rgba(0, 0, 0, 0.05);
	}
}

.detail-amount {
	font-size: 60rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 16rpx;
}

.detail-type {
	font-size: 28rpx;
	font-weight: 400;
	color: #8F8F8F;
}

.detail-list {
	padding: 10rpx 0 30rpx 0;
}

.detail-item {
	display: flex;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #eaeaea;
}

.detail-label {
	width: 180rpx;
	font-size: 28rpx;
	color: #8F8F8F;
}

.detail-value {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
	
	&.success {
		color: #09BB07;
	}
}
</style>