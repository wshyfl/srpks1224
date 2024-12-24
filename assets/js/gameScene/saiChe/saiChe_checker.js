
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    reset(_carIndex, _checkIndex) {
        this.carIndex = _carIndex;
        this.checkIndex = _checkIndex;
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 1://赛车1
                if (this.carIndex == 0) {
                    cc.director.emit("通过检查点", this.carIndex, this.checkIndex);
                    this.node.active = false;
                }
                break;
            case 2://赛车2
                if (this.carIndex == 1) {
                    cc.director.emit("通过检查点", this.carIndex, this.checkIndex);
                    this.node.active = false;
                }
                break;
        }
    },
    // update (dt) {},
});
