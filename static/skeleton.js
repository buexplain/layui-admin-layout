/**
 * 整个骨架
 */
layui.define(['layer', 'element', 'skeletonMenu', 'skeletonTab'], function(exports) {
    let _tab = null;
    let _menu = null;
    const $ = layui.jquery;
    const layer = layui.layer;

    function height() {
        return $(window).height() - 60 - 41 - 5;
    }

    /**
     * 刷新当前切换卡
     */
    function refresh() {
        const content = _tab.curr();
        if(content == null) {
            return;
        }
        const iframe = content.find('iframe');
        if(iframe.length === 0) {
            return;
        }
        try {
            const id = iframe.attr("id");
            let index = 0;
            const tmp = document.querySelectorAll("iframe");
            for(const i in tmp) {
                if(tmp[i].id === id) {
                    index = i;
                }
            }
            iframe.attr("src", window.frames[index].location.href);
        } catch(e) {
            layer.msg("操作失败", {icon: 2, time:1000, zIndex:998,  success: function(layerO, index) {
                layerO.css('z-index', 998);
            }});
            console.log(e)
        } finally {

        }
    }

    /**
     * 当前选项卡后退
     */
     function back(o) {
        const content = _tab.curr();
        if(content == null) {
            return;
        }
        const iframe = content.find('iframe');
        if(iframe.length === 0) {
            return;
        }
        try {
            const id = iframe.attr("id");
            const url = window.__2019125_history.back(id);
            if(url.length > 0) {
                iframe.attr("src", url);
            }
        } catch(e) {
            layer.msg("操作失败", {icon: 2, time:1000, zIndex:998, success: function(layerO, index) {
                layerO.css('z-index', 998);
            }});
            console.log(e);
        } finally {

        }
     }

    exports('skeleton', function(menuFilter, tabFilter) {
        _menu = layui.skeletonMenu(menuFilter);
        _tab = layui.skeletonTab(tabFilter);

        //监听右侧栏目的点击事件
        _menu.listen(function(elem) {
            const title = elem[0].innerText;
            const url = elem.attr('data-url');
            const id = elem.attr('data-id');
            if(url !== undefined && url !== "" && url.indexOf('javascript') === -1 && id !== undefined && id !== "") {
                if(!_tab.has(id)) {
                    //顶部切换卡新增一个卡片
                    _tab.add(title, url, id);
                    //重新计内容框高度
                    _tab.resetHeight(height());
                }
                //切换到当前
                _tab.change(id);
            }
        });

        //窗口高度变化，重新计内容框高度
        $(window).resize(function() {
            _tab.resetHeight(height());
        }).resize();

        //返回
        return {
            menu:_menu,
            tab:_tab,
            refresh:refresh,
            back:back
        }
    });
});
