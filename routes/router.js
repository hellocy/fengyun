let express = require('express');
let animal = require('../controls/animal');
let place = require('../controls/place');
let user = require('../controls/user');
let authority = require('../controls/authority');
let robot = require('../controls/robot');
let session = require('../controls/session');
let buy = require('../controls/buy');
// let charge = require('../controls/charge');
let notice = require('../controls/notice');
let message = require('../controls/message');
let api = require('../api');
let upload = require('../utils/upload');
let router = express.Router();

//定时任务
var schedule = require('node-schedule');

var newSessionRule = new schedule.RecurrenceRule();
//每天凌晨2点整更新场次
newSessionRule.hour = 02;
newSessionRule.minute = 00;
newSessionRule.second = 00;
var j = schedule.scheduleJob(newSessionRule, function(){
	robot.createSession();
    console.log('场次已更新...');
});

//定时任务，根据场次中设置的开场时间，每30秒检测当前时间是否有开场场次
// setInterval(function(){
	//robot.openSession();
	// console.log('检测是否有场次开奖时间到...');
// }, 15000);

// user
router.get(api.userList, user.fetchAll);
router.get(api.getManagers, user.getManagers);
router.post(api.userDtl, user.getUserDtl);
router.post(api.getBalance, user.getBalance);
router.post(api.getMoney, user.getMoney);
router.post(api.getMoneyHistory, user.getMoneyHistory);
router.post(api.getMoneyAllHistory, user.getMoneyAllHistory);
router.post(api.userLogin, user.login); // 登录
router.get(api.userAutoLogin, user.autoLogin); // 自动登录
router.get(api.userLogout, user.logout);
router.post(api.userAdd, user.addOne);
router.post(api.userReg, user.reg);
router.post(api.userUpdate, user.update);
router.post(api.addManager, user.addManager);
router.post(api.updateManager, user.updateManager);
router.post(api.searchUser, user.searchUser);

router.post(api.userDelete, user.deleteOne);

//authoriry
router.get(api.fetchAll, authority.fetchAll);
router.post(api.getAuthorityByUser, authority.getAuthorityByUser);


//充值相关接口
router.post(api.chargeHistory, user.fetchChargeByUser); // 特定用户的充值历史
router.post(api.chargeList, user.fetchAllCharge); // 充点请求
router.post(api.chargeReq, user.chargeRequest); // 充点请求
router.post(api.chargeAdd, user.addCharge); // 充点
router.post(api.winRecord, user.winRecord); // 中奖记录

//动物
router.get(api.animalList, animal.fetchAll);
router.post(api.add, animal.add);

//地点
router.get(api.placeList, place.fetchAll);
router.post(api.placeAdd, place.add);
router.post(api.getPlaceDtl, place.getPlaceDtl);
router.put(api.editPlace, place.editPlace);
router.post(api.placeSubjectImage, upload.single('image'),  place.subjectImage);
router.put(api.saveSubject, place.saveSubject);
router.post(api.placeDel, place.deleteOne);

//场次
router.post(api.getTodySession, session.getTodySession);
router.get(api.getHistory, session.getHistory);
router.get(api.getOpenSession, session.getOpenSession);
router.put(api.setSettion1, session.setSettion1);
router.put(api.setSettion2, session.setSettion2);
router.put(api.setSettion3, session.setSettion3);
router.put(api.setSettion4, session.setSettion4);
router.post(api.getSessionInfo, session.getSessionInfo);
router.post(api.openSession, session.openSession);

//买点（下注）
// router.get(api.buyList, buy.fetchAll);
router.post(api.buyAdd, buy.addOne);
router.post(api.getBuyDtl, buy.getBuyDtl);
router.put(api.updateBuy, buy.updateBuy);
router.post(api.getSessionBuyList, buy.getSessionBuyList);
router.post(api.getSessionBuyAnimal, buy.getSessionBuyAnimal);

//公告
router.get(api.getNotice, notice.getNotice);
router.post(api.addNotice, notice.addNotice);
router.put(api.setNotice, notice.setNotice);

//消息
router.post(api.getMessage, message.getMessage);
router.put(api.updateMessage, message.updateMessage);



module.exports = router;