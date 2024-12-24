// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    reset(_isDown, _angle, _distance) {
        this.speed = 20;
        this.isDown = _isDown;
        this.vx = -Math.sin(this.angleToRadian(_angle)) * this.speed;
        this.vy = Math.cos(this.angleToRadian(_angle)) * this.speed;
        this._distance = _distance;
        this.yuanPos = this.node.position;
        window.xiaoBingDuiTui.createEffect("开火", this.node.position)
        AD.audioMng.playSfx("开炮");
    },
    update(dt) {
        if (this.getDistance(this.yuanPos, this.node.position) >= this._distance) {
            this.node.destroy();
            cc.director.emit("炮弹爆炸", this.isDown, this.node.position)
            window.xiaoBingDuiTui.createEffect("爆炸", this.node.position)
            AD.audioMng.playSfx("炮弹爆炸");
        }
        else {
            this.node.x += this.vx;
            this.node.y += this.vy;
        }
    },
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
});
