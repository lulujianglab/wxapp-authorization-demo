//logs.js
const date = require('../../utils/date.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return date.formatTime(new Date(log))
      })
    })
  }
})
