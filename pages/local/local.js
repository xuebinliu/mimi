//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var SData = require("../../utils/sdata.js")
var location
var that
var isloading = false

Page({
  data: {
    moodList: [],
    hasMoreData:true,
    hasLocation:false,
  },

  onReady: function() {
    that = this
    this.data.moodList = []
    common.getUserId()
    isloading = false

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
    this.setData({
      moodList: []
    })

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

  if (isloading) {
    console.log('loadData aready is loading return')
    return
  } else {
    isloading = true
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
    isloading = false
    wx.hideLoading()
    
    if (success) {
      if (data.length == 0) {
        that.setData({
          hasMoreData: false,
        })
      } else {
        // 计算距离
        for(var i = 0; i<data.length; i++) {
          var item = data[i]
          if(item.location) {
            item.locationDetail = common.getDistance(item.location.latitude, item.location.longitude,
              location.latitude, location.longitude)
          }
        }

        if (data.length < 15) {
          // 默认一次拉取15条数据，少于15条说明没有数据了
          that.setData({
            hasMoreData: false,
          })
        }

        that.setData({
          moodList: [].concat(that.data.moodList, data)
        })
        console.log('loaddata finish, all length', that.data.moodList.length)
      }
    } else {
      common.dataLoading("拉取数据错误，请下拉刷新重试", "failed", null)
    }
  });
}