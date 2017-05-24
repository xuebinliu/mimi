
//获取应用实例
var app = getApp();
var common = require('../template/getCode.js')
var that;

Page({
  onLoad: function (options) {
    that = this;
  },

  //提交建议
  formSubmit: function (e) {
    if (e.detail.value.advise == "" || e.detail.value.advise == null) {
      common.dataLoading("建议不能为空", "loading");
    }
    else {

    }
  },
  
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
