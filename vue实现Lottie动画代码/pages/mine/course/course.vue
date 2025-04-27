<template>
	<view class="container">
		<!-- 添加日历组件 -->
		<uni-calendar 
			ref="calendar"
			:insert="false"
			:start-date="getToday()"
			@confirm="onCalendarConfirm"
		/>
		<scroll-view class="course-list" scroll-y>
			<view class="course-item" v-for="(item, index) in courseList" :key="index">
				<image class="course-img" src="/static/images/default_avatar.png"></image>
				<view class="course-info">
					<text class="course-name">{{item.name}}</text>
					<text class="course-teacher">讲师: {{item.teacher}}</text>
					<text class="course-time">时间: {{item.time}}</text>
					<text class="course-price">¥{{item.price}}</text>
				</view>
				<button class="reserve-btn" @click="handleReserve(index)">预约</button>
			</view>
		</scroll-view>
	</view>
</template>



<script>
	export default {
		data() {
			return {
				courseList: [
					{
						name: "前端开发基础",
						teacher: "张老师",
						time: "2023-12-15 14:00",
						price: 199
					},
					{
						name: "Vue.js实战",
						teacher: "李老师",
						time: "2023-12-16 10:00",
						price: 299,
						
					},
					{
						name: "小程序开发",
						teacher: "王老师",
						time: "2023-12-17 15:00",
						price: 249,
						
					}
				],
				currentCourseIndex: null,
				selectedDate: null // 新增用于存储选择的日期
			}
		},
		methods: {
			async handleReserve(index) {
				const course = this.courseList[index];
				// 第一步：确认预约
				const { confirm } = await uni.showModal({
					title: '确认预约',
					content: `确定要预约《${course.name}》课程吗？`,
					confirmText: '确认',
					cancelText: '取消'
				});
				
				if (!confirm) return;
				
				// 记录当前课程索引
				this.currentCourseIndex = index;
				// 显示日期选择提示
				uni.showToast({
					title: '请选择预约日期',
					icon: 'none',
					duration: 1500
				});
				// 打开日历组件
				this.$refs.calendar.open();
			},
			
			async onCalendarConfirm(e) {
				this.selectedDate = e.fulldate;
				// 显示时间选择提示
				await uni.showToast({
					title: `已选择日期: ${e.fulldate}\n请选择时间段`,
					icon: 'none',
					duration: 1500
				});
				// 选择日期后继续选择时间段
				await this.selectReserveTime();
			},
			
			async selectReserveTime() {
				const { time } = await new Promise((resolve) => {
					uni.showActionSheet({
						title: '选择预约时间段',
						itemList: ['上午 9:00-11:00', '下午 14:00-16:00', '晚上 19:00-21:00'],
						success: (res) => {
							const times = ['9:00-11:00', '14:00-16:00', '19:00-21:00'];
							resolve({ time: times[res.tapIndex] });
						},
						fail: () => resolve({ time: null })
					});
				});
				
				if (!time) return;
				
				const course = this.courseList[this.currentCourseIndex];
				uni.showToast({
					title: `已成功预约: ${course.name}\n日期: ${this.selectedDate}\n时间: ${time}`,
					icon: 'success',
					duration: 3000
				});
				
				// 重置状态
				this.currentCourseIndex = null;
				this.selectedDate = null;
			},
			
			getToday() {
				const today = new Date();
				return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
	}
	/* 移除.header相关样式 */
	.header {
		margin-bottom: 30rpx;
	}
	.title {
		font-size: 36rpx;
		font-weight: bold;
	}
	.course-list {
		height: calc(100vh - 100rpx);
	}
	.course-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
	}

	.course-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	.course-info {
		flex: 1;
	}
	
	.course-name {
		font-size: 32rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.course-teacher, .course-time, .course-price {
		font-size: 28rpx;
		color: #666;
		display: block;
		margin-bottom: 5rpx;
	}
	
	.reserve-btn {
		background-color: #007AFF;
		color: white;
		border-radius: 40rpx;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
	}
</style>