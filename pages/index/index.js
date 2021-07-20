// index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { formatTime } from '../../utils/util'
import { post } from '../../utils/request'
import { login, userInfoApi } from '../../utils/api'

const app = getApp()

Page({
  data: {
    title: '调查问卷',
    userInfo: {},
    session_key: '',
    openid: '',
    hasUserInfo: false
  },
  // 事件处理函数
  startReply() {
    // 点击开始答题按钮，获取用户信息
    this.getUserProfile()
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo['finish_time']) {
      this.setData({ hasUserInfo: true })
      return
    }
  },
  // 页面加载函数
  onLoad() {
    // 如果本地存储过数据，后续不再获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo['finish_time']) {
      this.setData({ hasUserInfo: true })
      return
    }
    // 登录，获取用户code
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let data = { code: res.code }
        // 上传code到后端获取session_key和openid
        post(login, data).then((res) => {
          if (res.code == 200) {
            this.setData({
              session_key: res.data.session_key,
              openid: res.data.openid
            })
          } else {
            console.log('code登录错误!')
          }
        })
      }
    })
  },
  // 方法函数
  getUserProfile(e) {
    // 如果本地有存储过数据，后续不再获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo) {
      wx.navigateTo({
        url: '../baseInfo/baseInfo'
      })
      return
    }
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
        })
        let data = {
          session_key: this.data.session_key,
          openid: this.data.openid,
          avatarUrl: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName
        }
        post(userInfoApi, data).then((res) => {
          if (res.code == 200) {
            console.log(res.data)
            Toast.success({
              message: '用户登录成功',
              forbidClick: true,
              onClose: () => {
                res.data.regist_time = formatTime(res.data.regist_time)
                if (res.data.finish_time != null) {
                  res.data.finish_time = formatTime(res.data.finish_time)
                  wx.setStorageSync('userInfo', res.data)
                  wx.switchTab({
                    url: '../profile/profile'
                  })
                  return
                }
                this.setData({
                  userInfo: res.data
                })
                wx.navigateTo({
                  url: '../baseInfo/baseInfo',
                  success: () => {
                    wx.setStorageSync('userInfo', this.data.userInfo)
                  }
                })
              }
            });
          } else {
            Toast.fail({
              message: '用户登录失败',
              forbidClick: true,
            });
            console.log(res)
          }
        })
      }, 
      fail: (res) => {
        console.log(res)
      }
    })
  }
})
