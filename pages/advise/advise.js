// pages/advise/advise.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { get } from '../../utils/request'
import { adviseApi } from '../../utils/api'

Page({

  data: {
    activeCollapse: ['1'],
    adviseData: []
  },
  // 分割字符串
  splitString(str) {
    str = str.split('/')
    return str
  },
  onLoad() {
    this.initAdvise()
  },
  initAdvise() {  // 初始化建议数据
    let data = {
      'openid': wx.getStorageSync('userInfo')['openid']
    }
    get(adviseApi, data).then((res) => {
      if (res.code == 200) {
        this.setData({
          adviseData: [
            {
              'title': '结果1',
              'content': this.splitString(res.data['ad1'])
            },
            {
              'title': '结果2',
              'content': this.splitString(res.data['ad2'])
            },
            {
              'title': '结果3',
              'content': this.splitString(res.data['ad3'])
            },
            {
              'title': '结果4',
              'content': this.splitString(res.data['ad4'])
            },
            {
              'title': '结果5',
              'content': this.splitString(res.data['ad5'])
            }
          ]
        })
      } else {
        console.log(res)
      }
    })
  },
  onChangeCollapse(event) {
    this.setData({
      activeCollapse: event.detail,
    });
  },
})