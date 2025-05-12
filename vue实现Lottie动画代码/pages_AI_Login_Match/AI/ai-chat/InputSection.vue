<template>
	<view class="input-section">
		<input class="message-input" 
			v-model="inputValue" 
			placeholder="请输入您的问题..." 
			:disabled="isProcessing"
			@confirm="sendMessage" />
		<button class="send-button" @click="sendMessage" :disabled="!inputValue.trim()">
			<text class="send-button-text">{{isProcessing ? '请稍候' : '确认'}}</text>
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