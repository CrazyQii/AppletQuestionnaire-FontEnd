// pages/components/profile/profile.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    userInfo: ''
  },
  onShow() {
    wx.getStorage({ // 获取已经登录过的用户信息缓存
      key: 'userInfo',
      success: (res) => {
        console.log(res)
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