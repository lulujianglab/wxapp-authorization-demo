const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 0,
    pageLimit: 10
  },

  init() {
    this.setData({
      page: 0
    })
    let data = this.fetchOrderList()
    this.setData({
      orderList: data
    })
  },

  loadMore() {
    this.setData({
      page: this.data.page + 1
    })
    let data = this.fetchOrderList()
    let orderList = this.data.orderList.concat(data)
    this.setData({
      orderList: orderList
    })
  },

  fetchOrderList() {
    wx.showLoading({
      mask: true
    })
    let data = [{ "address": "中国传媒大学" }, { "address": "中国传媒大学" }, { "address": "中国传媒大学" }, { "address": "中国传媒大学" }, { "address": "中国传媒大学"}]
    wx.hideLoading()
    return data
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading()
    this.init()
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底反弹')
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
