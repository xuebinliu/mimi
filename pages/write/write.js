/**
 * 写秘密
 *
 * @type {Bmob}
 */

var Bmob = require("../../utils/bmob.js");
var common = require('../../utils/common.js');
var that = null;
var location = null;

Page({
  data: {
    src: "",
    isSrc: false,
    title: "",
    content: "",
    autoFocus: true,
    isdisabled: false,
    hidePublishing: true
  },

  onLoad: function() {
    that = this;
    common.getUserId()
  },

  onReady: function() {
    if(!getApp().globalData.isInCheck) {
      wx.getLocation({
        success: function (res) {
          location = res;
          console.log('getLocation location', location);
        },
      });
    }
  },

  //选择图片
  uploadPic:function(){
    wx.chooseImage({
      count: 1,   // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) { 
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          isSrc:true,
          src:tempFilePaths
        })
      }
    })
  },

  //删除图片
  clearPic:function(){
    that.setData({
      isSrc:false,
      src:""
    })
  },
  
  //秘密内容
  setContent:function(e){
    that.setData({
      content:e.detail.value
    }) 
  },

  //秘密标题
  setTitle:function(e){
    that.setData({
      title:e.detail.value
    }) 
  },

  //保存秘密
  sendNewMood: function(e) {
    //判断秘密是否为空
    var content = e.target.dataset.content;
    var title = e.target.dataset.title;
    if(content == ""){
      common.dataLoading("秘密内容不能为空哦","loading");
      return;
    }

    // 禁用发布按钮，显示发布进度弹窗
    that.setData({
      isdisabled:true,
      hidePublishing:false
    });

    var Diary = Bmob.Object.extend("Diary");
    var diary = new Diary();

    var me = new Bmob.User();
    me.id = getApp().globalData.user_id;
    diary.set("publisher", me);

    // location
    if(location) {
      var geoPoint = new Bmob.GeoPoint({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      diary.set("location", geoPoint);
    }

    diary.set("title", title);
    diary.set("content", content);
    diary.set("likeNum", 0);
    diary.set("commentNum", 0);
    diary.set("liker", []);
    if (that.data.isSrc == true) {
      var name = that.data.src;
      //上传的图片的别名
      var file = new Bmob.File(name, that.data.src);
      file.save();
      diary.set("pic", file);
    }

    console.log('sendNewMood user_id', me.id);

    diary.save(null, {
      success: function (result) {
        that.setData({
          isdisabled: false,
          hidePublishing: true
        });

        common.dataLoading("发布成功", "success", function () {
          wx.reLaunch({
            url: '../index/index',
          });
        });
      },
      error: function (result, error) {
        // 添加失败
        console.log('save diary error', error);
        common.dataLoading("发布失败", "loading");
        that.setData({
          isdisabled: false,
          hidePublishing: true
        });
      }
    });
  },
  
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  }
});
