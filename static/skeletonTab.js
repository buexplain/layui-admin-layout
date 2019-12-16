/**
 * 顶部选项卡
 */
layui.define(['layer','element'], function(exports) {
    var layer      = layui.layer;
    var element    = layui.element;
    var $          = layui.jquery;

    var _filter  = null;
    var _tab     = null;
    var _title   = null;
    var _content = null;

    /**
     * 记录每个tab iframe 的 src
     */
    window.__2019125_history = {
        destroy: function(id) {
            window.localStorage.removeItem(id);
        },
        record: function (id) {
            var tmp = document.querySelectorAll("iframe");
            var history = window.localStorage.getItem(id);
            if(history == null) {
                history = [];
            }else {
                history = JSON.parse(history);
            }
            try {
                for(var i in tmp) {
                    if(tmp[i].id === id) {
                        var url = window.frames[i].location.href;
                        if(history[history.length -1] !== url) {
                            history.push(window.frames[i].location.href);
                            window.localStorage.setItem(id, JSON.stringify(history));
                        }
                    }
                }
            }catch (e) {
                console.log(e);
            }
        },
        back: function (id) {
            var history = window.localStorage.getItem(id);
            if(history == null) {
                history = [];
            }else {
                history = JSON.parse(history);
            }
            if(history.length === 0) {
                return '';
            }
            if(history.length === 1) {
                return history[0];
            }
            history.pop();
            var url = history.pop();
            window.localStorage.setItem(id, JSON.stringify(history));
            return url;
        }
    };

    /**
     * 切换选项卡
     */
    function change(id) {
        element.tabChange(_filter, id);
    }

    /**
     * 添加一个选项卡
     */
    function add(title, url, id) {
        //显示加载层
        var loadIndex = layer.load();
        //设置2秒后再次关闭loading
        setTimeout(function() {
            layer.close(loadIndex);
        }, 2000);
        window.__2019125_history.destroy('iframe-id-'+id);
        var iframe = '<iframe onload="layui.layer.close('+loadIndex+');window.__2019125_history.record(this.id);" src="'+url+'" id="iframe-id-'+id+'" name="iframe-name-'+id+'" frameborder="0" style="height:100%;width:100%;margin:0;padding:0;border:0;"></iframe>';
        element.tabAdd(_filter, {title: title, content: iframe, id: id});
        setTimeout(function () {
            resetHeight(height());
        }, 100);
    }

    function height() {
        return $(window).height() - 60 - 41 - 5;
    }

    /**
     * 返回当前选项卡
     */
    function curr() {
        var tmp = _content.find('.layui-show');
        if(tmp.length === 0) {
            return null;
        }
        return tmp.eq(0);
    }

    /**
     * 判断一个选项卡是否存在
     */
    function has(id) {
        var li = _title.find('li[lay-id='+id+']');
        if(li.length === 0) {
            return false;
        }
        return true;
    }

    /**
     * 删除一个选项卡
     */
    function del(id) {
        element.tabDelete(_filter, id);
    }

    /**
     * 重置内容区域高度
     */
    function resetHeight(h) {
        _content.find('.layui-tab-item').each(function() {
            $(this).height(h);
        });
    }

    /**
     * 导出接口
     */
    exports('skeletonTab', function(filter) {
        _filter  = filter;
        _tab     = $('.layui-tab[lay-filter='+_filter+']').eq(0);
        _title   = _tab.children('.layui-tab-title').eq(0);
        _content = _tab.children('.layui-tab-content').eq(0);
        if(_tab.length === 0) {
            layer.msg('没有找到切换卡');
            return false;
        }
        return {resetHeight: resetHeight, curr: curr, change: change, add: add, has: has, del: del};
    });
});