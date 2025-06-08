<script>
import App from './App'
import http from './common/request';
import * as msgType from './common/messageType';
import * as enums from './common/enums';
import * as wsApi from './common/wssocket';
// 直接引入UNI_APP，不从.env.js导入
import UNI_APP from './main.js'
// 移除直接导入
// import useChatStore from './store/chatStore.js'
// import useFriendStore from './store/friendStore.js'
// import useConfigStore from './store/configStore.js'
// import useUserStore from './store/userStore.js'

export default {
	data() {
		return {
			isInit: false, // 是否已经初始化
			isExit: false, // 是否已退出
			audioTip: null,
			reconnecting: false, // 正在重连标志
			// store 引用会在created中初始化
			chatStore: null,
			friendStore: null,
			configStore: null,
			userStore: null,
			groupStore: null
		}
	},
	created() {
		// 在created中初始化store引用
		this.chatStore = this.$root.chatStore;
		this.friendStore = this.$root.friendStore;
		this.configStore = this.$root.configStore;
		this.userStore = this.$root.userStore;
		this.groupStore = this.$root.groupStore;
		
		// 如果没有获取到store引用，尝试使用getChatStore等函数
		if (!this.chatStore) {
			try {
				const { getChatStore, getFriendStore, getConfigStore, getUserStore, getGroupStore } = require('./main.js');
				this.chatStore = getChatStore();
				this.friendStore = getFriendStore();
				this.configStore = getConfigStore();
				this.userStore = getUserStore();
				this.groupStore = getGroupStore();
				console.log('App.vue: 通过导入的函数获取到Store');
			} catch (error) {
				console.error('App.vue: 获取Store失败', error);
			}
		}
		
		// 如果仍然无法获取，则从全局属性中获取
		if (!this.chatStore && this.$) {
			this.chatStore = this.$chatStore;
			this.friendStore = this.$friendStore;
			this.configStore = this.$configStore;
			this.userStore = this.$userStore;
			this.groupStore = this.$groupStore;
			console.log('App.vue: 从全局属性获取到Store');
		}
	},
	methods: {
		init() {
			this.reconnecting = false;
			this.isExit = false;
			// 直接初始化模拟数据
			this.initMockData();
			this.isInit = true;
		},
		// 初始化模拟数据
		initMockData() {
			// 导入模拟数据
			const { initMockChatData, getMockUserById, getMockGroupById, getMockCurrentUser } = require('./common/mockData.js');
			
			// 初始化聊天数据
			const chatData = initMockChatData();
			this.chatStore.initChats(chatData);
			
			// 初始化当前用户
			const currentUser = getMockCurrentUser();
			this.userStore.userInfo = currentUser;
			
			console.log('已成功初始化模拟数据', chatData);
		},
		// 为外部组件提供 store 获取方法
		getChatStore() {
			return this.chatStore;
		},
		getFriendStore() {
			return this.friendStore;
		},
		getConfigStore() {
			return this.configStore;
		},
		getUserStore() {
			return this.userStore;
		},
		getGroupStore() {
			return this.groupStore;
		},
		initWebSocket() {
			let loginInfo = uni.getStorageSync("loginInfo")
			wsApi.connect(UNI_APP.WS_URL, loginInfo.accessToken);
			wsApi.onConnect(() => {
				if (this.reconnecting) {
					// 重连成功
					this.onReconnectWs();
				} else {
					// 加载离线消息
					this.pullPrivateOfflineMessage(this.chatStore.privateMsgMaxId);
					this.pullGroupOfflineMessage(this.chatStore.groupMsgMaxId);

				}
			});
			wsApi.onMessage((cmd, msgInfo) => {
				if (cmd == 2) {
					// 异地登录，强制下线
					uni.showModal({
						content: '您已在其他地方登录，将被强制下线',
						showCancel: false,
					})
					this.exit();
				} else if (cmd == 3) {
					// 私聊消息
					this.handlePrivateMessage(msgInfo);
				} else if (cmd == 4) {
					// 群聊消息
					this.handleGroupMessage(msgInfo);
				} else if (cmd == 5) {
					// 系统消息
					this.handleSystemMessage(msgInfo);
				}
			});
			wsApi.onClose((res) => {
				console.log("ws断开", res);
				// 重新连接
				this.reconnectWs();

			})
		},
		loadStore() {
			return this.userStore.loadUser().then(() => {
				const promises = [];
				promises.push(this.friendStore.loadFriend());
				promises.push(this.groupStore.loadGroup());
				promises.push(this.chatStore.loadChat());
				promises.push(this.configStore.loadConfig());
				return Promise.all(promises);
			})
		},
		unloadStore() {
			this.friendStore.clear();
			this.groupStore.clear();
			this.chatStore.clear();
			this.configStore.clear();
			this.userStore.clear();
		},
		pullPrivateOfflineMessage(minId) {
			this.chatStore.setLoadingPrivateMsg(true)
			http({
				url: "/message/private/pullOfflineMessage?minId=" + minId,
				method: 'GET'
			}).catch(() => {
				this.chatStore.setLoadingPrivateMsg(false)
			})
		},
		pullGroupOfflineMessage(minId) {
			this.chatStore.setLoadingGroupMsg(true)
			http({
				url: "/message/group/pullOfflineMessage?minId=" + minId,
				method: 'GET'
			}).catch(() => {
				this.chatStore.setLoadingGroupMsg(false)
			})
		},
		handlePrivateMessage(msg) {
			// 标记这条消息是不是自己发的
			msg.selfSend = msg.sendId == this.userStore.userInfo.id;
			// 好友id
			let friendId = msg.selfSend ? msg.recvId : msg.sendId;
			// 会话信息
			let chatInfo = {
				type: 'PRIVATE',
				targetId: friendId
			}
			// 消息加载标志
			if (msg.type == enums.MESSAGE_TYPE.LOADING) {
				this.chatStore.setLoadingPrivateMsg(JSON.parse(msg.content))
				return;
			}
			// 消息已读处理，清空已读数量
			if (msg.type == enums.MESSAGE_TYPE.READED) {
				this.chatStore.resetUnreadCount(chatInfo);
				return;
			}
			// 消息回执处理,改消息状态为已读
			if (msg.type == enums.MESSAGE_TYPE.RECEIPT) {
				this.chatStore.readedMessage({
					friendId: msg.sendId
				})
				return;
			}
			// 消息撤回
			if (msg.type == enums.MESSAGE_TYPE.RECALL) {
				this.chatStore.recallMessage(msg, chatInfo);
				return;
			}
			// 新增好友
			if (msg.type == enums.MESSAGE_TYPE.FRIEND_NEW) {
				this.friendStore.addFriend(JSON.parse(msg.content));
				return;
			}
			// 删除好友
			if (msg.type == enums.MESSAGE_TYPE.FRIEND_DEL) {
				this.friendStore.removeFriend(friendId);
				return;
			}
			// 消息插入
			let friend = this.loadFriendInfo(friendId);
			this.insertPrivateMessage(friend, msg);
		},
		insertPrivateMessage(friend, msg) {
			// 单人视频信令
			if (msgType.isRtcPrivate(msg.type)) {
				// #ifdef MP-WEIXIN
				// 小程序不支持音视频
				return;
				// #endif
				// 被呼叫，弹出视频页面
				let delayTime = 100;
				if (msg.type == enums.MESSAGE_TYPE.RTC_CALL_VOICE ||
					msg.type == enums.MESSAGE_TYPE.RTC_CALL_VIDEO) {
					let mode = msg.type == enums.MESSAGE_TYPE.RTC_CALL_VIDEO ? "video" : "voice";
					let pages = getCurrentPages();
					let curPage = pages[pages.length - 1].route;
					if (curPage != "pages/chat/chat-private-video") {
						const friendInfo = encodeURIComponent(JSON.stringify(friend));
						uni.navigateTo({
							url: `/pages/chat/chat-private-video?mode=${mode}&friend=${friendInfo}&isHost=false`
						})
						delayTime = 500;
					}
				}
				setTimeout(() => {
					uni.$emit('WS_RTC_PRIVATE', msg);
				}, delayTime)
				return;
			}
			// 插入消息
			if (msgType.isNormal(msg.type) || msgType.isTip(msg.type) || msgType.isAction(msg.type)) {
				let chatInfo = {
					type: 'PRIVATE',
					targetId: friend.id,
					showName: friend.nickName,
					headImage: friend.headImage
				};
				// 打开会话
				this.chatStore.openChat(chatInfo);
				// 插入消息
				this.chatStore.insertMessage(msg, chatInfo);
				// 播放提示音
				this.playAudioTip();
			}


		},
		handleGroupMessage(msg) {
			// 标记这条消息是不是自己发的
			msg.selfSend = msg.sendId == this.userStore.userInfo.id;
			let chatInfo = {
				type: 'GROUP',
				targetId: msg.groupId
			}
			// 消息加载标志
			if (msg.type == enums.MESSAGE_TYPE.LOADING) {
				this.chatStore.setLoadingGroupMsg(JSON.parse(msg.content))
				return;
			}
			// 消息已读处理
			if (msg.type == enums.MESSAGE_TYPE.READED) {
				// 我已读对方的消息，清空已读数量
				this.chatStore.resetUnreadCount(chatInfo)
				return;
			}
			// 消息回执处理
			if (msg.type == enums.MESSAGE_TYPE.RECEIPT) {
				// 更新消息已读人数
				let msgInfo = {
					id: msg.id,
					groupId: msg.groupId,
					readedCount: msg.readedCount,
					receiptOk: msg.receiptOk
				};
				this.chatStore.updateMessage(msgInfo, chatInfo)
				return;
			}
			// 消息撤回
			if (msg.type == enums.MESSAGE_TYPE.RECALL) {
				this.chatStore.recallMessage(msg, chatInfo)
				return;
			}
			// 新增群
			if (msg.type == enums.MESSAGE_TYPE.GROUP_NEW) {
				this.groupStore.addGroup(JSON.parse(msg.content));
				return;
			}
			// 删除群
			if (msg.type == enums.MESSAGE_TYPE.GROUP_DEL) {
				this.groupStore.removeGroup(msg.groupId);
				return;
			}
			// 插入消息
			let group = this.loadGroupInfo(msg.groupId);
			this.insertGroupMessage(group, msg);

		},
		handleSystemMessage(msg) {
			if (msg.type == enums.MESSAGE_TYPE.USER_BANNED) {
				// 用户被封禁
				wsApi.close(3099);
				uni.showModal({
					content: '您的账号已被管理员封禁，原因:' + msg.content,
					showCancel: false,
				})
				this.exit();
			}
		},
		insertGroupMessage(group, msg) {
			// 群视频信令
			if (msgType.isRtcGroup(msg.type)) {
				// #ifdef MP-WEIXIN
				// 小程序不支持音视频
				return;
				// #endif
				// 被呼叫，弹出视频页面
				let delayTime = 100;
				if (msg.type == enums.MESSAGE_TYPE.RTC_GROUP_SETUP) {
					let pages = getCurrentPages();
					let curPage = pages[pages.length - 1].route;
					if (curPage != "pages/chat/chat-group-video") {
						const userInfos = encodeURIComponent(msg.content);
						const inviterId = msg.sendId;
						const groupId = msg.groupId
						uni.navigateTo({
							url: `/pages/chat/chat-group-video?groupId=${groupId}&isHost=false
									&inviterId=${inviterId}&userInfos=${userInfos}`
						})
						delayTime = 500;
					}
				}
				// 消息转发到chat-group-video页面进行处理
				setTimeout(() => {
					uni.$emit('WS_RTC_GROUP', msg);
				}, delayTime)
				return;
			}
			// 插入消息
			if (msgType.isNormal(msg.type) || msgType.isTip(msg.type) || msgType.isAction(msg.type)) {
				let chatInfo = {
					type: 'GROUP',
					targetId: group.id,
					showName: group.showGroupName,
					headImage: group.headImageThumb
				};
				// 打开会话
				this.chatStore.openChat(chatInfo);
				// 插入消息
				this.chatStore.insertMessage(msg, chatInfo);
				// 播放提示音
				this.playAudioTip();
			}

		},
		loadFriendInfo(id, callback) {
			let friend = this.friendStore.findFriend(id);
			if (!friend) {
				console.log("未知用户:", id)
				friend = {
					id: id,
					showNickName: "未知用户",
					headImage: ""
				}
			}
			return friend;
		},
		loadGroupInfo(id) {
			let group = this.groupStore.findGroup(id);
			if (!group) {
				group = {
					id: id,
					showGroupName: "未知群聊",
					headImageThumb: ""
				}
			}
			return group;
		},
		exit() {
			console.log("exit");
			this.isExit = true;
			wsApi.close(3099);
			uni.removeStorageSync("loginInfo");
			this.unloadStore();
		},
		playAudioTip() {
			// 音频播放无法成功
			// this.audioTip = uni.createInnerAudioContext();
			// this.audioTip.src =  "/static/audio/tip.wav";
			// this.audioTip.play();
		},
		refreshToken(loginInfo) {
			return new Promise((resolve, reject) => {
				if (!loginInfo || !loginInfo.refreshToken) {
					reject();
					return;
				}
				http({
					url: '/refreshToken',
					method: 'PUT',
					header: {
						refreshToken: loginInfo.refreshToken
					}
				}).then((newLoginInfo) => {
					uni.setStorageSync("loginInfo", newLoginInfo)
					resolve()
				}).catch((e) => {
					reject(e)
				})
			})
		},
		reconnectWs() {
			// 已退出则不再重连
			if (this.isExit) {
				return;
			}
			// 记录标志
			this.reconnecting = true;
			// 重新加载一次个人信息，目的是为了保证网络已经正常且token有效
			this.userStore.loadUser().then((userInfo) => {
				uni.showToast({
					title: '连接已断开，尝试重新连接...',
					icon: 'none'
				})
				// 重新连接
				let loginInfo = uni.getStorageSync("loginInfo")
				wsApi.reconnect(UNI_APP.WS_URL, loginInfo.accessToken);
			}).catch(() => {
				// 5s后重试
				setTimeout(() => {
					this.reconnectWs();
				}, 5000)
			})
		},
		onReconnectWs() {
			this.reconnecting = false;
			// 重新加载好友和群聊
			const promises = [];
			promises.push(this.friendStore.loadFriend());
			promises.push(this.groupStore.loadGroup());
			Promise.all(promises).then(() => {
				uni.showToast({
					title: "已重新连接",
					icon: 'none'
				})
				// 加载离线消息
				this.pullPrivateOfflineMessage(this.chatStore.privateMsgMaxId);
				this.pullGroupOfflineMessage(this.chatStore.groupMsgMaxId);
			}).catch((e) => {
				console.log(e);
				this.exit();
			})
		},
		closeSplashscreen(delay) {
			// #ifdef APP-PLUS
			// 关闭开机动画
			setTimeout(() => {
				plus.navigator.closeSplashscreen()
			}, delay)
			// #endif
		},
		initMockDataNow() {
			console.log('App.vue: 强制初始化模拟数据');
			try {
				// 导入模拟数据
				const { initMockChatData, getMockUserById, getMockGroupById, getMockCurrentUser, mockChats } = require('./common/mockData.js');
				
				// 确保chatStore可用
				if (!this.chatStore) {
					console.error('App.vue: chatStore不可用，无法初始化模拟数据');
					return;
				}
				
				// 直接使用mockChats初始化
				this.chatStore.initChats({
					chats: JSON.parse(JSON.stringify(mockChats)),
					privateMsgMaxId: 5000,
					groupMsgMaxId: 6000
				});
				
				// 初始化当前用户
				if (this.userStore) {
					this.userStore.userInfo = getMockCurrentUser();
				}
				
				this.isInit = true;
				console.log('App.vue: 模拟数据初始化成功，共', mockChats.length, '条会话');
			} catch (error) {
				console.error('App.vue: 初始化模拟数据失败', error);
			}
		}
	},
	onLaunch() {
		// 直接初始化模拟数据
		setTimeout(() => {
			// 强制初始化
			this.initMockDataNow();
			
			// 跳转到聊天页
			uni.switchTab({
				url: "/pages/chat/chat"
			});
		}, 100);
	}
}
</script>

<style lang="scss">
@import "@/uni_modules/uview-plus/index.scss";
@import "@/im.scss";
@import url('./static/icon/iconfont.css');

// #ifdef H5 
uni-page-head {
	display: none; // h5浏览器本身就有标题
}

// #endif

.tab-page {
	position: relative;
	display: flex;
	flex-direction: column;
	// #ifdef H5
	height: calc(100vh - 50px - $im-nav-bar-height); // h5平台100vh是包含了底部高度，需要减去
	top: $im-nav-bar-height;
	// #endif

	// #ifndef H5
	height: calc(100vh - var(--status-bar-height) - $im-nav-bar-height); // app平台还要减去顶部手机状态栏高度
	top: calc($im-nav-bar-height + var(--status-bar-height));
	// #endif
	color: $im-text-color;
	background-color: $im-bg;
	font-size: $im-font-size;
	font-family: $font-family;
}

.page {
	position: relative;
	// #ifdef H5
	height: calc(100vh - $im-nav-bar-height); // app平台还要减去顶部手机状态栏高度
	top: $im-nav-bar-height;
	// #endif
	// #ifndef H5
	height: calc(100vh - var(--status-bar-height) - $im-nav-bar-height); // app平台还要减去顶部手机状态栏高度
	top: calc($im-nav-bar-height + var(--status-bar-height));
	// #endif
	color: $im-text-color;
	background-color: $im-bg;
	font-size: $im-font-size;
	font-family: $font-family;
}
</style>