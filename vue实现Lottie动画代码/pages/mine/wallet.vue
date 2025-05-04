<template>
	<view class="wallet-container">
	
		<!-- 余额卡片 -->
		<view class="balance-card">
			<view class="card-left">
				<view class="balance-label">余额</view>
				<view class="balance-amount">
					<view class="currency">¥</view>
					<view class="amount">{{walletInfo.balance || '0.00'}}</view>
				</view>
			</view>
			<view class="detail-link" @click="showIncomeDetail">
				<text>收入明细</text>
			</view>
		</view>
		
		<!-- 交易记录卡片 - 已移除 -->
		
		<!-- 提现按钮 -->
		<view class="withdraw-btn" @click="withdraw">提现</view>
		
		<!-- 底部提示 -->
		<view class="bottom-tips">
			<text>提现金额将在1-3个工作日内到账</text>
		</view>
		
		<!-- 收入明细弹出层 -->
		<view class="income-detail-popup" v-if="showDetailPopup" @click.self="hideIncomeDetail">
			<view class="income-detail-panel">
				<!-- 弹出层标题栏 -->
				<view class="popup-header">
					<view class="close-btn" @click="hideIncomeDetail">
						<text class="close-icon">×</text>
					</view>
					<view class="popup-title">收入明细</view>
					<view class="placeholder"></view>
				</view>
				
				<!-- 筛选栏 -->
				<view class="filter-bar">
					<view 
						v-for="(item, index) in filterOptions" 
						:key="index" 
						class="filter-item" 
						:class="{ active: currentFilter === index }"
						@click="setFilter(index)"
					>
						{{item}}
					</view>
				</view>
				
				<!-- 收入明细列表 -->
				<scroll-view 
					class="income-list" 
					scroll-y 
					@scrolltolower="loadMoreIncome"
				>
					<block v-if="incomeList.length > 0">
						<!-- 月份分组 -->
						<view v-for="(group, month) in groupedIncomeList" :key="month" class="month-group">
							<view class="month-title">
								<text>{{month}}</text>
								<text class="month-total">收入：¥{{calculateMonthTotal(group)}}</text>
							</view>
							
							<!-- 收入项目 -->
							<view 
								v-for="(item, index) in group" 
								:key="index" 
								class="income-item"
							>
								<view class="income-icon" :class="getIconClass(item.source)">
									<text class="icon-text">{{getIconText(item.source)}}</text>
								</view>
								<view class="income-info">
									<view class="income-title">{{item.title}}</view>
									<view class="income-time">{{item.time}}</view>
								</view>
								<view class="income-amount">
									<text>+{{item.amount}}</text>
								</view>
							</view>
						</view>
						
						<!-- 底部加载状态 -->
						<view class="loading-state">
							<text v-if="loading">加载中...</text>
							<text v-else-if="noMore">—— 没有更多了 ——</text>
						</view>
					</block>
					
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<view class="empty-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
								<path d="M40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70Z" stroke="#E0E6F1" stroke-width="2"/>
								<path d="M30 40H50M40 30V50" stroke="#E0E6F1" stroke-width="2" stroke-linecap="round"/>
							</svg>
						</view>
						<text class="empty-text">暂无收入记录</text>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 提现弹出层 -->
		<view class="withdraw-popup" v-if="showWithdrawPopup" @click.self="hideWithdraw">
			<view class="withdraw-panel">
				<!-- 弹出层标题栏 -->
				<view class="popup-header">
					<view class="close-btn" @click="hideWithdraw">
						<text class="close-icon">×</text>
					</view>
					<view class="popup-title">提现</view>
					<view class="placeholder"></view>
				</view>
				
				<!-- 提现金额 -->
				<view class="withdraw-amount-section">
					<view class="section-title">提现金额</view>
					<view class="amount-input-wrapper">
						<text class="amount-symbol">¥</text>
						<input 
							type="digit" 
							class="amount-input" 
							v-model="withdrawAmount"
							placeholder="请输入提现金额"
							@input="validateAmount"
						/>
					</view>
					<view class="balance-info">
						<text>可提现余额：¥{{walletInfo.balance}}</text>
						<text class="withdraw-all" @click="setMaxAmount">全部提现</text>
					</view>
					<view class="error-tip" v-if="amountError">{{amountError}}</view>
				</view>
				
				<!-- 提现方式 -->
				<view class="withdraw-method-section">
					<view class="section-title">提现方式</view>
					<view class="method-list">
						<view 
							v-for="(method, index) in withdrawMethods" 
							:key="index"
							class="method-item"
							:class="{ active: currentMethod === index }"
							@click="selectMethod(index)"
						>
							<view class="method-icon" :class="method.type">
								<text class="icon-text">{{method.shortName}}</text>
							</view>
							<view class="method-info">
								<view class="method-name">{{method.name}}</view>
								<view class="method-desc">{{method.description}}</view>
							</view>
							<view class="method-check">
								<view class="check-circle" v-if="currentMethod === index">✓</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 提现按钮 -->
				<view 
					class="confirm-withdraw-btn" 
					:class="{ disabled: !canWithdraw }"
					@click="confirmWithdraw"
				>
					确认提现
				</view>
				
				<!-- 提现说明 -->
				<view class="withdraw-tips">
					<text>· 提现金额将在1-3个工作日内到账</text>
					<text>· 单笔提现金额不低于10元</text>
					<text>· 每日提现上限10000元</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			walletInfo: {
				balance: '100.00'
			},
			recentTransactions: [],
			// 收入明细弹出层相关数据
			showDetailPopup: false,
			filterOptions: ['全部', '本月', '上月', '今年'],
			currentFilter: 0,
			incomeList: [],
			loading: false,
			noMore: false,
			page: 1,
			pageSize: 10,
			// 提现弹出层相关数据
			showWithdrawPopup: false,
			withdrawAmount: '',
			amountError: '',
			currentMethod: 0,
			withdrawMethods: [
				{
					type: 'wechat',
					name: '微信',
					shortName: '微',
					description: '2小时内到账',
					fee: '0%'
				},
				{
					type: 'alipay',
					name: '支付宝',
					shortName: '支',
					description: '2小时内到账',
					fee: '0%'
				},
				{
					type: 'bank',
					name: '银行卡',
					shortName: '银',
					description: '1-3个工作日到账',
					fee: '0%'
				}
			]
		}
	},
	computed: {
		// 根据月份分组收入数据
		groupedIncomeList() {
			const grouped = {};
			
			this.incomeList.forEach(item => {
				const month = item.month;
				if (!grouped[month]) {
					grouped[month] = [];
				}
				grouped[month].push(item);
			});
			
			return grouped;
		},
		// 是否可以提现
		canWithdraw() {
			if (!this.withdrawAmount || this.amountError) {
				return false;
			}
			const amount = parseFloat(this.withdrawAmount);
			return amount >= 10 && amount <= parseFloat(this.walletInfo.balance);
		}
	},
	onLoad() {
		// 获取钱包信息
		this.getWalletInfo()
		// 获取最近交易记录
		this.getRecentTransactions()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		// 显示收入明细弹出层
		showIncomeDetail() {
			this.showDetailPopup = true
			this.loadIncomeData()
		},
		// 隐藏收入明细弹出层
		hideIncomeDetail() {
			this.showDetailPopup = false
		},
		// 提现操作
		withdraw() {
			if (parseFloat(this.walletInfo.balance) <= 0) {
				uni.showToast({
					title: '余额不足',
					icon: 'none'
				})
				return
			}
			this.withdrawAmount = '';
			this.amountError = '';
			this.showWithdrawPopup = true;
		},
		// 隐藏提现弹出层
		hideWithdraw() {
			this.showWithdrawPopup = false;
		},
		// 验证提现金额
		validateAmount() {
			const amount = parseFloat(this.withdrawAmount);
			const balance = parseFloat(this.walletInfo.balance);
			
			if (isNaN(amount)) {
				this.amountError = '请输入有效金额';
			} else if (amount <= 0) {
				this.amountError = '提现金额必须大于0';
			} else if (amount < 10) {
				this.amountError = '提现金额不能低于10元';
			} else if (amount > balance) {
				this.amountError = '提现金额不能超过可用余额';
			} else {
				this.amountError = '';
			}
		},
		// 设置最大提现金额
		setMaxAmount() {
			this.withdrawAmount = this.walletInfo.balance;
			this.validateAmount();
		},
		// 选择提现方式
		selectMethod(index) {
			this.currentMethod = index;
		},
		// 确认提现
		confirmWithdraw() {
			if (!this.canWithdraw) return;
			
			// 模拟提现操作
			uni.showLoading({
				title: '提现申请中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				
				// 更新余额和交易记录
				const oldBalance = parseFloat(this.walletInfo.balance);
				const withdrawAmount = parseFloat(this.withdrawAmount);
				this.walletInfo.balance = (oldBalance - withdrawAmount).toFixed(2);
				
				// 添加新的交易记录
				this.recentTransactions.unshift({
					id: 'tx' + Date.now(),
					type: 'expense',
					title: '提现到' + this.withdrawMethods[this.currentMethod].name,
					time: this.formatDate(new Date()),
					amount: withdrawAmount.toFixed(2)
				});
				
				// 关闭弹窗并显示成功提示
				this.hideWithdraw();
				uni.showToast({
					title: '提现申请成功',
					icon: 'success'
				});
			}, 1500);
		},
		// 格式化日期
		formatDate(date) {
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		// 获取钱包信息
		getWalletInfo() {
			// 这里通常会有一个API请求来获取钱包信息
			// 这里使用模拟数据
			this.walletInfo = {
				balance: '100.00'
			}
		},
		// 获取最近交易记录
		getRecentTransactions() {
			// 模拟数据
			this.recentTransactions = [
				{
					id: 'tx001',
					type: 'income',
					title: '学员购买《数学基础》课程',
					time: '2024-03-15',
					amount: '199.00'
				},
				{
					id: 'tx002',
					type: 'income',
					title: '学员打赏',
					time: '2024-03-10',
					amount: '50.00'
				},
				{
					id: 'tx003',
					type: 'expense',
					title: '提现',
					time: '2024-03-05',
					amount: '149.00'
				}
			]
		},
		// 设置筛选条件
		setFilter(index) {
			if (this.currentFilter === index) return
			this.currentFilter = index
			this.page = 1
			this.incomeList = []
			this.noMore = false
			this.loadIncomeData()
		},
		// 加载更多收入数据
		loadMoreIncome() {
			if (this.loading || this.noMore) return
			this.page++
			this.loadIncomeData()
		},
		// 加载收入明细数据
		loadIncomeData() {
			this.loading = true
			
			// 模拟接口请求
			setTimeout(() => {
				// 生成模拟数据
				const newData = this.generateMockData()
				
				// 追加数据
				this.incomeList = this.page === 1 ? newData : [...this.incomeList, ...newData]
				
				// 设置加载状态
				this.loading = false
				this.noMore = newData.length < this.pageSize
			}, 500)
		},
		// 生成模拟数据
		generateMockData() {
			const result = []
			const count = this.page === 1 ? this.pageSize : Math.floor(Math.random() * this.pageSize)
			
			// 如果是第3页以后，模拟没有更多数据
			if (this.page > 2) {
				return []
			}
			
			const sourceTypes = ['课程', '打赏', '退款', '其他']
			const months = ['2023年12月', '2024年01月', '2024年02月', '2024年03月']
			
			for (let i = 0; i < count; i++) {
				const source = sourceTypes[Math.floor(Math.random() * sourceTypes.length)]
				let title = ''
				
				switch (source) {
					case '课程':
						title = `学员购买《${['数学基础', '语文进阶', '英语口语', '物理实验'][Math.floor(Math.random() * 4)]}》课程`
						break
					case '打赏':
						title = '学员打赏'
						break
					case '退款':
						title = '平台退款'
						break
					default:
						title = '其他收入'
				}
				
				// 根据筛选条件选择月份
				let month = ''
				switch(this.currentFilter) {
					case 1: // 本月
						month = '2024年03月'
						break
					case 2: // 上月
						month = '2024年02月'
						break
					case 3: // 今年
						month = months[Math.floor(Math.random() * 2) + 2] // 只选今年的月份
						break
					default: // 全部
						month = months[Math.floor(Math.random() * months.length)]
				}
				
				// 生成日期和时间
				const day = Math.floor(Math.random() * 28) + 1
				const hour = Math.floor(Math.random() * 24)
				const minute = Math.floor(Math.random() * 60)
				const time = `${day < 10 ? '0' + day : day}日 ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`
				
				// 生成金额
				const amount = (Math.random() * 500 + 50).toFixed(2)
				
				result.push({
					id: `income_${this.page}_${i}`,
					title,
					source,
					amount,
					month,
					time,
					status: '已到账'
				})
			}
			
			return result
		},
		// 计算月度总收入
		calculateMonthTotal(items) {
			return items.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)
		},
		// 获取图标样式类
		getIconClass(source) {
			switch(source) {
				case '课程': return 'course'
				case '打赏': return 'reward'
				case '退款': return 'refund'
				default: return 'other'
			}
		},
		// 获取图标文字
		getIconText(source) {
			switch(source) {
				case '课程': return '课'
				case '打赏': return '赏'
				case '退款': return '退'
				default: return '其'
			}
		}
	}
}
</script>

<style lang="scss">
.wallet-container {
	min-height: 100vh;
	background: linear-gradient(180deg, #FAFBFC 0%, #F5F7FA 100%);
	padding: 30rpx;
	font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.back-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon-back {
	font-size: 40rpx;
	color: #333;
}

.page-title {
	font-size: 36rpx;
	font-weight: 500;
	color: #333;
}

.placeholder {
	width: 60rpx;
}

.balance-card {
	background-color: #F0F7FF;
	border-radius: 16rpx;
	padding: 30rpx 40rpx;
	margin-bottom: 40rpx;
	display: flex;
	flex-direction: column;
	position: relative;
	min-height: 260rpx;
}

.card-left {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.balance-label {
	font-size: 36rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.balance-amount {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.currency {
	font-size: 48rpx;
	font-weight: 500;
	color: #333;
	line-height: 1;
	margin-bottom: 10rpx;
}

.amount {
	font-size: 70rpx;
	font-weight: 500;
	color: #333;
	line-height: 1;
}

.detail-link {
	font-size: 28rpx;
	color: #999;
	position: absolute;
	right: 40rpx;
	bottom: 30rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	transition: all 0.2s ease;
}

.detail-link:active {
	background-color: rgba(0, 0, 0, 0.05);
	color: #666;
	transform: scale(0.98);
}

.transaction-card {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 6rpx 20rpx rgba(0, 40, 120, 0.03);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.header-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #2C3E50;
}

.view-all {
	font-size: 26rpx;
	color: #5E7FB1;
}

.transaction-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 0;
	
	text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #A0AEC0;
	}
}

.transaction-list {
	max-height: 400rpx;
	overflow-y: auto;
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F0F5FF;
	
	&:last-child {
		border-bottom: none;
	}
}

.transaction-icon {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	
	&.income {
		background: rgba(52, 211, 153, 0.1);
	}
	
	&.expense {
		background: rgba(239, 68, 68, 0.1);
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
}

.transaction-title {
	font-size: 28rpx;
	color: #2C3E50;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.transaction-time {
	font-size: 24rpx;
	color: #94A3B8;
}

.transaction-amount {
	font-size: 30rpx;
	font-weight: 500;
	
	&.income {
		color: #34D399;
	}
	
	&.expense {
		color: #EF4444;
	}
}

.withdraw-btn {
	height: 88rpx;
	background: linear-gradient(to right, #3B82F6, #2563EB);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 44rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 12rpx rgba(37, 99, 235, 0.2);
	letter-spacing: 2rpx;
	transition: all 0.2s ease;
	position: relative;
	overflow: hidden;
}

.withdraw-btn:active {
	transform: translateY(3rpx) scale(0.99);
	box-shadow: 0 2rpx 6rpx rgba(37, 99, 235, 0.15);
	background: linear-gradient(to right, #3575E3, #2159D6);
}

.withdraw-btn:active::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 44rpx;
}

.bottom-tips {
	text-align: center;
	font-size: 24rpx;
	color: #94A3B8;
	padding: 20rpx 0;
}

/* 收入明细弹出层 */
.income-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: flex-end;
}

.income-detail-panel {
	width: 100%;
	height: 90vh;
	background-color: #FFFFFF;
	border-radius: 24rpx 24rpx 0 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease;
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100rpx;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.close-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-icon {
	font-size: 50rpx;
	color: #999;
	line-height: 1;
}

.popup-title {
	font-size: 36rpx;
	font-weight: 500;
	color: #333;
}

.filter-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	border-bottom: 1rpx solid #F0F0F0;
	background-color: #FFFFFF;
}

.filter-item {
	padding: 10rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
	border-radius: 30rpx;
	transition: all 0.2s ease;
}

.filter-item.active {
	background-color: #EBF4FF;
	color: #3B82F6;
	font-weight: 500;
}

.filter-item:active {
	opacity: 0.8;
}

.income-list {
	flex: 1;
	background-color: #F5F7FA;
}

.month-group {
	margin: 30rpx 0;
}

.month-title {
	padding: 0 30rpx;
	margin-bottom: 10rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.month-title text {
	font-size: 28rpx;
	color: #999;
}

.month-total {
	font-size: 26rpx;
	color: #666;
}

.income-item {
	background-color: #FFFFFF;
	padding: 30rpx;
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #F0F0F0;
}

.income-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	
	&.course {
		background-color: rgba(59, 130, 246, 0.1);
	}
	
	&.reward {
		background-color: rgba(236, 72, 153, 0.1);
	}
	
	&.refund {
		background-color: rgba(34, 197, 94, 0.1);
	}
	
	&.other {
		background-color: rgba(168, 85, 247, 0.1);
	}
}

.icon-text {
	font-size: 28rpx;
	font-weight: 500;
	
	.course & {
		color: #3B82F6;
	}
	
	.reward & {
		color: #EC4899;
	}
	
	.refund & {
		color: #22C55E;
	}
	
	.other & {
		color: #A855F7;
	}
}

.income-info {
	flex: 1;
	margin-right: 20rpx;
}

.income-title {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.income-time {
	font-size: 24rpx;
	color: #999;
}

.income-amount {
	font-size: 32rpx;
	font-weight: 500;
	color: #22C55E;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
}

.empty-icon {
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading-state {
	text-align: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #999;
}

/* 提现弹出层 */
.withdraw-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: flex-end;
}

.withdraw-panel {
	width: 100%;
	max-height: 85vh;
	background-color: #FFFFFF;
	border-radius: 24rpx 24rpx 0 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	animation: slideUp 0.3s ease;
}

.withdraw-amount-section {
	padding: 30rpx;
	border-bottom: 16rpx solid #F5F7FA;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 20rpx;
}

.amount-input-wrapper {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
	margin-bottom: 20rpx;
}

.amount-symbol {
	font-size: 40rpx;
	font-weight: 500;
	color: #333;
	margin-right: 10rpx;
}

.amount-input {
	flex: 1;
	height: 80rpx;
	font-size: 40rpx;
	color: #333;
}

.balance-info {
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
	color: #999;
}

.withdraw-all {
	color: #3B82F6;
}

.error-tip {
	font-size: 26rpx;
	color: #EF4444;
	margin-top: 10rpx;
}

.withdraw-method-section {
	padding: 30rpx;
}

.method-list {
	border-radius: 16rpx;
	overflow: hidden;
}

.method-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #F0F0F0;
	transition: all 0.2s ease;
}

.method-item.active {
	background-color: #F8FAFF;
}

.method-icon {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	
	&.wechat {
		background-color: rgba(80, 190, 90, 0.1);
	}
	
	&.alipay {
		background-color: rgba(0, 150, 240, 0.1);
	}
	
	&.bank {
		background-color: rgba(240, 180, 0, 0.1);
	}
}

.method-icon .icon-text {
	font-size: 28rpx;
	font-weight: 500;
	
	.wechat & {
		color: #50BE5A;
	}
	
	.alipay & {
		color: #0096F0;
	}
	
	.bank & {
		color: #F0B400;
	}
}

.method-info {
	flex: 1;
}

.method-name {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 6rpx;
}

.method-desc {
	font-size: 24rpx;
	color: #999;
}

.method-check {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.check-circle {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background-color: #3B82F6;
	color: #FFFFFF;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.confirm-withdraw-btn {
	margin: 20rpx 30rpx 30rpx;
	height: 88rpx;
	background: linear-gradient(to right, #3B82F6, #2563EB);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 44rpx;
	box-shadow: 0 6rpx 12rpx rgba(37, 99, 235, 0.2);
	transition: all 0.2s ease;
}

.confirm-withdraw-btn:active {
	transform: translateY(3rpx) scale(0.98);
	box-shadow: 0 2rpx 6rpx rgba(37, 99, 235, 0.15);
	background: linear-gradient(to right, #3575E3, #2159D6);
}

.confirm-withdraw-btn.disabled {
	background: linear-gradient(to right, #D1D5DB, #9CA3AF);
	box-shadow: none;
	color: #F9FAFB;
}

.withdraw-tips {
	padding: 0 30rpx 40rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.withdraw-tips text {
	font-size: 24rpx;
	color: #9CA3AF;
}
</style>