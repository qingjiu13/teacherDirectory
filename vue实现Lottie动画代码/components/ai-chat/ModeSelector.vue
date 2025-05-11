<template>
	<view class="function-section" :class="{ 'nav-mode': inNav }">
		<view class="function-list nav-tab-list" v-if="inNav">
			<view class="function-item nav-tab-item"
				:class="{active: currentMode === 'general'}"
				@click="switchMode('general')">
				<text class="function-item-text nav-tab-text">通用</text>
				<view v-if="currentMode === 'general'" class="tab-underline"></view>
			</view>
			<view class="function-item nav-tab-item"
				:class="{active: currentMode === 'school'}"
				@click="switchMode('school')">
				<text class="function-item-text nav-tab-text">择校</text>
				<view v-if="currentMode === 'school'" class="tab-underline"></view>
			</view>
			<view class="function-item nav-tab-item"
				:class="{active: currentMode === 'career'}"
				@click="switchMode('career')">
				<text class="function-item-text nav-tab-text">职业规划</text>
				<view v-if="currentMode === 'career'" class="tab-underline"></view>
			</view>
		</view>
		<view class="function-list" v-else>
			<view class="function-item"
				:class="{active: currentMode === 'general'}"
				@click="switchMode('general')">
				<text class="function-item-text">通用</text>
			</view>
			<view class="function-item"
				:class="{active: currentMode === 'school'}"
				@click="switchMode('school')">
				<text class="function-item-text">择校</text>
			</view>
			<view class="function-item"
				:class="{active: currentMode === 'career'}"
				@click="switchMode('career')">
				<text class="function-item-text">职业规划</text>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 功能模式选择组件
	 * @property {String} currentMode - 当前选中的模式
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
		methods: {
			/**
			 * @description 切换对话模式
			 * @param {String} mode - 对话模式
			 */
			switchMode(mode) {
				if (this.currentMode === mode) return;
				this.$emit('modeChange', mode);
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