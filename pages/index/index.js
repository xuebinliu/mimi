//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var SData = require("../../utils/sdata.js")

var isloading = false

Page({
  data: {
    moodList: [],
    hasMoreData: true,
  },

  onReady: function () {
    this.data.moodList = []
    common.getUserId()
    isloading = false
    loadData(this)
  },

  onReachBottom: function () {
    if (this.data.hasMoreData) {
      console.log('onReachBottom hasMoreData loadData')
      loadData(this)
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    // 下拉刷新，清除数据
    this.data.moodList = []

    console.log('onPullDownRefresh loadData')

    loadData(this)
  },

  onShareAppMessage: function () {
    return {
      title: '匿名秘密',
      desc: '亲，快来匿名分享你知道的小秘密吧~',
      path: '/pages/index/index'
    }
  },
})

// 加载数据
function loadData(thiss) {
  if (isloading) {
    console.log('loadData aready is loading return')
    return
  } else {
    isloading = true
  }

  const that = thiss;

  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  that.setData({
    hasMoreData: true,
  })

  SData.reload(that.data.moodList.length, null, function (success, data) {

    isloading = false

    wx.hideLoading()
    if (success) {
      if (data.length == 0) {
        that.setData({
          hasMoreData: false,
        })
      } else {
        if(data.length < 15) {
          // 默认一次拉取15条数据，少于15条说明没有数据了
          that.setData({
            hasMoreData: false,
          })
        }

        that.setData({
          moodList: [].concat(that.data.moodList, data)
        })

        console.log('loadData finished, all length', that.data.moodList.length)
      }
    } else {
      common.dataLoading("获取数据失败，请下拉刷新重试", "failed", null)
    }
  });
}