//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
var Login = require("utils/bombLogin.js");
var Check = require("utils/check.js");

Bmob.initialize("da4e139e60115c05e8e8e6e18fc075ec", "5cbcb1749209a7d2d8b7068bd6aa31f1");

App({
  onLaunch: function () {
    Login.bombLogin();
    
    Check.isInCheck(function (isInCheck) {
      getApp().globalData.isInCheck = isInCheck;
      console.log("onLaunch globalData", getApp().globalData);
    });
  },

  onShow:function(){
    
  },
  
  globalData:{
    user_id:"",
    isInCheck:true,   // 为了确保审核通过，默认处于审核态
  },

  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  },
  
  onError: function(msg) {
    
  }
});