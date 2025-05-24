<template>
  <view class="service-container">
    <!-- 导入Header组件作为顶部导航栏 -->
    <Header class="header-container" :title="'我的服务'" @back="goBack" />

    <!-- 服务卡片区域 -->
    <view class="service-list">
      <!-- 当没有服务数据时显示提示 -->
      <view class="empty-tip" v-if="services.length === 0">
        <view class="empty-card-outer">
          <view class="empty-card-outer-gradient">
            <view class="empty-card">
              <view class="empty-title">暂无服务类型</view>
              <view class="empty-subtitle">点击右下角添加按钮新增服务</view>
            </view>
          </view>
        </view>
      </view>
      
      <view 
        v-for="(service, index) in services" 
        :key="service.id" 
        class="service-card" 
        :class="{ 'active-card': service.checked }"
        @click="showServiceDetail(index)"
      >
        <view class="service-card-outer">
          <view class="service-card-outer-gradient">
            <view class="service-card-inner">
              <view class="service-info">
                <view class="service-thumb" :style="{ backgroundImage: `url(${getServiceCover(service)})`, backgroundSize: 'cover' }"></view>
                <view class="service-details">
                  <view class="service-name">{{ service.serviceName || service.name }}</view>
                  <view class="service-price">{{ service.price }}</view>
                </view>
                <view class="action-buttons" @click.stop>
                  <view class="edit-btn" @click.stop="editService(index)">
                    <image src='/static/image/style_for_pages/edit_botton.png' mode="aspectFit" class="action-icon"></image>
                  </view>
                  <view class="delete-btn" @click.stop="deleteService(index)">
                    <image src='/static/image/style_for_pages/delete_botton.png' mode="aspectFit" class="action-icon"></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 服务详情展示 -->
      <view class="service-detail-card" v-if="selectedService" :class="{'detail-card-expanded': isDetailExpanded}">
        <view class="detail-close-btn" @click="hideServiceDetail">×</view>
        <view class="detail-thumb" :style="{ backgroundImage: `url(${getServiceCover(selectedService)})`, backgroundSize: 'cover' }"></view>
        <view class="detail-info">
          <view class="detail-name">{{ selectedService.serviceName || selectedService.name }}</view>
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
    
    <!-- 新增按钮 -->
    <view class="add-button" @click="handleAddService">+</view>
    
    <!-- 半透明背景遮罩 -->
    <view class="detail-overlay" v-if="overlayVisible" @click="hideServiceDetail"></view>

  </view>
</template>

<script>
import Header from '@/components/navigationTitleBar/header'
import { Navigator } from '@/router/Router.js'
export default {
  components: {
    Header
  },
  data() {
    return {
      defaultCoverImage: '/static/image/service/default_cover.jpg', // 默认封面图片
      services: [],
      selectedService: null,
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
        
        // 从本地存储加载最新的服务列表
        this.loadServices()
        
        // 选中这个新服务
        const existingServiceIndex = this.services.findIndex(s => s.id === newService.id)
        if (existingServiceIndex === -1) {
          // 如果服务列表中没有这个服务，才添加它
          // 将新服务添加到列表
          this.services.unshift(newService)
          
          // 保存到本地存储
          this.saveServices()
        }
        
        // 选中这个新服务
        this.selectedService = newService
        
        // 显示提示
        uni.showToast({
          title: '新服务已添加',
          icon: 'success'
        })
        
        // 清除临时存储的新服务
        getApp().globalData.newService = null
      } else {
        // 从本地存储加载服务列表
        this.loadServices()
      }
    } else {
      // 从本地存储加载服务列表
      this.loadServices()
    }
  },
  onLoad() {
    // 监听serviceAdded事件
    uni.$on('serviceAdded', this.handleServiceAdded)
    // 监听serviceEdited事件
    uni.$on('serviceEdited', this.handleServiceEdited)
    
    // 初始化全局数据对象
    getApp().globalData = getApp().globalData || {}
  },
  onUnload() {
    // 移除事件监听
    uni.$off('serviceAdded', this.handleServiceAdded)
    uni.$off('serviceEdited', this.handleServiceEdited)
  },
  methods: {
    goBack() {
      Navigator.toMine()
    },
    toggleService(index) {
      this.services[index].checked = !this.services[index].checked
    },
    editService(index) {
      try {
        // 显示加载提示
        uni.showLoading({
          title: '加载中...'
        })
        
        const currentService = this.services[index]
        console.log('准备编辑服务:', currentService)
        
        // 将当前服务数据存储到全局状态，方便编辑页面获取
        getApp().globalData = getApp().globalData || {}
        getApp().globalData.editingService = JSON.parse(JSON.stringify(currentService))
        
        // 延迟模拟网络请求
        setTimeout(() => {
          // 隐藏加载提示
          uni.hideLoading()
          
          // 跳转到编辑服务页面
          uni.navigateTo({
            url: './service_newbuilt?mode=edit&id=' + currentService.id,
            success: () => {
              console.log('跳转到编辑页面成功')
            },
            fail: (err) => {
              console.error('跳转失败：', err)
              uni.showToast({
                title: '跳转失败，请重试',
                icon: 'none'
              })
            }
          })
        }, 500)
      } catch (error) {
        uni.hideLoading()
        console.error('编辑服务出错：', error)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      }
    },
    deleteService(index) {
      // 获取要删除的服务ID，用于后续比较
      const serviceToDeleteId = this.services[index].id;
      
      // 显示确认对话框
      uni.showModal({
        title: '确认删除',
        content: '确定要删除此服务吗？此操作无法撤销。',
        confirmText: '确认删除',
        confirmColor: '#ff4d4f',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            try {
              // 显示加载提示
              uni.showLoading({
                title: '删除中...'
              })
              
              // 延迟模拟网络请求
              setTimeout(() => {
                // 隐藏加载提示
                uni.hideLoading()
                
                // 如果删除的是当前选中的服务，先隐藏详情
                if (this.selectedService && this.selectedService.id === serviceToDeleteId) {
                  // 隐藏详情面板
                  this.isDetailExpanded = false;
                  this.overlayVisible = false;
                  this.selectedService = null;
                }
                
                // 删除当前服务
                this.services.splice(index, 1);
                
                // 更新本地存储
                this.saveServices();
                
                // 显示成功提示
                uni.showToast({
                  title: '服务已删除',
                  icon: 'success'
                });
              }, 500)
            } catch (error) {
              uni.hideLoading()
              console.error('删除服务出错：', error);
              uni.showToast({
                title: '删除失败，请重试',
                icon: 'none'
              });
            }
          }
          // 用户取消删除，不做任何操作
        }
      });
    },
    handleAddService() {
      // 显示加载提示
      uni.showLoading({
        title: '加载中...'
      })
      
      // 清除全局状态中的编辑数据
      if (getApp().globalData) {
        getApp().globalData.editingService = null
      }
      
      // 延迟执行，模拟网络请求
      setTimeout(() => {
        // 隐藏加载提示
        uni.hideLoading()
        
        // 跳转到新建服务页面（修复路径）
        uni.navigateTo({
          url: './service_newbuilt',
          fail: (err) => {
            console.error('跳转失败：', err)
            uni.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            })
          }
        })
      }, 300)
    },
    // 处理新添加的服务
    handleServiceAdded(newService) {
      // 检查价格格式
      if (newService.price && !newService.price.startsWith('¥')) {
        newService.price = '¥' + newService.price
      }
      
      // 检查服务是否已存在于列表中
      const existingIndex = this.services.findIndex(service => service.id === newService.id)
      if (existingIndex !== -1) {
        // 如果已存在，则更新而不是添加
        this.services[existingIndex] = newService
      } else {
        // 添加到服务列表的最前面
        this.services.unshift(newService)
      }
      
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
          // 如果有存储的服务数据，使用存储的数据
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
      // 确保索引在有效范围内
      if (index >= 0 && index < this.services.length) {
        // 设置选中的服务
        this.selectedService = this.services[index];
        
        // 先显示遮罩层
        this.overlayVisible = true;
        
        // 延迟一帧后显示详情卡片，确保动画效果
        setTimeout(() => {
          this.isDetailExpanded = true;
        }, 20);
      }
    },
    hideServiceDetail() {
      // 先隐藏详情卡片
      this.isDetailExpanded = false
      
      // 动画结束后隐藏遮罩层
      setTimeout(() => {
        this.overlayVisible = false
      }, 300)
    },
    // 服务卡片中使用封面图片或默认图片
    getServiceCover(service) {
      return service.imageUrl || (service.imageUrls && service.imageUrls.length > 0 ? service.imageUrls[0] : this.defaultCoverImage);
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
/* 服务容器 */
.service-container {
  padding: 30rpx;
  background: linear-gradient(135deg, #f5f9ff, #edf3ff);
  min-height: 100vh;
}
/* 服务列表 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  padding: 10rpx 0;
  min-height: 80vh;
}
/* 服务卡片 */
.service-card {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(30, 144, 255, 0.1);
  position: relative;
  min-height: 160rpx;
}

/* 新增卡片样式 */
.service-card-outer {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;
}

.service-card-outer-gradient {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  padding: 2rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
}

.service-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 25rpx 30rpx;
}

.service-card-inner::after {
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

/* 选中服务卡片 */
.active-card .service-card-outer-gradient {
  background: linear-gradient(180deg, rgba(194, 221, 250, 1) 0%, rgba(70, 78, 248, 1) 100%);
}

/* 服务信息 */  
.service-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 2;
}
/* 头像框 */
.service-thumb {
  width: 160rpx;
  height: 160rpx;
  background-color: #f0f0f0;
  border-radius: 15rpx;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 30rpx;
  border: none;
  box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
}
/* 服务名称和价格容器 */
.service-details {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 15rpx;
  margin-top: 5rpx;
}
/* 服务名称 */
.service-name {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 28rpx;
  margin-bottom: 10rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.55px;
}
/* 服务价格 */
.service-price {
  font-size: 26rpx;
  color: #464EF8;
  font-weight: 500;
  font-family: 'PingFang SC', sans-serif;
}
/* 操作按键容器 */
.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-left: auto;
  align-items: center;
  padding-left: 15rpx;
  position: relative;
  z-index: 3;
}
/* 修改按钮 */
.edit-btn {
  width: 45rpx;
  height: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background: transparent;
  box-shadow: none;
}
/* 删除按钮 */
.delete-btn {
  width: 45rpx;
  height: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background: transparent;
  box-shadow: none;
}

/* 操作图标 */
.action-icon {
  width: 36rpx;
  height: 36rpx;
}

.edit-btn:active {
  transform: scale(0.9);
}

.delete-btn:active {
  transform: scale(0.9);
}
/* 服务详情卡片 */
.service-detail-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%) scale(0.95);
  width: 85%;
  max-height: 80vh;
  background: linear-gradient(135deg, #ffffff, #f8fbff);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 15rpx 40rpx rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
  border: 2rpx solid rgba(200, 220, 255, 0.8);
}
/* 服务详情卡片展开 */
.detail-card-expanded {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  visibility: visible;
}
/* 服务详情卡片关闭按钮 */
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
  transition: all 0.3s ease;
}

.detail-close-btn:active {
  transform: scale(0.9);
  color: #666;
}

/* 服务详情卡片头像 */
.detail-thumb {
  width: 200rpx;
  height: 200rpx;
  background-color: #f0f0f0;
  border-radius: 16rpx;
  margin: 0 auto 30rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.12);
  overflow: hidden;
  border: 2rpx solid rgba(200, 220, 255, 0.8);
}
/* 服务详情卡片信息 */  
.detail-info {
  margin-bottom: 30rpx;
  padding-bottom: 25rpx;
  border-bottom: 2rpx solid rgba(200, 220, 255, 0.8);
}
/* 服务详情卡片名称 */
.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 15rpx;
  color: #333;
  letter-spacing: 1rpx;
}
/* 服务详情卡片价格 */
.detail-price {
  font-size: 32rpx;
  color: #4a89dc;
  text-align: center;
  font-weight: 500;
}
/* 服务详情卡片描述 */  
.detail-description {
  font-size: 28rpx;
  color: #333;
  margin-top: 25rpx;
}
/* 服务详情卡片描述标题 */
.description-title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
  color: #333;
  letter-spacing: 1rpx;
}
/* 服务详情卡片描述内容 */
.description-content {
  display: block;
  font-size: 30rpx;
  color: #666;
  line-height: 1.7;
  margin-bottom: 25rpx;
  letter-spacing: 0.5rpx;
}
/* 服务详情卡片图片占位符 */
.detail-image-placeholder {
  width: 100%;
  height: 240rpx;
  background: linear-gradient(135deg, #f7f9ff, #edf2ff);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25rpx;
  border-radius: 16rpx;
  border: 2rpx dashed rgba(200, 220, 255, 0.8);
}
/* 服务详情卡片图片图标 */
.image-icon {
  font-size: 60rpx;
  color: #b0c4de;
}
/* 服务详情卡片遮罩层 */  
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 1;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(3px);
}
/* 新增按钮 */
.add-button {
  position: fixed;
  bottom: 100rpx;
  right: 50rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background:linear-gradient(to bottom,#2288F9,#5F26F7 );
  box-shadow: 0 6rpx 20rpx rgba(58, 123, 213, 0.4);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70rpx;
  font-weight: bold;
  color: #fff;
  z-index: 999;
  line-height: 90rpx;
  padding-bottom: 8rpx;
}

.add-button:active {
  transform: scale(0.95);
  box-shadow: 0 3rpx 10rpx rgba(58, 123, 213, 0.3);
}

/* 空数据提示 */
.empty-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
  width: 100%;
  flex: 1;
  min-height: 60vh;
  margin-top: -10vh; /* 向上移动 */
}

/* 空卡片外层容器 */
.empty-card-outer {
  width: 80%;
  max-width: 600rpx;
  border-radius: 40rpx;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;
}

/* 空卡片渐变边框 */
.empty-card-outer-gradient {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  padding: 2rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
}

/* 空卡片内容 */
.empty-card {
  width: 100%;
  border-radius: 40rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.empty-card::after {
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

.empty-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #666;
  position: relative;
  z-index: 2;
}
</style>
