/**
 * service_newbuilt 模块的 actions
 */

export default {
  /**
   * 初始化页面数据
   */
  initPageData({ commit, dispatch }, options) {
    // 重置状态
    commit('RESET_STATE')
    
    // 如果有选项参数
    if (options) {
      // 设置模式
      if (options.mode) {
        commit('SET_MODE', options.mode)
        
        // 如果是编辑模式且有ID
        if (options.mode === 'edit' && options.id) {
          commit('SET_SERVICE_ID', options.id)
          
          // 加载待编辑的服务数据
          dispatch('loadEditingService')
        }
      }
    }
    
    // 更新表单字段显示
    commit('UPDATE_FORM_FIELDS')
  },
  
  /**
   * 加载待编辑的服务数据
   */
  loadEditingService({ commit, state }) {
    try {
      // 首先尝试从全局数据获取
      if (getApp().globalData && getApp().globalData.editingService) {
        const editingService = getApp().globalData.editingService
        
        // 检查ID是否匹配
        if (editingService.id.toString() === state.serviceId.toString()) {
          // 设置原始服务数据
          commit('SET_ORIGINAL_SERVICE', editingService)
          
          // 使用服务数据填充表单
          commit('FILL_FORM_DATA', editingService)
          
          // 更新表单字段显示
          commit('UPDATE_FORM_FIELDS')
          
          return Promise.resolve(editingService)
        }
      }
      
      // 如果全局数据不存在或ID不匹配，尝试从本地存储加载
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key: 'services',
          success: (res) => {
            if (res.data) {
              try {
                const services = JSON.parse(res.data)
                const service = services.find(s => s.id.toString() === state.serviceId.toString())
                
                if (service) {
                  // 设置原始服务数据
                  commit('SET_ORIGINAL_SERVICE', service)
                  
                  // 使用服务数据填充表单
                  commit('FILL_FORM_DATA', service)
                  
                  // 更新表单字段显示
                  commit('UPDATE_FORM_FIELDS')
                  
                  resolve(service)
                } else {
                  // 找不到对应服务数据
                  const error = new Error('找不到服务数据')
                  
                  // 设置错误信息
                  commit('SET_SUBMIT_ERROR', error.message)
                  
                  reject(error)
                  
                  // 显示提示
                  uni.showToast({
                    title: '找不到服务数据',
                    icon: 'none'
                  })
                }
              } catch (error) {
                // 解析错误
                commit('SET_SUBMIT_ERROR', error.message)
                
                reject(error)
                
                // 显示提示
                uni.showToast({
                  title: '加载数据失败',
                  icon: 'none'
                })
              }
            } else {
              const error = new Error('本地存储中没有服务数据')
              
              // 设置错误信息
              commit('SET_SUBMIT_ERROR', error.message)
              
              reject(error)
              
              // 显示提示
              uni.showToast({
                title: '找不到服务数据',
                icon: 'none'
              })
            }
          },
          fail: (error) => {
            // 设置错误信息
            commit('SET_SUBMIT_ERROR', error.message || '加载失败')
            
            reject(error)
            
            // 显示提示
            uni.showToast({
              title: '加载数据失败',
              icon: 'none'
            })
          }
        })
      })
    } catch (error) {
      // 设置错误信息
      commit('SET_SUBMIT_ERROR', error.message)
      
      return Promise.reject(error)
    }
  },
  
  /**
   * 选择服务类型
   */
  selectServiceType({ commit }, index) {
    const serviceTypes = ['一对一课程', '一对多课程', '学习资料']
    
    // 设置服务类型
    commit('SET_SERVICE_TYPE', {
      type: serviceTypes[index],
      index
    })
    
    // 更新表单字段显示
    commit('UPDATE_FORM_FIELDS')
  },
  
  /**
   * 选择课程节数
   */
  selectLessons({ commit }, index) {
    commit('SET_LESSONS_INDEX', index)
  },
  
  /**
   * 选择一对一课程时长（小时）
   */
  selectHours({ commit }, index) {
    commit('SET_HOURS_INDEX', index)
  },
  
  /**
   * 选择一对一课程时长（分钟）
   */
  selectMinutes({ commit }, index) {
    commit('SET_MINUTES_INDEX', index)
  },
  
  /**
   * 选择一对多课程时长（小时）
   */
  selectMultiHours({ commit }, index) {
    commit('SET_MULTI_HOURS_INDEX', index)
  },
  
  /**
   * 选择一对多课程时长（分钟）
   */
  selectMultiMinutes({ commit }, index) {
    commit('SET_MULTI_MINUTES_INDEX', index)
  },
  
  /**
   * 选择一对多课程人数
   */
  selectPersonCount({ commit }, index) {
    commit('SET_PERSON_COUNT_INDEX', index)
  },
  
  /**
   * 设置服务名称
   */
  setServiceName({ commit }, name) {
    commit('SET_SERVICE_NAME', name)
  },
  
  /**
   * 设置一对多课程名称
   */
  setMultiServiceName({ commit }, name) {
    commit('SET_MULTI_SERVICE_NAME', name)
  },
  
  /**
   * 设置学习资料名称
   */
  setCourseQuantity({ commit }, quantity) {
    commit('SET_COURSE_QUANTITY', quantity)
  },
  
  /**
   * 设置描述
   */
  setDescription({ commit }, description) {
    commit('SET_DESCRIPTION', description)
  },
  
  /**
   * 设置价格
   */
  setPrice({ commit }, price) {
    commit('SET_PRICE', price)
  },
  
  /**
   * 选择封面图片
   */
  chooseCover({ commit, state }) {
    const remainCount = 9 - state.formData.coverUrls.length
    
    if (remainCount <= 0) {
      uni.showToast({
        title: '最多只能上传9张图片',
        icon: 'none'
      })
      return Promise.reject(new Error('最多只能上传9张图片'))
    }
    
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: remainCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // 添加新的图片URL
          res.tempFilePaths.forEach(url => {
            commit('ADD_COVER_URL', url)
          })
          
          resolve(res.tempFilePaths)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },
  
  /**
   * 删除封面图片
   */
  deleteCover({ commit }, index) {
    commit('REMOVE_COVER_URL', index)
  },
  
  /**
   * 选择文件（学习资料）
   */
  chooseFile({ commit }) {
    return new Promise((resolve, reject) => {
      uni.chooseFile({
        count: 1,
        success: (res) => {
          // 这里可以保存文件信息
          resolve(res.tempFilePaths)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },
  
  /**
   * 验证表单
   */
  validateForm({ commit, getters }) {
    // 清除之前的验证错误
    commit('CLEAR_VALIDATION_ERRORS')
    
    // 基本验证：检查封面图片
    if (getters.coverUrls.length === 0) {
      commit('SET_VALIDATION_ERROR', {
        field: 'coverUrls',
        message: '请上传封面图片'
      })
      
      return false
    }
    
    // 检查服务类型
    if (!getters.selectedServiceType) {
      commit('SET_VALIDATION_ERROR', {
        field: 'selectedServiceType',
        message: '请选择服务类型'
      })
      
      return false
    }
    
    // 根据服务类型进行特定验证
    if (getters.selectedServiceType === '一对一课程') {
      if (getters.selectedLessonsIndex === -1) {
        commit('SET_VALIDATION_ERROR', {
          field: 'selectedLessonsIndex',
          message: '请选择课程节数'
        })
        
        return false
      }
      
      if (getters.selectedHoursIndex === -1 || getters.selectedMinutesIndex === -1) {
        commit('SET_VALIDATION_ERROR', {
          field: 'selectedHoursIndex',
          message: '请选择课程时长'
        })
        
        return false
      }
      
      if (!getters.serviceName) {
        commit('SET_VALIDATION_ERROR', {
          field: 'serviceName',
          message: '请填写服务名称'
        })
        
        return false
      }
    } 
    else if (getters.selectedServiceType === '一对多课程') {
      if (getters.selectedLessonsIndex === -1) {
        commit('SET_VALIDATION_ERROR', {
          field: 'selectedLessonsIndex',
          message: '请选择课程节数'
        })
        
        return false
      }
      
      if (getters.selectedMultiHoursIndex === -1 || getters.selectedMultiMinutesIndex === -1) {
        commit('SET_VALIDATION_ERROR', {
          field: 'selectedMultiHoursIndex',
          message: '请选择课程时长'
        })
        
        return false
      }
      
      if (!getters.multiServiceName) {
        commit('SET_VALIDATION_ERROR', {
          field: 'multiServiceName',
          message: '请填写服务名称'
        })
        
        return false
      }
      
      if (getters.selectedPersonCountIndex === -1) {
        commit('SET_VALIDATION_ERROR', {
          field: 'selectedPersonCountIndex',
          message: '请选择课程人数'
        })
        
        return false
      }
    }
    else if (getters.selectedServiceType === '学习资料') {
      if (!getters.coursequantity) {
        commit('SET_VALIDATION_ERROR', {
          field: 'coursequantity',
          message: '请填写服务名称'
        })
        
        return false
      }
    }
    
    // 检查价格
    if (!getters.price) {
      commit('SET_VALIDATION_ERROR', {
        field: 'price',
        message: '请填写服务价格'
      })
      
      return false
    }
    
    return true
  },
  
  /**
   * 提交表单
   */
  submitForm({ commit, state, getters, dispatch }) {
    // 首先验证表单
    const isValid = dispatch('validateForm')
    
    if (!isValid) {
      return Promise.reject(new Error('表单验证失败'))
    }
    
    // 设置提交状态
    commit('SET_SUBMITTING', true)
    
    // 清除提交错误
    commit('SET_SUBMIT_ERROR', null)
    
    return new Promise((resolve, reject) => {
      try {
        // 显示加载动画
        uni.showLoading({
          title: '提交中...'
        })
        
        // 构建服务对象
        const serviceData = getters.serviceData
        
        // 根据模式执行不同操作
        if (state.mode === 'edit') {
          // 更新现有服务
          dispatch('updateExistingService', serviceData)
            .then(() => {
              resolve(serviceData)
            })
            .catch(error => {
              reject(error)
            })
            .finally(() => {
              // 设置提交状态
              commit('SET_SUBMITTING', false)
              
              // 隐藏加载动画
              uni.hideLoading()
            })
        } else {
          // 添加新服务
          dispatch('addNewService', serviceData)
            .then(() => {
              resolve(serviceData)
            })
            .catch(error => {
              reject(error)
            })
            .finally(() => {
              // 设置提交状态
              commit('SET_SUBMITTING', false)
              
              // 隐藏加载动画
              uni.hideLoading()
            })
        }
      } catch (error) {
        // 设置提交状态
        commit('SET_SUBMITTING', false)
        
        // 设置提交错误
        commit('SET_SUBMIT_ERROR', error.message)
        
        // 隐藏加载动画
        uni.hideLoading()
        
        // 显示错误提示
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
        
        reject(error)
      }
    })
  },
  
  /**
   * 新增服务
   */
  addNewService({ commit }, newService) {
    return new Promise((resolve, reject) => {
      try {
        // 获取之前的服务列表（如果存在）
        uni.getStorage({
          key: 'services',
          success: (res) => {
            let services = []
            
            if (res.data) {
              services = JSON.parse(res.data)
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
            uni.setStorage({
              key: 'services',
              data: JSON.stringify(services),
              success: () => {
                // 设置全局状态
                getApp().globalData = getApp().globalData || {}
                getApp().globalData.newServiceAdded = true
                getApp().globalData.newService = newService
                
                // 设置提交成功状态
                commit('SET_SUBMIT_SUCCESS', true)
                
                // 显示成功提示
                uni.showToast({
                  title: '提交成功',
                  icon: 'success'
                })
                
                // 设置为未编辑状态
                commit('SET_HAS_EDITED', false)
                
                resolve(newService)
              },
              fail: (error) => {
                // 设置提交错误
                commit('SET_SUBMIT_ERROR', error.errMsg || '保存失败')
                
                // 显示错误提示
                uni.showToast({
                  title: '保存失败，请重试',
                  icon: 'none'
                })
                
                reject(error)
              }
            })
          },
          fail: (error) => {
            // 创建新的服务列表
            const services = [newService]
            
            // 保存服务列表
            uni.setStorage({
              key: 'services',
              data: JSON.stringify(services),
              success: () => {
                // 设置全局状态
                getApp().globalData = getApp().globalData || {}
                getApp().globalData.newServiceAdded = true
                getApp().globalData.newService = newService
                
                // 设置提交成功状态
                commit('SET_SUBMIT_SUCCESS', true)
                
                // 显示成功提示
                uni.showToast({
                  title: '提交成功',
                  icon: 'success'
                })
                
                // 设置为未编辑状态
                commit('SET_HAS_EDITED', false)
                
                resolve(newService)
              },
              fail: (error) => {
                // 设置提交错误
                commit('SET_SUBMIT_ERROR', error.errMsg || '保存失败')
                
                // 显示错误提示
                uni.showToast({
                  title: '保存失败，请重试',
                  icon: 'none'
                })
                
                reject(error)
              }
            })
          }
        })
      } catch (error) {
        // 设置提交错误
        commit('SET_SUBMIT_ERROR', error.message)
        
        // 显示错误提示
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
        
        reject(error)
      }
    })
  },
  
  /**
   * 更新现有服务
   */
  updateExistingService({ commit, state }, updatedService) {
    return new Promise((resolve, reject) => {
      try {
        // 获取服务列表
        uni.getStorage({
          key: 'services',
          success: (res) => {
            let services = []
            
            if (res.data) {
              services = JSON.parse(res.data)
            }
            
            // 查找并更新对应的服务
            const index = services.findIndex(s => s.id == state.serviceId)
            
            if (index !== -1) {
              services[index] = updatedService
            } else {
              // 如果找不到，则添加为新服务
              services.push(updatedService)
            }
            
            // 保存更新后的列表
            uni.setStorage({
              key: 'services',
              data: JSON.stringify(services),
              success: () => {
                // 设置全局状态
                getApp().globalData = getApp().globalData || {}
                getApp().globalData.serviceEdited = true
                getApp().globalData.editedService = updatedService
                
                // 设置提交成功状态
                commit('SET_SUBMIT_SUCCESS', true)
                
                // 显示成功提示
                uni.showToast({
                  title: '更新成功',
                  icon: 'success'
                })
                
                // 设置为未编辑状态
                commit('SET_HAS_EDITED', false)
                
                resolve(updatedService)
              },
              fail: (error) => {
                // 设置提交错误
                commit('SET_SUBMIT_ERROR', error.errMsg || '更新失败')
                
                // 显示错误提示
                uni.showToast({
                  title: '更新失败，请重试',
                  icon: 'none'
                })
                
                reject(error)
              }
            })
          },
          fail: (error) => {
            // 设置提交错误
            commit('SET_SUBMIT_ERROR', error.errMsg || '获取数据失败')
            
            // 显示错误提示
            uni.showToast({
              title: '更新失败，请重试',
              icon: 'none'
            })
            
            reject(error)
          }
        })
      } catch (error) {
        // 设置提交错误
        commit('SET_SUBMIT_ERROR', error.message)
        
        // 显示错误提示
        uni.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        })
        
        reject(error)
      }
    })
  },
  
  /**
   * 返回上一页
   */
  goBack({ state, dispatch }) {
    // 如果表单被编辑过，显示提示弹窗
    if (state.hasEdited) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '提示',
          content: '是否保存已编辑的内容？',
          cancelText: '不保存',
          confirmText: '保存',
          success: (res) => {
            if (res.confirm) {
              // 用户选择保存
              dispatch('submitForm')
                .then(() => {
                  // 返回上一页
                  setTimeout(() => {
                    uni.navigateBack()
                    resolve()
                  }, 1500)
                })
                .catch((error) => {
                  reject(error)
                })
            } else {
              // 用户选择不保存，直接返回
              uni.navigateBack()
              resolve()
            }
          },
          fail: (error) => {
            reject(error)
          }
        })
      })
    } else {
      // 表单未编辑过，直接返回
      return new Promise((resolve) => {
        uni.navigateBack()
        resolve()
      })
    }
  }
} 