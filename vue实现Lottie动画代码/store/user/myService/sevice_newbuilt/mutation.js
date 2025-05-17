/**
 * service_newbuilt 模块的 mutations
 */

import Vue from 'vue'
import getDefaultState from './state'

export default {
  /**
   * 重置状态
   */
  RESET_STATE(state) {
    Object.assign(state, getDefaultState())
  },

  /**
   * 设置模式（新增/编辑）
   */
  SET_MODE(state, mode) {
    state.mode = mode
  },

  /**
   * 设置服务ID
   */
  SET_SERVICE_ID(state, id) {
    state.serviceId = id
  },

  /**
   * 设置编辑状态
   */
  SET_HAS_EDITED(state, status) {
    state.hasEdited = status
  },

  /**
   * 设置原始服务数据
   */
  SET_ORIGINAL_SERVICE(state, service) {
    state.originalService = service
  },

  /**
   * 设置封面图片
   */
  SET_COVER_URLS(state, urls) {
    state.formData.coverUrls = urls
  },

  /**
   * 添加封面图片
   */
  ADD_COVER_URL(state, url) {
    state.formData.coverUrls.push(url)
    state.hasEdited = true
  },

  /**
   * 删除封面图片
   */
  REMOVE_COVER_URL(state, index) {
    state.formData.coverUrls.splice(index, 1)
    state.hasEdited = true
  },

  /**
   * 设置服务类型
   */
  SET_SERVICE_TYPE(state, { type, index }) {
    state.formData.selectedServiceType = type
    state.formData.selectedServiceTypeIndex = index
    state.hasEdited = true
  },

  /**
   * 设置服务描述
   */
  SET_DESCRIPTION(state, description) {
    state.formData.description = description
    state.hasEdited = true
  },

  /**
   * 设置价格
   */
  SET_PRICE(state, price) {
    state.formData.price = price
    state.hasEdited = true
  },

  /**
   * 设置一对一课程名称
   */
  SET_SERVICE_NAME(state, name) {
    state.formData.serviceName = name
    state.hasEdited = true
  },

  /**
   * 设置一对一课程节数索引
   */
  SET_LESSONS_INDEX(state, index) {
    state.formData.selectedLessonsIndex = index
    state.hasEdited = true
  },

  /**
   * 设置一对一课程时长（小时）索引
   */
  SET_HOURS_INDEX(state, index) {
    state.formData.selectedHoursIndex = index
    state.hasEdited = true
  },

  /**
   * 设置一对一课程时长（分钟）索引
   */
  SET_MINUTES_INDEX(state, index) {
    state.formData.selectedMinutesIndex = index
    state.hasEdited = true
  },

  /**
   * 设置一对多课程名称
   */
  SET_MULTI_SERVICE_NAME(state, name) {
    state.formData.multiServiceName = name
    state.hasEdited = true
  },

  /**
   * 设置一对多课程时长（小时）索引
   */
  SET_MULTI_HOURS_INDEX(state, index) {
    state.formData.selectedMultiHoursIndex = index
    state.hasEdited = true
  },

  /**
   * 设置一对多课程时长（分钟）索引
   */
  SET_MULTI_MINUTES_INDEX(state, index) {
    state.formData.selectedMultiMinutesIndex = index
    state.hasEdited = true
  },

  /**
   * 设置一对多课程人数索引
   */
  SET_PERSON_COUNT_INDEX(state, index) {
    state.formData.selectedPersonCountIndex = index
    state.hasEdited = true
  },

  /**
   * 设置学习资料名称
   */
  SET_COURSE_QUANTITY(state, quantity) {
    state.formData.coursequantity = quantity
    state.hasEdited = true
  },

  /**
   * 更新表单字段显示
   */
  UPDATE_FORM_FIELDS(state) {
    // 根据服务类型显示或隐藏某些表单项
    if (state.formData.selectedServiceType === '学习资料') {
      state.showDuration = false
      state.showAttachment = true
    } else {
      state.showDuration = true
      state.showAttachment = state.formData.selectedServiceType === '学习资料'
    }
  },

  /**
   * 设置提交状态
   */
  SET_SUBMITTING(state, status) {
    state.isSubmitting = status
  },

  /**
   * 设置提交成功
   */
  SET_SUBMIT_SUCCESS(state, status) {
    state.submitSuccess = status
  },

  /**
   * 设置提交错误
   */
  SET_SUBMIT_ERROR(state, error) {
    state.submitError = error
  },

  /**
   * 设置表单验证错误
   */
  SET_VALIDATION_ERROR(state, { field, message }) {
    Vue.set(state.validationErrors, field, message)
  },

  /**
   * 清除表单验证错误
   */
  CLEAR_VALIDATION_ERRORS(state) {
    for (let key in state.validationErrors) {
      Vue.set(state.validationErrors, key, '')
    }
  },

  /**
   * 填充表单数据
   */
  FILL_FORM_DATA(state, serviceData) {
    // 设置封面图片
    state.formData.coverUrls = serviceData.imageUrls || (serviceData.imageUrl ? [serviceData.imageUrl] : [])
    
    // 设置服务类型
    if (serviceData.type && serviceData.type.typename) {
      state.formData.selectedServiceType = serviceData.type.typename
      state.formData.selectedServiceTypeIndex = state.formData.serviceTypes.findIndex(
        type => type === serviceData.type.typename
      )
    } else {
      state.formData.selectedServiceType = serviceData.name || ''
      state.formData.selectedServiceTypeIndex = state.formData.serviceTypes.findIndex(
        type => type === serviceData.name
      )
    }
    
    // 设置价格（去掉价格前面的¥符号）
    state.formData.price = serviceData.price ? serviceData.price.replace(/[¥￥]/g, '') : ''
    
    // 设置描述
    state.formData.description = serviceData.description || ''
    
    // 根据服务类型设置不同的字段
    if (state.formData.selectedServiceType === '一对一课程') {
      state.formData.serviceName = serviceData.serviceName || serviceData.name || ''
      
      // 设置节数
      if (serviceData.lessons) {
        state.formData.selectedLessonsIndex = state.options.lessonOptions.findIndex(
          l => l === serviceData.lessons.toString()
        )
      } else if (serviceData.type && serviceData.type.coursenum) {
        state.formData.selectedLessonsIndex = state.options.lessonOptions.findIndex(
          l => parseInt(l) === serviceData.type.coursenum
        )
      }
      
      // 解析总时长的小时和分钟
      if (serviceData.totalDuration) {
        const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
        if (match) {
          state.formData.selectedHoursIndex = state.options.hourOptions.findIndex(
            h => h === match[1]
          )
          state.formData.selectedMinutesIndex = state.options.minuteOptions.findIndex(
            m => m === match[2]
          )
        }
      } else if (serviceData.type && serviceData.type.fulllength) {
        const hours = serviceData.type.fulllength.hours || ''
        const minutes = serviceData.type.fulllength.minutes || ''
        
        const hoursMatch = hours.match(/(\d+)/)
        const minutesMatch = minutes.match(/(\d+)/)
        
        if (hoursMatch) {
          state.formData.selectedHoursIndex = state.options.hourOptions.findIndex(
            h => h === hoursMatch[1]
          )
        }
        
        if (minutesMatch) {
          state.formData.selectedMinutesIndex = state.options.minuteOptions.findIndex(
            m => m === minutesMatch[1]
          )
        }
      }
    } else if (state.formData.selectedServiceType === '一对多课程') {
      state.formData.multiServiceName = serviceData.serviceName || serviceData.name || ''
      
      // 设置课时
      if (serviceData.lessons) {
        state.formData.selectedLessonsIndex = state.options.lessonOptions.findIndex(
          l => l === serviceData.lessons.toString()
        )
      } else if (serviceData.type && serviceData.type.coursenum) {
        state.formData.selectedLessonsIndex = state.options.lessonOptions.findIndex(
          l => parseInt(l) === serviceData.type.coursenum
        )
      }
      
      // 解析总时长的小时和分钟
      if (serviceData.totalDuration) {
        const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/)
        if (match) {
          state.formData.selectedMultiHoursIndex = state.options.hourOptions.findIndex(
            h => h === match[1]
          )
          state.formData.selectedMultiMinutesIndex = state.options.minuteOptions.findIndex(
            m => m === match[2]
          )
        }
      } else if (serviceData.type && serviceData.type.fulllength) {
        const hours = serviceData.type.fulllength.hours || ''
        const minutes = serviceData.type.fulllength.minutes || ''
        
        const hoursMatch = hours.match(/(\d+)/)
        const minutesMatch = minutes.match(/(\d+)/)
        
        if (hoursMatch) {
          state.formData.selectedMultiHoursIndex = state.options.hourOptions.findIndex(
            h => h === hoursMatch[1]
          )
        }
        
        if (minutesMatch) {
          state.formData.selectedMultiMinutesIndex = state.options.minuteOptions.findIndex(
            m => m === minutesMatch[1]
          )
        }
      }
      
      // 设置课程人数
      if (serviceData.personCount) {
        state.formData.selectedPersonCountIndex = state.options.personCountOptions.findIndex(
          p => p === serviceData.personCount.toString()
        )
      } else if (serviceData.type && serviceData.type.studentnum) {
        state.formData.selectedPersonCountIndex = state.options.personCountOptions.findIndex(
          p => parseInt(p) === serviceData.type.studentnum
        )
      }
    } else if (state.formData.selectedServiceType === '学习资料') {
      state.formData.coursequantity = serviceData.coursequantity || serviceData.name || ''
    }
  }
}
