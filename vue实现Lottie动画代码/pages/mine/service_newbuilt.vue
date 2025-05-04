<template>
  <view>
    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 服务类型和节数在一行 -->
      <view class="row-container">
        <!-- 服务类型 -->
        <view class="form-item1">
          <view class="form-label">服务类型</view>
          <choice-selected
            :choiceIndex="selectedServiceTypeIndex"
            :choiceList="serviceTypes"
            :defaultText="'请选择服务类型'"
            @onChoiceClick="handleServiceTypeSelect"
          ></choice-selected>
        </view>
        
        <!-- 节数 (一对一课程) -->
        <view class="form-item1" v-if="selectedServiceType === '一对一课程'">
          <view class="form-label"></view>
          <choice-selected
          class="combobox-container"
            :choiceIndex="selectedLessonsIndex"
            :choiceList="lessonOptions"
            :defaultText="'请选择节数'"
            @onChoiceClick="handleLessonsSelect"
          ></choice-selected>
        </view>
        
        <!-- 课时 (一对多课程) -->
        <view class="form-item1" v-if="selectedServiceType === '一对多课程'">
          <view class="form-label"></view>
          <choice-selected
            class="combobox-container"
            :choiceIndex="selectedLessonsIndex"
            :choiceList="lessonOptions"
            :defaultText="'请选择节数'"
            @onChoiceClick="handleLessonsSelect"
          ></choice-selected>
        </view>
      </view>
      
      <!-- 一对一课程专用字段 -->
      <block v-if="selectedServiceType === '一对一课程'">
        <!-- 课程总时长 -->
        <view class="row-container">
          <!-- 小时 -->
          <view class="form-item1">
            <view class="form-label">课程总时长</view>
            <choice-selected
              :choiceIndex="selectedHoursIndex"
              :choiceList="hourOptions"
              :defaultText="'小时'"
              @onChoiceClick="handleHoursSelect"
            ></choice-selected>
          </view>
          
          <!-- 分钟 -->
          <view class="form-item1">
            <view class="form-label"></view> 
            <choice-selected
              class="combobox-container"
              :choiceIndex="selectedMinutesIndex"
              :choiceList="minuteOptions"
              :defaultText="'分钟'"
              @onChoiceClick="handleMinutesSelect"
            ></choice-selected>
          </view>
        </view>
        
        <!-- 服务名称 -->
        <view class="form-item">
          <view class="form-label">服务名称</view>
          <input 
            class="form-input" 
            type="text" 
            placeholder="请填写" 
            v-model="serviceName"
          />
        </view>
      </block>
      
      <!-- 一对多课程专用字段 -->
      <block v-if="selectedServiceType === '一对多课程'">
        <!-- 课程总时长 -->
        <view class="row-container">
          <!-- 小时 -->
          <view class="form-item1">
            <view class="form-label">课程总时长</view>
            <choice-selected
              :choiceIndex="selectedMultiHoursIndex"
              :choiceList="hourOptions"
              :defaultText="'小时'"
              @onChoiceClick="handleMultiHoursSelect"
            ></choice-selected>
          </view>
          
          <!-- 分钟 -->
          <view class="form-item1">
            <view class="form-label"></view> 
            <choice-selected
            class="combobox-container"
              :choiceIndex="selectedMultiMinutesIndex"
              :choiceList="minuteOptions"
              :defaultText="'分钟'"
              @onChoiceClick="handleMultiMinutesSelect"
            ></choice-selected>
          </view>
        </view>
        
        <!-- 课程人数 -->
        <view class="form-item">
          <view class="form-label">课程人数</view>
          <choice-selected
            :choiceIndex="selectedPersonCountIndex"
            :choiceList="personCountOptions"
            :defaultText="'请选择课程人数'"
            @onChoiceClick="handlePersonCountSelect"
          ></choice-selected>
        </view>
        
        <!-- 服务名称 -->
        <view class="form-item">
          <view class="form-label">服务名称</view>
          <input 
            class="form-input" 
            type="text" 
            placeholder="请填写" 
            v-model="multiServiceName"
          />
        </view>
      </block>
      
      <!-- 学习资料类型字段 -->
      <view class="form-item" v-if="selectedServiceType === '学习资料'">
        <view class="form-label">课程数量</view>
        <input
          class="form-input"
          type="number"
          placeholder="请输入课程数量"
          v-model.number="coursequantity"
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
      <text v-if="mode === 'add'">提交信息</text>
      <text v-else>完成修改</text>
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
        '一对一课程',
       '一对多课程',
       '学习资料'
      ],
      coursequantity: '',
      showServiceTypeDropdown: false,
      duration: '',
      description: '',
      price: '',
      files: [],
      showDuration: true,
      showAttachment: false,
      originalService: null, // 保存原始服务数据
      
      // 一对一课程相关数据
      serviceName: '',
      selectedLessonsIndex: -1,
      lessonOptions: ['1', '2', '3', '4', '5', '6', '7', '8','9','10'],
      selectedHoursIndex: -1,
      hourOptions: ['1', '2', '3', '4', '5', '6', '8', '10'],
      selectedMinutesIndex: -1,
      minuteOptions: ['0', '15', '30', '45'],
      
      // 一对多课程相关数据
      selectedMultiLessonsIndex: -1,
      multiLessonOptions: ['1', '2', '3', '4', '5', '6', '7', '20'],
      selectedMultiHoursIndex: -1,
      selectedMultiMinutesIndex: -1,
      multiServiceName: '',
      selectedPersonCountIndex: -1,
      personCountOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
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
      
      // 根据服务类型设置不同的字段
      if (this.selectedServiceType === '一对一课程') {
        // 设置服务名称
        this.serviceName = serviceData.serviceName || ''
        
        // 设置节数
        if (serviceData.lessons) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex(l => l === serviceData.lessons.toString())
        }
        
        // 解析总时长的小时和分钟
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
          if (match) {
            this.selectedHoursIndex = this.hourOptions.findIndex(h => h === match[1])
            this.selectedMinutesIndex = this.minuteOptions.findIndex(m => m === match[2])
          }
        }
      } else if (this.selectedServiceType === '一对多课程') {
        // 设置服务名称
        this.multiServiceName = serviceData.serviceName || ''
        
        // 设置课时
        if (serviceData.lessons) {
          this.selectedMultiLessonsIndex = this.multiLessonOptions.findIndex(l => l === serviceData.lessons.toString())
        }
        
        // 解析总时长的小时和分钟
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
          if (match) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex(h => h === match[1])
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex(m => m === match[2])
          }
        }
        
        // 设置课程人数
        if (serviceData.personCount) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex(p => p === serviceData.personCount.toString())
        }
      } else {
        // 学习资料类型
        this.coursequantity = serviceData.coursequantity || ''
      }
      
      // 更新表单字段显示
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
    handleLessonsSelect(index) {
      this.selectedLessonsIndex = index
    },
    handleHoursSelect(index) {
      this.selectedHoursIndex = index
    },
    handleMinutesSelect(index) {
      this.selectedMinutesIndex = index
    },
    handleMultiLessonsSelect(index) {
      this.selectedMultiLessonsIndex = index
    },
    handleMultiHoursSelect(index) {
      this.selectedMultiHoursIndex = index
    },
    handleMultiMinutesSelect(index) {
      this.selectedMultiMinutesIndex = index
    },
    handlePersonCountSelect(index) {
      this.selectedPersonCountIndex = index
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
      
      // 一对一课程的特殊验证
      if (this.selectedServiceType === '一对一课程') {
        if (this.selectedLessonsIndex === -1) {
          uni.showToast({
            title: '请选择课程节数',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
        
        if (this.selectedHoursIndex === -1 || this.selectedMinutesIndex === -1) {
          uni.showToast({
            title: '请选择课程时长',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
        
        if (!this.serviceName) {
          uni.showToast({
            title: '请填写服务名称',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
      } 
      // 一对多课程的特殊验证
      else if (this.selectedServiceType === '一对多课程') {
        if (this.selectedMultiLessonsIndex === -1) {
          uni.showToast({
            title: '请选择课时',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
        
        if (this.selectedMultiHoursIndex === -1 || this.selectedMultiMinutesIndex === -1) {
          uni.showToast({
            title: '请选择课程时长',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
        
        if (!this.multiServiceName) {
          uni.showToast({
            title: '请填写服务名称',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
        
        if (this.selectedPersonCountIndex === -1) {
          uni.showToast({
            title: '请选择课程人数',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
      } 
      // 学习资料类型验证
      else if (this.selectedServiceType === '学习资料') {
        if (!this.coursequantity) {
          uni.showToast({
            title: '请填写课程数量',
            icon: 'none'
          })
          this.$refs.loadingRef.hide()
          return
        }
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
        checked: false,
        imageUrl: this.files.length > 0 ? this.files[0] : '/static/images/kaoyan' + Math.floor(Math.random() * 4 + 1) + '.jpg'
      }
      
      // 为一对一课程添加特殊字段
      if (this.selectedServiceType === '一对一课程') {
        serviceData.serviceName = this.serviceName
        serviceData.lessons = this.lessonOptions[this.selectedLessonsIndex]
        serviceData.totalDuration = `${this.hourOptions[this.selectedHoursIndex]}小时${this.minuteOptions[this.selectedMinutesIndex]}分钟`
      } 
      // 为一对多课程添加特殊字段
      else if (this.selectedServiceType === '一对多课程') {
        serviceData.serviceName = this.multiServiceName
        serviceData.lessons = this.multiLessonOptions[this.selectedMultiLessonsIndex]
        serviceData.totalDuration = `${this.hourOptions[this.selectedMultiHoursIndex]}小时${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`
        serviceData.personCount = this.personCountOptions[this.selectedPersonCountIndex]
      } 
      // 其他服务类型
      else {
        serviceData.coursequantity = this.coursequantity
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
/* 服务编辑容器 */
.service-edit-container {
  padding: 30rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 表单容器 */
.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

/* 一行布局容器 */
.row-container {
  display: flex;
  flex-direction: row;
  gap: 20rpx; /* 减小元素间距 */
  margin-bottom: 20rpx;
}

.one-to-one-container{
  display: flex;
  flex-direction: row;
  width: 100%;
}
/* 特殊对齐的两行 */
.form-item1 {
  display: flex;
  flex-direction: column;
  width: 48%;
}
/* 标准表单项保持垂直布局 */
.form-item {
  display: flex;  
  flex-direction: column;
  position: relative;
  margin-bottom: 15rpx;
  width: 100%;
}

/* 表单标签 */
.form-label, .coursequantity {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

/* 表单选择器容器 */
.combobox-container {
  display: flex;
  flex-direction: column;
  width: 40%;
}

/* 课程时长容器 */
.duration-container {
  display: flex;
  gap: 16rpx;
  justify-content: space-between;
}

/* 课程时长项 */
.duration-item {
  width: 40%;
  max-width: 340rpx;
}

/* 课时和分钟定位 */
.combobox-container{
  position: relative;
  top: 37rpx;
}
/* 表单输入框 */
.form-input, .form-select{
  height: 90rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid #eee;
}

/* 表单文本域 */
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

/* 附件上传区域 */
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

/* 附件上传图标 */
.plus-icon {
  font-size: 72rpx;
  color: #ddd;
  font-weight: 300;
}

/* 提交按钮 */
.submit-btn {
  height: 90rpx;
  background:#494747;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 60rpx;
  position: relative;
  transition: all 0.3s ease;
}

/* 提交按钮点击效果 */  
.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 3rpx 10rpx rgba(74, 111, 227, 0.2);
}

/* 提交按钮图标 */
.lightning-icon {
  margin-left: 10rpx;
  font-size: 32rpx;
}

.side-by-side-container {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.duration-hours {
  flex: 1;
}

.duration-minutes {
  flex: 1;
}
</style>
