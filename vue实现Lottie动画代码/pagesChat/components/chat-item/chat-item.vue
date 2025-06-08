<template>
	<view class="chat-item" :class="active ? 'active' : ''">
		<!--rich-text中的表情包会屏蔽事件，所以这里用一个遮罩层捕获点击事件 -->
		<view class="mask" @tap="showChatBox()"></view>
		<view class="left">
			<HeadImage :url="chat.headImage" :name="chat.showName"></HeadImage>
		</view>
		<view class="chat-right">
			<view class="chat-name">
				<view class="chat-name-text">
					<view>{{ chat.showName }}</view>
				</view>
				<view class="chat-time">{{ formatTime(chat.lastSendTime, true) }}</view>
			</view>
			<view class="chat-content">
				<view class="chat-at-text">{{ atText }}</view>
				<view class="chat-send-name" v-if="isShowSendName">{{ chat.sendNickName + ':&nbsp;' }}</view>
				<rich-text class="chat-content-text" :nodes="transformEmoji(chat.lastContent)"></rich-text>
				<uni-badge v-if="chat.unreadCount > 0" :max-num="99" :text="chat.unreadCount" />
			</view>
		</view>
	</view>
</template>

<script>
// 导入date工具
import { toTimeText } from '../../common/date.js';
// 导入emoji工具
import emoUtil from '../../common/emotion.js';
// 导入头像组件
import HeadImage from '/pagesChat/components/head-image/head-image';
// 导入消息类型工具
import * as msgType from '/pagesChat/common/messageType.js';
// 导入消息类型常量
import { MESSAGE_TYPE } from '/pagesChat/common/enums.js';

export default {
	name: "chatItem",
	components: {
		HeadImage
	},
	data() {
		return {
			// 本地消息类型常量
			MESSAGE_TYPE
		}
	},
	props: {
		chat: {
			type: Object
		},
		index: {
			type: Number
		},
		active: {
			type: Boolean,
			default: false
		},
		chatStore: {
			type: Object,
			default: null
		}
	},
	// 确保能在模板中使用$msgType
	beforeCreate() {
		// 先检查全局属性是否可用
		if (!this.$msgType) {
			// 如果不可用，创建一个替代对象
			this.$msgType = msgType;
		}
	},
	methods: {
		/**
		 * 格式化时间显示
		 * @param {number} timestamp - 时间戳
		 * @param {boolean} simple - 是否简化显示
		 * @returns {string} 格式化后的时间字符串
		 */
		formatTime(timestamp, simple) {
			return toTimeText(timestamp, simple);
		},
		
		/**
		 * 转换文本中的表情符号
		 * @param {string} content - 包含表情符号的文本
		 * @returns {string} 转换后的HTML字符串
		 */
		transformEmoji(content) {
			if (!content) return '';
			return emoUtil.transform(content, 'emoji-img');
		},
		
		showChatBox() {
			// 初始化期间进入会话会导致消息不刷新
			if(!getApp().$vm.isInit || (this.chatStore && this.chatStore.isLoading && this.chatStore.isLoading())){
				uni.showToast({
					title: "正在初始化页面,请稍后...",
					icon: 'none'
				})
				return;
			}
			uni.navigateTo({
				url: "/pagesChat/chat-box?chatIdx=" + this.index
			})
		}
	},
	computed: {
		isShowSendName() {
			if (!this.chat.sendNickName) {
				return false;
			}
			let size = this.chat.messages ? this.chat.messages.length : 0;
			if (size == 0) {
				return false;
			}
			// 只有群聊的普通消息需要显示名称
			let lastMsg = this.chat.messages[size - 1];
			// 使用本地导入的msgType而不是依赖全局属性
			return msgType.isNormal(lastMsg.type);
		},
		atText() {
			if (this.chat.atMe) {
				return "[有人@我]"
			} else if (this.chat.atAll) {
				return "[@全体成员]"
			}
			return "";
		}
	}
}
</script>

<style scoped lang="scss">
.chat-item {
	height: 132rpx;
	display: flex;
	margin-bottom: 2rpx;
	position: relative;
	padding: 18rpx 20rpx;
	flex-direction: row;
	background-color: transparent;
	align-items: center;
	white-space: nowrap;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

	&:hover {
		background-color: $im-bg-active;
	}

	&.active {
		background-color: $im-bg-active;
	}

	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		z-index: 99;
	}

	.left {
		position: relative;
		display: flex;
		width: 100rpx;
		height: 100rpx;
		left: 20rpx;
		
	}

	.chat-right {
		height: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20rpx;
		text-align: left;
		overflow: hidden;

		.chat-name {
			display: flex;
			flex-direction: row;

			.chat-name-text {
				flex: 1;
				font-size: $im-font-size-large;
				white-space: nowrap;
				overflow: hidden;
				display: flex;
				text-align: left;
			}

			.chat-time {
				font-size: $im-font-size-smaller-extra;
				color: $im-text-color-lighter;
				text-align: right;
				white-space: nowrap;
				overflow: hidden;
			}
		}

		.chat-content {
			display: flex;
			font-size: $im-font-size-smaller;
			color: $im-text-color-lighter;
			padding-top: 8rpx;
			flex-direction: row;
			
			.chat-at-text {
				color: $im-color-danger;
			}

			.chat-send-name {
				font-size: $im-font-size-smaller;
			}

			.chat-content-text {
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

			}

		}
	}
}
</style>