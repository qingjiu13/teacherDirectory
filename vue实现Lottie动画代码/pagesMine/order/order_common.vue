<template>
  <view class="container">
    <!-- 顶部导航 -->
    <Header class="header-container" :title="'我的订单'" @back="goBack" />
    
    <!-- 使用top-navbar组件 -->
    <top-navbar 
      @change="onTabChange" 
      :navHeight="60" 
      :userRole="userRole"
      :customTabs="userRole === 'student' ? tabs.map(tab => ({name: tab})) : teacherTabs.map(tab => ({name: tab}))"
    >
      <!-- 学生：待支付tab内容 -->
      <template v-slot:page1>
        <view class="page-content">
          <scroll-view class="order-list" scroll-y>
            <!-- 学生订单内容 -->
            <block v-if="userRole === 'student'">
              <view v-for="(order, index) in orders" :key="index" class="order-item" v-show="currentTab === 0">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-teacher">授课教师：{{ order.teacherName || '暂无' }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="cancel-btn" @click="cancelOrder(order)">取消订单</button>
                  <button class="pay-btn" @click="payOrder(order)">马上付款</button>
                </view>
              </view>
            </block>
            
            <!-- 老师订单内容 -->
            <block v-else>
              <view v-for="(order, index) in teacherOrders" :key="index" class="order-item" v-show="teacherCurrentTab === 0">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-student">学生：{{ order.studentName }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="confirm-btn" @click="confirmOrder(order)">取消订单</button>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </template>
      
      <!-- 已支付/已完成tab内容 -->
      <template v-slot:page2>
        <view class="page-content">
          <scroll-view class="order-list" scroll-y>
            <!-- 学生订单内容 -->
            <block v-if="userRole === 'student'">
              <view v-for="(order, index) in orders" :key="index" class="order-item" v-show="currentTab === 1">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                        <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-teacher">授课教师：{{ order.teacherName || '暂无' }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="appraise-btn" @click="goToAppraise(order)">去评价</button>
                </view>
              </view>
            </block>
            
            <!-- 老师订单内容 -->
            <block v-else>
              <view v-for="(order, index) in teacherOrders" :key="index" class="order-item" v-show="teacherCurrentTab === 1">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-student">学生：{{ order.studentName }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="detail-btn" @click="viewDetail(order)">查看详情</button>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </template>
      
      <!-- 已完成/已取消tab内容 -->
      <template v-slot:page3>
        <view class="page-content">
          <scroll-view class="order-list" scroll-y>
            <!-- 学生订单内容 -->
            <block v-if="userRole === 'student'">
              <view v-for="(order, index) in orders" :key="index" class="order-item" v-show="currentTab === 2">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-teacher">授课教师：{{ order.teacherName || '暂无' }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="detail-btn" @click="viewDetail(order)">查看详情</button>
                </view>
              </view>
            </block>
            
            <!-- 老师订单内容 -->
            <block v-else>
              <view v-for="(order, index) in teacherOrders" :key="index" class="order-item" v-show="teacherCurrentTab === 2">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-student">学生：{{ order.studentName }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="delete-btn" @click="deleteOrder(order)">删除订单</button>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </template>
      
      <!-- 学生：已取消tab内容 -->
      <template v-slot:page4>
        <view class="page-content">
          <scroll-view class="order-list" scroll-y>
            <block v-if="userRole === 'student'">
              <view v-for="(order, index) in orders" :key="index" class="order-item" v-show="currentTab === 3">
                <text class="order-time">{{ order.time }}</text>
                <view class="order-content">
                  <view class="avatar-container">
                    <view class="avatar-circle">
                      <image :src="'/static/image/style_for_pages/avatar.png'" class="avatar-image"></image>
                    </view>
                  </view>
                  <view class="order-info">
                    <text class="order-title">{{ order.title }}</text>
                    <text class="order-teacher">授课教师：{{ order.teacherName || '暂无' }}</text>
                    <text class="order-type">服务类型：一对一课程</text>
                  </view>
                </view>
                <view class="order-price-container">
                  <text class="order-price-label">¥</text>
                  <text class="order-price">{{ order.price }}</text>
                </view>
                <view class="order-footer">
                  <button class="delete-btn" @click="deleteOrder(order)">删除订单</button>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </template>
    </top-navbar>

    <!-- 取消订单确认弹窗 -->
    <view class="modal" v-if="showCancelModal">
      <view class="modal-content">
        <view class="modal-title">
          <text>确认取消订单</text>
        </view>
        <view class="modal-body">
          <text>取消后订单将无法恢复。</text>
          <text>确认取消吗？</text>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="showCancelModal = false">再想想</button>
          <button class="modal-btn confirm" @click="confirmCancel">确认取消</button>
        </view>
      </view>
    </view>

    <!-- 支付确认弹窗 -->
    <view class="modal" v-if="showPayModal">
      <view class="modal-content">
        <view class="modal-title">
          <text>微信支付</text>
        </view>
        <view class="modal-body">
          <text class="price-text">支付金额：¥{{currentOrder?.price}}</text>
          <view class="payment-wrapper">
            <view class="payment-info">
              <view class="payment-icon wechat">
                <text class="icon-text">微</text>
              </view>
              <text class="payment-name">微信支付</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="showPayModal = false">取消</button>
          <button class="modal-btn confirm" @click="confirmPay">确认支付</button>
        </view>
      </view>
    </view>

    <!-- 查看详情弹窗 -->
    <view class="modal" v-if="showDetailModal">
      <view class="modal-content">
        <view class="modal-title">
          <text>订单详情</text>
        </view>
        <view class="modal-body">
          <view class="detail-item">
            <text class="detail-label">订单时间：</text>
            <text class="detail-value">{{ currentOrder?.time }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">课程名称：</text>
            <text class="detail-value">{{ currentOrder?.title }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">订单金额：</text>
            <text class="detail-value">¥{{ currentOrder?.price }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">订单状态：</text>
            <text class="detail-value">{{ currentOrder?.status }}</text>
          </view>
          <view class="detail-item" v-if="userRole === 'teacher' && currentOrder?.studentName">
            <text class="detail-label">学生姓名：</text>
            <text class="detail-value">{{ currentOrder.studentName }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn confirm" @click="closeDetailModal">确定</button>
        </view>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <view class="modal" v-if="showDeleteModal">
      <view class="modal-content">
        <view class="modal-title">
          <text>删除订单</text>
        </view>
        <view class="modal-body">
          <text>确认要删除该订单吗？</text>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="showDeleteModal = false">取消</button>
          <button class="modal-btn confirm" @click="confirmDelete">确认删除</button>
        </view>
      </view>
    </view>
    
    <!-- 确认订单弹窗（教师角色专用） -->
    <view class="modal" v-if="showConfirmOrderModal">
      <view class="modal-content">
        <view class="modal-title">
          <text>确认订单</text>
        </view>
        <view class="modal-body">
          <text>确认接受该订单吗？确认后将无法取消。</text>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="showConfirmOrderModal = false">取消</button>
          <button class="modal-btn confirm" @click="confirmOrderAction">确认接受</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 订单管理页面（通用）
 */
import { Navigator} from '@/router/Router.js';
import Header from '@/components/navigationTitleBar/header.vue';
import topNavbar from '@/components/top-navbar/top-navbar.vue';

export default {
  components: {
    Header,
    topNavbar
  },
  data() {
    return {
      userRole: 'student', // 默认为学生角色
      userName: '',
      userData: {},
      isLoggedIn: false,
      
      // Tab栏配置
      currentTab: 0,
      tabs: ['待支付', '已支付','已完成', '已取消'],
      // 老师tab配置
      teacherCurrentTab: 0,
      teacherTabs: ['待服务', '已完成', '已取消'],
      // 学生订单列表
      orders: [
        {
          id: '1001',
          time: '2024-03-20 14:30',
          status: '待支付',
          title: '课程A - 一对一辅导',
          price: '299.00',
          teacherName: '张老师'
        },
        {
          id: '1002',
          time: '2024-03-19 10:15',
          status: '已完成',
          title: '课程B - 小组课程',
          price: '199.00',
          teacherName: '李老师'
        },
        {
          id: '1003',
          time: '2024-03-18 16:45',
          status: '已取消',
          title: '课程C - 专项训练',
          price: '399.00',
          teacherName: '王老师'
        }
      ],
      
      // 教师订单列表
      teacherOrders: [
        {
          id: '2001',
          time: '2024-03-21 15:30',
          status: '待确认',
          title: '高数辅导 - 一对一',
          price: '350.00',
          studentName: '张三'
        },
        {
          id: '2002',
          time: '2024-03-20 09:00',
          status: '进行中',
          title: '英语口语 - 一对一',
          price: '280.00',
          studentName: '李四'
        },
        {
          id: '2003',
          time: '2024-03-15 16:30',
          status: '已完成',
          title: '物理辅导 - 一对一',
          price: '320.00',
          studentName: '王五'
        }
      ],
      
      // 弹窗控制
      showCancelModal: false,
      showPayModal: false,
      showDetailModal: false,
      showDeleteModal: false,
      showConfirmOrderModal: false,
      
      // 当前操作的订单
      currentOrder: null,
      
      // 微信支付相关
      wxPayUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder', // 微信支付统一下单接口
      
      // 支付方式
      isPaymentDropdownOpen: false,
      selectedPayment: 0,
      paymentMethods: [
        {
          name: '支付宝支付',
          icon: '支',
          type: 'alipay'
        },
        {
          name: '微信支付',
          icon: '微',
          type: 'wechat'
        },
        {
          name: '银行卡支付',
          icon: '卡',
          type: 'bank'
        }
      ]
    }
  },
  computed: {
    /**
     * @description 根据用户角色返回不同的Tab标签
     */
    currentTabs() {
      return this.userRole === 'teacher' ? this.teacherTabs : this.tabs;
    }
  },
  onLoad() {
    // 初始化数据
  },
  onShow() {
    // 使用 nextTick 确保数据更新
    this.$nextTick(() => {
      this.loadUserData();
      const storedUserRole = uni.getStorageSync('userRole');
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.userRole = storedUserRole;
        this.loadOrderData();
      }
    });
  },
  methods: {
    /**
     * @description 处理导航栏标签变化
     * @param {Number} index 新的tab索引
     */
    onTabChange(index) {
      console.log('切换到标签:', index);
      if (this.userRole === 'teacher') {
        this.teacherCurrentTab = index;
      } else {
        this.currentTab = index;
      }
      // 根据tab加载不同数据
      this.loadOrderData();
    },
    
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
            if (this.userData.role) {
              this.userRole = this.userData.role;
              // 同步更新到storage
              uni.setStorageSync('userRole', this.userData.role);
            }
          } catch (e) {
            console.error('解析用户信息失败:', e);
          }
        }
      } else {
        this.userData = {};
        this.userName = '';
        // 未登录时默认显示学生界面
        this.userRole = 'student';
      }
    },
    
    /**
     * @description 加载订单数据
     */
    loadOrderData() {
      // 这里可以根据角色从API加载不同的订单数据
      // 目前使用模拟数据
      console.log(`加载${this.userRole}角色的订单数据`);
    },
    
    /**
     * @description 切换标签页 (兼容旧代码)
     * @param {Number} index 标签索引
     */
    switchTab(index) {
      this.onTabChange(index);
    },
    
    /**
     * @description 取消订单
     * @param {Object} order 订单对象
     */
    cancelOrder(order) {
      this.currentOrder = order;
      this.showCancelModal = true;
    },
    
    /**
     * @description 确认取消订单
     */
    confirmCancel() {
      // 这里实现取消订单的具体逻辑
      uni.showToast({
        title: '订单已取消',
        icon: 'success'
      });
      this.showCancelModal = false;
      // 可以在这里更新订单状态或重新加载订单列表
    },
    
    /**
     * @description 支付订单
     * @param {Object} order 订单对象
     */
    payOrder(order) {
      this.currentOrder = order;
      this.showPayModal = true;
    },
    
    /**
     * @description 切换支付方式下拉菜单
     */
    togglePaymentDropdown() {
      this.isPaymentDropdownOpen = !this.isPaymentDropdownOpen;
    },
    
    /**
     * @description 选择支付方式
     * @param {Number} index 支付方式索引
     */
    selectPayment(index) {
      this.selectedPayment = index;
      setTimeout(() => {
        this.isPaymentDropdownOpen = false;
      }, 200);
    },
    
    /**
     * @description 确认支付
     */
    confirmPay() {
      uni.showLoading({
        title: '跳转支付...'
      });
      
      // 调用微信支付接口
      setTimeout(() => {
        uni.hideLoading();
        
        // 这里是实际项目中调用微信支付的地方
        console.log('调用微信支付接口，支付地址:', this.wxPayUrl);
        console.log('订单信息:', this.currentOrder);
        
        // 在实际开发中，这里应该调用后端API获取微信支付参数，然后调用微信支付
        /*
        uni.requestPayment({
          provider: 'wxpay',
          orderInfo: {
            // 从服务器获取的支付参数
            appid: 'wx123456789',
            noncestr: 'noncestr',
            package: 'Sign=WXPay',
            partnerid: '10000100',
            prepayid: 'wx201410272009395522657a690389285100',
            timestamp: '1414488539',
            sign: 'C380BEC2BFD727A4B6845133519F3AD6'
          },
          success: (res) => {
            // 支付成功
            this.paySuccess();
          },
          fail: (err) => {
            // 支付失败
            this.payFail(err);
          }
        });
        */
        
        // 模拟支付成功
        this.paySuccess();
      }, 1500);
    },
    
    // 支付成功
    paySuccess() {
      this.showPayModal = false;
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      });
      // 刷新订单列表
      this.loadOrders();
    },
    
    // 支付失败
    payFail(err) {
      this.showPayModal = false;
      uni.showToast({
        title: '支付失败',
        icon: 'none'
      });
      console.error('支付失败:', err);
    },
    
    /**
     * @description 查看订单详情
     * @param {Object} order 订单对象
     */
    viewDetail(order) {
      this.currentOrder = order;
      this.showDetailModal = true;
    },
    
    /**
     * @description 关闭详情弹窗
     */
    closeDetailModal() {
      this.showDetailModal = false;
      this.currentOrder = null;
    },
    
    /**
     * @description 删除订单
     * @param {Object} order 订单对象
     */
    deleteOrder(order) {
      this.currentOrder = order;
      this.showDeleteModal = true;
    },
    
    /**
     * @description 确认删除订单
     */
    confirmDelete() {
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
      this.showDeleteModal = false;
      // 这里可以添加实际的删除逻辑
    },
    
    /**
     * @description 跳转到评价页面
     * @param {Object} order 订单对象
     */
    goToAppraise(order) {
      // 跳转到评价页面
      Navigator.toAppraise(order.id);
    },
      goBack() {
      Navigator.toMine()
    },
    /**
     * @description 教师确认订单
     * @param {Object} order 订单对象
     */
    confirmOrder(order) {
      this.currentOrder = order;
      this.showConfirmOrderModal = true;
    },
    
    /**
     * @description 教师确认接受订单操作
     */
    confirmOrderAction() {
      uni.showToast({
        title: '已接受订单',
        icon: 'success'
      });
      this.showConfirmOrderModal = false;
      // 这里可以添加实际的接受订单逻辑
    }
  }
}
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
  height: 100%;
  background: linear-gradient(135deg, #f5f9ff, #edf3ff);
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.page-content {
  padding: 10rpx 30rpx;
  position: relative;
  z-index: 10;
}

.order-list {
  height: calc(100vh - 150rpx);
  margin-top: 5rpx;
}

.order-item {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  margin-bottom: 20rpx;
  position: relative;
   height: 250rpx;
  padding: 15rpx 30rpx 60rpx 30rpx;
  box-sizing: border-box;
  overflow: visible;
}

.order-time {
  position: absolute;
  top: 15rpx;
  left: 30rpx;
  font-size: 24rpx;
  color: #2288F9;
  font-weight: 400;
}

.order-item::before {
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

.order-item::after {
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

.order-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 45rpx;
  margin-bottom: 5rpx;
  position: relative;
  z-index: 2;
  width: 100%;
}

.avatar-container {
  width: 160rpx;
  height: 160rpx;
  margin-right: 30rpx;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  padding: 0;
  margin-left: 0;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-text {
  font-size: 36rpx;
  color: #666666;
}

.order-info {
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

.order-title {
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

.order-teacher, .order-student, .order-type {
  font-size: 20rpx;
  color: #000000;
  font-weight: 500;
  font-family: 'PingFang SC', sans-serif;
  margin-bottom: 4rpx;
  line-height: 1.2;
  text-align: left;
  padding: 2rpx 0;
}

.order-price-container {
  position: relative;
  bottom:65rpx;
  right:20rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: rpx;
  margin-top: 10rpx;
  z-index: 2;
}

.order-price-label {
  position: relative;  
  font-size: 25rpx;
  color: #464EF8;
  position: relative;
  z-index: 2;
}

.order-price {
  position: relative;
  font-size: 25rpx;
  color: #464EF8;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.order-footer {
  position: relative;
  bottom: 85rpx;
  left: 30rpx;
  width: 100%;
  height: 80rpx;
  z-index: 50;
  margin-top: 5rpx;
}

.button-group {
  position: static;
  width: 100%;
  height: 60rpx;
}

.cancel-btn, .pay-btn, .confirm-btn, .appraise-btn, .detail-btn, .delete-btn {
  border-radius: 10rpx ;
  padding: 0 30rpx ;
  height: 40rpx ;
  width: 140rpx;
  line-height: 40rpx ;
  font-size: 18rpx ;
  font-weight: 400 ;
  z-index: 100 ;
}

.cancel-btn {
  position: absolute !important;
  right: 180rpx !important;
  bottom: 20rpx !important;
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
  background-image: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  border: none !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
}

.pay-btn {
  position: absolute !important;
  right: 30rpx !important;
  bottom: 20rpx !important;
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
}

.confirm-btn {
  position: absolute !important;
  right: 30rpx !important;
  bottom: 20rpx !important;
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  background-image: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
}

.appraise-btn, .detail-btn, .delete-btn {
  position: absolute !important;
  right: 30rpx !important;
  bottom: 20rpx !important;
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
}

.appraise-btn {
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
  background-image: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
}

.detail-btn {
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
  background-image: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
}

.delete-btn {
  background: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
  color: white !important;
  border-width: 0 !important;
  border-color: transparent !important;
  border-style: none !important;
  background-image: linear-gradient(to bottom, #A5A9F7, #464EF8) !important;
}

.cancel-btn:active, .pay-btn:active, .confirm-btn:active, .appraise-btn:active, .detail-btn:active, .delete-btn:active {
  transform: scale(0.95);
  box-shadow: 0 3rpx 10rpx rgba(122, 95, 190, 0.3);
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  width: 560rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  border: 2rpx solid #e0e0e0;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08);
  position: relative;
  z-index: 10000;
}

.modal-title {
  text-align: center;
  margin-bottom: 30rpx;
}

.modal-title text {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
}

.modal-body {
  margin-bottom: 30rpx;
}

.modal-body text {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}

.modal-footer {
  margin-top: 30rpx;
  flex-direction: row;
  justify-content: center;
}

.modal-btn {
  width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  border-radius: 35rpx;
  font-size: 28rpx;
  margin: 0 15rpx;
}

.modal-btn.cancel {
  background-color: #f5f5f5;
  color: #666666;
}

.modal-btn.confirm {
  background-color: #07C160;
  color: #ffffff;
}

.modal-btn.confirm:active {
  background-color: #06ad56;
}

/* 支付选择器样式 */
.payment-selector {
  margin-top: 30rpx;
}

.payment-title {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
  padding: 0 30rpx;
}

.payment-dropdown {
  position: relative;
  margin: 0 30rpx;
}

.selected-payment {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  border: 2rpx solid #eeeeee;
}

.selected-payment.active {
  border-color: #007AFF;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.payment-info {
  flex-direction: row;
  align-items: center;
}

.payment-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
  justify-content: center;
  align-items: center;
}

.icon-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: bold;
}

.alipay {
  background: linear-gradient(135deg, #1677FF, #0091FF);
}

.wechat {
  background: linear-gradient(135deg, #07C160, #10D574);
}

.bank {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
}

.payment-name {
  font-size: 28rpx;
  color: #333333;
}

.dropdown-arrow {
  font-size: 24rpx;
  color: #999999;
  transition: transform 0.3s;
}

.arrow-up {
  transform: rotate(180deg);
}

.payment-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 2rpx solid #007AFF;
  border-top: none;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
  transform: scaleY(0);
  transform-origin: top;
  transition: all 0.3s ease;
  opacity: 0;
  z-index: 100;
}

.payment-options.show {
  transform: scaleY(1);
  opacity: 1;
}

.payment-option {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 2rpx solid #eeeeee;
}

.payment-option:last-child {
  border-bottom: none;
}

.payment-option.selected {
  background-color: #f0f9ff;
}

.check-icon {
  font-size: 32rpx;
  color: #007AFF;
  font-weight: bold;
}

/* 详情弹窗样式 */
.detail-item {
  flex-direction: row;
  margin-bottom: 20rpx;
}

.detail-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666666;
}

.detail-value {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

/* 小按钮样式 */

/* 支付弹窗样式补充 */
.price-text {
  font-size: 36rpx;
  color: #FF6B6B;
  font-weight: bold;
  text-align: center;
  display: block;
  margin-bottom: 30rpx;
}

.payment-wrapper {
  padding: 0 20rpx;
  margin-bottom: 20rpx;
}
</style>