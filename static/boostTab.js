layui.define(['layer','element'], function(exports) {
    var layer      = layui.layer;
    var element    = layui.element;
    var $          = layui.jquery;

    var _filter  = null;
    var _tab     = null;
    var _title   = null;
    var _content = null;

    function change(id) {
        element.tabChange(_filter, id);
    }

    function add(title, content, id) {
        element.tabAdd(_filter, {title: title, content: content, id: id});
    }

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

    function addIFrame(title, url, id) {
        //显示加载层
        var loadIndex = layer.load();
        //设置2秒后再次关闭loading
        setTimeout(function() {
            layer.close(loadIndex);
        }, 2000);
        window.__2019125_history.destroy('iframe-i-2019125-'+id);
        var iframe = '<iframe onload="layui.layer.close('+loadIndex+');__2019125_history.record(this.id);" src="'+url+'" id="iframe-i-2019125-'+id+'" name="iframe-n-2019125-'+id+'" frameborder="0" style="height:100%;width:100%;margin:0;padding:0;border:0;"></iframe>';
        add(title, iframe, id)
    }

    function currContent() {
        var tmp = _content.find('.layui-show');
        if(tmp.length === 0) {
            return null;
        }
        return tmp.eq(0);
    }

    function has(id) {
        var li = _title.find('li[lay-id='+id+']');
        if(li.length === 0) {
            return false;
        }
        return true;
    }

    function del(id) {
        element.tabDelete(_filter, id);
    }

    /**
     * 导出接口
     */
    exports('boostTab', function(filter) {
        _filter  = filter;
        _tab     = $('.layui-tab[lay-filter='+_filter+']').eq(0);
        _title   = _tab.children('.layui-tab-title').eq(0);
        _content = _tab.children('.layui-tab-content').eq(0);
        if(_tab.length === 0) {
            layer.msg('没有找到切换卡');
            return false;
        }
        return {currContent: currContent, change: change, add: add, addIFrame: addIFrame, has: has, del: del, _title: _title, _content: _content};
    });
});