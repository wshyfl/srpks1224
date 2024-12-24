

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var _left = (this.random(0, 1) == 0);
        if (_left) {
            this.node.x = -250;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(600, this.random(-80, 80))
        }
        else {

            this.node.x = 260;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-600, this.random(-80, 80))
        }
        this.couldBeEat = false;
        cc.director.on("吃分", () => {
            this.couldBeEat = true;
            this.scheduleOnce(() => {
                this.couldBeEat = false;
            }, 0.1)
        }, this)


    },
    reset(_isDown) {
        this.isDown = _isDown;
    },

    start() {

        this.schedule(() => {
            var _vx = this.node.getComponent(cc.RigidBody).linearVelocity.x;
            var _vy = this.node.getComponent(cc.RigidBody).linearVelocity.y;
            var _speedNow = Math.sqrt(Math.pow(_vx, 2) + Math.pow(_vy, 2));
            if (_speedNow < 100) {
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(_vx * 2, _vy * 2,)
                // this.node.getComponent(cc.RigidBody).linearVelocity.x = _vx * 4;
                // this.node.getComponent(cc.RigidBody).linearVelocity.y = _vy * 4;
            }
        }, 2)
    },

    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {


    },
    onCollisionStay: function (other, self) {
        if (this.couldBeEat) {
            self.node.destroy();
            // cc.director.emit("被吃掉了",);
            if (this.node.y > 0) {
                if (this.isDown) {
                    cc.director.emit("分数减少", false);
                    cc.director.emit("减分特效", this.node.position);
                }
                else {
                    cc.director.emit("分数增加", false);
                    cc.director.emit("分数增加", false);
                    cc.director.emit("加分特效", this.node.position);
                }
            }
            else {
                if (this.isDown) {
                    cc.director.emit("分数增加", true);
                    cc.director.emit("分数增加", true);
                    cc.director.emit("加分特效", this.node.position);
                }
                else {

                    cc.director.emit("分数减少", true);
                    cc.director.emit("减分特效", this.node.position);
                }
            }

        }
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    // update (dt) {},
});
