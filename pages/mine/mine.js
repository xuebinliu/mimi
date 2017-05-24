
//获取应用实例
var app = getApp()
var that;
var common = require('../../utils/common.js');
var Bmob=require("../../utils/bmob.js");

Page({
  onLoad: function(options) {
      that=this;   
      that.setData({
        upImg:true,
        loading:false,
        isdisabled:false,
        modifyLoading:false
      }) 
  },

  onReady:function(){
     wx.hideToast() 
  },

  onShow: function() {
    wx.getStorage({
      key: 'my_avatar',
      success: function (res) {
        that.setData({
          userImg: res.data,
          loading: true
        })
      }
    })

    wx.getStorage({
      key: 'my_nick',
      success: function (res) {
        that.setData({
          userName: res.data,
          inputValue: res.data
        })
      }
    })
  },

  //修改头像
  modifyImg:function(){
    var key = app.globalData.user_id
    if (key) {
      wx.showActionSheet({
        itemList: ['相册', '拍照'],
        success: function (res) {
          if (!res.cancel) {
            var sourceType = [];
            if (res.tapIndex == 0) {
              sourceType = ['album']//从相册选择
            }
            else if (res.tapIndex == 1) {
              sourceType = ['camera']//拍照
            }

            wx.chooseImage({
              count: 1, 
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
              success: function (imageResult) {
                that.setData({
                  upImg: false
                })
                var tempFilePaths = imageResult.tempFilePaths;
                if (tempFilePaths.length > 0) {
                  var name = tempFilePaths;
                  var file = new Bmob.File(name, tempFilePaths);
                  // 保存自定义头像文件到服务器
                  file.save().then(function (resu) {
                    wx.setStorageSync('my_avatar', resu.url());
                    that.setData({
                      upImg: true
                    });

                    var newImge = resu.url();
                    wx.getStorage({
                      key: 'user_openid',
                      success: function (openid) {
                        var openid = openid.data
                        var user = Bmob.User.logIn(openid, openid, {
                          success: function (users) {
                            users.set('userPic', newImge);
                            users.save(null, {
                              success: function (user) {
                                that.setData({
                                  userImg: newImge
                                })
                                common.dataLoading("修改头像成功", "success");
                              }
                            });
                          }
                        });
                      }, function(error) {
                        console.log(error);
                      }
                    })
                  }, function (error) {
                    that.setData({
                      upImg: true
                    })
                    common.dataLoading(error, "loading");
                    console.log(error);
                  })
                }
              }
            })
          }
        }
      })
    }
  },

  hiddenComment:function(){
    that.setData({
      isModifyNick:false,
      inputValue:that.data.userName
    })
  },

  //同步input和昵称显示
  bindKeyInput: function(e) {
    that.setData({
      inputValue: e.detail.value
    })
  },

  modifyNick:function(){
    that.setData({
      isModifyNick:true,
    })
  },

  //修改昵称
  modyfiNick:function(e){
    that.setData({
      isdisabled:true,
      modifyLoading:true
    })

    wx.getStorage({
      key: 'user_openid',
      success: function (openid) {
        var openid = openid.data;
        var user = Bmob.User.logIn(openid, openid, {
          success: function (users) {
            users.set('nickname', e.detail.value.changeNick);  // attempt to change username
            users.save(null, {
              success: function (user) {
                wx.setStorageSync('my_nick', e.detail.value.changeNick);
                that.setData({
                  userName: that.data.inputValue,
                  isModifyNick: false,
                  isdisabled: false,
                  modifyLoading: false
                })
                common.dataLoading("修改昵称成功", "success");
              },
              error: function (error) {
                common.dataLoading(res.data.error, "loading");
                that.setData({
                  isModifyNick: false,
                  isdisabled: false,
                  modifyLoading: false,
                  inputValue: that.data.userName
                })
              }
            });
          }
        });
      }, function(error) {
        console.log(error);
      }
    })
  },

  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})
