<template>
	<view class="message-section">
		<scroll-view 
			scroll-y="true" 
			class="message-scroll" 
			:scroll-into-view="autoScrollId"
			@scrolltoupper="onScrollToUpper"
			@scroll="onScroll"
			ref="messageScroll">
			
			<view v-if="messages.length === 0" class="empty-message">
				<view class="empty-message-content">
					<image src="../../static/AIchat/welcomeImage.png" class="empty-message-image" mode="widthFix" />
					<text class="empty-message-title">欢迎使用研师录AI助手</text>
					<text class="empty-message-desc">请选择您的所在学校和专业，然后开始提问~</text>
				</view>
			</view>
			
			<view v-else class="message-list">
				<view v-for="(msg, index) in messages" 
					:key="index" 
					:id="'msg-' + index">
					<message-item 
						:role="msg.role"
						:content="msg.content"
						:status="msg.status"
						:streaming="msg.streaming"
						:ai-title="aiTitle"
						:user-avatar="userAvatar"
						:ai-avatar="aiAvatar"
						@retry="$emit('retryMessage', index)">
					</message-item>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import MessageItem from './MessageItem';
	import { mapState } from 'vuex';
	
	/**
	 * @description 消息列表组件
	 * @property {Array} messages - 消息列表数组
	 * @property {String} emptyText - 空消息提示文本
	 * @property {String} aiTitle - AI消息标题
	 * @property {String} autoScrollId - 自动滚动到的元素ID
	 * @event {Function} scrollToUpper - 滚动到顶部时触发
	 * @event {Function} scroll - 滚动时触发
	 * @event {Function} retryMessage - 重试发送消息
	 */
	export default {
		name: "MessageList",
		components: {
			MessageItem
		},
		props: {
			messages: {
				type: Array,
				default: () => []
			},
			emptyText: {
				type: String,
				default: '您可以开始提问了...'
			},
			aiTitle: {
				type: String,
				default: '研师录AI'
			},
			autoScrollId: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapState({
				userAvatar: state => state.user.baseInfo.avatar
			}),
			aiAvatar() {
				return '../../static/AIchat/welcomeImage.png';
			}
		},
		methods: {
			/**
			 * @description 处理滚动到顶部事件
			 * @param {Object} e - 事件对象
			 */
			onScrollToUpper(e) {
				this.$emit('scrollToUpper', e);
			},
			
			/**
			 * @description 处理滚动事件
			 * @param {Object} e - 事件对象
			 */
			onScroll(e) {
				this.$emit('scroll', e);
			},
			
			/**
			 * @description 滚动到底部
			 */
			scrollToBottom() {
				if (this.messages.length > 0) {
					this.$emit('updateAutoScrollId', 'msg-' + (this.messages.length - 1));
				}
			}
		}
	}
</script>

<style>
	.message-section {
		flex: 1;
		width: 100%;
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
		position: relative;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.message-scroll {
		height: 100%;
		padding: 30rpx;
	}
	
	.empty-message {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* 新增空消息内容样式 */
	.empty-message-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.empty-message-image {
		width: 180rpx;
		height: 180rpx;
		margin-bottom: 32rpx;
	}
	.empty-message-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 12rpx;
	}
	.empty-message-desc {
		font-size: 26rpx;
		color: #888;
		text-align: center;
	}
	
	.message-list {
		display: flex;
		flex-direction: column;
	}
	
	.ai-avatar {
		left: 10rpx;
		top: 0;
	}
	.user-avatar {
		right: 10rpx;
		top: 0;
	}
</style> 