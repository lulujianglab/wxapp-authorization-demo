const http = require('@chunpu/http')

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../show/show'
    })
  },
  onLoad: function () {
    // app.ready(() => {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
        })
      }else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res,
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
            })
          }
        })
      }
    // })
  },
  bindUserInfo: function(e) {
    var detail = e.detail
    console.log({detail})
    if (detail.iv) {
      http.post('/user/bindinfo', {
        encryptedData: detail.encryptedData,
        iv: detail.iv,
        signature: detail.signature
      }).then(()=>{
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
          })
        })
      })
    }
  },
  bindPhoneNumber(e) {
    var detail = e.detail
    console.log({ detail })
    if (detail.iv) {
      http.post('/user/bindphone', {
        encryptedData: detail.encryptedData,
        iv: detail.iv
      }).then(() => {
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
          })
        })
      })
    }
  }
})
