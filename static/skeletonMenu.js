/**
 * 左侧菜单栏
 */
layui.define(['layer','element', 'treeHelper'], function(exports) {
    var layer      = layui.layer;
    var element    = layui.element;
    var treeHelper = layui.treeHelper;
    var $          = layui.jquery;

    var _filter  = null;
    var _menu     = null;

    /**
     * 将树形结构的数据渲染成html
     */
    function renderHTML(data, topID, idName, pidName, nodeName, urlname) {
        topID    = topID    || 0;
        idName   = idName   || 'id';
        pidName  = pidName  || 'pid';
        nodeName = nodeName || 'node';
        urlname  = urlname  || 'url';

        var recursion = new treeHelper.recursion(data, idName, pidName, topID);
        var html = '';

        recursion.currentBefore = function (v, k, counter) {
            html += '<li class="layui-nav-item">';
        };

        recursion.current = function(v, k, counter) {
            html += '<a href="javascript:;"'+(v[urlname] ? ' data-url="'+v[urlname]+'" data-id="'+v[idName]+'"' : '')+'>';
            html += v[nodeName];
            html += '</a>';
        };

        recursion.loopBefore = function (v, k) {
            html += '<ul class="layui-nav-child">';
        };

        recursion.loopAfter = function (v, k) {
            html += '</ul>';
        };

        recursion.currentAfter = function (v, k, counter) {
            html += '</li>';
        };

        recursion.loop();

        return html;
    }

    /**
     * 初始化
     */
    function init(data, topID, idName, pidName, nodeName, urlName) {
        var html = renderHTML(data, topID, idName, pidName, nodeName, urlName);
        _menu.html(html);
        element.init('nav('+_filter+')');
    }

    /**
     * 判断是否打开
     */
    function isOpen(id) {
        var a = _menu.find('a[data-id='+id+']');
        if(a.length > 0) {
            var p = a.parent();
            if(p.hasClass('layui-nav-itemed') || p.hasClass('layui-this')) {
                return true;
            }
        }
        return false;
    }

    /**
     * 打开一个菜单
     */
    function open(id) {
        if(isOpen(id) === false) {
            var a = _menu.find('a[data-id='+id+']');
            if(a.length > 0) {
                a.eq(0).click();
            }
        }
    }

    /**
     * 关闭一个菜单
     */
    function close(id) {
        if(isOpen(id) === true) {
            var a = _menu.find('a[data-id='+id+']');
            if(a.length > 0) {
                a.eq(0).click();
            }
        }
    }

    function listen(callback) {
        element.on('nav('+_filter+')', function(elem) {
            callback(elem);
        });
    }

    /**
     * 导出接口
     */
    exports('skeletonMenu', function(filter) {
        _filter  = filter;
        _menu        = $('.layui-nav[lay-filter='+_filter+']').eq(0);
        if(_menu.length === 0) {
            layer.msg('没有找到导航栏，模块初始化失败');
            return false;
        }
        return {init: init, isOpen:isOpen, open:open, close:close, listen:listen};
    });
});