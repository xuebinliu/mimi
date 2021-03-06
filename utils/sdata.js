
/**
 * 增量拉取列表数据
 * 
 * limit 20 每次默认加载20条
 */
var Bmob = require("bmob.js");

var app = getApp();

function reload(isMe, count, geopoint, callback) {
  console.log('reload skip count,geopoint', count, geopoint);

  var entityList = new Array();

  var Diary = Bmob.Object.extend("Diary");
  var query = new Bmob.Query(Diary);

  //条件查询
  query.skip(count);
  query.limit(15);
  query.include("publisher");

  if (getApp().globalData.isInCheck || isMe) {
    // 审核态或者是拉自己的历史数据，则只拉取自己的数据
    query.descending("createdAt");
    var user = new Bmob.User();
    user.id = getApp().globalData.user_id;
    query.equalTo("publisher", user);
  } else {
    if(geopoint) {
      query.near("location", new Bmob.GeoPoint({latitude: geopoint.latitude, longitude: geopoint.longitude}))
    } else {
      query.descending("commentNum");
    }
  }

  console.log("reload query", query);

  // 查询所有数据
  query.find({
    success: function (results) {
      console.log('reload success results length', results.length);

      for (var i = 0; i < results.length; i++) {
        // 发布者的user id、标题、内容
        var publisherId = results[i].get("publisher").id;
        var title = results[i].get("title");
        var content = results[i].get("content");

        var id = results[i].id;
        var createdAt = results[i].createdAt;
        var likeNum = results[i].get("likeNum");
        var commentNum = results[i].get("commentNum");

        // 密码附带的照片
        var _url = null;
        var pic = results[i].get("pic");
        if (pic) {
          _url = results[i].get("pic")._url;
        }

        // 发布者的昵称和头像
        var name = results[i].get("publisher").get("nickname");
        var userPic = results[i].get("publisher").get("userPic");

        // 自己是否赞过
        var liker = results[i].get("liker");
        var isLike = 0;
        if(liker) {
          for (var j = 0; j < liker.length; j++) {
            if (liker[j] == app.globalData.user_id) {
              isLike = 1;
              break;
            }
          }
        }

        // 发布者的位置信息
        var location = results[i].get("location");

        var entity = {
          "title": title || '',
          "content": content || '',
          "id": id || '',
          "avatar": userPic || '',
          "created_at": createdAt || '',
          "attachment": _url || '',
          "likes": likeNum,
          "comments": commentNum,
          "is_liked": isLike || '',
          "username": name || '',
          "location": location,
          "isInCheck": getApp().globalData.isInCheck,
        };

        entityList.push(entity)
      }

      callback(true, entityList)
    },
    error: function (error) {
      callback(false, null);
      console.log('reload data net error', error);
    }
  });
}

module.exports = {
  reload: reload,
};