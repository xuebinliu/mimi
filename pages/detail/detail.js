
//获取应用实例
var app = getApp()
var common = require('../../utils/common.js')
var Bmob = require("../../utils/bmob.js")
var commentlist;
var that;
var optionId;

Page({
  data: {
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    agree: 0,             // 自己是否赞
    
    isInCheck:true,

    listTitle: "",      // 秘密的标题
    listContent: "",    // 秘密的内容
    listPic: "",        // 秘密的图片
    agreeNum: 0,        // 赞的数量
    commNum: 0,         // 评论的数量
    userPic: "",        // 发布者头像
    userNick: "",       // 发布者昵称
    isMine: false,      // 是否自己发布的
    createdAt:"",       // 发布时间

  },

  onLoad: function (options) {
    that = this;
    common.getUserId()
    optionId = options.moodId
  },

  onReady: function () {
    wx.hideToast()
  },

  onShow: function () {
    this.setData({
      isInCheck: getApp().globalData.isInCheck,
    });

    this.refresh();
  },

  refresh: function() {
    var Diary = Bmob.Object.extend("Diary");
    var query = new Bmob.Query(Diary);
    query.equalTo("objectId", optionId);
    query.include("publisher");
    query.find({
      success: function (result) {
        var title = result[0].get("title");
        var content = result[0].get("content");
        var publisher = result[0].get("publisher");
        var agreeNum = result[0].get("likeNum");
        var commentNum = result[0].get("commentNum");
        var liker = result[0].get("liker");
        var userNick = publisher.get("nickname");
        // 发布者头像
        var userPic = null;
        if (publisher.get("userPic")) {
          userPic = publisher.get("userPic");
        }
        // 秘密详情的照片
        var url = null;
        if (result[0].get("pic")) {
          url = result[0].get("pic")._url;
        }

        that.setData({
          listTitle: title,
          listContent: content,
          listPic: url,
          createdAt: result[0].createdAt,
          agreeNum: agreeNum,
          commNum: commentNum,
          userPic: userPic,
          userNick: userNick,
          loading: true,
          isMine: publisher.id == app.globalData.user_id
        });

        for (var i = 0; i < liker.length; i++) {
          var isLike = 0;
          if (liker[i] == app.globalData.user_id) {
            isLike = 1;
            that.setData({
              agree: isLike
            });
            break;
          }
        }

        that.commentQuery(result[0]);
      },
      error: function (error) {
        that.setData({
          loading: true
        });
        console.log(error);
      }
    });
  },

  commentQuery: function (mood) {
    // 查询评论
    var Comments = Bmob.Object.extend("Comments");
    var queryComment = new Bmob.Query(Comments);
    queryComment.equalTo("mood", mood);
    queryComment.include("publisher");
    queryComment.descending("createdAt");
    queryComment.find({
      success: function (result) {
        commentlist = new Array();
        for (var i = 0; i < result.length; i++) {
          var id = result[i].id;
          var pid = result[i].get("olderComment");
          var uid = result[i].get("publisher").id;
          var content = result[i].get("content");
          var created_at = result[i].createdAt;
          var olderUserName;
          var userPic = result[i].get("publisher").get("userPic");
          var nickname = result[i].get("publisher").get("nickname");
          if (pid) {
            pid = pid.id;
            olderUserName = result[i].get("olderUserName");
          } else {
            pid = 0;
            olderUserName = "";
          }

          var commentObj = {
            id: id,
            content: content,
            pid: pid,
            uid: uid,
            created_at: created_at,
            pusername: olderUserName,
            username: nickname,
            avatar: userPic,
          };

          commentlist.push(commentObj)
        }

        that.setData({
          commentList: commentlist,
          loading: true
        })
      },
      error: function (error) {
        common.dataLoading(error, "loading");
        console.log(error)
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: that.data.listTitle,
      desc: that.data.listContent,
      path: '/pages/detail/detail?moodId=' + optionId,
    }
  },

  // 点赞
  changeLike: function (event) {
    var isLike = that.data.agree
    var likeNum = parseInt(this.data.agreeNum)
    if (isLike == "0") {
      likeNum = likeNum + 1;
      that.setData({
        agree: 1,
        agreeNum: likeNum
      })
    } else if (isLike == "1") {
      likeNum = likeNum - 1;
      that.setData({
        agree: 0,
        agreeNum: likeNum
      })
    }

    var Diary = Bmob.Object.extend("Diary");
    var queryLike = new Bmob.Query(Diary);
    queryLike.equalTo("objectId", optionId);
    queryLike.find({
      success: function (result) {
        var likerArray = result[0].get("liker");
        var isLiked = false;
        if (likerArray.length > 0) {
          // 已赞，则取消赞
          for (var i = 0; i < likerArray.length; i++) {
            if (likerArray[i] == app.globalData.user_id) {
              likerArray.splice(i, 1);
              isLiked = true;
              result[0].set('likeNum', result[0].get("likeNum") - 1);
              break;
            }
          }
          if (isLiked == false) {
            // 自己没赞过，则增加赞
            likerArray.push(app.globalData.user_id);
            result[0].set('likeNum', result[0].get("likeNum") + 1);
          }
        } else {
          // 没人赞过，则增加赞
          likerArray.push(app.globalData.user_id);
          result[0].set('likeNum', result[0].get("likeNum") + 1);
        }
        // 保存
        result[0].save();
      },
    });
  },

  changeComment: function () {
    that.setData({
      autoFo: true
    })
  },

  changeFocus: function () {
    that.setData({
      autoFo: true
    })
  },

  // 去回复
  toResponse: function (event) {
    var commentId = event.target.dataset.id;
    var userId = event.target.dataset.uid;
    var name = event.target.dataset.name;
    if (!name) {
      name = "";
    }

    if (userId == app.globalData.user_id) {
      common.dataLoading("不能对自己的评论进行回复", "loading");
    } else {
      var toggleResponse;
      if (that.data.isToResponse == "true") {
        toggleResponse = false;
      } else {
        toggleResponse = true;
      }

      that.setData({
        pid: commentId,
        isToResponse: toggleResponse,
        plaContent: "回复" + name + ":",
        resopneName: name
      })
    }
  },

  hiddenResponse: function () {
    this.setData({
      isToResponse: false
    })
  },

  //删除
  deleteThis: function () {
    wx.showModal({
      title: '是否删除秘密？',
      content: '删除后将不能恢复',
      showCancel: true,
      confirmColor: "#a07c52",
      cancelColor: "#646464",
      success: function (res) {
        if (res.confirm) {
          // 删除此心情后返回上一页
          var Diary = Bmob.Object.extend("Diary");
          var queryDiary = new Bmob.Query(Diary);
          queryDiary.get(optionId, {
            success: function (result) {
              result.destroy({
                success: function (myObject) {
                  // 删除成功
                  common.dataLoading("删除成功", "success", function () {
                    wx.reLaunch({
                      url: '../index/index',
                    });
                  });
                },
                error: function (myObject, error) {
                  // 删除失败
                  console.log(error)
                }
              });
            },
          });
        }
      }
    })
  },

  //评论
  publishComment: function (e) {
    if (e.detail.value.commContent == "") {
      common.dataLoading("评论内容不能为空", "loading");
      return
    } 

    that.setData({
      isdisabled: true,
      commentLoading: true
    })

    console.log('publishComment start user_id', app.globalData.user_id)

    // 要评论的秘密对象
    var Diary = Bmob.Object.extend("Diary");
    var diary = new Diary();
    diary.id = optionId;
    // 自己的用户对象
    var me = new Bmob.User();
    me.id = app.globalData.user_id;
    // 评论对象
    var Comments = Bmob.Object.extend("Comments");
    var comment = new Comments();
    comment.set("publisher", me);
    comment.set("mood", diary);
    comment.set("content", e.detail.value.commContent);
    if (that.data.isToResponse) {
      // 要回复的用户信息
      var olderName = that.data.resopneName;
      var Comments1 = Bmob.Object.extend("Comments");
      var comment1 = new Comments1();
      comment1.id = that.data.pid;
      comment.set("olderUserName", olderName);
      comment.set("olderComment", comment1);
    }

    // 保存评论到服务器
    comment.save(null, {
      success: function (res) {
        console.log('publishComment save success comment id', res.id)
        var queryDiary = new Bmob.Query(Diary);
        queryDiary.get(optionId, {
          success: function (object) {
            // 保存成功后，秘密的评论数加1
            object.set('commentNum', object.get("commentNum") + 1);
            object.save();
            console.log('publishComment commentNum + 1')
            // 从新拉取数据
            that.refresh();
          },
        });

        that.setData({
          publishContent: "",
          isToResponse: false,
          responeContent: "",
          isdisabled: false,
          commentLoading: false
        })
      },
      error: function (gameScore, error) {
        common.dataLoading(error, "loading");
        console.log('publishComment save error', error)

        that.setData({
          publishContent: "",
          isToResponse: false,
          responeContent: "",
          isdisabled: false,
          commentLoading: false
        })
      }
    });
  },

  bindKeyInput: function (e) {
    this.setData({
      publishContent: e.detail.value
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  seeBig: function (e) {
    wx.previewImage({
      current: that.data.listPic, // 当前显示图片的http链接
      urls: [that.data.listPic]   // 需要预览的图片http链接列表
    })
  }
})
