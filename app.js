//引入express组件以使用express库中的函数
var express = require('express');

var fs = require('fs');
var Path = require('path');
var bodyParser = require('body-parser');
//创建一个用于express对象
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var mime = require('./common/mime.js').mime;


app.get('/myfile', function (req, res) {
  filesLoad('./index.html', 'html', req, res);
})
app.post('/path', function (req, res) {
  console.log(req.body);
  var entries = fs.readdirSync(req.body.uri);

  var filelist = [];
  for (i in entries) {
    var file;
    try {
      var stat = fs.lstatSync(req.body.uri + entries[i]);
      if (stat.isDirectory()) {
        file = { name: entries[i], type: "dir" };
        filelist.push(file)
      } else if (stat.isFile()) {
        file = { name: Path.parse(entries[i]).name, type: Path.extname(entries[i]).slice(1), fullname: entries[i] };
        filelist.push(file)
      }

    } catch (error) {

    }


  }
  filelist.sort(function (a, b) {
    return a.type - b.type;
  })
  res.send(filelist);
})

app.get('/detail', function (req, res) {
  var extname = Path.extname(req.query.uri);
  var type = extname.slice(1);
  var entries = fs.createReadStream(req.query.uri);
  filesLoad(req.query.uri, type, req, res);
});
var exec = require('child_process').exec;

// show  Windows letter
function showLetter(callback) {
    exec('wmic logicaldisk get caption', function(err, stdout, stderr) {
        if(err || stderr) {
            console.log("root path open failed" + err + stderr);
            return;
        }
        callback(stdout);
    })
}

function filesLoad(filePath, type, req, res) {
  fs.exists(filePath, function (exists) {

    if (!exists) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      // res.write();    
      res.end();
    } else {
      fs.readFile(filePath, 'binary', function (err, file) {
        try {
          if (!err) {
            res.writeHead(200, { 'Content-Type': mime[type] });
            res.write(file, 'binary');
            res.end();
          }

        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          // res.write();    
          res.end();
        }
      });
    }
  })
}
//服务器开始监听
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});