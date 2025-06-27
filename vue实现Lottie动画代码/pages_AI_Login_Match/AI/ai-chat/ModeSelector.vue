<template>
	<view class="function-section" :class="{ 'nav-mode': inNav }">
		<view class="function-list nav-tab-list" v-if="inNav">
			<view class="function-item nav-tab-item"
				:class="{active: activeChatMode === 'general'}"
				@click="switchMode('general')">
				<text class="function-item-text nav-tab-text">通用</text>
				<view v-if="activeChatMode === 'general'" class="tab-underline"></view>
			</view>
			<view class="function-item nav-tab-item"
				:class="{active: activeChatMode === 'school'}"
				@click="switchMode('school')">
				<text class="function-item-text nav-tab-text">择校</text>
				<view v-if="activeChatMode === 'school'" class="tab-underline"></view>
			</view>
			<view class="function-item nav-tab-item"
				:class="{active: activeChatMode === 'career'}"
				@click="switchMode('career')">
				<text class="function-item-text nav-tab-text">职业规划</text>
				<view v-if="activeChatMode === 'career'" class="tab-underline"></view>
			</view>
		</view>
		<view class="function-list" v-else>
			<view class="function-item"
				:class="{active: activeChatMode === 'general'}"
				@click="switchMode('general')">
				<text class="function-item-text">通用</text>
			</view>
			<view class="function-item"
				:class="{active: activeChatMode === 'school'}"
				@click="switchMode('school')">
				<text class="function-item-text">择校</text>
			</view>
			<view class="function-item"
				:class="{active: activeChatMode === 'career'}"
				@click="switchMode('career')">
				<text class="function-item-text">职业规划</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	
	/**
	 * @description 功能模式选择组件
	 * @property {String} currentMode - 当前选中的模式（父组件传递，优先级低于Vuex状态）
	 * @property {Boolean} inNav - 组件是否在导航栏中显示
	 * @event {Function} modeChange - 模式变更事件
	 */
	export default {
		name: "ModeSelector",
		props: {
			currentMode: {
				type: String,
				default: 'general',
				validator: (value) => ['general', 'school', 'career'].includes(value)
			},
			inNav: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			/**
			 * @description 从 Vuex 状态中获取聊天模式
			 */
			...mapState({
				vuexChatMode: state => {
					try {
						return state.user && state.user.aiChat && state.user.aiChat.aiChat 
							? state.user.aiChat.aiChat.chatMode 
							: null;
					} catch (e) {
						console.error('获取 Vuex chatMode 状态出错:', e);
						return null;
					}
				}
			}),
			
			/**
			 * @description 计算当前活跃的聊天模式
			 * 优先使用 Vuex 中的状态，如果没有则使用父组件传递的 prop
			 * @returns {String} 当前活跃的聊天模式
			 */
			activeChatMode() {
				const mode = this.vuexChatMode || this.currentMode || 'general';
				console.log('ModeSelector activeChatMode 计算:', {
					vuexChatMode: this.vuexChatMode,
					currentMode: this.currentMode,
					activeChatMode: mode,
					timestamp: new Date().toLocaleTimeString()
				});
				return mode;
			}
		},
		watch: {
			/**
			 * @description 监听 Vuex 中的聊天模式变化
			 * @param {String} newMode - 新的聊天模式
			 * @param {String} oldMode - 旧的聊天模式
			 */
			vuexChatMode: {
				handler(newMode, oldMode) {
					console.log('ModeSelector vuexChatMode watch 触发:', {
						oldMode,
						newMode,
						activeChatMode: this.activeChatMode,
						timestamp: new Date().toLocaleTimeString()
					});
					
					// 强制触发响应式更新
					this.$forceUpdate();
					
					// 只有在真正发生变化且不是初始化时才处理
					if (newMode && oldMode && newMode !== oldMode) {
						console.log('ModeSelector 检测到 Vuex 聊天模式变化:', {
							oldMode,
							newMode,
							source: '外部变化（如历史记录加载）'
						});
						
						// 这里不需要emit modeChange，因为这是由外部变化引起的
						// 外部变化（如加载历史记录）不应该触发新对话创建
						// 只有用户主动点击切换按钮时才需要创建新对话
					}
				},
				immediate: false
			},
			
			/**
			 * @description 监听 activeChatMode 的变化，用于调试
			 * @param {String} newMode - 新的模式
			 * @param {String} oldMode - 旧的模式
			 */
			activeChatMode: {
				handler(newMode, oldMode) {
					console.log('ModeSelector activeChatMode 发生变化:', {
						oldMode,
						newMode,
						timestamp: new Date().toLocaleTimeString()
					});
				},
				immediate: true
			}
		},
		methods: {
			/**
			 * @description 切换对话模式
			 * @param {String} mode - 对话模式
			 */
			switchMode(mode) {
				console.log('switchMode 被调用:', {
					targetMode: mode,
					currentActiveChatMode: this.activeChatMode,
					vuexChatMode: this.vuexChatMode,
					shouldProceed: this.activeChatMode !== mode
				});
				
				if (this.activeChatMode === mode) {
					console.log('模式相同，跳过切换');
					return;
				}
				
				console.log('ModeSelector 用户主动切换模式:', {
					from: this.activeChatMode,
					to: mode
				});
				
				// 创建新对话状态 - 这会清空当前对话并设置新的聊天模式
				this.$store.commit('user/aiChat/CREATE_NEW_CONVERSATION', {
					chatMode: mode
				});
				
				// 验证状态是否已更新
				this.$nextTick(() => {
					console.log('switchMode 状态更新后验证:', {
						targetMode: mode,
						vuexChatMode: this.vuexChatMode,
						activeChatMode: this.activeChatMode,
						stateUpdated: this.vuexChatMode === mode
					});
					
					// 如果状态没有正确更新，强制更新
					if (this.vuexChatMode !== mode) {
						console.warn('状态更新失败，尝试直接更新 chatMode');
						this.$store.commit('user/aiChat/UPDATE_CHAT_MODE', mode);
						this.$forceUpdate();
					}
				});
				
				// 通知父组件模式已切换，需要开始新对话
				this.$emit('modeChange', {
					mode: mode,
					isNewConversation: true,
					action: 'switch'
				});
				
				console.log('已切换到新模式并准备新对话:', mode);
			}
		}
	}
</script>

<style>
	.function-section {
		width: 100%;
		padding: 15rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		box-sizing: border-box;
	}
	
	/* 导航栏内样式覆盖 */
	.function-section.nav-mode {
		padding: 0;
		margin: 0;
		background-color: transparent;
		box-shadow: none;
		border-radius: 0;
	}

	.function-list {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.function-item {
		padding: 15rpx 30rpx;
		border-radius: 30rpx;
		background-color: #f0f0f0;
		transition: all 0.3s;
	}

	/* 导航栏内Tab样式 */
	.nav-tab-list {
		width: 100%;
		background: transparent;
		justify-content: center;
		align-items: flex-end;
		border-bottom: 2rpx solid #e0e0e0;
		position: relative;
		padding: 0;
		margin: 0;
	}
	.nav-tab-item {
		background: transparent !important;
		border-radius: 0 !important;
		padding: 0 32rpx 0 32rpx !important;
		margin: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		height: 90rpx;
	}
	.nav-tab-text {
		font-size: 32rpx;
		color: rgba(0, 0, 0, 0.5);
		font-weight: 500;
		line-height: 90rpx;
	}
	.nav-tab-item.active .nav-tab-text {
		color: #5F26F7;
	}
	.tab-underline {
		position: absolute;
		bottom: -2rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 110rpx;
		height: 12rpx;
		background: #5F26F7;
		border-radius: 4rpx;
	}

	/* 导航栏内按钮样式调整 */
	.nav-mode .function-item {
		padding: 8rpx 20rpx;
		margin: 0 5rpx;
	}



	.function-item-text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.5);
		letter-spacing: -0.552147px;
	}

	.nav-mode .function-item-text {
		font-size: 28rpx;
	}

	.function-item.active .function-item-text {
		color: #5F26F7;
	}
</style> 