<template>
	<view class="message-item" :class="[type, {'streaming': streaming}]">
		<view class="message-header" v-if="type === 'ai'">
			<text class="ai-title">{{aiTitle}}</text>
		</view>
		<view class="message-content">
			<text>{{content}}</text>
		</view>
		<view class="message-status" v-if="status === 'sending'">
			<text class="sending-dots">...</text>
		</view>
		<view class="message-status" v-if="status === 'error'">
			<text class="error-text">发送失败</text>
			<view class="retry-btn" @click="onRetry">
				<text class="retry-btn-text">重试</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 消息项组件
	 * @property {String} type - 消息类型，可能的值：user(用户), ai(AI), system(系统)
	 * @property {String} content - 消息内容
	 * @property {String} status - 消息状态，可能的值：sending(发送中), sent(已发送), error(错误)
	 * @property {Boolean} streaming - 是否正在流式接收
	 * @property {String} aiTitle - AI消息的标题
	 * @event {Function} retry - 重试发送消息
	 */
	export default {
		name: "MessageItem",
		props: {
			type: {
				type: String,
				default: 'user',
				validator: (value) => ['user', 'ai', 'system'].includes(value)
			},
			content: {
				type: String,
				default: ''
			},
			status: {
				type: String,
				default: 'sent',
				validator: (value) => ['sending', 'sent', 'error'].includes(value)
			},
			streaming: {
				type: Boolean,
				default: false
			},
			aiTitle: {
				type: String,
				default: '研师录AI'
			}
		},
		methods: {
			/**
			 * @description 重试发送消息
			 */
			onRetry() {
				this.$emit('retry');
			}
		}
	}
</script>

<style>
	.message-item {
		max-width: 90%;
		margin-bottom: 30rpx;
		position: relative;
		animation: fadeIn 0.3s ease-in-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10rpx); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.message-item.user {
		align-self: flex-end;
	}
	
	.message-item.ai {
		align-self: flex-start;
	}
	
	.message-item.system {
		align-self: center;
		max-width: 70%;
		margin: 10rpx 0 30rpx;
	}
	
	.message-content {
		padding: 20rpx 30rpx;
		border-radius: 16rpx;
		font-size: 28rpx;
		line-height: 1.5;
		word-break: break-word;
	}
	
	.message-item.user .message-content {
		background-color: #1E90FF;
		color: #fff;
		border-radius: 16rpx 0 16rpx 16rpx;
	}
	
	.message-item.ai .message-content {
		background-color: #f0f0f0;
		color: #333;
		border-radius: 0 16rpx 16rpx 16rpx;
	}
	
	.message-item.system .message-content {
		background-color: rgba(0, 0, 0, 0.05);
		color: #666;
		border-radius: 30rpx;
		font-size: 24rpx;
	}
	
	.message-header {
		margin-bottom: 10rpx;
	}
	
	.ai-title {
		font-size: 24rpx;
		color: #666;
		padding-left: 10rpx;
	}
	
	.message-status {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.sending-dots {
		animation: dotsAnimation 1.5s infinite;
	}
	
	@keyframes dotsAnimation {
		0% { opacity: 0.3; }
		50% { opacity: 1; }
		100% { opacity: 0.3; }
	}
	
	.error-text {
		color: #ff4d4f;
		margin-right: 10rpx;
	}
	
	.retry-btn {
		padding: 5rpx 15rpx;
		background-color: #f0f0f0;
		border-radius: 10rpx;
	}
	
	.retry-btn-text {
		color: #1E90FF;
		font-size: 22rpx;
	}
	
	.message-item.streaming .message-content {
		position: relative;
	}
	
	.message-item.streaming .message-content::after {
		content: "|";
		display: inline-block;
		color: #1E90FF;
		animation: blink 1s step-end infinite;
		margin-left: 2rpx;
		font-weight: bold;
	}
	
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}
</style> 