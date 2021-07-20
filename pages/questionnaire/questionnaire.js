// pages/components/questionnaire/questionnaire.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { get, post } from '../../utils/request'
import { questionnaireApi, recordApi } from '../../utils/api'
import { formatDate, formatTime } from '../../utils/util'


Page({
  data: {
    questionnaire_id: 1,
    questions: [{}],
    empty_answer: [],
    answer: [],
    answer1: [],
    answer2: [],
    answer3: [],
    answer4: [],
    finish_time: ''
  },

  onLoad: function () {
    this.initList(this.data.questionnaire_id)
  },
  initList(id) {  // 获取问题列表
    let data = {'id': id}
    get(questionnaireApi, data).then((res) => {
      if (res.code == 200) {
        res.data['publish_time'] = formatDate(res.data['publish_time'])
        if (res.data.option.length == 0) { // 问卷为空
          Toast.fail({
            message: res.data['title'] + ' 生成失败!',
            forbidClick: true,
            onClose: () => {
              wx.switchTab({
                url: '../index/index',
              })
            }
          });
          return
        }
        for(let i = 0; i < res.data.option.length; i++) {
          res.data.option[i]['radio'] = ''
          res.data.option[i]['class'] = ''
        }
        this.setData({ 
          questions: res.data,
          empty_answer: [],
          answer: [],
          score: 0
        })
        wx.pageScrollTo({
          duration: 0,
          scrollTop: 0
        })
      } else {
        console.log(res)
      }
    })
  },
  onClick(event) { // 选择选项
    const { name } = event.currentTarget.dataset
    let first = Number(name.split('-')[0])
    let second = Number(name.split('-')[1])
    let answer = this.data.answer
    answer[first] = second
    this.setData({ answer: answer })
  },
  submit() { // 提交本章答卷
    let questions = this.data.questions
    let is_finish = true
    for (let i = 0; i < this.data.questions.option.length; i++) {
      if (typeof(this.data.answer[i]) != 'number') { // 判断前面的题是否完成
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
    if (this.data.questionnaire_id == 1) {
      let questionnaire_id = this.data.questionnaire_id + 1
      this.setData({
        questionnaire_id: questionnaire_id,
        answer1: this.data.answer
      })
      this.initList(this.data.questionnaire_id)
    } else if (this.data.questionnaire_id == 2) {
      let questionnaire_id = this.data.questionnaire_id + 1
      this.setData({
        questionnaire_id: questionnaire_id,
        answer2: this.data.answer
      })
      this.initList(this.data.questionnaire_id)
    } else if (this.data.questionnaire_id == 3) {
      let questionnaire_id = this.data.questionnaire_id + 1
      this.setData({
        questionnaire_id: questionnaire_id,
        answer3: this.data.answer
      })
      this.initList(this.data.questionnaire_id)
    } else {
      this.setData({
        answer4: this.data.answer
      })
      let data = {
        openid: wx.getStorageSync('userInfo')['openid'],
        answer1: this.data.answer1,
        answer2: this.data.answer2,
        answer3: this.data.answer3,
        answer4: this.data.answer4
      }
      this.upload(data)
    }
  },
  upload(data) { // 上传数据
    return post(recordApi, data).then((res) => {
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
  }
})