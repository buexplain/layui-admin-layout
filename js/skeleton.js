layui.define(['layer', 'element', 'boostNav', 'boostTab'], function(exports) {
    var _tab = null;
    var _nav = null;
    var $    = layui.jquery;
    $('body').append('<style>.layui-layout-admin .layui-body{bottom:0}.layui-layout-admin .layui-tab{margin:0}.layui-layout-admin .layui-tab-content{padding:0}.layui-layout-admin .layui-tab-title li:first-child .layui-tab-close{display:none}</style>');
    function height() {
        return $(window).height() - 60 - 41 - 3;
    }
    function resetContentHeight(h) {
        _tab._content.find('.layui-tab-item').each(function() {
            $(this).height(h);
        });
    }

    exports('skeleton', function(navFilter, tabFilter) {
        _nav = layui.boostNav(navFilter);
        _tab = layui.boostTab(tabFilter);
        _nav.listen(function(elem) {
            var title = elem[0].innerText;
            var url   = elem.attr('data-url');
            var id    = elem.attr('data-id');
            if(url != undefined && url != "" && url.indexOf('javascript') == -1 && id != undefined && id != "") {
                if(_tab.has(id)) {
                    _tab.del(id)
                }
                //顶部切换卡新增一个卡片
                _tab.addIFrame(title, url, id);
                //重新计内容框高度
                resetContentHeight(height());
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
            tab:_tab
        }
    });
});