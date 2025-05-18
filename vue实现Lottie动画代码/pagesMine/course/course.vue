<template>
  <view class="container">
    <Header  class="header-container" :title="'我的课程'" @back="goBack" />
    <!-- 学生界面 -->
    <block v-if="userRole === 'student'">
      <top-navbar @change="onTabChange" :navHeight="60" :userRole="userRole">
        <template v-slot:page1>
          <view class="page-content">
            <view class="selected-date-info" v-if="selectedDate">
              <text class="date-info-title">已选择日期：</text>
              <text class="date-info-content">{{selectedDate}}</text>
              <button class="reset-btn" @click="resetDateSelection">重选</button>
            </view>
            
            <scroll-view class="course-list" scroll-y>
              <view v-for="(item, index) in pendingCourses" :key="index" class="course-item">
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">服务老师：{{item.teacher}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">课程节数：2/10</text>
                  <text v-if="item.isTeacherReservation" class="course-time">老师已选时间：{{item.time}}</text>
                </view>
                <button v-if="item.isTeacherReservation" class="accept-btn" @click="acceptReservation(index)">接受预约</button>
                <button v-else class="reserve-btn" @click="handleReserve(index)">提醒预约</button>
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
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">服务老师：{{item.teacher}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">预约时间：{{item.reservedTime}}</text>
                </view>
                <button class="modify-time-btn" @click="modifyReservationTime(index)">修改时间</button>
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
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">服务老师：{{item.teacher}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">完成时间：{{item.completedTime}}</text>
                  <view class="rating" v-if="item.rating">
                    <text class="rating-text">评分: </text>
                    <text class="rating-star" v-for="i in 5" :key="i">
                      {{i <= item.rating ? '★' : '☆'}}
                    </text>
                  </view>
                </view>
                <button class="view-feedback-btn" @click="viewFeedback(item)">查看回放</button>
              </view>
              <view v-if="completedCourses.length === 0" class="empty-tip">
                <text>暂无已完成课程</text>
              </view>
            </scroll-view>
          </view>
        </template>
      </top-navbar>
    </block>

    <!-- 老师界面 -->
    <block v-else>
      <top-navbar @change="onTeacherTabChange" :navHeight="60" :userRole="userRole">
        <template v-slot:page1>
          <view class="page-content">
            <scroll-view class="course-list" scroll-y>
              <view v-for="(item, index) in teacherPendingCourses" :key="index" class="course-item">
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">学生：{{item.studentName || '暂无'}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">课程节数：2/10</text>
                </view>
                <button class="reserve-btn" @click="teacherReserve(index)">发起预约</button>
              </view>
              <view v-if="teacherPendingCourses.length === 0" class="empty-tip">
                <text>暂无待接受课程</text>
              </view>
            </scroll-view>
            
            <!-- 老师端日历选择器 -->
            <uni-calendar 
              ref="teacherCalendar"
              :insert="false"
              :start-date="getToday()"
              :end-date="getNextMonth()"
              @confirm="onTeacherCalendarConfirm"
            />
          </view>
        </template>
        
        <template v-slot:page2>
          <!-- 老师-进行中课程 -->
          <view class="page-content">
            <scroll-view class="course-list" scroll-y>
              <view v-for="(item, index) in teacherActiveCourses" :key="index" class="course-item">
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">学生：{{item.studentName || '暂无'}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">上课时间：{{item.classTime}}</text>
                </view>
                <button class="confirm-class-btn" @click="completeClass(index)">确认下课</button>
                <button class="modify-time-btn" @click="rescheduleClass(index)">修改时间</button>
              </view>
              <view v-if="teacherActiveCourses.length === 0" class="empty-tip">
                <text>暂无进行中课程</text>
              </view>
            </scroll-view>
          </view>
        </template>
        
        <template v-slot:page3>
          <!-- 老师-已完成课程 -->
          <view class="page-content">
            <scroll-view class="course-list" scroll-y>
              <view v-for="(item, index) in teacherCompletedCourses" :key="index" class="course-item">
                <view class="avatar-container">
                  <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                </view>
                <view class="course-info">
                  <text class="course-name">{{item.name}}</text>
                  <text class="course-teacher">学生：{{item.studentName || '暂无'}}</text>
                  <text class="course-type">服务类型：一对一课程</text>
                  <text class="course-lessons">完成时间：{{item.completedTime}}</text>
                </view>
                <button class="view-feedback-btn" @click="viewClassFeedback(item)">查看回放</button>
              </view>
              <view v-if="teacherCompletedCourses.length === 0" class="empty-tip">
                <text>暂无已完成课程</text>
              </view>
            </scroll-view>
          </view>
        </template>
      </top-navbar>
    </block>
  </view>
</template>

<script>
import Header from '@/components/navigationTitleBar/header'
// 导入顶部导航栏组件
import topNavbar from '@/components/top-navbar/top-navbar.vue';
// 导入导航工具
import { Navigator } from '@/router/Router.js';

export default {
  components: {
    Header,
    topNavbar
  },
  data() {
    return {
      currentTab: 0,
      teacherCurrentTab: 0,
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
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=5fcc0283-6d70-4b56-8710-5ef9318c475b&from=3"
        },
        {
          id: 8,
          name: "考研复试指导课",
          teacher: "周老师",
          price: 499,
          completedTime: "2023-12-15 09:00",
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=7e9f8d62-34a1-4b12-9f80-5c31d9b52ec8&from=3"
        }
      ],
      currentCourseIndex: null,
      selectedDate: null,
      userRole: 'student', // 默认为学生角色
      userName: '',
      userData: {},
      isLoggedIn: false,
      teacherPendingCourses: [],
      teacherActiveCourses: [],
      teacherCompletedCourses: []
    };
  },
  onLoad(options) {
    console.log('课程页面 onLoad', options);
    
    // 初始化页面数据
    this.loadUserData();
    
    // 使用全局状态或传递的参数确定角色
    const globalData = getApp().globalData;
    const storedUserRole = uni.getStorageSync('userRole');
    
    // 优先使用全局状态中的角色
    if (globalData && globalData.userRole) {
      this.userRole = globalData.userRole;
      console.log('使用全局角色状态:', this.userRole);
    }
    // 其次使用存储的角色
    else if (storedUserRole) {
      this.userRole = storedUserRole;
      // 同步到全局状态
      if (globalData) {
        globalData.userRole = this.userRole;
      }
      console.log('使用存储的角色:', this.userRole);
    }
    
    // 加载对应角色的数据
    this.loadCourseData();
  },
  onShow() {
    console.log('课程页面 onShow, 当前角色:', this.userRole);
    
    // 检查全局状态
    const globalData = getApp().globalData;
    if (globalData && globalData.userRole && globalData.userRole !== this.userRole) {
      console.log('全局角色变更:', globalData.userRole);
      const previousRole = this.userRole;
      this.userRole = globalData.userRole;
      
      // 如果角色发生变化，重置相关状态并更新存储
      if (previousRole !== this.userRole) {
        this.resetRoleRelatedState();
        uni.setStorageSync('userRole', this.userRole);
        this.loadCourseData();
      }
    }
    
    // 如果本地存储的角色与当前不一致，则以本地存储为准
    const storedUserRole = uni.getStorageSync('userRole');
    if (storedUserRole && storedUserRole !== this.userRole) {
      console.log('存储角色与当前不一致, 存储:', storedUserRole, '当前:', this.userRole);
      const previousRole = this.userRole;
      this.userRole = storedUserRole;
      
      // 同步到全局状态
      if (globalData) {
        globalData.userRole = this.userRole;
      }
      
      // 如果角色发生变化，重置相关状态
      if (previousRole !== this.userRole) {
        this.resetRoleRelatedState();
        this.loadCourseData();
      }
    }
  },
  // 页面卸载时保存状态
  onUnload() {
    console.log('课程页面 onUnload, 保存当前角色:', this.userRole);
    // 确保角色信息被持久化
    uni.setStorageSync('userRole', this.userRole);
    
    // 同步到全局状态
    const globalData = getApp().globalData;
    if (globalData) {
      globalData.userRole = this.userRole;
    }
  },
  methods: {
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      // 检查登录状态
      const token = uni.getStorageSync('token');
      this.isLoggedIn = !!token;
      
      if (this.isLoggedIn) {
        // 获取用户信息
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {
          try {
            this.userData = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
            this.userName = this.userData.nickname || '用户';
            
            // 如果存储中有用户角色，使用存储的角色
            const previousRole = this.userRole;
            if (this.userData.role) {
              // 更新当前角色
              this.userRole = this.userData.role;
              console.log('从用户数据中设置角色:', this.userRole);
              
              // 同步更新到storage
              uni.setStorageSync('userRole', this.userData.role);
              
              // 同步到全局状态
              const globalData = getApp().globalData;
              if (globalData) {
                globalData.userRole = this.userRole;
              }
              
              // 如果角色发生变化，重置相关状态
              if (previousRole !== this.userRole) {
                this.resetRoleRelatedState();
              }
            }
          } catch (e) {
            console.error('解析用户信息失败:', e);
          }
        }
      } else {
        this.userData = {};
        this.userName = '';
        
        // 注意：这里不再自动重置为学生角色
        // 而是保持当前角色不变，避免意外重置
        console.log('未登录，保持当前角色:', this.userRole);
      }
    },
    
    // 重置与角色相关的状态
    resetRoleRelatedState() {
      console.log('重置角色相关状态');
      if (this.userRole === 'student') {
        this.currentTab = 0;
      } else {
        this.teacherCurrentTab = 0;
      }
      this.selectedDate = null;
      this.selectedTimeSlot = '';
      this.selectedTimePeriod = '';
    },
    
    // 处理顶部导航栏组件的标签切换事件 - 学生
    onTabChange(index) {
      console.log('学生模式标签切换:', index);
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
    
    // 完成课程时添加回放链接
    completeClass(index) {
      const course = this.teacherActiveCourses[index];
      
      // 先让用户输入回放链接
      uni.showModal({
        title: '添加课程回放',
        editable: true,
        placeholderText: '请输入课程回放链接 (可选)',
        success: (res) => {
          let replayUrl = '';
          if (res.confirm && res.content) {
            replayUrl = res.content;
          }
          
          // 再确认完成课程
          uni.showModal({
            title: '确认下课',
            content: `确定完成${course.studentName}的${course.name}课程吗？`,
            success: (confirmRes) => {
              if (confirmRes.confirm) {
                // 将课程从进行中移动到已完成
                this.teacherCompletedCourses.push({
                  ...course,
                  completedTime: new Date().toISOString().split('T')[0],
                  replayUrl: replayUrl
                });
                
                // 从进行中列表中删除
                this.teacherActiveCourses.splice(index, 1);
                
                uni.showToast({
                  title: '课程已完成',
                  icon: 'success',
                  duration: 2000
                });
              }
            }
          });
        }
      });
    },
    
    // 修改预约时间
    modifyReservationTime(index) {
      this.currentCourseIndex = index;
      
      // 如果已经选择了日期，则显示时间选择弹窗
      if (this.selectedDate) {
        this.showTimeSelectionDialog();
      } else {
        // 显示日历选择器
        this.$refs.calendar.open();
      }
    },
    
    // 查看回访/回放
    viewFeedback(course) {
      if (course.replayUrl) {
        // 如果有回放URL，跳转到回放页面
        uni.showModal({
          title: '查看回放',
          content: '是否跳转到课程回放网页？',
          success: (res) => {
            if (res.confirm) {
              // 跳转到外部链接
              this.openExternalLink(course.replayUrl);
            }
          }
        });
      } else {
        // 默认跳转到评价页面
        uni.navigateTo({
          url: `/pages/mine/order/appraise/appraise?courseId=${course.id}&courseName=${course.name}&teacherName=${course.teacher}&price=${course.price}`
        });
      }
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
      console.log('加载课程数据，当前角色:', this.userRole);
      
      // 根据用户角色加载不同的数据
      if (this.userRole === 'teacher') {
        console.log('加载老师课程数据');
        this.initTeacherData();
        
        // 确保使用老师的标签页索引
        this.teacherCurrentTab = 0;
      } else {
        console.log('加载学生课程数据');
        // 为学生角色初始化数据
        this.initStudentData();
        
        // 确保使用学生的标签页索引
        this.currentTab = 0;
      }
    },

    // 处理老师界面的导航栏切换事件
    onTeacherTabChange(index) {
      console.log('老师模式标签切换:', index);
      this.teacherCurrentTab = index;
      
      // 触发必要的数据加载或UI更新
      if (index === 0) {
        // 待接受课程
        console.log('切换到老师-待接受课程标签');
      } else if (index === 1) {
        // 进行中课程
        console.log('切换到老师-进行中课程标签');
      } else if (index === 2) {
        // 已完成课程
        console.log('切换到老师-已完成课程标签');
      }
    },
    
    // 初始化教师数据
    initTeacherData() {
      console.log('初始化教师数据');
      
      // 模拟从服务器获取教师相关数据
      this.teacherPendingCourses = [
        {
          id: 101,
          name: "考研政治精讲班",
          studentName: "张同学",
          price: 399,
          image: "/static/images/default_avatar.png"
        },
        {
          id: 102,
          name: "考研数学基础班",
          studentName: "李同学",
          price: 499,
          image: "/static/images/default_avatar.png"
        }
      ];
      
      this.teacherActiveCourses = [
        {
          id: 103,
          name: "考研英语词汇班",
          studentName: "王同学",
          price: 349,
          classTime: "2023-12-20 15:00",
          image: "/static/images/default_avatar.png"
        }
      ];
      
      this.teacherCompletedCourses = [
        {
          id: 104,
          name: "计算机专业课辅导",
          studentName: "赵同学",
          price: 549,
          completedTime: "2023-12-10",
          image: "/static/images/default_avatar.png",
          replayUrl: "https://meeting.tencent.com/v2/cloud-record/share?id=9a0c7f38-5e12-4d1d-a53e-94ed126aa3bb&from=3"
        }
      ];
    },
    
    // 老师端 - 发起预约
    teacherReserve(index) {
      this.currentCourseIndex = index;
      // 显示日历选择器
      this.$refs.teacherCalendar.open();
    },
    
    // 老师端 - 日历确认事件
    onTeacherCalendarConfirm(e) {
      this.selectedDate = e.fulldate;
      
      // 选择日期后立即显示时间选择弹窗
      this.$nextTick(() => {
        this.showTeacherTimeSelectionDialog();
      });
    },
    
    // 老师端 - 显示时间选择弹窗
    showTeacherTimeSelectionDialog() {
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
                this.confirmTeacherReservation();
              }
            });
          }, 300);
        }
      });
    },
    
    // 老师端 - 确认预约
    confirmTeacherReservation() {
      const course = this.teacherPendingCourses[this.currentCourseIndex];
      
      // 显示确认弹窗
      uni.showModal({
        title: '确认发起预约',
        content: `课程：${course.name}\n学生：${course.studentName}\n日期：${this.selectedDate}\n时间：${this.selectedTimeSlot}`,
        success: (res) => {
          if (res.confirm) {
            // 模拟将预约信息发送给学生
            this.sendReservationToStudent(course);
            
            // 从待接受列表中删除
            this.teacherPendingCourses.splice(this.currentCourseIndex, 1);
            
            uni.showToast({
              title: '预约已发送',
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
    
    // 模拟将预约信息发送给学生
    sendReservationToStudent(course) {
      // 真实场景中，这里应该是通过API发送预约信息
      console.log('发送预约信息到学生:', course.studentName);
      
      // 模拟更新全局状态或本地存储
      const globalData = getApp().globalData || {};
      if (!globalData.studentReservations) {
        globalData.studentReservations = [];
      }
      
      // 添加新的预约
      globalData.studentReservations.push({
        id: Date.now(),
        name: course.name,
        teacher: '我', // 当前登录的老师
        time: `${this.selectedDate} ${this.selectedTimeSlot}`,
        price: course.price,
        image: course.image || "/static/images/default_avatar.png",
        description: `由老师发起的预约：${course.name}`,
        studentName: course.studentName
      });
      
      // 将课程添加到老师的进行中课程
      this.teacherActiveCourses.push({
        ...course,
        classTime: `${this.selectedDate} ${this.selectedTimeSlot}`
      });
    },
    
    // 查看回访/回放
    viewClassFeedback(item) {
      if (item.replayUrl) {
        // 如果有回放URL，跳转到回放页面
        uni.showModal({
          title: '查看回放',
          content: '是否跳转到课程回放网页？',
          success: (res) => {
            if (res.confirm) {
              // 跳转到外部链接
              this.openExternalLink(item.replayUrl);
            }
          }
        });
      } else {
        // 默认显示评价内容
        uni.showModal({
          title: '学生评价',
          content: `${item.studentName}对本课程的评价：\n非常棒的课程，讲解清晰，收获很多！`,
          showCancel: false
        });
      }
    },
    
    // 生成随机未来时间（辅助方法）
    getRandomFutureTime() {
      const now = new Date();
      // 随机1-7天内的某个时间
      const futureDate = new Date(now.getTime() + (1 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000);
      const year = futureDate.getFullYear();
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const day = String(futureDate.getDate()).padStart(2, '0');
      const hours = ['09', '10', '14', '15', '16', '19', '20'][Math.floor(Math.random() * 7)];
      const minutes = ['00', '30'][Math.floor(Math.random() * 2)];
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    
    // 通用方法：打开外部链接（兼容多端）
    openExternalLink(url) {
      // 根据平台不同使用不同的方式打开外部链接
      // #ifdef APP-PLUS
      // APP环境下使用plus打开外部浏览器
      plus.runtime.openURL(url);
      // #endif
      
      // #ifdef H5
      // H5环境下使用window.open
      window.open(url, '_blank');
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      // 小程序环境下使用uni.navigateTo跳转到web-view页面
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
      });
      // #endif
      
      // 其他环境
      console.log('跳转到外部链接:', url);
    },

    // 确认下课
    confirmClassEnd(index) {
      uni.showModal({
        title: '确认下课',
        content: '确定要确认下课吗？',
        success: (res) => {
          if (res.confirm) {
            // 将课程状态修改为已完成
            const completedCourse = this.reservedCourses[index];
            this.completedCourses.push({
              ...completedCourse,
              completedTime: new Date().toISOString().split('T')[0]
            });
            
            // 从已预约列表中删除
            this.reservedCourses.splice(index, 1);
            
            uni.showToast({ 
              title: '已确认下课',
              icon: 'success',
              duration: 2000
            });
          }
        }
      });
    },

    // 学生数据初始化
    initStudentData() {
      console.log('初始化学生数据');
      
      // 先加载默认数据
      // 这里不需要重新初始化pendingCourses，因为已经有默认数据了
      
      // 检查全局数据中是否有老师发起的预约
      const globalData = getApp().globalData || {};
      if (globalData.studentReservations && globalData.studentReservations.length > 0) {
        console.log('发现老师发起的预约:', globalData.studentReservations.length);
        
        // 将老师发起的预约添加到学生的待预约列表
        globalData.studentReservations.forEach(reservation => {
          // 检查是否已存在相同ID的课程，避免重复添加
          const exists = this.pendingCourses.some(course => course.id === reservation.id);
          if (!exists) {
            this.pendingCourses.unshift({
              id: reservation.id,
              name: reservation.name,
              teacher: reservation.teacher,
              time: reservation.time,
              price: reservation.price,
              image: reservation.image,
              description: reservation.description,
              isTeacherReservation: true // 标记为老师发起的预约
            });
          }
        });
        
        // 处理完后清空全局数据中的预约信息，避免重复显示
        globalData.studentReservations = [];
      }
    },

    // 学生端 - 接受老师发起的预约
    acceptReservation(index) {
      const course = this.pendingCourses[index];
      
      // 显示确认接受预约的弹窗
      uni.showModal({
        title: '接受预约',
        content: `确认接受${course.teacher}的预约吗？\n课程：${course.name}\n时间：${course.time}`,
        success: (res) => {
          if (res.confirm) {
            // 将预约添加到已预约列表
            this.reservedCourses.push({
              ...course,
              reservedTime: course.time
            });
            
            // 从待预约列表中删除
            this.pendingCourses.splice(index, 1);
            
            uni.showToast({
              title: '已接受预约',
              icon: 'success',
              duration: 2000
            });
          }
        }
      });
    },

    // 添加返回方法
    goBack() {
      // 使用Navigator工具而不是简单的navigateBack
      Navigator.toMine();
    },

    // 老师端 - 修改课程时间
    rescheduleClass(index) {
      this.currentCourseIndex = index;
      
      // 显示日历选择器
      this.$refs.teacherCalendar.open();
    },
  }
};
</script>

<style>
.header-container {
  width: 100%;
  height: 200rpx;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(135deg, #f5f9ff, #edf3ff);
}
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f9ff, #edf3ff);
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.page-content {
  padding: 10rpx 30rpx;
}

.course-list {
  height: calc(100vh - 130rpx);
  margin-top: 5rpx;
}

/* 已选择日期信息样式 */
.selected-date-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  margin: 10rpx 0;
  padding: 20rpx;
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
  flex-direction: row;
  border-radius: 16px;
  margin-bottom: 15px;
  position: relative;
  min-height: 160rpx;
  padding: 0;
}

.course-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 40rpx;
  padding: 2rpx;
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.course-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
  z-index: 1;
}

/* 课程信息容器，完全按照service-info样式 */
.course-item {
  padding: 25rpx 30rpx;
  box-sizing: border-box;
}

.avatar-container {
  margin-right: 30rpx;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding: 0;
  margin-left: 0;
  border: none;
}

.avatar-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 15rpx;
  background-color: #f0f0f0;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
  border: none;
}

.avatar-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 15rpx;
  background-color: #f0f0f0;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
  border: none;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  padding-left: 15rpx;
  margin-top: 5rpx;
  position: relative;
  z-index: 2;
}

.course-name {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 27rpx;
  margin-bottom: 10rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.55px;
  text-align: left;
}

.course-teacher, .course-type, .course-lessons, .course-time {
  font-size: 20rpx;
  color: #000000;
  font-weight: 500;
  font-family: 'PingFang SC', sans-serif;
  margin-bottom: 4rpx;
  line-height: 1.2;
  text-align: left;
  padding: 2rpx 0;
}

.price-container, .price-label, .course-price {
  /* 删除这些样式 */
  display: none;
}

.reserve-btn, .view-feedback-btn, .accept-btn, .confirm-class-btn, .modify-time-btn {
  position: absolute;
  right: 30rpx;
  bottom: 20rpx;
  border-radius: 10rpx;
  padding: 0 20rpx;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 22rpx;
  font-weight: 500;
  background: linear-gradient(to bottom, #A5A9F7, #464EF8);
  color: white;
  z-index: 2;
}

.reserve-btn:active, .view-feedback-btn:active, .accept-btn:active, .confirm-class-btn:active, .modify-time-btn:active {
  transform: scale(0.95);
  box-shadow: 0 3rpx 10rpx rgba(122, 95, 190, 0.3);
}

.course-time {
  font-size: 26rpx;
  color: #ff7043;
  font-weight: 500;
  margin-top: 4rpx;
  margin-bottom: 4rpx;
  line-height: 1.2;
  text-align: left;
  padding: 2rpx 0;
}

.empty-tip {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
  color: #8c9db5;
  font-size: 30rpx;
  font-weight: 500;
}

.tab-container {
  flex-direction: row;
  height: 60rpx; /* 进一步降低高度 */
  background-color: #ffffff;
  border-bottom-width: 1rpx;
  border-bottom-color: #eeeeee;
}
</style>    