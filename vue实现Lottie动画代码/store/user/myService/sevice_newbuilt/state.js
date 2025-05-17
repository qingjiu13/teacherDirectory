/**
 * service_newbuilt 模块的状态
 */

const getDefaultState = () => {
  return {
    // 当前模式：'add' 或 'edit'
    mode: 'add',
    
    // 当前编辑的服务ID
    serviceId: '',
    
    // 是否已经编辑过表单
    hasEdited: false,
    
    // 原始服务数据（编辑模式下使用）
    originalService: null,
    
    // 表单数据
    formData: {
      // 封面图片
      coverUrls: [],
      
      // 服务类型相关
      selectedServiceType: '',
      selectedServiceTypeIndex: -1,
      serviceTypes: ['一对一课程', '一对多课程', '学习资料'],
      
      // 服务介绍和价格
      description: '',
      price: '',
      
      // 一对一课程相关
      serviceName: '',
      selectedLessonsIndex: -1,
      selectedHoursIndex: -1,
      selectedMinutesIndex: -1,
      
      // 一对多课程相关
      multiServiceName: '',
      selectedMultiHoursIndex: -1,
      selectedMultiMinutesIndex: -1,
      selectedPersonCountIndex: -1,
      
      // 学习资料相关
      coursequantity: '',
    },
    
    // 选项数据
    options: {
      lessonOptions: ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20'],
      hourOptions: ['1', '2', '4', '6', '8', '10', '12', '24', '48', '60', '120'],
      minuteOptions: ['0', '15', '30', '45'],
      personCountOptions: ['2', '4', '6', '8', '10', '15', '20', '30'],
    },
    
    // 辅助状态
    showDuration: false,
    showAttachment: false,
    
    // 保存/提交状态
    isSubmitting: false,
    submitSuccess: false,
    submitError: null,
    
    // 表单验证错误
    validationErrors: {
      serviceName: '',
      price: '',
      description: '',
      coursequantity: '',
    }
  }
}

export default getDefaultState()
