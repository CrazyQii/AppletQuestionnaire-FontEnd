// pages/quesSleep/quesSleep.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { get, post } from '../../utils/request'
import { questionnaireApi, baseInfoApi, recordApi } from '../../utils/api'
import { formatDate, formatTime } from '../../utils/util'

Page({

  data: {
    questionnaire_id: 6,
    questions: {},
    answer: [],
    goSleep: '',
    duringSleep: '',
    getUp: '',
    actSleep: '',
    showGoSleep: false,
    showDuringSleep: false,
    showGetUp: false,
    showActSleep: false
  },

  onLoad: function (options) {
    this.initList(this.data.questionnaire_id)
  },

  initList(id) { // 问卷初始化
    let data = {
      id: id
    }
    post(questionnaireApi, data).then((res) => {
      if (res.code == 200) {
        for(let i = 0; i < res.data.option.length; i++) {
          res.data.option[i]['radio'] = ''
          res.data.option[i]['class'] = ''
        }
        this.setData({ 
          questions: res.data
        })
        console.log(res)
      } else {
        Toast.fail({
          message: '网络问题，请求问卷失败!',
          forbidClick: true
        })
      }
    })
  },

  onClick(event) { // 选择选项
    const { name } = event.currentTarget.dataset
    let first = Number(name.split('-')[0])
    let second = name.split('-')[1]
    let answer = this.data.answer
    answer[first] = second
    this.setData({ answer: answer })
  },

  // 弹出框
  showGoSleepPopup() {
    this.setData({ showGoSleep: true })
  },
  onCloseGoSleep() {
    this.setData({ showGoSleep: false})
  },
  onConfirmGoSleep(event) {
    this.setData({
      showGoSleep: false,
      goSleep: event.detail
    })
  },

  showDuringSleepPopup() {
    this.setData({ showDuringSleep: true })
  },
  onCloseDuringSleep() {
    this.setData({ showDuringSleep: false})
  },
  onConfirmDuringSleep(event) {
    if (Number(event.detail) < 600 && Number(event.detail) >= 0) {
      this.setData({duringSleep: event.detail})
      return 
    }
    this.setData({
      duringSleep: ''
    })
  },

  showGetUpPopup() {
    this.setData({ showGetUp: true })
  },
  onCloseGetUp() {
    this.setData({ showGetUp: false})
  },
  onConfirmGetUp(event) {
    this.setData({
      showGetUp: false,
      getUp: event.detail
    })
  },

  showActSleepPopup() {
    this.setData({ showActSleep: true })
  },
  onCloseActSleep() {
    this.setData({ showActSleep: false})
  },
  onConfirmActSleep(event) {
    if (Number(event.detail) < 24 && Number(event.detail) >= 0) {
      this.setData({actSleep: event.detail})
      return 
    }
    this.setData({
      actSleep: ''
    })
  },

  // 关闭弹窗
  onCancel() {
    this.setData({
      showGoSleep: false,
      showDuringSleep: false,
      showGetUp: false,
      showActSleep: false
    })
  },

  submit() { // 提交本章答卷
    let questions = this.data.questions
    let is_finish = true
    let answer = this.data.answer
    answer[0] = this.data.goSleep,
    answer[1] = this.data.duringSleep,
    answer[2] = this.data.getUp,
    answer[3] = this.data.actSleep,
    this.setData({
      answer: answer
    })
    for (let i = 0; i < this.data.questions.option.length; i++) { // 检索是否完成问卷
      if (this.data.answer[i] == undefined || this.data.answer[i] == '') { // 判断前面的题是否完成
        console.log('未完成: ' + i + '-' + this.data.answer[i])
        questions.option[i]['class'] = 'error'
        is_finish = false
      } else {
        questions.option[i]['class'] = 'normal'
      }
    }
    this.setData({ questions: questions })
    if (!is_finish) {
      Toast.fail({
        message: '试题未完成!',
        forbidClick: true,
      });
      return
    }
    wx.setStorageSync('answer6', this.data.answer)
    this.postInfo()
  },
  upload(data) { // 上传答题数据
    post(recordApi, data).then((res) => {
      if (res.code == 200) {
        this.data.finish_time = formatTime(res.data.finish_time)
        Toast.success({
          message: '已经完成全部试题!',
          forbidClick: true,
          onClose: () => {
            let userInfo = wx.getStorageSync('userInfo')
            userInfo['finish_time'] = this.data.finish_time
            wx.setStorageSync('userInfo', userInfo)
            wx.switchTab({
              url: '../profile/profile',
            })
          }
        });
      } else {
        Toast.fail({
          message: '上传数据失败！',
          forbidClick: true,
        });
        console.log(res)
      }
    })
  },
  postInfo() {  // 上传基本信息数据
    let baseInfo = wx.getStorageSync('baseInfo')
    let data = {
      'openid': baseInfo['openid'],
      'name': baseInfo['name'],
      'date': baseInfo['date'],
      'culture': baseInfo['culture'],
      'erMing': baseInfo['erMing'],
      'during': baseInfo['during'],
      'keeping': baseInfo['keeping'],
      'env': baseInfo['env'],
      'voice': baseInfo['voice'],
      'feel': baseInfo['feel']
    }
    post(baseInfoApi, data).then((res) => {
      if (res.code == 200) {
        let data = {
          openid: baseInfo['openid'],
          answer1: wx.getStorageSync('answer1'),
          answer2: wx.getStorageSync('answer2'),
          answer3: wx.getStorageSync('answer3'),
          answer4: wx.getStorageSync('answer4'),
          answer5: wx.getStorageSync('answer5'),
          answer6: wx.getStorageSync('answer6')
        }
        this.upload(data)  // 上传答题记录
      } else {
        Toast.fail({
          message: '上传基础信息失败！' + res.msg,
          forbidClick: true
        })
      }
    })
  }
})