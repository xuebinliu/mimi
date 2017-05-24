var Bmob = require("bmob.js");
var generater = require("generater.js")

function bombLogin() {

  //调用API从本地缓存中获取数据
  try {
    var value = wx.getStorageSync('user_openid')
    if (value) {
      console.log("老用户启动 user_openid", user_openid)
    } else {
      console.log("开始登录")
      wx.login({
        success: function (res) {
          if (res.code) {
            Bmob.User.requestOpenId(res.code, {
              success: function (userData) {

                var nickName = generater.generateNickName()
                var avatarUrl = generater.generateAvatar()
                console.log('generater nickName', nickName)
                console.log('generater avatarUrl', avatarUrl)

                // 默认用户名和密码都为用户的openid
                Bmob.User.logIn(userData.openid, userData.openid, {
                  success: saveUserInfo,
                  error: function (user, error) {
                    if (error.code == "101") {
                      // 用户不存在，开始注册用户
                      console.log('not exist user to sign up')
                      var user = new Bmob.User();
                      user.set("username", userData.openid);
                      user.set("password", userData.openid);
                      user.set("nickname", nickName);
                      user.set("userPic", avatarUrl);
                      user.set("userData", userData);
                      user.signUp(null, {
                        success: saveUserInfo,
                        error: function (userData, error) {
                          console.log('signUp error', error)
                        }
                      });
                    }
                  }
                });
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
    console.log('bombLogin', e)
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
    wx.setStorageSync('user_id', user.id);
    wx.setStorageSync('user_openid', user.get("userData").openid)
    wx.setStorageSync('my_nick', user.get("nickname"))
    wx.setStorageSync('my_username', user.get("username"))
    wx.setStorageSync('my_avatar', user.get("userPic"))
    console.log('saveUserInfo user', user)
  } catch (e) {
    console.log(e)
  }
}

module.exports.bombLogin = bombLogin;