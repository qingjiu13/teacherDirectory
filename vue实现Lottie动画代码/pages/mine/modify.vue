<template>
	<view class="modify-container">
		<view class="header">
			<text class="header-title">个人资料</text>
		</view>
		
		<!-- 表单区域 -->
		<view class="form-container">
			<!-- 头像 -->
			<view class="form-item">
				<text class="form-label">头像</text>
				<view class="avatar-wrapper" @click="chooseAvatar">
					<image :src="userInfo.avatar || '/static/image/defaultAvatar/teacher-man.png'" class="avatar" mode="aspectFill"></image>
					<view class="avatar-edit-icon">
						<text class="icon">✏️</text>
					</view>
				</view>
			</view>
			
			<!-- 昵称 -->
			<view class="form-item">
				<text class="form-label">昵称</text>
				<input 
					type="text" 
					v-model="userInfo.nickname" 
					placeholder="请输入昵称" 
					class="form-input" 
					maxlength="20"
				/>
			</view>
			
			<!-- 个人介绍 -->
			<view class="form-item">
				<text class="form-label">个人介绍</text>
				<textarea 
					v-model="userInfo.introduction" 
					placeholder="请输入个人介绍" 
					class="form-textarea" 
					maxlength="200"
				></textarea>
				<text class="word-count">{{userInfo.introduction.length}}/200</text>
			</view>
			
			<!-- 性别 -->
			<view class="form-item">
				<text class="form-label">性别</text>
				<view class="radio-group">
					<view class="radio-item" @click="userInfo.gender = '男'">
						<view class="radio-circle" :class="{'selected': userInfo.gender === '男'}"></view>
						<text class="radio-text">男</text>
					</view>
					<view class="radio-item" @click="userInfo.gender = '女'">
						<view class="radio-circle" :class="{'selected': userInfo.gender === '女'}"></view>
						<text class="radio-text">女</text>
					</view>
				</view>
			</view>
			
			<!-- 手机号 -->
			<view class="form-item">
				<text class="form-label">手机号</text>
				<input 
					type="number" 
					v-model="userInfo.phone" 
					placeholder="请输入手机号" 
					class="form-input" 
					maxlength="11"
				/>
			</view>
			
			<!-- 微信号 -->
			<view class="form-item">
				<text class="form-label">微信号</text>
				<input 
					type="text" 
					v-model="userInfo.wechat" 
					placeholder="请输入微信号" 
					class="form-input" 
					maxlength="30"
				/>
			</view>
			
			<!-- 密码 -->
			<view class="form-item">
				<text class="form-label">密码</text>
				<input 
					type="password" 
					v-model="userInfo.password" 
					placeholder="请输入密码" 
					class="form-input" 
					maxlength="20"
				/>
			</view>
		</view>
		
		<!-- 保存按钮 -->
		<view class="save-button-container">
			<button class="save-button" @click="saveProfile" :disabled="updating">保存</button>
		</view>
	</view>
</template>

<script>
/**
 * @description 用户资料修改页面
 */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { Navigator } from '@/router/Router.js';

export default {
	data() {
		return {
			userInfo: {
				avatar: '',
				nickname: '',
				introduction: '',
				gender: '',
				phone: '',
				wechat: '',
				password: '未设置'
			},
			updating: false,
			originalData: null // 用于存储原始数据以便对比变更
		}
	},
	computed: {
		...mapState('user/baseInfo', {
			storeId: state => state.id,
			storeAvatar: state => state.avatar,
			storeName: state => state.name,
			storeGender: state => state.gender,
			storeSelfIntroduction: state => state.selfIntroduction,
			storeWechatNumber: state => state.wechatNumber,
			storePhoneNumber: state => state.phoneNumber,
			storePassword: state => state.password,
		}),
		...mapGetters('user/baseInfo', [
			'profile',
			'userRole',
			'isTeacher'
		]),
		// 计算属性：数据是否已修改
		isDataChanged() {
			if (!this.originalData) return false;
			return JSON.stringify(this.userInfo) !== JSON.stringify(this.originalData);
		}
	},
	onLoad() {
		// 初始化用户信息
		this.initUserInfo();
	},
	onShow() {
		// 每次页面显示时重新加载数据
		this.initUserInfo();
	},
	methods: {
		...mapActions('user/baseInfo', [
			'getUserInfo'
		]),
		...mapMutations('user/baseInfo', [
			'UPDATE_USER_PROFILE'
		]),
		
		/**
		 * @description 初始化用户信息
		 */
		async initUserInfo() {
			try {
				console.log('初始化用户信息...');
				
				// 从store获取用户数据
				this.userInfo = {
					avatar: this.storeAvatar || '',
					nickname: this.storeName || '',
					introduction: this.storeSelfIntroduction || '',
					gender: this.storeGender || '',
					phone: this.storePhoneNumber || '',
					wechat: this.storeWechatNumber || '',
					password: this.storePassword || '未设置'
				};
				
				console.log('从store获取的用户信息:', this.userInfo);
				
				// 保存原始数据副本用于后续比较
				this.originalData = JSON.parse(JSON.stringify(this.userInfo));
			} catch (error) {
				console.error('获取用户信息失败', error);
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				});
			}
		},
		
		/**
		 * @description 选择头像
		 */
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const tempFilePath = res.tempFilePaths[0];
					// 在实际应用中，这里应该上传图片到服务器
					// 这里仅做演示，直接使用临时路径
					this.userInfo.avatar = tempFilePath;
				}
			});
		},
		
		
		/**
		 * @description 保存用户资料
		 */
		async saveProfile() {
			// 基本验证
			if (!this.userInfo.nickname) {
				uni.showToast({
					title: '昵称不能为空',
					icon: 'none'
				});
				return;
			}
			
			// 手机号格式验证
			if (this.userInfo.phone && !/^1\d{10}$/.test(this.userInfo.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			
			// 检查数据是否有变更
			if (!this.isDataChanged) {
				uni.showToast({
					title: '未检测到数据变更',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
				return;
			}
			
			try {
				this.updating = true;
				console.log('开始保存用户资料...');
				
				// 准备要更新的数据
				const profileData = {
					avatar: this.userInfo.avatar,
					nickname: this.userInfo.nickname, // 提交时使用nickname字段
					name: this.userInfo.nickname, // 同时提供name字段以确保兼容性
					selfIntroduction: this.userInfo.introduction,
					introduction: this.userInfo.introduction, // 提供两个字段名以确保兼容性
					gender: this.userInfo.gender,
					phoneNumber: this.userInfo.phone,
					phone: this.userInfo.phone, // 提供两个字段名以确保兼容性
					wechatNumber: this.userInfo.wechat,
					
					password: this.userInfo.password // 添加password字段到更新数据中
				};
				
				console.log('要更新的用户资料:', profileData);
				
				// 使用mutation更新store中的数据
				this.UPDATE_USER_PROFILE(profileData);
				
				// 显示成功提示
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				
				// 更新原始数据，防止重复提交
				this.originalData = JSON.parse(JSON.stringify(this.userInfo));
				
				// 返回个人页面
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			} catch (error) {
				console.error('保存失败', error);
				uni.showToast({
					title: error.message || '保存失败',
					icon: 'none'
				});
			} finally {
				this.updating = false;
			}
		}
	}
}
</script>

<style>
.modify-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f8f8f8;
}

.header {
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 1rpx solid #f0f0f0;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

.form-container {
	padding: 20rpx;
	background-color: #ffffff;
	margin-top: 20rpx;
}

.form-item {
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-label {
	font-size: 32rpx;
	color: #333333;
	margin-bottom: 20rpx;
	display: block;
}

.form-input {
	width: 100%;
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.form-textarea {
	width: 100%;
	height: 200rpx;
	background-color: #f8f8f8;
	border-radius: 8rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.word-count {
	text-align: right;
	font-size: 24rpx;
	color: #999999;
	margin-top: 10rpx;
}

.avatar-wrapper {
	position: relative;
	width: 150rpx;
	height: 150rpx;
	margin: 0 auto;
}

.avatar {
	width: 150rpx;
	height: 150rpx;
	border-radius: 75rpx;
	background-color: #f0f0f0;
}

.avatar-edit-icon {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 50rpx;
	height: 50rpx;
	background-color: #ffffff;
	border-radius: 25rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.radio-group {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.radio-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-right: 60rpx;
}

.radio-circle {
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	border: 2rpx solid #dddddd;
	display: flex;
	justify-content: center;
	align-items: center;
}

.radio-circle.selected {
	border-color: #2196F3;
	background-color: #2196F3;
}

.radio-circle.selected:after {
	content: '';
	width: 20rpx;
	height: 20rpx;
	border-radius: 10rpx;
	background-color: #ffffff;
}

.radio-text {
	font-size: 28rpx;
	color: #333333;
	margin-left: 10rpx;
}

.password-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.password-value {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.arrow-right {
	font-size: 28rpx;
	color: #999999;
	margin-left: 10rpx;
}

.save-button-container {
	padding: 40rpx 20rpx;
}

.save-button {
	width: 100%;
	height: 90rpx;
	background-color: #2196F3;
	color: #ffffff;
	border-radius: 45rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
}

.save-button[disabled] {
	background-color: #cccccc;
}
</style>