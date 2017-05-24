//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var SData = require("../../utils/sdata.js")

Page({
  data: {
    moodList: [],
    hasMoreData:true,
  },

  onReady: function() {
    common.getUserId()
    loadData(this)
  },

  onReachBottom: function () {
    if(this.data.hasMoreData) {
      loadData(this)
    } 
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    // 下拉刷新，清除数据
    this.data.moodList = []

    loadData(this)
  },

  onShareAppMessage: function () {
    return {
      title: '匿名秘密',
      desc: '亲，快来匿名分享你知道的小秘密吧~',
      path: '/pages/local/local'
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

  that.setData({
    hasMoreData: true,
  })

  SData.reload(that.data.moodList.length, null, function(success, data){
    if (success) {
      if (data.length == 0) {
        that.setData({
          hasMoreData: false,
        })
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