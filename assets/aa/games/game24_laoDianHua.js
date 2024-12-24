

cc.Class({
    extends: cc.Component,

    properties: {
        zhuanPan: cc.Node,
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)

        this.angleArr = [-313, -287, -258, -233, -208, -183, -158, -133, -110, -88];
        this.numIndex = -1;
        this.initTouch();
    },

    initTouch() {
        this.couldRotate = false;
        this.zhuanPan.children[0].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 0;
            this.zhuanPan.children[0]["_touchListener"].setSwallowTouches(false);
        }, this)
        this.zhuanPan.children[1].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 1;
            this.zhuanPan.children[1]["_touchListener"].setSwallowTouches(false);
        }, this)
        this.zhuanPan.children[2].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 2;
            this.zhuanPan.children[2]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[3].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 3;
            this.zhuanPan.children[3]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[4].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 4;
            this.zhuanPan.children[4]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[5].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 5;
            this.zhuanPan.children[5]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[6].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 6;
            this.zhuanPan.children[6]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[7].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 7;
            this.zhuanPan.children[7]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[8].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 8;
            this.zhuanPan.children[8]["_touchListener"].setSwallowTouches(false);
        }, this)

        this.zhuanPan.children[9].on(cc.Node.EventType.TOUCH_START, () => {
            this.couldRotate = true;
            this.numIndex = 9;
            this.zhuanPan.children[9]["_touchListener"].setSwallowTouches(false);
        }, this)

    },
    start() {
        this.couldMove = true;
    },

    touchStart(event) {
        if (!this.couldRotate) return;
        this.couldMove = true;
        this.speed = 0;
        let point = cc.v2(event.touch.getLocation().x,
            event.touch.getLocation().y);
        var _pos = this.node.convertToNodeSpaceAR(point);
        this.yuanAngle = Tools.getAngle(_pos, this.zhuanPan.position);

        this.audioIndex = 1;
        this.first = true;
    },

    touchMove(event) {
        if (!this.couldRotate) return;
        let point = cc.v2(event.touch.getLocation().x,
            event.touch.getLocation().y);
        var _pos = this.node.convertToNodeSpaceAR(point);

        this.targetAngle = Tools.getAngle(_pos, this.zhuanPan.position) - this.yuanAngle;
        if (this.targetAngle > 0)
            this.targetAngle = this.targetAngle - 360;
        if (this.first) {
            this.targetAngleTemp = this.targetAngle;
            this.first = false;
        }
        if (this.zhuanPan.angle < -this.audioIndex * 15) {

            AD.audioMng.playSfx("老式电话1");
            this.audioIndex++;
        }

        console.log("this.targetAngle " + this.targetAngle);
    },
    touchEnd(event) {
        if (!this.couldRotate) return;
        this.targetAngle = 0;
        this.couldMove = false;
        this.couldRotate = false;
        if (this.zhuanPan.angle < -5)
            AD.audioMng.playSfx("老式电话2");
        console.log("" + this.zhuanPan.angle)
        cc.tween(this.zhuanPan)
            .to(0.8, { angle: 0 })
            .call(() => {
                this.couldMove = true;
            })
            .start();
    },
    update(dt) {
        if (this.couldMove) {
            if (this.targetAngle < this.angleArr[this.numIndex]) {
                this.targetAngle = 0
            }
            if (this.targetAngleTemp >= this.targetAngle) {
                this.zhuanPan.angle = this.targetAngle;
                this.targetAngleTemp = this.targetAngle;
            }

        }
        if (this.zhuanPan.angle > 0)
            this.zhuanPan.angle = 0;
    },
});
