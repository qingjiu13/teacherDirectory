<template>
  <view class="service-edit-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 服务类型 -->
      <view class="form-item">
        <view class="form-label">服务类型</view>
        <view class="combobox-container">
          <choice-selected
            :choiceIndex="selectedServiceTypeIndex"
            :choiceList="serviceTypes"
            :defaultText="'请选择服务类型'"
            @onChoiceClick="handleServiceTypeSelect"
          ></choice-selected>
        </view>
      </view>
      
      <!-- 课程时长 -->
      <view class="form-item" v-if="showDuration">
        <view class="form-label">单次课程时长 (选择学习资料不显示)</view>
        <input 
          class="form-input" 
          type="text" 
          placeholder="按照min填写，如45min~" 
          v-model="duration"
        />
      </view>
      
      <!-- 服务介绍 -->
      <view class="form-item">
        <view class="form-label">服务介绍</view>
        <textarea 
          class="form-textarea" 
          placeholder="请填写" 
          v-model="description"
        />
      </view>
      
      <!-- 服务价格 -->
      <view class="form-item">
        <view class="form-label">服务价格</view>
        <input 
          class="form-input" 
          type="text" 
          placeholder="按照元填写，如200元~" 
          v-model="price"
        />
      </view>
      
      <!-- 附件上传 -->
      <view class="form-item" v-if="showAttachment">
        <view class="form-label">附件上传 (学习资料显示)</view>
        <view class="upload-area" @click="chooseFile">
          <text class="plus-icon">+</text>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="submit-btn" @click="submitForm">
      <text>提交信息/完成修改</text>
      <text class="lightning-icon">⚡</text>
    </view>
    
    <!-- 加载动画组件 -->
    <loading ref="loadingRef" />
  </view>
</template>

<script>
import Loading from '@/components/loading-animation/loading.vue'
import ChoiceSelected from '@/components/combobox/combobox.vue'

export default {
  components: {
    Loading,
    ChoiceSelected
  },
  data() {
    return {
      mode: 'add', // 默认为添加模式
      serviceId: null, // 当前编辑的服务ID
      selectedServiceType: '',
      selectedServiceTypeIndex: -1,
      serviceTypes: [
        '考研全年VIP班',
        '考研政治精讲班',
        '考研英语强化班',
        '专业课一对一定制',
        '考研数学基础班',
        '考研复试指导班',
        '考研暑期集训营',
        '考研考前冲刺班',
        '考研专业课资料包',
        '考研院校专业选择指导',
        '一对一课程',
        '小组课程',
        '学习资料',
        '专业辅导'
      ],
      showServiceTypeDropdown: false,
      duration: '',
      description: '',
      price: '',
      files: [],
      showDuration: true,
      showAttachment: false,
      originalService: null // 保存原始服务数据
    }
  },
  onLoad(options) {
    // 判断是新增模式还是编辑模式
    if (options.mode === 'edit' && options.id) {
      this.mode = 'edit'
      this.serviceId = options.id
      
      // 从全局状态获取服务数据
      if (getApp().globalData && getApp().globalData.editingService) {
        const serviceData = getApp().globalData.editingService
        this.originalService = JSON.parse(JSON.stringify(serviceData)) // 保存原始数据的副本
        
        // 填充表单数据
        this.fillFormWithServiceData(serviceData)
      }
    }
    
    // 监听serviceAdded事件
    uni.$on('serviceEdited', this.handleServiceEdited)
  },
  onUnload() {
    // 移除事件监听
    uni.$off('serviceEdited', this.handleServiceEdited)
  },
  methods: {
    fillFormWithServiceData(serviceData) {
      // 根据服务数据填充表单
      // 设置服务类型
      this.selectedServiceType = serviceData.name || ''
      this.selectedServiceTypeIndex = this.serviceTypes.findIndex(type => type === serviceData.name)
      
      // 设置价格（去掉价格前面的¥符号）
      this.price = serviceData.price ? serviceData.price.replace('¥', '') : ''
      
      // 设置描述
      this.description = serviceData.description || ''
      
      // 设置持续时间（如果有）
      this.duration = serviceData.duration || ''
      
      // 根据服务类型决定是否显示某些表单项
      this.updateFormFields()
    },
    goBack() {
      uni.navigateBack()
    },
    handleServiceTypeSelect(index) {
      this.selectedServiceTypeIndex = index
      this.selectedServiceType = this.serviceTypes[index]
      
      // 更新表单字段显示
      this.updateFormFields()
    },
    updateFormFields() {
      // 根据服务类型显示或隐藏某些表单项
      if (this.selectedServiceType === '学习资料') {
        this.showDuration = false
        this.showAttachment = true
      } else {
        this.showDuration = true
        this.showAttachment = this.selectedServiceType === '学习资料'
      }
    },
    chooseFile() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.files = res.tempFilePaths
        }
      })
    },
    submitForm() {
      // 显示加载动画
      this.$refs.loadingRef.show()
      
      // 表单验证
      if (!this.selectedServiceType) {
        uni.showToast({
          title: '请选择服务类型',
          icon: 'none'
        })
        this.$refs.loadingRef.hide()
        return
      }
      
      if (this.showDuration && !this.duration) {
        uni.showToast({
          title: '请填写课程时长',
          icon: 'none'
        })
        this.$refs.loadingRef.hide()
        return
      }
      
      if (!this.price) {
        uni.showToast({
          title: '请填写服务价格',
          icon: 'none'
        })
        this.$refs.loadingRef.hide()
        return
      }
      
      // 构建服务对象
      let serviceData = {
        name: this.selectedServiceType,
        price: this.price.startsWith('¥') ? this.price : '¥' + this.price,
        description: this.description || `这是一个${this.selectedServiceType}服务`,
        duration: this.duration,
        checked: false,
        imageUrl: this.files.length > 0 ? this.files[0] : '/static/images/kaoyan' + Math.floor(Math.random() * 4 + 1) + '.jpg'
      }
      
      // 根据模式执行不同操作
      if (this.mode === 'edit' && this.serviceId && this.originalService) {
        // 编辑模式：保留原ID和选中状态
        serviceData.id = this.serviceId
        serviceData.checked = this.originalService.checked
        
        this.updateExistingService(serviceData)
      } else {
        // 新增模式：生成新ID
        serviceData.id = Date.now()
        this.addNewService(serviceData)
      }
    },
    addNewService(newService) {
      // 将新服务数据存储到全局状态或本地存储中
      try {
        // 获取之前的服务列表（如果存在）
        const servicesStr = uni.getStorageSync('services')
        let services = []
        
        if (servicesStr) {
          services = JSON.parse(servicesStr)
        }
        
        // 添加新服务到列表中
        services.push(newService)
        
        // 保存更新后的列表
        uni.setStorageSync('services', JSON.stringify(services))
        
        // 设置上一页需要刷新的标志
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.newServiceAdded = true
        getApp().globalData.newService = newService
        
        this.$refs.loadingRef.hide()
        
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        
        // 延时返回上一页
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            success: () => {
              // 触发自定义事件通知上一页
              uni.$emit('serviceAdded', newService)
            }
          })
        }, 1500)
      } catch (e) {
        console.error('保存服务失败', e)
        this.$refs.loadingRef.hide()
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      }
    },
    updateExistingService(updatedService) {
      try {
        // 获取服务列表
        const servicesStr = uni.getStorageSync('services')
        let services = []
        
        if (servicesStr) {
          services = JSON.parse(servicesStr)
        }
        
        // 查找并更新对应的服务
        const index = services.findIndex(s => s.id == this.serviceId)
        
        if (index !== -1) {
          services[index] = updatedService
        } else {
          // 如果在本地存储中找不到，则查找默认数据
          const defaultServices = getApp().globalData.defaultServices || []
          const defaultIndex = defaultServices.findIndex(s => s.id == this.serviceId)
          
          if (defaultIndex !== -1) {
            defaultServices[defaultIndex] = updatedService
          } else {
            // 如果都找不到，则添加为新服务
            services.push(updatedService)
          }
        }
        
        // 保存更新后的列表
        uni.setStorageSync('services', JSON.stringify(services))
        
        // 设置编辑标志
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.serviceEdited = true
        getApp().globalData.editedService = updatedService
        
        this.$refs.loadingRef.hide()
        
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        })
        
        // 延时返回上一页
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            success: () => {
              // 触发自定义事件通知上一页
              uni.$emit('serviceEdited', updatedService)
            }
          })
        }, 1500)
      } catch (e) {
        console.error('更新服务失败', e)
        this.$refs.loadingRef.hide()
        uni.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        })
      }
    },
    handleServiceEdited(service) {
      console.log('Service edited', service)
    }
  }
}
</script>

<style>
.service-edit-container {
  padding: 30rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 20rpx 0;
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

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-label {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

.combobox-container {
  width: 100%;
}

.form-input, .form-select {
  height: 90rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid #eee;
}

.form-textarea {
  height: 200rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid #eee;
  width: calc(100% - 44rpx);
}

.upload-area {
  width: 140rpx;
  height: 140rpx;
  background-color: #fff;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rpx;
  border: 2rpx solid #ddd;
}

.plus-icon {
  font-size: 72rpx;
  color: #ddd;
  font-weight: 300;
}

.submit-btn {
  height: 90rpx;
  background: linear-gradient(135deg, #4A6FE3, #7E57C2);
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 60rpx;
  box-shadow: 0 6rpx 16rpx rgba(74, 111, 227, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 3rpx 10rpx rgba(74, 111, 227, 0.2);
}

.lightning-icon {
  margin-left: 10rpx;
  font-size: 32rpx;
}
</style>
