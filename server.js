//生成访问日志文件
let fs = require('fs');
let accessLogfile = fs.createWriteStream('./log/access.log', {flags: 'a'});
let errorLogfile = fs.createWriteStream('./log/error.log', {flags: 'a'});

let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
let logger = require('morgan');
let errorhandler = require('errorhandler');
let router = require('./routes/router');

let port = process.env.PORT || 8888;
let app = express();

app.use(logger({stream: accessLogfile}));

// app.use(errorhandler({log: errorNotification}));

// function errorNotification(err, str, req) {
//   	var meta = '['+new Date()+']' + req.url + '\n';
// 	errorLogfile.write(meta + err.stack + '\n');
// 	next();
// }

//设置静态资源文件目录
app.use(express.static('./frontend'));
app.use(express.static('./log'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'fuckupig',
    cookie: {maxAge: 3600000},
    resave: false,
    saveUninitialized: false,
}));

app.use(router);

app.listen(port, () => {
    console.log(`风云服务已成功启动，端口: ${port}`);
});