<template>
	<view class="tab-bar-wrapper">
		<view class="tab-bar">
			<view class="tab-item ai-tab" :class="{ active: pageName === 'AI' }" @click="switchPage('AI')">
				<image class="nav-icon" :src="getIconPath('AI')"></image>
				<text class="tab-text">AI</text>
			</view>
			<view class="tab-item index-tab" :class="{ active: pageName === 'index' }" @click="switchPage('index')">
				<image class="nav-icon" :src="getIconPath('index')"></image>
				<text class="tab-text">主页</text>
			</view>
			<view class="tab-item message-tab" :class="{ active: pageName === 'message' }" @click="switchPage('message')">
				<image class="nav-icon" :src="getIconPath('message')"></image>
				<text class="tab-text">消息</text>
			</view>
			<view class="tab-item mine-tab" :class="{ active: pageName === 'mine' }" @click="switchPage('mine')">
				<image class="nav-icon" :src="getIconPath('mine')"></image>
				<text class="tab-text">个人</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 底部导航栏组件
	 */
	import { Navigator, IndexRoutes, MessageRoutes, MineRoutes, AIRoutes } from '@/router/Router.js';
	
	export default {
		props: {
			pageName: {
				type: String,
				default: 'index'
			}
		},
		data() {
			return {
				/**
				 * @description 页面路径映射
				 */
				tabRoutes: {
					'index': IndexRoutes.INDEX,
					'AI': AIRoutes.AI_SERVER,
					'message': MessageRoutes.MESSAGE,
					'mine': MineRoutes.MINE
				},
				/**
				 * @description 页面图标路径映射
				 */
				iconPaths: {
					'index': {
						normal: '/static/image/tab-bar/wechat.png',
						active: '/static/image/tab-bar/default_avatar.png'
					},
					'AI': {
						normal: '/static/image/tab-bar/wechat.png',
						active: '/static/image/tab-bar/default_avatar.png'
					},
					'message': {
						normal: '/static/image/tab-bar/wechat.png',
						active: '/static/image/tab-bar/default_avatar.png'
					},
					'mine': {
						normal: '/static/image/tab-bar/wechat.png',
						active: '/static/image/tab-bar/default_avatar.png'
					}
				}
			}
		},
		methods: {
			/**
			 * @description 获取页面对应的图标路径
			 * @param {string} page - 页面名称
			 * @returns {string} 图标路径
			 */
			getIconPath(page) {
				const isActive = page === this.pageName;
				const iconConfig = this.iconPaths[page];
				return isActive ? iconConfig.active : iconConfig.normal;
			},
			
			/**
			 * @description 切换到指定页面
			 * @param {string} page - 页面名称
			 */
			switchPage(page) {
				// 如果已经在当前页面，不执行操作
				if (page === this.pageName) {
					return;
				}
				
				// 跳转前检查目标页面是否存在
				if (!this.tabRoutes[page]) {
					console.error('页面不存在:', page);
					return;
				}
				
				try {
					// 获取当前页面栈深度
					const pages = getCurrentPages();
					const stackDepth = pages.length;
					
					// 如果页面栈深度接近上限(8或以上)，使用reLaunch清空页面栈
					// 微信小程序页面栈上限为10
					if (stackDepth >= 8) {
						console.warn('页面栈接近上限，使用reLaunch清空页面栈');
						switch(page) {
							case 'index':
								Navigator.reLaunch(IndexRoutes.INDEX);
								break;
							case 'message':
								Navigator.reLaunch(MessageRoutes.MESSAGE);
								break;
							case 'mine':
								Navigator.reLaunch(MineRoutes.MINE);
								break;
							case 'AI':
								Navigator.reLaunch(AIRoutes.AI_SERVER);
								break;
							default:
								console.error('未知的页面类型:', page);
						}
						return;
					}
					
					// 修改：使用redirectTo而不是switchTab
					// redirectTo会关闭当前页面，跳转到应用内的某个页面
					switch(page) {
						case 'index':
							Navigator.redirectTo(IndexRoutes.INDEX);
							break;
						case 'message':
							Navigator.redirectTo(MessageRoutes.MESSAGE);
							break;
						case 'mine':
							Navigator.redirectTo(MineRoutes.MINE);
							break;
						case 'AI':
							Navigator.redirectTo(AIRoutes.AI_SERVER);
							break;
						default:
							console.error('未知的页面类型:', page);
					}
				} catch (e) {
					console.error('Tab切换失败:', e);
				}
			}
		}
	}
</script>

<style>
	.tab-bar-wrapper {
		width: 100%;
		height: 80px;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
	}
	
	.tab-bar {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 80px;
		border-top: 1px solid #eeeeee;
		background-color: #ffffff;
	}
	
	.tab-item {
		width: auto;
		padding: 0 10px;
		height: 55px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.nav-icon {
		width: 24px;
		height: 24px;
		margin-bottom: 3px;
	}
	
	.tab-text {
		font-size: 10px;
		color: #999999;
	}
	
	.active .tab-text {
		color: #007aff;
	}
	
	.tab-item.ai-tab {
		width: 40%;
	}
	.tab-item.index-tab {
		width: 20%;
	}
	.tab-item.message-tab {
		width: 20%;
	}
	.tab-item.mine-tab {
		width: 20%;
	}
</style> 