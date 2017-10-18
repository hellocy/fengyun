let mysql = require('mysql');
let db = require('../configs/db');
let pool = mysql.createPool(db);

let sql = require('../sql/sql');
let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');

module.exports = {

    createSession (){

        let sql = 'update place set sequence = 1';
        pool.query(sql, function(err, rows){
            pool.query('select * from place', function(err, rows){
                let fieldsHtmlArr = [];
                for(let i = 0; i < rows.length; i++){
                    let placeId = rows[i].id;
                    let placeName = rows[i].name;
                    let sequence = rows[i].sequence;
                    let sequenceName = ["上", "中", "下"][sequence - 1];
                    let date = moment().format('YYYY-M-D');
                    let sessionName = placeName + '' + sequenceName + '场[' + date + ']';
                    // console.log(placeId, placeName);
                    let rowItem = '(' + placeId + ', "' + placeName + '", "' + sessionName + '", 25, "' + date + '", 0, 1000, 0, "'+sequenceName+'")';
                    fieldsHtmlArr.push(rowItem);
                }

                let query = 'INSERT INTO session(placeId, placeName, sessionName, rate, date, status, aniMaxCount, currentTotal, sequence) VALUES' + fieldsHtmlArr.join(",");
                console.log(query)
                pool.query(query, function(err, rows){
                })

                let datetime = moment().format('YYYY-M-D HH:mm:ss');
                let messageQuery = 'INSERT INTO message(msg_status, content, msg_to, datetime) VALUES(0, "今日场次已生成，请及时设置开奖信息！", 1, "'+datetime+'")';
                pool.query(messageQuery, function(err, rows){})
            })
        }) 
    }
};