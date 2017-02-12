概述[项目地址](https://github.com/504883942/nodejs-fileSystem/)
=========================================================================
最初做这个项目的目的是自己生活中的不方便。而实际上，也确实解决了我自己的不方便。

需要解决的问题是，有时候自己离自己电脑比较远但是又希望其他设备能够访问电脑的文件。如果能使用浏览器来查看管理自己电脑的文件。就可以解决这个问题

解决方案
---------------------------------------------------------------------------
使用nodejs搭建一个网站服务器。使用nodejs的io对文件进行操作。 
为什么使用nodejs？有几点原因
- nodejs轻，因为是脚本语言即改即用，对于自己完成一些小功能的时候是非常方便的。
- nodejs实际上就是一个javascript的桌面运行环境，也就是说语法还是我们在前端常使用的javascript相同的语法，入门非常简单。换个角度，如果没有做过前端脚本设计，在学习了nodejs后，再去学习前端也是非常方便的。
- 跨平台。嗯，我这里说的跨平台是相对C#而言，一般自己买服务器可能买linux的                                                                                                                                                                                                                


需求分析
---------------------------------------------------------------------------
主要分为两个页面
- 文件列表页，用户可以点开文件夹下一级，也可以点省略号来上一级，点击文件会进入详情页
- 文件详情页，不同类型的文件可能需要自己制作展示方案，这里只处理常见的mp4/jpg格式 


项目准备
==========================================================================
- nodejs概述
- 开发环境介绍
- 主要是项目的几个关键点技术，是否能够实现。总结一下项目的关键点有
    - 使用nodejs，文件系统遍历
    - 使用nodejs，将文件系统结果传递到网页上
    - 显示文件
> 前端不是本文重点，本文中给出了angularjs的实现方式。

nodejs基础代码简介
----------------------------------------------------------------------------
例子，使用 Node.js 编写的 Web 服务器，响应返回 'Hello World'：
```
//引用http模块，以调用该模块下的创建服务器函数
const http = require('http');


//配置主机和服务器端口
const hostname = '127.0.0.1';
const port = 3000;


//定义服务器，req是请求的缩写request，res是答复的缩写respone
const server = http.createServer((req, res) => {
  //下面就是对答复的赋值
  //可以看到这个简单例子中，没有对req进行任何的逻辑判断。任何请求的答复都是按照如下代码处理
  
  //状态码设为200，表成功
  res.statusCode = 200;
  //内容格式设置为text纯文本格式
  res.setHeader('Content-Type', 'text/plain');
  //内容为hello world
  res.end('Hello World\n');
});

//服务器开始监听
server.listen(port, hostname, () => {
  //输出自己监听的端口
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

使用nodejs运行该代码后，再在浏览器中输入http://127.0.0.1:3000/这个网址并访问。就可以看到Helloworld这个字符串。


可以试试自己写写，或者稍微对req进行处理以返回不同的结果，
我这边不详述了。

这里介绍一个对常用请求和答复进行处理的库[express](http://www.expressjs.com.cn/)
，安装等操作就在官网上自行查看了。  
我这里详解几个官网的例子，并且在接下来的项目中，将主要使用express



```
//引入express组件以使用express库中的函数
var express = require('express');
//创建一个用于express对象
var app = express();

//当请求路径为/（一般来说是主页）时,的处理函数
app.get('/', function(req, res) {
  res.send('hello world');
});

//服务器开始监听
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

```

可能用到的技术 **模板引擎**
---------------------------------------------------------------------
什么是模板引擎？ 
在上面的输出helloworld例子中我们可以看到，如果我们想单纯的输出一个纯文本，那么那样写是没有什么问题的，但是如果是需要输出更多内容呢？比如要输出一整个html文档。如果用那种方式写，就会变成这个样子


```
var http = require('http');
http.createServer(function(req, res){
 res.writeHead(200, {'Content-type' : 'text/html'});
 res.write('<h1>Node.js</h1>');
 res.end('<p>Hello World</p>');
}).listen(3000);
```
这个例子中输出了一个有h1标签和p标签的html文档。可以想象如果需要输出的html如果复杂到一定程度，那么生成res的代码将会变得多复杂。 
这里很容易想到，能不能以配置文件的方式将需要输出的html存起来，其中可以变化的部分就可以使用一些占位符代替。在需要需要输出的html的时候，确定这个需要输出的html的占位符需要的值，就完成了需要。在上面提到的那个配置文件实际上叫做**模板**，而读取占位符值读取模板文件，并解析成html的过程所使用的技术就是**模板引擎**

> 这里实际上我们在 ASP.NET MVC中也接触过。也就是cshtml结尾的那些文件，在mvc中叫做视图（View）;而 ASP.NET MVC使用的视图引擎叫做Razor。


在nodejs express中有几个模板引擎可以选择。
- jada，文件体积小，省键盘。适合从未接触过前端的人使用。
- ejs,比较直观，和最终生成的html文件相差不大，类似php的语法，类似ASP的Web Form View Engine,对于有过以上提到的技术有过开发经验的人入门会非常简单。
- ...

个人觉得如果不需要深入模板引擎的自定义等特殊需求，模板引擎就边查边写都可以。只要抓住模板最终是会生成我们需要的内容这个关键就好.各个模板引擎在运用阶段绝大部分差别都只是换一个语法，核心思路是一样的。   
这里我们使用ejs

使用nodejs，文件系统遍历
------------------------------------------------------------
查阅nodejs手册关于io的api

以下的例子可以列出C盘根目录下的文件

```
var fs=require('fs');
var Path=require('path');
fs.readdir("C:/",function(err,entries){
    console.log(entries);
})
```

```
var fs=require('fs');
var Path=require('path');
entries=fs.readdirSync("C:/");
console.log(entries);
```


使用nodejs，将文件系统结果传递到网页上
-----------------------------------------------------------------------------
结合基础服务器代码和文件系统代码
整合如下


```
//引入express组件以使用express库中的函数
var express = require('express');

var fs=require('fs');
var Path=require('path');

//创建一个用于express对象
var app = express();

//当请求路径为/（一般来说是主页）时,的处理函数
app.get('/', function(req, res) {
  
    entries=fs.readdirSync("C:/");
    res.send(entries);
});

//服务器开始监听
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

就已经把C盘下的文件列了出来。 
但是如果不仅仅是想显示C盘的呢？  
我们查阅资料，看看怎样解析请求参数

> 1、例如：127.0.0.1:3000/index，这种情况下，我们为了得到index，我们可以通过使用req.params得到，通过这种方法我们就可以很好的处理Node中的路由处理问题，同时利用这点可以非常方便的实现MVC模式  
> 2、例如：127.0.0.1:3000/index?id=12，这种情况下，这种方式是获取客户端get方式传递过来的值，通过使用req.query.id就可以获得，类似于PHP的get方法  
> 3、例如：127.0.0.1：300/index，然后post了一个id=2的值，这种方式是获取客户端post过来的数据，可以通过req.body.id获取，类似于PHP的post方法

我们这边利用2，改动如下

再访问*http://localhost:3000/?uri=D:/*这个
```
//引入express组件以使用express库中的函数
var express = require('express');

var fs=require('fs');
var Path=require('path');

//创建一个用于express对象
var app = express();

//当请求路径为/（一般来说是主页）时,的处理函数
app.get('/', function(req, res) {
  
    entries=fs.readdirSync(req.query.uri);
    res.send(entries);
});

//服务器开始监听
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```

显示文件
-------------------------------------------------------------------------------

核心代码如下

```
...
//这里指定了后缀名和mime类型的一一映射关系
//需要说明的是如果一个图片以txt类型打开当然会变成乱码，其他类型也是同理
var mime = {  
    "html" : "text/html",  
    "css"  : "text/css",  
    "js"   : "text/javascript",  
    "json" : "application/json",  
    "ico"  : "image/x-icon",  
    "gif"  : "image/gif",  
    "jpeg" : "image/jpeg",  
    "jpg"  : "image/jpeg",  
    "png"  : "image/png",  
    "pdf"  : "application/pdf",  
    "svg"  : "image/svg+xml",  
    "swf"  : "application/x-shockwave-flash",  
    "tiff" : "image/tiff",  
    "txt"  : "text/plain",  
    "wav"  : "audio/x-wav",  
    "wma"  : "audio/x-ms-wma",  
    "wmv"  : "video/x-ms-wmv",  
    "xml"  : "text/xml"  
};  

app.get('/', function(req, res) {
    //获取后缀名
    var extname = Path.extname( req.query.uri );    
    var type = extname.slice(1);  
    
    filesLoad(req.query.uri , type, req, res);   
});

function filesLoad(filePath, type, req, res){    
        fs.exists(filePath, function(exists){    
            if ( !exists ) {    
                res.writeHead(404, {'Content-Type': 'text/plain'});    
                // res.write();    
                res.end();    
            } else {    
                fs.readFile(filePath, 'binary', function(err, file){
                    //如果文件打开失败，就返回500
                    if ( err ) {    
                        res.writeHead(500, {'Content-Type': 'text/plain'});    
                        // res.write();    
                        res.end();    
                    } else {    
                        res.writeHead(200, {'Content-Type': mime[type]});    
                        res.write(file, 'binary');    
                        res.end();    
                    }    
                });    
            }    
        })    
    }    


...
```

正式开始
======================================================================================

后端核心代码如下
--------------------------------------------------------------------------------------

```
app.get('/myfile',function(req,res){
    filesLoad('./index.html', 'html', req, res); 
})
app.get('/path',function(req,res){
    var entries=fs.readdirSync(req.query.uri);
    res.send(entries);
})

app.get('/detail', function(req, res) {
    var extname = Path.extname( req.query.uri );    
    var type = extname.slice(1);      
    var entries=fs.createReadStream(req.query.uri);
    filesLoad(req.query.uri , type, req, res);   
});
```
实现过程中,遇到的问题有
- [跨域](http://note.youdao.com/noteshare?id=e86083323085901d513df6fa254d1c50&sub=4F184A5B8A504FB0B6B12C1E0E334C96)  
- express中app.all和app.use差别
    - all执行完整匹配,use只匹配前缀 
    - 对于代码

```
app.use '/home', (req, res, next) ->
  console.log('app.use');
  next();
  
app.all '/home', (req, res, next) ->
  console.log('app.all');   
  next();
//访问/home则 use和all都会被调用,访问/home/index只有use会被调用
```
- 前端请求时提交的参数无法找到
    -  body-parser的问题
    -  没有安装body-parser
    -  安装了body-parser但是配置不正确
    -  配置正确还是获取不到,有可能是路由设置的问题
- MIME解析
    - 现代浏览器对于不同的文件类型已经有一套自己的展示方案，比如Chrome在打开网络上的pdf时，就可以直接打开，比如打开

在完成前端页面后具体代码见 github地址  
发现/path这个接口，只返回一个文件名列表所含的信息太少了，最好能把文件类型一并传过去


前端实现
------------------------------------------------------------------------------------------

```
<!DOCTYPE html>
<html>

<head>
    <link href="http://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet">
    <link href="http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>

<body ng-app="FileApp">
    <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <div class="navbar-brand" href="#">
                    <h2>文件管理器</h2>

                    </a>
                </div>
            </div>
    </nav>

    <div class="container" ng-controller="filelist">
           <div class="input-group">
                    <input type="text" class="form-control" ng-model="currentPath">
                    <span class="input-group-btn">
                    <button class="btn btn-primary" type="button" ng-click="OpenPath()">Go!</button>
                </span>
                </div>
        <div class="row">
            <div class=" col-md-8">
             
                <div class="panel panel-default">
                    <div class="panel-heading">文件列表</div>
                    <div class="panel-body">
                        <div class="list-group">
                            <a href="#" class="list-group-item  text-justify" ng-repeat="x in filelist" ng-click="Open(x)">
                                <i class=" fa fa-{{IconMaps[x.type]}}"></i> <small>{{x.name}}</small> 
                            </a>


                        </div>


                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="panel panel-default">
                    <div class="panel-heading">历史纪录</div>
                    <div class="panel-body">
                        <div class="list-group">
                            <a href="#" class="list-group-item text-justify" ng-repeat="x in last   track by $index" ng-click="Last(x)"><small>{{x}}</small> </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>


    </div>
    <script src="http://cdn.static.runoob.com/libs/angular.js/1.4.6/angular.min.js"></script>
    <script>
        //设置服务器地址
        var serverUrl="http://localhost:3000";
        //angulerjs的模块和控制器设置
        var app = angular.module('FileApp', []);
        app.controller('filelist', function($scope,$http) {
            //设置将会用到的图标类型，不同的文件用不同的图标
            $scope.IconMaps={
                zip:"file-zip-o",
                txt:"file-text-o",
                mp4:"file-movie-o",
                xlsx:"file-excel-o",
                js:"file-code-o",
                cs:"file-code-o",
                html:"file-code-o",
                mp3:"file-audio-o",
                jpg:"file-image-o",
                jpeg:"file-image-o",
                png:"file-image-o",
                pdf:"file-pdf-o",
                doc:"file-word-o",
                dir:"folder-o",
                iso:"file-archive-o"
            };
            //初始化当前窗口需要显示的文件列表
            $scope.filelist=[];
            //初始化默认当前目录
            $scope.currentPath="D:/";
            //初始化历史纪录
            $scope.last=[];
            //打开某个路径时所执行的函数
            $scope.OpenPath=function(){
                //向某个地址post提交，当前目录
                $http.post(serverUrl+'/path',{uri:$scope.currentPath}).success(function(data){
                    //将成功获取的数据赋值给当前显示的文件列表
                        $scope.filelist=data;
                })
            }
            //打开文件列表中的某一项时执行的函数
            $scope.Open=function(x){
              //如果是目录
                if(x.type=="dir"){
                  //添加历史纪录
                  $scope.last.push($scope.currentPath);
                  //修改当前目录
                  $scope.currentPath= $scope.currentPath+x.name+"/"
                  //当前目录
                    $scope.OpenPath();
                }else{
                    //如果是文件，则打开那个文件
                    window.open(serverUrl+"/detail?uri="+$scope.currentPath+x.fullname);
                }

            }
            //返回某一个路径x
            $scope.Last=function(x){
                //将当前路径设置为x
                $scope.currentPath= x;
                //打开当前路径
                $scope.OpenPath();
            }
            //打开当前路径
            $scope.OpenPath();
        });
    </script>
</body>

</html>
```

