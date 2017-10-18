let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');
let multer = require('multer');

module.exports = {

    // fetchAll (req, res) {
    //     console.log('select a.*, b.* from session a left join place b where a.date = "' + getTime() + '"')
    //     pool.query('select a.*, b.* from session a left join place b on a.placeId = b.id where a.date = "' + getTime() + '"', function(err, rows){
    //         if(err){
    //             res.json({code: 500, msg: 'fail', data: err});
    //         }else{
    //             res.json({code: 200, msg: 'ok', data: rows});
    //         }
    //     })
    // },

    // 添加一条记录
    addOne (req, res) {
        let uId = req.body.uId;
        let uName = req.body.uName;
        let sessionId = req.body.sessionId;
        let sessionName = req.body.sessionName;
        let placeId = req.body.placeId;
        let detail = req.body.detail;
        let amount = req.body.amount;
        let balance = req.body.balance;
        let buildTime = moment().format('YYYY-M-D HH:mm:ss');
        let query = "INSERT INTO buy(uId, uName, placeId, sessionId, sessionName, detail, amount, buildTime, balance) VALUES("+uId+", '"+uName+"', "+placeId+", "+sessionId+", '"+sessionName+"', '"+detail+"', "+amount+", '"+buildTime+"', " + balance + ")";
        console.log(query); 
        let updateUser = 'update users set balance = ' + balance + ' where id = ' + uId;
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '购买失败，请重试', data: err});
            }else{
                pool.query(updateUser, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '购买失败，请重试', data: err});
                    }else{
                        let orderSql = 'INSERT INTO uOrder(uid, uname, count, balance, datetime, type, optname, sessionName) VALUES('+ uId +', "'+ uName +'", '+ amount +', '+ balance +', "'+ buildTime +'", "-", "下注", "'+sessionName.split('[')[0]+'")';
                        console.log(orderSql, 'order sql');
                        pool.query(orderSql, function(err, rows){
                            if(err){
                                res.json({code: 500, msg: '购买失败，请重试', data: err});
                            }else{
                                let getAniTotal = 'select currentTotal, rate, aniMaxCount from session where id = ' + sessionId;
                                pool.query(getAniTotal, function(err, rows){
                                    if(rows){
                                        let rate = rows[0].rate;
                                        let aniMaxCount = rows[0].aniMaxCount;

                                        let newMax = aniMaxCount;
                                        let total = rows[0].currentTotal;
                                        let currentTotal = Number(total) + Number(amount);
                                        console.log(currentTotal, Number(rate) * Number(aniMaxCount))
                                        if(currentTotal > Number(rate) * Number(aniMaxCount)){
                                            newMax = aniMaxCount * 1.2; 
                                        }
                                        
                                        let aniTotal = 'update session set currentTotal = ' + currentTotal + ', aniMaxCount = ' + newMax + ' where id = ' + sessionId;
                                        pool.query(aniTotal, function(err, rows){
                                            if(err){
                                                res.json({code: 500, msg: '购买失败，请重试', data: err});
                                            }else{
                                                res.json({code: 200, msg: '购买成功！', data: rows});
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    // 更新一条记录
    updateBuy (req, res) {
        let uId = req.body.uId;
        let uName = req.body.uName;
        let sessionId = req.body.sessionId;
        let sessionName = req.body.sessionName;
        let amount = req.body.amount;
        let oldAmount = req.body.oldAmount;
        let balance = req.body.balance;
        let detail = req.body.detail;
        let buildTime = moment().format('YYYY-M-D HH:mm:ss');
        let query = "update buy set detail = '" + detail + "', amount = " + amount + ", balance = '" + balance + "' where uId = " + uId + " and sessionId = " + sessionId;
        console.log(query);
        let updateUser = 'update users set balance = ' + balance + ' where id = ' + uId;
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '购买失败，请重试', data: err});
            }else{
                pool.query(updateUser, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '购买失败，请重试', data: err});
                    }else{
                        let orderSql = 'INSERT INTO uOrder(uid, uname, count, balance, datetime, type, optname, sessionName) VALUES('+ uId +', "'+ uName +'", '+ amount +', '+ balance +', "'+ buildTime +'", "-", "下注", "'+sessionName.split('[')[0]+'")';
                        console.log(orderSql, 'order sql');
                        pool.query(orderSql, function(err, rows){
                            if(err){
                                res.json({code: 500, msg: '购买失败，请重试', data: err});
                            }else{
                                let getAniTotal = 'select currentTotal, rate, aniMaxCount from session where id = ' + sessionId;
                                pool.query(getAniTotal, function(err, rows){
                                    if(rows){
                                        let rate = rows[0].rate;
                                        let aniMaxCount = rows[0].aniMaxCount;

                                        let newMax = aniMaxCount;
                                        let total = rows[0].currentTotal;
                                        let currentTotal = Number(total) + Number(amount) - Number(oldAmount);
                                        console.log(currentTotal, Number(rate) * Number(aniMaxCount))
                                        if(currentTotal > Number(rate) * Number(aniMaxCount)){
                                            newMax = aniMaxCount * 1.2; 
                                        }

                                        let aniTotal = 'update session set currentTotal = ' + currentTotal + ', aniMaxCount = ' + newMax + ' where id = ' + sessionId;
                                        pool.query(aniTotal, function(err, rows){
                                            if(err){
                                                res.json({code: 500, msg: '购买失败，请重试', data: err});
                                            }else{
                                                res.json({code: 200, msg: '购买成功！', data: rows});
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                
            }
        })
    },

    // 查询某个场次的购买列表
    getSessionBuyList (req, res) {
        let sessionId = req.body.sessionId;
        let date = moment().format('YYYY-M-D');
        let query = 'SELECT * from buy where sessionId = ' + sessionId + ' and buildTime like "%' + date + '%" order by id desc';
        console.log(query);
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else{
                res.json({code: 200, msg: '', data: rows}); 
            }
        })
    },

    // 查询用户详情
    getBuyDtl (req, res) {
        let uid = req.body.uId;
        let sessionId = req.body.sessionId;
        pool.query('SELECT * from buy where uId = "' + uid + '" and sessionId = ' + sessionId, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else if(rows.length){
                let dtl = {
                    detail: JSON.parse(rows[0].detail)
                };
                res.json({code: 200, msg: '', data: dtl}); 
            }else{
                res.json({code: 405, msg: '', data: []}); 
            }
        })
    },

    // 查询某个场次的所有动物购买情况
    getSessionBuyAnimal (req, res) {
        let sessionId = req.body.sessionId;
        let query = 'SELECT detail from buy where sessionId = ' + sessionId;
        console.log(query);
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else{
                res.json({code: 200, msg: '', data: rows}); 
            }
        })
    },
};