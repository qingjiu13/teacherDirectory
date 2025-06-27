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
					:pagination="pagination"
					@load-chat="handleLoadChat"
					@delete-chat="handleDeleteChat"
					@loadMore="handleLoadMore"
					@refresh="handleRefresh">
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
										:isLoadingMore="schoolSearchStatus.isLoading"
										:hasMoreData="schoolSearchStatus.hasMore"
										@onChoiceClick="handleSchoolSelect"
										@search-input="handleSchoolSearch"
										@load-more="handleSchoolLoadMore"
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
										:isLoadingMore="majorSearchStatus.isLoading"
										:hasMoreData="majorSearchStatus.hasMore"
										@onChoiceClick="handleMajorSelect"
										@search-input="handleMajorSearch"
										@load-more="handleMajorLoadMore"
										ref="majorDropdown"
									/>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 消息区域 -->
					<message-list
						:messages="currentMessages"
						:auto-scroll-id="autoScrollId"
						@retry-message="retryMessage"
						@update-auto-scroll-id="autoScrollId = $event"
						ref="messageList">
					</message-list>
					
					<!-- 输入区域 -->
					<input-section
						:is-processing="isProcessing"
						@processing-start="handleProcessingStart"
						@processing-end="handleProcessingEnd"
						@message-sent="handleMessageSent"
						@stream-message="handleStreamMessage"
						@stream-complete="handleStreamComplete"
						@stream-error="handleStreamError">
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
	import { mapState, mapActions } from 'vuex';
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
				storeHistorySummaries: state => state.aiChat.conversations.map(conversation => ({
					id: conversation.id,
					abstract: conversation.abstract,
					chatMode: conversation.chatMode,
					createdAt: conversation.createdAt,
					updatedAt: conversation.updatedAt
				})),
				storeHistoryChats: state => state.aiChat.conversations,
				storeActiveConversation: state => state.aiChat.activeConversation,
				storeChatMode: state => state.aiChat.chatMode,
				storePagination: state => state.aiChat.pagination
			}),
			
			// 获取当前对话的消息列表
			currentMessages() {
				return this.$store.getters['user/aiChat/currentMessages'] || [];
			},
			
			// 当前选择的学校和专业 - 使用schoolMajorRequest模块
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
			
			// 学校和专业选项列表 - 使用schoolMajorRequest模块
			schoolOptions() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateSchoolOptions'];
			},
			majorOptions() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateMajorOptions'];
			},
			
			// 学校和专业的加载状态
			schoolSearchStatus() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateSchoolSearchStatus'];
			},
			majorSearchStatus() {
				return this.$store.getters['user/schoolMajorRequest/undergraduateMajorSearchStatus'];
			},
			
			// 当前模式名称
			currentModeName() {
				const modeNames = {
					[CHAT_MODE.GENERAL]: '通用',
					[CHAT_MODE.SCHOOL]: '择校',
					[CHAT_MODE.CAREER]: '就业'
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
			
			// 分页相关计算属性
			pagination() {
				return this.storePagination;
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
				// 处理状态
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
			},
			
			// 监听当前选择的学校变化
			currentSchool: {
				handler() {
					this.updateSchoolIndex(this.schoolOptions);
				},
				immediate: true
			},
			
			// 监听当前选择的专业变化
			currentMajor: {
				handler() {
					this.updateMajorIndex(this.majorOptions);
				},
				immediate: true
			}
		},
		onLoad() {
			/**
			 * @description 页面加载时的处理逻辑
			 */
			// 初始化选择索引
			this.updateSelectionIndexes();
			
			// 加载第一页对话历史
			this.loadConversationHistoryData();
		},
		onShow() {
			// 页面显示时更新选择索引
			this.updateSelectionIndexes();
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
			// 映射 Vuex actions
			...mapActions({
				// AI Chat actions
				setCurrentChat: 'user/aiChat/setCurrentChat',
				sendQuestion: 'user/aiChat/sendQuestion',
				loadChat: 'user/aiChat/loadChat',
				deleteChat: 'user/aiChat/deleteChat',
				loadConversationHistory: 'user/aiChat/loadConversationHistory',
				// School Major Request actions
				searchUndergraduateSchools: 'user/schoolMajorRequest/searchUndergraduateSchools',
				searchUndergraduateMajors: 'user/schoolMajorRequest/searchUndergraduateMajors',
				selectUndergraduateSchool: 'user/schoolMajorRequest/selectUndergraduateSchool',
				selectUndergraduateMajor: 'user/schoolMajorRequest/selectUndergraduateMajor'
			}),
			
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
			 * @description 根据当前选择更新学校和专业索引
			 */
			updateSelectionIndexes() {
				// 更新学校索引
				if (this.currentSchool && this.schoolOptions.length > 0) {
					const schoolIndex = this.schoolOptions.findIndex(item => 
						(item.name || item.schoolName) === this.currentSchool
					);
					this.schoolIndex = schoolIndex !== -1 ? schoolIndex : -1;
				} else {
					this.schoolIndex = -1;
				}
				
				// 更新专业索引
				if (this.currentMajor && this.majorOptions.length > 0) {
					const majorIndex = this.majorOptions.findIndex(item => 
						(item.name || item.professionalName) === this.currentMajor
					);
					this.majorIndex = majorIndex !== -1 ? majorIndex : -1;
				} else {
					this.majorIndex = -1;
				}
				
				this.updateContextInfo();
			},
			
			/**
			 * @description 更新学校索引
			 * @param {Array} schoolOptions - 学校选项列表
			 */
			updateSchoolIndex(schoolOptions) {
				if (this.currentSchool && schoolOptions.length > 0) {
					const schoolIndex = schoolOptions.findIndex(item => 
						(item.name || item.schoolName) === this.currentSchool
					);
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
					const majorIndex = majorOptions.findIndex(item => 
						(item.name || item.professionalName) === this.currentMajor
					);
					this.majorIndex = majorIndex !== -1 ? majorIndex : -1;
				} else {
					this.majorIndex = -1;
				}
			},
			
			/**
			 * @description 处理学校选择
			 * @param {Number} index - 选择的索引
			 * @param {Object} school - 选择的学校对象
			 */
			handleSchoolSelect(index, school) {
				this.schoolIndex = index;
				
				// 直接使用传入的学校对象
				if (school && (school.id || school.schoolId)) {
					this.selectUndergraduateSchool({
						id: school.id || school.schoolId,
						name: school.name || school.schoolName
					});
				}
				
				this.updateContextInfo();
			},
			
			/**
			 * @description 处理专业选择
			 * @param {Number} index - 选择的索引
			 * @param {Object} major - 选择的专业对象
			 */
			handleMajorSelect(index, major) {
				this.majorIndex = index;
				
				// 直接使用传入的专业对象
				if (major && (major.id || major.professionalId)) {
					this.selectUndergraduateMajor({
						id: major.id || major.professionalId,
						name: major.name || major.professionalName
					});
				}
				
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
			},
			
			/**
			 * @description 执行学校搜索
			 * @param {String} keyword - 搜索关键词
			 */
			async performSchoolSearch(keyword) {
				try {
					await this.searchUndergraduateSchools({ keyword });
				} catch (error) {
					console.error('学校搜索失败:', error);
					this.showToast('学校搜索失败', 'none');
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
			},
			
			/**
			 * @description 执行专业搜索
			 * @param {String} keyword - 搜索关键词
			 */
			async performMajorSearch(keyword) {
				try {
					await this.searchUndergraduateMajors({ keyword });
				} catch (error) {
					console.error('专业搜索失败:', error);
					this.showToast('专业搜索失败', 'none');
				}
			},
			
			/**
			 * @description 切换对话模式
			 * @param {String} mode - 对话模式
			 */
			switchMode(mode) {
				if (this.currentMode === mode) return;
				
				this.currentMode = mode;
				this.startNewChat();
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
				console.log('=== 开始新对话 ===');
				console.log('当前模式:', this.currentMode);
				
				this.currentChatId = null;
				this.updateContextInfo();
				
				// 清空当前活跃对话ID，准备新对话
				this.$store.commit('user/aiChat/UPDATE_CURRENT_CONVERSATION', null);
				
				// 创建新对话（只设置状态，不创建任何临时内容）
				this.$store.commit('user/aiChat/CREATE_NEW_CONVERSATION', {
					chatMode: this.currentMode
				});
				
				console.log('新对话已准备就绪，等待用户发送消息');
				console.log('===============');
			},
			
			/**
			 * @description 处理开始处理事件
			 */
			handleProcessingStart() {
				this.isProcessing = true;
			},
			
			/**
			 * @description 处理结束处理事件
			 */
			handleProcessingEnd() {
				this.isProcessing = false;
				this.scrollToBottom();
			},
			
			/**
			 * @description 处理消息发送完成事件
			 * @param {Object} result - 发送结果
			 */
			handleMessageSent(result) {
				console.log('消息发送完成:', result);
				// 更新当前对话ID
				if (result.conversationId) {
					this.currentChatId = result.conversationId;
					// 更新Vuex中的activeConversation状态
					this.$store.commit('user/aiChat/UPDATE_CURRENT_CONVERSATION', result.conversationId);
				}
			},
			
			/**
			 * @description 处理流式消息片段事件
			 * @param {Object} messageInfo - 消息信息
			 */
			handleStreamMessage(messageInfo) {
				// 流式消息已经通过Vuex更新，这里可以添加额外的UI更新逻辑
				// 如果收到conversationId，立即更新状态
				if (messageInfo.conversationId && !this.currentChatId) {
					this.currentChatId = messageInfo.conversationId;
					this.$store.commit('user/aiChat/UPDATE_CURRENT_CONVERSATION', messageInfo.conversationId);
				}
				this.scrollToBottom();
			},
			
			/**
			 * @description 处理流式传输完成事件
			 * @param {Object} finalMessage - 最终消息
			 */
			handleStreamComplete(finalMessage) {
				console.log('流式传输完成:', finalMessage);
				// 更新当前对话ID（如果有新的conversationId）
				if (finalMessage.conversationId && finalMessage.conversationId !== this.currentChatId) {
					this.currentChatId = finalMessage.conversationId;
					// 更新Vuex中的activeConversation状态
					this.$store.commit('user/aiChat/UPDATE_CURRENT_CONVERSATION', finalMessage.conversationId);
					console.log('✅ 已更新当前对话ID为:', finalMessage.conversationId);
				}
				this.scrollToBottom();
			},
			
			/**
			 * @description 处理流式传输错误事件
			 * @param {Object} error - 错误信息
			 */
			handleStreamError(error) {
				console.error('流式传输错误:', error);
				this.showToast(error.message || '发送失败', 'none');
			},
			
			/**
			 * @description 重试发送失败的消息
			 * @param {Number} index - 消息索引
			 */
			retryMessage(index) {
				const messages = this.currentMessages;
				if (index < 1 || !messages[index] || messages[index].role !== MESSAGE_TYPE.AI) {
					return;
				}
				
				const userMessage = messages[index - 1];
				if (!userMessage || userMessage.role !== MESSAGE_TYPE.USER) {
					return;
				}
				
				// 重置AI消息状态
				this.$store.commit('user/aiChat/UPDATE_MESSAGE_CONTENT', {
					messageId: messages[index].id,
					content: '',
					streaming: true,
					status: 'sending'
				});
				
				// 使用sendQuestion action重试，但跳过添加用户消息
				this.isProcessing = true;
				this.$store.dispatch('user/aiChat/sendQuestion', {
					content: userMessage.content,
					skipUserMessage: true, // 跳过添加用户消息
					aiMessageId: messages[index].id, // 使用现有的AI消息ID
					onMessage: (messageInfo) => {
						this.handleStreamMessage(messageInfo);
					},
					onComplete: (finalMessage) => {
						this.handleStreamComplete(finalMessage);
					},
					onError: (error) => {
						this.handleStreamError(error);
					}
				}).finally(() => {
					this.isProcessing = false;
				});
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
				
				const messages = this.currentMessages;
				if (messages.length > 0) {
					this.autoScrollId = 'msg-' + (messages.length - 1);
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
			 * @param {Boolean} loading - 是否显示加载状态
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
			 * @description 加载对话历史数据
			 */
			async loadConversationHistoryData() {
				try {
					const response = await this.loadConversationHistory();
					if (response.success) {
						console.log('对话历史加载成功');
					} else {
						console.error('对话历史加载失败:', response.message);
					}
				} catch (error) {
					console.error('加载对话历史异常:', error);
				}
			},
			
			/**
			 * @description 处理侧边栏加载聊天事件
			 * @param {Object} data - 加载结果数据
			 */
			async handleLoadChat(data) {
				if (!data.success) {
					this.showToast(data.message || '加载聊天失败', 'none');
					return;
				}
				
				try {
					console.log('=== 加载旧对话 ===');
					console.log('加载的chatId:', data.chatId);
					
					this.toggleLoading(true);
					this.currentChatId = data.chatId;
					
					// 设置当前活跃对话ID
					this.$store.commit('user/aiChat/UPDATE_CURRENT_CONVERSATION', data.chatId);
					
					console.log('对话ID已设置为:', data.chatId);
					
					// 如果有聊天模式，更新当前模式
					if (data.data && data.data.chatMode) {
						this.currentMode = data.data.chatMode;
						this.updateContextInfo();
					}
					
					// 直接使用从后端加载的消息数据，不需要重新构建
					// 因为loadChat action已经处理了消息格式转换
					
					this.closeSidebar();
					
					this.$nextTick(() => {
						this.scrollToBottom();
					});
					
					console.log('旧对话加载完成');
					console.log('当前活跃对话ID:', this.$store.state.user.aiChat.activeConversation);
					console.log('当前消息数量:', this.currentMessages.length);
					console.log('===============');
					
				} catch (error) {
					console.error('处理加载聊天失败:', error);
					this.showToast('加载聊天失败', 'none');
				} finally {
					this.toggleLoading(false);
				}
			},
			
			/**
			 * @description 处理侧边栏删除聊天事件
			 * @param {Object} data - 删除结果数据
			 */
			handleDeleteChat(data) {
				if (data.success) {
					// 如果删除的是当前聊天，开始新聊天
					if (this.currentChatId === data.chatId) {
						this.startNewChat();
					}
				} else {
					this.showToast(data.message || '删除失败', 'none');
				}
			},
			
			/**
			 * @description 处理侧边栏加载更多事件
			 * @param {Object} data - 加载更多结果数据
			 */
			handleLoadMore(data) {
				if (!data.success) {
					this.showToast(data.message || '加载更多失败', 'none');
				}
			},
			
			/**
			 * @description 处理侧边栏刷新事件
			 * @param {Object} data - 刷新结果数据
			 */
			handleRefresh(data) {
				if (!data.success) {
					this.showToast(data.message || '刷新失败', 'none');
				}
			},
			
			/**
			 * @description 处理返回事件
			 */
			handleBack() {
				Navigator.toIndex();
			},
			
			/**
			 * @description 处理学校加载更多事件
			 */
			async handleSchoolLoadMore() {
				try {
					const currentKeyword = this.$store.state.user.schoolMajorRequest.undergraduateSchoolSearch.searchKeyword || '';
					await this.searchUndergraduateSchools({ 
						keyword: currentKeyword, 
						loadMore: true 
					});
				} catch (error) {
					console.error('加载更多学校失败:', error);
					this.showToast('加载更多学校失败', 'none');
				}
			},
			
			/**
			 * @description 处理专业加载更多事件
			 */
			async handleMajorLoadMore() {
				try {
					const currentKeyword = this.$store.state.user.schoolMajorRequest.undergraduateMajorSearch.searchKeyword || '';
					await this.searchUndergraduateMajors({ 
						keyword: currentKeyword, 
						loadMore: true 
					});
				} catch (error) {
					console.error('加载更多专业失败:', error);
					this.showToast('加载更多专业失败', 'none');
				}
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
	
	/* 加载容器 */
	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000; /* 确保在所有内容之上 */
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
