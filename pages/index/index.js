//获取应用实例
var common = require('../../utils/common.js');
var SData = require("../../utils/sdata.js");
var location = null;
var that;
var isloading;

Page({
  data: {
    moodList: [],
    hasMoreData: true,
    avatar:wx.getStorageSync('my_avatar'),
  },

  onShow: function () {
    that = this;
    this.data.moodList = [];
    common.getUserId();
    isloading = false;

    if(!getApp().globalData.isInCheck) {
      // 非审核态，获取地理位置
      wx.getLocation({
        success: function(res) {
          location = res;
          console.log('getLocation', location);
        },
        complete: function() {
          loadData();
        }
      });

      // 审核态，不取位置，直接拉数据
      wx.setNavigationBarTitle({
        title:"附近秘密"
      });

    } else {
      // 审核态，不取位置，直接拉数据
      wx.setNavigationBarTitle({
        title:"我的秘密"
      });

      loadData();
    }
  },

  tapMine: function () {
    wx.navigateTo({
      url: '../mine/mine'
    });
  },

  tapWrite: function () {
    wx.navigateTo({
      url: '../write/write'
    });
  },

  onReachBottom: function () {
    if (this.data.hasMoreData) {
      console.log('onReachBottom hasMoreData loadData');
      loadData()
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    // 下拉刷新，清除数据
    this.setData({
      moodList: []
    });

    console.log('onPullDownRefresh loadData');

    loadData()
  },

  onShareAppMessage: function () {
    return {
      title: '匿名秘密',
      desc: '一个小秘密~',
      path: '/pages/index/index'
    }
  },
});

// 加载数据
function loadData() {
  if (isloading) {
    console.log('loadData aready is loading return');
    return;
  } else {
    isloading = true
  }

  wx.showLoading({
    title: '加载中...',
    mask: true,
  });

  that.setData({
    hasMoreData: true,
  });

  SData.reload(that.data.moodList.length, location, function (success, data) {
    wx.hideLoading();

    isloading = false;

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
          });
        }

        // 非审核态计算距离
        if(!getApp().globalData.isInCheck) {
          for(var i = 0; i<data.length; i++) {
            var item = data[i];
            if(location && item.location) {
              item.locationDetail = common.getDistance(item.location.latitude, item.location.longitude,
                location.latitude, location.longitude);
            }
          }
        }

        that.setData({
          moodList: [].concat(that.data.moodList, data)
        });

        console.log('loadData finished, all length', that.data.moodList.length)
      }
    } else {
      common.dataLoading("获取数据失败，请下拉刷新重试", "failed", null)
    }
  });
}