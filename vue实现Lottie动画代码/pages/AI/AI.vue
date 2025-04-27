<template>
	<view class="page-container" @click="onPageClick">
		<!-- 导航栏和侧边栏 -->
		<view class="nav-sidebar-container">
			<!-- 侧边栏遮罩层 -->
			<view class="sidebar-mask" v-if="sidebarVisible" @click.stop="closeSidebar" :style="{opacity: sidebarVisible ? 0.5 : 0}"></view>
			
			<!-- 历史记录侧边栏 -->
			<history-sidebar
				:visible="sidebarVisible"
				:history-summaries="historySummaries"
				:current-chat-id="currentChatId"
				@load-chat="loadChatHistory"
				@delete-chat="deleteChatHistory">
			</history-sidebar>
			
			<!-- 主内容区域 -->
			<view class="main-wrapper" :class="{shifted: sidebarVisible}">
				<!-- 顶部导航栏 -->
				<view class="nav-bar">
					<view class="nav-left">
						<view class="history-btn" @click.stop="toggleSidebar">
							<text class="iconfont">&#xe67c;</text>
						</view>
					</view>
					<view class="nav-title">
						<text>研师录AI</text>
					</view>
					<view class="nav-right">
						<view class="new-chat-btn" @click.stop="startNewChat">
							<text>新对话</text>
						</view>
					</view>
				</view>
				
				<!-- 主内容区域 -->
				<scroll-view scroll-y="true" class="main-content" @scroll="onScroll">
					<!-- 筛选区域 -->
					<filter-section
						:school-index="schoolIndex"
						:school-list="schoolList"
						:major-index="majorIndex"
						:major-list="majorList"
						@school-change="onSchoolClick"
						@major-change="onMajorClick"
						@school-search="onSchoolSearch"
						ref="filterSection">
					</filter-section>
					
					<!-- 消息区域 -->
					<message-list
						:messages="messages"
						:auto-scroll-id="autoScrollId"
						@retry-message="retryMessage"
						@update-auto-scroll-id="autoScrollId = $event"
						ref="messageList">
					</message-list>
					
					<!-- 功能模式区域 -->
					<mode-selector
						:current-mode="currentMode"
						@mode-change="switchMode">
					</mode-selector>
					
					<!-- 输入区域 -->
					<input-section
						:is-processing="isProcessing"
						@send="sendMessage">
					</input-section>
				</scroll-view>
			</view>
		</view>
		
		<!-- 加载提示 -->
		<view class="loading-mask" v-if="isFullLoading">
			<view class="loading-content">
				<text>{{loadingText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import HistorySidebar from '../../components/ai-chat/HistorySidebar'
	import MessageList from '../../components/ai-chat/MessageList'
	import FilterSection from '../../components/ai-chat/FilterSection'
	import ModeSelector from '../../components/ai-chat/ModeSelector'
	import InputSection from '../../components/ai-chat/InputSection'
	import store from '../../store'
	import universityData from '../../store/data/2886所大学.json'
	import { mapState } from 'vuex';
	
	// 消息类型常量
	const MESSAGE_TYPE = {
		USER: 'user',
		AI: 'ai',
		SYSTEM: 'system'
	}
	
	// 消息状态常量
	const MESSAGE_STATUS = {
		SENDING: 'sending',
		SENT: 'sent',
		ERROR: 'error'
	}
	
	// 对话模式常量
	const CHAT_MODE = {
		GENERAL: 'general',
		SCHOOL: 'school',
		CAREER: 'career'
	}
	
	export default {
		components: {
			HistorySidebar,
			MessageList,
			FilterSection,
			ModeSelector,
			InputSection
		},
		computed: {
			// 从Vuex获取状态
			...mapState('user/aiChat', {
				storeHistorySummaries: state => state.aiChat.historySummaries,
				storeHistoryChats: state => state.aiChat.conversations,
				storeActiveConversation: state => state.aiChat.activeConversation,
				storeChatMode: state => state.aiChat.chatMode
			}),
			
			// 当前选择的学校和专业
			currentSchool() {
				return this.schoolIndex >= 0 ? this.schoolList[this.schoolIndex] : '';
			},
			currentMajor() {
				return this.majorIndex >= 0 ? this.majorList[this.majorIndex].choiceItemContent : '';
			},
			
			// 当前模式名称
			currentModeName() {
				const modeNames = {
					[CHAT_MODE.GENERAL]: '通用',
					[CHAT_MODE.SCHOOL]: '择校',
					[CHAT_MODE.CAREER]: '职业规划'
				};
				return modeNames[this.currentMode] || '通用';
			},
			
			// 兼容计算属性
			historySummaries() {
				return this.storeHistorySummaries;
			},
			historyChats() {
				return this.storeHistoryChats || [];
			},
			activeConversation() {
				return this.storeActiveConversation;
			},
			chatMode() {
				return this.storeChatMode;
			}
		},
		data() {
			return {
				// 用户信息
				userInfo: {
					school: '',
					major: ''
				},
				
				// 消息相关
				messages: [],
				isProcessing: false,
				isFullLoading: false, 
				loadingText: '正在加载...',
				autoScrollId: '',
				
				// 对话模式
				currentMode: CHAT_MODE.GENERAL,
				
				// 学校和专业选择
				schoolIndex: -1,
				majorIndex: -1,
				schoolList: [],
				majorList: [
					{ choiceItemId: "jsjkx", choiceItemContent: "计算机科学" },
					{ choiceItemId: "rjgc", choiceItemContent: "软件工程" },
					{ choiceItemId: "sx", choiceItemContent: "数学" },
					{ choiceItemId: "wl", choiceItemContent: "物理" },
					{ choiceItemId: "hx", choiceItemContent: "化学" },
					{ choiceItemId: "sw", choiceItemContent: "生物" },
					{ choiceItemId: "jdxy", choiceItemContent: "机电工程" },
					{ choiceItemId: "dqxy", choiceItemContent: "电气工程" },
					{ choiceItemId: "jzxy", choiceItemContent: "建筑学" },
					{ choiceItemId: "lyxy", choiceItemContent: "临床医学" },
					{ choiceItemId: "yyxy", choiceItemContent: "药学" },
					{ choiceItemId: "glxy", choiceItemContent: "管理学" },
					{ choiceItemId: "jjxy", choiceItemContent: "经济学" },
					{ choiceItemId: "flxy", choiceItemContent: "法学" }
				],
				
				// 滚动相关
				isAutoScrollEnabled: true,
				
				// 当前会话控制器
				currentController: null,
				
				// 上下文信息
				contextInfo: {},
				
				// 导航栏和侧边栏
				sidebarVisible: false,
				currentChatId: null
			}
		},
		watch: {
			// 监听activeConversation的变化
			storeActiveConversation: {
				handler(newVal) {
					if (newVal && typeof newVal === 'object' && newVal.chatId) {
						this.currentChatId = newVal.chatId;
						if (newVal.chatMode) {
							this.currentMode = newVal.chatMode;
						}
					} else if (newVal) {
						this.currentChatId = newVal;
					}
				},
				immediate: true
			}
		},
		onLoad() {
			/**
			 * @description 页面加载时的处理逻辑
			 */
			// 加载大学数据
			this.loadUniversityData();
			
			// 获取用户信息并初始化
			this.getUserInfo();
			
			// 添加欢迎消息
			this.addSystemMessage('欢迎使用研师录AI助手，请选择您的所在学校和专业，然后开始提问');
			
			// 加载历史会话
			this.loadChatHistoryFromStorage();
		},
		onShow() {
			// 页面显示时刷新历史记录
			this.loadChatHistoryFromStorage();
		},
		onUnload() {
			// 页面卸载时中断请求
			this.abortCurrentRequest();
		},
		methods: {
			/**
			 * @description 从JSON文件加载大学数据
			 */
			loadUniversityData() {
				try {
					this.schoolList = universityData;
				} catch (error) {
					console.error('加载大学数据失败:', error);
					this.schoolList = ["北京大学", "清华大学", "复旦大学"];
				}
			},
			
			/**
			 * @description 处理页面点击事件，关闭下拉框
			 */
			onPageClick() {
				if (this.$refs && this.$refs.filterSection) {
					this.$refs.filterSection.closeAllDropdowns();
				}
			},
			
			/**
			 * @description 获取用户信息
			 */
			getUserInfo() {
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						let parsedInfo;
						
						if (typeof userInfo === 'object' && userInfo !== null) {
							parsedInfo = userInfo;
						} else {
							try {
								parsedInfo = JSON.parse(userInfo);
							} catch (parseError) {
								parsedInfo = { school: '', major: '' };
							}
						}
						
						this.userInfo = parsedInfo;
						this.setUserSelectionIndexes();
					}
				} catch (e) {
					this.userInfo = { school: '', major: '' };
				}
			},
			
			/**
			 * @description 根据用户信息设置学校和专业索引
			 */
			setUserSelectionIndexes() {
				if (!this.userInfo || typeof this.userInfo !== 'object') {
					this.userInfo = { school: '', major: '' };
					return;
				}
				
				if (this.userInfo.school) {
					const schoolIndex = this.schoolList.indexOf(this.userInfo.school);
					if (schoolIndex !== -1) {
						this.schoolIndex = schoolIndex;
					}
				}
				
				if (this.userInfo.major) {
					const majorIndex = this.majorList.findIndex(
						item => item.choiceItemContent === this.userInfo.major
					);
					if (majorIndex !== -1) {
						this.majorIndex = majorIndex;
					}
				}
			},
			
			/**
			 * @description 保存用户信息
			 */
			saveUserInfo() {
				try {
					if (!this.userInfo || typeof this.userInfo !== 'object') {
						this.userInfo = { school: '', major: '' };
					}
					uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
				} catch (e) {
					console.error('保存用户信息失败:', e);
				}
			},
			
			/**
			 * @description 学校选择事件处理
			 * @param {Number} position - 选择的索引位置
			 */
			onSchoolClick(position) {
				this.schoolIndex = position;
				this.userInfo.school = this.currentSchool;
				this.saveUserInfo();
				this.updateContextInfo();
			},
			
			/**
			 * @description 专业选择事件处理
			 * @param {Number} position - 选择的索引位置
			 */
			onMajorClick(position) {
				this.majorIndex = position;
				this.userInfo.major = this.currentMajor;
				this.saveUserInfo();
				this.updateContextInfo();
			},
			
			/**
			 * @description 处理学校搜索输入
			 * @param {String} keyword - 搜索关键词
			 */
			onSchoolSearch(keyword) {
				console.log('正在搜索学校:', keyword);
			},
			
			/**
			 * @description 切换对话模式
			 * @param {String} mode - 对话模式
			 */
			switchMode(mode) {
				if (this.currentMode === mode) return;
				
				this.currentMode = mode;
				this.messages = [];
				this.currentChatId = 'chat_' + Date.now();
				
				this.updateContextInfo();
				
				this.$store.dispatch('user/aiChat/setCurrentChat', {
					chatId: this.currentChatId,
					chatMode: this.currentMode
				});
				
				this.closeSidebar();
			},
			
			/**
			 * @description 更新对话上下文信息
			 */
			updateContextInfo() {
				this.contextInfo = {
					mode: this.currentMode,
					userSchool: this.currentSchool,
					userMajor: this.currentMajor
				};
			},
			
			/**
			 * @description 添加系统消息
			 * @param {String} content - 消息内容
			 */
			addSystemMessage(content) {
				this.messages.push({
					type: MESSAGE_TYPE.SYSTEM,
					content: content,
					status: MESSAGE_STATUS.SENT
				});
				this.scrollToBottom();
			},
			
			/**
			 * @description 开始新对话
			 */
			startNewChat() {
				this.messages = [];
				this.currentChatId = 'chat_' + Date.now();
				
				this.updateContextInfo();
				
				this.$store.dispatch('user/aiChat/setCurrentChat', {
					chatId: this.currentChatId,
					chatMode: this.currentMode
				});
				
				this.addSystemMessage('开始新对话，请输入您的问题');
				this.closeSidebar();
			},
			
			/**
			 * @description 处理消息发送和重试
			 * @param {String} messageContent - 消息内容
			 * @param {Number} [retryIndex] - 重试消息的索引
			 */
			async handleMessage(messageContent, retryIndex = null) {
				if (!messageContent || this.isProcessing) return;
				
				let userMessageIndex, aiMessageIndex;
				
				if (retryIndex === null) {
					// 新消息
					userMessageIndex = this.messages.length;
					this.messages.push({
						type: MESSAGE_TYPE.USER,
						content: messageContent,
						status: MESSAGE_STATUS.SENT
					});
					
					aiMessageIndex = this.messages.length;
					this.messages.push({
						type: MESSAGE_TYPE.AI,
						content: '',
						status: MESSAGE_STATUS.SENDING,
						streaming: false
					});
				} else {
					// 重试消息
					userMessageIndex = retryIndex - 1;
					aiMessageIndex = retryIndex;
					this.messages[aiMessageIndex].content = '';
					this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENDING;
					this.messages[aiMessageIndex].streaming = false;
				}
				
				this.scrollToBottom();
				this.isProcessing = true;
				
				try {
					this.updateContextInfo();
					
					if (!this.currentChatId) {
						this.currentChatId = 'chat_' + Date.now();
						this.$store.dispatch('user/aiChat/setCurrentChat', {
							chatId: this.currentChatId,
							chatMode: this.currentMode
						});
					}
					
					const response = await this.$store.dispatch('user/aiChat/testAIQA', {
						question: messageContent,
						contextInfo: this.contextInfo,
						chatId: this.currentChatId,
						chatMode: this.currentMode
					});
					
					if (response.success) {
						this.messages[aiMessageIndex].content = response.data;
						this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENT;
						this.saveChatHistory();
					} else {
						const errorMessage = response.error?.message || response.message || '获取回复失败，请稍后重试';
						this.messages[aiMessageIndex].content = `抱歉，无法获取回复：${errorMessage}`;
						this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
						
						this.showToast(errorMessage, 'none', 3000);
					}
				} catch (error) {
					const errorMsg = error.message || '系统异常，请稍后再试';
					this.messages[aiMessageIndex].content = `抱歉，发生了错误：${errorMsg}`;
					this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
					this.showToast(errorMsg, 'none', 3000);
				} finally {
					this.isProcessing = false;
					this.messages[aiMessageIndex].streaming = false;
					this.scrollToBottom();
				}
			},
			
			/**
			 * @description 发送消息
			 * @param {String} messageContent - 消息内容
			 */
			sendMessage(messageContent) {
				this.handleMessage(messageContent);
			},
			
			/**
			 * @description 重试发送失败的消息
			 * @param {Number} index - 消息索引
			 */
			retryMessage(index) {
				if (index < 1 || this.messages[index].type !== MESSAGE_TYPE.AI) {
					return;
				}
				
				const userMessage = this.messages[index - 1];
				if (userMessage.type !== MESSAGE_TYPE.USER) {
					return;
				}
				
				this.handleMessage(userMessage.content, index);
			},
			
			/**
			 * @description 中断当前请求
			 */
			abortCurrentRequest() {
				if (this.currentController && this.currentController.abort) {
					this.currentController.abort();
					this.currentController = null;
				}
			},
			
			/**
			 * @description 滚动到底部
			 */
			scrollToBottom() {
				if (!this.isAutoScrollEnabled) return;
				
				if (this.messages.length > 0) {
					this.autoScrollId = 'msg-' + (this.messages.length - 1);
				}
			},
			
			/**
			 * @description 处理滚动事件
			 */
			onScroll(e) {
				// 滚动事件处理
			},
			
			/**
			 * @description 显示提示
			 * @param {String} message - 提示信息
			 * @param {String} [icon='none'] - 提示图标
			 * @param {Number} [duration=2000] - 提示持续时间
			 */
			showToast(message, icon = 'none', duration = 2000) {
				uni.showToast({
					title: message,
					icon: icon,
					duration: duration
				});
			},
			
			/**
			 * @description 显示/隐藏加载提示
			 * @param {String|Boolean} text - 加载提示文本，如果为false则隐藏
			 */
			toggleLoading(text = '正在加载...') {
				if (text === false) {
					this.isFullLoading = false;
				} else {
					this.loadingText = text;
					this.isFullLoading = true;
				}
			},
			
			// 侧边栏相关方法
			toggleSidebar() {
				this.sidebarVisible = !this.sidebarVisible;
			},
			
			closeSidebar() {
				this.sidebarVisible = false;
			},
			
			/**
			 * @description 加载指定的聊天历史
			 * @param {String} chatId - 聊天历史ID
			 */
			loadChatHistory(chatId) {
				if (!chatId) return;
				
				try {
					this.toggleLoading('正在加载对话内容...');
					
					// 从本地状态找对话
					const conversations = this.historyChats || [];
					const conversation = conversations.find(chat => chat.id === chatId);
					
					if (conversation) {
						// 设置当前会话ID
						this.currentChatId = chatId;
						
						// 设置对话模式
						if (conversation.chatMode) {
							this.currentMode = conversation.chatMode;
							this.updateContextInfo();
						}
						
						// 构建消息列表
						const messages = conversation.messages ? conversation.messages.map(msg => {
							let type = MESSAGE_TYPE.AI;
							if (msg.id.includes('msg-user')) {
								type = MESSAGE_TYPE.USER;
							} else if (msg.id.includes('msg-system')) {
								type = MESSAGE_TYPE.SYSTEM;
							}
							
							return {
								type: type,
								content: msg.content,
								status: MESSAGE_STATUS.SENT,
								streaming: false
							};
						}) : [];
						
						this.messages = messages;
						this.closeSidebar();
						
						this.$nextTick(() => {
							this.scrollToBottom();
						});
						
						this.toggleLoading(false);
					} else {
						// 从服务器加载
						this.$store.dispatch('user/aiChat/loadChat', chatId).then(response => {
							if (response.success) {
								this.currentChatId = chatId;
								
								if (response.data.chatMode) {
									this.currentMode = response.data.chatMode;
									this.updateContextInfo();
								}
								
								this.messages = response.data.messages || [];
								this.closeSidebar();
								
								this.$nextTick(() => {
									this.scrollToBottom();
								});
							} else {
								const errorMsg = response.error?.message || response.message || '加载对话失败';
								this.showToast(`加载失败: ${errorMsg}`, 'none', 3000);
								
								if (response.error?.statusCode >= 500) {
									this.startNewChat();
								}
							}
						}).finally(() => {
							this.toggleLoading(false);
						});
					}
				} catch (error) {
					console.error('加载对话内容失败:', error);
					this.toggleLoading(false);
					this.startNewChat();
				}
			},
			
			/**
			 * @description 从Vuex加载历史会话摘要
			 */
			loadChatHistoryFromStorage() {
				const conversations = this.historyChats;
				
				if (conversations && conversations.length > 0) {
					const historySummaries = conversations.map(chat => ({
						id: chat.id,
						title: chat.abstract,
						abstract: chat.abstract,
						chatMode: chat.chatMode,
						createdAt: chat.createdAt,
						updatedAt: chat.updatedAt
					}));
					
					this.$store.commit('user/aiChat/SET_HISTORY_SUMMARIES', historySummaries);
				}
			},
			
			/**
			 * @description 保存聊天历史摘要到Vuex
			 */
			saveChatHistory() {
				if (!this.currentChatId || this.messages.length === 0) return;
				
				const firstUserMessage = this.messages.find(msg => msg.type === MESSAGE_TYPE.USER);
				const title = firstUserMessage ? firstUserMessage.content.substring(0, 20) : '新对话';
				
				const chatData = {
					id: this.currentChatId,
					title: title + (title.length >= 20 ? '...' : ''),
					abstract: title,
					chatMode: this.currentMode,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					messages: this.messages.map((msg, index) => ({
						id: `msg-${msg.type === MESSAGE_TYPE.USER ? 'user' : 'ai'}-${this.currentChatId}-${index}`,
						content: msg.content,
						timestamp: new Date().toISOString()
					}))
				};
				
				// 更新到Vuex
				this.$store.commit('user/aiChat/ADD_CONVERSATION', chatData);
				
				// 更新历史摘要
				const summaryData = {
					id: chatData.id,
					title: chatData.title,
					abstract: chatData.abstract,
					chatMode: chatData.chatMode,
					createdAt: chatData.createdAt,
					updatedAt: chatData.updatedAt
				};
				this.$store.commit('user/aiChat/ADD_HISTORY_SUMMARY', summaryData);
			},
			
			/**
			 * @description 删除历史记录
			 * @param {String} chatId - 历史记录ID
			 */
			deleteChatHistory(chatId) {
				if (!chatId) return;
				
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条对话记录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在删除...',
								mask: true
							});
							
							try {
								this.$store.commit('user/aiChat/REMOVE_CONVERSATION', chatId);
								this.$store.commit('user/aiChat/REMOVE_HISTORY_SUMMARY', chatId);
								
								uni.hideLoading();
								
								if (this.currentChatId === chatId) {
									this.startNewChat();
								}
								
								this.showToast('删除成功');
							} catch (error) {
								uni.hideLoading();
								this.showToast('删除失败: ' + (error.message || '系统错误'), 'none', 3000);
							}
						}
					}
				});
			}
		}
	}
</script>

<style>
	.page-container {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 0; /* 移除页面容器的内边距 */
		box-sizing: border-box;
		background-color: #f5f5f5;
		overflow: hidden; /* 防止内容溢出 */
	}
	
	/* 加载遮罩 */
	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	
	.loading-content {
		background-color: #ffffff;
		padding: 30rpx 60rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
	}
	
	.loading-content text {
		font-size: 28rpx;
		color: #333;
	}
	
	/* 侧边栏容器样式 */
	.nav-sidebar-container {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.sidebar-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 998;
		transition: opacity 0.3s ease;
	}
	
	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		transition: transform 0.3s ease, opacity 0.3s ease;
		background-color: #f5f5f5;
		padding-bottom: 20rpx; /* 底部增加内边距 */
	}
	
	.main-wrapper.shifted {
		transform: translateX(66vw);
		opacity: 0.85;
	}
	
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 20rpx; /* 仅添加左右内边距 */
		height: calc(100vh - 90rpx); /* 减去导航栏高度 */
		overflow-y: auto; /* 允许内容垂直滚动 */
	}
	
	/* 消息列表区域样式 */
	.message-list-container {
		flex: 1;
		padding: 20rpx 0;
		overflow-y: auto;
	}
	
	/* 导航栏样式 */
	.nav-bar {
		height: 90rpx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 20rpx;
		border-bottom: none; /* 移除底部边框 */
		position: relative;
		z-index: 11; /* 提高z-index，确保显示在筛选区域上方 */
	}
	
	.nav-left {
		width: 33%;
		display: flex;
		align-items: center;
	}
	
	.history-btn {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.history-btn .iconfont {
		font-size: 48rpx;
		color: #333;
	}
	
	/* 使用图标替代文字，如果没有图标字体可以使用以下替代样式 */
	.history-btn .iconfont:before {
		content: "≡"; /* 使用三横线作为菜单图标 */
	}
	
	.nav-title {
		width: 34%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.nav-title text {
		font-size: 36rpx;
		color: #333;
		font-weight: 500;
	}
	
	.nav-right {
		width: 33%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
	.new-chat-btn {
		padding: 14rpx 28rpx;
		background-color: #1E90FF;
		border-radius: 40rpx;
		box-shadow: 0 2rpx 8rpx rgba(30, 144, 255, 0.3);
		transition: all 0.3s;
	}
	
	.new-chat-btn:active {
		opacity: 0.8;
		transform: scale(0.98);
	}
	
	.new-chat-btn text {
		font-size: 28rpx;
		color: #fff;
	}
</style>
