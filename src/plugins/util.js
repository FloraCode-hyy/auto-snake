let Util  = {
    debug:false,
    //注意没有实现深度拷贝
    log(msg){
        if(Util.debug){
            console.log(msg);
        }
    },
    extend(){
        var i =1
        var target =  arguments[0]
        var length = arguments.length
        let options
        let copy
        let name
        if(typeof target!="object" &&typeof target!="function"){
            target = {};
        }
        for (;i<length;i++){
            if((options=arguments[i])!=null){
                for (name in options) {
                    copy = options[ name ];
                    if ( target === copy ) {
                        continue;
                    }
                    target[ name ] = copy;
                }
            }
        }
        return target;
    },
    BST: function (compareFunc) {
        var _this = this;
        this.root = null;
        this.compareFunc = compareFunc;
        this.size = 0;
        this.insert = function (data) {
            if (isNaN(data) && !this.compareFunc) {
                return;
            }
            this.root = insertEle(this.root, data);
            this.size = this.size+1;
        }
        //局部函数也就相当于私有函数
        var insertEle = function (node, data) {
            if (node == null) {
                return new Node(data);
            }
            if (!_this.compareFunc) {
                if (data > node.data) {
                    node.right = insertEle(node.right, data);
                } else if (data < node.data) {
                    node.left = insertEle(node.left, data);
                } else {
                    node.num.push(data);
                }
            } else {
                var comRes = _this.compareFunc(data, node.data);
                if (comRes > 0) {
                    node.right = insertEle(node.right, data);
                } else if (comRes < 0) {
                    node.left = insertEle(node.left, data);
                } else {
                    node.num.push(data);
                }
            }
            return node;
        }

        this.removeMin = function () {
            if (this.root == null) return;
            var min = this.findMin();
            this.root = removeMinEle(this.root);
            return min;
        }

        this.findMin = function () {
            if(this.root==null) return null;
            let min = findMinEle(this.root);
            return  min;
        }



        var findMinEle = function (node) {
            if (node.left == null) {//说明此节点已经是最小的了
                return node;
            }
            return findMinEle(node.left);
        }


        this.findMax = function () {
            if(this.root==null) return null;
            let max = findMaxEle(this.root);
            return  max;
        }

        var findMaxEle = function (node) {
            if (node.right == null) {//说明此节点已经是最小的了
                return node;
            }
            return findMaxEle(node.right);
        }

        var removeMinEle = function (node) {
            if (node.left == null) {//说明此节点已经是最小的了
                node.minData = node.num.pop();
                _this.size = _this.size-1;
                if (node.num.length > 0) {
                    return node;
                }
                var right = node.right;
                node = node.right = null;
                return right;
            }
            node.left = removeMinEle(node.left);
            return node;
        }

        //中序遍历
        this.midOrder = function () {
            midOrderEle(this.root);
        }

        this.isEmpty = function(){
            return this.size==0;
        }

        var midOrderEle = function (node) {
            if (node == null) {
                return;
            }
            midOrderEle(node.left);
            console.log(node.data);
            midOrderEle(node.right);
        }

        var Node = function (data) {
            this.left = null;
            this.right = null;
            this.data = data;
            this.num = [];
            this.num.push(data);
        }
    }
}

export default Util
