<template>
	<view class="container">
		<!-- 添加日历组件 -->
		<uni-calendar 
			ref="calendar"
			:insert="false"
			:start-date="getToday()"
			@confirm="onCalendarConfirm"
		/>
		
		<!-- tab切换 -->
		<view class="tabs">
			<view 
				v-for="(tab, index) in tabList" 
				:key="index" 
				:class="['tab-item', currentTab === index ? 'active' : '']"
				@click="changeTab(index)"
			>
				{{ tab }}
			</view>
		</view>

		<!-- 搜索框 -->
		<view class="search-bar">
			<input 
				type="text" 
				placeholder="搜索课程名称或讲师"
				v-model="searchText"
				@input="searchCourse"
			/>
		</view>

		<!-- 课程列表 -->
		<scroll-view class="course-list" scroll-y @refresh="onRefresh">
			<view class="course-item" v-for="(item, index) in filteredCourses" :key="index">
				<image class="course-img" src="/static/images/default_avatar.png"></image>
				<view class="course-info">
					<text class="course-name">{{ item.name }}</text>
					<text class="course-teacher">讲师: {{ item.teacher }}</text>
					<text class="course-time">时间: {{ item.time }}</text>
					<text class="course-status">状态: {{ getStatusText(item.status) }}</text>
					<text class="course-price">¥{{ item.price }}</text>
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
					price: 199,
					status: "ongoing"
				},
				{
					name: "Vue.js实战",
					teacher: "李老师",
					time: "2023-12-16 10:00",
					price: 299,
					status: "upcoming"
				},
				{
					name: "小程序开发",
					teacher: "王老师",
					time: "2023-12-17 15:00",
					price: 249,
					status: "completed"
				}
			],
			tabList: ['全部', '进行中', '即将开始', '已结束'],
			currentTab: 0,
			searchText: '',
			currentCourseIndex: null,
			selectedDate: null
		}
	},
	computed: {
		// 筛选后的课程列表
		filteredCourses() {
			let filtered = [...this.courseList];

			// 按tab筛选
			if (this.currentTab === 1) {
				filtered = filtered.filter(course => course.status === 'ongoing');
			} else if (this.currentTab === 2) {
				filtered = filtered.filter(course => course.status === 'upcoming');
			} else if (this.currentTab === 3) {
				filtered = filtered.filter(course => course.status === 'completed');
			}

			// 按搜索文本筛选
			if (this.searchText) {
				filtered = filtered.filter(course => 
					course.name.includes(this.searchText) || 
					course.teacher.includes(this.searchText)
				);
			}
			return filtered;
		}
	},
	methods: {
		// 预约流程
		async handleReserve(index) {
			const course = this.courseList[index];
			const { confirm } = await uni.showModal({
				title: '确认预约',
				content: `确定要预约《${course.name}》课程吗？`,
				confirmText: '确认',
				cancelText: '取消'
			});
			if (!confirm) return;

			this.currentCourseIndex = index;

			uni.showToast({
				title: '请选择预约日期',
				icon: 'none',
				duration: 1500
			});

			this.$refs.calendar.open();
		},

		// 日历确认
		async onCalendarConfirm(e) {
			this.selectedDate = e.fulldate;
			await uni.showToast({
				title: `已选择日期: ${e.fulldate}\n请选择时间段`,
				icon: 'none',
				duration: 1500
			});
			await this.selectReserveTime();
		},

		// 选择时间段
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

			this.currentCourseIndex = null;
			this.selectedDate = null;
		},

		// 获取今天日期
		getToday() {
			const today = new Date();
			return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		},

		// 切换tab
		changeTab(index) {
			this.currentTab = index;
		},

		// 搜索课程
		searchCourse(e) {
			this.searchText = e.detail.value;
		},

		// 下拉刷新
		onRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},

		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				ongoing: '进行中',
				upcoming: '即将开始',
				completed: '已结束'
			};
			return statusMap[status] || '未知状态';
		}
	}
}
</script>
<style>
.container {
	padding: 20rpx;
}
.tabs {
	display: flex;
	justify-content: space-around;
	margin-bottom: 20rpx;
}
.tab-item {
	padding: 10rpx 20rpx;
	border-bottom: 2rpx solid transparent;
	color: #666;
}
.tab-item.active {
	color: #007AFF;
	border-bottom: 2rpx solid #007AFF;
}
.search-bar {
	margin-bottom: 20rpx;
}
.search-bar input {
	width: 100%;
	padding: 10rpx;
	border: 1rpx solid #ccc;
	border-radius: 10rpx;
}
.course-list {
	height: calc(100vh - 300rpx);
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
.course-teacher, .course-time, .course-status, .course-price {
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
