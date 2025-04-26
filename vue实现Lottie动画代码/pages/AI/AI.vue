<template>
	<view class="page-container" @click="onPageClick">
		<!-- 新增导航栏和侧边栏 -->
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
			
			<!-- 主内容包装器（包含导航栏和主内容） -->
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
						@scroll-to-upper="onScrollToUpper"
						@scroll="onScroll"
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
	import choiceSelected from '../../components/combobox/combobox'
	import HistorySidebar from '../../components/ai-chat/HistorySidebar'
	import MessageList from '../../components/ai-chat/MessageList'
	import FilterSection from '../../components/ai-chat/FilterSection'
	import ModeSelector from '../../components/ai-chat/ModeSelector'
	import InputSection from '../../components/ai-chat/InputSection'
	import store from '../../store'
	import universityData from '../../store/data/2886所大学.json'
	import { mapState, mapGetters, mapActions } from 'vuex';
	
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
			choiceSelected,
			HistorySidebar,
			MessageList,
			FilterSection,
			ModeSelector,
			InputSection
		},
		computed: {
			// 使用mapGetters从Vuex中获取状态
			...mapGetters('user/aiChat', [
				'testResult',
				'isTesting',
				'isLoading',
				'historySummaries',
				'historyChats',
				'activeConversation',
				'chatMode'
			]),
			
			// 当前选择的学校名称
			currentSchool() {
				return this.schoolIndex >= 0 ? this.schoolList[this.schoolIndex] : '';
			},
			// 当前选择的专业名称
			currentMajor() {
				return this.majorIndex >= 0 ? this.majorList[this.majorIndex].choiceItemContent : '';
			},
			// 获取当前模式名称
			currentModeName() {
				const modeNames = {
					[CHAT_MODE.GENERAL]: '通用',
					[CHAT_MODE.SCHOOL]: '择校',
					[CHAT_MODE.CAREER]: '职业规划'
				};
				return modeNames[this.currentMode] || '通用';
			}
		},
		data() {
			return {
				// 用户基本信息
				userInfo: {
					school: '',
					major: ''
				},
				
				// 消息相关
				messages: [],
				isProcessing: false, // 是否正在处理消息
				isFullLoading: false, // 是否显示全屏加载
				loadingText: '正在加载...',
				autoScrollId: '', // 用于自动滚动的ID
				
				// 对话模式
				currentMode: CHAT_MODE.GENERAL,
				
				// 学校和专业选择相关
				schoolIndex: -1,
				majorIndex: -1,
				schoolList: [], // 将从JSON文件加载
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
				
				// 当前会话的请求控制器
				currentController: null,
				
				// 自定义的上下文信息
				contextInfo: {},
				
				// 导航栏和侧边栏相关
				sidebarVisible: false,
				currentChatId: null // 当前会话ID
			}
		},
		watch: {
			// 监听activeConversation的变化
			activeConversation: {
				handler(newVal) {
					this.currentChatId = newVal;
				},
				immediate: true
			}
		},
		onLoad() {
			/**
			 * @description 页面加载时的处理逻辑
			 */
			// 将JSON中的大学数据转换为下拉框需要的格式
			this.loadUniversityData();
			
			// 尝试获取用户信息并初始化
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
			// 页面卸载时中断所有未完成的请求
			this.abortCurrentRequest();
		},
		onReady() {
			// 页面渲染完成后更新布局
			setTimeout(() => {
				this.updateLayout();
			}, 300);
		},
		methods: {
			// 使用mapActions从Vuex获取actions
			...mapActions('user/aiChat', [
				'testAIQA',
				'getHistoryChats',
				'loadChat',
				'saveChat',
				'deleteChat',
				'setCurrentChat',
				'updateChatMode',
				'updateUserInfo'
			]),
			
			/**
			 * @description 从JSON文件加载大学数据并转换为下拉框格式
			 */
			loadUniversityData() {
				try {
					// 直接使用大学数据字符串数组，不再创建对象
					this.schoolList = universityData;
					console.log('成功加载', this.schoolList.length, '所大学数据');
				} catch (error) {
					console.error('加载大学数据失败:', error);
					// 设置一个默认的学校列表，以防加载失败
					this.schoolList = ["北京大学", "清华大学", "复旦大学"];
					this.showToast('加载大学数据失败，使用默认列表');
				}
			},
			
			/**
			 * @description 处理页面点击事件，用于关闭所有打开的下拉框
			 */
			onPageClick() {
				// 关闭筛选区域的下拉框
				if (this.$refs && this.$refs.filterSection) {
					this.$refs.filterSection.closeAllDropdowns();
				}
			},
			
			/**
			 * @description 更新布局，解决可能的定位问题
			 */
			updateLayout() {
				// 微信小程序环境下特殊处理
				// #ifdef MP-WEIXIN
				// 这里可以添加特定于微信小程序的布局调整
				// #endif
			},
			
			/**
			 * @description 获取用户信息
			 */
			getUserInfo() {
				try {
					const userInfo = uni.getStorageSync('userInfo');
					if (userInfo) {
						let parsedInfo;
						
						// 检查userInfo是否已经是对象
						if (typeof userInfo === 'object' && userInfo !== null) {
							parsedInfo = userInfo;
						} else {
							// 尝试解析JSON字符串
							try {
								parsedInfo = JSON.parse(userInfo);
							} catch (parseError) {
								console.error('解析用户信息失败:', parseError);
								// 初始化默认值
								parsedInfo = {
									school: '',
									major: ''
								};
							}
						}
						
						this.userInfo = parsedInfo;
						
						// 根据保存的用户信息设置选择框的索引
						this.setUserSelectionIndexes();
					}
				} catch (e) {
					console.error('获取用户信息失败:', e);
					// 确保userInfo有默认值
					this.userInfo = {
						school: '',
						major: ''
					};
				}
			},
			
			/**
			 * @description 根据用户信息设置学校和专业的索引
			 */
			setUserSelectionIndexes() {
				// 确保userInfo存在且是对象
				if (!this.userInfo || typeof this.userInfo !== 'object') {
					this.userInfo = {
						school: '',
						major: ''
					};
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
					// 确保userInfo是有效的对象
					if (!this.userInfo || typeof this.userInfo !== 'object') {
						this.userInfo = {
							school: '',
							major: ''
						};
					}
					
					// 确保存储有效的JSON字符串
					uni.setStorageSync('userInfo', JSON.stringify(this.userInfo));
				} catch (e) {
					console.error('保存用户信息失败:', e);
					this.showToast('保存用户信息失败，可能影响后续对话');
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
				// 这里可以实现动态学校搜索逻辑
				// 如果需要额外处理，可以在这里添加
				console.log('正在搜索学校:', keyword);
				
				// 由于在combobox组件中已经实现了搜索功能，这里不需要额外处理
				// 但如果需要高级搜索功能（如按地区筛选），可以在这里实现
			},
			
			/**
			 * @description 切换对话模式
			 * @param {String} mode - 对话模式
			 */
			switchMode(mode) {
				if (this.currentMode === mode) return;
				
				this.currentMode = mode;
				this.updateContextInfo();
				this.addSystemMessage(`已切换到${this.currentModeName}模式`);
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
				this.setCurrentChat(this.currentChatId);
				this.addSystemMessage('开始新对话，请输入您的问题');
				this.closeSidebar();
			},
			
			/**
			 * @description 处理消息发送和重试的统一方法
			 * @param {String} messageContent - 消息内容
			 * @param {Number} [retryIndex] - 重试消息的索引，如果是新消息则为null
			 */
			async handleMessage(messageContent, retryIndex = null) {
				if (!messageContent || this.isProcessing) return;
				
				let userMessageIndex, aiMessageIndex;
				
				// 处理新消息或重试
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
					
					// 确保有当前会话ID
					if (!this.currentChatId) {
						this.currentChatId = 'chat_' + Date.now();
						this.setCurrentChat(this.currentChatId);
					}
					
					// 使用映射的action调用后端API
					const response = await this.testAIQA({
						question: messageContent,
						contextInfo: this.contextInfo,
						chatId: this.currentChatId
					});
					
					if (response.success) {
						this.messages[aiMessageIndex].content = response.data;
						this.messages[aiMessageIndex].status = MESSAGE_STATUS.SENT;
						this.saveChatHistory();
					} else {
						// 改进的错误处理：获取详细的错误信息
						const errorMessage = response.error?.message || response.message || '获取回复失败，请稍后重试';
						console.error('AI回复失败:', errorMessage, response.error);
						
						// 添加更有用的用户提示
						this.messages[aiMessageIndex].content = `抱歉，无法获取回复：${errorMessage}`;
						this.messages[aiMessageIndex].status = MESSAGE_STATUS.ERROR;
						
						// 如果是特定类型的错误，可以提供更具体的建议
						if (errorMessage.includes('网络') || errorMessage.includes('连接')) {
							this.showToast('网络连接异常，请检查您的网络设置', 'none', 3000);
						} else if (errorMessage.includes('超时')) {
							this.showToast('服务器响应超时，请稍后再试', 'none', 3000);
						} else if (errorMessage.includes('服务器')) {
							this.showToast('服务器暂时不可用，请稍后再试', 'none', 3000);
						} else {
							this.showToast(errorMessage, 'none', 3000);
						}
					}
				} catch (error) {
					// 捕获未处理的异常
					const errorMsg = error.message || '系统异常，请稍后再试';
					console.error('消息处理异常:', errorMsg, error);
					
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
				// 只能重试AI消息
				if (index < 1 || this.messages[index].type !== MESSAGE_TYPE.AI) {
					return;
				}
				
				// 获取对应的用户消息
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
				if (this.currentController) {
					// #ifndef MP-WEIXIN
					// 移除对已删除的services的引用
					if (this.currentController.abort && typeof this.currentController.abort === 'function') {
						this.currentController.abort();
					}
					// #endif
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
			 * @description 处理滚动到顶部事件
			 */
			onScrollToUpper(e) {
				// 滚动到顶部的处理逻辑
			},
			
			/**
			 * @description 处理滚动事件
			 */
			onScroll(e) {
				// 滚动事件处理逻辑
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
					
					// 通过Vuex从后端加载完整对话内容
					this.loadChat(chatId).then(response => {
						if (response.success) {
							// 设置当前会话ID（这个在action中已经设置了）
							this.currentChatId = chatId;
							
							// 替换当前消息列表为从后端获取的完整消息
							this.messages = response.data.messages || [];
							
							// 关闭侧边栏
							this.closeSidebar();
							
							// 滚动到底部
							this.$nextTick(() => {
								this.scrollToBottom();
							});
						} else {
							// 改进错误处理和提示
							const errorMsg = response.error?.message || response.message || '加载对话失败';
							console.error('加载对话失败:', errorMsg, response.error);
							this.showToast(`加载失败: ${errorMsg}`, 'none', 3000);
							
							// 如果后端错误导致无法加载对话，尝试创建新会话
							if (response.error?.statusCode >= 500) {
								this.startNewChat();
								this.showToast('服务器暂时不可用，已为您创建新对话', 'none', 3000);
							}
						}
					}).catch(error => {
						// 捕获未处理的异常
						console.error('加载对话异常:', error);
						this.showToast('加载对话时发生错误', 'none', 3000);
						this.startNewChat();
					}).finally(() => {
						this.toggleLoading(false);
					});
				} catch (error) {
					console.error('加载对话内容失败:', error);
					this.showToast('加载对话内容失败: ' + (error.message || '未知错误'));
					this.toggleLoading(false);
					this.startNewChat();
				}
			},
			
			/**
			 * @description 从Vuex加载历史会话摘要
			 */
			loadChatHistoryFromStorage() {
				// 从Vuex获取历史会话摘要列表
				this.getHistoryChats().then(response => {
					if (!response.success) {
						console.error('加载历史会话摘要失败:', response.error || response.message);
						this.showToast('加载历史对话记录失败，将使用本地缓存', 'none', 2000);
					}
				}).catch(error => {
					console.error('加载历史会话异常:', error);
				});
			},
			
			/**
			 * @description 保存聊天历史摘要到Vuex
			 */
			saveChatHistory() {
				if (!this.currentChatId || this.messages.length === 0) return;
				
				// 寻找第一条用户消息作为标题
				const firstUserMessage = this.messages.find(msg => msg.type === MESSAGE_TYPE.USER);
				const title = firstUserMessage ? firstUserMessage.content.substring(0, 20) : '新对话';
				
				// 创建聊天摘要对象
				const chatData = {
					id: this.currentChatId,
					title: title + (title.length >= 20 ? '...' : ''),
					abstract: title, // 添加abstract字段
					// 完整消息内容由后端存储，客户端只保存摘要信息
					createdAt: new Date(),
					updatedAt: new Date()
				};
				
				// 保存到Vuex
				this.saveChat(chatData);
			},
			
			/**
			 * @description 删除历史记录
			 * @param {String} chatId - 历史记录ID
			 */
			deleteChatHistory(chatId) {
				if (!chatId) {
					console.error('删除历史记录失败: 无效的chatId');
					this.showToast('删除失败: 无效的记录ID');
					return;
				}
				
				console.log('请求删除历史记录:', chatId);
				
				// 弹窗确认是否删除
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条对话记录吗？',
					success: (res) => {
						if (res.confirm) {
							// 显示加载提示
							uni.showLoading({
								title: '正在删除...',
								mask: true
							});
							
							// 使用映射的action删除历史记录
							this.deleteChat(chatId).then(response => {
								// 隐藏加载提示
								uni.hideLoading();
								
								if (response.success) {
									// 如果删除的是当前会话，则清空当前会话
									if (this.currentChatId === chatId) {
										this.startNewChat();
									}
									this.showToast('删除成功');
								} else {
									console.error('删除失败:', response.message || '未知错误', response.error);
									
									// 提供更明确的错误信息
									const errorMsg = response.error?.message || response.message || '删除失败';
									
									// 根据错误类型提供不同提示
									if (errorMsg.includes('网络') || errorMsg.includes('连接')) {
										this.showToast('网络连接异常，请稍后再试删除', 'none', 3000);
									} else if (errorMsg.includes('服务器')) {
										this.showToast('服务器暂时不可用，已在本地删除记录', 'none', 3000);
										// 即使后端删除失败，也从本地移除该会话
										if (this.currentChatId === chatId) {
											this.startNewChat();
										}
									} else {
										this.showToast(errorMsg, 'none', 3000);
									}
								}
							}).catch(error => {
								// 隐藏加载提示
								uni.hideLoading();
								
								console.error('删除过程发生异常:', error);
								this.showToast('删除失败: ' + (error.message || '系统错误'), 'none', 3000);
							});
						}
					}
				});
			},
			
			/**
			 * @description 格式化时间
			 * @param {Date|String} time - 时间对象或时间字符串
			 * @returns {String} 格式化后的时间字符串
			 */
			formatTime(time) {
				if (!time) return '';
				
				const date = new Date(time);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				
				return `${year}-${month}-${day} ${hours}:${minutes}`;
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
