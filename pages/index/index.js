var common = require('../../utils/common.js');
var SData = require("../../utils/sdata.js");

var isHistory;    // 是否显示为历史消息界面
var that;

Page({
  data: {
    moodList: [],
    avatar:"",
    hasMoreData: true,
    isInCheck:true,
    isInit:false,
  },

  onLoad: function (options) {
    that = this;
    if (options.isHistory) {
      isHistory = options.isHistory;
      console.log("onLoad options isHistory", isHistory);
    }

    this.setData({
      moodList:[],
    });

    common.getUserId();

    if (isHistory) {
      wx.setNavigationBarTitle({
        title: "我的秘密"
      });
    }
  },

  onShow:function () {
    var init = setInterval(function () {
      if(getApp().globalData.isInitCheck && getApp().globalData.isInitUser) {
        clearInterval(init);

        that.setData({
          isInCheck:getApp().globalData.isInCheck,
          avatar:wx.getStorageSync('my_avatar'),
          isInit:true,
        });

        if (!that.data.isInCheck) {
          // 非审核态，获取地理位置
          common.getLocation(function (res) {
            loadData();
          });

          wx.setNavigationBarTitle({
            title: "附近秘密"
          });
        }

        console.log('check init complete');
      } else {
        console.log('init ing');
      }
    }, 100);
  },

  tapVip: function () {
    wx.navigateTo({
      url: '../vip/vip'
    });
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

    if(this.data.isInCheck) {
      console.log('onPullDownRefresh in check return');
      return;
    }

    console.log('onPullDownRefresh loadData');

    // 下拉刷新，清除数据
    this.setData({
      moodList: []
    });

    loadData();
  },

  onShareAppMessage: function () {
    if(this.data.isInCheck) {
      return;
    } else {
      return {
        title: '匿名分享',
        desc: '一个小分享~',
        path: '/pages/index/index'
      }
    }
  },

  addPic: function () {
    wx.chooseImage({
      count: 1,   // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('chooseImage', res);

        var tempFilePaths = res.tempFilePaths;
        wx.navigateTo({
          url: '../pic/pic?url='+tempFilePaths,
        });
      }
    })
  }
});

// 加载数据
var isloading = false;    // 避免重复加载发送请求
function loadData() {
  if (isloading) {
    console.log('loadData already is loading return');
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

  var location = common.getLocation();
  SData.reload(isHistory, that.data.moodList.length, location, function (success, data) {
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
      common.dataLoading("获取数据失败", "failed", null)
    }
  });
}