let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');


module.exports = {
    
    getNotice (req, res) {
        let date = moment().format('YYYY-MM-DD');
        let query ='select * from notice';
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    addNotice (req, res) {
        let content = req.body.content;
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = `insert into notice(content, datetime) values("${content}", "${datetime}")`;
       
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    },

    setNotice (req, res) {
        let content = req.body.content;
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = `update notice set content = "${content}", datetime = "${datetime}" where id = 1`;
       
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '设置失败！', data: err});
            }else{
                res.json({code: 200, msg: '设置成功！', data: rows});
            }
        })
    }
};