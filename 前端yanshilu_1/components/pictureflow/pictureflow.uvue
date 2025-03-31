<template>
  <div class="pictureflow-container">
    <!-- 轮播图区域 -->
    <swiper 
      class="swiper" 
      @change="swiperChange" 
      :current="currentIndex"
      :indicator-dots="false" 
      :autoplay="false" 
      :circular="true"
      :previous-margin="'80rpx'" 
      :next-margin="'80rpx'">
      <swiper-item v-for="(image, index) in imagePathes" :key="index">
        <div class="image-container">
          <image :src="image" mode="heightFix" :class="currentIndex === index ? 'active-image' : 'inactive-image'"></image>
          <view :class="currentIndex === index ? 'active-text-overlay' : 'inactive-text-overlay'">
            <view class="text-box">
              <rich-text :nodes="texts[index]"></rich-text>
            </view>  
          </view>
        </div>
      </swiper-item>
    </swiper>
    
    <!-- Logo -->
    <view class="logo-container">
      <image :src="logoPath" class="logo-image"></image>
    </view>
    
    <!-- 标题和简介 -->
    <view>
      <text class="title-text">研师录</text>
    </view>
    <view>
      <text class="intro-text">考研师生对接无烦恼</text>
    </view>
  </div>
</template>

<script>
/**
 * @description 图片流轮播组件，基于introduction页面实现
 */
export default {
  props: {
    /**
     * @description 图片路径数组
     */
    imagePathes: {
      type: Array,
      default: () => [
        "/static/image/i1.png", 
        "/static/image/i2.png", 
        "/static/image/i3.png", 
        "/static/image/i4.png"
      ]
    },
    /**
     * @description 文字说明数组
     */
    texts: {
      type: Array,
      default: () => [
        '研师录致力于为所有考研学子提供<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">最优质最低价</span>的老师，同时<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">帮助在校研究生赚取生活费</span>。未来，我们将持续吸纳良师，拓展课程资源和服务类目，为考生提供<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">免费</span>的全方位备考支持。', 
        '创立于 2024 年，是国内首款专注于寻觅良师的<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">自由交易</span>平台，致力于打破考研学习领域的对接壁垒，以创新模式构建师生高效<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">匹配桥梁</span>，让知识传递与交流更顺畅、更自由。',  
        '同年10月，推出同名小程序，覆盖<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">全国600+所高校</span>，以<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">去中介化</span>的直连模式，促使用户与考研导师直面交流，自主议价，让知识的交易纯粹无虞，使优质教育资源<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">精准对接</span>，开后公平高效的考研辅导新篇。',  
        '平台强势覆盖近 <span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">300 内考研课程</span>，以精细入微的匹配机制，成功助力<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">超 1.2 万名考生</span>精准锁定最契合自身需求的导师。<span style="color: rgba(8, 8, 185, 0.925);font-weight:bold;">高达98%+的用户满意度</span>，不仅彰显平台卓越的服务效能，更见证其在考研辅导领域的专业实力与深厚影响力，成为考研学子逐梦路上的坚实依靠。'
      ]
    },
    /**
     * @description logo路径
     */
    logoPath: {
      type: String,
      default: "/static/image/logo1.png"
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    /**
     * @description 轮播图变化事件处理
     */
    swiperChange(e) {
      this.currentIndex = e.detail.current;
    }
  }
}
</script>

<style>
.pictureflow-container {
  width: 100%;
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
  position: absolute;
  bottom: 245rpx;
  z-index: 10;
}

.logo-image {
  width: 120px;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
}

.swiper {
  margin-top: 80rpx;
  justify-content: center;
  justify-items: center;
  width: 750rpx;
  height: 550px;
}

.active-image, .inactive-image {
  width: 100%;
  height: 100%;
  margin-left: 15rpx;
  margin-right: 15rpx;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  border-radius: 25rpx;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  object-fit: fill;
}

.active-image {
  transform: translateY(25px);
}

.inactive-image {
  transform: translateY(0px);
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90%;
}

.active-text-overlay, .inactive-text-overlay {
  position: absolute;
  bottom: 0;
  width: 95.1%;
  margin-left: 15rpx;
  margin-right: 15rpx;
  height: 35%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: black;
  font-size: 14px;
  font-family: '\5FAE\8F6F\96C5\9ED1', sans-serif;
  border-radius: 25rpx;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.text-box {
  display: flex;
  justify-content: center;
  width: 95%;
  height: 100%;
  margin-top: 20rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
}

.active-text-overlay {
  opacity: 1;
  transform: translateY(25px);
}

.inactive-text-overlay {
  opacity: 0;
  transform: translateY(0px);
}

.title-text {
  position: relative;
  margin-top: 90rpx;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(8, 8, 185, 0.925);
  font-size: 22px;
  font-weight: bolder;
  text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  font-family: '\5FAE\8F6F\96C5\9ED1', sans-serif;
  text-align: center;
}

.intro-text {
  position: relative;
  margin-top: 40rpx;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 16px;
  font-family: '\5FAE\8F6F\96C5\9ED1', Times, serif;
  text-align: center;
  font-weight: bold;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
}
</style>