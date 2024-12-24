

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.node.opacity = 0;
        this.H = this.node.height;
        this.playerJS = this.node.parent.parent.getComponent("tank_tank");
    },
    onCollisionStay: function (other, self) {
        // this.node.parent.parent.getComponent("tank_tank").couldFire = false;
        if (other.tag == 0) {
            let posSelf = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let posOther = other.node.parent.convertToWorldSpaceAR(other.node.position);
            var _scaleY = this.getDistance(posSelf, posOther) / this.H;
            if (_scaleY < this.node.scaleY) {
                this.node.scaleY = _scaleY;
            }
            this.playerJS.hadBarrier = true;

        }
        else if (other.tag == 66) {
            this.playerJS.fireFunc();
            this.playerJS.hadBarrier = false;
        }
        
    },
    onCollisionExit: function (other, self) {
        if (other.tag == 0)
            this.node.scaleY = 1;
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
    // update (dt) {},
});
