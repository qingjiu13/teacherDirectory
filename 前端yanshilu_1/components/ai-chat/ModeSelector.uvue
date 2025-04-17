<template>
	<view class="function-section">
		<view class="function-list">
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
	 * @event {Function} modeChange - 模式变更事件
	 */
	export default {
		name: "ModeSelector",
		props: {
			currentMode: {
				type: String,
				default: 'general',
				validator: (value) => ['general', 'school', 'career'].includes(value)
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
	
	.function-item.active {
		background-color: #1E90FF;
	}
	
	.function-item-text {
		font-size: 28rpx;
		color: #333;
	}
	
	.function-item.active .function-item-text {
		color: #ffffff;
	}
</style> 