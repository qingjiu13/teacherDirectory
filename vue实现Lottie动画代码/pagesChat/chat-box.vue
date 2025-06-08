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
	<Header :title="'对话'" @back="handleBack"/>
	<view class="page chat-box">
		<view class="chat-main-box" :style="{height: chatMainHeight+'px'}">
			<view class="chat-msg" @click="switchChatTabBox('none')">
				<scroll-view class="scroll-box" scroll-y="true" upper-threshold="200" @scrolltoupper="onScrollToTop"
					:scroll-into-view="'chat-item-' + scrollMsgIdx">
					<view v-if="chat" v-for="(msgInfo, idx) in chat.messages" :key="idx">
						<ChatMessageItem :ref="'message'+msgInfo.id" v-if="idx >= showMinIdx"
							:headImage="headImage(msgInfo) || ''" @call="onRtCall(msgInfo)" :showName="showName(msgInfo) || '未知'"
							@recall="onRecallMessage" @delete="onDeleteMessage" @copy="onCopyMessage"
							@longPressHead="onLongPressHead(msgInfo)" @download="onDownloadFile"
							@audioStateChange="onAudioStateChange" :id="'chat-item-' + idx" :msgInfo="msgInfo || {}"
							:groupMembers="groupMembers || []">
						</ChatMessageItem>
					</view>
				</scroll-view>
			</view>
			<view v-if="atUserIds.length > 0" class="chat-at-bar" @click="openAtBox()">
				<view class="iconfont icon-at">:&nbsp;</view>
				<scroll-view v-if="atUserIds.length > 0" class="chat-at-scroll-box" scroll-x="true" scroll-left="120">
					<view class="chat-at-items">
						<view v-for="m in atUserItems" class="chat-at-item" :key="m.userId">
							<HeadImage :name="m.showNickName" :url="m.headImage" size="minier"></HeadImage>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="send-bar" :style="{ zIndex: sendBarZIndex }">
				<!-- <view v-if="!showRecord" class="iconfont icon-voice-circle" @click="onRecorderInput()"></view> -->
				<!-- <view v-else class="iconfont icon-keyboard" @click="onKeyboardInput()"></view> -->
				<ChatRecord v-if="showRecord" class="chat-record" @send="onSendRecord"></ChatRecord>
				<view v-else class="send-container">
					<view class="send-text">
						<textarea id="textInput" class="send-text-area" :placeholder="isReceipt ? '[回执消息]' : ''"
							:disabled="isReadOnly" @focus="onTextareaFocus" @blur="onTextareaBlur" 
							@input="onTextareaInput" confirm-type="send" return-key-type="send" 
							@confirm="sendTextMessage" :adjust-position="true" v-model="textContent"
							:hold-keyboard="false" :auto-height="true" :show-confirm-bar="true">
						</textarea>
					</view>
					<view class="send-actions">
						<view v-if="chat && chat.type == 'GROUP'" class="iconfont icon-at" @click="openAtBox()"></view>
						<!-- <view class="iconfont icon-icon_emoji" @click="onShowEmoChatTab()">
							<image class="icon" src="/pagesChat/static/icon_side/AI.png" mode="aspectFill" lazy-load="true"></image>
						</view> -->
						<view v-if="isEmpty" class="iconfont icon-add" @click="onShowToolsChatTab()">
							<image class="icon" src="/pagesChat/static/icon_side/AI.png" mode="aspectFill" lazy-load="true"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="chat-tab-bar">
			<view v-if="chatTabBox == 'tools'" class="chat-tools" :style="{height: keyboardHeight+'px'}">
				<view class="chat-tools-item">
					<FileUpload ref="fileUpload" :onBefore="onUploadFileBefore" :onSuccess="onUploadFileSuccess"
						:onError="onUploadFileFail">
						<view class="tool-icon">
							<image class="icon" src="/pagesChat/static/icon_side/AI.png" mode="aspectFill" lazy-load="true"></image>
						</view>
					</FileUpload>
					<view class="tool-name">文件</view>
				</view>
				<view class="chat-tools-item">
					<ImageUpload :maxCount="9" sourceType="album" :onBefore="onUploadImageBefore"
						:onSuccess="onUploadImageSuccess" :onError="onUploadImageFail">
						<view class="tool-icon">
							<image class="icon" src="/pagesChat/static/icon_side/AI.png" mode="aspectFill" lazy-load="true"></image>
						</view>
					</ImageUpload>
					<view class="tool-name">相册</view>
				</view>
				<view class="chat-tools-item">
					<ImageUpload sourceType="camera" :onBefore="onUploadImageBefore" :onSuccess="onUploadImageSuccess"
						:onError="onUploadImageFail">
						<view class="tool-icon">
							<image class="icon" src="/pagesChat/static/icon_side/AI.png" mode="aspectFill" lazy-load="true"></image>
						</view>
					</ImageUpload>
					<view class="tool-name">拍摄</view>
				</view>
				<!-- <view class="chat-tools-item" @click="onRecorderInput()">
					<view class="tool-icon iconfont icon-microphone"></view>
					<view class="tool-name">语音消息</view>
				</view> -->
				<view v-if="chat.type == 'GROUP' && memberSize<=500" class="chat-tools-item" @click="switchReceipt()">
					<view class="tool-icon iconfont icon-receipt" :class="isReceipt ? 'active' : ''"></view>
					<view class="tool-name">回执消息</view>
				</view>
				<!-- #ifndef MP-WEIXIN -->
				<!-- 音视频不支持小程序 -->
				<view v-if="chat.type == 'PRIVATE'" class="chat-tools-item" @click="onPriviteVideo()">
					<view class="tool-icon iconfont icon-video"></view>
					<view class="tool-name">视频通话</view>
				</view>
				<view v-if="chat.type == 'PRIVATE'" class="chat-tools-item" @click="onPriviteVoice()">
					<view class="tool-icon iconfont icon-call"></view>
					<view class="tool-name">语音通话</view>
				</view>
				<view v-if="chat.type == 'GROUP'" class="chat-tools-item" @click="onGroupVideo()">
					<view class="tool-icon iconfont icon-call"></view>
					<view class="tool-name">语音通话</view>
				</view>
				<!-- #endif -->
			</view>
		<scroll-view
			v-if="chatTabBox === 'emo'"
			class="chat-emotion"
			scroll-y="true"
			:style="{ height: keyboardHeight + 'px' }"
			>
			<view class="emotion-item-list">
				<image
				class="emotion-item emoji-large"
				v-for="(emoText, i) in $emo.emoTextList"
				:key="i"
				:title="emoText"
				:src="$emo.textToPath(emoText)"
				@click="selectEmoji(emoText)"
				mode="aspectFill"
				lazy-load="true"
				></image>
			</view>
		</scroll-view>

		</view>
		<!-- @用户时选择成员 -->
		<ChatAtBox ref="atBox" :ownerId="group.ownerId" :members="groupMembers"
			@complete="onAtComplete"></ChatAtBox>
		<!-- 群语音通话时选择成员 -->
		<!-- #ifndef MP-WEIXIN -->
		<GroupMemberSelector ref="selBox" :members="groupMembers" :maxSize="configStore.webrtc.maxChannel"
			@complete="onInviteOk"></GroupMemberSelector>
		<GroupRtcJoin ref="rtcJoin" :groupId="group.id"></GroupRtcJoin>
		<!-- #endif -->
	</view>
</template>

<script>
import UNI_APP from './env.js';
// 引入模拟数据和服务
import Header from '@/components/navigationTitleBar/header';
import mockChatService from './common/mockChatService.js';
import { getMockUserById, getMockGroupById, getMockCurrentUser, mockChats } from './common/mockData.js';
import ChatMessageItem from './components/chat-message-item/chat-message-item';
import ChatRecord from './components/chat-record/chat-record';
import FileUpload from './components/file-upload/file-upload';
import ImageUpload from './components/image-upload/image-upload';
import HeadImage from './components/head-image/head-image';
import ChatAtBox from './components/chat-at-box/chat-at-box';
import GroupMemberSelector from './components/group-member-selector/group-member-selector';
import GroupRtcJoin from './components/group-rtc-join/group-rtc-join';
import ChatItem from './components/chat-item/chat-item';
import Loading from './components/loading/loading';
import LongPressMenu from './components/long-press-menu/long-press-menu';
// 导入enums等工具
import * as enums from './common/enums.js';
import * as messageType from './common/messageType.js';
import emotion from './common/emotion.js';
import url from './common/url.js';
// 直接引入store获取函数
import { getChatStore, getFriendStore, getConfigStore, getUserStore, getGroupStore } from './main.js';

export default {
	components: {
		Header,
		ChatMessageItem,
		ChatRecord,
		FileUpload,
		ImageUpload,
		ChatAtBox,
		HeadImage,
		GroupMemberSelector,
		GroupRtcJoin,
		ChatItem,
		Loading,
		LongPressMenu
	},
	data() {
		return {
			textContent: '',
			chat: {},
			userInfo: {},
			group: {},
			groupMembers: [],
			isReceipt: false, // 是否回执消息
			scrollMsgIdx: 0, // 滚动条定位为到哪条消息
			chatTabBox: 'none',
			showRecord: false,
			chatMainHeight: 0, // 聊天窗口高度
			keyboardHeight: 290, // 键盘高度
			windowHeight: 1000, // 窗口高度
			initHeight: 1000, // h5初始高度
			atUserIds: [],
			needScrollToBottom: false, // 需要滚动到底部 
			showMinIdx: 0, // 下标小于showMinIdx的消息不显示，否则可能很卡
			reqQueue: [], // 请求队列
			isSending: false, // 是否正在发送请求
			isShowKeyBoard: false, // 键盘是否正在弹起 
			isEmpty: true, // 输入框是否为空
			isFocus: false, // 输入框是否焦点
			isReadOnly: false, // 输入框是否只读
			playingAudio: null, // 当前正在播放的录音消息
			// 是否使用模拟数据
			useMockData: true,
			// 模拟用户数据
			mockCurrentUser: null,
			// 存储引用
			chatStore: null,
			friendStore: null,
			configStore: null,
			userStore: null,
			groupStore: null,
			// 输入框层级
			sendBarZIndex: 2, // 默认z-index值
		}
	},
	created() {
		// 确保组件中可以使用这些全局属性
		if (!this.$enums) this.$enums = enums;
		if (!this.$msgType) this.$msgType = messageType;
		if (!this.$emo) this.$emo = emotion;
		if (!this.$url) this.$url = url;
		
		// 初始化store引用
		try {
			// 优先从直接导入的函数获取
			this.chatStore = getChatStore();
			this.friendStore = getFriendStore();
			this.configStore = getConfigStore();
			this.userStore = getUserStore();
			this.groupStore = getGroupStore();
			
			// 如果导出的函数无法获取，尝试从全局属性获取
			if (!this.chatStore && this.$) {
				console.log('chat-box.vue: 尝试从全局属性获取Store');
				this.chatStore = this.$chatStore;
				this.friendStore = this.$friendStore;
				this.configStore = this.$configStore;
				this.userStore = this.$userStore;
				this.groupStore = this.$groupStore;
			}
			
			console.log('chat-box.vue: 获取Store成功:', 
				'chatStore=', !!this.chatStore, 
				'friendStore=', !!this.friendStore
			);
		} catch (error) {
			console.error('chat-box.vue: 获取Store失败:', error);
		}
		
		// 初始化当前用户
		this.mockCurrentUser = getMockCurrentUser();
		
		// 添加数据检查，确保模拟数据已初始化
		if (this.useMockData && (!this.chatStore || !this.chatStore.chats || this.chatStore.chats.length === 0)) {
			console.log('chat-box.vue: 强制初始化模拟数据');
			this.initMockData();
		}
	},
	methods: {
		handleBack() {
			uni.navigateBack();
		},
		onRecorderInput() {
			this.showRecord = true;
			this.switchChatTabBox('none');
		},
		onKeyboardInput() {
			this.showRecord = false;
			this.switchChatTabBox('none');
		},
		onSendRecord(data) {
			// 检查是否被封禁
			if (this.isBanned) {
				this.showBannedTip();
				return;
			}
			let msgInfo = {
				content: JSON.stringify(data),
				type: this.$enums.MESSAGE_TYPE.AUDIO,
				receipt: this.isReceipt
			}
			// 填充对方id
			this.fillTargetId(msgInfo, this.chat.targetId);
			this.sendMessageRequest(msgInfo).then((m) => {
				m.selfSend = true;
				this.chatStore.insertMessage(m, this.chat);
				// 会话置顶
				this.moveChatToTop();
				// 滚动到底部
				this.scrollToBottom();
				this.isReceipt = false;

			})
		},
		onRtCall(msgInfo) {
			if (msgInfo.type == this.$enums.MESSAGE_TYPE.ACT_RT_VOICE) {
				this.onPriviteVoice();
			} else if (msgInfo.type == this.$enums.MESSAGE_TYPE.ACT_RT_VIDEO) {
				this.onPriviteVideo();
			}
		},
		onPriviteVideo() {
			const friendInfo = encodeURIComponent(JSON.stringify(this.friend));
			uni.navigateTo({
				url: `/pages/chat/chat-private-video?mode=video&friend=${friendInfo}&isHost=true`
			})
		},
		onPriviteVoice() {
			const friendInfo = encodeURIComponent(JSON.stringify(this.friend));
			uni.navigateTo({
				url: `/pages/chat/chat-private-video?mode=voice&friend=${friendInfo}&isHost=true`
			})
		},
		onGroupVideo() {
			// 邀请成员发起通话
			let ids = [this.mine.id];
			this.$refs.selBox.init(ids, ids, []);
			this.$refs.selBox.open();
		},
		onInviteOk(ids) {
			if (ids.length < 2) {
				return;
			}
			let users = [];
			ids.forEach(id => {
				let m = this.groupMembers.find(m => m.userId == id);
				// 只取部分字段,压缩url长度
				users.push({
					id: m.userId,
					nickName: m.showNickName,
					headImage: m.headImage,
					isCamera: false,
					isMicroPhone: true
				})
			})
			const groupId = this.group.id;
			const inviterId = this.mine.id;
			const userInfos = encodeURIComponent(JSON.stringify(users));
			uni.navigateTo({
				url: `/pages/chat/chat-group-video?groupId=${groupId}&isHost=true
						&inviterId=${inviterId}&userInfos=${userInfos}`
			})
		},
		moveChatToTop() {
			let chatIdx = this.chatStore.findChatIdx(this.chat);
			this.chatStore.moveTop(chatIdx);
		},
		switchReceipt() {
			this.isReceipt = !this.isReceipt;
		},
		openAtBox() {
			this.$refs.atBox.init(this.atUserIds);
			this.$refs.atBox.open();
		},
		onAtComplete(atUserIds) {
			this.atUserIds = atUserIds;
		},
		onLongPressHead(msgInfo) {
			if (!msgInfo.selfSend && this.chat.type == "GROUP" && this.atUserIds.indexOf(msgInfo.sendId) < 0) {
				this.atUserIds.push(msgInfo.sendId);
			}
		},
		headImage(msgInfo) {
			if (!msgInfo) {
				return '';
			}
			
			try {
				if (this.chat && this.chat.type == 'GROUP') {
					let member = this.groupMembers.find((m) => m && m.userId == msgInfo.sendId);
					return member ? member.headImage : "";
				} else {
					return msgInfo.selfSend ? (this.mine && this.mine.headImageThumb ? this.mine.headImageThumb : '') : 
						(this.chat && this.chat.headImage ? this.chat.headImage : '');
				}
			} catch (error) {
				console.error('获取头像出错:', error);
				return '';
			}
		},
		showName(msgInfo) {
			if (!msgInfo) {
				return '';
			}
			
			try {
				if (this.chat && this.chat.type == 'GROUP') {
					let member = this.groupMembers.find((m) => m && m.userId == msgInfo.sendId);
					return member ? member.showNickName : "";
				} else {
					return msgInfo.selfSend ? (this.mine && this.mine.nickName ? this.mine.nickName : '') : 
						(this.chat && this.chat.showName ? this.chat.showName : '');
				}
			} catch (error) {
				console.error('获取名称出错:', error);
				return '';
			}
		},
		sendTextMessage() {
			console.log('键盘发送按钮被点击');
			
			// 检查是否被封禁
			if (this.isBanned) {
				this.showBannedTip();
				return;
			}
			
			let sendText = this.textContent || '';
			console.log('发送文本内容:', sendText);
			
			if (!sendText.trim() && this.atUserIds.length == 0) {
				return uni.showToast({
					title: "不能发送空白信息",
					icon: "none"
				});
			}
			
			let receiptText = this.isReceipt ? "【回执消息】" : "";
			let atText = this.createAtText();
			
			// 清空输入框（在验证通过后）
			this.textContent = '';
			this.isEmpty = true;
			
			if (this.useMockData) {
				// 使用模拟数据
				const message = {
					tmpId: 'tmp_' + Date.now(),
					type: this.$enums.MESSAGE_TYPE.TEXT,
					content: receiptText + this.html2Escape(sendText) + atText,
					status: this.$enums.MESSAGE_STATUS.UNSEND
				};
				
				mockChatService.sendMessage(message, {
					type: this.chat.type,
					targetId: this.chat.targetId
				}).then(() => {
					// 滚动到底部
					this.scrollToBottom();
				});
				
				// 清空@成员和回执标记
				this.atUserIds = [];
				this.isReceipt = false;
			} else {
				// 使用原接口
				let msgInfo = {
					content: receiptText + this.html2Escape(sendText) + atText,
					atUserIds: this.atUserIds,
					receipt: this.isReceipt,
					type: 0
				}
				// 清空@成员和回执标记
				this.atUserIds = [];
				this.isReceipt = false;
				// 填充对方id
				this.fillTargetId(msgInfo, this.chat.targetId);
				this.sendMessageRequest(msgInfo).then((m) => {
					m.selfSend = true;
					this.chatStore.insertMessage(m, this.chat);
					// 会话置顶
					this.moveChatToTop();
				}).finally(() => {
					// 滚动到底部
					this.scrollToBottom();
				});
			}
		},
		createAtText() {
			let atText = "";
			this.atUserIds.forEach((id) => {
				if (id == -1) {
					atText += ` @全体成员`;
				} else {
					let member = this.groupMembers.find((m) => m.userId == id);
					if (member) {
						atText += ` @${member.showNickName}`;
					}
				}
			})
			return atText;
		},
		fillTargetId(msgInfo, targetId) {
			if (this.chat.type == "GROUP") {
				msgInfo.groupId = targetId;
			} else {
				msgInfo.recvId = targetId;
			}
		},
		scrollToBottom() {
			let size = this.messageSize;
			if (size > 0) {
				this.scrollToMsgIdx(size - 1);
			}
		},
		scrollToMsgIdx(idx) {
			// 如果scrollMsgIdx值没变化，滚动条不会移动
			if (idx == this.scrollMsgIdx && idx > 0) {
				this.$nextTick(() => {
					// 先滚动到上一条
					this.scrollMsgIdx = idx - 1;
					// 再滚动目标位置
					this.scrollToMsgIdx(idx);
				});
				return;
			}
			this.$nextTick(() => {
				this.scrollMsgIdx = idx;
			});
		},
		onShowEmoChatTab() {
			this.showRecord = false;
			// 简单关闭表情栏时的键盘
			uni.hideKeyboard();
			// 直接切换到表情栏，不进行复杂的键盘监听操作
			setTimeout(() => {
				this.switchChatTabBox('emo');
			}, 100);
		},
		onShowToolsChatTab() {
			this.showRecord = false;
			// 简单关闭工具栏时的键盘
			uni.hideKeyboard();
			// 直接切换到工具栏，不进行复杂的键盘监听操作
			setTimeout(() => {
				this.switchChatTabBox('tools');
			}, 100);
		},
		switchChatTabBox(chatTabBox) {
			this.chatTabBox = chatTabBox;
			this.reCalChatMainHeight();
			
			// 移除键盘监听的重新启用，让系统原生处理
			if (chatTabBox != 'tools' && this.$refs.fileUpload) {
				this.$refs.fileUpload.hide()
			}
		},
		selectEmoji(emoText) {
			// 直接在文本内容中插入表情文字
			this.textContent = (this.textContent || '') + emoText;
			this.isEmpty = false;
		},
		onUploadImageBefore(file) {
			// 检查是否被封禁
			if (this.isBanned) {
				this.showBannedTip();
				return;
			}
			let data = {
				originUrl: file.path,
				thumbUrl: file.path
			}
			let msgInfo = {
				id: 0,
				tmpId: this.generateId(),
				fileId: file.uid,
				sendId: this.mine.id,
				content: JSON.stringify(data),
				sendTime: new Date().getTime(),
				selfSend: true,
				type: this.$enums.MESSAGE_TYPE.IMAGE,
				readedCount: 0,
				loadStatus: "loading",
				status: this.$enums.MESSAGE_STATUS.UNSEND
			}
			// 填充对方id
			this.fillTargetId(msgInfo, this.chat.targetId);
			// 插入消息
			this.chatStore.insertMessage(msgInfo, this.chat);
			// 会话置顶
			this.moveChatToTop();
			// 借助file对象保存
			file.msgInfo = msgInfo;
			file.chat = this.chat;
			// 滚到最低部
			this.scrollToBottom();
			return true;
		},
		onUploadImageSuccess(file, res) {
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
			msgInfo.content = JSON.stringify(res.data);
			msgInfo.receipt = this.isReceipt
			this.sendMessageRequest(msgInfo).then((m) => {
				msgInfo.loadStatus = 'ok';
				msgInfo.id = m.id;
				this.isReceipt = false;
				this.chatStore.insertMessage(msgInfo, file.chat);
			})
		},
		onUploadImageFail(file, err) {
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
			msgInfo.loadStatus = 'fail';
			this.chatStore.insertMessage(msgInfo, file.chat);
		},
		onUploadFileBefore(file) {
			// 检查是否被封禁
			if (this.isBanned) {
				this.showBannedTip();
				return;
			}
			let data = {
				name: file.name,
				size: file.size,
				url: file.path
			}
			let msgInfo = {
				id: 0,
				tmpId: this.generateId(),
				sendId: this.mine.id,
				content: JSON.stringify(data),
				sendTime: new Date().getTime(),
				selfSend: true,
				type: this.$enums.MESSAGE_TYPE.FILE,
				readedCount: 0,
				loadStatus: "loading",
				status: this.$enums.MESSAGE_STATUS.UNSEND
			}
			// 填充对方id
			this.fillTargetId(msgInfo, this.chat.targetId);
			// 插入消息
			this.chatStore.insertMessage(msgInfo, this.chat);
			// 会话置顶
			this.moveChatToTop();
			// 借助file对象保存
			file.msgInfo = msgInfo;
			file.chat = this.chat;
			// 滚到最低部
			this.scrollToBottom();
			return true;
		},
		onUploadFileSuccess(file, res) {
			let data = {
				name: file.name,
				size: file.size,
				url: res.data
			}
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
			msgInfo.content = JSON.stringify(data);
			msgInfo.receipt = this.isReceipt
			this.sendMessageRequest(msgInfo).then((m) => {
				msgInfo.loadStatus = 'ok';
				msgInfo.id = m.id;
				this.isReceipt = false;
				this.chatStore.insertMessage(msgInfo, file.chat);
			})
		},
		onUploadFileFail(file, res) {
			let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
			msgInfo.loadStatus = 'fail';
			this.chatStore.insertMessage(msgInfo, file.chat);
		},
		onDeleteMessage(msgInfo) {
			uni.showModal({
				title: '删除消息',
				content: '确认删除消息?',
				success: (res) => {
					if (!res.cancel) {
						if (this.useMockData) {
							// 使用模拟数据
							mockChatService.deleteMessage(msgInfo, {
								type: this.chat.type,
								targetId: this.chat.targetId
							}).then(() => {
								uni.showToast({
									title: "删除成功",
									icon: "none"
								});
							});
						} else {
							// 使用原接口
							this.chatStore.deleteMessage(msgInfo, this.chat);
							uni.showToast({
								title: "删除成功",
								icon: "none"
							})
						}
					}
				}
			})
		},
		onRecallMessage(msgInfo) {
			uni.showModal({
				title: '撤回消息',
				content: '确认撤回消息?',
				success: (res) => {
					if (!res.cancel) {
						if (this.useMockData) {
							// 使用模拟数据
							mockChatService.recallMessage(msgInfo, {
								type: this.chat.type,
								targetId: this.chat.targetId
							}).then(() => {
								uni.showToast({
									title: '撤回成功',
									icon: 'none'
								});
							});
						} else {
							// 使用原接口
							let url = `/message/${this.chat.type.toLowerCase()}/recall/${msgInfo.id}`
							this.$http({
								url: url,
								method: 'DELETE'
							}).then((m) => {
								m.selfSend = true;
								this.chatStore.recallMessage(m, this.chat);
							})
						}
					}
				}
			})
		},
		onCopyMessage(msgInfo) {
			uni.setClipboardData({
				data: msgInfo.content,
				success: () => {
					uni.showToast({ title: '复制成功' });
				},
				fail: () => {
					uni.showToast({ title: '复制失败', icon: 'none' });
				}
			});
		},
		onDownloadFile(msgInfo) {
			let url = JSON.parse(msgInfo.content).url;
			uni.downloadFile({
				url: url,
				success(res) {
					if (res.statusCode === 200) {
						var filePath = encodeURI(res.tempFilePath);
						uni.openDocument({
							filePath: filePath,
							showMenu: true
						});
					}
				},
				fail(e) {
					uni.showToast({
						title: "文件下载失败",
						icon: "none"
					})
				}
			});
		},
		onScrollToTop() {
			if (this.showMinIdx == 0) {
				console.log("消息已滚动到顶部")
				return;
			}
			//  #ifndef H5
			// 防止滚动条定格在顶部，不能一直往上滚
			this.scrollToMsgIdx(this.showMinIdx);
			// #endif
			// 多展示20条信息
			this.showMinIdx = this.showMinIdx > 20 ? this.showMinIdx - 20 : 0;
		},
		onShowMore() {
			if (this.chat.type == "GROUP") {
				uni.navigateTo({
					url: "/pages/group/group-info?id=" + this.group.id
				})
			} else {
				uni.navigateTo({
					url: "/pages/common/user-info?id=" + this.userInfo.id
				})
			}
		},
		onTextareaFocus(e) {
			try {
				this.isFocus = true;
				
				// 如果有展开项，先收起再重新获得焦点
				if (this.chatTabBox !== 'none') {
					// 先让输入框失去焦点，阻止键盘立刻弹起
					uni.hideKeyboard();
					
					// 收起所有展开项
					this.switchChatTabBox('none');
					
					// 延迟后重新让输入框获得焦点
					setTimeout(() => {
						// 重新获得焦点
						const query = uni.createSelectorQuery().in(this);
						query.select('#textInput').focus();
						this.scrollToBottom();
						this.reCalChatMainHeight();
					}, 200);
				} else {
					// 如果没有展开项，直接处理
					this.scrollToBottom();
					setTimeout(() => {
						this.reCalChatMainHeight();
					}, 50);
				}
			} catch (error) {
				console.error('输入框获取焦点错误:', error);
			}
		},
		onTextareaBlur(e) {
			try {
				this.isFocus = false;
				// 简化失焦处理
				setTimeout(() => {
					this.reCalChatMainHeight();
				}, 50);
			} catch (error) {
				console.error('输入框失去焦点错误:', error);
			}
		},
		onTextareaInput(e) {
			try {
				this.textContent = e.detail.value;
				// 检查输入内容是否为空
				this.isEmpty = !this.textContent || this.textContent.trim() === '';
				
				// 调整输入框高度（延时确保UI更新）
				setTimeout(() => {
					// 重新计算布局
					this.reCalChatMainHeight();
					
					// 如果焦点在输入框，滚动到底部
					if (this.isFocus) {
						this.scrollToBottom();
					}
				}, 50);
			} catch (error) {
				console.error('处理文本输入错误:', error);
			}
		},
		onAudioStateChange(state, msgInfo) {
			const playingAudio = this.$refs['message' + msgInfo.id][0]
			if (state == 'PLAYING' && playingAudio != this.playingAudio) {
				// 停止之前的录音
				this.playingAudio && this.playingAudio.stopPlayAudio();
				// 记录当前正在播放的消息
				this.playingAudio = playingAudio;
			}
		},
		loadReaded(fid) {
			if (this.useMockData) {
				// 模拟数据无需加载已读状态
				return;
			}
			
			this.$http({
				url: `/message/private/maxReadedId?friendId=${fid}`,
				method: 'get'
			}).then((id) => {
				this.chatStore.readedMessage({
					friendId: fid,
					maxId: id
				});
			});
		},
		readedMessage() {
			if (this.unreadCount == 0) {
				return;
			}
			
			if (this.useMockData) {
				// 使用模拟数据时直接重置未读计数
				if (this.chat) {
					this.chat.unreadCount = 0;
					this.scrollToBottom();
				}
				return;
			}
			
			let url = ""
			if (this.chat.type == "GROUP") {
				url = `/message/group/readed?groupId=${this.chat.targetId}`
			} else {
				url = `/message/private/readed?friendId=${this.chat.targetId}`
			}
			this.$http({
				url: url,
				method: 'PUT'
			}).then(() => {
				this.chatStore.resetUnreadCount(this.chat)
				this.scrollToBottom();
			})
		},
		loadGroup(groupId) {
			if (this.useMockData) {
				// 使用模拟数据
				const group = getMockGroupById(groupId);
				if (group) {
					this.group = {
						id: group.id,
						showGroupName: group.showGroupName,
						headImageThumb: group.headImageThumb,
						memberCount: group.memberCount,
						isBanned: false,
						ownerId: 1 // 假设当前用户是群主
					};
					
					// 模拟群成员
					this.groupMembers = [];
					group.members.forEach(memberId => {
						const user = getMockUserById(memberId);
						if (user) {
							this.groupMembers.push({
								userId: user.id,
								showNickName: user.nickName,
								headImage: user.headImageThumb,
								quit: false
							});
						}
					});
				}
				return;
			}
			
			this.$http({
				url: `/group/find/${groupId}`,
				method: 'GET'
			}).then((group) => {
				this.group = group;
				this.chatStore.updateChatFromGroup(group);
				this.groupStore.updateGroup(group);
			});

			this.$http({
				url: `/group/members/${groupId}`,
				method: 'GET'
			}).then((groupMembers) => {
				this.groupMembers = groupMembers;
			});
		},
		updateFriendInfo() {
			if (this.isFriend) {
				// store的数据不能直接修改，深拷贝一份store的数据
				let friend = JSON.parse(JSON.stringify(this.friend));
				friend.headImage = this.userInfo.headImageThumb;
				friend.nickName = this.userInfo.nickName;
				friend.showNickName = friend.remarkNickName ? friend.remarkNickName : friend.nickName;
				// 更新好友列表中的昵称和头像
				this.friendStore.updateFriend(friend);
				// 更新会话中的头像和昵称
				this.chatStore.updateChatFromFriend(friend);
			} else {
				this.chatStore.updateChatFromUser(this.userInfo);
			}
		},
		loadFriend(friendId) {
			if (this.useMockData) {
				// 使用模拟数据
				const user = getMockUserById(friendId);
				if (user) {
					this.userInfo = {
						id: user.id,
						nickName: user.nickName,
						headImageThumb: user.headImageThumb,
						state: user.state,
						isBanned: false
					};
				}
				return;
			}
			
			// 获取好友用户信息
			this.$http({
				url: `/user/find/${friendId}`,
				method: 'GET'
			}).then((userInfo) => {
				this.userInfo = userInfo;
				this.updateFriendInfo();
			})
		},
		rpxTopx(rpx) {
			// rpx转换成px
			let info = uni.getSystemInfoSync()
			let px = info.windowWidth * rpx / 750;
			return Math.floor(rpx);
		},
		html2Escape(strHtml) {
			return strHtml.replace(/[<>&"]/g, function(c) {
				return {
					'<': '&lt;',
					'>': '&gt;',
					'&': '&amp;',
					'"': '&quot;'
				} [c];
			});
		},
		sendMessageRequest(msgInfo) {
			return new Promise((resolve, reject) => {
				// 请求入队列，防止请求"后发先至"，导致消息错序
				this.reqQueue.push({ msgInfo, resolve, reject });
				this.processReqQueue();
			})
		},
		processReqQueue() {
			if (this.reqQueue.length && !this.isSending) {
				this.isSending = true;
				const reqData = this.reqQueue.shift();
				
				if (this.useMockData) {
					// 使用模拟数据发送消息
					mockChatService.sendMessage(reqData.msgInfo, {
						type: this.chat.type,
						targetId: this.chat.targetId
					}).then(result => {
						reqData.resolve(result.message);
					}).catch(error => {
						reqData.reject(error);
					}).finally(() => {
						this.isSending = false;
						// 发送下一条请求
						this.processReqQueue();
					});
				} else {
					// 使用原接口
					this.$http({
						url: this.messageAction,
						method: 'post',
						data: reqData.msgInfo
					}).then((res) => {
						reqData.resolve(res)
					}).catch((e) => {
						reqData.reject(e)
					}).finally(() => {
						this.isSending = false;
						// 发送下一条请求
						this.processReqQueue();
					})
				}
			}
		},
		reCalChatMainHeight() {
			setTimeout(() => {
				try {
					let h = this.windowHeight;
					// 减去标题栏高度
					h -= 50;
					
					// 如果显示表情栏或工具栏，减去其高度
					if (this.chatTabBox === 'emo' || this.chatTabBox === 'tools') {
						h -= this.keyboardHeight;
						this.sendBarZIndex = 1001;
					} else {
						this.sendBarZIndex = 2;
					}
					
					// #ifndef H5
					h -= uni.getSystemInfoSync().statusBarHeight;
					// #endif
					
					this.chatMainHeight = h;
					
					// 只在工具栏显示时滚动到底部，输入框焦点时让系统处理
					if (this.chatTabBox != 'none') {
						this.scrollToBottom();
					}
					
					// #ifdef H5
					if (uni.getSystemInfoSync().platform == 'ios') {
						const delays = [50, 100, 500];
						delays.forEach((delay) => {
							setTimeout(() => {
								uni.pageScrollTo({
									scrollTop: 0,
									duration: 10
								});
							}, delay);
						});
					}
					// #endif
				} catch (e) {
					console.error('重新计算聊天主窗口高度错误:', e);
				}
			}, 30);
		},
		listenKeyBoard() {
			// #ifdef H5	
			if (navigator.platform == "Win32") {
				// 电脑端不需要弹出键盘
				console.log("navigator.platform:", navigator.platform)
				return;
			}
			if (uni.getSystemInfoSync().platform == 'ios') {
				// ios h5实现键盘监听
				window.addEventListener('focusin', this.focusInListener);
				window.addEventListener('focusout', this.focusOutListener);
				// 监听键盘高度，ios13以上开始支持
				if (window.visualViewport) {
					window.visualViewport.addEventListener('resize', this.resizeListener);
				}
			} else {
				// 安卓h5实现键盘监听
				window.addEventListener('resize', this.resizeListener);
			}
			// #endif
			// #ifndef H5
			// app实现键盘监听
			uni.onKeyboardHeightChange(this.keyBoardListener);
			// #endif
		},
		unListenKeyboard() {
			// #ifdef H5
			window.removeEventListener('resize', this.resizeListener);
			window.removeEventListener('focusin', this.focusInListener);
			window.removeEventListener('focusout', this.focusOutListener);
			// #endif
			// #ifndef H5
			uni.offKeyboardHeightChange(this.keyBoardListener);
			// #endif
		},
		keyBoardListener(res) {
			// 只记录键盘状态，不进行高度计算
			this.isShowKeyBoard = res.height > 0;
		},
		resizeListener() {
			// 简化resize监听，只记录状态
			let keyboardHeight = 0;
			
			if (window.visualViewport && uni.getSystemInfoSync().platform == 'ios') {
				keyboardHeight = 0;
			}
			
			this.isShowKeyBoard = keyboardHeight > 150;
		},
		focusInListener() {
			// 简化焦点监听
			this.isShowKeyBoard = true;
		},
		focusOutListener() {
			// 简化失焦监听
			this.isShowKeyBoard = false;
		},
		showBannedTip() {
			let msgInfo = {
				tmpId: this.generateId(),
				sendId: this.mine.id,
				sendTime: new Date().getTime(),
				type: this.$enums.MESSAGE_TYPE.TIP_TEXT
			}
			if (this.chat.type == "PRIVATE") {
				msgInfo.recvId = this.mine.id
				msgInfo.content = "该用户已被管理员封禁,原因:" + this.userInfo.reason
			} else {
				msgInfo.groupId = this.group.id;
				msgInfo.content = "本群聊已被管理员封禁,原因:" + this.group.reason
			}
			this.chatStore.insertMessage(msgInfo, this.chat);
		},
		generateId() {
			// 生成临时id 
			return String(new Date().getTime()) + String(Math.floor(Math.random() * 1000));
		},
		initMockData() {
			console.log('chat-box.vue: 开始初始化模拟数据');
			try {
				if (!this.chatStore) {
					console.error('chat-box.vue: chatStore不可用，初始化失败');
					return;
				}
				
				// 初始化模拟数据
				this.chatStore.initChats({
					chats: JSON.parse(JSON.stringify(mockChats)),
					privateMsgMaxId: 5000,
					groupMsgMaxId: 6000
				});
				
				console.log('chat-box.vue: 模拟数据初始化成功，共', mockChats.length, '条会话');
			} catch (error) {
				console.error('chat-box.vue: 初始化模拟数据失败', error);
			}
		},
	},
	computed: {
		mine() {
			if (this.useMockData) {
				// 使用模拟数据
				return this.mockCurrentUser || getMockCurrentUser();
			}
			return this.userStore.userInfo;
		},
		friend() {
			if (this.useMockData) {
				// 模拟数据模式下不使用好友存储
				return null;
			}
			return this.friendStore.findFriend(this.userInfo.id);
		},
		title() {
			if (!this.chat) {
				return "";
			}
			let title = this.chat.showName;
			if (this.chat.type == "GROUP") {
				let size = this.groupMembers.filter(m => !m.quit).length;
				title += `(${size})`;
			}
			return title;
		},
		messageAction() {
			return `/message/${this.chat.type.toLowerCase()}/send`;
		},
		messageSize() {
			if (!this.chat || !this.chat.messages) {
				return 0;
			}
			return this.chat.messages.length;
		},
		unreadCount() {
			if (!this.chat || !this.chat.unreadCount) {
				return 0;
			}
			return this.chat.unreadCount;
		},
		isBanned() {
			return (this.chat.type == "PRIVATE" && this.userInfo.isBanned) ||
				(this.chat.type == "GROUP" && this.group.isBanned)
		},
		atUserItems() {
			let atUsers = [];
			this.atUserIds.forEach((id) => {
				if (id == -1) {
					atUsers.push({
						id: -1,
						showNickName: "全体成员"
					})
					return;
				}
				let member = this.groupMembers.find((m) => m.userId == id);
				if (member) {
					atUsers.push(member);
				}
			})
			return atUsers;
		},
		memberSize() {
			return this.groupMembers.filter(m => !m.quit).length;
		}
	},
	watch: {
		messageSize: function(newSize, oldSize) {
			// 接收到消息时滚动到底部
			if (newSize > oldSize) {
				let pages = getCurrentPages();
				let curPage = pages[pages.length - 1].route;
				if (curPage == "pages/chat/chat-box") {
					this.scrollToBottom();
				} else {
					this.needScrollToBottom = true;
				}
			}
		},
		unreadCount: {
			handler(newCount, oldCount) {
				if (newCount > 0) {
					// 消息已读
					this.readedMessage()
				}
			}
		}
	},
	onLoad(options) {
		if (this.useMockData) {
			// 使用模拟数据
			this.mockCurrentUser = getMockCurrentUser();
			
			// 从模拟数据加载聊天数据
			const chatIdx = options.chatIdx || 0;
			
			try {
				// 先直接从mockChats获取数据
				console.log('chat-box.vue: 直接从mockChats获取聊天数据');
				this.chat = JSON.parse(JSON.stringify(mockChats[chatIdx]));
				
				// 确保消息有sendId字段
				if (this.chat && this.chat.messages) {
					this.chat.messages.forEach(msg => {
						if (!msg.sendId && msg.senderId) {
							msg.sendId = msg.senderId;
						}
					});
				}
				
				// 将数据加载到chatStore中
				if (this.chatStore && this.chatStore.initChats) {
					this.chatStore.initChats({
						chats: mockChats,
						privateMsgMaxId: 5000,
						groupMsgMaxId: 6000
					});
				}

				// 初始状态只显示20条消息
				let size = this.messageSize;
				this.showMinIdx = size > 20 ? size - 20 : 0;
				
				// 消息已读
				this.readedMessage();
				
				// 加载好友或群聊信息
				if (this.chat && this.chat.type == "GROUP") {
					this.loadGroup(this.chat.targetId);
				} else if (this.chat) {
					this.loadFriend(this.chat.targetId);
				}
			} catch (error) {
				console.error('chat-box.vue: 加载聊天数据出错', error);
			}
		} else {
			// 使用原有方式
			try {
				// 确保chatStore和chats存在
				if (!this.chatStore || !this.chatStore.chats || !this.chatStore.chats.length) {
					console.error('chat-box.vue: chatStore或chats不存在');
					return;
				}
				
				// 聊天数据
				this.chat = this.chatStore.chats[options.chatIdx];
				
				// 初始状态只显示20条消息
				let size = this.messageSize;
				this.showMinIdx = size > 20 ? size - 20 : 0;
				
				// 消息已读
				this.readedMessage();
				
				// 加载好友或群聊信息
				if (this.chat.type == "GROUP") {
					this.loadGroup(this.chat.targetId);
				} else {
					this.loadFriend(this.chat.targetId);
					this.loadReaded(this.chat.targetId);
				}
				
				// 激活当前会话
				this.chatStore.activeChat(options.chatIdx);
			} catch (error) {
				console.error('chat-box.vue: 加载聊天数据出错', error);
			}
		}
		
		// 复位回执消息
		this.isReceipt = false;
		// 计算聊天窗口高度
		this.$nextTick(() => {
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			this.reCalChatMainHeight();
			// #ifdef H5
			this.initHeight = window.innerHeight;
			document.body.addEventListener('touchmove', function(e) {
				e.preventDefault();
			}, { passive: false });
			// #endif
		});
	},
	onUnload() {
		// 由于不再使用自定义键盘监听，移除相关清理
		// this.unListenKeyboard();
	},
	onShow() {
		if (this.needScrollToBottom) {
			// 页面滚到底部
			this.scrollToBottom();
			this.needScrollToBottom = false;
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
.chat-box {
	$icon-color: rgba(0, 0, 0, 0.88);
	position: relative;
	background-color:transparent;

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		padding: 5px;
		background-color:transparent;
		line-height: 50px;
		font-size: $im-font-size-large;
		box-shadow: $im-box-shadow-lighter;
		z-index: 1;

		.btn-side {
			position: absolute;
			line-height: 60rpx;
			cursor: pointer;

			&.right {
				right: 30rpx;
			}
		}
	}

	.chat-main-box {
		// #ifdef H5
		top: $im-nav-bar-height;
		// #endif
		// #ifndef H5
		top: calc($im-nav-bar-height + var(--status-bar-height));
		// #endif
		position: fixed;
		width: 100%;
		display: flex;
		flex-direction: column;
		z-index: 2;

		.chat-msg {
			flex: 1;
			padding: 0;
			overflow: hidden;
			position: relative;
			background-color: transparent;

			.scroll-box {
				height: 100%;
			}
		}

		.chat-at-bar {
			display: flex;
			align-items: center;
			padding: 0 10rpx;

			.icon-at {
				font-size: $im-font-size-larger;
				color: $im-color-primary;
				font-weight: bold;
			}

			.chat-at-scroll-box {
				flex: 1;
				width: 80%;

				.chat-at-items {
					display: flex;
					align-items: center;
					height: 70rpx;

					.chat-at-item {
						padding: 0 3rpx;
					}
				}
			}

		}

		.send-bar {
			display: flex;
			flex-direction: row;
			padding: 10rpx 20rpx;
			border-top: $im-border solid 1px;
			background-color: $im-bg;
			min-height: 100rpx;
			margin-bottom: 14rpx;
			position: relative;

			.iconfont {
				font-size: 60rpx;
				margin: 0 10rpx;
				color: $icon-color;
				min-width: 60rpx;

			}
			.icon{
				width: 60rpx;
				height: 60rpx;
			}

			.chat-record {
				flex: 1;
			}

			.send-container {
				flex: 1;
				display: flex;
				flex-direction: row;
				position: relative;

				.send-text {
					flex: 1;
					overflow: auto;
					padding: 0 20rpx;

					border-radius: 8rpx;
					font-size: $im-font-size;
					box-sizing: border-box;
					margin: 0 10rpx;


					.send-text-area {
						background-color: white;
						width: 100%;
						height: auto;
						min-height: 70rpx;
						max-height: 300rpx; /* 约为10行文字高度 */
						overflow-y: auto; /* 确保可以滚动 */
						font-size: 30rpx;
						border-radius: 8rpx;
					}
				



					.btn-send {
						margin: 5rpx;
						height: 60rpx;
					}
				}
				.send-actions{
					display: flex;
					flex-direction: row;
				}
			}

		}
	}

	.chat-tab-bar {
		position: fixed;
		bottom: 0;
		background-color: $im-bg;
		width: 100%;
		background-color: white;
		z-index: 1000;

		.chat-tools {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: top;
			height: 90rpx;
			padding: 40rpx;
			box-sizing: border-box;
			width: 100%;

			.chat-tools-item {
				width: 25%;
				padding: 16rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				.icon{
					width: 100%;
					height: 100%;
					z-index: 1000;
				}

				.tool-icon {
					font-size: 54rpx;
					border-radius: 20%;
					background-color: white;
					color: $icon-color;
					width: 60rpx;
					height: 60rpx;
					.icon{
						width: 100%;
						height: 100%;
					}

					&:active {
						background-color: $im-bg-active;
					}
				}

				.tool-name {
					height: 60rpx;
					line-height: 60rpx;
					font-size: 28rpx;
				}
			}
		}

		.chat-emotion {
			height: 310px;
			padding: 20rpx;
			box-sizing: border-box;

			.emotion-item-list {
				display: flex;
				flex-wrap: wrap;
				gap: 10rpx; // 控制横向与纵向的间距
				justify-content: flex-start;
				flex-direction: row;
				height: 100%;
			}

				.emotion-item {
					width: calc((100% - 70rpx) / 8); // 减去7个gap再平分8个表情
					height: calc((100% - 70rpx) / 8);
					box-sizing: border-box;
				}
			}


	}
}
</style>