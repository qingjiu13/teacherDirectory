<template>
  <!-- 可拖动的卡通图标组件 -->
  <view 
    class="cartoon-icon" 
    :style="{
      left: iconLeft + 'px', 
      top: iconTop + 'px',
      width: config.size + 'px',
      height: config.size + 'px',
      '--animation-duration': config.animation.duration + 's',
      '--float-distance': '-' + config.animation.distance + 'px'
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @click="handleIconClick"
  >
    <image class="icon-image" :src="iconPath" mode="aspectFit"></image>
  </view>
</template>

<script>
// 导入路由管理器
import { Navigator, AIRoutes } from '@/router/Router.js';

/**
 * @description 可拖动卡通图标组件
 */
export default {
  name: 'AICartoon',
  data() {
    /**
     * @constant
     * @type {string}
     * @description 默认头像图片路径
     */
    const DEFAULT_AVATAR_PATH = '/static/image/defaultAvatar/teacher-man.png';

    // 内联配置，不依赖外部文件
    const config = {
      // 图标图片路径
      iconPath: DEFAULT_AVATAR_PATH,
      // 初始位置
      initialLeft: 20,
      initialTop: 100,
      // 图标大小
      size: 60,
      // 动画效果
      animation: {
        duration: 2,  // 秒
        distance: 10  // 浮动距离（像素）
      }
    };
    
    return {
      config: config,
      iconPath: config.iconPath,
      iconLeft: config.initialLeft,
      iconTop: config.initialTop,
      startX: 0,
      startY: 0,
      isMoving: false,
      isDragging: false
    }
  },
  mounted() {
    // 添加全局鼠标事件监听（web端）
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    }
  },
  beforeDestroy() {
    // 移除全局鼠标事件监听（web端）
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  },
  methods: {
    /**
     * @description 处理触摸开始事件
     * @param {Object} e - 触摸事件对象
     */
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.isMoving = false;
    },
    
    /**
     * @description 处理触摸移动事件
     * @param {Object} e - 触摸事件对象
     */
    handleTouchMove(e) {
      const moveX = e.touches[0].clientX - this.startX;
      const moveY = e.touches[0].clientY - this.startY;
      
      if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
        this.isMoving = true;
      }
      
      // 确保 iconLeft 和 iconTop 不为空
      const newLeft = (this.iconLeft || 0) + moveX;
      const newTop = (this.iconTop || 0) + moveY;
      
      this.updatePosition(newLeft, newTop);
      
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    
    /**
     * @description 处理触摸结束事件
     */
    handleTouchEnd() {
      // 触摸结束可以添加额外逻辑
    },
    
    /**
     * @description 处理鼠标按下事件（web端支持）
     * @param {MouseEvent} e - 鼠标事件对象
     */
    handleMouseDown(e) {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isMoving = false;
      this.isDragging = true;
      
      // 阻止默认事件，防止文本选择等
      e.preventDefault();
    },
    
    /**
     * @description 处理鼠标移动事件（web端支持）
     * @param {MouseEvent} e - 鼠标事件对象
     */
    handleMouseMove(e) {
      if (!this.isDragging) return;
      
      const moveX = e.clientX - this.startX;
      const moveY = e.clientY - this.startY;
      
      if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
        this.isMoving = true;
      }
      
      // 确保 iconLeft 和 iconTop 不为空
      const newLeft = (this.iconLeft || 0) + moveX;
      const newTop = (this.iconTop || 0) + moveY;
      
      this.updatePosition(newLeft, newTop);
      
      this.startX = e.clientX;
      this.startY = e.clientY;
    },
    
    /**
     * @description 处理鼠标松开事件（web端支持）
     */
    handleMouseUp() {
      this.isDragging = false;
    },
    
    /**
     * @description 更新图标位置并进行边界检测
     * @param {number} newLeft - 新的左侧位置
     * @param {number} newTop - 新的顶部位置
     */
    updatePosition(newLeft, newTop) {
      this.iconLeft = newLeft;
      this.iconTop = newTop;
      
      // 边界检测，防止图标拖出屏幕
      // 使用新的 API 获取窗口信息
      const windowInfo = uni.getWindowInfo();
      const screenWidth = windowInfo.windowWidth;
      const screenHeight = windowInfo.windowHeight;
      const iconSize = this.config.size || 60; // 提供默认值防止null
      
      if (this.iconLeft < 0) this.iconLeft = 0;
      if (this.iconLeft > screenWidth - iconSize) this.iconLeft = screenWidth - iconSize;
      if (this.iconTop < 0) this.iconTop = 0;
      if (this.iconTop > screenHeight - iconSize) this.iconTop = screenHeight - iconSize;
    },
    
    /**
     * @description 处理图标点击事件
     */
    handleIconClick() {
      if (!this.isMoving) {
        // 执行跳转逻辑到AI助手页面，使用统一路由管理
        Navigator.toAIServer();
      }
      this.isMoving = false;
    }
  }
}
</script>

<style>
.cartoon-icon {
  position: fixed;
  z-index: 9999;
  pointer-events: auto; /* 确保可以接收点击事件 */
  touch-action: none; /* 防止触摸事件的默认行为影响拖动 */
}

.icon-image {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* 使图标为圆形 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  animation: float var(--animation-duration, 2s) ease-in-out infinite; /* 添加浮动动画 */
  user-select: none; /* 防止文本选择 */
  -webkit-user-drag: none; /* 防止元素被拖动 */
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(calc(var(--float-distance, -10px)));
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
