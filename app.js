// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    // const userInfo = wx.getStorageSync('userInfo') || null

    // if (userInfo) {
    //   console.log('APP登录，该用户登录过')
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // } else {
    //   console.log('APP登录，该用户未登录过')
    //   console.log(userInfo)
    // }
  },
  globalData: {
    userInfo: null,
    host: "https://www.crazyqiqi.top:4443"
    // host: "http://127.0.0.1:5000"
  }
})
