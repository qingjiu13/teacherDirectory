<template>
	<view class="history-sidebar" :class="{visible: visible}">
		<view class="sidebar-header">
			<text class="sidebar-title">历史记录</text>
		</view>
		<scroll-view 
			class="history-list" 
			scroll-y="true"
			@scrolltolower="onScrollToLower"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
			@refresherrestore="onRefreshRestore"
			lower-threshold="50"
			enable-back-to-top="true"
			scroll-with-animation="true">
			<!-- 今天 -->
			<view v-if="groupedHistory.today && groupedHistory.today.length" class="history-group">
				<view class="history-group-title">今天</view>
				<view v-for="item in groupedHistory.today" :key="item.id" class="history-item-outer" :class="{'active': currentChatId === item.id}">
					<view v-if="currentChatId === item.id" class="history-item-outer-gradient" @click="loadChatHistory(item.id)">
						<view class="history-item-inner">
							<view class="history-item-content">
								<text class="history-title">{{item.abstract || '无标题'}}</text>
							</view>
							<view class="history-actions">
								<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
								<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    								<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
								</view>
							</view>
						</view>
					</view>
					<view v-else class="history-item-inner" @click="loadChatHistory(item.id)">
						<view class="history-item-content">
							<text class="history-title">{{item.abstract || '无标题'}}</text>
						</view>
						<view class="history-actions">
							<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
							<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    							<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 七天内 -->
			<view v-if="groupedHistory.week && groupedHistory.week.length" class="history-group">
				<view class="history-group-title">七天内</view>
				<view v-for="item in groupedHistory.week" :key="item.id" class="history-item-outer" :class="{'active': currentChatId === item.id}">
					<view v-if="currentChatId === item.id" class="history-item-outer-gradient" @click="loadChatHistory(item.id)">
						<view class="history-item-inner">
							<view class="history-item-content">
								<text class="history-title">{{item.abstract || '无标题'}}</text>
							</view>
							<view class="history-actions">
								<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
								<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    								<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
								</view>
							</view>
						</view>
					</view>
					<view v-else class="history-item-inner" @click="loadChatHistory(item.id)">
						<view class="history-item-content">
							<text class="history-title">{{item.abstract || '无标题'}}</text>
						</view>
						<view class="history-actions">
							<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
							<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    							<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 30天内 -->
			<view v-if="groupedHistory.month && groupedHistory.month.length" class="history-group">
				<view class="history-group-title">30天内</view>
				<view v-for="item in groupedHistory.month" :key="item.id" class="history-item-outer" :class="{'active': currentChatId === item.id}">
					<view v-if="currentChatId === item.id" class="history-item-outer-gradient" @click="loadChatHistory(item.id)">
						<view class="history-item-inner">
							<view class="history-item-content">
								<text class="history-title">{{item.abstract || '无标题'}}</text>
							</view>
							<view class="history-actions">
								<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
								<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    								<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
								</view>
							</view>
						</view>
					</view>
					<view v-else class="history-item-inner" @click="loadChatHistory(item.id)">
						<view class="history-item-content">
							<text class="history-title">{{item.abstract || '无标题'}}</text>
						</view>
						<view class="history-actions">
							<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
							<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
    							<image class="delete-icon-img" src="../.././static/AIchat/delate.png" mode="aspectFit" />
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多状态 -->
			<view class="load-more-container" v-if="showLoadMore">
				<view class="load-more-item" v-if="isLoadingMore">
					<text class="load-more-text">正在加载更多...</text>
				</view>
				<view class="load-more-item" v-else-if="hasMoreData">
					<text class="load-more-text">上拉加载更多</text>
				</view>
				<view class="load-more-item" v-else>
					<text class="load-more-text no-more">没有更多数据了</text>
				</view>
			</view>
			
			<!-- 没有历史记录 -->
			<view class="empty-history" v-if="!hasAnyHistory && !isLoadingMore">
				<text class="empty-history-text">暂无历史记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	// 导入时间戳格式化函数
	import { formatTimestamp } from '../../../components/timeStamp.js';
	
	/**
	 * @description 历史记录侧边栏组件，按时间分组显示
	 * @property {Boolean} visible - 侧边栏是否可见
	 * @property {Object} groupedHistory - 按时间分组的历史记录
	 * @property {String} currentChatId - 当前选中的聊天ID
	 * @property {Object} pagination - 分页相关属性
	 * @event {Function} loadChat - 加载聊天历史记录
	 * @event {Function} deleteChat - 删除聊天历史记录
	 */
	export default {
		name: "HistorySidebar",
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			groupedHistory: {
				type: Object,
				default: () => ({ today: [], week: [], month: [] })
			},
			currentChatId: {
				type: Number,
				default: 0
			},
			// 分页相关 props
			pagination: {
				type: Object,
				default: () => ({
					pageNum: 1,
					pageSize: 10,
					total: 0,
					totalPages: 0,
					hasNext: false,
					hasPrev: false,
					loading: false
				})
			}
		},
		data() {
			return {
				// 刷新状态
				isRefreshing: false,
				// 加载更多状态
				isLoadingMore: false,
				// 防抖定时器
				loadMoreTimer: null
			};
		},
		computed: {
			/**
			 * @description 从 Vuex 状态中获取数据
			 */
			...mapState({
				conversations: state => {
					try {
						return state.user && state.user.aiChat && state.user.aiChat.aiChat 
							? (state.user.aiChat.aiChat.conversations || []) 
							: [];
					} catch (e) {
						console.error('获取 conversations 状态出错:', e);
						return [];
					}
				},
				activeConversation: state => {
					try {
						return state.user && state.user.aiChat && state.user.aiChat.aiChat 
							? state.user.aiChat.aiChat.activeConversation 
							: null;
					} catch (e) {
						console.error('获取 activeConversation 状态出错:', e);
						return null;
					}
				}
			}),
			
			/**
			 * @description 按日期分类的历史记录
			 * @returns {Object} 分类后的历史记录
			 */
			groupedConversationsByDate() {
				// 获取当前日期、一周前日期和一个月前日期的时间戳
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
				const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
				const monthAgo = today - 30 * 24 * 60 * 60 * 1000;
				
				// 分类存储
				const result = {
					today: [],
					week: [],
					month: []
				};
				
				// 遍历所有对话记录进行分类
				this.conversations.forEach(conv => {
					// 使用更新时间作为分类依据，如果没有时间戳则使用当前时间
					let timestamp = conv.updatedAt || conv.createdAt;
					
					// 如果时间戳为空或无效，使用当前时间
					if (!timestamp || isNaN(timestamp)) {
						timestamp = Date.now();
					}
					
					// 格式化时间戳用于调试
					const formattedDate = formatTimestamp(timestamp);
					console.log(`对话 ${conv.id} 的时间: ${formattedDate}, 时间戳: ${timestamp}`);
					
					// 处理abstract字段显示
					const processedConv = {
						...conv,
						abstract: this.processAbstract(conv.abstract)
					};
					
					if (timestamp >= today) {
						result.today.push(processedConv);
					} else if (timestamp >= weekAgo) {
						result.week.push(processedConv);
					} else if (timestamp >= monthAgo) {
						result.month.push(processedConv);
					}
				});
				
				// 按时间戳倒序排序（最新的在前面）
				['today', 'week', 'month'].forEach(key => {
					result[key].sort((a, b) => {
						const timeA = a.updatedAt || a.createdAt || Date.now();
						const timeB = b.updatedAt || b.createdAt || Date.now();
						return timeB - timeA;
					});
				});
				
				return result;
			},
			
			/**
			 * @description 是否有任何历史记录
			 * @returns {Boolean}
			 */
			hasAnyHistory() {
				const g = this.groupedHistory;
				return (g.today && g.today.length) || (g.week && g.week.length) || (g.month && g.month.length);
			},
			
			/**
			 * @description 是否显示加载更多组件
			 * @returns {Boolean}
			 */
			showLoadMore() {
				return this.hasAnyHistory && (this.hasMoreData || this.isLoadingMore);
			},
			
			/**
			 * @description 是否有更多数据可以加载
			 * @returns {Boolean}
			 */
			hasMoreData() {
				try {
					// 优先使用Vuex状态中的分页信息
					const paginationState = this.$store.state.user?.aiChat?.aiChat?.pagination;
					if (paginationState) {
						return paginationState.hasNext;
					}
					// 如果Vuex状态不可用，则使用props
					return this.pagination.hasNext;
				} catch (e) {
					console.error('获取分页状态出错:', e);
					return this.pagination.hasNext;
				}
			},
			
			/**
			 * @description 当前页码
			 * @returns {Number}
			 */
			currentPage() {
				try {
					// 优先使用Vuex状态中的分页信息
					const paginationState = this.$store.state.user?.aiChat?.aiChat?.pagination;
					if (paginationState) {
						return paginationState.pageNum;
					}
					// 如果Vuex状态不可用，则使用props
					return this.pagination.pageNum;
				} catch (e) {
					console.error('获取分页状态出错:', e);
					return this.pagination.pageNum;
				}
			},
			
			/**
			 * @description 总页数
			 * @returns {Number}
			 */
			totalPages() {
				try {
					// 优先使用Vuex状态中的分页信息
					const paginationState = this.$store.state.user?.aiChat?.aiChat?.pagination;
					if (paginationState) {
						return paginationState.totalPages;
					}
					// 如果Vuex状态不可用，则使用props
					return this.pagination.totalPages;
				} catch (e) {
					console.error('获取分页状态出错:', e);
					return this.pagination.totalPages;
				}
			},
			
			/**
			 * @description 是否正在加载分页数据
			 * @returns {Boolean}
			 */
			isPaginationLoading() {
				try {
					// 优先使用Vuex状态中的分页信息
					const paginationState = this.$store.state.user?.aiChat?.aiChat?.pagination;
					if (paginationState) {
						return paginationState.loading;
					}
					// 如果Vuex状态不可用，则使用props
					return this.pagination.loading;
				} catch (e) {
					console.error('获取分页状态出错:', e);
					return this.pagination.loading;
				}
			}
		},
		watch: {
			/**
			 * @description 监听对话列表变化，自动更新分组
			 * @param {Array} newConversations - 新的对话列表
			 * @param {Array} oldConversations - 旧的对话列表
			 */
			conversations: {
				handler(newConversations, oldConversations) {
					console.log('=== 对话列表发生变化 ===');
					console.log('新对话数量:', newConversations?.length || 0);
					console.log('旧对话数量:', oldConversations?.length || 0);
					
					// 更新分组
					this.initConversationGroups();
					
					console.log('=== 分组更新完成 ===');
				},
				deep: true,
				immediate: false
			},
			
			/**
			 * @description 监听分页信息变化
			 * @param {Object} newPagination - 新的分页信息
			 * @param {Object} oldPagination - 旧的分页信息
			 */
			pagination: {
				handler(newPagination, oldPagination) {
					console.log('=== 分页信息发生变化 ===');
					console.log('新分页信息:', newPagination);
					console.log('旧分页信息:', oldPagination);
				},
				deep: true,
				immediate: false
			}
		},
		created() {
			// 添加调试信息
			console.log('=================== 调试信息开始 ===================');
			console.log('完整的 Vuex store:', this.$store);
			console.log('Vuex store状态:', this.$store.state);
			
			if (this.$store.state.user) {
				console.log('user模块状态:', this.$store.state.user);
				
				if (this.$store.state.user.aiChat) {
					console.log('aiChat模块状态:', this.$store.state.user.aiChat);
					
					if (this.$store.state.user.aiChat.aiChat) {
						console.log('内层 aiChat:', this.$store.state.user.aiChat.aiChat);
						console.log('内层 aiChat conversations:', this.$store.state.user.aiChat.aiChat.conversations);
					} else {
						console.error('无法访问内层 aiChat!');
						console.log('aiChat 模块完整内容:', JSON.stringify(this.$store.state.user.aiChat));
					}
				} else {
					console.error('无法访问 aiChat 模块!');
				}
			} else {
				console.error('无法访问 user 模块!');
			}
			
			console.log('组件计算的 conversations:', this.conversations);
			console.log('组件计算的 historySummaries:', this.historySummaries);
			console.log('组件计算的 currentChatId:', this.currentChatId);
			console.log('=================== 调试信息结束 ===================');
		},
		mounted() {
			// 在组件挂载时初始化对话分类和加载历史记录
			this.initConversationGroups();
			this.loadInitialHistory();
		},
		methods: {
			...mapActions({
				setActiveConversation: 'user/aiChat/setCurrentChat',
				deleteConversation: 'user/aiChat/deleteChat',
				loadConversationDetail: 'user/aiChat/loadChat',
				loadConversationHistory: 'user/aiChat/loadConversationHistory',
				nextPage: 'user/aiChat/nextPage',
				prevPage: 'user/aiChat/prevPage',
				refreshPage: 'user/aiChat/refreshPage'
			}),
			
			/**
			 * @description 初始化加载对话历史
			 */
			async loadInitialHistory() {
				try {
					console.log('=== 开始初始化加载对话历史 ===');
					
					// 检查是否已有数据，如果没有则加载第一页
					if (this.conversations.length === 0) {
						const result = await this.loadConversationHistory({
							pageNum: 1,
							pageSize: 10
						});
						
						if (result.success) {
							console.log('初始化对话历史加载成功:', result.data.length, '条记录');
							
							// 更新分组
							this.initConversationGroups();
						} else {
							console.error('初始化对话历史加载失败:', result.message);
						}
					} else {
						console.log('已有对话数据，跳过初始化加载');
					}
					
					console.log('=== 初始化加载对话历史完成 ===');
				} catch (error) {
					console.error('初始化加载对话历史异常:', error);
				}
			},
			
			/**
			 * @description 初始化对话分组
			 */
			initConversationGroups() {
				// 初始化对话分组，将分组结果通过事件发送给父组件
				const groupedConversations = this.groupedConversationsByDate;
				this.$emit('updateGroups', groupedConversations);
			},
			
			/**
			 * @description 处理abstract字段显示，去除换行符和多余空格
			 * @param {String} abstract - 原始abstract字段
			 * @returns {String} 处理后的abstract字段
			 */
			processAbstract(abstract) {
				if (!abstract) return '无标题';
				
				// 去除换行符、制表符，并将多个空格替换为单个空格
				return abstract
					.replace(/[\r\n\t]/g, ' ')
					.replace(/\s+/g, ' ')
					.trim() || '无标题';
			},
			
			/**
			 * @description 格式化时间戳为人类可读格式
			 * @param {Number} timestamp - 时间戳
			 * @param {String} format - 日期格式
			 * @returns {String} 格式化后的日期字符串
			 */
			formatDate(timestamp, format = 'YYYY-MM-DD') {
				return formatTimestamp(timestamp, format);
			},
			
			/**
			 * @description 获取对话模式的中文标签
			 * @param {String} mode - 对话模式
			 * @returns {String} 对话模式的中文标签
			 */
			getModeLabel(mode) {
				const modeLabels = {
					'general': '通用',
					'school': '择校',
					'career': '职业规划',
					'DOU_BAO_CHAT': '豆包聊天',
					// 兼容后端可能返回的其他值
					'': '通用',
					null: '通用',
					undefined: '通用'
				};
				return modeLabels[mode] || '通用';
			},
			
			/**
			 * @description 加载聊天历史
			 * @param {String|Number} chatId - 聊天ID
			 */
			async loadChatHistory(chatId) {
				try {
					console.log('开始加载聊天历史:', chatId);
					
					// 显示加载提示
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					
					// 清除该对话的缓存数据，确保重新从后端获取
					const conversationIndex = this.conversations.findIndex(conv => conv.id == chatId);
					if (conversationIndex !== -1) {
						// 清空该对话的消息缓存，强制重新加载
						this.$store.commit('user/aiChat/UPDATE_CONVERSATION_DETAIL', {
							...this.conversations[conversationIndex],
							messages: [] // 清空消息缓存
						});
						console.log('已清除对话缓存，强制重新加载:', chatId);
					}
					
					// 设置当前活跃的对话
					this.setActiveConversation(chatId);
					
					// 强制从后端加载完整的对话内容
					const result = await this.loadConversationDetail(chatId);
					console.log('loadConversationDetail result:', result);
					
					// 隐藏加载提示
					uni.hideLoading();
					
					if (result.success) {
						// 安全地获取聊天模式，添加容错处理
						const chatMode = result.conversation?.chatMode || 'general';
						console.log('获取到的聊天模式:', chatMode);
						console.log('对话信息:', result.conversation);
						
						// 更新 Vuex 中的聊天模式
						this.$store.commit('user/aiChat/UPDATE_CHAT_MODE', chatMode);
						
						console.log('聊天历史加载成功，消息数量:', result.conversation?.messages?.length || 0);
						
						// 使用 $nextTick 确保 DOM 更新完成后再通知父组件
						this.$nextTick(() => {
							// 通知父组件加载成功
							this.$emit('loadChat', {
								chatId,
								success: true,
								data: result.data,
								conversation: result.conversation,
								chatMode: chatMode
							});
						});
						
					} else {
						console.error('聊天历史加载失败:', result.message);
						uni.showToast({
							title: result.message || '加载聊天历史失败',
							icon: 'none'
						});
						// 通知父组件加载失败
						this.$emit('loadChat', {
							chatId,
							success: false,
							message: result.message
						});
					}
				} catch (error) {
					// 隐藏加载提示
					uni.hideLoading();
					
					console.error('加载聊天历史异常:', error);
					console.error('错误详情:', error.stack);
					uni.showToast({
						title: '加载聊天历史失败，请重试',
						icon: 'none'
					});
					// 通知父组件加载异常
					this.$emit('loadChat', {
						chatId,
						success: false,
						message: error.message || '加载异常'
					});
				}
			},
			
			/**
			 * @description 删除历史记录
			 * @param {String} chatId - 聊天ID
			 * @param {Event} e - 事件对象，用于阻止冒泡
			 */
			async deleteChatHistory(chatId, e) {
				// 确保阻止事件冒泡，避免触发点击加载历史记录
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
				
				try {
					console.log('开始删除历史记录:', chatId);
					
					// 显示确认对话框
					const confirmResult = await new Promise((resolve) => {
						uni.showModal({
							title: '确认删除',
							content: '确定要删除这条对话记录吗？删除后无法恢复。',
							success: (res) => {
								resolve(res.confirm);
							},
							fail: () => {
								resolve(false);
							}
						});
					});
					
					if (!confirmResult) {
						console.log('用户取消删除操作');
						return;
					}
					
					// 显示加载提示
					uni.showLoading({
						title: '正在删除...',
						mask: true
					});
					
					// 通过 Vuex action 删除对话
					const result = await this.deleteConversation(chatId);
					
					// 隐藏加载提示
					uni.hideLoading();
					
					if (result.success) {
						console.log('删除历史记录成功:', chatId);
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
						
						// 通知父组件删除成功
						this.$emit('deleteChat', {
							chatId,
							success: true
						});
					} else {
						console.error('删除历史记录失败:', result.message);
						uni.showToast({
							title: result.message || '删除失败',
							icon: 'none'
						});
						
						// 通知父组件删除失败
						this.$emit('deleteChat', {
							chatId,
							success: false,
							message: result.message
						});
					}
				} catch (error) {
					// 隐藏加载提示
					uni.hideLoading();
					
					console.error('删除历史记录异常:', error);
					uni.showToast({
						title: '删除失败，请重试',
						icon: 'none'
					});
					
					// 通知父组件删除异常
					this.$emit('deleteChat', {
						chatId,
						success: false,
						message: error.message || '删除异常'
					});
				}
			},
			
			/**
			 * @description 处理滚动到底部事件
			 */
			onScrollToLower() {
				console.log('=== 滚动到底部事件触发 ===');
				console.log('当前页:', this.currentPage);
				console.log('总页数:', this.totalPages);
				console.log('是否有更多数据:', this.hasMoreData);
				console.log('是否正在加载:', this.isLoadingMore);
				console.log('分页是否在加载:', this.isPaginationLoading);
				console.log('=========================');
				
				// 如果有更多数据且当前没有在加载，则加载下一页
				if (this.hasMoreData && !this.isLoadingMore && !this.isPaginationLoading) {
					this.loadMoreData();
				} else if (!this.hasMoreData) {
					console.log('已经没有更多数据了');
				} else if (this.isLoadingMore || this.isPaginationLoading) {
					console.log('正在加载中，跳过本次请求');
				}
			},
			
			/**
			 * @description 加载更多数据
			 */
			async loadMoreData() {
				// 防抖处理
				if (this.loadMoreTimer) {
					clearTimeout(this.loadMoreTimer);
				}
				
				this.loadMoreTimer = setTimeout(async () => {
					try {
						console.log('=== 开始加载更多数据 ===');
						console.log('当前页码:', this.currentPage);
						console.log('即将加载页码:', this.currentPage + 1);
						
						this.isLoadingMore = true;
						
						// 显示加载提示
						uni.showToast({
							title: '正在加载更多...',
							icon: 'loading',
							duration: 2000,
							mask: false
						});
						
						// 通过 Vuex action 加载下一页数据
						const result = await this.nextPage();
						
						// 隐藏加载提示
						uni.hideToast();
						
						if (result.success) {
							console.log('=== 加载更多数据成功 ===');
							console.log('新增数据条数:', result.data?.length || 0);
							console.log('当前总数据条数:', this.conversations.length);
							console.log('分页信息:', result.pagination);
							console.log('========================');
							
							// 更新分组数据
							this.initConversationGroups();
							
							// 通知父组件加载成功
							this.$emit('loadMore', {
								success: true,
								data: result.data,
								pagination: result.pagination
							});
							
							// 如果没有更多数据了，显示提示
							if (!result.pagination?.hasNext) {
								setTimeout(() => {
									uni.showToast({
										title: '已加载全部数据',
										icon: 'success',
										duration: 1500
									});
								}, 500);
							}
						} else {
							console.error('=== 加载更多数据失败 ===');
							console.error('失败原因:', result.message);
							console.error('========================');
							
							uni.showToast({
								title: result.message || '加载更多失败',
								icon: 'none',
								duration: 2000
							});
							
							// 通知父组件加载失败
							this.$emit('loadMore', {
								success: false,
								message: result.message
							});
						}
						
					} catch (error) {
						console.error('=== 加载更多数据异常 ===');
						console.error('异常信息:', error);
						console.error('异常堆栈:', error.stack);
						console.error('========================');
						
						// 隐藏加载提示
						uni.hideToast();
						
						uni.showToast({
							title: '加载失败，请重试',
							icon: 'none',
							duration: 2000
						});
						
						// 通知父组件加载异常
						this.$emit('loadMore', {
							success: false,
							message: error.message || '加载异常'
						});
					} finally {
						this.isLoadingMore = false;
					}
				}, 300); // 300ms 防抖
			},
			
			/**
			 * @description 处理刷新事件
			 */
			async onRefresh() {
				console.log('开始刷新历史记录');
				this.isRefreshing = true;
				
				try {
					// 通过 Vuex action 刷新数据（重新加载当前页）
					const result = await this.refreshPage();
					
					if (result.success) {
						console.log('刷新历史记录成功:', result.data);
						uni.showToast({
							title: '刷新成功',
							icon: 'success',
							duration: 1000
						});
						
						// 通知父组件刷新成功
						this.$emit('refresh', {
							success: true,
							data: result.data,
							pagination: result.pagination
						});
					} else {
						console.error('刷新历史记录失败:', result.message);
						uni.showToast({
							title: result.message || '刷新失败',
							icon: 'none'
						});
						
						// 通知父组件刷新失败
						this.$emit('refresh', {
							success: false,
							message: result.message
						});
					}
					
				} catch (error) {
					console.error('刷新历史记录异常:', error);
					uni.showToast({
						title: '刷新失败，请重试',
						icon: 'none'
					});
					
					// 通知父组件刷新异常
					this.$emit('refresh', {
						success: false,
						message: error.message || '刷新异常'
					});
				} finally {
					// 延迟重置刷新状态，给用户足够的反馈时间
					setTimeout(() => {
						this.isRefreshing = false;
					}, 1000);
				}
			},
			
			/**
			 * @description 处理刷新恢复事件
			 */
			onRefreshRestore() {
				console.log('刷新恢复');
				this.isRefreshing = false;
			}
		},
		
		beforeDestroy() {
			// 清理定时器
			if (this.loadMoreTimer) {
				clearTimeout(this.loadMoreTimer);
			}
		}
	}
</script>

<style>
	.history-sidebar {
		position: fixed;
		top: 206rpx;
		left: 0;
		width: 66vw;
		height: calc(100vh - 88rpx);
		background-color: #ffffff;
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		z-index: 2000;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		padding-left: 32rpx;
		padding-right: 32rpx;
	}
	
	.history-sidebar.visible {
		transform: translateX(0);
	}
	
	.sidebar-header {
		padding: 30rpx 0 30rpx 0;
		display: flex;
		justify-content: flex-start;
		height: 80rpx;
	}
	
	.sidebar-title {
		font-size: 36rpx;
		color: rgba(47, 47, 47, 1);
		font-weight: 600;
		margin-left: 20rpx;
	}
	
	.history-list {
		flex: 1;
		height: calc(100vh - 168rpx);
		padding: 0;
		background-color: rgba(255, 255, 255, 1);
		/* 确保滚动功能正常工作 */
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
	
	.empty-history {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		color: #999;
	}
	
	.empty-history-text {
		color: #999;
		font-size: 28rpx;
	}
	
	.history-item-outer {
		width: 100%;
		border-radius: 16px;
		margin-bottom: 16rpx;
		box-sizing: border-box;
	}
	
	.history-item-outer-gradient {
		width: 100%;
		border-radius: 40rpx;
		padding: 2rpx 2rpx;
		box-sizing: border-box;
		background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
	}
	
	.history-item-inner {
		width: 100%;
		border-radius: 40rpx;
		background: #fff;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		position: relative;
		padding: 10rpx 20rpx;
		align-items: center;
		justify-content: space-between;
		transition: all 0.2s;
	}
	
	.history-item-outer.active .history-item-inner::after{
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, rgba(194, 221, 250, 0.1) 11.54%, rgba(34, 136, 249, 0.1) 111.54%);
	}
	
	.history-item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.history-title {
		font-family: PingFang SC;
		font-weight: 400;
		font-size: 26rpx;
		line-height: 120%;
		letter-spacing: -1.1rpx;
		color: rgba(0, 0, 0, 1);
		/* 单行文本截断 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 80%;
	}
	
	.history-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}
	
	.mode-badge {
		font-size: 22rpx;
		color: rgba(34, 136, 249, 0.8);
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		margin-right: 16rpx;
		background-color: rgba(34, 136, 249, 0.1);
		white-space: nowrap;
	}
	
	.history-delete {
		width: 28rpx;
		height: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		z-index: 1000;
	}
	
	.delete-icon-img {
		width: 28rpx;
		height: 28rpx;
	}
	
	.history-group-title {
		font-family: PingFang SC;
		font-weight: 600;
		font-size: 24rpx;
		line-height: 100%;
		letter-spacing: -1.1rpx;
		color: #888;
		font-weight: bold;
		padding: 20rpx 0 10rpx 0;
		margin-left: 20rpx;
		/* 确保分组标题也能被滚动 */
		position: relative;
	}
	
	.history-group {
		padding-bottom: 40rpx;
	}
	
	.load-more-container {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 0;
	}
	
	.load-more-item {
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
		background-color: rgba(34, 136, 249, 0.08);
		border: 2rpx solid rgba(34, 136, 249, 0.15);
		margin: 0 20rpx;
		transition: all 0.3s ease;
	}
	
	.load-more-item:active {
		background-color: rgba(34, 136, 249, 0.15);
		transform: scale(0.98);
	}
	
	.load-more-text {
		font-size: 26rpx;
		color: rgba(34, 136, 249, 0.8);
		font-weight: 500;
		text-align: center;
	}
	
	.load-more-text.no-more {
		color: #999;
		font-weight: 400;
	}
</style> 