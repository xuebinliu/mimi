
var Bmob = require("bmob.js")

var nickname = [
  "喵小懒", "思钱想厚", "稚于最初", "℡宿命。", "天生傲骨、怎能服输", "守一座空城ヾ", "許我壹筆墨, 绘妳倾城顏","无人问我粥可温", "冷暖自知", "西城诀丶转身一世琉璃白", "时光凉", "向来缘浅", "北鼻", "令狐冲笑熬浆糊", "骑蜗牛撵大象", "埖埖迣鎅、芣怭當嫃", "ㄣ潇潇ㄣ", "给祢的承诺、卟会过期", "24K纯爷们", "蔵茬眼疧哋那壹沬蕜殤", "我心飞扬", "我怕爱的太早不能终老", "蝶ル飛", "丢了的自己，要记得捡回来", "别回头我从来不等狗", "给我一个忘记你的理由", "低調の華麗", "暖了夏天蓝了海°", "Royal╰大懒猫″", "女人ヽ无须楚楚可怜", "寂寞如雪", "放开我，我要装逼", "听说爱情回来过i", "愿你的所有深情都不被辜负", "喵小咪℡", "随遇而安", "如人饮水冷暖自知", "Forever、卟离", "情话与狗我选孤独与酒", "﹎黯淡", "梦里梦见梦", "别留我孤身一人", "越王够贱", "人心太狗", "正在输入ヽ请稍后", "緈鍢dē掉渣", "半醉半醒半痴呆", "总有刁民想害朕", "擦掉眼泪我依旧是王", "北巷°", "风继续吹", "精神分裂患者", "凉辰梦瑾°", "愿用余生去念你", "", "谁动朕江山，朕掘他祖坟", "首席男妓", "吃了范冰冰就会杜拉拉", "嘸懙倫仳", "ロ觜角よ揚℅", "陪你走天涯你却推我下悬崖", "浅唱、淡夏", "婼即婼離", "花样作死冠军", "站在北纬30°想你", "承蒙时光不弃", "活出别致的高傲", "帅dē掉渣", "孤身撑起①片天", "烈酒封喉", "时光嘲笑了谁的执着", "走别人的路让别人无路可走", "屋檐滑落的雨滴﹌", "乱了夏末蓝了海", "人情薄如纸一张ゞ", "心不动丶则不痛", "原谅我一生放荡不羁笑点低", "褪色的旧时光", "獨愛伱一個ヤ", "以女皇的霸气统领整个世界", "安於現狀。", "时间会咬人", "△桃之夭夭", "别看了你帅不过我的", "姐很拽ㄨ不要爱", "香蕉不娇", "纵有南风起", "待我强大给父母一个天下", "萌界一把手", "孟婆，来杯咖啡", "烟花散尽、不问繁华", "冷暖自知", "谁给我的QQ喂了止咳糖浆", "嘴角残留余温", "酒醉人散", "浮华如梦°", "一身温柔病", "只如初见", "醉人心", "闲言碎语ら", "别来无恙", "微微一笑抽了筋", "假装无所谓", "落花忆梦", "陪俄、看ㄖ出", "雨落倾城夜微凉", "生来不讨喜", "情场废物", "遇见她ぴ许了她", "黄泥鳅与大白鲨", "吃货家族miss", "ζ小执着°", "混世大魔王的酷炸小仙女", "我是你家宝贝", "混世小野女", "萌宝", "污味的小仙女", "我是孜然味哒！", "装呆◇◆萌翻全场", "萌妹子", "萍酷宝", "听，奶哭的声音", "金刚芭比有颗软妹心", "追着幸福跑", "凹凸曼爱上了小怪兽", "请止步、禁区", "一身祖宗味", "拉粑粑的小魔仙", "可爱到炸", "壊壊♀儍尐孒", "长的很欠揍", "油炸小逗比", "仇家太多了不方便透漏名字", "全村的希望", "五行缺爱", "疯到世界奔溃", "啷个哩个啷", "姐就这么拽，不服就憋着", "爬进棺材调戏鬼", "求岳母发货", "迷倒万千少女", "矮油喂", "小不正经ε", "情场痞子", "犇羴骉", "痞男", "蹲街ぃ看帅哥", "骑猪闯天下", "可耐的智障", "姐ゝ夲灞芞", "⌒喵⌒", "待我长发及腰就勒死你", "小笨豬の幸福", "飞奔的五花肉", "姐√拽得有个性", "校长要跳楼学生喊加油", "丑到惊动联合国", "网名再拽ゝ有個屌用", "狂奔的蚂蚁", "⊕3⊕", "被淹死的鱼", "智障儿童快乐多", "爱笑的智障", "国民小逗比"]

var avatar_urls = [
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/be7dd181405fe7568020ccb80832fadc.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/be40d14a40826c0b802e2c694878660d.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/0d228bf940a0763880db1bfa1e97ec25.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/65ce8922409b2eaf806b118301e21444.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/c0681da940aaea33804125d4c49c75fa.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/0810173a40354d78805e1cbe7565907a.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/8a11d39440fc5bc18085b0e8d18eb226.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/b9a0a71c4070dd2e806099e8e7bc1f7f.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/15c746b0400cb517800a23917f847552.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/925c980840a386c3800b7151a96e2c31.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/9810784840544c55808dd42558bc1e7b.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/ce21f4b440fb77a8802602b80f264030.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/cb23ec1040daf45080e748aa5dd8cb92.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/649b395c408698b580c97100e8584aa1.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/5f2b5a13407a9c64800a8bcebfc913d3.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/c8ca2cb240af6294800ccdb377ef0d6e.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/547809f340c81b8880a735750465c537.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/89197efb407366828012c667ba173c5b.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/69cbbccb4033fc02800829e38bc54d72.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/fd70bee54099892d80f3d518dc1506a1.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/6bbccb8c4061cb8f80cbb2f8dd50e610.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/7e35b7bf40c510d48041c6c0a5ea09fe.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/8863dba240b571d7802e0510581b073b.jpg",
  "http://bmob-cdn-11684.b0.upaiyun.com/2017/05/23/913e44c340f2fa2680243d0714989345.jpg",
]

/**
 * 随机生成昵称
 * @returns 昵称
 */
function generateNickName() {
  var range = nickname.length;
  var random = Math.random();
  var index = Math.round(random * range); 
  if (index == nickname.length) {
    index = nickname.length - 1
  }
  return nickname[index];
}

/**
 * 随机生成头像
 * @returns 头像url
 */
function generateAvatar() {
  var range = avatar_urls.length;
  var random = Math.random();
  var index = Math.round(random * range);
  if (index == avatar_urls.length) {
    index = avatar_urls.length - 1
  }
  return avatar_urls[index];
}

module.exports.generateNickName = generateNickName;
module.exports.generateAvatar = generateAvatar;