//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var SData = require("../../utils/sdata.js")
var location
var that

Page({
  data: {
    moodList: [],
    hasMoreData:true,
    hasLocation:false,
  },

  onReady: function() {
    that = this

    common.getUserId()

    wx.getLocation({
      success: function(res) {
        location = res
        console.log('getLocation', location)
        that.setData({
          hasLocation:true,
        })
      },
      complete: function() {
        loadData()
      }
    })
  },

  onReachBottom: function () {
    if(this.data.hasMoreData) {
      loadData()
    } 
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    // 下拉刷新，清除数据
    this.data.moodList = []

    loadData()
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
function loadData() {
  if(!location) {
    console.log('loadData no location')
    return
  }

  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  that.setData({
    hasMoreData: true,
  })

  console.log('loadData start')
  SData.reload(that.data.moodList.length, location, function(success, data){
    if (success) {
      if (data.length == 0) {
        that.setData({
          hasMoreData: false,
        })
      } else {

        for(var i = 0; i<data.length; i++) {
          var item = data[i]
          if(item.location) {
            item.locationDetail = common.getDistance(item.location.latitude, item.location.longitude,
              location.latitude, location.longitude)
          }
        }

        that.setData({
          moodList: [].concat(that.data.moodList, data)
        })
        console.log('loaddata finish, all length', that.data.moodList.length)
      }
    }

    wx.hideLoading()
  });
}