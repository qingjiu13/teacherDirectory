<template>
	<Header :title="'修改资料'" @back="handleBack" class="header-container"/>
	<view class="background-image">
    <image
        src="/static/image/bgPicture/background1.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
    <view class="background-image">
      <image
        src="/static/image/bgPicture/background.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
	<view class="container">
		<view class="modify-container">

			<!-- 表单区域 -->
			<view class="form-container">
				<!-- 头像 -->
				<view class="form-item horizontal-item">
					<text class="form-label">头像</text>
					<view class="input-container">
						<view class="avatar-wrapper" @click="chooseAvatar">
							<image :src="userInfo.avatar || '/static/image/defaultAvatar/teacher-man.png'" class="avatar" mode="aspectFill"></image>
							<!-- 头像底部正方形背景 -->
							<!--
								@description 头像底部正方形背景
								@style background: rgba(239, 240, 255, 1); width: 90rpx; height: 90rpx; border-radius: 2px; border-width: 2px;
							-->
							<view class="avatar-square-bg"></view>
						</view>
					</view>
				</view>
				
				<!-- 昵称 -->
				<view class="form-item horizontal-item">
					<text class="form-label">昵称</text>
					<view class="input-container">
						<input 
							type="text" 
							v-model="userInfo.nickname" 
							placeholder="请输入昵称" 
							class="form-input" 
							maxlength="20"
						/>
					</view>
				</view>
				

				
				<!-- 性别 -->
				<view class="form-item horizontal-item">
					<text class="form-label">性别</text>
					<view class="input-container">
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
				</view>
				
				<!-- 手机号 -->
				<view class="form-item horizontal-item">
					<text class="form-label">手机号</text>
					<view class="input-container">
						<input 
							type="number" 
							v-model="userInfo.phone" 
							placeholder="请输入手机号" 
							class="form-input" 
							maxlength="11"
						/>
					</view>
				</view>
				
				<!-- 微信号 -->
				<view class="form-item horizontal-item">
					<text class="form-label">微信号</text>
					<view class="input-container">
						<input 
							type="text" 
							v-model="userInfo.wechat" 
							placeholder="请输入微信号" 
							class="form-input" 
							maxlength="30"
						/>
					</view>
				</view>
				
				<!-- 密码 -->
				<view class="form-item horizontal-item">
					<text class="form-label">密码</text>
					<view class="input-container">
						<input 
							type="password" 
							v-model="userInfo.password" 
							placeholder="请输入密码" 
							class="form-input" 
							maxlength="20"
						/>
					</view>
				</view>
				<!-- 个人介绍 -->
				<view class="form-item">
					<text class="form-label">个人介绍</text>
						<view class="input-container">
							<textarea 
								v-model="userInfo.introduction" 
								placeholder="请输入个人介绍" 
								class="form-textarea" 
								maxlength="200"
							></textarea>
							<text class="word-count">{{userInfo.introduction.length}}/200</text>
						</view>
				</view>
				<!-- 保存按钮 -->
				<view class="save-button-container">
					<button class="save-button" @click="saveProfile" :disabled="updating">
						<image src="../static/modify/submit.png" mode="aspectFill" class="save-button-image"/>
						<text class="save-button-text">提交</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * @description 用户资料修改页面
 */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { Navigator } from '@/router/Router.js';
import Header from '@/components/navigationTitleBar/header.vue';

export default {
	components: {
		Header
	},
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
					title: '获取用户信息失败' 
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
		
		handleBack() {
			uni.navigateBack();
		},
		/**
		 * @description 保存用户资料
		 */
		async saveProfile() {
			// 基本验证
			if (!this.userInfo.nickname) {
				uni.showToast({
					title: '昵称不能为空' 
				});
				return;
			}
			
			// 手机号格式验证
			if (this.userInfo.phone && !/^1\d{10}$/.test(this.userInfo.phone)) {
				uni.showToast({
					title: '手机号格式不正确' 
				});
				return;
			}
			
			// 检查数据是否有变更
			if (!this.isDataChanged) {
				uni.showToast({
					title: '未检测到数据变更' 
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
					title: error.message || '保存失败' 
				});
			} finally {
				this.updating = false;
			}
		}
	}
}
</script>

<style>
.header-container {
	/**
	 * @description 固定顶部导航栏，背景不透明，确保在最上层
	 */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 100;
}

.container {
	/**
	 * @description 填充除header外的所有区域，底部透明
	 */
	position: absolute;
	top: 206rpx; /* header高度 */
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	background: transparent;
	z-index: 1;
	overflow: hidden;
}

.modify-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: transparent;
}

.form-container {
	background-color: transparent;
}

.form-item {
	padding: 10rpx 0;

}

/* 水平排列的表单项样式 */
.horizontal-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid rgba(217, 217, 217, 1);
	height: 110rpx;
}

/**
 * @description 表单标签样式，文字靠左对齐
 */
/**
 * @description 表单标签样式，确保所有内容左对齐
 */
.form-label {
	line-height: 110rpx; /* 与 .horizontal-item 的 height 保持一致 */
	position: relative;
	display: block; /* 使用 block 保证内容左对齐 */
	margin-left: 40rpx;
	font-size: 28rpx;
	font-family: PingFang SC;
	font-weight: 500;
	letter-spacing: -0.55px;
	color: rgba(0, 0, 0, 1);
	text-align: left; /* 明确指定文字靠左 */
}

/* 水平布局时标签样式 */
.horizontal-item .form-label {
	margin-bottom: 0;
	width: 160rpx;
	flex-shrink: 0;
}

/**
 * 输入区域容器
 * 使容器内的元素靠右对齐
 */
.input-container {
	flex: 1;
	display: flex;
	justify-content: flex-end; /* 元素靠右 */
	align-items: flex-end;     /* 元素在交叉轴底部对齐 */
	padding-left: 40rpx;
	padding-right: 40rpx;
	position: relative; /* 使字数统计可以绝对定位 */
}

/* 个人介绍的输入容器特殊处理，不需要右对齐 */
.form-item:not(.horizontal-item) .input-container {
	display: block;
	justify-content: flex-start;
}

/**
 * 表单输入框样式
 * 文字内容靠右对齐
 */
.form-input {
	width: 100%;
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 8rpx;

	font-size: 24rpx;
	text-align: right; /* 文字靠右 */
	background-color: transparent;

	font-family: PingFang SC;
	font-weight: 400;
	line-height: 100%;
	letter-spacing: -1.1rpx;

}

/* 水平布局中的输入框样式调整，限制最大宽度，保持右对齐 */
.horizontal-item .form-input {
	max-width: 400rpx;
	width: auto;
}

.form-textarea {
	width: 100%;
	height: 400rpx;
	background-color: #f8f8f8;
	border-radius: 8rpx;
	padding: 30rpx 40rpx;
	font-size: 28rpx;
	border-radius: 40rpx;
	font-family: PingFang SC;
	font-weight: 400;
	line-height: 100%;
	letter-spacing: -1.1rpx;
	padding-bottom: 60rpx; /* 增加底部内边距，避免字数统计遮挡内容 */
	background: linear-gradient(180deg, rgba(217, 217, 217, 0.1) 11.54%, rgba(126, 126, 126, 0.1) 111.54%);
	backdrop-filter: blur(30px);

}

.word-count {
	text-align: right;
	font-size: 24rpx;
	color: rgba(0, 0, 0, 0.6);
	margin-top: 10rpx;
	position: absolute;
	bottom: 30rpx;
	right: 80rpx;
	z-index: 2;
	font-family: PingFang SC;
	font-weight: 400;
	line-height: 100%;
	letter-spacing: -1.1rpx;

}

.avatar-wrapper {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 75rpx;
	background-color: #f0f0f0;
	z-index: 5;

}

.radio-group {     
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	width: auto;
}

.radio-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 80rpx;
}

.radio-circle {
	width: 24rpx;
	height: 24rpx;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid rgba(86, 86, 86, 1)
}

.radio-circle.selected {
	background: rgba(95, 38, 247, 1);
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
	padding: 20rpx 40rpx 20rpx;
}

.save-button {
	width: 100%;
	height: 76rpx;
	background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
	color: #ffffff;
	border-radius: 45rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
	border-radius: 20rpx;
	flex-direction: row;
	margin-top: 60rpx;
}


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
.save-button-image{
	width: 36rpx;
	height: 36rpx;
	margin-right: 30rpx;
}
.save-button-text{
	font-size: 32rpx;
	color: rgba(255, 255, 255, 1);
	font-family: PingFang SC;
	font-weight: 400;
	line-height: 100%;
	letter-spacing: -0.68px;
	text-align: center;

}
/* 头像底部正方形背景样式 */
.avatar-square-bg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 80rpx;
  background: rgba(239, 240, 255, 1);
  border-radius: 4rpx;
  z-index: 1;
}
</style>