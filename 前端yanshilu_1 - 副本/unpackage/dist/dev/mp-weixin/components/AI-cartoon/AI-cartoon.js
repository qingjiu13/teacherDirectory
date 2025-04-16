"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "AICartoon",
  data() {
    const config = new UTSJSONObject({
      // 图标图片路径
      iconPath: "/static/image/tab-bar/default_avatar.png",
      // 初始位置
      initialLeft: 20,
      initialTop: 100,
      // 图标大小
      size: 60,
      // 动画效果
      animation: new UTSJSONObject({
        duration: 2,
        distance: 10
        // 浮动距离（像素）
      })
    });
    return {
      config,
      iconPath: config.iconPath,
      iconLeft: config.initialLeft,
      iconTop: config.initialTop,
      startX: 0,
      startY: 0,
      isMoving: false,
      isDragging: false
    };
  },
  mounted() {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this.handleMouseMove);
      window.addEventListener("mouseup", this.handleMouseUp);
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("mouseup", this.handleMouseUp);
    }
  },
  methods: {
    /**
     * @description 处理触摸开始事件
     * @param {Object} e - 触摸事件对象
     */
    handleTouchStart(e = null) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.isMoving = false;
    },
    /**
     * @description 处理触摸移动事件
     * @param {Object} e - 触摸事件对象
     */
    handleTouchMove(e = null) {
      const moveX = e.touches[0].clientX - this.startX;
      const moveY = e.touches[0].clientY - this.startY;
      if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
        this.isMoving = true;
      }
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
    },
    /**
     * @description 处理鼠标按下事件（web端支持）
     * @param {MouseEvent} e - 鼠标事件对象
     */
    handleMouseDown(e = null) {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.isMoving = false;
      this.isDragging = true;
      e.preventDefault();
    },
    /**
     * @description 处理鼠标移动事件（web端支持）
     * @param {MouseEvent} e - 鼠标事件对象
     */
    handleMouseMove(e = null) {
      if (!this.isDragging)
        return null;
      const moveX = e.clientX - this.startX;
      const moveY = e.clientY - this.startY;
      if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
        this.isMoving = true;
      }
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
    updatePosition(newLeft = null, newTop = null) {
      this.iconLeft = newLeft;
      this.iconTop = newTop;
      const windowInfo = common_vendor.index.getWindowInfo();
      const screenWidth = windowInfo.windowWidth;
      const screenHeight = windowInfo.windowHeight;
      const iconSize = this.config.size || 60;
      if (this.iconLeft < 0)
        this.iconLeft = 0;
      if (this.iconLeft > screenWidth - iconSize)
        this.iconLeft = screenWidth - iconSize;
      if (this.iconTop < 0)
        this.iconTop = 0;
      if (this.iconTop > screenHeight - iconSize)
        this.iconTop = screenHeight - iconSize;
    },
    /**
     * @description 处理图标点击事件
     */
    handleIconClick() {
      if (!this.isMoving) {
        common_vendor.index.navigateTo({
          url: "/pages/AI/AI"
        });
      }
      this.isMoving = false;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.iconPath,
    b: common_vendor.sei(_ctx.virtualHostId, "view"),
    c: $data.iconLeft + "px",
    d: $data.iconTop + "px",
    e: $data.config.size + "px",
    f: $data.config.size + "px",
    g: $data.config.animation.duration + "s",
    h: "-" + $data.config.animation.distance + "px",
    i: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    j: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    k: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    l: common_vendor.o((...args) => $options.handleMouseDown && $options.handleMouseDown(...args)),
    m: common_vendor.o((...args) => $options.handleIconClick && $options.handleIconClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/AI-cartoon/AI-cartoon.js.map
