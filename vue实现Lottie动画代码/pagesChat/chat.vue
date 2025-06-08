<template>
	<view class="background-image">
      <!--
        @file ./images/background1.png
        @description 登录页背景图1，分包页面通过相对路径./images/background1.png按需加载
      -->
      <image
        src="/static/image/bgPicture/background1.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
    <view class="background-image">
      <!--
        @file ./images/background.png
        @description 登录页背景图2，分包页面通过相对路径./images/background.png按需加载
      -->
      <image
        src="/static/image/bgPicture/background.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
  <view class="container"></view>
	<view class="tab-page">
		<!-- 搜索栏 -->
		<view class="nav-search">
			<uni-search-bar :focus="false" radius="100" v-model="searchText" cancelButton="none"
				placeholder="搜索" @input="onSearchInput"></uni-search-bar>
		</view>
		<view v-if="loading" class="chat-loading">
			<Loading :size="50" :mask="false">
				<view>消息接收中...</view>
			</Loading>
		</view>
		<view class="chat-tip" v-if="!loading && chats.length == 0">
			温馨提示：您现在还没有任何聊天消息，快去精确匹配寻找老师吧~
		</view>
		<scroll-view class="scroll-bar" v-if="!loading && chats.length > 0" scroll-with-animation="true" scroll-y="true" @scrolltolower="loadMoreChats">
			<view v-for="(chat, index) in showChats" :key="index">
				<LongPressMenu v-if="isShowChat(chat)" :items="menu.items" @select="onSelectMenu($event, index)">
					<ChatItem :chat="chat" :index="index" :active="menu.chatIdx == index" :chatStore="chatStore"></ChatItem>
				</LongPressMenu>
			</view>
			<view v-if="showChats.length === 0 && searchText" class="no-search-result">
				没有找到匹配"{{searchText}}"的聊天记录
			</view>
		</scroll-view>
		<tab-bar pageName="message"></tab-bar>
	</view>
</template>

<script>
// 引入模拟数据和服务
import mockChatService from './common/mockChatService.js';
import { initMockChatData, mockChats } from './common/mockData.js';
// 引入自定义的底部导航栏组件
import TabBar from '@/components/tab-bar/tab-bar.vue';
// 引入聊天项组件
import ChatItem from '@/pagesChat/components/chat-item/chat-item.vue';
// 引入长按菜单组件
import LongPressMenu from '@/pagesChat/components/long-press-menu/long-press-menu.vue';
// 引入加载组件
import Loading from '@/pagesChat/components/loading/loading.vue';
// 直接引入store获取函数
import { getChatStore } from './main.js';

export default {
	components: {
		ChatItem, // 注册聊天项组件
		TabBar, // 注册自定义底部导航栏组件
		LongPressMenu, // 注册长按菜单组件
		Loading // 注册加载组件
	},
	data() {
		return {
			searchText: "",
			menu: {
				show: false,
				style: "",
				chatIdx: -1,
				isTouchMove: false,
				items: [{
						key: 'DELETE',
						name: '删除该聊天',
						icon: 'trash',
						color: '#e64e4e'
					},
					{
						key: 'TOP',
						name: '置顶该聊天',
						icon: 'arrow-up'
					}
				]
			},
			chats: [],
			chatStore: null,
			// 是否使用模拟数据
			useMockData: true,
			isLoading: false,
			hasError: false,
			errorMessage: ''
		}
	},
	created() {
		// 直接使用导入的getChatStore函数获取chatStore
		try {
			this.chatStore = getChatStore();
			
			// 如果仍然无法获取，则尝试从globalProperties中获取
			if (!this.chatStore && this.$) {
				this.chatStore = this.$chatStore;
			}
			
			console.log('获取chatStore成功:', !!this.chatStore);
		} catch (error) {
			console.error('获取chatStore失败:', error);
			// 创建一个简单的替代对象
			this.chatStore = {
				chats: [],
				removeChat: this.mockRemoveChat.bind(this),
				moveTop: this.mockMoveToTop.bind(this),
				isLoading: () => this.isLoading
			};
		}
	},
	onLoad() {
		// 设置应用初始化状态
		if (getApp().$vm) {
			getApp().$vm.isInit = true;
		}
		
		// 加载聊天数据
		this.loadChats();
		
		// 打印日志，帮助调试
		console.log('Chat页面已加载，chats数据长度：', this.chats.length);
	},
	methods: {
		/**
		 * 加载聊天数据
		 */
		loadChats() {
			this.isLoading = true;
			console.log('chat.vue: 开始加载聊天数据');
			
			try {
				// 直接从mockChats加载数据
				this.chats = JSON.parse(JSON.stringify(mockChats));
				console.log('chat.vue: 直接从mockChats加载数据，共', this.chats.length, '条会话');
				
				// 将数据加载到chatStore中
				if (this.chatStore && this.chatStore.initChats) {
					this.chatStore.initChats({
						chats: this.chats,
						privateMsgMaxId: 5000,
						groupMsgMaxId: 6000
					});
					console.log('chat.vue: 数据已加载到chatStore');
				}
				
				// 设置聊天数据存储
				if (!this.chatStore) {
					this.chatStore = {
						chats: this.chats,
						removeChat: this.mockRemoveChat.bind(this),
						moveTop: this.mockMoveToTop.bind(this),
						isLoading: () => this.isLoading
					};
				}
				
				console.log('chat.vue: 聊天数据加载完成，共加载', this.chats.length, '条聊天记录');
			} catch (error) {
				console.error('chat.vue: 加载聊天数据失败', error);
				this.handleError(error, '加载聊天数据失败');
				// 创建默认数据以避免页面空白
				this.createDefaultMockData();
			} finally {
				this.isLoading = false;
				console.log('chat.vue: 数据加载状态已更新 isLoading =', this.isLoading);
			}
		},
		
		/**
		 * 创建默认模拟数据（当所有获取数据的方法都失败时使用）
		 */
		createDefaultMockData() {
			const now = new Date().getTime();
			
			this.chats = [
				{
					targetId: 1,
					type: 'PRIVATE',
					showName: '张老师',
					headImage: '/static/image/defaultAvatar/student-man.png',
					lastContent: '你好，有什么问题需要咨询吗？',
					lastSendTime: now - 10 * 60 * 1000, // 10分钟前
					unreadCount: 0,
					messages: [],
					atMe: false,
					atAll: false
				},
				{
					targetId: 2,
					type: 'PRIVATE',
					showName: '李同学',
					headImage: '/static/image/defaultAvatar/student-woman.png',
					lastContent: '老师，我已完成作业',
					lastSendTime: now - 30 * 60 * 1000, // 30分钟前
					unreadCount: 1,
					messages: [],
					atMe: false,
					atAll: false
				},
				{
					targetId: 101,
					type: 'GROUP',
					showName: '高三一班班级群',
					headImage: '/static/image/defaultAvatar/teacher-man.png',
					lastContent: '请同学们注意查看群公告',
					lastSendTime: now - 2 * 60 * 60 * 1000, // 2小时前
					unreadCount: 3,
					messages: [],
					atMe: true,
					atAll: false
				}
			];
			
			// 如果有chatStore，将数据加载到chatStore中
			if (this.chatStore && this.chatStore.initChats) {
				this.chatStore.initChats({
					chats: this.chats,
					privateMsgMaxId: 1000,
					groupMsgMaxId: 2000
				});
			}
		},
		
		/**
		 * 模拟删除会话
		 * @param {number} chatIdx - 会话索引
		 */
		mockRemoveChat(chatIdx) {
			if (chatIdx >= 0 && chatIdx < this.chats.length) {
				const chat = this.chats[chatIdx];
				
				// 尝试使用mockChatService的deleteChat方法
				try {
					mockChatService.deleteChat({
						type: chat.type,
						targetId: chat.targetId
					});
				} catch (e) {
					console.log('删除会话时出错，直接从本地数组移除', e);
				}
				
				// 从数组中移除
				this.chats.splice(chatIdx, 1);
			}
		},
		
		/**
		 * 模拟将会话置顶
		 * @param {number} chatIdx - 会话索引
		 */
		mockMoveToTop(chatIdx) {
			if (chatIdx > 0 && chatIdx < this.chats.length) {
				const chat = this.chats[chatIdx];
				
				// 直接在本地数组中移动位置
				this.chats.splice(chatIdx, 1);
				this.chats.unshift(chat);
				
				console.log('会话已置顶');
			}
		},
		
		onSelectMenu(item, chatIdx) {
			switch (item.key) {
				case 'DELETE':
					this.removeChat(chatIdx);
					break;
				case 'TOP':
					this.moveToTop(chatIdx);
					break;
				default:
					break;
			}
			this.menu.show = false;
		},
		
		removeChat(chatIdx) {
			if (this.chatStore && this.chatStore.removeChat) {
				this.chatStore.removeChat(chatIdx);
			} else {
				this.mockRemoveChat(chatIdx);
			}
		},
		
		moveToTop(chatIdx) {
			if (this.chatStore && this.chatStore.moveTop) {
				this.chatStore.moveTop(chatIdx);
			} else {
				this.mockMoveToTop(chatIdx);
			}
		},
		
		isShowChat(chat) {
			if (chat.delete) {
				return false;
			}
			return !this.searchText || chat.showName.includes(this.searchText)
		},
		
		/**
		 * 搜索输入变化时触发
		 */
		onSearchInput() {
			// 实时搜索
			console.log('搜索关键词:', this.searchText);
		},
		
		/**
		 * 加载更多聊天记录（下拉时触发）
		 */
		loadMoreChats() {
			console.log('加载更多聊天记录');
			// 模拟数据中无需实际加载更多
		},
		
		/**
		 * 处理错误
		 * @param {Error} error - 错误对象
		 * @param {string} message - 错误信息
		 */
		handleError(error, message) {
			this.hasError = true;
			this.errorMessage = message || '操作失败';
			console.error(message, error);
			
			// 显示错误提示
			uni.showToast({
				title: this.errorMessage,
				icon: 'none',
				duration: 2000
			});
		}
	},
	computed: {
		loading() {
			return this.isLoading;
		},
		initializing() {
			// 使用模拟数据时不显示初始化状态
			return false;
		},
		showChats() {
			if (!this.searchText) {
				return this.chats.filter(chat => !chat.delete);
			}
			
			// 搜索逻辑：匹配聊天名称或最后一条消息内容
			return this.chats.filter(chat => {
				if (chat.delete) return false;
				
				// 匹配聊天名称
				const nameMatch = chat.showName && chat.showName.toLowerCase().includes(this.searchText.toLowerCase());
				
				// 匹配最后一条消息内容
				const contentMatch = chat.lastContent && chat.lastContent.toLowerCase().includes(this.searchText.toLowerCase());
				
				return nameMatch || contentMatch;
			});
		}
	}
}
</script>

<style lang="scss">
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.background-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tab-page {
	position: relative;
	display: flex;
	flex-direction: column;
	padding-bottom: 120rpx; /* 为底部的 TabBar 留出空间 */
	height: 100vh;
	background-color: transparent;

	.nav-search {
		padding: 20rpx;
		background-color: transparent;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		margin-top: 100rpx;
	}

	.chat-tip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #999;
		width: 80%;
	}

	.no-search-result {
		padding: 40rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.chat-loading {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 120rpx;
		background: white;
		color: #999;

		.loading-box {
			position: relative;
		}
	}

	.scroll-bar {
		flex: 1;
		height: calc(100vh - 180rpx);
		background-color:transparent;
	}
}
</style>