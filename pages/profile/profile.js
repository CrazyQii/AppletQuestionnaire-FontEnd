// pages/components/profile/profile.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    userInfo: ''
  },

  onLoad() {
    wx.getStorage({ // 获取已经登录过的用户信息缓存
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({ userInfo: res.data })
      }, fail: (res) => {
        Toast({
          type: 'fail',
          message: '登录失效，重新登录!!',
          onClose: () => {
            wx.switchTab({
              url: '../index/index',
            })
          }
        });
      }
    })
  },

})