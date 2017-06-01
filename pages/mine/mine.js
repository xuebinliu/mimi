
//获取应用实例
var common = require('../../utils/common.js');
var generater = require('../../utils/generator.js');
var Bmob=require("../../utils/bmob.js");
var app = getApp()
var that

Page({
  onLoad: function(options) {
      that=this;   
      that.setData({
        uploadingImg:false,    // 是否正在上传头像
        isdisabled:false,
        modifyLoading:false
      }) 
  },

  onShow: function() {
    // 获取头像
    wx.getStorage({
      key: 'my_avatar',
      success: function (res) {
        that.setData({
          userImg: res.data,
        })
      }
    })

    // 获取昵称
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

  // 点击建议
  tapAdvise: function() {
    wx.navigateTo({
      url: '../advise/advise',
    })
  },

  // 点击关于
  tapAbout: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  // 点击修改头像
  tapModifyAvatar: function(){
    var key = app.globalData.user_id
    if (key) {
      wx.showActionSheet({
        itemList: ['随机', '相册', '拍照'],
        success: function (res) {
          if (!res.cancel) {
            var sourceType = [];
            if (res.tapIndex == 0) {
              // 随机
              var avatar_url = generater.generateAvatar();
              that.modifyUserAvatar(avatar_url)
              return
            } else if (res.tapIndex == 1) {
              sourceType = ['album']//从相册选择
            } else if (res.tapIndex == 2) {
              sourceType = ['camera']//拍照
            }

            wx.chooseImage({
              count: 1, 
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
              success: function (imageResult) {
                that.saveAvatarFile(imageResult)
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

  modifyNick: function(){
    that.setData({
      isModifyNick:true,
    })
  },

  // 保存头像
  saveAvatarFile: function (imageResult) {
    // 开始上传
    that.setData({
      uploadingImg: true
    })

    var tempFilePaths = imageResult.tempFilePaths;
    if (tempFilePaths.length > 0) {
      var name = tempFilePaths;
      var file = new Bmob.File(name, tempFilePaths);
      // 保存到服务器
      file.save().then(function (resu) {
        that.modifyUserAvatar(resu.url())
      }, function (error) {
        that.setData({
          uploadingImg: false
        })
        common.dataLoading("修改头像失败", "loading");
        console.log(error);
      })
    }
  },

  modifyUserAvatar: function(url) {
    wx.setStorageSync('my_avatar', url);
    that.setData({
      uploadingImg: false
    });

    wx.getStorage({
      key: 'user_openid',
      success: function (openid) {
        // 保存到用户属性
        var openid = openid.data
        var user = Bmob.User.logIn(openid, openid, {
          success: function (users) {
            users.set('userPic', url);
            users.save(null, {
              success: function (user) {
                that.setData({
                  userImg: url
                })
                common.dataLoading("修改头像成功", "success");
              },
            });
          },

          error: function (error) {
            console.log('error', error)
            common.dataLoading("修改头像失败", "loading");
          }
        });
      },
      fail: function (error) {
        // 查找openid失败
        common.dataLoading("修改头像失败", "loading");
        console.log(error);
      }
    })
  },

  //修改昵称
  modifyNickName: function (e) {
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
