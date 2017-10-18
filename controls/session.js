let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');


module.exports = {
    //查询今日所有场次
    
    getTodySession (req, res) {
        let date = moment().format('YYYY-M-D');
        let status = req.body.status;
        let noneOpenCondition = "";
        if(status == 0){
            noneOpenCondition = " and status = 0";
        }

        let d = new Date();
        let hour = d.getHours();
        let minus = d.getMinutes();
        
        if(hour == 0 && minus < 30){
            date = moment().add(-1,'days').format('YYYY-MM-DD');
        }

        let query ='select * from session where date = "' + date + '" '+ noneOpenCondition;
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },
    //查询历史场次
    getHistory (req, res) {
        let date = moment().format('YYYY-M-D');
        let query ='select * from session where date != "' + date + '" order by id desc limit 50'; 
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    //查询已开奖场次（开奖记录）
    getOpenSession (req, res) {
        let query ='select * from session where status = 1 order by id desc limit 10'; 
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    //设置开奖时间和倍率
    setSettion1 (req, res) {
        let openTime = req.body.openTime;
        let rate  = req.body.rate;
        let sessionId = req.body.sessionId;
        let sql = 'update session set openTime = "' + openTime + '", rate = ' + rate + ' where id = ' + sessionId;
       
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    },

    //设置开奖动物
    setSettion2 (req, res) {
        let openAniId = req.body.openAniId;
        let openAniName  = req.body.openAniName;
        let sessionId = req.body.sessionId;
        let sql = 'update session set openAnimalId = ' + openAniId + ', openAnimalName = "' + openAniName + '" where id = ' + sessionId;
       
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    },

    //设置场次的最高可购买点数
    setSettion3 (req, res) {
        let animaxcount = req.body.animaxcount;
        let sessionId = req.body.sessionId;
        let sql = 'update session set aniMaxCount = ' + animaxcount + ' where id = ' + sessionId;
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    },

    //设置场次的禁止买入动物
    setSettion4 (req, res) {
        let forbidAni = req.body.forbidAni;
        let sessionId = req.body.sessionId;
        let sql = 'update session set forbiddenAni = "' + forbidAni + '" where id = ' + sessionId;
        console.log(sql)
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    },

    getSessionInfo (req, res) {
        let sessionId = req.body.sessionId;
        let sql = 'select openTime, aniMaxCount, forbiddenAni from session where id = ' + sessionId;
       
        pool.query(sql, function(err, rows){
            res.json({code: 200, msg: '', data: rows[0]});
        })
    },

    //管理员设置开奖动物之后，就自动开奖
    openSession (req, res) {
        let sessionId = req.body.sessionId;
        let toOpenSession = 'select id, placeId, openAnimalId, openTime, rate, sessionName from session where id = ' + sessionId;

        pool.query(toOpenSession, function(err, rows){
            if (err) throw err;

            let sessionId = 0;
            let openAnimalId = 0;
            let placeId = 0;
            let sessionName = '';
            let rate = 1;
            if(rows.length){
                openAnimalId = rows[0].openAnimalId;
                placeId = rows[0].placeId;
                sessionName = rows[0].sessionName;
                rate = rows[0].rate;
                sessionId = rows[0].id;
                console.log("开场: ", sessionName);
            }

            //计算用户中奖
            const runAsync1 = () => {
                var p = new Promise(function(resolve, reject){

                    //查到本场的所有购买记录
                    let thisSessionBuy = 'select uId, uName, detail, amount, balance, sessionName from buy where sessionId = ' + sessionId;
                    pool.query(thisSessionBuy, function(err, rows){
                        if (err) throw err;

                        let caseArr = [];
                        let ids = [];
                        let orderValue = [];
                        let msgValue = [];
                        for(let i = 0; i < rows.length; i++){
                            let uId = rows[i].uId;
                            let uName = rows[i].uName;
                            let detail = JSON.parse(rows[i].detail);
                            let balance = parseInt(rows[i].balance);
                            let sessionName = rows[i].sessionName;
                            let sum = 0;
                            ids.push(uId);
                            for(let j = 0; j < detail.length; j++){
                                let aniId = detail[j].id;
                                let count = parseInt(detail[j].count);
                                if(aniId == openAnimalId){
                                    var _result = count * rate;
                                      sum += _result; //中奖动物返还相应点数*倍率
                                }
                            }
                            balance += sum;
                            let date = moment().format('YYYY-M-D');
                            let datetime = moment().format('YYYY-M-D HH:mm:ss');
                            console.log("中奖场次名称：", sessionName)
                            orderValue.push("('" + uId + "', '"+ uName +"', " + sum + ", " + balance + ", '" + datetime + "', '+', '中奖', '"+sessionName.split('[')[0]+"')")
                            caseArr.push('when ' + uId + ' then ' + balance);
                            msgValue.push("(0, '您下注的"+sessionName+"已开奖！', "+ uId+", '"+datetime+"')");
                        }
                        if(caseArr.length && ids.length){
                            const fn1 = () => {
                                let calculate = 'update users set balance = (case id ' + caseArr.join(' ') + ' END) where id in(' + ids.join(",") + ')';
                                pool.query(calculate, function(err, rows){
                                    if (err) throw err;
                                })
                            }

                            const fn2 = () => {
                                let orderSql = 'INSERT INTO uOrder(uid, uname, count, balance, datetime, type, optname, sessionName) VALUES' + orderValue.join(",");
                                pool.query(orderSql, function(err, rows){
                                    if (err) throw err;
                                })
                            }

                            const fn3 = () => {
                                let messageSql = 'INSERT INTO message(msg_status, content, msg_to, datetime) VALUES' + msgValue.join(",");
                                pool.query(messageSql, function(err, rows){
                                    if (err) throw err;
                                })
                            }

                            Promise.all([fn1(), fn2(), fn3()]).then(function(results){
                                resolve('');
                            });
                        }else{
                            resolve('');
                        } 
                    })
                });
                return p;            
            }
            //更新场次状态
            const runAsync2 = () => {
                var p = new Promise(function(resolve, reject){
                    let setStatus = 'update session set status = 1 where id = ' + sessionId;
                    pool.query(setStatus, function(err, rows){
                        if (err) {
                            throw err
                        };
                        resolve(sessionName + '已开场');
                    })
                });
                return p;            
            }
            //生成新的场次，或结束当天场次
            const runAsync3 = () => {
                var p = new Promise(function(resolve, reject){
                    //更新对应地点的场次记录（一天最多3场）
                    let getSequence = 'select name, sequence from place where id = ' + placeId;
                    pool.query(getSequence, function(err, rows){
                        if (err) throw err;
                        let seq = rows[0].sequence;
                        let placeName = rows[0].name;
                        // console.log('seq', seq)
                        if(seq < 3){
                            let updateSequence = 'update place set sequence = sequence + 1 where id = ' + placeId;
                            pool.query(updateSequence, function(err, rows){
                                pool.query('select * from place where id = ' + placeId, function(err, rows){
                                    let fieldsHtmlArr = [];
                                    let sequenceIdx = '';
                                    for(let i = 0; i < rows.length; i++){
                                        let placeId = rows[i].id;
                                        let sequence = rows[i].sequence;
                                        sequenceIdx = ["上", "中", "下"][sequence - 1];
                                        let date = moment().format('YYYY-M-D');
                                        let sessionName = placeName + '' + sequenceIdx + '场[' + date + ']';
                                        let rowItem = '(' + placeId + ', "' + placeName + '", "' + sessionName + '", 25, "' + date + '", 0, 1000, 0, "'+sequenceIdx+'")';
                                        fieldsHtmlArr.push(rowItem);
                                    }

                                    let query = 'INSERT INTO session(placeId, placeName, sessionName, rate, date, status, aniMaxCount, currentTotal, sequence) VALUES' + fieldsHtmlArr.join(",");
                                    pool.query(query, function(err, rows){
                                        if(rows){                                        
                                            let datetime = moment().format('YYYY-M-D HH:mm:ss');
                                            let messageQuery = 'INSERT INTO message(msg_status, content, msg_to, datetime) VALUES(0, "'+placeName+''+sequenceIdx+'场已生成，请及时设置开奖信息！", 1, "'+datetime+'")';
                                            pool.query(messageQuery, function(err, rows){})

                                            resolve(placeName+''+sequenceIdx+'场已生成');
                                        }
                                    })
                                })
                            })
                        }else{
                            resolve(placeName+'今日场次已结束');
                        }
                    })
                });
                return p;            
            }

            Promise.all([runAsync1(), runAsync2(), runAsync3()]).then(function(results){
                res.json({code: 200, msg: results, data: rows[0]});
            });
        })
    }
};