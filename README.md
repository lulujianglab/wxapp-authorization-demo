> wxapp-authorization-demo

# 微信小程序授权及页面上拉加载更多/下拉刷新demo

  本项目分为客户端和服务端两部分
  
# 实现功能

  * 支持自定义登录态, 完全清除缓存后依然可以返回正确的用户信息
  * 支持绑定用户信息 (昵称, 头像等)
  * 支持绑定用户手机号
  * 实现 cookie 基础功能
  * 实现 session 过期判断
  
# 项目编译和运行
  
  ## service-demo
  
  使用 Node.js 实现登录服务端
  
  * 安装依赖
  
    cnpm install
  
  * 依赖安装成功后执行启动命令
  
    node server.js 或者 npm start
  
  > 服务端使用 js 变量来保存用户数据, 如果重启服务端, 用户数据就清空了
  
  ## frontend-demo
  
  * 安装依赖
  
    cnpm install
  
  * 依赖安装成功后执行启动命令
  
    npm run dev
  
  * 微信小程序
 
  1. 使用最新版微信开发者工具(需[支持npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)) 新建项目
  1. 根据文档安装依赖 `cnpm install --production` 并构建 npm
  1. 点击编译查看效果
  
# 具体实现过程可见[博客](https://github.com/lulujianglab/blog/issues/29)
  
 # 微信api
 
[wx.setStorage(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/data.html)

[wx.getStorage(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/data.html)

[wx.showToast(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/api-react.html)

[wx.navigateTo(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/ui-navigate.html)

[wx.login(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html)

[wx.checkSession(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/signature.html#wxchecksessionobject)

[wx.getUserInfo(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject)

[getPhoneNumber(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/getPhoneNumber.html)

[wx.startPullDownRefresh(OBJECT)](https://developers.weixin.qq.com/miniprogram/dev/api/pulldown.html#pageonpulldownrefresh)

[wx.stopPullDownRefresh()](https://developers.weixin.qq.com/miniprogram/dev/api/pulldown.html#wxstartpulldownrefresh)

[wx.showNavigationBarLoading()](https://developers.weixin.qq.com/miniprogram/dev/api/ui.html#wxsetnavigationbartitleobject)

[wx.hideNavigationBarLoading()](https://developers.weixin.qq.com/miniprogram/dev/api/ui.html#wxsetnavigationbartitleobject)
