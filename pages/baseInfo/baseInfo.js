// pages/baseInfo/baseInfo.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import { formatMonth } from '../../utils/util'

Page({
  data: {
    name: '',
    currentDate: '',
    currentCulture: '',
    currentErming: '',
    currentDuring: '',
    currentKeeping: '',
    currentEnv: '',
    currentVoice: '',
    currentFeel: '',
    minDate : new Date(1950, 0, 1).getTime(),
    maxDate : new Date().getTime(),
    culture: ['初中及以下','高中/中专', '专科', '本科及本科以上'],
    Erming: ['左耳','右耳', '双侧', '头部', '其他'],
    Keeping: ['持续响', '间断响'],
    Env: ['安静环境', '噪声环境'],
    Voice: ['低沉', '尖锐', '说不清楚'],
    Feel: ['1级，耳鸣若有若无', '2级, 响度轻微，但可肯定', '3级，中等响度', '4级，耳鸣声音较大', '5级，耳鸣声很大', '6级，耳鸣声极大，难以忍受'],
    showDate: false,
    showCulture: false,
    showErming: false,
    showEnv: false,
    showVoice: false,
    showFeel: false,

  },
  onShow() {
    const baseInfo = wx.getStorageSync('baseInfo') || null
    if (baseInfo != null) {
      this.setData({
        name: baseInfo['name'],
        currentDate: baseInfo['date'],
        currentCulture: baseInfo['culture'],
        currentErming: baseInfo['erMing'],
        currentDuring: baseInfo['during'],
        currentKeeping: baseInfo['keeping'],
        currentEnv: baseInfo['env'],
        currentVoice: baseInfo['voice'],
        currentFeel: baseInfo['feel'],
      })
    }
    return
  },
  onChangeName(event) {
    this.setData({ name: event.detail })
  },
  onChangeDuring(event) {
    this.setData({ currentDuring: event.detail  })
  },
  // 弹出层信息
  onDisplayDate() { this.setData({ showDate: true }) },
  cancelDate() { this.setData({ showDate: false }) },
  confirmDate(event) {
    this.setData({
      showDate: false,
      currentDate: formatMonth(event.detail),
    });
  },
  onDisplayCulture() { this.setData({ showCulture: true }) },
  cancelCulture() { this.setData({ showCulture: false }) },
  confirmCulture(event) {
    this.setData({
      showCulture: false,
      currentCulture: event.detail.value,
    });
  },
  onDisplayErming() { this.setData({ showErming: true }) },
  cancelErming() { this.setData({ showErming: false }) },
  confirmErming(event) {
    this.setData({
      showErming: false,
      currentErming: event.detail.value,
    });
  },
  onDisplayKeeping() { this.setData({ showKeeping: true }) },
  cancelKeeping() { this.setData({ showKeeping: false }) },
  confirmKeeping(event) {
    this.setData({
      showKeeping: false,
      currentKeeping: event.detail.value,
    });
  },
  onDisplayEnv() { this.setData({ showEnv: true }) },
  cancelEnv() { this.setData({ showEnv: false }) },
  confirmEnv(event) {
    this.setData({
      showEnv: false,
      currentEnv: event.detail.value,
    });
  },
  onDisplayVoice() { this.setData({ showVoice: true }) },
  cancelVoice() { this.setData({ showVoice: false }) },
  confirmVoice(event) {
    this.setData({
      showVoice: false,
      currentVoice: event.detail.value,
    });
  },
  onDisplayFeel() { this.setData({ showFeel: true }) },
  cancelFeel() { this.setData({ showFeel: false }) },
  confirmFeel(event) {
    this.setData({
      showFeel: false,
      currentFeel: event.detail.value,
    });
  },

  submit() {
    if (this.data.name == '' || this.data.currentDate == '' || this.data.currentCulture == '' || this.data.currentErming == '' || this.data.currentKeeping == '' || this.data.currentDuring == '' || this.data.currentEnv =='' || this.data.currentVoice == '' || this.data.currentFeel == '' ) {
      Toast.fail({
        message: '信息不完整',
        forbidClick: true
      });
      return
    }
    Dialog.confirm({
      title: '准备答题',
      message: '开始答题后，有四个模块问卷，预计完成时间 12 分钟，可从中断处重新作答',
    }).then(() => {
        this.post_data()
    }).catch(() => {
      console.log('用户取消！')
    });
  },

  post_data() {
    let data = {
      'openid': wx.getStorageSync('userInfo')['openid'],
      'name': this.data.name,
      'date': this.data.currentDate,
      'culture': this.data.currentCulture,
      'erMing': this.data.currentErming,
      'during': this.data.currentDuring,
      'keeping': this.data.currentKeeping,
      'env': this.data.currentEnv,
      'voice': this.data.currentVoice,
      'feel': this.data.currentFeel
    }
    // 将数据进行缓存
    wx.setStorageSync('baseInfo', data)
    wx.setStorage({
      data: data,
      key: 'baseInfo',
      success: function() {
        wx.reLaunch({
          url: '../questionnaire/questionnaire',
        })
      }
    })
  }
})