/**
 * service_newbuilt 模块的 getters
 */

export default {
  /**
   * 获取当前模式
   */
  mode: state => state.mode,
  
  /**
   * 获取当前服务ID
   */
  serviceId: state => state.serviceId,
  
  /**
   * 获取是否已编辑状态
   */
  hasEdited: state => state.hasEdited,
  
  /**
   * 获取原始服务数据
   */
  originalService: state => state.originalService,
  
  /**
   * 获取表单数据
   */
  formData: state => state.formData,
  
  /**
   * 获取封面图片URL列表
   */
  coverUrls: state => state.formData.coverUrls,
  
  /**
   * 获取当前选中的服务类型
   */
  selectedServiceType: state => state.formData.selectedServiceType,
  
  /**
   * 获取当前选中的服务类型索引
   */
  selectedServiceTypeIndex: state => state.formData.selectedServiceTypeIndex,
  
  /**
   * 获取服务类型列表
   */
  serviceTypes: state => state.formData.serviceTypes,
  
  /**
   * 获取服务描述
   */
  description: state => state.formData.description,
  
  /**
   * 获取服务价格
   */
  price: state => state.formData.price,
  
  /**
   * 获取一对一课程名称
   */
  serviceName: state => state.formData.serviceName,
  
  /**
   * 获取一对多课程名称
   */
  multiServiceName: state => state.formData.multiServiceName,
  
  /**
   * 获取学习资料名称
   */
  coursequantity: state => state.formData.coursequantity,
  
  /**
   * 获取所有选项数据
   */
  options: state => state.options,
  
  /**
   * 获取节数选项列表
   */
  lessonOptions: state => state.options.lessonOptions,
  
  /**
   * 获取小时选项列表
   */
  hourOptions: state => state.options.hourOptions,
  
  /**
   * 获取分钟选项列表
   */
  minuteOptions: state => state.options.minuteOptions,
  
  /**
   * 获取人数选项列表
   */
  personCountOptions: state => state.options.personCountOptions,
  
  /**
   * 获取当前选中的节数索引
   */
  selectedLessonsIndex: state => state.formData.selectedLessonsIndex,
  
  /**
   * 获取当前选中的小时索引（一对一课程）
   */
  selectedHoursIndex: state => state.formData.selectedHoursIndex,
  
  /**
   * 获取当前选中的分钟索引（一对一课程）
   */
  selectedMinutesIndex: state => state.formData.selectedMinutesIndex,
  
  /**
   * 获取当前选中的小时索引（一对多课程）
   */
  selectedMultiHoursIndex: state => state.formData.selectedMultiHoursIndex,
  
  /**
   * 获取当前选中的分钟索引（一对多课程）
   */
  selectedMultiMinutesIndex: state => state.formData.selectedMultiMinutesIndex,
  
  /**
   * 获取当前选中的人数索引
   */
  selectedPersonCountIndex: state => state.formData.selectedPersonCountIndex,
  
  /**
   * 获取当前选中的节数
   */
  selectedLessons: (state, getters) => {
    return getters.selectedLessonsIndex >= 0 ? 
      state.options.lessonOptions[getters.selectedLessonsIndex] : ''
  },
  
  /**
   * 获取当前选中的小时数（一对一课程）
   */
  selectedHours: (state, getters) => {
    return getters.selectedHoursIndex >= 0 ? 
      state.options.hourOptions[getters.selectedHoursIndex] : ''
  },
  
  /**
   * 获取当前选中的分钟数（一对一课程）
   */
  selectedMinutes: (state, getters) => {
    return getters.selectedMinutesIndex >= 0 ? 
      state.options.minuteOptions[getters.selectedMinutesIndex] : ''
  },
  
  /**
   * 获取当前选中的小时数（一对多课程）
   */
  selectedMultiHours: (state, getters) => {
    return getters.selectedMultiHoursIndex >= 0 ? 
      state.options.hourOptions[getters.selectedMultiHoursIndex] : ''
  },
  
  /**
   * 获取当前选中的分钟数（一对多课程）
   */
  selectedMultiMinutes: (state, getters) => {
    return getters.selectedMultiMinutesIndex >= 0 ? 
      state.options.minuteOptions[getters.selectedMultiMinutesIndex] : ''
  },
  
  /**
   * 获取当前选中的人数
   */
  selectedPersonCount: (state, getters) => {
    return getters.selectedPersonCountIndex >= 0 ? 
      state.options.personCountOptions[getters.selectedPersonCountIndex] : ''
  },
  
  /**
   * 获取表单是否显示时长字段
   */
  showDuration: state => state.showDuration,
  
  /**
   * 获取表单是否显示附件字段
   */
  showAttachment: state => state.showAttachment,
  
  /**
   * 获取表单验证错误
   */
  validationErrors: state => state.validationErrors,
  
  /**
   * 获取提交状态
   */
  isSubmitting: state => state.isSubmitting,
  
  /**
   * 获取提交成功状态
   */
  submitSuccess: state => state.submitSuccess,
  
  /**
   * 获取提交错误
   */
  submitError: state => state.submitError,
  
  /**
   * 获取表单是否有效
   */
  isFormValid: (state, getters) => {
    // 基本验证：检查封面图片
    if (state.formData.coverUrls.length === 0) {
      return false
    }
    
    // 检查服务类型
    if (!state.formData.selectedServiceType) {
      return false
    }
    
    // 根据服务类型进行特定验证
    if (state.formData.selectedServiceType === '一对一课程') {
      if (getters.selectedLessonsIndex === -1) {
        return false
      }
      
      if (getters.selectedHoursIndex === -1 || getters.selectedMinutesIndex === -1) {
        return false
      }
      
      if (!state.formData.serviceName) {
        return false
      }
    } 
    else if (state.formData.selectedServiceType === '一对多课程') {
      if (getters.selectedLessonsIndex === -1) {
        return false
      }
      
      if (getters.selectedMultiHoursIndex === -1 || getters.selectedMultiMinutesIndex === -1) {
        return false
      }
      
      if (!state.formData.multiServiceName) {
        return false
      }
      
      if (getters.selectedPersonCountIndex === -1) {
        return false
      }
    }
    else if (state.formData.selectedServiceType === '学习资料') {
      if (!state.formData.coursequantity) {
        return false
      }
    }
    
    // 检查价格
    if (!state.formData.price) {
      return false
    }
    
    return true
  },
  
  /**
   * 获取完整服务对象（用于提交）
   */
  serviceData: (state, getters) => {
    let serviceData = {}
    
    // 编辑模式下保留原始服务的部分信息
    if (state.mode === 'edit' && state.originalService) {
      // 保留原始ID和部分不变的属性
      serviceData = {
        ...state.originalService,
        // 这些字段将被覆盖
        name: state.formData.selectedServiceType,
        price: state.formData.price.startsWith('¥') ? state.formData.price : '¥' + state.formData.price,
        description: state.formData.description || `这是一个${state.formData.selectedServiceType}服务`,
        imageUrls: state.formData.coverUrls,
        imageUrl: state.formData.coverUrls[0] || ''
      }
    } else {
      // 新建模式
      serviceData = {
        id: Date.now().toString(), // 生成新ID
        name: state.formData.selectedServiceType,
        price: state.formData.price.startsWith('¥') ? state.formData.price : '¥' + state.formData.price,
        description: state.formData.description || `这是一个${state.formData.selectedServiceType}服务`,
        checked: false,
        imageUrls: state.formData.coverUrls,
        imageUrl: state.formData.coverUrls[0] || '',
        createTime: new Date().toISOString().split('T')[0],
        updateTime: new Date().toISOString().split('T')[0],
        status: 'active'
      }
    }
    
    // 为一对一课程添加特殊字段
    if (state.formData.selectedServiceType === '一对一课程') {
      serviceData.serviceName = state.formData.serviceName
      serviceData.lessons = getters.selectedLessons
      serviceData.totalDuration = `${getters.selectedHours}小时${getters.selectedMinutes}分钟`
      
      // 添加类型信息
      serviceData.type = {
        typename: '一对一课程',
        coursenum: parseInt(getters.selectedLessons),
        fulllength: {
          hours: `${getters.selectedHours}小时`,
          minutes: `${getters.selectedMinutes}分钟`
        }
      }
    } 
    // 为一对多课程添加特殊字段
    else if (state.formData.selectedServiceType === '一对多课程') {
      serviceData.serviceName = state.formData.multiServiceName
      serviceData.lessons = getters.selectedLessons
      serviceData.totalDuration = `${getters.selectedMultiHours}小时${getters.selectedMultiMinutes}分钟`
      serviceData.personCount = getters.selectedPersonCount
      
      // 添加类型信息
      serviceData.type = {
        typename: '一对多课程',
        coursenum: parseInt(getters.selectedLessons),
        fulllength: {
          hours: `${getters.selectedMultiHours}小时`,
          minutes: `${getters.selectedMultiMinutes}分钟`
        },
        studentnum: parseInt(getters.selectedPersonCount)
      }
    } 
    // 其他服务类型
    else if (state.formData.selectedServiceType === '学习资料') {
      serviceData.coursequantity = state.formData.coursequantity
      serviceData.serviceName = state.formData.coursequantity // 使用输入的名称作为serviceName
      
      // 添加类型信息
      serviceData.type = {
        typename: '学习资料',
        fileLink: 'https://www.baidu.com' // 示例链接，实际应该由用户上传文件后获取
      }
    }
    
    // 更新时间戳
    serviceData.updateTime = new Date().toISOString().split('T')[0]
    
    return serviceData
  }
}
