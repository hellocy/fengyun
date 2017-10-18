let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');


module.exports = {
    //查询今日所有场次
    
    getMessage (req, res) {
        let uid = req.body.uid;
        let date = moment().format('YYYY-M-D');
        let query ='select * from message where msg_to = ' + uid + ' and msg_status = 0 order by id desc'; 
        console.log(query);
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    updateMessage (req, res) {
        let msgId = req.body.msgId;
        let sql = 'update message set msg_status = 1 where id = ' + msgId;
       
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    }
};