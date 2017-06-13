var Bmob = require("bmob.js");
var generator = require("generator.js");

function bombLogin() {
  //调用API从本地缓存中获取数据
  try {
    var value = wx.getStorageSync('user_openid');
    if (value) {
      // 如果user_openid存在，则认为是老用户
      console.log("bombLogin aready exist user_openid", value);
    } else {
      mimiLogin();
    }
  } catch (e) {
    console.log('bombLogin error', e);
  }

  wx.checkSession({
    success: function () {
      console.log('checkSession success');
    },
    fail: function () {
      //登录态过期
      console.log('checkSession fail');
      mimiLogin();
    }
  }) 
}

function mimiLogin() {
  console.log("mimiLogin start");
  wx.login({
    success: function (res) {
      console.log("wx.login success res", res);
      if (res.code) {
        Bmob.User.requestOpenId(res.code, {
          success: function (userData) {
            console.log("wx requestOpenId success userData", userData);
            wx.getUserInfo({
              success: function(result) {
                console.log("wx getUserInfo success result", result);
                var userInfo = result.userInfo;
                // 获取昵称和头像
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                var gender = userInfo.gender;
                var city = userInfo.city;

                // 默认用户名和密码都为用户的openid
                Bmob.User.logIn(userData.openid, userData.openid, {
                  success: function(user) {
                    console.log("Bmob login success");
                    saveUserInfo(user);
                  },
                  error: function (user, error) {
                    if (error.code == "101") {
                      // 用户不存在，开始注册用户
                      var user = new Bmob.User();
                      user.set("username", userData.openid);
                      user.set("password", userData.openid);
                      user.set("nickname", nickName);
                      user.set("userPic", avatarUrl);
                      user.set("gender", gender);
                      user.set("city", city);
                      user.set("userData", userData);
                      console.log('sign up start');
                      user.signUp(null, {
                        success: function (user) {
                          console.log("Bmob signUp success, new user", user);
                          saveUserInfo(user);
                        },
                        error: function (userData, error) {
                          console.log('Bmob signUp error', error);
                        }
                      });
                    } else {
                      console.log('Bmob logIn error', error);
                    }
                  }
                });
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
    wx.setStorageSync('user_openid', user.get("userData").openid);
    wx.setStorageSync('my_nick', user.get("nickname"));
    wx.setStorageSync('my_username', user.get("username"));
    wx.setStorageSync('my_avatar', user.get("userPic"));
  } catch (e) {
    console.log(e)
  }
}

module.exports.bombLogin = bombLogin;