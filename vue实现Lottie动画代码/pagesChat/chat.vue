<template>
	<view class="chat-container">
		<view class="chat-header">
			<view class="back-button" @click="goBack">
				<text>返回</text>
			</view>
			<text class="teacher-name">{{teacherName}}</text>
		</view>
		
		<scroll-view class="message-list" scroll-y="true" scroll-into-view="msg-bottom">
			<view class="message-wrapper" v-for="(message, index) in messages" :key="index">
				<view class="message" :class="message.isSelf ? 'self-message' : 'teacher-message'">
					<text class="message-content">{{message.content}}</text>
				</view>
			</view>
			<view id="msg-bottom" style="height: 20px;"></view>
		</scroll-view>
		
		<view class="input-area">
			<input type="text" class="message-input" v-model="inputMessage" placeholder="请输入消息..." />
			<button class="send-button" @click="sendMessage">发送</button>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			teacherId: '',
			teacherName: '老师',
			inputMessage: '',
			messages: [
				{
					content: '您好，我是您的专业辅导老师，有什么可以帮助您的？',
					isSelf: false
				}
			]
		}
	},
	
	computed: {
		/**
		 * 从Vuex获取老师信息
		 */
		...mapGetters('user/match', ['teacherInfo'])
	},
	
	onLoad(options) {
		if (options.userId) {
			this.teacherId = options.userId;
			// 加载教师信息
			this.loadTeacherInfo();
		}
		// 添加对teacherId参数的支持
		else if (options.teacherId) {
			this.teacherId = options.teacherId;
			this.teacherName = options.teacherName || '老师';
			// 获取完整教师信息
			this.loadTeacherInfo();
		}
	},
	methods: {
		/**
		 * 返回上一页
		 */
		goBack() {
			uni.navigateBack();
		},
		
		/**
		 * 加载教师信息
		 */
		loadTeacherInfo() {
			if (!this.teacherId) return;
			
			// 直接从Vuex中获取教师信息
			const teacherData = this.teacherInfo(this.teacherId);
			
			if (teacherData && teacherData.name) {
				this.teacherName = teacherData.name;
			} else {
				// 如果没有找到，使用本地备选数据
				this.getTeacherNameFromLocal();
			}
		},
		
		/**
		 * 从本地模拟数据获取教师姓名（作为后备方案）
		 */
		getTeacherNameFromLocal() {
			// 模拟获取教师信息
			const teachers = {
				'teacher001': '张老师',
				'teacher002': '李老师',
				'1': '王教授',
				'2': '李博士',
				'3': '张老师',
				'4': '刘教授',
				'5': '陈老师'
			};
			this.teacherName = teachers[this.teacherId] || '老师';
		},
		
		/**
		 * 发送消息
		 */
		sendMessage() {
			if (!this.inputMessage.trim()) return;
			
			// 添加自己的消息
			this.messages.push({
				content: this.inputMessage,
				isSelf: true
			});
			
			const userMessage = this.inputMessage;
			this.inputMessage = '';
			
			// 模拟教师回复
			setTimeout(() => {
				this.messages.push({
					content: `收到您的消息："${userMessage}"，我会尽快回复您。`,
					isSelf: false
				});
			}, 1000);
		}
	}
}
</script>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}
	
	.chat-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 15px 20px;
		background-color: #1E90FF;
	}
	
	.back-button {
		padding: 8px 15px;
		margin-right: 15px;
		background-color: rgba(255, 255, 255, 0.25);
		border-radius: 20px;
	}
	
	.back-button text {
		color: #ffffff;
		font-weight: 500;
		font-size: 16px;
	}
	
	.teacher-name {
		font-size: 18px;
		font-weight: bold;
		color: #ffffff;
	}
	
	.message-list {
		flex: 1;
		padding: 15px;
	}
	
	.message-wrapper {
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}
	
	.message {
		max-width: 70%;
		padding: 12px 15px;
		border-radius: 18px;
		word-break: break-all;
	}
	
	.self-message {
		align-self: flex-end;
		background-color: #DCF8C6;
		margin-left: auto;
	}
	
	.teacher-message {
		align-self: flex-start;
		background-color: #FFFFFF;
	}
	
	.message-content {
		font-size: 16px;
		line-height: 1.4;
	}
	
	.input-area {
		display: flex;
		padding: 10px 15px;
		background-color: #FFFFFF;
		border-top: 1px solid #E0E0E0;
	}
	
	.message-input {
		flex: 1;
		height: 40px;
		padding: 0 15px;
		background-color: #F0F0F0;
		border-radius: 20px;
		font-size: 16px;
	}
	
	.send-button {
		width: 80px;
		height: 40px;
		margin-left: 10px;
		background-color: #1E90FF;
		color: #FFFFFF;
		font-size: 16px;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
	}
</style>