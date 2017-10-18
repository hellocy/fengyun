let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');


function getTime(){
    var currDate = new Date();
    var d = new Date();
    var dateTime = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); 
    return dateTime;
 }

module.exports = {

    fetchAll (req, res) {
        let status = req.body.status;
        var condition = status == 2 ? '' : ' where a.status = ' + status;
        pool.query('select a.*, b.headImg from charge a left join users b on a.uid = b.id' + condition + ' order by a.chargeTime desc', function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                console.log(rows)
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    fetchByUser (req, res) {
        let uid = req.body.uid;
        pool.query('select * from charge where uid = ' + uid + ' order by id desc ', function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                console.log(rows)
                res.json({code: 200, msg: 'okzzz', data: rows});
            }
        })
    },

    //前端用户发起充值请求
    request (req, res){
        let uid = req.body.uid;
        let uname = req.body.uname;
        let count = req.body.count;
        let joinTime = getTime();
        let insertQuery = 'INSERT INTO charge(uid, uname, count, chargeTime, status) VALUES(' + uid + ', "' + uname + '", ' + count + ', "' + joinTime + '", 0)';
        console.log(insertQuery)

        pool.query(insertQuery, function(err, rows){
            if(rows){
                res.json({code: 200, msg: '管理员已收到充值请求，请耐心等待处理！'});
            }
        })
    },

    // 充值
    add (req, res) {
        let id = req.body.id;
        let uid = req.body.uid;
        let uname = req.body.uname;
        let count = req.body.count;

        pool.query('select balance from users where id='+uid, function(err, rows){
            var balance = parseInt(rows[0].balance) + parseInt(count);

            let updateChargeQuery = 'update charge set balance = ' + balance + ', status = 1 where id=' + id;
            let updateUserQuery = 'update users set balance = ' + balance + ' where id=' + uid;
            var record = 'insert into uorder(uid, uname, count, balance, datetime, type, optname) values('+uid+', "'+uname+'", '+count+', '+balance+', "'+moment().format('YYYY-M-D hh:mm:ss')+'", "+", "充点")';
            pool.query(updateChargeQuery, function(err1, rows1){
                pool.query(updateUserQuery, function(err2, rows2){
                    pool.query(record, function(err3, rows3){
                        if(err){
                            res.json({code: 500, msg: '充值失败，请重试', data: err3});
                        }else{
                            let messageQuery = 'INSERT INTO message(msg_status, content, msg_to) VALUES(0, "充值成功，入账 '+count+' 点", '+uid+')';
                            console.log(messageQuery);
                            pool.query(messageQuery, function(err, rows){
                                if(rows){
                                    res.json({code: 200, msg: '充值成功！', data: rows3});
                                }
                            })
                        }
                    })
                })
            })
        })
    },


    // 删除用户
    deleteOne (req, res) {

        let id = req.body.id;
        func.connPool(sql.del, ['users', id], rows => {
            res.json({code: 200, msg: 'done'});
        });
    }
};