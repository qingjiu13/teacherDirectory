<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 导航栏 -->
    <Header :title="mode === 'edit' ? '修改信息' : '新建服务'" class="header-container" @back="goBack" />
    
    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 基本信息区块 -->
      <view class="form-section-wrapper">
        <view class="form-section">
          <view class="section-title">基本信息</view>
          
          <!-- 服务名称 -->
          <view class="form-item horizontal-item">
            <view class="form-label-horizontal">
              <view>服务名称</view>
            </view>
            <input 
              class="form-input-horizontal" 
              type="text" 
              placeholder="请输入服务名称" 
              v-model="serviceNameModel"
            />
          </view>
          
          <!-- 服务类型 -->
          <view class="form-item horizontal-item">
            <view class="form-label-horizontal">服务类型</view>
            <view class="select-container">
              <choice-selected
                :choiceIndex="selectedServiceTypeIndex"
                :choiceList="serviceTypes"
                :defaultText="'请选择服务类型'"
                @onChoiceClick="handleServiceTypeSelect"
              ></choice-selected>
            </view>
          </view>
          
          <!-- 课程时长 -->
          <view class="form-item horizontal-item">
            <view class="form-label-horizontal">课程时长</view>
            <view class="time-wrapper">
              <view class="time-selector">
                <choice-selected
                  :choiceIndex="selectedServiceType === '一对多课程' ? selectedMultiHoursIndex : selectedHoursIndex"
                  :choiceList="hourOptions"
                  :defaultText="'小时'"
                  @onChoiceClick="(index) => selectedServiceType === '一对多课程' ? handleMultiHoursSelect(index) : handleHoursSelect(index)"
                ></choice-selected>
              </view>
              <view class="time-selector">
                <choice-selected
                  :choiceIndex="selectedServiceType === '一对多课程' ? selectedMultiMinutesIndex : selectedMinutesIndex"
                  :choiceList="minuteOptions"
                  :defaultText="'分钟'"
                  @onChoiceClick="(index) => selectedServiceType === '一对多课程' ? handleMultiMinutesSelect(index) : handleMinutesSelect(index)"
                ></choice-selected>
              </view>
            </view>
          </view>
          
          <!-- 课程人数 (一对多课程) -->
          <view class="form-item horizontal-item" v-if="selectedServiceType === '一对多课程'">
            <view class="form-label-horizontal">课程人数</view>
            <view class="select-container">
              <choice-selected
                :choiceIndex="selectedPersonCountIndex"
                :choiceList="personCountOptions"
                :defaultText="'请选择课程人数'"
                @onChoiceClick="handlePersonCountSelect"
              ></choice-selected>
            </view>
          </view>
          
          <!-- 服务价格 -->
          <view class="form-item horizontal-item">
            <view class="form-label-horizontal">
              <view>服务价格</view>
              <view class="price-hint">每小时价格/h</view>
            </view>
            <input 
              class="form-input-horizontal price-input" 
              type="text" 
              placeholder="如200元/h" 
              v-model="price"
              @input="trackChanges"
            />
          </view>
        </view>
      </view>
      
      <!-- 具体内容区块 -->
      <view class="form-section-wrapper">
        <view class="form-section">
          <view class="section-title">具体内容</view>
          
          <!-- 服务介绍 -->
          <view class="form-item">
            <view class="form-label-small">服务介绍 <text class="max-count">(限200字)</text></view>
            <textarea 
              class="form-textarea" 
              placeholder="请输入服务介绍" 
              v-model="description"
              @input="trackChanges"
            />
          </view>
          
          <!-- 封面上传 -->
          <view class="form-item">
            <view class="form-label-small">上传封面</view>
            <view class="upload-item">
              <view class="upload-btn" @click="chooseCover">
                <text class="plus-icon">+</text>
              </view>
            </view>
          </view>
          
          <!-- 附件上传 -->
          <view class="form-item" v-if="showAttachment">
            <view class="form-label-small">上传附件</view>
            <view class="upload-item">
              <view class="upload-btn" @click="chooseFile">
                <text class="plus-icon">+</text>
              </view>
            </view>
          </view>
          
          <!-- 已上传封面预览 -->
          <view class="cover-grid" v-if="coverUrls.length > 0">
            <block v-for="(url, index) in coverUrls" :key="index">
              <view class="cover-item">
                <image :src="url" class="cover-image" mode="aspectFill"></image>
                <view class="delete-icon" @click.stop="deleteCover(index)">×</view>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btn-area">
      <view class="confirm-btn" @click="submitForm">确定</view>
    </view>
    
  </view>
</template>

<script>
// 使用绝对路径
import ChoiceSelected from '/pagesMine/components/combobox/combobox.vue'
import Header from '@/components/navigationTitleBar/header'
import { Navigator } from '@/router/Router.js'

export default {
  components: {
    'choice-selected': ChoiceSelected,
    Header
  },
  data() {
    return {
      hasEdited: false, // 用于跟踪表单是否被编辑过
      mode: 'add', // 默认为添加模式
      serviceId: '', // 当前编辑的服务ID
      coverUrls: [], // 修改：封面图片URL数组
      avatarUrl: '', // 新增：头像URL
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
      showDuration: false,
      showAttachment: false,
      originalService: null, // 保存原始服务数据
      
      // 一对一课程相关数据
      serviceName: '',
      selectedHoursIndex: -1,
      hourOptions: ['1', '2', '4', '6', '8', '10', '12', '24', '48', '60', '120'],
      selectedMinutesIndex: -1,
      minuteOptions: ['0', '15', '30', '45'],
      
      // 一对多课程相关数据
      selectedMultiHoursIndex: -1,
      selectedMultiMinutesIndex: -1,
      multiServiceName: '',
      selectedPersonCountIndex: -1,
      personCountOptions: ['2', '4', '6', '8', '10', '15', '20', '30'],

      // 状态栏高度
      statusBarHeight: 0
    }
  },
  onLoad(options) {
    console.log('===============================')
    console.log('service_newbuilt onLoad:', options)
    
    // 设置状态栏高度
    this.setStatusBarHeight()
    
    // 设置模式和服务ID
    if (options && options.mode) {
      this.mode = options.mode
      console.log('当前模式:', this.mode)
      
      if (options.mode === 'edit' && options.id) {
        // 编辑模式：获取服务ID
        this.serviceId = options.id
        console.log('编辑服务ID:', this.serviceId)
        
        // 检查全局状态中是否有编辑服务数据
        if (getApp().globalData && getApp().globalData.editingService) {
          console.log('全局状态中存在编辑服务数据:', getApp().globalData.editingService)
        } else {
          console.log('全局状态中不存在编辑服务数据')
        }
        
        // 加载待编辑的服务数据
        this.loadEditingService()
      }
    } else {
      console.log('未检测到模式参数，默认为新建模式')
      this.mode = 'add'
    }
    
    // 初始化表单字段显示
    this.updateFormFields()
    console.log('===============================')
  },
  onUnload() {
    // 移除事件监听
    uni.$off('serviceEdited', this.handleServiceEdited)
    
    // 清理全局状态中的编辑服务
    if (getApp().globalData) {
      getApp().globalData.editingService = null
    }
  },
  methods: {
    // 设置状态栏高度
    setStatusBarHeight() {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      // 设置状态栏高度（rpx单位）
      this.statusBarHeight = systemInfo.statusBarHeight
      
      // 设置CSS变量
      // 只在document存在的环境中执行DOM操作
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.style.setProperty('--status-bar-height', `${this.statusBarHeight}px`)
      }
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.avatarUrl = res.tempFilePaths[0]
        }
      })
    },
    chooseCover() {
      const remainCount = 9 - this.coverUrls.length
      if (remainCount <= 0) {
        uni.showToast({
          title: '最多只能上传9张图片',
          icon: 'none'
        })
        return
      }
      
      uni.chooseImage({
        count: remainCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.coverUrls = [...this.coverUrls, ...res.tempFilePaths]
          this.hasEdited = true
        }
      })
    },
    deleteCover(index) {
      this.coverUrls.splice(index, 1)
      this.hasEdited = true
    },
    loadEditingService() {
      try {
        console.log('开始加载编辑服务数据...')
        console.log('服务ID:', this.serviceId)
        
        // 首先尝试从全局数据获取
        if (getApp().globalData && getApp().globalData.editingService) {
          const editingService = getApp().globalData.editingService
          console.log('从全局数据获取到编辑服务:', editingService)
          
          // 检查ID是否匹配
          if (editingService.id.toString() === this.serviceId.toString()) {
            console.log('ID匹配，使用全局数据')
            this.originalService = editingService
            
            // 使用服务数据填充表单
            this.fillFormWithServiceData(this.originalService)
            console.log('表单填充完成')
            return
          } else {
            console.warn('全局数据中的服务ID不匹配')
          }
        } else {
          console.log('全局数据中不存在编辑服务数据')
        }
        
        // 如果全局数据不存在或ID不匹配，尝试从本地存储加载
        const servicesStr = uni.getStorageSync('services')
        if (servicesStr) {
          const services = JSON.parse(servicesStr)
          console.log('从本地存储获取到服务列表，共', services.length, '条记录')
          
          const service = services.find(s => s.id.toString() === this.serviceId.toString())
          
          if (service) {
            console.log('在本地存储中找到匹配的服务:', service)
            this.originalService = service
            
            // 使用服务数据填充表单
            this.fillFormWithServiceData(service)
            console.log('表单填充完成')
          } else {
            console.error('在本地存储中找不到匹配的服务')
            uni.showToast({
              title: '找不到服务数据',
              icon: 'none'
            })
            
            // 延迟返回上一页
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        } else {
          console.error('本地存储中不存在服务数据')
          uni.showToast({
            title: '找不到服务数据',
            icon: 'none'
          })
          
          // 延迟返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      } catch (error) {
        console.error('加载服务数据失败:', error)
        uni.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
      }
    },
    fillFormWithServiceData(serviceData) {
      // 设置封面图片
      this.coverUrls = serviceData.imageUrls || (serviceData.imageUrl ? [serviceData.imageUrl] : [])
      
      // 设置服务类型 (注意：需要修正设置服务类型的方式)
      if (serviceData.type && serviceData.type.typename) {
        // 如果服务数据使用type对象
        this.selectedServiceType = serviceData.type.typename
        this.selectedServiceTypeIndex = this.serviceTypes.findIndex(type => type === serviceData.type.typename)
      } else {
        // 如果服务数据直接使用name字段
        this.selectedServiceType = serviceData.name || ''
        this.selectedServiceTypeIndex = this.serviceTypes.findIndex(type => type === serviceData.name)
      }
      
      // 设置价格（去掉价格前面的¥符号）
      this.price = serviceData.price ? serviceData.price.replace(/[¥￥]/g, '') : ''
      
      // 设置描述
      this.description = serviceData.description || ''
      
      // 根据服务类型设置不同的字段
      if (this.selectedServiceType === '一对一课程') {
        // 设置服务名称 (优先使用serviceName字段，如果没有则使用name)
        this.serviceName = serviceData.serviceName || serviceData.name || ''
        
        // 解析总时长的小时和分钟
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
          if (match) {
            this.selectedHoursIndex = this.hourOptions.findIndex(h => h === match[1])
            this.selectedMinutesIndex = this.minuteOptions.findIndex(m => m === match[2])
          }
        } else if (serviceData.type && serviceData.type.fulllength) {
          // 从type.fulllength获取时长信息
          const hours = serviceData.type.fulllength.hours || ''
          const minutes = serviceData.type.fulllength.minutes || ''
          
          const hoursMatch = hours.match(/(\d+)/)
          const minutesMatch = minutes.match(/(\d+)/)
          
          if (hoursMatch) {
            this.selectedHoursIndex = this.hourOptions.findIndex(h => h === hoursMatch[1])
          }
          
          if (minutesMatch) {
            this.selectedMinutesIndex = this.minuteOptions.findIndex(m => m === minutesMatch[1])
          }
        }
      } else if (this.selectedServiceType === '一对多课程') {
        // 设置服务名称
        this.multiServiceName = serviceData.serviceName || serviceData.name || ''
        
        // 解析总时长的小时和分钟
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
          if (match) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex(h => h === match[1])
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex(m => m === match[2])
          }
        } else if (serviceData.type && serviceData.type.fulllength) {
          // 从type.fulllength获取时长信息
          const hours = serviceData.type.fulllength.hours || ''
          const minutes = serviceData.type.fulllength.minutes || ''
          
          const hoursMatch = hours.match(/(\d+)/)
          const minutesMatch = minutes.match(/(\d+)/)
          
          if (hoursMatch) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex(h => h === hoursMatch[1])
          }
          
          if (minutesMatch) {
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex(m => m === minutesMatch[1])
          }
        }
        
        // 设置课程人数
        if (serviceData.personCount) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex(p => p === serviceData.personCount.toString())
        } else if (serviceData.type && serviceData.type.studentnum) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex(p => parseInt(p) === serviceData.type.studentnum)
        }
      } else if (this.selectedServiceType === '学习资料') {
        // 学习资料类型
        this.coursequantity = serviceData.coursequantity || serviceData.name || ''
      }
      
      // 更新表单字段显示
      this.updateFormFields()
    },
    goBack() {
      // 如果表单被编辑过，显示提示弹窗
      if (this.hasEdited) {
        uni.showModal({
          title: '提示',
          content: '是否保存已编辑的内容？',
          cancelText: '不保存',
          confirmText: '保存',
          success: (res) => {
            if (res.confirm) {
              // 用户选择保存
              this.submitForm();
            } else {
              // 用户选择不保存，直接返回
              Navigator.toService();
            }
          }
        });
      } else {
        // 表单未编辑过，直接返回
        Navigator.toService();
      }
    },
    handleServiceTypeSelect(index) {
      this.selectedServiceTypeIndex = index
      this.selectedServiceType = this.serviceTypes[index]
      
      // 切换服务类型时，重置相关字段
      if (this.selectedServiceType === '一对一课程') {
        this.selectedHoursIndex = -1
        this.selectedMinutesIndex = -1
        this.serviceName = ''
      } else if (this.selectedServiceType === '一对多课程') {
        this.selectedMultiHoursIndex = -1
        this.selectedMultiMinutesIndex = -1
        this.multiServiceName = ''
        this.selectedPersonCountIndex = -1
      } else if (this.selectedServiceType === '学习资料') {
        this.coursequantity = ''
      }
      
      // 更新表单字段显示
      this.updateFormFields()
      this.hasEdited = true
    },
    handleHoursSelect(index) {
      this.selectedHoursIndex = index
      this.hasEdited = true
    },
    handleMinutesSelect(index) {
      this.selectedMinutesIndex = index
      this.hasEdited = true
    },
    handleMultiHoursSelect(index) {
      this.selectedMultiHoursIndex = index
      this.hasEdited = true
    },
    handleMultiMinutesSelect(index) {
      this.selectedMultiMinutesIndex = index
      this.hasEdited = true
    },
    handlePersonCountSelect(index) {
      this.selectedPersonCountIndex = index
      this.hasEdited = true
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
          this.hasEdited = true
        }
      })
    },
    submitForm() {
      // 显示加载动画
      uni.showLoading({
        title: '提交中...'
      })
      
      // 表单验证
      if (this.coverUrls.length === 0) {
        uni.showToast({
          title: '请上传封面图片',
          icon: 'none'
        })
        uni.hideLoading()
        return
      }
      
      if (!this.selectedServiceType) {
        uni.showToast({
          title: '请选择服务类型',
          icon: 'none'
        })
        uni.hideLoading()
        return
      }
      
      // 一对一课程的特殊验证
      if (this.selectedServiceType === '一对一课程') {
        if (this.selectedHoursIndex === -1 || this.selectedMinutesIndex === -1) {
          uni.showToast({
            title: '请选择课程时长',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
        
        if (!this.serviceName) {
          uni.showToast({
            title: '请填写服务名称',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
      } 
      // 一对多课程的特殊验证
      else if (this.selectedServiceType === '一对多课程') {
        if (this.selectedMultiHoursIndex === -1 || this.selectedMultiMinutesIndex === -1) {
          uni.showToast({
            title: '请选择课程时长',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
        
        if (!this.multiServiceName) {
          uni.showToast({
            title: '请填写服务名称',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
        
        if (this.selectedPersonCountIndex === -1) {
          uni.showToast({
            title: '请选择课程人数',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
      } 
      // 学习资料类型验证
      else if (this.selectedServiceType === '学习资料') {
        if (!this.coursequantity) {
          uni.showToast({
            title: '请填写服务名称',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
      }
      
      if (!this.price) {
        uni.showToast({
          title: '请填写服务价格',
          icon: 'none'
        })
        uni.hideLoading()
        return
      }
      
      // 构建服务对象
      let serviceData = {}
      
      // 编辑模式下保留原始服务的部分信息
      if (this.mode === 'edit' && this.originalService) {
        // 保留原始ID和部分不变的属性
        serviceData = {
          ...this.originalService,
          // 这些字段将被覆盖
          name: this.selectedServiceType,
          price: this.price.startsWith('¥') ? this.price : '¥' + this.price,
          description: this.description || `这是一个${this.selectedServiceType}服务`,
          imageUrls: this.coverUrls,
          imageUrl: this.coverUrls[0] || ''
        }
      } else {
        // 新建模式
        serviceData = {
          id: Date.now().toString(), // 生成新ID
          name: this.selectedServiceType,
          price: this.price.startsWith('¥') ? this.price : '¥' + this.price,
          description: this.description || `这是一个${this.selectedServiceType}服务`,
          checked: false,
          imageUrls: this.coverUrls,
          imageUrl: this.coverUrls[0] || '',
          createTime: new Date().toISOString().split('T')[0],
          updateTime: new Date().toISOString().split('T')[0],
          status: 'active'
        }
      }
      
      // 为一对一课程添加特殊字段
      if (this.selectedServiceType === '一对一课程') {
        serviceData.serviceName = this.serviceName
        serviceData.totalDuration = `${this.hourOptions[this.selectedHoursIndex]}小时${this.minuteOptions[this.selectedMinutesIndex]}分钟`
        
        // 添加类型信息
        serviceData.type = {
          typename: '一对一课程',
          fulllength: {
            hours: `${this.hourOptions[this.selectedHoursIndex]}小时`,
            minutes: `${this.minuteOptions[this.selectedMinutesIndex]}分钟`
          }
        }
      } 
      // 为一对多课程添加特殊字段
      else if (this.selectedServiceType === '一对多课程') {
        serviceData.serviceName = this.multiServiceName
        serviceData.totalDuration = `${this.hourOptions[this.selectedMultiHoursIndex]}小时${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`
        serviceData.personCount = this.personCountOptions[this.selectedPersonCountIndex]
        
        // 添加类型信息
        serviceData.type = {
          typename: '一对多课程',
          fulllength: {
            hours: `${this.hourOptions[this.selectedMultiHoursIndex]}小时`,
            minutes: `${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`
          },
          studentnum: parseInt(this.personCountOptions[this.selectedPersonCountIndex])
        }
      } 
      // 其他服务类型
      else if (this.selectedServiceType === '学习资料') {
        serviceData.coursequantity = this.coursequantity
        serviceData.serviceName = this.coursequantity // 使用输入的名称作为serviceName
        
        // 添加类型信息
        serviceData.type = {
          typename: '学习资料',
          fileLink: 'https://www.baidu.com' // 示例链接，实际应该由用户上传文件后获取
        }
      }
      
      // 更新时间戳
      serviceData.updateTime = new Date().toISOString().split('T')[0]
      
      // 根据模式执行不同操作
      if (this.mode === 'edit') {
        this.updateExistingService(serviceData)
      } else {
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
        
        // 检查服务是否已存在
        const existingIndex = services.findIndex(s => s.id === newService.id)
        if (existingIndex !== -1) {
          // 如果已存在，则更新
          services[existingIndex] = newService
        } else {
          // 添加新服务到列表中
          services.push(newService)
        }
        
        // 保存更新后的列表
        uni.setStorageSync('services', JSON.stringify(services))
        
        // 设置上一页需要刷新的标志
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.newServiceAdded = true
        getApp().globalData.newService = newService
        
        uni.hideLoading()
        
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
        
        // 重置编辑状态
        this.hasEdited = false
        
        // 延时返回上一页
        setTimeout(() => {
          // 使用Navigator进行导航
          Navigator.toService();
        }, 1500)
      } catch (e) {
        console.error('保存服务失败', e)
        uni.hideLoading()
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
          // 如果找不到，则添加为新服务
          services.push(updatedService)
        }
        
        // 保存更新后的列表
        uni.setStorageSync('services', JSON.stringify(services))
        
        // 设置编辑标志
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.serviceEdited = true
        getApp().globalData.editedService = updatedService
        
        uni.hideLoading()
        
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        })
        
        // 重置编辑状态
        this.hasEdited = false
        
        // 延时返回上一页
        setTimeout(() => {
          // 使用Navigator进行导航
          Navigator.toService();
        }, 1500)
      } catch (e) {
        console.error('更新服务失败', e)
        uni.hideLoading()
        uni.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        })
      }
    },
    handleServiceEdited(service) {
      console.log('Service edited', service)
    },
    trackChanges() {
      this.hasEdited = true
    }
  },
  computed: {
    serviceNameModel: {
      get() {
        return this.selectedServiceType === '一对多课程' ? this.multiServiceName : this.serviceName;
      },
      set(value) {
        if (this.selectedServiceType === '一对多课程') {
          this.multiServiceName = value;
        } else {
          this.serviceName = value;
        }
        this.trackChanges();
      }
    }
  }
}
</script>

<style>
.status-bar {
  width: 100%;
  height: var(--status-bar-height);
  background-color: #fff;
}

.header-container {
  width: 100%;
  height: 60rpx; /* 减少高度，使导航栏更贴近顶部 */
  display: flex;
  align-items: center;
  position: relative;
  background-color: #fff;
  z-index: 100;
  margin-bottom: 10rpx; /* 减少底部间距 */
}

/* 整体页面容器 */
.page-container {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* 表单容器 */
.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
}

/* 表单区块包装器 */
.form-section-wrapper {
  position: relative;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  padding: 1px; /* 为边框留出空间 */
  background: linear-gradient(to bottom, #E9EAFF, #b096f7); /* 边框渐变色 */
}

/* 表单区块 */
.form-section {
  background: linear-gradient(to bottom,#fff 5%,#E9EAFF 60%, #cfb1f7 ); /* 使用上下渐变背景 */
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 0; /* 移除底部外边距，由wrapper控制 */
}

/* 区块标题 */
.section-title {
  font-size: 30rpx;
  color: #9A63FF;
  margin-bottom: 30rpx;
}

/* 一行布局容器 */
.row-container {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
  margin-bottom: 30rpx;
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
  margin-bottom: 25rpx;
  width: 100%;
}

/* 表单标签 */
.form-label {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

/* 最大字数提示 */
.max-count {
  font-size: 22rpx;
  color: #999;
  font-weight: normal;
}

/* 必填项标记 */
.required::after {
  content: '*';
  color: #ff4d4f;
  position: absolute;
  top: 2rpx;
  right: -20rpx;
  font-size: 28rpx;
}

/* 表单输入框 */
.form-input, .form-select{
  height: 70rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #333;
  border: 2rpx solid #979797;
  width: 100%;
  box-sizing: border-box;
}

/* 价格输入框 */
.price-input {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* 表单文本域 */
.form-textarea {
  height: 200rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #333;
  border: 2rpx solid #979797;
  width: 100%;
  box-sizing: border-box;
}

/* 错误提示样式 */
.error-message {
  color: #ff4d4f;
  font-size: 24rpx;
  margin-top: 8rpx;
}

/* 错误状态的输入框 */
.input-error {
  border-color: #ff4d4f !important;
}

/* 表单选择器容器 */
.combobox-container {
  position: relative; 
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 上传项容器 */
.upload-item {
  margin-top: 10rpx;
}

/* 上传按钮 */
.upload-btn {
  width: 160rpx;
  height: 160rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #979797;
}

/* 上传图标 */
.plus-icon {
  font-size: 72rpx;
  color: #ccc;
  font-weight: 300;
}

/* 底部按钮区域 */
.bottom-btn-area {
  padding: 30rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 确认按钮 */
.confirm-btn {
  height: 70rpx;
  width: 180rpx;
  background:linear-gradient(to bottom,#A5A9F7,#464EF8 90%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 100;
}

/* 封面图片网格 */
.cover-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -5rpx;
}

.cover-item {
  width: calc(33.33% - 10rpx);
  height: 215rpx;
  margin: 0 5rpx 15rpx;
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-bottom-left-radius: 8rpx;
}

/* 时间选择器包装容器 */
.time-wrapper {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 20rpx;
}

/* 单个时间选择器 */
.time-selector {
  flex: 1;
  width: 0; /* 让flex:1生效 */
}

/* 水平排列的表单项 */
.horizontal-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 25rpx;
}

/* 水平排列的标签 */
.form-label-horizontal {
  font-size: 24rpx;
  font-weight: 500;
  color: #333;
  width: 150rpx;
  text-align: left;
}

/* 水平排列的输入框 */
.form-input-horizontal {
  height: 70rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #333;
  border: 2rpx solid #979797;
  flex: 1;
  box-sizing: border-box;
}

/* 选择器容器 */
.select-container {
  flex: 1;
}

/* 价格提示文字 */
.price-hint {
  font-size: 20rpx;
  color: #979797;
  margin-top: 5rpx;
}

/* 具体内容区域的标签 */
.form-label-small {
  font-size: 24rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

/* 表单输入框占位符 */
.form-input::placeholder, .form-textarea::placeholder {
  font-size: 24rpx;
  color: #979797;
}

/* 表单文本域 */
.form-textarea {
  height: 200rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #333;
  border: 2rpx solid #979797;
  width: 100%;
  box-sizing: border-box;
}

/* 确保下拉框中的文字大小与输入框一致 */
.choice-text {
  font-size: 24rpx !important;
}

/* 确保所有下拉框中的文字大小统一 */
::v-deep .choice-container,
::v-deep .choice-text,
::v-deep .choice-item {
  font-size: 24rpx !important;
}
</style>
