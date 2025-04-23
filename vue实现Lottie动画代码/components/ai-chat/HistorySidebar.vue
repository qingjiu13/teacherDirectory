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
					<view class="history-delete" @click.stop="deleteChatHistory(item.id, $event)">
						<text class="delete-icon">×</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	/**
	 * @description 历史记录侧边栏组件
	 * @property {Boolean} visible - 侧边栏是否可见
	 * @property {Array} historySummaries - 历史聊天摘要数组（只包含ID和标题等基本信息）
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
			historySummaries: {
				type: Array,
				default: () => []
			},
			currentChatId: {
				type: String,
				default: ''
			}
		},
		methods: {
			/**
			 * @description 加载聊天历史
			 * @param {String} chatId - 聊天ID
			 */
			loadChatHistory(chatId) {
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
	
	.history-delete {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #f5f5f5;
		margin-left: 20rpx;
	}
	
	.delete-icon {
		font-size: 36rpx;
		color: #ff4d4f;
		line-height: 1;
	}
</style> 