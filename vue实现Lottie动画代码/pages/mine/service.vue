<template>
  <view class="service-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <view class="add-btn" @click="handleAddService">
        <text class="plus">+</text>
        <text>新增</text>
      </view>
    </view>
    
    <!-- 服务卡片区域 -->
    <view class="service-list">
      <view 
        v-for="(service, index) in services" 
        :key="service.id" 
        class="service-card" 
        :class="{ 'active-card': service.checked }"
        @click="showServiceDetail(index)"
      >
        <view class="service-info">
          <view class="service-thumb" :style="{ backgroundImage: `url(${service.imageUrl})`, backgroundSize: 'cover' }"></view>
          <view class="service-details">
            <view class="service-name">{{ service.name }}</view>
            <view class="service-price">{{ service.price }}</view>
          </view>
          <view class="action-buttons" @click.stop>
            <view class="edit-btn" @click="editService(index)">修改</view>
            <view class="delete-btn" @click="deleteService(index)">删除</view>
          </view>
        </view>
      </view>
      
      <!-- 服务详情展示 -->
      <view class="service-detail-card" v-if="selectedService" :class="{'detail-card-expanded': isDetailExpanded}">
        <view class="detail-close-btn" @click="hideServiceDetail">×</view>
        <view class="detail-thumb" :style="{ backgroundImage: `url(${selectedService.imageUrl})`, backgroundSize: 'cover' }"></view>
        <view class="detail-info">
          <view class="detail-name">{{ selectedService.name }}</view>
          <view class="detail-price">{{ selectedService.price }}</view>
        </view>
        <view class="detail-description">
          <text class="description-title">具体介绍</text>
          <text class="description-content">{{ selectedService.description }}</text>
          <view class="detail-image-placeholder">
            <text class="image-icon">&#xe60d;</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 半透明背景遮罩 -->
    <view class="detail-overlay" v-if="overlayVisible" @click="hideServiceDetail"></view>

    <!-- 加载动画组件 -->
    <loading ref="loadingRef" />
  </view>
</template>

<script>
import Loading from '@/components/loading-animation/loading.vue'

export default {
  components: {
    Loading
  },
  data() {
    return {
      services: [
        {
          id: 1,
          name: '考研全年VIP班',
          price: '¥12800',
          description: '一站式考研备考方案，包含全年公共课与专业课辅导，专属学习规划师制定个性化学习计划，配套核心教材和真题资料，定期模拟测试及学习情况分析，考前冲刺点题，适合零基础考生。',
          checked: true,
          imageUrl: '/static/images/kaoyan1.jpg'
        },
        {
          id: 2,
          name: '考研政治精讲班',
          price: '¥1580',
          description: '由资深政治老师授课，系统讲解考研政治核心知识点，深度剖析马原、毛中特、史纲、思修法基，配套专属内部讲义和大量真题解析，掌握答题技巧和方法，突破政治高分。',
          checked: false,
          imageUrl: '/static/images/kaoyan2.jpg'
        },
        {
          id: 3,
          name: '考研英语强化班',
          price: '¥1880',
          description: '针对考研英语一/二，重点讲解阅读理解、翻译、写作等高频考点，配合历年真题详解和独家预测题，教授解题思路和答题模板，针对性提升英语应试能力，助力高分突破。',
          checked: false,
          imageUrl: '/static/images/kaoyan3.jpg'
        },
        {
          id: 4,
          name: '专业课一对一定制',
          price: '¥4980',
          description: '根据不同院校不同专业量身定制辅导计划，由目标院校毕业导师或博士生授课，提供内部资料和历年真题解析，深度挖掘考试重点和命题规律，定期模拟测试和答疑，确保专业课高分。',
          checked: false,
          imageUrl: '/static/images/kaoyan4.jpg'
        },
        {
          id: 5,
          name: '考研数学基础班',
          price: '¥2280',
          description: '专为数学基础薄弱的考生设计，从高数、线代、概率论基础讲起，循序渐进，配合大量例题和习题，帮助考生建立数学思维，掌握核心解题方法，突破数学难关。',
          checked: false,
          imageUrl: '/static/images/kaoyan1.jpg'
        },
        {
          id: 6,
          name: '考研复试指导班',
          price: '¥3680',
          description: '全面覆盖复试各环节，包括专业课笔试、英语听说、专业面试和综合面试，提供院校复试真题和模拟题，安排多轮模拟面试演练，指导简历制作和自我介绍，提高复试通过率。',
          checked: false,
          imageUrl: '/static/images/kaoyan2.jpg'
        },
        {
          id: 7,
          name: '考研暑期集训营',
          price: '¥5980',
          description: '暑期30天高强度集训，每日8小时专业授课，涵盖公共课和专业课，配合每日测试和强化训练，建立系统知识框架，培养高效学习习惯，为后期复习打下坚实基础。',
          checked: false,
          imageUrl: '/static/images/kaoyan3.jpg'
        },
        {
          id: 8,
          name: '考研考前冲刺班',
          price: '¥3280',
          description: '针对考前最后3个月开设，重点突破历年真题和模拟题，总结各科目重点难点，进行专项训练和查漏补缺，配合心理调适和应试技巧指导，确保考生以最佳状态应考。',
          checked: false,
          imageUrl: '/static/images/kaoyan4.jpg'
        },
        {
          id: 9,
          name: '考研专业课资料包',
          price: '¥980',
          description: '包含目标院校专业课内部资料、历年真题及详解、考试大纲解析、核心知识点总结、重点院校考研经验分享等，电子版+纸质版双重提供，助力专业课复习事半功倍。',
          checked: false,
          imageUrl: '/static/images/kaoyan1.jpg'
        },
        {
          id: 10,
          name: '考研院校专业选择指导',
          price: '¥1280',
          description: '由专业顾问团队提供一对一院校专业选择指导，包括个人情况评估、目标设定、院校专业分析、报考策略制定等，为考生提供科学合理的择校方案，提高复试录取成功率。',
          checked: false,
          imageUrl: '/static/images/kaoyan2.jpg'
        }
      ],
      selectedService: {
        id: 1,
        name: '考研全年VIP班',
        price: '¥12800',
        description: '一站式考研备考方案，包含全年公共课与专业课辅导，专属学习规划师制定个性化学习计划，配套核心教材和真题资料，定期模拟测试及学习情况分析，考前冲刺点题，适合零基础考生。',
        checked: true,
        imageUrl: '/static/images/kaoyan1.jpg'
      },
      isDetailExpanded: false,
      overlayVisible: false
    }
  },
  onShow() {
    // 检查是否有新添加的服务
    if (getApp().globalData && getApp().globalData.newServiceAdded) {
      // 清除标记
      getApp().globalData.newServiceAdded = false
      
      // 如果有新服务，添加到列表中
      if (getApp().globalData.newService) {
        const newService = getApp().globalData.newService
        
        // 检查价格格式，如果没有¥，则添加
        if (newService.price && !newService.price.startsWith('¥')) {
          newService.price = '¥' + newService.price
        }
        
        // 将新服务添加到列表
        this.services.unshift(newService)
        
        // 选中这个新服务
        this.selectedService = newService
        
        // 显示提示
        uni.showToast({
          title: '新服务已添加',
          icon: 'success'
        })
        
        // 清除临时存储的新服务
        getApp().globalData.newService = null
      }
    }
    
    // 从本地存储加载服务列表
    this.loadServices()
  },
  onLoad() {
    // 监听serviceAdded事件
    uni.$on('serviceAdded', this.handleServiceAdded)
    // 监听serviceEdited事件
    uni.$on('serviceEdited', this.handleServiceEdited)
    
    // 保存默认服务列表到全局状态中，方便编辑时引用
    getApp().globalData = getApp().globalData || {}
    getApp().globalData.defaultServices = JSON.parse(JSON.stringify(this.services))
  },
  onUnload() {
    // 移除事件监听
    uni.$off('serviceAdded', this.handleServiceAdded)
    uni.$off('serviceEdited', this.handleServiceEdited)
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    toggleService(index) {
      this.services[index].checked = !this.services[index].checked
    },
    editService(index) {
      // 显示加载动画
      this.$refs.loadingRef.show()
      
      // 模拟接口请求
      setTimeout(() => {
        // 隐藏加载动画
        this.$refs.loadingRef.hide()
        this.selectedService = this.services[index]
        
        // 将服务数据传递到编辑页面
        const currentService = this.services[index]
        
        // 将当前服务数据存储到全局状态，方便编辑页面获取
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.editingService = JSON.parse(JSON.stringify(currentService))
        
        // 跳转到新建/编辑服务页面
        uni.navigateTo({
          url: '/pages/mine/service_newbuilt?mode=edit&id=' + currentService.id
        })
      }, 600)
    },
    deleteService(index) {
      // 显示加载动画
      this.$refs.loadingRef.show()
      
      // 模拟接口请求
      setTimeout(() => {
        // 隐藏加载动画
        this.$refs.loadingRef.hide()
        
        // 删除当前服务
        this.services.splice(index, 1)
        
        // 更新本地存储
        this.saveServices()
        
        uni.showToast({
          title: '服务已删除',
          icon: 'success'
        })
      }, 800)
    },
    handleAddService() {
      // 显示加载动画
      this.$refs.loadingRef.show()
      
      // 模拟接口请求
      setTimeout(() => {
        // 隐藏加载动画
        this.$refs.loadingRef.hide()
        
        // 跳转到新建服务页面
        uni.navigateTo({
          url: '/pages/mine/service_newbuilt'
        })
      }, 800)
    },
    // 处理新添加的服务
    handleServiceAdded(newService) {
      // 检查价格格式
      if (newService.price && !newService.price.startsWith('¥')) {
        newService.price = '¥' + newService.price
      }
      
      // 添加到服务列表的最前面
      this.services.unshift(newService)
      
      // 选中新服务
      this.selectedService = newService
      
      // 保存到本地存储
      this.saveServices()
      
      // 显示提示
      uni.showToast({
        title: '新服务已添加',
        icon: 'success'
      })
    },
    // 处理编辑后的服务
    handleServiceEdited(editedService) {
      // 找到编辑后的服务在列表中的位置
      const index = this.services.findIndex(service => service.id === editedService.id)
      
      if (index !== -1) {
        // 更新服务列表中的数据
        this.services[index] = editedService
        
        // 保存到本地存储
        this.saveServices()
        
        // 显示提示
        uni.showToast({
          title: '服务已修改',
          icon: 'success'
        })
      }
    },
    // 保存服务列表到本地存储
    saveServices() {
      try {
        uni.setStorageSync('services', JSON.stringify(this.services))
      } catch (e) {
        console.error('保存服务列表失败', e)
      }
    },
    // 从本地存储加载服务列表
    loadServices() {
      try {
        const servicesStr = uni.getStorageSync('services')
        if (servicesStr) {
          const storedServices = JSON.parse(servicesStr)
          // 如果有存储的服务数据，使用存储的数据替换默认数据
          if (storedServices && storedServices.length > 0) {
            this.services = storedServices
            // 默认选中第一个服务
            this.selectedService = this.services[0]
          }
        }
      } catch (e) {
        console.error('加载服务列表失败', e)
      }
    },
    showServiceDetail(index) {
      // 如果点击的是按钮区域，不执行展示详情
      this.selectedService = this.services[index]
      
      // 先显示遮罩层
      this.overlayVisible = true
      
      // 延迟一帧后显示详情卡片，确保动画效果
      setTimeout(() => {
        this.isDetailExpanded = true
      }, 20)
    },
    hideServiceDetail() {
      // 先隐藏详情卡片
      this.isDetailExpanded = false
      
      // 动画结束后隐藏遮罩层
      setTimeout(() => {
        this.overlayVisible = false
      }, 300)
    }
  }
}
</script>

<style>
.service-container {
  padding: 30rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 35rpx 0;
  position: relative;
  height: 90rpx;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #4A6FE3, #7E57C2);
  border-radius: 50%;
  box-shadow: 0 6rpx 16rpx rgba(74, 111, 227, 0.3);
  z-index: 10;
  transition: all 0.3s ease;
  overflow: hidden;
}

.back-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #7E57C2, #4A6FE3);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.back-btn:active {
  transform: translateY(-50%) scale(0.92);
  box-shadow: 0 3rpx 10rpx rgba(74, 111, 227, 0.2);
}

.back-btn:active::after {
  opacity: 1;
}

.add-btn {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #4A6FE3, #7E57C2);
  padding: 8rpx 20rpx;
  border-radius: 25rpx;
  color: #fff;
  box-shadow: 0 4rpx 10rpx rgba(74, 111, 227, 0.3);
  transition: all 0.3s ease;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
}

.add-btn:active {
  transform: translateY(-50%) scale(0.96);
}

.plus {
  margin-right: 6rpx;
  font-weight: bold;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding-top: 10rpx;
}

.service-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.active-card {
  border-left: 6rpx solid #4A6FE3;
  transform: translateX(5rpx);
}

.service-info {
  display: flex;
  align-items: center;
}

.service-thumb {
  width: 120rpx;
  height: 120rpx;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 25rpx;
}

.service-details {
  flex: 1;
  overflow: hidden;
}

.service-name {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 15rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-price {
  font-size: 30rpx;
  color: #4A6FE3;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
  flex-shrink: 0;
  margin-left: 20rpx;
}

.edit-btn {
  padding: 8rpx 20rpx;
  background-color: #f2f5fd;
  border-radius: 25rpx;
  font-size: 24rpx;
  color: #4A6FE3;
  transition: all 0.3s ease;
}

.delete-btn {
  padding: 8rpx 20rpx;
  background-color: #fff0f0;
  border-radius: 25rpx;
  font-size: 24rpx;
  color: #ff4d4f;
  transition: all 0.3s ease;
}

.edit-btn:active {
  background-color: #e0e7fc;
}

.delete-btn:active {
  background-color: #ffd6d6;
}

.service-detail-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%) scale(0.95);
  width: 85%;
  max-height: 80vh;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
}

.detail-card-expanded {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  visibility: visible;
}

.detail-close-btn {
  position: absolute;
  top: 15rpx;
  right: 20rpx;
  font-size: 40rpx;
  color: #999;
  height: 60rpx;
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.detail-thumb {
  width: 180rpx;
  height: 180rpx;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  margin: 0 auto 25rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detail-info {
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f2f5fd;
}

.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15rpx;
  color: #333;
}

.detail-price {
  font-size: 32rpx;
  color: #4A6FE3;
  text-align: center;
  font-weight: 500;
}

.detail-description {
  font-size: 28rpx;
  color: #333;
  margin-top: 20rpx;
}

.description-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 15rpx;
  color: #333;
}

.description-content {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.detail-image-placeholder {
  width: 100%;
  height: 240rpx;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
  border-radius: 12rpx;
  border: 2rpx dashed #ddd;
}

.image-icon {
  font-size: 60rpx;
  color: #ccc;
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(3px);
}
</style>
