<template>
	<view class="input-section">
		<input class="message-input" 
			v-model="inputValue" 
			placeholder="请输入您的问题..." 
			:disabled="isProcessing"
			@confirm="sendMessage" />
		<button class="send-button" @click="sendMessage" :disabled="isProcessing || !inputValue.trim()">
			<text class="send-button-text">{{isProcessing ? '请稍候' : '发送'}}</text>
		</button>
	</view>
</template>

<script>
	/**
	 * @description 输入区域组件
	 * @property {Boolean} isProcessing - 是否正在处理消息
	 * @event {Function} send - 发送消息
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
			 * @description 发送消息
			 */
			sendMessage() {
				if (!this.inputValue.trim() || this.isProcessing) {
					return;
				}
				
				// 发送消息
				this.$emit('send', this.inputValue.trim());
				
				// 清空输入框
				this.inputValue = '';
			}
		}
	}
</script>

<style>
	/* 输入区域 */
	.input-section {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 10rpx;
		box-sizing: border-box;
	}
	
	.message-input {
		flex: 1;
		height: 80rpx;
		background-color: #ffffff;
		border: 2rpx solid #ddd;
		border-radius: 40rpx;
		padding: 0 30rpx;
		margin-right: 20rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}
	
	.send-button {
		width: 140rpx;
		height: 80rpx;
		background-color: #1E90FF;
		color: #fff;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		padding: 0;
		box-sizing: border-box;
		transition: all 0.3s; /* 添加过渡效果 */
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1); /* 添加阴影 */
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