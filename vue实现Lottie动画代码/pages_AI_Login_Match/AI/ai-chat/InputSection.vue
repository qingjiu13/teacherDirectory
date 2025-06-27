<template>
	<view class="input-section">
		<input class="message-input" 
			v-model="inputValue" 
			placeholder="请输入您的问题..." 
			:disabled="isProcessing"
			@confirm="sendMessage" />
		<button class="send-button" @click="sendMessage" :disabled="!inputValue.trim() || isProcessing">
			<text class="send-button-text">{{isProcessing ? '发送中...' : '发送'}}</text>
		</button>
	</view>
</template>

<script>
	/**
	 * @description 输入区域组件，支持流式传输
	 * @property {Boolean} isProcessing - 是否正在处理消息
	 * @property {String} chatMode - 聊天模式，用于设置topic
	 * @event {Function} processing-start - 开始处理消息
	 * @event {Function} processing-end - 结束处理消息
	 * @event {Function} message-sent - 消息发送完成事件
	 * @event {Function} stream-message - 流式消息片段事件
	 * @event {Function} stream-complete - 流式传输完成事件
	 * @event {Function} stream-error - 流式传输错误事件
	 */
	export default {
		name: "InputSection",
		props: {
			isProcessing: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: ''
			};
		},
		methods: {
			/**
			 * @description 发送消息并处理流式回复
			 */
			async sendMessage() {
				if (!this.inputValue.trim()) return;
				
				// 通知父组件开始处理
				this.$emit('processing-start');
				
				try {
					const result = await this.$store.dispatch('user/aiChat/sendQuestion', {
						content: this.inputValue.trim(),
						// 流式消息回调 - 接收每个消息片段
						onMessage: (messageInfo) => {
							// console.log('🔄 收到流式消息片段:', messageInfo);
							// console.log(`   - 片段内容: "${messageInfo.content}"`);
							// console.log(`   - 累积内容长度: ${messageInfo.fullContent ? messageInfo.fullContent.length : 0}`);
							// console.log(`   - 消息序号: ${messageInfo.messageCount || 0}`);
							// console.log(`   - 是否完成: ${messageInfo.isComplete}`);
							// console.log(`   - 会话ID: ${messageInfo.conversationId}`);
							
							// 通知父组件有新的流式消息片段
							this.$emit('stream-message', {
								content: messageInfo.content,
								fullContent: messageInfo.fullContent,
								isComplete: messageInfo.isComplete,
								conversationId: messageInfo.conversationId,
								messageCount: messageInfo.messageCount,
								isTimeout: messageInfo.isTimeout
							});
						},
						// 流式传输完成回调
						onComplete: (finalMessage) => {
							console.log('✅ 流式传输完成:', finalMessage);
							console.log(`   - 最终内容长度: ${finalMessage.content ? finalMessage.content.length : 0}`);
							console.log(`   - 总消息片段数: ${finalMessage.messageCount || 0}`);
							console.log(`   - 会话ID: ${finalMessage.conversationId}`);
							
							// 通知父组件流式传输完成
							this.$emit('stream-complete', {
								content: finalMessage.content,
								conversationId: finalMessage.conversationId,
								messageCount: finalMessage.messageCount,
								isTimeout: finalMessage.isTimeout
							});
						},
						// 错误处理回调
						onError: (error) => {
							console.error('❌ 流式传输错误:', error);
							
							// 通知父组件发生错误
							this.$emit('stream-error', error);
							
							// 显示错误提示
							uni.showToast({
								title: error.message || '发送失败',
								icon: 'none'
							});
						}
					});
					
					if (result.success) {
						// console.log('🎉 消息发送流程完成:', result);
						// console.log(`   - 最终数据: "${result.data}"`);
						// console.log(`   - 消息片段总数: ${result.messageCount || 0}`);
						// console.log(`   - 流式完成状态: ${result.isStreamComplete ? '✅' : '❌'}`);
						// console.log(`   - 是否超时: ${result.isTimeout ? '⚠️' : '✅'}`);
						// console.log(`   - 会话ID: ${result.conversationId}`);
						
						// 清空输入框
						this.inputValue = '';
						// 通知父组件消息发送成功
						this.$emit('message-sent', {
							...result,
							controller: result.controller // 传递控制器供外部使用
						});
					} else {
						console.error('❌ 消息发送失败:', result);
						// 显示错误信息
						uni.showToast({
							title: result.message || '发送失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('发送消息出错:', error);
					uni.showToast({
						title: '发送失败，请重试',
						icon: 'none'
					});
					
					// 通知父组件发生错误
					this.$emit('stream-error', {
						message: '发送失败，请重试'
					});
				} finally {
					// 通知父组件处理结束
					this.$emit('processing-end');
				}
			}
		}
	}
</script>

<style>
	/* 输入区域 */
	.input-section {
		width: 100%;
		height: 129rpx;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		background-color:rgba(255, 255, 255, 1);
		margin-top: 5rpx;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
	}
	
	.message-input {
		flex: 1;
		height: 52rpx;
		background-color: #ffffff;
		border: 2rpx solid rgba(151, 151, 151, 1);
		border-radius: 8px;
		margin-right: 30rpx;
		margin-left: 30rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		padding-left: 20rpx;
	}
	
	.send-button {
		width: 108rpx;
		height: 52rpx;
		background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
		color: #fff;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		padding: 0;
		margin-right: 30rpx;
		box-sizing: border-box;
		transition: all 0.3s; /* 添加过渡效果 */
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1); /* 添加阴影 */
		margin-top: 20rpx;
	}
	
	.send-button:disabled {
		background-color: #f0f0f0; /* 更改为浅灰色背景，与功能按钮一致 */
		color: #999; /* 更暗的文字颜色 */
		border: 2rpx solid #ddd; /* 添加边框 */
		box-shadow: none; /* 禁用状态不显示阴影 */
	}
	
	.send-button-text {
		font-size: 28rpx;
	}
</style> 