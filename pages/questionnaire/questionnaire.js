// pages/components/questionnaire/questionnaire.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { get, post } from '../../utils/request'
import { questionnaireApi, recordApi, baseInfoApi } from '../../utils/api'
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
    answer5: [],
    finish_time: ''
  },

  onLoad: function () {
    const end_id = Number(wx.getStorageSync('end_id')) + 1 || this.data.questionnaire_id
    if (end_id > 5) {
      Toast.success({
        message: '已经完成该问卷',
        forbidClick: true,
        onClose: function() {
          wx.reLaunch({
            url: '../quesSleep/quesSleep',
          })
        }
      });
      return 
    } else {
      this.initList(end_id)
      this.setData({ 
        questionnaire_id: end_id
      })
      
    }
  },
  initList(id) {  // 获取问题列表
    let data = {'id': id}
    post(questionnaireApi, data).then((res) => {
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
      Dialog.confirm({
        title: '保存答案',
        message: '保存后不可更改',
      }).then(() => {
        let questionnaire_id = this.data.questionnaire_id + 1
        this.setData({
          questionnaire_id: questionnaire_id,
          answer1: this.data.answer
        })
        wx.setStorageSync('answer1', this.data.answer1)  // 保存用户已完成的问卷答案
        wx.setStorageSync('end_id', 1)  // 保存用户已完成的问卷id
        this.initList(this.data.questionnaire_id)
      }).catch(() => {
        console.log('用户取消！')
      });
    } else if (this.data.questionnaire_id == 2) {
      Dialog.confirm({
        title: '保存答案',
        message: '保存后不可更改',
      }).then(() => {
        let questionnaire_id = this.data.questionnaire_id + 1
        this.setData({
          questionnaire_id: questionnaire_id,
          answer2: this.data.answer
        })
        wx.setStorageSync('answer2', this.data.answer2)
        wx.setStorageSync('end_id', 2)
        this.initList(this.data.questionnaire_id)
      }).catch(() => {
        console.log('用户取消！')
      })
    } else if (this.data.questionnaire_id == 3) {
      Dialog.confirm({
        title: '保存答案',
        message: '保存后不可更改',
      }).then(() => {
        let questionnaire_id = this.data.questionnaire_id + 1
        this.setData({
          questionnaire_id: questionnaire_id,
          answer3: this.data.answer
        })
        wx.setStorageSync('answer3', this.data.answer3)
        wx.setStorageSync('end_id', 3)
        this.initList(this.data.questionnaire_id)
      }).catch(() => {
        console.log('用户取消！')
      })
    } else if (this.data.questionnaire_id == 4) {
      Dialog.confirm({
        title: '保存答案',
        message: '保存后不可更改',
      }).then(() => {
        let questionnaire_id = this.data.questionnaire_id + 1
        this.setData({
          questionnaire_id: questionnaire_id,
          answer4: this.data.answer
        })
        wx.setStorageSync('answer4', this.data.answer4)
        wx.setStorageSync('end_id', 4)
        this.initList(this.data.questionnaire_id)
      }).catch(() => {
        console.log('用户取消！')
      })
    } else {
      Dialog.confirm({
        title: '提交答案',
        message: '提交后不可更改',
      }).then(() => {
        this.setData({
          answer5: this.data.answer
        })
        wx.setStorageSync('answer5', this.data.answer5)
        wx.setStorageSync('end_id', 5)
        // 跳转页面
        wx.navigateTo({
          url: '../quesSleep/quesSleep',
        })
      }).catch((e) => {
        console.log(e)
        console.log('用户取消！')
      });
    }
  }
})