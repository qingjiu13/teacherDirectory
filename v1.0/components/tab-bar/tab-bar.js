// components/tab-bar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    currentTab: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [
      {
        icon: 'success',
        text: '首页'
      },
      {
        icon: 'warn',
        text: '消息'
      },
      {
        icon: 'info',
        text: '发布'
      },
      {
        icon: 'waiting',
        text: '我的'
      }
    ] 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('switchTab', { index });
    }
  }
})