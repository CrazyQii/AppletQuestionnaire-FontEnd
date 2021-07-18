// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo['finish_time']) {
      console.log('APP登录，该用户已经完成答卷')
      wx.switchTab({
        url: '/pages/profile/profile',
      })
    } else {
      console.log('APP登录，该用户未完成答卷')
      console.log(userInfo)
    }
  },
  globalData: {
    userInfo: null,
    // host: "https://www.crazyqiqi.top:4443"
    host: "http://127.0.0.1:5000"
  }
})
