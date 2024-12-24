

cc.Class({
    extends: cc.Component,

    properties: {
        draw: cc.Graphics,
        heiBanCa: cc.Node,
        heiBanColor: {
            default: null,
            type: cc.Color
        },
        fenBi: {
            default: [],
            type: [cc.Node]
        },
        colorArr: {
            default: [],
            type: [cc.Color]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.colorIndex = 0;
        this.heiBanCaNow = false;
        this.heiBanCaYuanPos = this.heiBanCa.position;
        this.initTouch();
        this.setColor();
        this.touchId = null;
    },
    initTouch() {



        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);
    },
    onTouchStart(event) {
        if (this.touchId == null) {
            this.touchId = event.getTouches()[0]._id;
            var _touchPoint = cc.v2(event.getTouches()[0]._point.x, event.getTouches()[0]._point.y);

            let _pos = this.node.convertToNodeSpaceAR(_touchPoint);
            if (Math.abs(_pos.x - this.heiBanCa.x) < this.heiBanCa.width / 2 && Math.abs(_pos.y - this.heiBanCa.y) < this.heiBanCa.height / 2) {
                this.heiBanCaNow = true;
                this.setColor(true);
                AD.audioMng.playSfx("擦黑板")
            }
            else
                AD.audioMng.playSfx("画画")
            this.draw.moveTo(_pos.x, _pos.y)
        }
      



    },

    onTouchMove(event) {
        this.touchIds = event.getTouches();

        for (var i = 0; i < this.touchIds.length; i++) {
            if (this.touchIds[i]._id == this.touchId) {
                var _touchPoint = cc.v2(this.touchIds[i]._point.x, this.touchIds[i]._point.y);

                let pos = this.node.convertToNodeSpaceAR(_touchPoint);
                this.draw.lineTo(pos.x, pos.y)
                this.draw.stroke();
                this.draw.moveTo(pos.x, pos.y);
                if (this.heiBanCaNow) {
                    this.heiBanCa.x += event.getDelta().x;
                    this.heiBanCa.y += event.getDelta().y;
                }
            }
        }


    },
    onTouchEnd(event) {
        this.touchIds = event.getTouches();
        for (var i = 0; i < this.touchIds.length; i++) {
            if (this.touchIds[i]._id == this.touchId) {
                this.touchId = null;

                this.draw.stroke();
                if (this.heiBanCaNow) {
                    this.heiBanCaNow = false;
                    this.setColor();
                    cc.tween(this.heiBanCa)
                        .to(0.3, { position: this.heiBanCaYuanPos }, { easing: "sineInOut" })
                        .start();
                    AD.audioMng.stopSfx("擦黑板")

                }
                else
                    AD.audioMng.stopSfx("画画")

            }
        }


    },

    setColor(...isHeiBanCa) {
        if (isHeiBanCa[0]) {
            this.draw.lineWidth = 150;
            this.draw.strokeColor = this.heiBanColor;
            return;
        }
        this.draw.lineWidth = 10;
        this.draw.strokeColor = this.colorArr[this.colorIndex];
        for (var i = 0; i < this.fenBi.length; i++) {
            if (i != this.colorIndex) {
                if (this.fenBi[i].y != 0)
                    cc.tween(this.fenBi[i])
                        .to(0.3, { y: 0 }, { easing: "sineInOut" })
                        .start();
            }
            else {
                if (this.fenBi[i].y == 0)
                    cc.tween(this.fenBi[i])
                        .to(0.3, { y: 60 }, { easing: "sineInOut" })
                        .start();
            }
        }
    },
    btnCallBack(event, type) {
        this.colorIndex = parseInt(type);
        this.setColor();
    }
    // update (dt) {},
});
