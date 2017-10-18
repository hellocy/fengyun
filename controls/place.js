let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');
let fs = require('fs');

module.exports = {

    fetchAll (req, res) {
        pool.query('select * from place', function(err, rows){
            if(err){
                res.json({code: 500, msg: 'fail', data: err});
            }else{
                res.json({code: 200, msg: 'ok', data: rows});
            }
        })
    },

    // 添加地点
    add (req, res) {
        let placeName = req.body.placeName;
        let animalsStr = req.body.animals;
        let createTime =  moment().format('YYYY-M-D HH:mm:ss');
        let query = 'INSERT INTO place(name, animal, createTime) VALUES("'+placeName+'", "'+animalsStr+'", "'+createTime+'")';
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '添加失败，请重试', data: err});
            }else{
                res.json({code: 200, msg: '添加成功！', data: rows});
            }
        })
    },

    // 添加地点题目
    saveSubject (req, res) {
        let img = req.body.img;
        let text = req.body.text;
        let placeId = req.body.placeId;
        let query = 'update place set subject = "' + text + '", image = "' + img + '" where id = ' + placeId;
        pool.query(query, function(err, rows){
            if(err){
                res.json({code: 500, msg: '题目设置失败，请重试', data: err});
            }else{
                res.json({code: 200, msg: '题目设置成功！', data: rows});
            }
        })
    },


    // 删除单个地点
    deleteOne (req, res) {
        let placeId = req.body.placeId;
        let today = moment().format('YYYY-M-D');
        //如果当前地点对应的有场次，未开场，且有用户下注，则在地点删除前，将点数退还给用户
        let getBuySql = 'select a.uId, a.uName, a.amount, a.balance from buy a left join session b on a.sessionId = b.id where a.placeId = ' + placeId + ' and b.status = 0 and b.date = "' + today + '"';
        console.log(getBuySql)
        pool.query(getBuySql, function(err, buys){
            console.log(buys, "buys")
            if(buys.length){
                let caseArr = [];
                let uidArr = [];
                let userBanalceObj = {};

                let uidsArr = [];

                for(let i = 0; i < buys.length; i++){
                    uidsArr.push(buys[i].uId);
                }

                let getUsersBanalce = 'select id, balance from users where id in (' + uidsArr.join(",") + ')';
                console.log(getUsersBanalce);
                pool.query(getUsersBanalce, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: 'fail', data: err});
                    }else{
                        for(let i = 0; i < rows.length; i++){
                            userBanalceObj[rows[i].id] = rows[i].balance;
                        }

                        console.log(userBanalceObj, '所有购买的用户余额');


                        for(let i = 0; i < buys.length; i++){
                            let uid = buys[i].uId,
                                amount = buys[i].amount,
                                balance = userBanalceObj[uid];
                            let newBalance = balance + amount;
                            console.log(amount, balance, '返点明细')
                            caseArr.push(' when ' + uid + ' then ' + newBalance);
                            uidArr.push(uid);
                        }

                        console.log(caseArr, '将要更新的用户余额信息');

                        let updateUserBanalce = 'update users set balance = case id ' + caseArr.join(" ") +' end where id in (' + uidArr.join(",") + ')';
                        console.log(updateUserBanalce, '更新用户余额sql');
                        // return;
                        pool.query(updateUserBanalce, function(err, rows){
                            if(err){
                                res.json({code: 500, msg: 'fail', data: err});
                            }else{
                                let delBuySql = 'delete from buy where placeId = ' + placeId;
                                pool.query(delBuySql, function(err, rows){
                                    if(err){
                                        res.json({code: 500, msg: 'fail', data: err});
                                    }
                                })

                                let delSessionSql = 'delete from session where placeId = ' + placeId;
                                pool.query(delSessionSql, function(err, rows){
                                    if(err){
                                        res.json({code: 500, msg: 'fail', data: err});
                                    }
                                })

                                let delPlaceSql = 'DELETE FROM place WHERE id = ' + placeId;
                                pool.query(delPlaceSql, function(err, rows){
                                    if(err){
                                        res.json({code: 500, msg: '地点删除失败，请重试', data: err});
                                    }else{
                                        res.json({code: 200, msg: 'ok', data: rows});
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                let delPlaceSql = 'DELETE FROM place WHERE id = ' + placeId;
                pool.query(delPlaceSql, function(err, rows){
                    if(err){
                        res.json({code: 500, msg: '地点删除失败，请重试', data: err});
                    }else{
                        res.json({code: 200, msg: 'ok', data: rows});
                    }
                })
            }
        })
    },

    // 查询地点详情
    getPlaceDtl (req, res) {
        let placeId = req.body.placeId;
        pool.query('SELECT * from place where id = ' + placeId, function(err, rows){
            if(err){
                res.json({code: 500, msg: '查询失败：' + err});
            }else{
                let dtl = {
                    id: rows[0].id,
                    name: rows[0].name,
                    animal: rows[0].animal,
                    sequence: rows[0].sequence,
                    createTime: rows[0].createTime,
                    subjectImg: rows[0].image,
                    subject: rows[0].subject
                };
                res.json({code: 200, msg: '', data: dtl}); 
            }
        })
    },

    // 编辑地点
    editPlace (req, res) {
        let placeId = req.body.id;
        let placeName = req.body.placeName;
        let animals = req.body.animals;
        let sql = 'update place set name = "' + placeName + '", animal = "' + animals + '" where id = ' + placeId
        console.log(sql)
        pool.query(sql, function(err, rows){
            if(err){
                res.json({code: 500, msg: '修改失败：' + err});
            }else{
                res.json({code: 200, msg: '修改成功'}); 
            }
        })
    },

    // 图片上传
    subjectImage (req, res, next) {
        /** When using the "single"
        data come in "req.file" regardless of the attribute "name". **/
        var tmp_path = req.file.path;

        /** The original name of the uploaded file
          stored in the variable "originalname". **/
        var target_path = './frontend/images/upload/' + req.file.originalname;

        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        // var dest = fs.createWriteStream(target_path);
        // src.pipe(dest);
        // src.on('end', function() { 
            let t = moment().format('YYYY-M-D');
            let imgUrl = '/images/uploads/' + t + '/' + req.file.filename
            res.json({code: 200, msg: '上传成功！', data: imgUrl});
        // });
        src.on('error', function(err) { 
            res.json({code: 500, msg: '上传失败：' + err}); 
        });
    }

};