var Bmob = require("bmob.js");
var generator = require("generator.js");

function bombLogin(app) {
  var value = wx.getStorageSync('user_openid');
  if (value) {
    // 如果user_openid存在，则认为是老用户
    app.globalData.user_id = wx.getStorageSync('user_id');
    app.globalData.isInitUser = true;
    console.log("bombLogin already", app.globalData);
  } else {
    mimiLogin();
  }

  // 检测微信登陆是否过期
  wx.checkSession({
    success: function () {
      console.log('checkSession success');
    },
    fail: function () {
      //登录态过期 重新登录
      console.log('checkSession fail');
      mimiLogin(app);
    }
  }) 
}

function mimiLogin(app) {
  console.log("mimiLogin start");
  wx.login({
    success: function (res) {
      console.log("wx.login success res", res);
      if (res.code) {
        Bmob.User.requestOpenId(res.code, {
          success: function (userData) {
            console.log("wx requestOpenId success userData", userData);
            wx.getUserInfo({
              // 为了获取用户的性别，必须获取用户的信息
              success: function(result) {
                console.log("wx getUserInfo success result", result);
                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                var gender = userInfo.gender;
                var city = userInfo.city;

                // 默认用户名和密码都为用户的openid
                Bmob.User.logIn(userData.openid, userData.openid, {
                  success: function(user) {
                    console.log("Bmob login success");
                    saveUserInfo(user, app);
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
                          saveUserInfo(user, app);
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
              },
              fail: function () {
                // 获取用户信息失败
                console.log("wx getUserInfo success fail");
                // 默认用户名和密码都为用户的openid
                Bmob.User.logIn(userData.openid, userData.openid, {
                  success: function(user) {
                    console.log("Bmob login success");
                    saveUserInfo(user, app);
                  },
                  error: function (user, error) {
                    if (error.code == "101") {
                      // 用户不存在，开始注册用户
                      var user = new Bmob.User();
                      user.set("username", userData.openid);
                      user.set("password", userData.openid);
                      // 随机产生昵称和头像，然后直接注册或登录
                      user.set("nickname", generator.generateNickName());
                      user.set("userPic", generator.generateAvatar());
                      user.set("userData", userData);
                      console.log('sign up start');
                      user.signUp(null, {
                        success: function (user) {
                          console.log("Bmob signUp success, new user", user);
                          saveUserInfo(user, app);
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

function saveUserInfo(user, app) {
  try {
    app.globalData.user_id = user.id;
    app.globalData.isInitUser = true;

    console.log('saveUserInfo', user, app);

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