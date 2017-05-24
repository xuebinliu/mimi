
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var that;

Page({
  onLoad: function (options) {
    that = this;
  },

  //提交建议
  formSubmit: function (e) {
    if (e.detail.value.advise == "" || e.detail.value.advise == null) {
      common.dataLoading("建议不能为空", "loading");
    } else {
      var Advise = Bmob.Object.extend("Advise")
      var advise = new Advise()
      advise.set("content", e.detail.value.advise)

      var user = new Bmob.User();
      user.id = getApp().globalData.user_id
      advise.set("publisher", user);

      advise.save(null, {
        success: function() {
          common.showModal("发送建议成功", null, function(){
            wx.navigateBack();
          })
        },
        error: function() {
          common.showModal("发送失败，请检查网络", null, null)
        }
      })
    }
  },
  
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
