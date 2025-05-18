<template>
	<view class="message-item" :class="[messageType, {'streaming': streaming}]">
		<view class="message-container">
			<!-- AI头像 -->
			<image v-if="messageType === 'ai'" :src="aiAvatar" class="avatar ai-avatar" mode="aspectFill" />
			
			<!-- 消息内容区 -->
			<view class="message-content-wrapper" :class="messageType + '-wrapper'">
				<view class="message-header" v-if="messageType === 'ai'">
					<text class="ai-title">{{aiTitle}}</text>
				</view>
				
				<!-- 消息卡片外层：渐变边框 -->
				<view class="card-outer" :class="messageType + '-card-outer-gradient'">
					<!-- 消息卡片内层：内容区 -->
					<view class="card-inner" :class="messageType + '-card-inner'">
						<view class="message-content" :class="messageType + '-content'">
							<text>{{content}}</text>
						</view>
					</view>
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
			
			<!-- 用户头像 -->
			<image v-if="messageType === 'user'" :src="userAvatar" class="avatar user-avatar" mode="aspectFill" />
		</view>
	</view>
</template>

<script>
	/**
	 * @description 消息项组件
	 * @property {String} role - 消息角色，可能的值：user(用户), AI(人工智能), system(系统)
	 * @property {String} content - 消息内容
	 * @property {String} status - 消息状态，可能的值：sending(发送中), sent(已发送), error(错误)
	 * @property {Boolean} streaming - 是否正在流式接收
	 * @property {String} aiTitle - AI消息的标题
	 * @property {String} userAvatar - 用户头像地址
	 * @property {String} aiAvatar - AI头像地址
	 * @event {Function} retry - 重试发送消息
	 */
	export default {
		name: "MessageItem",
		props: {
			role: {
				type: String,
				default: 'user',
				validator: (value) => ['user', 'AI', 'system'].includes(value)
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
			},
			/**
			 * @property {String} userAvatar - 用户头像地址
			 */
			userAvatar: {
				type: String,
				default: ''
			},
			/**
			 * @property {String} aiAvatar - AI头像地址
			 */
			aiAvatar: {
				type: String,
				default: ''
			}
		},
		computed: {
			/**
			 * @description 获取消息类型（小写），用于CSS类名
			 * @returns {String} 消息类型
			 */
			messageType() {
				// 将AI角色转换为小写ai用于CSS类名
				return this.role === 'AI' ? 'ai' : this.role;
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
		width: 100%;
		margin-bottom: 30rpx;
		position: relative;
		animation: fadeIn 0.3s ease-in-out;
		display: flex;
		flex-direction: column;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10rpx); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	/**
	 * @description 消息容器样式调整：增高容器高度，内容靠底部，头像靠顶部
	 */
	.message-container {
		width: 100%;
		display: flex;
		justify-content: center;
		position: relative;
		min-height: 180rpx; /* 增加最小高度，可根据实际需求调整 */
		align-items: flex-end; /* 让内容靠底部 */
	}
	
	/**
	 * @description 消息内容包裹区样式调整，使内容靠底部
	 */
	.message-content-wrapper {
		width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end; /* 让内容靠底部 */
	}
	
	.ai-wrapper {
		margin-right: auto; /* AI消息靠左 */
		padding-left: calc(142rpx); /* 预留AI头像宽度+20rpx空间 */
	}
	
	.user-wrapper {
		margin-left: auto; /* 用户消息靠右 */
		padding-right: calc(142rpx); /* 预留用户头像宽度+20rpx空间 */
	}
	
	.avatar {
		width: 142rpx;
		height: 110rpx;
		border-radius: 16rpx;
		object-fit: cover;
		position: absolute;
		top: 0;
	}
	
	.ai-avatar {
		left: 0; /* AI头像在左侧 */
	}
	
	.user-avatar {
		right: 0; /* 用户头像在右侧 */
	}
	
	/**
	 * @description 卡片外层：模拟渐变边框
	 */
	.card-outer {
		width: 100%;

		border-radius: 40rpx;
		padding: 2rpx; /* 边框宽度 */
		box-sizing: border-box;
		display: flex;
		align-items: stretch;
		justify-content: stretch;
		background: transparent;
	}
	
	/**
	 * @description 用户消息卡片外层渐变（蓝色系）
	 */
	.user-card-outer-gradient {
		background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
	}
	
	/**
	 * @description AI消息卡片外层渐变（紫色系）
	 */
	.ai-card-outer-gradient {
		background: linear-gradient(180deg, rgba(233, 234, 255, 1) 0%, rgba(95, 38, 247, 1) 100%);
	}
	
	/**
	 * @description 卡片内层：内容区（高度自适应，内容靠底部）
	 */
	.card-inner {
		width: 100%;
		border-radius: 40rpx;
		background: #fff;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end; /* 内容靠底部 */
		position: relative;
	}
	
	/**
	 * @description 用户消息卡片内层渐变遮罩
	 */
	.user-card-inner::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 39rpx;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
		z-index: 1;
	}
	
	/**
	 * @description AI消息卡片内层渐变遮罩
	 */
	.ai-card-inner::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 39rpx;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(224, 212, 255, 0.2) 11.54%, rgba(95, 38, 247, 0.2) 111.54%);
		z-index: 1;
	}
	
	.message-content {
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		line-height: 1.5;
		word-break: break-word;
		position: relative;
		z-index: 2;
	}
	
	.user-content {
		color: #2F2F2F;
	}
	
	.ai-content {
		color: #2F2F2F;
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