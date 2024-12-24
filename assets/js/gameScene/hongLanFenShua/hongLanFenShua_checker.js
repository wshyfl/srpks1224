
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        var _color = Tools.random(1, 255);
        this.node.color = new cc.color(_color, _color, _color, 255);
        this.index = -1;
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 1://赛车1
                if (this.index == 2)
                    cc.director.emit("分数减少", false);
                this.index = 1;
                cc.director.emit("分数增加", true);
                break;
            case 2://赛车2
                if (this.index == 1)
                    cc.director.emit("分数减少", true);
                this.index = 2;
                cc.director.emit("分数增加", false);
                break;
        }
    },
    // update (dt) {},
});
