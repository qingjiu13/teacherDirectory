<template>
	<view class="history-sidebar" :class="{visible: visible}">
		<view class="sidebar-header">
			<text class="sidebar-title">历史记录</text>
		</view>
		<scroll-view class="history-list" scroll-y="true">
			<view class="empty-history" v-if="historySummaries.length === 0">
				<text class="empty-history-text">暂无历史记录</text>
			</view>
			<view v-else>
				<view 
					v-for="(item, index) in historySummaries" 
					:key="item.id" 
					class="history-item"
					:class="{'active': currentChatId === item.id}"
					@click="loadChatHistory(item.id)">
					<view class="history-item-content">
						<text class="history-title">{{item.abstract || item.title || '对话 ' + (index + 1)}}</text>
						<text class="history-time">{{formatTime(item.updatedAt || item.createdAt)}}</text>
					</view>
					<view class="history-actions">
						<text class="mode-badge" v-if="item.chatMode">{{getModeLabel(item.chatMode)}}</text>
						<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
							<text class="delete-icon">×</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	
	/**
	 * @description 历史记录侧边栏组件
	 * @property {Boolean} visible - 侧边栏是否可见
	 * @event {Function} loadChat - 加载聊天历史记录
	 * @event {Function} deleteChat - 删除聊天历史记录
	 */
	export default {
		name: "HistorySidebar",
		props: {
			visible: {
				type: Boolean,
				default: false
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
			 * @description 历史聊天摘要数组（只包含ID、标题等基本信息）
			 * @returns {Array} 历史聊天摘要数组
			 */
			historySummaries() {
				// 添加防御性检查，确保 conversations 存在
				if (!this.conversations) {
					console.warn('conversations 是 undefined');
					return [];
				}
				
				try {
					return this.conversations.map(conv => ({
						id: conv.id,
						abstract: conv.abstract,
						chatMode: conv.chatMode,
						createdAt: conv.createdAt,
						updatedAt: conv.updatedAt
					}));
				} catch (e) {
					console.error('处理 historySummaries 出错:', e);
					return [];
				}
			},
			
			/**
			 * @description 当前选中的聊天ID
			 * @returns {String} 当前选中的聊天ID
			 */
			currentChatId() {
				return this.activeConversation;
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
		methods: {
			...mapActions({
				setActiveConversation: 'user/aiChat/setCurrentChat',
				deleteConversation: 'user/aiChat/deleteChat'
			}),
			
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
			
			/**
			 * @description 格式化时间
			 * @param {Date|String} time - 时间对象或时间字符串
			 * @returns {String} 格式化后的时间字符串
			 */
			formatTime(time) {
				if (!time) return '';
				
				const date = new Date(time);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			}
		}
	}
</script>

<style>
	.history-sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 66vw; /* 占屏幕宽度的2/3 */
		height: 100vh;
		background-color: #ffffff;
		transform: translateX(-100%);
		transition: transform 0.3s ease;
		z-index: 999;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}
	
	.history-sidebar.visible {
		transform: translateX(0);
	}
	
	.sidebar-header {
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
	}
	
	.sidebar-title {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}
	
	.history-list {
		flex: 1;
		height: calc(100vh - 80rpx);
		padding: 0;
		background-color: #f9f9f9;
	}
	
	.empty-history {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		color: #999;
	}
	
	.empty-history-text {
		color: #999;
		font-size: 28rpx;
	}
	
	.history-item {
		padding: 30rpx 20rpx;
		background-color: #ffffff;
		margin-bottom: 2rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f0f0f0;
		transition: all 0.2s;
	}
	
	.history-item:active {
		background-color: #f5f5f5;
	}
	
	.history-item.active {
		background-color: #e6f7ff;
		border-left: 4rpx solid #1890ff;
	}
	
	.history-item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.history-title {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		/* 单行文本截断 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 80%;
	}
	
	.history-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.history-actions {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.mode-badge {
		font-size: 22rpx;
		color: #fff;
		background-color: #1890ff;
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		margin-right: 16rpx;
	}
	
	.history-delete {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #f5f5f5;
	}
	
	.delete-icon {
		font-size: 36rpx;
		color: #ff4d4f;
		line-height: 1;
	}
</style> 