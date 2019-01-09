/**
 * 父子级树有关的操作
 */
layui.define( function(exports) {
    /**
     * 递归遍历一棵树
     * @param arr
     * @param idName
     * @param parentIDName
     */
    var recursion = function (arr, idName, parentIDName, topID) {
        var _that = this;
        var _father   = [];
        var _children = [];
        var _idName       = idName       || 'id';
        var _parentIDName = parentIDName || 'pid';
        var _topID        = topID || 0;
        var _getChildren = function(id) {
            var children = [];
            for(var i in _children) {
                if(_children[i][_parentIDName] === id) {
                    children.push(_children[i]);
                }
            }
            return children;
        };

        for(var i in arr) {
            if(arr[i][_parentIDName] === _topID) {
                _father.push(arr[i]);
            }else{
                _children.push(arr[i]);
            }
        }

        _that.currentBefore   = function(v, k, counter) {};
        _that.current         = function(v, k, counter) {};
        _that.currentAfter    = function(v, k, counter) {};
        _that.loopBefore      = function(v, k) {};
        _that.loopAfter       = function(v, k) {};

        _that.loop = function(arr) {
            if(arr === undefined) {
                arr = _father;
            }
            for(var i in arr) {
                var children = _getChildren(arr[i][_idName]);
                var counter = children.length;
                _that.currentBefore(arr[i], i, counter);
                _that.current(arr[i], i, counter);
                if(counter > 0) {
                    _that.loopBefore(arr[i], i);
                    _that.loop(children);
                    _that.loopAfter(arr[i], i);
                }
                _that.currentAfter(arr[i], i, counter);
            }
        };
    };

    /**
     * 将一个父子级的数组转换成一棵树形数组
     */
    var tree = function tree(arr, idName, parentIDName, childrenName) {
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

    exports('treeHelper', {
        recursion:recursion,
        tree:tree
    });
});