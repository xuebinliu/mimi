// pic.js


var Bmob = require("../../utils/bmob.js");
var that;
var sysInfo;

Page({
  data: {
    url:"",
    imageWidth:0,
    imageHeight:0,
    drawing:false,
    faceRect:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad', options);
    that = this;
    this.setData({
      url:options.url
    });

    var file = new Bmob.File(this.data.url, [this.data.url]);
    file.save().then(function (res) {
      console.log('Bmob.File save success', res);
      wx.request({
        url:"https://api-cn.faceplusplus.com/facepp/v3/detect",
        method:"POST",
        header:{
          'content-type':'application/x-www-form-urlencoded',
        },
        data:{
          'api_key':'670VyyGhCZdifKU1TG8up-yojKaZ7Xpl',
          'api_secret':'_IA54Z4NPSe7KcRmAViWq1HqspI_8_iE',
          'image_url':res.url(),
        },
        success:res=>{
          console.log('wx.request success', res);
          that.setData({
            faceRect:res.data.faces[0].face_rectangle
          });
          that.draw();
        },
        fail:error=>{
          console.log('wx.request error', error);
        }
      });

    }, function (error) {
      console.log('Bmob.File save error', error);
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  draw: function () {
    var ctx = wx.createCanvasContext('myCanvas');

    var sh = sysInfo.windowHeight / this.data.imageHeight;
    var sw = sysInfo.windowWidth / this.data.imageWidth;

    var x = 0;
    var y = 0;
    if(sh < sw) {
      var d = sw - sh;
      x = d * sysInfo.windowWidth;
    } else {
      var d = sh - sw;
      y = d * sysInfo.windowHeight;
    }

    console.log('scale sh sw', sh, sw);
    ctx.scale(Math.min(sh, sw), Math.min(sh, sw));
    ctx.drawImage(that.data.url, x, y, this.data.imageWidth, this.data.imageHeight);

    if(this.data.faceRect) {
      var face = this.data.faceRect;
      console.log('faceRect', face);
      ctx.fillRect(face.left/sysInfo.pixelRatio, face.top/sysInfo.pixelRatio, face.width/sysInfo.pixelRatio, face.height/sysInfo.pixelRatio);
    }

    ctx.draw();
  },

  imageLoad:function (e) {
    console.log('imageLoad', e);
    wx.getSystemInfo({
      success: res => {
        console.log('getSystemInfo', res);
        sysInfo = res;
        // 保存绘制区域和图片的宽高rpx大小
        that.setData({
          imageWidth:e.detail.width/sysInfo.pixelRatio,
          imageHeight:e.detail.height/sysInfo.pixelRatio,
        });

        that.setData({
          drawing:true,
        });
        that.draw();
      }
    });
  }

});