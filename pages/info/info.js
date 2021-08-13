// pages/info/info.js
Page({
  data: {
    activeName: ['1'],
    baseInfo: {},
    histDisease: {}
  },

  onLoad: function (options) {
    let data = wx.getStorageSync('info')
    this.setData({
      baseInfo: data.baseInfo,
      histDisease: data.histDisease
    })
  },

  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
})