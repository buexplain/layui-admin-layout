/**
 * 左侧菜单栏
 */
layui.define(['layer','element'], function(exports) {
    var layer   = layui.layer;
    var element = layui.element;
    var $       = layui.jquery;

    var _filter  = null;
    var _menu     = null;

    /**
     * 将一个父子级的数组转换成一棵树形数组
     */
    function tree(arr, idName, parentIDName, childrenName) {
        idName = idName || 'id';
        parentIDName = parentIDName || 'pid';
        childrenName = childrenName || 'children';

        var map = new Map();
        arr.forEach(function (value) {
            value[childrenName] = [];
            map.set(value[idName], value);
        });

        var result = [];

        arr.forEach(function (value) {
            if(map.has(value[parentIDName])) {
                map.get(value[parentIDName])[childrenName].push(value);
            }else {
                result.push(value);
            }
        });
        return result;
    };

    /**
     * 将树形结构的数据渲染成html
     */
    function renderHTML(data, idName, pidName, nodeName, urlname, childrenName) {
        //初始化相关字段名称
        idName        = idName   || 'id';
        pidName       = pidName  || 'pid';
        nodeName      = nodeName || 'node';
        urlname       = urlname  || 'url';
        childrenName  = childrenName  || 'children';

        var html = '';
        //递归所需函数
        var _loop = function(data) {
            var html = '';
                for(var i in data) {
                    var v = data[i];
                    html += '<dd>';
                    html += '<a href="javascript:;"'+(v[urlname] ? ' data-url="'+v[urlname]+'" data-id="'+v[idName]+'"' : '')+'>';
                    html += v[nodeName];
                    html += '</a>';
                    if (v[childrenName].length > 0) {
                        html += '<dl class="layui-nav-child">';
                        html += _loop(v[childrenName]);
                        html += '</dl>';
                    }
                    html += '</dd>';
                }
                return html;
        }
        
        //循环外层的li
        for(var i in data) {
            var v = data[i];
            html += '<li class="layui-nav-item">';
            html += '<a href="javascript:;"'+(v[urlname] ? ' data-url="'+v[urlname]+'" data-id="'+v[idName]+'"' : '')+'>';
            html += v[nodeName];
            html += '</a>';
            if(v[childrenName].length > 0) {
                html += '<dl class="layui-nav-child">';
                html += _loop(v[childrenName]);
                html += '</dl>';
            }
            html += '</li>';
        }
        
        //返回结果
        return html;
    }

    /**
     * 初始化
     */
    function init(data, idName, pidName, nodeName, urlName) {
        var html = renderHTML(tree(data, idName, pidName), idName, pidName, nodeName, urlName);
        _menu.html(html);
        element.init('nav', _filter);
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
        _filter = filter;
        _menu   = $('.layui-nav[lay-filter='+_filter+']').eq(0);
        if(_menu.length === 0) {
            layer.msg('没有找到导航栏，模块初始化失败');
            return false;
        }
        return {init: init, isOpen:isOpen, open:open, close:close, listen:listen};
    });
});