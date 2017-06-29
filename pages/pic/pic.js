// pic.js

var Bmob = require("../../utils/bmob.js");
var that;

Page({
  data: {
    url:"",
    pixelRatio:0,
    canvasWidth:0,
    canvasHeight:0,
    imageWidth:0,
    imageHeight:0,
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

    wx.getSystemInfo({
      success: res => {
        console.log('getSystemInfo success', res);
        that.setData({
          canvasWidth:res.windowWidth,
          canvasHeight:res.windowHeight,
          pixelRatio:res.pixelRatio,
        });

        wx.getImageInfo({
          src:that.data.url,
          success:function (res) {
            console.log('getImageInfo success', res);
            that.setData({
              imageWidth:res.width/that.data.pixelRatio,
              imageHeight:res.height/that.data.pixelRatio,
            });

            that.draw();
          },
        });
      }
    });


    /*
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
    */
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  draw: function () {
    var ctx = wx.createCanvasContext('myCanvas');

    // 计算x y方向的缩放比例
    var sh = this.data.canvasHeight / this.data.imageHeight;
    var sw = this.data.canvasWidth / this.data.imageWidth;

    var x = 0;
    var y = 0;
    if(sh < sw) {
      var d = sw - sh;
      x = d * this.data.canvasWidth;
    } else {
      var d = sh - sw;
      y = d * this.data.canvasHeight;
    }

    console.log('scale sh sw', sh, sw);
    ctx.scale(Math.min(sh, sw), Math.min(sh, sw));
    // ctx.scale(sw, sh);
    ctx.drawImage(that.data.url, x, y, this.data.imageWidth, this.data.imageHeight);

    if(this.data.faceRect) {
      var face = this.data.faceRect;
      console.log('faceRect', face);
      ctx.fillRect(face.left/this.data.pixelRatio, face.top/this.data.pixelRatio, face.width/this.data.pixelRatio, face.height/this.data.pixelRatio);
    }

    ctx.draw();
  },

});