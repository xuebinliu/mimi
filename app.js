//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
var Login = require("utils/bombLogin.js");
var Check = require("utils/check.js");

Bmob.initialize("da4e139e60115c05e8e8e6e18fc075ec", "5cbcb1749209a7d2d8b7068bd6aa31f1");

var app;

App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function (options) {
    app = this;

    Login.bombLogin(app);
    
    Check.isInCheck(function (isInCheck) {
      app.globalData.isInCheck = isInCheck;
      app.globalData.isInitCheck = true;
      console.log("onLaunch isInCheck complete globalData", app.globalData);
    });
  },

  // 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function (options) {

  },

  // 当小程序从前台进入后台，会触发 onHide
  onHide: function() {
    // Do something when hide.
  },

  // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function(msg) {
    console.log(msg)
  },

  globalData:{
    isInitCheck:false,  // 是否初始化了check状态
    isInitUser:false,   // 是否初始化了用户id

    user_id:"",       // user object id
    isInCheck:true,   // 为了确保审核通过，默认处于审核态
  }
});