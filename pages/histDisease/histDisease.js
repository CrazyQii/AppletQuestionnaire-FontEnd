// pages/histDisease/histDisease.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import { post } from '../../utils/request'
import { histDisease } from '../../utils/api'

Page({

  data: {
    symptom: '',
    reasonList: ['噪声暴露', '突发性聋', '创伤性聋', '中耳炎', '药物性聋', '无明显诱因'],
    reasonResult: [],
    otherReason: '',
    selfDiseaseList: ['冠心病', '偏头痛', '高脂血症', '高血压', '糖尿病', '甲状腺功能亢进症', '无'],
    selfDiseaseResult: [],
    otherDisease: ''
  },
  // 单选框
  onClickSymtom(event) {
    this.setData({
      symptom: event.currentTarget.dataset.name
    })
  },
  // 导致耳鸣原因
  onChangeReason(event) {
    this.setData({
      reasonResult: event.detail
    });
  },
  toggleReason(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  noopReason() {},
  onConfirmReason(event) {
    this.setData({
      otherReason: event.detail
    })
  },

  // 是否患有慢性疾病
  onChangeSelfDisease(event) {
    this.setData({
      selfDiseaseResult: event.detail
    });
  },
  toggleSelfDisease(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkbox-${index}`);
    checkbox.toggle();
  },
  noopSelfDisease() {},
  onConfirmDisease(event) {
    this.setData({
      otherDisease: event.detail
    })
  },

  submit() {
    if (this.data.symptom == '' || (this.data.reasonResult.length == 0 && this.data.otherReason == '') || (this.data.selfDiseaseResult == 0 && this.data.otherDisease == '')) {
      Toast.fail({
        message: '选项有空',
        forbidClick: true,
      });
      return
    }
    Dialog.confirm({
      title: '提交答案',
      message: '提交后不可更改'
    }).then(() => {
      let data = {
        openid: wx.getStorageSync('userInfo')['openid'],
        symptom: this.data.symptom,
        reason: this.data.reasonResult.concat([this.data.otherReason]).toString(),
        self_disease: this.data.selfDiseaseResult.concat([this.data.otherDisease]).toString()
      }
      // 提交数据
      post(histDisease, data).then((res) => {
        if (res.code == 200) {
          let storage = {
            reason: res.data.reason,
            self_disease: res.data.self_disease,
            symptom: res.data.symptom
          }
          wx.setStorageSync('histDisease', storage)
          wx.switchTab({
            url: '../profile/profile',
          })
        } else {
          Toast.fail({
            message: '数据提交失败',
            forbidClick: true,
          });
          return
        }
      })
    }).catch((e) => {
      console.log('用户取消！')
    });
  }
})