
// 地理位置
var location = null;

function getLocation(callback) {
  if(location) {
    if(callback) {
      callback(location);
      return;
    } else {
      return location;
    }
  }

  wx.getLocation({
    success: function (res) {
      location = res;
      if(callback) {
        callback(location);
      }
      console.log('getLocation location', location);
    },
    fail:function () {
      callback(null);
    }
  });

  return null;
}

function dataLoading(txt,icon,fun){
  wx.showToast({
    title: txt,
    icon: icon,
    duration: 1000,
    success:fun
  })
}

function showModal(c,t,fun) {
    if(!t) {
      t='提示';
    }

    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

function getUserId() {
  if (getApp().globalData.user_id.length < 1) {
    var id = wx.getStorageSync("user_id");
    if (id) {
      getApp().globalData.user_id = id
    }
    console.log('reload function get user_id', getApp().globalData.user_id)
  }
  return getApp().globalData.user_id;
}

//经纬度转换成三角函数中度分表形式
function Rad(d) {
  return d * Math.PI / 180.0;
}

/**
 * 获取两个经纬度的距离
 */
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; // 输出为公里
  s = s.toFixed(1);
  return s;
}


module.exports.showModal = showModal;
module.exports.dataLoading = dataLoading;
module.exports.getUserId = getUserId;
module.exports.getDistance = getDistance;
module.exports.getLocation = getLocation;