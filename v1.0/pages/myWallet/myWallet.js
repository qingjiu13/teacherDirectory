const app = getApp()

Page({
  data: {
    balanceIncome: 123.55.toFixed(2),
    currentTab: 0
  },//我的钱包页面数据
  onLoad() {
    
  },
  cashTap(){
    console.log('提现按钮被点击')
  },
  incomeDetailsTap() {
    console.log('收入明细被点击')
  },
  handleBack() {
    wx.navigateBack({
      delta: 1
    })
    console.log('返回按钮被点击')
  },
  switchTab(e) {
    const index = e.detail.index;
    this.setData({
      currentTab: index
    });
    // 这里可以添加切换页面的逻辑
    console.log('切换到标签：', index);
  }
})
