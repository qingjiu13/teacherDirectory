<template>
  <view class="container">
    <top-navbar @change="onTabChange">
      <template v-slot:page1>
        <view class="page-content">
          <view class="selected-date-info" v-if="selectedDate">
            <text class="date-info-title">已选择日期：</text>
            <text class="date-info-content">{{selectedDate}}</text>
            <button class="reset-btn" @click="resetDateSelection">重选</button>
          </view>
          
          <scroll-view class="course-list" scroll-y>
            <view v-for="(item, index) in pendingCourses" :key="index" class="course-item">
              <image class="course-img" :src="item.image || '/static/images/default_avatar.png'" mode="aspectFill"></image>
              <view class="course-info">
                <text class="course-name">{{item.name}}</text>
                <text class="course-teacher">讲师: {{item.teacher}}</text>
                <text class="course-time">时间: {{item.time}}</text>
                <text class="course-price">¥{{item.price}}</text>
              </view>
              <button class="reserve-btn" @click="handleReserve(index)">预约</button>
            </view>
            <view v-if="pendingCourses.length === 0" class="empty-tip">
              <text>暂无待预约课程</text>
            </view>
          </scroll-view>
          
          <!-- 日历选择器（弹出式） -->
          <uni-calendar 
            ref="calendar"
            :insert="false"
            :start-date="getToday()"
            :end-date="getNextMonth()"
            @confirm="onCalendarConfirm"
          />
        </view>
      </template>
      
      <template v-slot:page2>
        <!-- 已预约页面 -->
        <view class="page-content">
          <scroll-view class="course-list" scroll-y>
            <view v-for="(item, index) in reservedCourses" :key="index" class="course-item">
              <image class="course-img" :src="item.image || '/static/images/default_avatar.png'" mode="aspectFill"></image>
              <view class="course-info">
                <text class="course-name">{{item.name}}</text>
                <text class="course-teacher">讲师: {{item.teacher}}</text>
                <text class="course-time">预约时间: {{item.reservedTime}}</text>
                <text class="course-price">¥{{item.price}}</text>
              </view>
              <button class="cancel-btn" @click="cancelReservation(index)">取消预约</button>
            </view>
            <view v-if="reservedCourses.length === 0" class="empty-tip">
              <text>暂无已预约课程</text>
            </view>
          </scroll-view>
        </view>
      </template>
      
      <template v-slot:page3>
        <!-- 已完成页面 -->
        <view class="page-content">
          <scroll-view class="course-list" scroll-y>
            <view v-for="(item, index) in completedCourses" :key="index" class="course-item">
              <image class="course-img" :src="item.image || '/static/images/default_avatar.png'" mode="aspectFill"></image>
              <view class="course-info">
                <text class="course-name">{{item.name}}</text>
                <text class="course-teacher">讲师: {{item.teacher}}</text>
                <text class="course-time">完成时间: {{item.completedTime}}</text>
                <text class="course-price">¥{{item.price}}</text>
                <view class="rating" v-if="item.rating">
                  <text class="rating-text">评分: </text>
                  <text class="rating-star" v-for="i in 5" :key="i">
                    {{i <= item.rating ? '★' : '☆'}}
                  </text>
                </view>
              </view>
              <button class="review-btn" @click="goToAppraise(item)">评价</button>
            </view>
            <view v-if="completedCourses.length === 0" class="empty-tip">
              <text>暂无已完成课程</text>
            </view>
          </scroll-view>
        </view>
      </template>
    </top-navbar>
  </view>
</template>

<script>
// 导入顶部导航栏组件
import topNavbar from '@/components/top-navbar/top-navbar.vue';

export default {
  components: {
    topNavbar
  },
  data() {
    return {
      currentTab: 0,
      // 更具体的时间段选择
      timeSlots: [
        { period: '上午', slots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'] },
        { period: '下午', slots: ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] },
        { period: '晚上', slots: ['18:00-19:00', '19:00-20:00', '20:00-21:00'] }
      ],
      selectedTimeSlot: '',
      selectedTimePeriod: '',
      // 待预约课程数据 - 修改为考研相关课程
      pendingCourses: [
        {
          id: 1,
          name: "考研政治精讲班",
          teacher: "王老师",
          time: "2023-12-15 14:00",
          price: 399,
          image: "/static/images/default_avatar.png",
          description: "系统讲解考研政治马原、毛中特、思修法基、当代世界经济与政治重点内容。"
        },
        {
          id: 2,
          name: "考研数学基础班",
          teacher: "李老师",
          time: "2023-12-16 10:00",
          price: 499,
          image: "/static/images/default_avatar.png",
          description: "覆盖高等数学、线性代数、概率论与数理统计核心知识点，夯实数学基础。"
        },
        {
          id: 3,
          name: "考研英语词汇班",
          teacher: "张老师",
          time: "2023-12-17 15:00",
          price: 349,
          image: "/static/images/default_avatar.png",
          description: "掌握考研英语必备5500词汇，提高阅读理解和写作能力。"
        },
        {
          id: 4,
          name: "计算机专业课辅导",
          teacher: "陈老师",
          time: "2023-12-18 19:00",
          price: 549,
          image: "/static/images/default_avatar.png",
          description: "针对计算机专业考生，讲解数据结构、操作系统、计算机网络等核心科目。"
        }
      ],
      // 已预约课程数据
      reservedCourses: [
        {
          id: 5,
          name: "考研专业课强化班",
          teacher: "赵老师",
          price: 599,
          reservedTime: "2023-12-18 14:00",
          image: "/static/images/default_avatar.png",
          description: "针对专业课考试，深入讲解重点难点，提供真题分析和解题技巧。"
        },
        {
          id: 6,
          name: "考研政治冲刺班",
          teacher: "孙老师",
          price: 449,
          reservedTime: "2023-12-19 10:00",
          image: "/static/images/default_avatar.png",
          description: "考前政治热点分析，提供答题模板和背诵要点，助力考研政治高分。"
        }
      ],
      // 已完成课程数据
      completedCourses: [
        {
          id: 7,
          name: "考研英语写作班",
          teacher: "黄老师",
          price: 399,
          completedTime: "2023-12-10 15:00",
          image: "/static/images/default_avatar.png"
        },
        {
          id: 8,
          name: "考研复试指导课",
          teacher: "周老师",
          price: 499,
          completedTime: "2023-12-15 09:00",
          image: "/static/images/default_avatar.png"
        }
      ],
      currentCourseIndex: null,
      selectedDate: null
    };
  },
  onLoad() {
    // 初始化页面数据，可以从服务器获取
    this.loadCourseData();
  },
  methods: {
    // 处理顶部导航栏组件的标签切换事件
    onTabChange(index) {
      this.currentTab = index;
      
      // 重置时间选择
      if (index === 0) {
        this.selectedTimeSlot = '';
        this.selectedTimePeriod = '';
      }
    },
    
    // 重置日期选择
    resetDateSelection() {
      this.selectedDate = null;
      this.selectedTimeSlot = '';
      this.selectedTimePeriod = '';
    },
    
    // 处理预约 - 修改为显示日历
    handleReserve(index) {
      this.currentCourseIndex = index;
      
      // 如果已经选择了日期，则显示时间选择弹窗
      if (this.selectedDate) {
        this.showTimeSelectionDialog();
      } else {
        // 显示日历选择器
        this.$refs.calendar.open();
      }
    },
    
    // 日历确认事件
    onCalendarConfirm(e) {
      this.selectedDate = e.fulldate;
      
      // 选择日期后立即显示时间选择弹窗
      this.$nextTick(() => {
        this.showTimeSelectionDialog();
      });
    },
    
    // 显示时间选择弹窗
    showTimeSelectionDialog() {
      // 构建时间段选项
      const periodOptions = this.timeSlots.map(item => item.period);
      
      // 先选择时间段（上午/下午/晚上）
      uni.showActionSheet({
        itemList: periodOptions,
        success: (res) => {
          this.selectedTimePeriod = periodOptions[res.tapIndex];
          const selectedPeriod = this.timeSlots[res.tapIndex];
          
          // 然后选择具体时间
          setTimeout(() => {
            uni.showActionSheet({
              itemList: selectedPeriod.slots,
              success: (timeRes) => {
                this.selectedTimeSlot = selectedPeriod.slots[timeRes.tapIndex];
                
                // 选择完时间后显示确认预约弹窗
                this.confirmReservation();
              }
            });
          }, 300);
        }
      });
    },
    
    // 确认预约
    confirmReservation() {
      const course = this.pendingCourses[this.currentCourseIndex];
      
      // 显示确认弹窗
      uni.showModal({
        title: '确认预约',
        content: `课程：${course.name}\n日期：${this.selectedDate}\n时间：${this.selectedTimeSlot}`,
        success: (res) => {
          if (res.confirm) {
            // 将预约成功的课程添加到已预约列表
            this.reservedCourses.push({
              ...course,
              reservedTime: `${this.selectedDate} ${this.selectedTimeSlot}`
            });
            
            // 从待预约列表中删除
            this.pendingCourses.splice(this.currentCourseIndex, 1);
            
            uni.showToast({
              title: '预约成功',
              icon: 'success',
              duration: 2000
            });
            
            // 重置状态
            this.currentCourseIndex = null;
            this.selectedDate = null;
            this.selectedTimeSlot = '';
            this.selectedTimePeriod = '';
          }
        }
      });
    },
    
    // 取消预约
    cancelReservation(index) {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消此预约吗？',
        success: (res) => {
          if (res.confirm) {
            // 将取消的课程移回待预约列表
            const canceledCourse = this.reservedCourses[index];
            this.pendingCourses.push({
              ...canceledCourse,
              time: canceledCourse.reservedTime.split(' ')[1]
            });
            
            // 从已预约列表中删除
            this.reservedCourses.splice(index, 1);
            
            uni.showToast({ 
              title: '已取消预约',
              icon: 'success',
              duration: 2000
            });
          }
        }
      });
    },
    
    // 跳转到评价页面
    goToAppraise(course) {
      uni.navigateTo({
        url: `/pages/mine/order/appraise/appraise?courseId=${course.id}&courseName=${course.name}&teacherName=${course.teacher}&price=${course.price}`
      });
    },
    
    // 获取今天的日期
    getToday() {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    },
    
    // 获取一个月后的日期（日历结束日期）
    getNextMonth() {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(nextMonth.getDate()).padStart(2, '0')}`;
    },
    
    // 加载课程数据
    loadCourseData() {
      // 真实环境中可以从服务器获取数据
      console.log('加载课程数据');
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f9fc;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.page-content {
  padding: 30rpx;
}

.course-list {
  height: calc(100vh - 180rpx);
}

/* 已选择日期信息样式 */
.selected-date-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  margin: 20rpx 0;
  padding: 25rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-left: 8rpx solid #3a86ff;
}

.date-info-title {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.date-info-content {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin: 0 15rpx;
}

.reset-btn {
  margin-left: auto;
  font-size: 26rpx;
  background-color: #f0f5ff;
  color: #3a86ff;
  border-radius: 30rpx;
  padding: 10rpx 24rpx;
  line-height: 1.2;
  border: 1px solid #d0e1ff;
}

/* 课程项目样式 */
.course-item {
  display: flex;
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 25rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-bottom: 3px solid #eaeef5;
  transition: all 0.3s ease;
}

.course-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.course-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 25rpx;
  border: 1px solid #e5e9f2;
  background-color: #f7f9fc;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-name {
  font-size: 34rpx;
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.course-teacher {
  font-size: 28rpx;
  color: #5d6b89;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
}

.course-teacher::before {
  content: "";
  display: inline-block;
  width: 6rpx;
  height: 6rpx;
  background-color: #5d6b89;
  border-radius: 50%;
  margin-right: 8rpx;
}

.course-time {
  font-size: 28rpx;
  color: #5d6b89;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
}

.course-time::before {
  content: "";
  display: inline-block;
  width: 6rpx;
  height: 6rpx;
  background-color: #5d6b89;
  border-radius: 50%;
  margin-right: 8rpx;
}

.course-price {
  font-size: 36rpx;
  color: #ff5a5f;
  font-weight: bold;
}

.reserve-btn {
  background: linear-gradient(135deg, #3a86ff, #4361ee);
  color: white;
  border-radius: 40rpx;
  padding: 0 35rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 28rpx;
  font-weight: 500;
  align-self: center;
  box-shadow: 0 6rpx 12rpx rgba(67, 97, 238, 0.2);
}

.cancel-btn {
  background: linear-gradient(135deg, #ff5a5f, #ff8a8e);
  color: white;
  border-radius: 40rpx;
  padding: 0 35rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 28rpx;
  font-weight: 500;
  align-self: center;
  box-shadow: 0 6rpx 12rpx rgba(255, 90, 95, 0.2);
}

.review-btn {
  background: linear-gradient(135deg, #ff9e00, #ffb347);
  color: white;
  border-radius: 40rpx;
  padding: 0 35rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 28rpx;
  font-weight: 500;
  align-self: center;
  box-shadow: 0 6rpx 12rpx rgba(255, 158, 0, 0.2);
}

.empty-tip {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
  color: #8c9db5;
  font-size: 30rpx;
  font-weight: 500;
}
</style>    