// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tuoLuo: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.targetAngle = 0;
        this.speed = 0;
        this.speedA = 0.05;
        this.guanXingNow = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)

        AD.audioMng.playSfx("陀螺")
        cc.audioEngine.setVolume(AD.audioMng.idHuaHua, 0);
        this.touchId = null;
    },

    update(dt) {
        this.targetAngle = this.targetAngle % 360;
        this.tuoLuo.angle = this.targetAngle;
        this.targetAngle += this.speed;
        if (this.guanXingNow) {
            if (this.speed > this.speedA) {
                this.speed -= this.speedA;
            }
            else if (this.speed < -this.speedA) {
                this.speed += this.speedA;
            }
            else {
                this.speed = 0;
                this.guanXingNow = false;
            }
            // if (Math.abs(this.speed) < 10)
            //     AD.audioMng.stopSfx("陀螺")
            // else
            {
                var _valume = Math.abs(this.speed) / 30;
                if (_valume > 1)
                    _valume = 1;
                else if (_valume < 0.2)
                    _valume = 0;
                cc.audioEngine.setVolume(AD.audioMng.idHuaHua, _valume);
            }

        }
        else 
        {
            
            cc.audioEngine.setVolume(AD.audioMng.idHuaHua, 0);
        }

    },
    touchStart(event) {
        this.touchIds = event.getTouches();
        console.log("11111 " + this.touchId)
        if (this.touchId == null) {
            this.touchId = event.getTouches()[0]._id;
            var _touchPoint = cc.v2(event.getTouches()[0]._point.x, event.getTouches()[0]._point.y);
            if( Number.isNaN(this.touchId))
            {
                
             console.log("222aaaaaaaaaaaaaa2222 " + this.touchId)
             cc.director.loadScene("gameScene");
            }
            console.log("11111**** " + this.touchId)
           
         

            this.guanXingNow = false;
            this.speed = 0;
            var _pos = this.node.convertToNodeSpaceAR(_touchPoint);
            this.yuanAngle = Tools.getAngle(_pos, this.tuoLuo.position) - this.targetAngle;
            if( Number.isNaN(this.targetAngle))
            {
                
             console.log("1111111111-----------11111111 ")
             cc.director.loadScene("gameScene");
            }
            console.log("1111**---*yuanAngle " +  this.yuanAngle + "  _pos  "+_pos)
            this.timeStart = Tools.getDate("millisecond");
            this.angleYuan = this.yuanAngle;
        }
    },
    touchMove(event) {
        this.touchIds = event.getTouches();
        for (var i = 0; i < this.touchIds.length; i++) {
            if (this.touchIds[i]._id == this.touchId) {
                console.log("2222/// " + this.touchIds[i]._point)
                var _touchPoint = cc.v2(this.touchIds[i]._point.x, this.touchIds[i]._point.y);
                let point = _touchPoint;
                var _pos = this.node.convertToNodeSpaceAR(point);
                console.log("2222**---*/// " + _pos)
                this.targetAngle = Tools.getAngle(_pos, this.tuoLuo.position) - this.yuanAngle;
                console.log("2222**---*yuanAngle/// " +  this.yuanAngle + "  this.tuoLuo.position  "+this.tuoLuo.position)

                var _angleTemp = this.targetAngle - this.angleYuan;
                var _timeSum = (Tools.getDate("millisecond") - this.timeStart) / 30;//用时S
                this.speed = _angleTemp / _timeSum;

                this.timeStart = Tools.getDate("millisecond");
                this.angleYuan = this.targetAngle;
                console.log("2222/// " + this.targetAngle)
            }
        }
    },
    touchEnd(event) {
        this.touchIds = event.getTouches();
        for (var i = 0; i < this.touchIds.length; i++) {
            if (this.touchIds[i]._id == this.touchId) {
                this.touchId = null;

                

                this.guanXingNow = true;
                if (Math.abs(this.speed) > 10) {
                    cc.audioEngine.setVolume(AD.audioMng.idHuaHua, Math.abs(this.speed) / 30);
                }
            }
        }
    },
});
