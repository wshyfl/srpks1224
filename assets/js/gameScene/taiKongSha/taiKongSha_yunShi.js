

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {
        if (this.node.y < 0)
            this.speed = -3;
        else
            this.speed = 3;
        this.node.angle = this.random(0, 360);
        var _time = this.random(10, 30) * 0.3;
        var _duration = 1;
        if (this.random(0, 1) == 1)
            _duration = -1;
        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .by(_time, { angle: 360 * _duration })
            )
            .start();
    },

    
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },

    update(dt) {
        this.node.x += this.speed;
        if (this.node.y < 0) {
            if (this.node.x < -360 - 120)
                this.node.destroy();
        }
        else {
            if (this.node.x > 360 + 120)
                this.node.destroy();
        }
    },
});
