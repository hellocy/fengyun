let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');

var os = require('os');

let logger = require('../configs/logger.js');

module.exports = {

    createSession02 (){
        logger.log('info', "执行定时任务：创建今日场次" );
        pool.query('select * from place', function(err, rows){
            let fieldsHtmlArr = [];
            let toUpdatePlaceIds = [];
            for(let i = 0; i < rows.length; i++){
                let placeId = rows[i].id;
                let placeName = rows[i].name;
                let sequence = rows[i].sequence;
                let sequenceName = ["上", "中", "下", "上"][sequence - 1];
                let date = moment().format('YYYY-MM-DD');
                let createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                let sessionName = `${placeName}${sequenceName}场[${date}]`;
                
                // console.log(placeId, placeName);
                if(sequence == 4){                      
                    let rowItem = `(${placeId}, "${placeName}", "${sessionName}", 27, "${date}", 0, 1000, 0, "${sequenceName}", "${createTime}")`;
                    fieldsHtmlArr.push(rowItem);
                    toUpdatePlaceIds.push(placeId);
                }
            }
            if(fieldsHtmlArr.length){
                let query = `INSERT IGNORE INTO session(placeId, placeName, sessionName, rate, date, status, aniMaxCount, currentTotal, sequence, createTime) VALUES ${fieldsHtmlArr.join(",")}`;                
                logger.log('info', query);
                pool.query(query, function(err, rows){
                    let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    let sql = `update place set sequence = 1, sessionUpdateTime = "${updateTime}" where id in (${toUpdatePlaceIds.join(',')})`;
                    pool.query(sql, function(err, rows){
                        logger.log('info', `新场次已生成, 系统版本信息：${os.release()}`);
                    })  

                    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
                    let messageQuery = `INSERT INTO message(msg_status, content, msg_to, datetime) VALUES(0, "新场次已生成，请及时设置开奖信息！", 1, "${datetime}")`;
                    pool.query(messageQuery, function(err, rows){})              
                })
            }
        })
    },

    createSession13 (){
        logger.log('info', "执行定时任务：检查保留的昨天的场次，如果有，则创建今日场次");

        let yestoday = moment().add(-1,'days').format('YYYY-MM-DD');
        let leaveSession = `select * from session where date = '${yestoday}' and status = 0`;
        console.log(leaveSession);
        pool.query(leaveSession, function(err, rows){
            if(rows.length){
                let fieldsHtmlArr = [];
                let placeIds = [];
                for(let i = 0; i < rows.length; i++){
                    let placeId = rows[i].placeId;
                    let placeName = rows[i].placeName;
                    let sequenceName = '上';
                    let date = moment().format('YYYY-MM-DD');
                    let createTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    let sessionName = `${placeName}${sequenceName}场[${date}]`;
                    
                    // console.log(placeId, placeName);
                    let rowItem = `(${placeId}, "${placeName}", "${sessionName}", 27, "${date}", 0, 1000, 0, "${sequenceName}", "${createTime}")`;
                    fieldsHtmlArr.push(rowItem);

                    placeIds.push(placeId);
                }

                let query = `INSERT IGNORE INTO session(placeId, placeName, sessionName, rate, date, status, aniMaxCount, currentTotal, sequence, createTime) VALUES ${fieldsHtmlArr.join(",")}`;                
                logger.log('info', query);

                pool.query(query, function(err, rows){
                    //关闭前一天保留的场次
                    let closeSequence = `update session set status = 1 where date = '${yestoday}' and sequence = '下' and status = 0`;
                    console.log(closeSequence,555)
                    pool.query(closeSequence, function(err, rows){
                        let updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        let sql = `update place set sequence = 1, sessionUpdateTime = "${updateTime}" where id in (${placeIds.join(',')})`;
                        pool.query(sql, function(err, rows){
                            logger.log('info', `新场次已生成, 系统版本信息：${os.release()}`);
                        }) 
                    })
                })

                let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
                let messageQuery = `INSERT INTO message(msg_status, content, msg_to, datetime) VALUES(0, "新场次已生成，请及时设置开奖信息！", 1, "${datetime}")`;
                pool.query(messageQuery, function(err, rows){})
            }
        })
    },

    getapp (req, res) {
        var file ='download/app.apk';
        res.download(file); // Set disposition and send it.
    },

    getipa (req, res) {
        var file ='download/app.ipa';
        res.download(file); // Set disposition and send it.
    },

    getOsInfo (req, res){
        res.json({code: 200, msg: 'ok', data: {process:process.memoryUsage(), totalmem: os.totalmem()}});
        console.log('获取操作系统版本号： '+os.release());
        console.log('获取操作系统内存占用： '+ process.memoryUsage());
        console.log('获取系统当前运行的时间： '+os.uptime())
        console.log('获取系统当前运行的时间： '+os.totalmem())
    }
};