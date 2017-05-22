var Bmob = require("bmob.js");
var app = getApp()

function bombLogin() {

  //调用API从本地缓存中获取数据
  try {
    var value = wx.getStorageSync('user_openid')
    if (value) {
      // 已经登录过的用户
      console.log("老用户启动")
    }
    else {
      console.log("开始登录")
      wx.login({
        success: function (res) {
          if (res.code) {
            Bmob.User.requestOpenId(res.code, {
              success: function (userData) {
                wx.getUserInfo({
                  success: function (result) {
                    var userInfo = result.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl

                    // 默认密码为用户的openid
                    Bmob.User.logIn(nickName, userData.openid, {
                      success: saveUserInfo,
                      error: function (user, error) {
                        if (error.code == "101") {
                          // 用户不存在，开始注册用户
                          var user = new Bmob.User();
                          user.set("username", nickName);
                          user.set("password", userData.openid);
                          user.set("nickname", nickName);
                          user.set("userPic", avatarUrl);
                          user.set("userData", userData);
                          user.signUp(null, {
                            success: saveUserInfo,
                            error: function (userData, error) {
                              console.log(error)
                            }
                          });
                        }
                      }
                    });
                  }
                })
              },
              error: function (error) {
                // Show the error message somewhere
                console.log("Error: " + error.code + " " + error.message);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  } catch (e) {
    console.log(e)
  }

  wx.checkSession({
    success: function () {
    },
    fail: function () {
      //登录态过期
      wx.login()
    }
  }) 
}

function saveUserInfo(user) {
  try {
    app.globalData.user_id = user.id;
    
    wx.setStorageSync('user_openid', user.get("userData").openid)
    wx.setStorageSync('user_id', user.id);
    wx.setStorageSync('my_nick', user.get("nickname"))
    wx.setStorageSync('my_username', user.get("username"))
    wx.setStorageSync('my_avatar', user.get("userPic"))
  } catch (e) {
  }
  console.log("登录成功");
}

module.exports.bombLogin = bombLogin;