
var Bmob = require("bmob.js");

var current_version = "1.0.2";


/**
 * 检查版本是否在审核，审核显示控制
 * 1.审核态不显示赞和评论
 */
function isInCheck(callback) {

  var Check = Bmob.Object.extend("Check");

  var query = new Bmob.Query(Check);
  query.equalTo("version", current_version);

  query.first({
    success: function(obj) {
      console.log("isInCheck success, obj", obj);
      callback(obj.get("isChecking"));
    },
    error: function(error) {
      console.log("isInCheck error", error);
      callback(true);
    }
  });
}

module.exports.isInCheck = isInCheck;