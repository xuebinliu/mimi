//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
var Login = require("utils/bombLogin.js");

Bmob.initialize("da4e139e60115c05e8e8e6e18fc075ec", "5cbcb1749209a7d2d8b7068bd6aa31f1");

App({
  onLaunch: function () {
    Login.bombLogin()
  },

  onShow:function(){
    
  },
  
  globalData:{
    user_id:""
  },

  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  
  onError: function(msg) {
    
  }
})