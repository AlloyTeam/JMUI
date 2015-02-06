var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var uuid = require('node-uuid');
var Q = require('q');
var _ = require('underscore.string');
var pageConfig = require('../../config').page;
var mail = require('../utils/mail');
var util = require('../utils');
var zip = require('zipfolder');


// JMUI 源码路径
var jmuiPath = '../../';

// 主页
router.get('/', function (req, res) {
    var data = {title: 'JMUI - 为移动而生'};
    res.render('home', data);
});
router.get('/index', function (req, res) {
    var data = {title: 'JMUI - 为移动而生'};
    res.render('index', data);
});

// 开速开始
router.get('/quick-start', function (req, res) {
    var data = {title: 'JMUI - 快速开始'};
    res.render('quick-start', data);
});

// 基础样式
router.get('/base-css', function (req, res) {
    var files = pageConfig['base-css'].files;
    // get demo codes from public/code/ to render
    var demos = JSON.parse(fs.readFileSync(path.join(__dirname, jmuiPath, 'data/', '_base-css.js')));
    var data = {
        title: 'JMUI - 基础样式',
        demos: demos
    };

    res.render('base-css', data);
});

// UI 组件
router.get('/ui-css', function (req, res) {
    var files = pageConfig['ui-css'].files;
    // get demo codes from public/code/ to render
    var demos = JSON.parse(fs.readFileSync(path.join(__dirname, jmuiPath, 'data/', '_ui-css.js')));
    var data = {
        title: 'JMUI - UI 组件',
        demos: demos
    };
    res.render('ui-css', data);
});

// JS 插件
router.get('/ui-js', function (req, res) {
    var files = pageConfig['ui-js'].files;
    // get demo codes from public/code/ to render
    var demos = JSON.parse(fs.readFileSync(path.join(__dirname, jmuiPath, 'data/', '_ui-js.js')));
    var data = {
        title: 'JMUI - JS 插件',
        demos: demos
    };
    res.render('ui-js', data);
});

// 定制化
router.get('/customize', function (req, res) {
    var baseCss = pageConfig['base-css'].files;
    var uiCss = pageConfig['ui-css'].files;
    var uiJs = pageConfig['ui-js'].files;
    var data = {
        title: 'JMUI - 定制化',
        baseCss: baseCss,
        uiCss: uiCss,
        uiJs: uiJs
    };
    res.render('customize', data);
});

// 接受定制组件的表单, 根据表单数据对 JMUI 组件进行构建后返回一个压缩包
router.post('/customize', function (req, res) {
    var downloadPath = path.join(__dirname, '../public/download', uuid.v4());
    mkdirp.sync(downloadPath + '/css/');
    mkdirp.sync(downloadPath + '/js');

    //base.css 以及 core.js 为基础文件, 必须选入
    var cssFiles = [];
    var jsFiles = [];

    // 合并 CSS
    var cssFileInPath;
    var cssFileOutPath = path.join(downloadPath, 'css', 'jmui.min.css');
    var unCompressedCssFileOutPath = path.join(downloadPath, 'css', 'jmui.css');

    var jsFileInPath;
    var jsFileOutPath = path.join(downloadPath, 'js', 'jmui.min.js');
    var unCompressedJsFileOutPath = path.join(downloadPath, 'js', 'jmui.js');

    // 将 req.body.css 转化为数组格式
    if (Array.isArray(req.body.css)) {
        cssFiles = req.body.css;
    } else if (req.body.css) {
        cssFiles = [req.body.css];
    }

    // 将 req.body.js 转化为数组格式
    if (Array.isArray(req.body.js)) {
        jsFiles = req.body.js;
    } else if (req.body.js) {
        jsFiles = [req.body.js];
    }
    //每个 js 组件包含一个 css 文件
    cssFiles = cssFiles.concat(jsFiles);

    // 添加必选文件必选文件
    var requiredFiles = require('../../config.js').requiredFiles;
    cssFiles = requiredFiles.css.concat(cssFiles);
    jsFiles = requiredFiles.js.concat(jsFiles);

    cssFileInPath = cssFiles.map(function (cssName) {

        return path.join(__dirname, jmuiPath, 'css', cssName + '.css');
    });

    jsFileInPath = jsFiles.map(function (jsName) {
        return path.join(__dirname, jmuiPath, 'js', jsName + '.js');
    });

    util.concatFiles(cssFileInPath, unCompressedCssFileOutPath)
        .then(function (cssFileOutPath) {
            return util.concatFiles(jsFileInPath, unCompressedJsFileOutPath);
        })
        .then(function (jsFileOutPath) {
            return util.minifyCss(cssFileInPath, cssFileOutPath);
        })
        .then(function (cssmin) {
            return [cssmin, util.minifyJs(jsFileInPath, jsFileOutPath)];
        })
        .spread(function (cssmin, jsmin) {
            util.zipFolder(downloadPath)
                .then(function (targetPath) {
                    res.setHeader('Content-type', 'application/x-zip-compressed');
                    res.sendFile(targetPath);

                    // 定时器，一分钟后删除这个临时文件
                    util.removeFolderAndZipFile(downloadPath, 1 * 60 * 1000);
                }, function (err) {
                    res.statusCode(500);
                    res.send(err);
                });
        }, function (err) {
            res.statusCode(500);
            res.send(err);
        });
});


// 发送反馈
router.post('/feedback', function (req, res) {
    var from = req.body.email || '';
    var feedback = req.body.feedback;
    mail.sendFeedback(feedback, from)
        .then(function (info) {
            var data = {retcode: 0, msg: '发送成功, 感谢您的反馈！', info: info};
            res.json(data);
        }, function (error) {
            var data = {retcode: 1, msg: '发送失败, 请重试。', err: error};
            res.json(data);
        });
});
module.exports = router;
