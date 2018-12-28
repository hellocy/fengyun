let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');

module.exports = {

    fetchAll (req, res) {
        pool.query('select * from animals', function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    // 充值
    add (req, res) {
        let name = req.body.name;
        let sql = `insert into animals(aniCnName) values("${name}")`;
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '添加失败！', data: err});
            }else{
                res.json({code: 200, msg: '添加成功！', data: rows});
            }
        })
    }
};