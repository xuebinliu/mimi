// pic.js
var common = require('../../utils/common.js');
var Bmob = require("../../utils/bmob.js");
var that;

var x = 0;
var y = 0;

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
      url:options.url,
      faceRect:null,
    });

    wx.showLoading({
      title:'分析中...',
      mask:true,
    });

    wx.getSystemInfo({
      success: res => {
        console.log('getSystemInfo success', res);
        that.setData({
          canvasWidth:res.windowWidth,
          canvasHeight:res.windowHeight - 40,
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
          },
        });
      }
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
          console.log('save file success', res);
          that.setData({
            faceRect:res.data.faces
          });
          wx.hideLoading();
          that.draw();
        },
        fail:error=>{
          console.log('save file  error', error);
        }
      });

    }, function (error) {
      console.log('Bmob.File save error', error);
    });
  },

  draw: function () {
    var ctx = wx.createCanvasContext('myCanvas');

    // 计算x y方向的缩放比例
    var sh = this.data.canvasHeight / this.data.imageHeight;
    var sw = this.data.canvasWidth / this.data.imageWidth;

    var s = Math.min(sh, sw);
    if(sh < sw) {
      x = (this.data.canvasWidth - this.data.imageWidth*s)/2;
    } else {
      y = (this.data.canvasHeight - this.data.imageHeight*s)/2;
    }

    ctx.scale(s, s);

    // 画图片
    ctx.drawImage(that.data.url, x, y, this.data.imageWidth, this.data.imageHeight);

    // 画猫脸
    if(this.data.faceRect) {
      for(var i=0; i<this.data.faceRect.length; i++) {
        var face = this.data.faceRect[i].face_rectangle;
        console.log('draw face rect', face);
        ctx.drawImage("../../images/cat.png",
          x + face.left/this.data.pixelRatio,
          y + face.top/this.data.pixelRatio,
          face.width/this.data.pixelRatio,
          face.height/this.data.pixelRatio);
      }
    }

    ctx.draw();
  },

  tapSave:function () {
    wx.canvasToTempFilePath({
      x:x,
      y:y,
      width:this.data.canvasWidth - x,
      height:this.data.canvasHeight - y,
      destWidth:this.data.imageWidth,
      destHeight:this.data.imageHeight,
      canvasId:'myCanvas',
      success: function(res) {
        console.log('toSave success file path', res.tempFilePath);
        var file = new Bmob.File(res.tempFilePath, [res.tempFilePath]);
        file.save().then(function (res) {
          console.log('Bmob.File save success', res);
          wx.setClipboardData({
            data:res.url(),
            success:function (res) {
              console.log('setClipboardData success', res);
              wx.showToast({
                title: '下载链接在剪切板',
                duration:3000,
              })
            }
          });
        });
      },
      fail: function (res) {
        console.log('toSave fail', res);
      }
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

});