module.exports = {
    // page 设置不同页面需要输出的文档
    page: {
        // http://localhost/base-css 基础样式
        "base-css": {
            "files": [
                {"name": "base-color", "title": "基础颜色", "required": false},
                {"name": "base-clearfix", "title": "清除浮动", "required": false},
                {"name": "base-center", "title": "垂直居中", "required": false},
                {"name": "base-1px", "title": "1px边框", "required": false},
                {"name": "base-nowrap", "title": "文字溢出省略", "required": false}
            ]
        },
        // http://localhost/ui-css UI组件
        "ui-css": {
            "files": [
                {"name": "button", "title": "按钮"},
                {"name": "dot", "title": "点"},
                {"name": "corner-tag", "title": "角标"},
                {"name": "table", "title": "表格"},
                {"name": "form", "title": "表单"},
                {"name": "list", "title": "列表"}
            ]
        },
        // http://localhost/ui-js JS 插件
        "ui-js": {
            "files": [
                {"name": "loading", "title": "加载中"},
                {"name": "tab", "title": "标签栏"},
                {"name": "toast", "title": "提示"},
                {"name": "progress", "title": "进度条"},
                {"name": "range", "title": "范围条"},
                {"name": "dialog", "title": "对话框"},
                {"name": "action-sheet", "title": "菜单"},
                {"name": "action-share", "title": "分享到"}
            ]
        }
    },

    // 定制化打包时指定必须包含的基础文件
    requiredFiles: {
        // jmui.css 依赖 reset.css
        css: ['reset'],

        // jmui.js 依赖 zepto.min.js 以及 core/core.js 和 core/component.js
        js: ['../lib/zeptojs/zepto.min','core/core', 'core/component']
    }
};




