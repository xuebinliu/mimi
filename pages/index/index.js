//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var SData = require("../../utils/sdata.js")
var hasMoreData = true;

Page({
  data: {
    moodList: [],
  },

  onReady: function () {
    hasMoreData = true
    loadData(this)
  },

  onReachBottom: function () {
    if (hasMoreData) {
      loadData(this)
    } else {
      wx.showToast({
        title: '没有更多了',
      })
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    // 下拉刷新，清除数据
    hasMoreData = true;
    this.setData({
      moodList: []
    })

    loadData(this)
  },

  onShareAppMessage: function () {
    return {
      title: '爆秘密',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index/index'
    }
  },

})

// 加载数据
function loadData(thiss) {
  const that = thiss;

  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  SData.reload(that.data.moodList.length, null, function (success, data) {
    if (success) {
      if (data.length == 0) {
        hasMoreData = false
      } else {
        that.setData({
          moodList: [].concat(that.data.moodList, data)
        })
        console.log('loaddata finish, all length', that.data.moodList.length)
      }
    }

    wx.hideLoading()
  });
}