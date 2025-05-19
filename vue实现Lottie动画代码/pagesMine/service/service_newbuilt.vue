<template>
  <view class="page-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 导航栏 -->
    <Header :title="mode === 'edit' ? '修改信息' : '新增服务'" class="header-container" @back="goBack" />
    
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
            @input="trackChanges"
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
            @input="trackChanges"
          />
        </view>
      </block>
      
      <!-- 学习资料类型字段 -->
      <view class="form-item" v-if="selectedServiceType === '学习资料'">
        <view class="form-label">服务名称</view>
        <input
          class="form-input"
          type="text"
          placeholder="请输入服务名称"
          v-model="coursequantity"
          @input="trackChanges"
        />
      </view>
      
      <!-- 服务介绍 -->
      <view class="form-item">
        <view class="form-label">服务介绍</view>
        <textarea 
          class="form-textarea" 
          placeholder="请填写" 
          v-model="description"
          @input="trackChanges"
        />
      </view>
      
      <!-- 服务价格 -->
      <view class="form-item">
        <view class="form-label">服务价格(每小时价格/h)</view>
        <input 
          class="form-input" 
          type="text" 
          placeholder="按照元填写，如200元/h~" 
          v-model="price"
          @input="trackChanges"
        />
      </view>
      
      <!-- 附件上传 -->
      <view class="form-item" v-if="showAttachment">
        <view class="form-label">附件上传 (学习资料显示)</view>
        <view class="upload-area" @click="chooseFile">
          <text class="plus-icon">+</text>
        </view>
      </view>

      <!-- 封面上传 -->
      <view class="form-item">
        <view class="form-label">封面上传</view>
        <view class="cover-grid">
          <!-- 已上传的图片 -->
          <block v-for="(url, index) in coverUrls" :key="index">
            <view class="cover-item">
              <image :src="url" class="cover-image" mode="aspectFill"></image>
              <view class="delete-icon" @click.stop="deleteCover(index)">×</view>
            </view>
          </block>
          
          <!-- 上传按钮 -->
          <view class="cover-item add-button" @click="chooseCover" v-if="coverUrls.length < 9">
            <text class="add-icon">+</text>
          </view>
        </view>
        <text class="tip-text">最多可上传9张图片，建议比例1:1</text>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="submit-btn" @click="submitForm">
      <text v-if="mode === 'add'">提交信息</text>
      <text v-else>完成修改</text>
    </view>
    
  </view>
</template>

<script>
// 使用相对路径
import ChoiceSelected from '@/pagesMine/components/combobox/combobox.vue'
import Header from '@/components/navigationTitleBar/header'
// 导入导航器模块
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
      selectedLessonsIndex: -1,
      lessonOptions: ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20'],
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
        
        // 设置节数
        if (serviceData.lessons) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex(l => l === serviceData.lessons.toString())
        } else if (serviceData.type && serviceData.type.coursenum) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex(l => parseInt(l) === serviceData.type.coursenum)
        }
        
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
        
        // 设置课时
        if (serviceData.lessons) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex(l => l === serviceData.lessons.toString())
        } else if (serviceData.type && serviceData.type.coursenum) {
          this.selectedLessonsIndex = this.lessonOptions.findIndex(l => parseInt(l) === serviceData.type.coursenum)
        }
        
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
        this.selectedLessonsIndex = -1
        this.selectedHoursIndex = -1
        this.selectedMinutesIndex = -1
        this.serviceName = ''
      } else if (this.selectedServiceType === '一对多课程') {
        this.selectedLessonsIndex = -1
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
    handleLessonsSelect(index) {
      this.selectedLessonsIndex = index
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
        if (this.selectedLessonsIndex === -1) {
          uni.showToast({
            title: '请选择课程节数',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
        
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
        if (this.selectedLessonsIndex === -1) {
          uni.showToast({
            title: '请选择课程节数',
            icon: 'none'
          })
          uni.hideLoading()
          return
        }
        
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
        serviceData.lessons = this.lessonOptions[this.selectedLessonsIndex]
        serviceData.totalDuration = `${this.hourOptions[this.selectedHoursIndex]}小时${this.minuteOptions[this.selectedMinutesIndex]}分钟`
        
        // 添加类型信息
        serviceData.type = {
          typename: '一对一课程',
          coursenum: parseInt(this.lessonOptions[this.selectedLessonsIndex]),
          fulllength: {
            hours: `${this.hourOptions[this.selectedHoursIndex]}小时`,
            minutes: `${this.minuteOptions[this.selectedMinutesIndex]}分钟`
          }
        }
      } 
      // 为一对多课程添加特殊字段
      else if (this.selectedServiceType === '一对多课程') {
        serviceData.serviceName = this.multiServiceName
        serviceData.lessons = this.lessonOptions[this.selectedLessonsIndex]
        serviceData.totalDuration = `${this.hourOptions[this.selectedMultiHoursIndex]}小时${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`
        serviceData.personCount = this.personCountOptions[this.selectedPersonCountIndex]
        
        // 添加类型信息
        serviceData.type = {
          typename: '一对多课程',
          coursenum: parseInt(this.lessonOptions[this.selectedLessonsIndex]),
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
  height: 220rpx;
  display: flex;
  align-items: flex-end;
  position: relative;
  background-color: #fff;
  z-index: 100;
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
  gap: 30rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
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
  height: 90rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 2rpx solid #eee;
  width: calc(100% - 40rpx);
  align-self: stretch;
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
  width: calc(100% - 40rpx);
  align-self: stretch;
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
  top:10rpx;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30rpx;
}

/* 提交按钮 */
.submit-btn {
  height: 90rpx;
  background: linear-gradient(135deg, #4a89dc, #3a7bd5);
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  margin-top: 40rpx;
  position: relative;
  transition: all 0.3s ease;
  align-self: stretch;
}

/* 提交按钮点击效果 */  
.submit-btn:active {
  transform: scale(0.98);
  box-shadow: 0 3rpx 10rpx rgba(74, 111, 227, 0.2);
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

.add-button {
  border: 2rpx dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.add-icon {
  font-size: 80rpx;
  color: #ccc;
  font-weight: 200;
}

.tip-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

/* 附件上传区域 */
.upload-area {
  width: 200rpx;
  height: 200rpx;
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
</style>
