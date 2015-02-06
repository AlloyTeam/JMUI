# JMUI 文档

## 在线地址 [http://jmui.github.io](http://jmui.github.io)

## 本地安装

    $ git clone https://github.com/laispace/JMUI-site.git

    $ cd JMUI-site

    $ grunt

    访问 [http://localhost:3000/](http://localhost:7777/) 进行查看


## 根据 JMUI dist 的代码生成文档

部署到生产环境下前执行:

    $ grunt build

生产环境下执行 :

    $ grunt

## 更新  JMUI dist 的代码

以下操作建立在 JMUI-site/ 与 JMUI/ 处于同级目录的情况下进行:

    // 切换到 JMUI 目录
    $ cd JMUI
    // 生成最新的 JMUI/dist 代码
    $ grunt build

    // 切换到 JMUI-site 目录
    $ cd JMUI-site

    // 根据 JMUI/dist 的代码生成配置到 JMUI/public/JMUI/dist/*.js
    // 根据 JMUI/dist 的代码生成 demo 到 JMUI/public/JMUI/dist/demo/*.html
    $ grunt build


    // 生成静态 HTML, 可以脱离 Node 服务器环境运行
    $ grunt dist

    // 开启网站
    $ grunt

    接着打开 http://localhost:3000 查看文档


## 生成静态 HTML 的代码

执行：

    // 生成 view/*.ejs 对应的 public/*.html
    // 如 view/home 对应 public/home.html
    $ grunt generateStaticHtmls

