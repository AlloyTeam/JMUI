var cheerio = require('cheerio');
var path    = require('path');
var fs      = require('fs');
var stripIndent = require('strip-indent');

/**
 * 返回 JMUI 的代码片段, 从 JMUI/demo/*.html 中抽取
 * @param files, 传入 "base-css"/"ui-css"
 * @returns {Array} 返回代码片段组成的数组
 */
function getDemos (jmuiDemoDir, files) {
    var len = files.length;
    var demos = [];
    for(var i=0;i<len;i++) {
        var name = files[i].name, title = files[i].title;
        var demoHtmlFilePath = path.join(jmuiDemoDir, name + '.html');
        var demoHtmlFileContent = fs.readFileSync(demoHtmlFilePath).toString();
        var $ = cheerio.load(demoHtmlFileContent, {decodeEntities: false});
        var html = $('.jmu-content-container').html();
        var items = [];
        var itemsLen = $('.demo-item').length;
        for (var j=0;j<itemsLen;j++) {
            var itemJ = $('.demo-item').eq(j);
            var desc = itemJ.find('.demo-desc').text();
            var block = itemJ.find('.demo-block').html();
            var script = itemJ.find('.demo-script').text();
            var item = {};

            item.desc = desc;
            item.block = stripIndent(block);
            item.script = stripIndent(script);

            items.push(item);
        }
        var demo = {
            name: name,
            title: title,
            items: items,
            html: html
        };
        demos.push(demo);
    }
    return demos;
};


exports.getDemos = getDemos;

