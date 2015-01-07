## 备忘

为了方便自动生成文档, 约定如下:

demo/*.html 包含以下 html 结构即可自动生成文档:

    <section id="组件ID">
        <div class="demo-item">
            <p class="demo-desc">组件描述</p>
            <div class="demo-block">
                组件 html 代码
            </div>
        </div>
        <div class="demo-item">
             <p class="demo-desc">组件描述</p>
            <div class="demo-block">
                组件代码
            </div>
        </div>
    </section>

其中, #组件ID 唯一, .demo-item 可多个.

