layui.define(['layer', 'element', 'boostNav', 'boostTab'], function(exports) {
    var _tab  = null;
    var _nav  = null;
    var $     = layui.jquery;
    var layer = layui.layer;

    function height() {
        return $(window).height() - 60 - 41 - 3;
    }

    function resetContentHeight(h) {
        _tab._content.find('.layui-tab-item').each(function() {
            $(this).height(h);
        });
    }

    /**
     * 刷新当前切换卡
     */
    function refresh() {
        var content = _tab.currContent();
        if(content == null) {
            return;
        }
        var iframe = content.find('iframe');
        if(iframe.length === 0) {
            return;
        }
        try {
            var id = iframe.attr("id");
            var index = 0;
            var tmp = document.querySelectorAll("iframe");
            for(var i in tmp) {
                if(tmp[i].id === id) {
                    index = i;
                }
            }
            iframe.attr("src", window.frames[index].location.href);
        } catch(e) {
            layer.msg("操作失败", {icon: 2, time:1000, zIndex:998,  success: function(layero, index) {
                layero.css('z-index', 998);
            }});
            console.log(e)
        } finally {

        }
    }

    /**
     * 当前选项卡后退
     */
     function back(o) {
        var content = _tab.currContent();
        if(content == null) {
            return;
        }
        var iframe = content.find('iframe');
        if(iframe.length === 0) {
            return;
        }
        try {
            var id = iframe.attr("id");
            var url = window.__2019125_history.back(id);
            if(url.length > 0) {
                iframe.attr("src", url);
            }
        } catch(e) {
            layer.msg("操作失败", {icon: 2, time:1000, zIndex:998,  success: function(layero, index) {
                layero.css('z-index', 998);
            }});
            console.log(e);
        } finally {

        }
     }

    /**
     * 添加一个选项卡
     */
    function addIFrame(title, url, id) {
        if(!_tab.has(id)) {
            _tab.addIFrame(title, url, id);
            resetContentHeight(height());
        }
    }

    exports('skeleton', function(navFilter, tabFilter) {
        _nav = layui.boostNav(navFilter);
        _tab = layui.boostTab(tabFilter);

        //监听右侧栏目的点击事件
        _nav.listen(function(elem) {
            var title = elem[0].innerText;
            var url   = elem.attr('data-url');
            var id    = elem.attr('data-id');
            if(url !== undefined && url !== "" && url.indexOf('javascript') === -1 && id !== undefined && id !== "") {
                if(!_tab.has(id)) {
                    //顶部切换卡新增一个卡片
                    _tab.addIFrame(title, url, id);
                    //重新计内容框高度
                    resetContentHeight(height());
                }
                //切换到当前
                _tab.change(id);
            }
        });

        //窗口高度变化，重新计内容框高度
        $(window).resize(function() {
            resetContentHeight(height());
        }).resize();

        //返回
        return {
            nav:_nav,
            tab:_tab,
            addIFrame:addIFrame,
            refresh:refresh,
            back:back
        }
    });
});