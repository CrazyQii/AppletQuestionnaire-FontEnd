// pages/components/profile/profile.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import { getHistDisease } from '../../utils/api'
import { get } from '../../utils/request'

Page({
  data: {
    userInfo: '',
    histDisease: ''
  },
  onShow() {
    wx.getStorage({ // 获取已经登录过的用户信息缓存
      key: 'userInfo',
      success: (res) => {
        this.setData({ userInfo: res.data })
      }, fail: (res) => {
        Toast({
          type: 'fail',
          message: '登录失效',
          onClose: () => {
            wx.switchTab({
              url: '../index/index',
            })
          }
        });
      }
    })
    get(getHistDisease, {'openid': wx.getStorageSync('userInfo')['openid'] }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        this.setData({ 
          histDisease: true
        })
        wx.setStorageSync('info', res.data)
      } else {
        this.setData({
          histDisease: false
        })
      }
    })
  },
  onLoad() {
    wx.getStorage({ // 获取已经登录过的用户信息缓存
      key: 'userInfo',
      success: (res) => {
        this.setData({ userInfo: res.data })
      }, fail: (res) => {
        Toast({
          type: 'fail',
          message: '登录失效',
          onClose: () => {
            wx.switchTab({
              url: '../index/index',
            })
          }
        });
      }
    })
    get(getHistDisease, {'openid': wx.getStorageSync('userInfo')['openid'] }).then((res) => {
      if (res.code == 200) {
        this.setData({ 
          histDisease: true
        })
        wx.setStorageSync('info', res.data)
      } else {
        this.setData({
          histDisease: false
        })
      }
    })
  },
  logout() {
    let that = this
    Dialog.confirm({
      title: '确认退出？',
      message: '退出后缓存数据会被清除',
    }).then(() => {
      Toast.success({
        message: '登出成功',
        forbidClick: true,
        onClose: function() {
          wx.clearStorage({
            success: (res) => {
              that.setData({ userInfo: '' })
              wx.switchTab({
                url: '../index/index',
              })
            },
          })
        }
      });
    }).catch(() => {
      console.log('用户取消！')
    });
  }
})