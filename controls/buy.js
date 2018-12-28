let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');
let multer = require('multer');

let logger = require('../configs/logger.js');

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
        let reqDetail = req.body.detail;
        let amount = req.body.amount;
        let balance = req.body.balance;
        let buildTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let getAniMax = `select aniMaxCount from session where id = ${sessionId}`;
        pool.query(getAniMax, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else if(rows.length){
                let aniBuyDetail = {};
                let animax = rows[0].aniMaxCount || 1000;
                let query = `SELECT * from buy where sessionId = ${sessionId}`;
                pool.query(query, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '网络故障，请重试!' + err});
                    }else if(rows.length >= 0){
                        for(let i = 0; i < rows.length; i++){
                            let detail = JSON.parse(rows[i].detail);
                            for(let j = 0; j < detail.length; j++){
                                let aniId = detail[j]["id"];
                                if(aniBuyDetail.hasOwnProperty(aniId)){
                                    aniBuyDetail[aniId] = aniBuyDetail[aniId] + detail[j]["count"]
                                }else{
                                    aniBuyDetail[aniId] = detail[j]["count"]
                                }
                            }
                        }
                        let result = [];
                        let detailObj = JSON.parse(reqDetail);
                        for(let i = 0; i < detailObj.length; i++){
                            let aniId = detailObj[i]['id'];
                            let aniName = detailObj[i]['aniName'];
                            let reqCount = detailObj[i]['count'];
                            let rest = animax - aniBuyDetail[aniId];
                            if(reqCount > rest){
                                result.push(`${aniName}剩余可购买数量：${rest}`);
                            }
                        }
                        if(result.length > 0){
                            res.json({code: 500, msg: result.join("<br>")}); 
                        }else{
                            let query = `INSERT INTO buy(uId, uName, placeId, sessionId, sessionName, detail, amount, buildTime, balance) VALUES(${uId}, '${uName}', ${placeId}, ${sessionId}, '${sessionName}', '${reqDetail}', ${amount}, '${buildTime}', ${balance})`;
                            let updateUser = `update users set balance = ${balance} where id = ${uId}`;
                            pool.query(query, function(err, rows){
                                if(err){
                                    res.json({code: 500, msg: '购买失败，请重试', data: err});
                                }else{
                                    pool.query(updateUser, function(err, rows){
                                        if(err){
                                            res.json({code: 500, msg: '购买失败，请重试', data: err});
                                        }else{
                                            let orderSql = `INSERT INTO uOrder(uid, uname, count, balance, datetime, type, optname, sessionName) VALUES(${uId}, "${uName}", ${amount}, ${balance}, "${buildTime}", "-", "下注", "${sessionName.split('[')[0]}")`;
                                            logger.log('info', `买点：${uName}购买${sessionName} ${amount}点，剩余${balance}点`);
                                            pool.query(orderSql, function(err, rows){
                                                if(err){
                                                    res.json({code: 500, msg: '购买失败，请重试', data: err});
                                                }else{
                                                    let getAniTotal = `select currentTotal, rate, aniMaxCount from session where id = ${sessionId}`;
                                                    pool.query(getAniTotal, function(err, rows){
                                                        if(rows){
                                                            let rate = rows[0].rate;
                                                            let aniMaxCount = rows[0].aniMaxCount;

                                                            let newMax = aniMaxCount;
                                                            let total = rows[0].currentTotal;
                                                            let currentTotal = Number(total) + Number(amount);
                                                            if(currentTotal > Number(rate) * Number(aniMaxCount)){
                                                                newMax = aniMaxCount * 1.2; 
                                                            }
                                                            
                                                            let aniTotal = `update session set currentTotal = ${currentTotal}, aniMaxCount = ${newMax} where id = ${sessionId}`;
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
                        }
                    }else{
                        res.json({code: 200, msg: ''});  
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
        let reqDetail = req.body.detail;
        let buildTime = moment().format('YYYY-MM-DD HH:mm:ss');

        let getAniMax = `select aniMaxCount from session where id = ${sessionId}`;
        pool.query(getAniMax, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else if(rows.length){
                let aniBuyDetail = {};
                let animax = rows[0].aniMaxCount || 1000;
                let query = `SELECT * from buy where sessionId = ${sessionId}`;
                pool.query(query, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '网络故障，请重试!' + err});
                    }else if(rows.length){
                        
                        for(let i = 0; i < rows.length; i++){
                            let detail = JSON.parse(rows[i].detail);
                            for(let j = 0; j < detail.length; j++){
                                let aniId = detail[j]["id"];
                                if(aniBuyDetail.hasOwnProperty(aniId)){
                                    aniBuyDetail[aniId] = aniBuyDetail[aniId] + detail[j]["count"]
                                }else{
                                    aniBuyDetail[aniId] = detail[j]["count"]
                                }
                            }
                        }
                        let result = [];
                        let detailObj = JSON.parse(reqDetail);
                        for(let i = 0; i < detailObj.length; i++){
                            let aniId = detailObj[i]['id'];
                            let aniName = detailObj[i]['aniName'];
                            let reqCount = detailObj[i]['count'];
                            let reqOldCount = detailObj[i]['oldCount'];
                            let disCount = reqOldCount - reqCount;

                            let rest = animax - aniBuyDetail[aniId];
                            if(disCount < 0 && disCount > rest){
                                result.push(`${aniName}剩余可购买数量：${rest}`);
                            }
                        }

                        if(result.length > 0){
                            res.json({code: 500, msg: result.join("<br>")}); 
                        }else{

                            let query = `update buy set detail = '${reqDetail}', amount = ${amount}, balance = ${balance}, buildTime = '${buildTime}' where uId = ${uId} and sessionId = ${sessionId}`;
                            let updateUser = `update users set balance = ${balance} where id = ${uId}`;
                            pool.query(query, function(err, rows){
                                if(err){
                                    res.json({code: 500, msg: '购买失败，请重试', data: err});
                                }else{
                                    pool.query(updateUser, function(err, rows){
                                        if(err){
                                            res.json({code: 500, msg: '购买失败，请重试', data: err});
                                        }else{
                                            let orderSql = `INSERT INTO uOrder(uid, uname, count, balance, datetime, type, optname, sessionName) VALUES(${uId}, "${uName}", ${amount}, ${balance}, "${buildTime}", "-", "下注", "${sessionName.split('[')[0]}")`;
                                            logger.log('info', `买点：${uName}重新购买${sessionName} ${amount}点，剩余${balance}点`);
                                            pool.query(orderSql, function(err, rows){
                                                if(err){
                                                    res.json({code: 500, msg: '购买失败，请重试', data: err});
                                                }else{
                                                    let getAniTotal = `select currentTotal, rate, aniMaxCount from session where id = ${sessionId}`;
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

                                                            let aniTotal = `update session set currentTotal = ${currentTotal}, aniMaxCount = ${newMax} where id = ${sessionId}`;
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
                        }
                    }else{
                        res.json({code: 200, msg: ''});  
                    }
                })
            }
        })
    },

    // 查询某个场次的购买列表
    getSessionBuyList (req, res) {
        let sessionId = req.body.sessionId;
        let date = moment().format('YYYY-MM-DD');
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

    // 查询用户购买详情
    getBuyDtl (req, res) {
        let uid = req.body.uId;
        let sessionId = req.body.sessionId;
        let condition = '';
        if(uid){
            condition = `uId = ${uid} and`;
        }
        let query = `SELECT * from buy where ${condition} sessionId = ${sessionId} order by amount desc`;
        console.log(query);
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else if(rows.length){
                let dtl = {
                    detail: JSON.parse(rows[0].detail)
                };
                if(!uid){
                    dtl = rows;
                }
                res.json({code: 200, msg: '', data: dtl}); 
            }else{
                res.json({code: 405, msg: '', data: []}); 
            }
        })
    },

    // 查询某场次，某个动物已被购买的总数，用户在购买输入数据时，调用，用于限制，动物购买总数不能大于最大值
    getAnimalBuyTotal (req, res) {
        let sessionId = req.body.sessionId;
        let animalId = req.body.animalId;
        let buyCount = req.body.buyCount;
        let isEdit = req.body.isEdit;
        let oldCount = req.body.oldCount;
        let getAniMax = `select aniMaxCount from session where id = ${sessionId}`;
        pool.query(getAniMax, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else if(rows.length){
                let animax = rows[0].aniMaxCount || 1000;
                let query = `SELECT * from buy where sessionId = ${sessionId}`;
                pool.query(query, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '网络故障，请重试!' + err});
                    }else if(rows.length){
                        let total = 0;
                        let aniName = '';
                        for(let i = 0; i < rows.length; i++){
                            let detail = JSON.parse(rows[i].detail);
                            for(let j = 0; j < detail.length; j++){
                                let aniId = detail[j]["id"];
                                if(animalId == aniId){
                                    total += detail[j]["count"];
                                    aniName = detail[j]["aniName"];
                                    // break;
                                }
                            }
                        }
                        console.log(buyCount, animax, animax - total)

                        let checkData = buyCount;
                        if(isEdit){
                            let disCount = buyCount - oldCount;
                            if(disCount > 0 && checkData > animax - total){
                                res.json({code: 500, msg: `本场${aniName}的可购买数量还剩${animax - total}`, data: animax - total}); 
                            }else{
                                res.json({code: 200, msg: animax - total}); 
                            }
                        }else{
                            if(checkData <= animax - total){
                                res.json({code: 200, msg: animax - total}); 
                            }else{
                                res.json({code: 500, msg: `本场${aniName}的可购买数量还剩${animax - total}`, data: animax - total}); 
                            }
                        }
                    }else{
                        res.json({code: 200, msg: ''});  
                    }
                })
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