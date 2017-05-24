
//获取应用实例
var Bmob=require("../../utils/bmob.js");
var common = require('../../utils/common.js');
var that;
var location;

Page({
  data: {
    src: "",
    isSrc: false,
    title: "",
    content: "",
    autoFocus: true,
    isdisabled: false
  },

  onLoad: function(options) {
    that=this;
    common.getUserId()
  },

  onShow: function() {
    wx.getLocation({
      success: function(res) {
        location = res
        console.log('getLocation location', location)
      },
    })
  },

  //选择图片
  uploadPic:function(){
    wx.chooseImage({
      count: 1,   // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) { 
        var tempFilePaths = res.tempFilePaths
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
    var content=e.target.dataset.content;
    var title=e.target.dataset.title;
    if(content==""){
      common.dataLoading("秘密内容不能为空哦","loading");
    }
    else{
      that.setData({
        isdisabled:true
      }) 
      
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
        })
        diary.set("location", geoPoint)
      } else {
        // 没有位置信息
        // common.showModal("没有位置信息是否发送？",null, function(){

        // })
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

      console.log('sendNewMood user_id', me.id)

      diary.save(null, {
        success: function (result) {
          that.setData({
            isdisabled: false
          })
          // 添加成功，返回成功之后的objectId
          //（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          common.dataLoading("发布秘密成功", "success", function () {
            wx.navigateBack({
              delta: 1
            })
          });
        },
        error: function (result, error) {
          // 添加失败
          console.log(error)
          common.dataLoading("发布秘密失败", "loading");
          that.setData({
            isdisabled: false
          })
        }
      });
    }
  },
  
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  }
})
