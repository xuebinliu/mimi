
function dataLoading(txt,icon,fun){
  wx.showToast({
    title: txt,
    icon: icon,
    duration: 500,
    success:fun
  })
}

function showModal(c,t,fun) {
    if(!t)
        t='提示'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

function getUserId() {
  if (!getApp().globalData.user_id || getApp().globalData.user_id.length < 1) {
    var id = wx.getStorageSync("user_id");
    if (id) {
      getApp().globalData.user_id = id
    }
    console.log('reload function get user_id', getApp().globalData.user_id)
  }
  return getApp().globalData.user_id;
}

module.exports.showModal = showModal;
module.exports.dataLoading = dataLoading;
module.exports.getUserId = getUserId;