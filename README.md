# JMUI
    
    哇咔咔我是吊炸天的介绍.

## 目录结构

- index.html
    + 示例入口文件
- demo/
    + 示例 
- stylus/
    + 存放 .styl 源码
- css/
    + 执行 `$ grunt stylus` 后生成的 *.css 文件 
- js/
    + 存放 .js 源码
- lib/
    + 存放第三方依赖


## 代码规范

代码请遵命[AlloyTeam 团队规范](http://alloyteam.github.io/code-guide/#css)

## 构建方式

    $ git clone https://github.com/AlloyTeam/JMUI.git

    $ cd JMUI

    $ npm install 

    $ grunt


## 构建

    $ grunt build

## 备忘

为了方便自动生成文档, 约定如下:

demo/*.html 包含以下 html 结构即可自动生成文档:

    <section id="组件ID">
        <div class="demo-item">
             <p class="demo-desc">组件描述</p>
            <div class="demo-block">
                组件代码
            </div>
        </div>
        <div class="demo-item">
             <p class="demo-desc">组件描述</p>
            <div class="demo-block">
                组件代码
            </div>
        </div>
    </section>

其中, #id 唯一, .demo-item 可多个.

举个例子:

    <section id="corner-tag">
        <div class="demo-item">
            <p class="demo-desc">边角标记</p>
            <div class="demo-block">
                <div class="ui-corner-tag">
                    <img src="../img/qq.png"/>
                    <div class="ui-tag-red">红</div>
                </div>
                <div class="ui-corner-tag">
                    <img src="../img/qq.png"/>
                    <div class="ui-tag-orange">橙</div>
                </div>

                <div class="ui-corner-tag">
                    <img src="../img/qq.png"/>
                    <div class="ui-tag-blue">蓝</div>
                </div>
                <div class="ui-corner-tag">
                    <img src="../img/qq.png"/>
                    <div class="ui-tag-green">绿</div>
                </div>
            </div>
        </div>
    </section>

这么写的话, JMUI-site 构建时会自动输出文档 :)
