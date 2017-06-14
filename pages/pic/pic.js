// pic.js

var that;

Page({
  data: {
    url:"",
    width:0,
    height:0,
    imageWidth:0,
    imageHeight:0,
    drawing:false,
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
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  draw: function () {
    var ctx = wx.createCanvasContext('myCanvas');

    var sh = this.data.height / this.data.imageHeight;
    var sw = this.data.width / this.data.imageWidth;

    var x = 0;
    var y = 0;
    if(sh < sw) {
      var d = sw - sh;
      x = d * this.data.width;
    } else {
      var d = sh - sw;
      y = d * this.data.height;
    }

    console.log('scale sh sw', sh, sw);
    ctx.scale(Math.min(sh, sw), Math.min(sh, sw));
    ctx.drawImage(that.data.url, x, y, this.data.imageWidth, this.data.imageHeight);
    ctx.draw();
  },

  imageLoad:function (e) {
    console.log('imageLoad', e);
    wx.getSystemInfo({
      success: res => {
        console.log('getSystemInfo', res);
        // 保存绘制区域和图片的宽高rpx大小
        that.setData({
          width:res.windowWidth,
          height:res.windowHeight,
          imageWidth:e.detail.width/res.pixelRatio,
          imageHeight:e.detail.height/res.pixelRatio,
        });

        that.setData({
          drawing:true,
        });
        that.draw();
      }
    });
  }

});