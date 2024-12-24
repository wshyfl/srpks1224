

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
       
    },
    //碰撞检测
    onCollisionEnter: function (other, self) {

        switch (other.tag) {
            case 666://碰到星星+分
                var _startPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                var _pos = this.node.parent.convertToNodeSpaceAR(_startPos)
                cc.director.emit("星星特效", _pos, other.node.scale);
                other.node.destroy();
                break;
            case 88://陨石
                var _startPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                var _pos = this.node.parent.convertToNodeSpaceAR(_startPos)
                cc.director.emit("陨石特效", _pos, other.node.scale);
                other.node.destroy();
                break;
            case 888://炮弹
                var _startPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                var _pos = this.node.parent.convertToNodeSpaceAR(_startPos)
                cc.director.emit("炮弹特效", _pos, other.node.scale);
                other.node.parent.destroy();
                break;
        }
    },
    // update (dt) {},
});
