<template>
	<view class="container">
		<view class="progress-bar">
			<text class="progress-text">4/6</text>
		</view>

		<view class="question-container">
			<view class="emoji">😄</view>
			<text class="question">您想报考的研究生专业是？</text>
			
			<view class="search-box">
				<input class="search-input" 
					v-model="searchText" 
					placeholder="请选择专业" 
					@focus="showMajorList = true"
				/>
			</view>
			
			<!-- 专业列表 -->
			<scroll-view 
				v-if="showMajorList" 
				class="major-list"
				scroll-y="true"
			>
				<view 
					v-for="(major, index) in filteredMajors" 
					:key="index"
					class="major-item"
					@click="selectMajor(major)"
				>
					{{major}}
				</view>
			</scroll-view>
			
			<text class="question second-question">希望就读的学习方式是？</text>
			<view class="options-container">
				<view 
					v-for="(option, index) in studyModes" 
					:key="index"
					:class="['option-item', selectedMode === option ? 'active' : '']"
					@click="selectMode(option)"
				>
					{{option}}
				</view>
			</view>
		</view>

		<view class="button-group">
			<button class="prev-btn" @click="prevPage">上一步</button>
			<button class="next-btn" @click="nextPage">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				showMajorList: false,
				majors: [],
				studyModes: ['全日制', '非全日制'],
				selectedMajor: '',
				selectedMode: '',
				loading: false
			}
		},
		computed: {
			filteredMajors() {
				return this.majors.filter(major => 
					major.toLowerCase().includes(this.searchText.toLowerCase())
				);
			}
		},
		onLoad() {
			// 加载专业数据
			this.getMajorData();
		},
		methods: {
			// 获取专业数据
			async getMajorData() {
				this.loading = true;
				try {
					const result = await uniCloud.callFunction({
						name: 'getMajors',
						data: {}
					});
					if (result.result.code === 0) {
						this.majors = result.result.data;
					}
				} catch (e) {
					console.error('获取专业数据失败:', e);
					uni.showToast({
						title: '获取专业数据失败',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			
			// 根据关键词搜索专业
			async searchMajors(keyword) {
				if (!keyword) return;
				this.loading = true;
				try {
					const result = await uniCloud.callFunction({
						name: 'getMajors',
						data: { keyword }
					});
					if (result.result.code === 0) {
						// 只在有结果时更新列表，避免清空
						if (result.result.data.length > 0) {
							this.majors = result.result.data;
						}
					}
				} catch (e) {
					console.error('搜索专业失败:', e);
				} finally {
					this.loading = false;
				}
			},
			
			// 搜索框输入事件处理
			onMajorInput(e) {
				this.searchText = e.detail.value;
				this.showMajorList = true;
				if (this.searchText.length >= 2) {
					this.searchMajors(this.searchText);
				}
			},
			
			selectMajor(major) {
				this.searchText = major;
				this.selectedMajor = major;
				this.showMajorList = false;
				// 保存到本地存储
				uni.setStorageSync('step4_major', major);
			},
			selectMode(mode) {
				this.selectedMode = mode;
				// 保存到本地存储
				uni.setStorageSync('step4_mode', mode);
			},
			prevPage() {
				uni.navigateBack();
			},
			nextPage() {
				if (!this.selectedMajor || !this.selectedMode) {
					uni.showToast({
						title: '请选择完整信息',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/selection/step5'
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}
	
	.progress-bar {
		text-align: center;
		margin-bottom: 40rpx;
	}
	
	.progress-text {
		font-size: 32rpx;
		color: #FF9853;
		background: #FFF;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
	}
	
	.question-container {
		margin-top: 40rpx;
	}
	
	.emoji {
		font-size: 48rpx;
		margin-bottom: 20rpx;
	}
	
	.question {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 40rpx;
		display: block;
	}
	
	.second-question {
		margin-top: 60rpx;
	}
	
	.search-box {
		margin: 20rpx 0;
	}
	
	.search-input {
		width: 100%;
		height: 80rpx;
		background: #F5F5F5;
		border-radius: 40rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
	}
	
	.major-list {
		max-height: 300rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.major-item {
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		border-bottom: 1rpx solid #EEEEEE;
	}
	
	.major-item:active {
		background: #F5F5F5;
	}
	
	.options-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 30rpx;
		justify-content: center;
	}
	
	.option-item {
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #F5F5F5;
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.active {
		background: #007AFF;
		color: #FFFFFF;
	}
	
	.button-group {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.prev-btn, .next-btn {
		width: 45%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
	
	.prev-btn {
		background: #FFFFFF;
		color: #007AFF;
		border: 1rpx solid #007AFF;
	}
	
	.next-btn {
		background: #007AFF;
		color: #FFFFFF;
	}
</style> 