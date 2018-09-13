import http from '@chunpu/http'
const date = require('utils/date.js')
const util = require('utils/util.js')
// const Ready = require('min-ready')

// const ready = Ready()

//app.js
App({

  onLaunch: function () {
    console.log('build time', date.formatTime(new Date()))
    util.promisify(wx.checkSession)().then(() => {
      console.log('session 有效')
      return this.getUserInfo()
      // return util.promisify(wx.getStorage)({
      //   key: 'cookie'
      // })
    }).then((userInfo) => {
      console.log('登录成功', userInfo)
    }).catch(() => {
      console.log('自动登录失败')
      return this.login()
    }).catch(err => {
      console.log(`手动登录失败`)
    })
  },

  // 登录
  login() {
    console.log('登录')
    return util.promisify(wx.login)().then(({ code }) => {
      console.log(`code: ${code}`)
      return http.post('/oauth/login', {
        code,
        type: 'wxapp'
      })
    }).then(() => {
      return this.getUserInfo()
    })
  },

  // 获取用户信息
  getUserInfo() {
    return http.get('/user/info').then(({ data }) => {
      if (data && typeof data === 'object') {
        this.globalData.userInfo = data
        // ready.open()
        // 延时函数
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(data)
        }

        return data
      }
      return Promise.reject(response)
    })
  },
  // ready(func) {
  //   ready.queue(func)
  // },
  globalData: {
    userInfo: null
  }
})