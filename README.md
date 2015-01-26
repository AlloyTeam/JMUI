# JMUI
    
    哇咔咔我是吊炸天的介绍.

## 目录结构

- index.html
    + 示例入口文件
- demo/
    + 示例 
- img/
    + 存放图片
- stylus/
    + 存放 .styl 源码
- css/
    + 执行 `$ grunt stylus` 后生成的 *.css 文件 
- js/
    + 存放 .js 源码
- lib/
    + 存放第三方依赖类库


## 代码规范

代码请遵命[AlloyTeam 团队规范](http://alloyteam.github.io/code-guide/#css)

## 构建方式
    
    // 下载源码
    $ git clone https://github.com/AlloyTeam/JMUI.git

    // 切换到目录
    $ cd JMUI

    // 安装依赖
    $ npm install 

    // 生成 JMUI/dist/ 文件夹
    $ grunt build

## 构建

    $ grunt build

`grunt build` 后将生成 JMUI/dist/ 目录.

