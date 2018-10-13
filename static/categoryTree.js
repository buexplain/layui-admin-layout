/**
 * 父子级分类有关的操作
 */
layui.define( function(exports) {
    /**
     * 递归遍历父子级数组
     * @param arr
     * @param idname
     * @param pidname
     * @param topid
     */
    function recursion(arr, idname, pidname, topid) {
        var _that     = this; //对象本身
        var _father   = []; //所有顶级节点
        var _children = []; //所有子节点
        var _idname   = idname  || 'id'; //id名称
        var _pidname  = pidname || 'pid'; //父id名称
        var _topid    = topid   || 0; //顶级节点父id

        for(var i in arr) {
            if(arr[i][_pidname] == _topid) {
                _father.push(arr[i]);
            }else{
                _children.push(arr[i]);
            }
        }

        /**
         * 循环之前回调
         */
        this.forBefore  = function(v, k, hasChildren) {};
        /**
         * 循环时回调
         */
        this.forcurr    = function(v, k, hasChildren) {};
        /**
         * 递归之前回调
         */
        this.callBefore = function(v, k) {};
        /**
         * 递归之后回调
         */
        this.callAfter  = function(v, k) {};
        /**
         * 循环之后回调
         */
        this.forAfter   = function(v, k, hasChildren) {};

        /**
         * 获取某个节点的一级子节点
         */
        this.getChildren = function(id) {
            var son = [];

            for(var i in _children) {
                if(_children[i][_pidname] == id) {
                    son.push(_children[i]);
                }
            }

            return son;
        };

        /**
         * 递归循环函数
         * @param arr
         * @private
         */
        function _each(arr) {
            if(arr == undefined) {
                arr = _father;
            }

            for(var i in arr) {
                var children = _that.getChildren(arr[i][_idname]);
                var counter  = children.length;

                _that.forBefore(arr[i], i, counter);
                _that.forcurr(arr[i], i, counter);

                if(counter) {
                    _that.callBefore(arr[i], i);
                    _each(children);
                    _that.callAfter(arr[i], i);
                }

                _that.forAfter(arr[i], i, counter);
            }
        }

        /**
         * 开始循环
         */
        this.start = function() {
            _each();
        };
    }

    /**
     * 将一个父子级的数组转换成一棵树形数组
     */
    function getTree(arr, id, idname, pidname, childname) {
        id        = id        || 0;
        idname    = idname    || 'id';
        pidname   = pidname   || 'pid';
        childname = childname || 'child';

        function tree(arr, id, idname, pidname, childname) {
            var tmp = [];
            for(var i in arr) {
                if(arr[i][pidname] == id) {
                    arr[i][childname] = tree(arr, arr[i][idname], idname, pidname, childname);
                    tmp.push(arr[i]);
                }
            }
            return tmp;
        }

        var result = tree(arr,id,idname, pidname, childname);

        return result;
    }

    /**
     * 生成树形的 select option
     */
    function getOption(arr, idname, title, pidname, def) {
        idname  = idname  || 'id';
        title   = title   || 'name';
        pidname = pidname || 'pid';
        def     = def     || null;

        var html = '';

        function createOption(arr, idname, value, def, depth) {
            depth   = depth   || 0;
            var icon = '';
            if(depth > 0) {
                for(var j=0; j<depth; j++) {
                    if(j == 0) {
                        icon += '┊......';
                    }else if((j+1) == depth) {
                        icon += '......';
                    }else{
                        icon += '......┊......';
                    }
                }
            }

            for(var i in arr) {
                var selected = '';
                if(def != null && def == arr[i][idname]) {
                    selected = 'selected';
                }
                html += '<option '+selected+' value="'+arr[i][idname]+'">'+icon+arr[i][title]+'</option>';

                if(arr[i]['child'].length > 0) createOption(arr[i]['child'], idname, title, def, depth + 1);
            }
        }

        createOption(getTree(arr, 0, idname, pidname), idname, title, def);

        return html;
    }

    exports('categoryTree', {
        recursion:recursion,
        getTree:getTree,
        getOption:getOption,
    });
});