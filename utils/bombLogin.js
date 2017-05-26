var Bmob = require("bmob.js");
var generater = require("generater.js")

function bombLogin() {
  //调用API从本地缓存中获取数据
  try {
    var value = wx.getStorageSync('user_openid')
    if (value) {
      // 如果user_openid存在，则认为是老用户
      console.log("bombLogin aready exist user_openid", value)
    } else {
      mimiLogin()
    }
  } catch (e) {
    console.log('bombLogin error', e)
  }

  wx.checkSession({
    success: function () {
      console.log('checkSession success')
    },
    fail: function () {
      //登录态过期
      console.log('checkSession fail')
      mimiLogin()
    }
  }) 
}

function mimiLogin() {
  console.log("mimiLogin start")
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log("wx.login res", res)
        Bmob.User.requestOpenId(res.code, {
          success: function (userData) {
            console.log("wx requestOpenId success userData", userData)
            // 默认用户名和密码都为用户的openid
            Bmob.User.logIn(userData.openid, userData.openid, {
              success: saveUserInfo,
              error: function (user, error) {
                if (error.code == "101") {
                  // 用户不存在，开始注册用户      
                  var user = new Bmob.User();
                  user.set("username", userData.openid);
                  user.set("password", userData.openid);
                  user.set("nickname", generater.generateNickName());
                  user.set("userPic", generater.generateAvatar());
                  user.set("userData", userData);
                  console.log('sign up start, new user', user)
                  user.signUp(null, {
                    success: saveUserInfo,
                    error: function (userData, error) {
                      console.log('sign up error', error)
                    }
                  });
                }
              }
            });
          },
          error: function (error) {
            console.log("wx requestOpenId error", error);
          }
        });
      }
    },
    fail: function() {
      console.log("wx.login error");
    }
  });
}

function saveUserInfo(user) {
  try {
    wx.setStorageSync('user_id', user.id);
    wx.setStorageSync('user_openid', user.get("userData").openid)
    wx.setStorageSync('my_nick', user.get("nickname"))
    wx.setStorageSync('my_username', user.get("username"))
    wx.setStorageSync('my_avatar', user.get("userPic"))
    console.log('login success, saveUserInfo user', user)
  } catch (e) {
    console.log(e)
  }
}

module.exports.bombLogin = bombLogin;