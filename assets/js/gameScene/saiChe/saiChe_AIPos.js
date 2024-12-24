

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },
    reset(_index) {

    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 2://赛车2
                cc.director.emit("下一个坐标点");
                this.node.active = false;
                break;
        }
    },
    // update (dt) {},
});
