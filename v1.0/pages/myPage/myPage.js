// pages/myPage/myPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 3,
    userInfo:{
      nickName: null,
      avatarUrl: null,
      tag: null
    },//用户信息：昵称、头像、标签
    statisticInfo:{
      totalPosts:14,
      totalFans:8,
      totalFollow:10,
      totalCollection:25
    }//用户统计信息：动态、粉丝、关注、收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  loginTap(){
    console.log('登录按钮被点击')
  },
  switchTab(e) {
    const index = e.detail.index;
    this.setData({
      currentTab: index
    });
    // 这里可以添加切换页面的逻辑
    console.log('切换到标签：', index);
  },
  statisticTap(e) {
    const type = e.currentTarget.dataset.type;
    switch(type) {
      case 'posts':
        console.log('点击了动态');
        // 处理动态点击
        break;
      case 'fans':
        console.log('点击了粉丝');
        // 处理粉丝点击
        break;
      case 'follow':
        console.log('点击了关注');
        // 处理关注点击
        break;
      case 'collection':
        console.log('点击了收藏');
        // 处理收藏点击
        break;
    }
  },
  orderTap() {
    console.log('点击了我的订单')
  },

  walletTap() {
    console.log('点击了我的钱包')
    wx.navigateTo({
      url: '/pages/myWallet/myWallet'
    })
  },

  certificationTap() {
    console.log('点击了学长学姐认证')
  },

  subscribeTap() {
    console.log('点击了关注公众号')
  },

  contactTap() {
    console.log('点击了联系我们')
  }
})