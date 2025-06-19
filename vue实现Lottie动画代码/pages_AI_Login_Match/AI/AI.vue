<template>
    <!-- 加载状态指示器 -->
	<view class="loading-container" v-if="isLoading">
        <loading-animation
          src="https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
          width="150rpx" 
          height="150rpx"
          :showText="true"
          text="加载中..."
        ></loading-animation>
      </view>
	<view class="page-container" @click="onPageClick">
		<!-- 导航栏和侧边栏 -->
		<view class="nav-sidebar-container">
			<!-- 侧边栏遮罩层 -->
			<view class="sidebar-mask" v-if="sidebarVisible" @click.stop="closeSidebar" :style="{opacity: sidebarVisible ? 0.5 : 0}"></view>
			<Header :title="'AI助手'" @back="handleBack" />
			<!-- 历史记录侧边栏 -->
				<history-sidebar
					:visible="sidebarVisible"
					:grouped-history="groupedHistorySummaries"
					:current-chat-id="currentChatId"
					@load-chat="loadChatHistory"
					@delete-chat="deleteChatHistory">
				</history-sidebar>
			<!-- 主内容区域 -->
			<view class="main-wrapper">
				<!-- 顶部导航栏 -->
				<view class="nav-bar">
					<view class="nav-left">
						<view class="history-btn" @click.stop="toggleSidebar">
							<image src="../static/AIchat/chatHistory.png" class="history-icon" />
						</view>
					</view>
					<view class="nav-title">
						<mode-selector
							:current-mode="currentMode"
							:inNav="true"
							@mode-change="switchMode">
						</mode-selector>
					</view>
					<view class="nav-right">
						<view class="new-chat-btn" @click.stop="startNewChat">
							<image src="../static/AIchat/newChat.png" class="new-chat-icon" />
						</view>
					</view>
				</view>
				
				<!-- 主内容区域 -->
				<scroll-view scroll-y="true" class="main-content" @scroll="onScroll">
					<!-- 筛选区域 -->
					<view class="filter-section">
						<view class="filter-content">
							<!-- 学校筛选 -->
							<view class="filter-item">
								<view class="filter-item full-width">
								<text class="filter-label">所在学校：</text>
									<view class="choice-wrapper">
										<ChoiceSelected
										class="filter-select"
										componentType="undergraduate"
										:choiceIndex="schoolIndex"
										:choiceList="schoolOptions"
										defaultText="请选择学校"
										mode="search"
										searchPlaceholder="输入学校名称"
										@onChoiceClick="handleSchoolSelect"
										@search-input="handleSchoolSearch"
										ref="schoolDropdown"
									/>
									</view>
								</view>
							</view>
							
							<!-- 专业筛选 -->
							<view class="filter-item">
								<view class="filter-item full-width">
								<text class="filter-label">专业：</text>
									<view class="choice-wrapper">
										<ChoiceSelected
										class="filter-select"
										componentType="undergraduate"
										:choiceIndex="majorIndex"
										:choiceList="majorOptions"
										defaultText="请选择专业"
										mode="search"
										searchPlaceholder="输入专业名称"
										@onChoiceClick="handleMajorSelect"
										@search-input="handleMajorSearch"
										ref="majorDropdown"
									/>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 消息区域 -->
					<message-list
						:messages="messages"
						:auto-scroll-id="autoScrollId"
						@retry-message="retryMessage"
						@update-auto-scroll-id="autoScrollId = $event"
						ref="messageList">
					</message-list>
					
					<!-- 输入区域 -->
					<input-section
						:is-processing="isProcessing"
						@send="sendMessage">
					</input-section>
				</scroll-view>
			</view>
		</view>
		

	</view>
</template>

<script>
	import HistorySidebar from './ai-chat/HistorySidebar'
	import MessageList from './ai-chat/MessageList'
	import ModeSelector from './ai-chat/ModeSelector'
	import InputSection from './ai-chat/InputSection'
	import ChoiceSelected from '/pages_AI_Login_Match/components/combobox/combobox'
	import store from '@/store'
	import { mapState } from 'vuex';
	import Header from '@/components/navigationTitleBar/header.vue';
	import { Navigator } from '@/router/Router.js'
	import LoadingAnimation from '@/components/loading/LoadingAnimation.vue';

	
	
	// 消息类型常量
	const MESSAGE_TYPE = {
		USER: 'user',
		AI: 'AI',
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
		onPageScroll() {
			// 通知所有组件页面已滚动
			uni.$emit('page-scroll');
  		},
		components: {
			HistorySidebar,
			MessageList,
			ModeSelector,
			InputSection,
			ChoiceSelected,
			Header,
			LoadingAnimation
		},
		computed: {
			// 从Vuex获取状态
			...mapState('user/aiChat', {
				storeHistorySummaries: state => state.aiChat.historySummaries,
				storeHistoryChats: state => state.aiChat.conversations,
				storeActiveConversation: state => state.aiChat.activeConversation,
				storeChatMode: state => state.aiChat.chatMode,
				storeUserInfo: state => state.aiChat.userInfo
			}),
			
			// 当前选择的学校和专业 - 改为使用schoolMajorRequest模块
			currentSchool() {
				return this.$store.getters['user/schoolMajorRequest/selectedUndergraduateSchool'].name || '';
			},
			currentMajor() {
				return this.$store.getters['user/schoolMajorRequest/selectedUndergraduateMajor'].name || '';
			},
			currentSchoolId() {
				return this.$store.getters['user/schoolMajorRequest/selectedUndergraduateSchool'].id || null;
			},
			currentMajorId() {
				return this.$store.getters['user/schoolMajorRequest/selectedUndergraduateMajor'].id || null;
			},
			
			// 学校和专业选项列表 - 改为使用schoolMajorRequest模块
			schoolOptions() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'].map(item => item.name);
			},
			majorOptions() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'].map(item => item.name);
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
			},
			
			/**
			 * @description 按时间分组历史记录
			 * @returns {Object} { today: [], week: [], month: [] }
			 */
			groupedHistorySummaries() {
				const now = new Date();
				const today = [];
				const week = [];
				const month = [];
				
				(this.historySummaries || []).forEach(item => {
					const timeStr = item.updatedAt || item.createdAt;
					if (!timeStr) return;
					const time = new Date(timeStr);

					// 计算天数差
					const diffTime = now.getTime() - time.getTime();
					const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

					// 判断分组
					if (
						time.getFullYear() === now.getFullYear() &&
						time.getMonth() === now.getMonth() &&
						time.getDate() === now.getDate()
					) {
						today.push(item);
					} else if (diffDays < 7) {
						week.push(item);
					} else if (diffDays < 30) {
						month.push(item);
					}
				});
				return { today, week, month };
			}
		},
		data() {
			return {
				// 消息相关
				messages: [],
				isProcessing: false,
				isLoading: false,
				autoScrollId: '',
				
				// 对话模式
				currentMode: CHAT_MODE.GENERAL,
				
				// 学校和专业选择索引
				schoolIndex: -1,
				majorIndex: -1,
				
				// 搜索防抖定时器
				searchTimers: {
					school: null,
					major: null
				},
				
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
			},
			
			// 监听用户信息变化
			storeUserInfo: {
				handler(newVal) {
					if (newVal) {
						this.setUserSelectionIndexes();
					}
				},
				deep: true,
				immediate: true
			},
			
			// 监听学校选项变化，更新索引
			schoolOptions: {
				handler(newOptions) {
					this.updateSchoolIndex(newOptions);
				},
				immediate: true
			},
			
			// 监听专业选项变化，更新索引
			majorOptions: {
				handler(newOptions) {
					this.updateMajorIndex(newOptions);
				},
				immediate: true
			}
		},
		onLoad() {
			/**
			 * @description 页面加载时的处理逻辑
			 */
			// 获取用户信息并初始化
			this.syncUserInfoFromVuex();
			
			// 加载历史会话
			this.loadChatHistoryFromStorage();
		},
		onShow() {
			// 页面显示时刷新历史记录
			this.loadChatHistoryFromStorage();
			
			// 刷新用户信息
			this.syncUserInfoFromVuex();
		},
		onUnload() {
			// 页面卸载时中断请求
			this.abortCurrentRequest();
			
			// 清理防抖定时器
			Object.values(this.searchTimers).forEach(timer => {
				if (timer) clearTimeout(timer);
			});
		},
		methods: {
			/**
			 * @description 处理页面点击事件，关闭下拉框
			 */
			onPageClick() {
				this.closeAllDropdowns();
			},
			
			/**
			 * @description 关闭所有下拉框
			 */
			closeAllDropdowns() {
				const dropdowns = ['schoolDropdown', 'majorDropdown'];
				dropdowns.forEach(dropdown => {
					if (this.$refs && this.$refs[dropdown]) {
						this.$refs[dropdown].closeDropdown && this.$refs[dropdown].closeDropdown();
					}
				});
			},
			
			/**
			 * @description 从Vuex同步用户信息
			 */
			syncUserInfoFromVuex() {
				// 从Vuex获取用户信息
				if (this.storeUserInfo) {
					// 设置选中索引
					this.setUserSelectionIndexes();
				}
			},
			
			/**
			 * @description 根据用户信息设置学校和专业索引
			 */
			setUserSelectionIndexes() {
				if (!this.storeUserInfo) return;
				
				// 更新学校索引
				this.updateSchoolIndex(this.schoolOptions);
				
				// 更新专业索引
				this.updateMajorIndex(this.majorOptions);
				
				this.updateContextInfo();
			},
			
			/**
			 * @description 更新学校索引
			 * @param {Array} schoolOptions - 学校选项列表
			 */
			updateSchoolIndex(schoolOptions) {
				if (this.currentSchool && schoolOptions.length > 0) {
					const schoolIndex = schoolOptions.indexOf(this.currentSchool);
					this.schoolIndex = schoolIndex !== -1 ? schoolIndex : -1;
				} else {
					this.schoolIndex = -1;
				}
			},
			
			/**
			 * @description 更新专业索引
			 * @param {Array} majorOptions - 专业选项列表
			 */
			updateMajorIndex(majorOptions) {
				if (this.currentMajor && majorOptions.length > 0) {
					const majorIndex = majorOptions.indexOf(this.currentMajor);
					this.majorIndex = majorIndex !== -1 ? majorIndex : -1;
				} else {
					this.majorIndex = -1;
				}
			},
			
			/**
			 * @description 处理学校选择
			 * @param {Number} index - 选择的索引
			 * @param {String} school - 选择的学校名称
			 */
			handleSchoolSelect(index, school) {
				this.schoolIndex = index;
				
				// 通过Vuex更新选择
				const schoolOption = this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'].find(item => item.name === school);
				if (schoolOption) {
					this.$store.dispatch('user/schoolMajorRequest/selectUndergraduateSchool', {
						id: schoolOption.id,
						name: schoolOption.name
					});
				}
				
				// 更新上下文信息
				this.updateContextInfo();
			},
			
			/**
			 * @description 处理专业选择
			 * @param {Number} index - 选择的索引
			 * @param {String} major - 选择的专业名称
			 */
			handleMajorSelect(index, major) {
				this.majorIndex = index;
				
				// 通过Vuex更新选择
				const majorOption = this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'].find(item => item.name === major);
				if (majorOption) {
					this.$store.dispatch('user/schoolMajorRequest/selectUndergraduateMajor', {
						id: majorOption.id,
						name: majorOption.name
					});
				}
				
				// 更新上下文信息
				this.updateContextInfo();
			},
			
			/**
			 * @description 处理学校搜索输入（带防抖）
			 * @param {String} keyword - 搜索关键词
			 */
			handleSchoolSearch(keyword) {
				// 清除之前的定时器
				if (this.searchTimers.school) {
					clearTimeout(this.searchTimers.school);
				}
				
				// 设置防抖延迟500ms
				this.searchTimers.school = setTimeout(() => {
					this.performSchoolSearch(keyword);
				}, 500);
				
				console.log(`学校搜索防抖设置: "${keyword}"`);
			},
			
			/**
			 * @description 执行学校搜索
			 * @param {String} keyword - 搜索关键词
			 */
			async performSchoolSearch(keyword) {
				try {
					const response = await this.$store.dispatch('user/schoolMajorRequest/searchUndergraduateSchools', {
						keyword: keyword
					});
					
					console.log(`学校搜索完成: "${keyword}", 结果数: ${this.schoolOptions.length}`);
				} catch (error) {
					console.error('学校搜索失败:', error);
					uni.showToast({
						title: '学校搜索失败',
						icon: 'none'
					});
				}
			},
			
			/**
			 * @description 处理专业搜索输入（带防抖）
			 * @param {String} keyword - 搜索关键词
			 */
			handleMajorSearch(keyword) {
				// 清除之前的定时器
				if (this.searchTimers.major) {
					clearTimeout(this.searchTimers.major);
				}
				
				// 设置防抖延迟500ms
				this.searchTimers.major = setTimeout(() => {
					this.performMajorSearch(keyword);
				}, 500);
				
				console.log(`专业搜索防抖设置: "${keyword}"`);
			},
			
			/**
			 * @description 执行专业搜索
			 * @param {String} keyword - 搜索关键词
			 */
			async performMajorSearch(keyword) {
				try {
					const response = await this.$store.dispatch('user/schoolMajorRequest/searchUndergraduateMajors', {
						keyword: keyword
					});
					
					console.log(`专业搜索完成: "${keyword}", 结果数: ${this.majorOptions.length}`);
				} catch (error) {
					console.error('专业搜索失败:', error);
					uni.showToast({
						title: '专业搜索失败',
						icon: 'none'
					});
				}
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
					userSchoolId: this.currentSchoolId,
					userMajorId: this.currentMajorId
				};
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
						role: MESSAGE_TYPE.USER,
						content: messageContent,
						status: MESSAGE_STATUS.SENT
					});
					
					aiMessageIndex = this.messages.length;
					this.messages.push({
						role: MESSAGE_TYPE.AI,
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
				if (index < 1 || this.messages[index].role !== MESSAGE_TYPE.AI) {
					return;
				}
				
				const userMessage = this.messages[index - 1];
				if (userMessage.role !== MESSAGE_TYPE.USER) {
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
			 * @description 显示/隐藏加载状态
			 * @param {Boolean} loading - 是否显示加载状态，true表示显示，false表示隐藏
			 */
			toggleLoading(loading = true) {
				this.isLoading = loading;
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
					this.toggleLoading(true);
					
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
							let role = msg.role || MESSAGE_TYPE.AI;
							
							if (!msg.role && msg.id) {
								if (msg.id.includes('msg-user')) {
									role = MESSAGE_TYPE.USER;
								} else if (msg.id.includes('msg-system')) {
									role = MESSAGE_TYPE.SYSTEM;
								}
							}
							
							return {
								role: role,
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
				
				const firstUserMessage = this.messages.find(msg => msg.role === MESSAGE_TYPE.USER);
				const title = firstUserMessage ? firstUserMessage.content.substring(0, 20) : '新对话';
				
				const chatData = {
					id: this.currentChatId,
					title: title + (title.length >= 20 ? '...' : ''),
					abstract: title,
					chatMode: this.currentMode,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					messages: this.messages.map((msg, index) => ({
						id: `msg-${msg.role === MESSAGE_TYPE.USER ? 'user' : 'ai'}-${this.currentChatId}-${index}`,
						role: msg.role,
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
			},
			handleBack(){
				Navigator.toIndex()
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
		z-index: 1500;
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
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.sidebar-mask {
		position: fixed;
		top: 206rpx; /* 修改这里，让遮罩层从header下面开始 */
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1500;
		transition: opacity 0.3s ease;
	}

	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		transition: transform 0.3s ease, opacity 0.3s ease;
		background-color: #f5f5f5;
	}
	
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0; /* 去除左右内边距 */
		height: 100%;
		overflow-y: auto; /* 允许内容垂直滚动 */
	}
	
	/* 筛选区域样式 */
	.filter-section {
		background-color: #fff;
		border-radius: 15rpx;
		margin: 20rpx 0; /* 只保留上下间距，左右为0 */
		padding: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	.choice-wrapper {
		flex: 1;
		box-sizing: border-box;
		width: calc(100% - 150rpx); /* 考虑标签宽度和间距 */
		padding-right: 10rpx; /* 防止右侧超出边界 */
	}
	
	.filter-title text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}
	
	.filter-content {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.filter-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
	}
	
	.full-width {
		width: 100%;
	}
	
	.filter-label {
		font-size: 28rpx;
		color: #333;
		white-space: nowrap;
		margin-right: 10rpx;
		width: 140rpx; /* 改为固定宽度，不用min-width */
		padding-left: 10rpx;
		text-align: left;
		box-sizing: border-box;
	}
	
	.filter-select {
		width: 100%;
		border: 1px solid #e0e0e0;
		border-radius: 8rpx;
		box-sizing: border-box;
	}
	
	/* 导航栏样式 */
	.nav-bar {
		height: 90rpx;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: none; /* 移除底部边框 */
		position: relative;
		z-index: 11; /* 提高z-index，确保显示在筛选区域上方 */
	}
	
	.nav-left {
		width: 20%;
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
	
	/* 新增图片图标样式 */
	.history-icon {
		width: 22px;
		height: 15px;
		display: block;
		margin: 0 auto;
	}
	
	.nav-title {
		width: 60%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	
	.nav-title text {
		font-size: 32rpx; /* 增大字体 */
		color: #333;
		font-weight: 700; /* 加粗 */
	}
	
	.nav-right {
		width: 20%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
	.new-chat-btn {
		padding: 14rpx 28rpx;



		transition: all 0.3s;
	}
	

	
	/* 新增新对话图片图标样式 */
	.new-chat-icon {
		width: 15px;
		height: 15px;
		display: block;
		margin: 0 auto;
	}
	

</style>
