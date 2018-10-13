layui.define(['layer','element', 'categoryTree'], function(exports) {
    var layer      = layui.layer;
    var element    = layui.element;
    var categoryTree   = layui.categoryTree;
    var $          = layui.jquery;

    var _filter  = null;
    var _nav        = null;

    /**
     * 将树形结构的数据渲染成html
     */
    function renderHTML(data, topid, idname, pidname, nodename, urlname) {
        topid    = topid    || 0;
        idname   = idname   || 'id';
        pidname  = pidname  || 'pid';
        nodename = nodename || 'node';
        urlname  = urlname  || 'url';

        var recursion = new categoryTree.recursion(data, idname, pidname, topid);
        var html = '';

        recursion.forBefore = function (v, k, hasChildren) {
            html += '<li class="layui-nav-item">';
        };

        recursion.forcurr = function(v, k, hasChildren) {
            html += '<a href="javascript:;"'+(v[urlname] ? ' data-url="'+v[urlname]+'" data-id="'+v[idname]+'"' : '')+'>';
            html += v[nodename];
            html += '</a>';
        };

        recursion.callBefore = function (v, k) {
            html += '<ul class="layui-nav-child">';
        };

        recursion.callAfter = function (v, k) {
            html += '</ul>';
        };

        recursion.forAfter = function (v, k, hasChildren) {
            html += '</li>';
        };

        recursion.start();

        return html;
    }

    /**
     * 添加
     */
    function add(data, topid, idname, pidname, nodename, urlname) {
        var html = renderHTML(data, topid, idname, pidname, nodename, urlname);
        _nav.append(html);
        element.render('nav', _filter);
    }

    /**
     * 重置
     */
    function set(data, topid, idname, pidname, nodename, urlname) {
        var html = renderHTML(data, topid, idname, pidname, nodename, urlname);
        _nav.html(html);
        element.init('nav('+_filter+')');
    }

    function isOpen(id) {
        var a = _nav.find('a[data-id='+id+']');
        if(a.length > 0) {
            var p = a.parent();
            if(p.hasClass('layui-nav-itemed') || p.hasClass('layui-this')) {
                return true;
            }
        }
        return false;
    }

    function open(id) {
        if(isOpen(id) == false) {
            var a = _nav.find('a[data-id='+id+']');
            if(a.length > 0) {
                a.eq(0).click();
            }
        }
    }

    function close(id) {
        if(isOpen(id) == true) {
            var a = _nav.find('a[data-id='+id+']');
            if(a.length > 0) {
                a.eq(0).click();
            }
        }
    }

    function flexible(id) {
        var a = _nav.find('a[data-id='+id+']');
        if(a.length > 0) {
            a.eq(0).click();
            console.log(a.eq(0)[0].innerText)
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
    exports('boostNav', function(filter) {
        _filter  = filter;
        _nav        = $('.layui-nav[lay-filter='+_filter+']').eq(0);
        if(_nav.length == 0) {
            layer.msg('没有找到导航栏，模块初始化失败');
            return false;
        }
        return {add: add, set: set, flexible:flexible, isOpen:isOpen, open:open, close:close, listen:listen};
    });
});