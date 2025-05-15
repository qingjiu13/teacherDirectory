<template>
	<view class="history-sidebar" :class="{visible: visible}">
		<view class="sidebar-header">
			<text class="sidebar-title">历史记录</text>
		</view>
		<scroll-view class="history-list" scroll-y="true">
			<!-- 今天 -->
			<view v-if="groupedHistory.today && groupedHistory.today.length" class="history-group">
				<view class="history-group-title">今天</view>
				<view v-for="item in groupedHistory.today" :key="item.id" class="history-item-outer" :class="{'active': currentChatId === item.id}">
					<view v-if="currentChatId === item.id" class="history-item-outer-gradient" @click="loadChatHistory(item.id)">
						<view class="history-item-inner">
							<view class="history-item-content">
								<text class="history-title">{{item.abstract || item.title}}</text>
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
							<text class="history-title">{{item.abstract || item.title}}</text>
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
								<text class="history-title">{{item.abstract || item.title}}</text>
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
							<text class="history-title">{{item.abstract || item.title}}</text>
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
								<text class="history-title">{{item.abstract || item.title}}</text>
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
							<text class="history-title">{{item.abstract || item.title}}</text>
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
			<!-- 没有历史记录 -->
			<view class="empty-history" v-if="!hasAnyHistory">
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
				type: String,
				default: ''
			}
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
					// 使用更新时间作为分类依据
					const timestamp = conv.updatedAt || conv.createdAt;
					
					// 格式化时间戳用于调试
					const formattedDate = formatTimestamp(timestamp);
					console.log(`对话 ${conv.id} 的时间: ${formattedDate}, 时间戳: ${timestamp}`);
					
					if (timestamp >= today) {
						result.today.push(conv);
					} else if (timestamp >= weekAgo) {
						result.week.push(conv);
					} else if (timestamp >= monthAgo) {
						result.month.push(conv);
					}
				});
				
				// 按时间戳倒序排序（最新的在前面）
				['today', 'week', 'month'].forEach(key => {
					result[key].sort((a, b) => {
						const timeA = a.updatedAt || a.createdAt;
						const timeB = b.updatedAt || b.createdAt;
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
			// 在组件挂载时初始化对话分类
			this.initConversationGroups();
		},
		methods: {
			...mapActions({
				setActiveConversation: 'user/aiChat/setCurrentChat',
				deleteConversation: 'user/aiChat/deleteChat'
			}),
			
			/**
			 * @description 初始化对话分组
			 */
			initConversationGroups() {
				// 初始化对话分组，将分组结果通过事件发送给父组件
				const groupedConversations = this.groupedConversationsByDate;
				this.$emit('updateGroups', groupedConversations);
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
					'career': '职业规划'
				};
				return modeLabels[mode] || '通用';
			},
			
			/**
			 * @description 加载聊天历史
			 * @param {String} chatId - 聊天ID
			 */
			loadChatHistory(chatId) {
				// 通过 Vuex action 设置当前活跃的对话
				this.setActiveConversation(chatId);
				
				// 如果需要加载完整对话内容，还可以添加这个 action 调用
				// this.$store.dispatch('user/aiChat/loadChat', chatId);
				
				// 通知父组件
				this.$emit('loadChat', chatId);
			},
			
			/**
			 * @description 删除历史记录
			 * @param {String} chatId - 聊天ID
			 * @param {Event} e - 事件对象，用于阻止冒泡
			 */
			deleteChatHistory(chatId, e) {
				// 确保阻止事件冒泡，避免触发点击加载历史记录
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
				
				console.log('删除历史记录:', chatId);
				// 通过 Vuex action 删除对话
				this.deleteConversation(chatId);
				// 通知父组件
				this.$emit('deleteChat', chatId);
			},
			

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
		margin-bottom: 2rpx;
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
		line-height: 100%;
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
	}
	
	.mode-badge {
		font-size: 22rpx;
		color: rgba(34, 136, 249, 0.8);
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		margin-right: 16rpx;
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
		font-weight: 400;
		font-size: 24rpx;
		line-height: 100%;
		letter-spacing: -1.1rpx;
		color: #888;
		font-weight: bold;
		padding: 20rpx 0 10rpx 0;
		margin-left: 20rpx;
	}
	.history-group {
		padding-bottom: 40rpx;
	}
</style> 