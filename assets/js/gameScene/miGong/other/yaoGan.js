

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        gan: cc.Node,
        playerType: 0,

    },


    onLoad() {
        AD.couldMove1 = false;
        AD.couldMove0 = false;

        this.max_R = 30;//半径

        
        this.maxW = 800;
        this.maxH = 300;
        this.moveRate = 2;

        AD.player1Angle = 0;
        AD.allOnGround = false;

        cc.director.on("可以控制角色了", () => {
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {

        switch (event.keyCode) {
            case cc.macro.KEY.a:
                AD.couldMove0 = true;
                AD.player0Angle = 270;
                break;
            case cc.macro.KEY.w:
                AD.couldMove0 = true;
                AD.player0Angle = 180;
                break;
            case cc.macro.KEY.s:
                AD.couldMove0 = true;
                AD.player0Angle = 0;
                break;
            case cc.macro.KEY.d:
                AD.couldMove0 = true;
                AD.player0Angle = 90;
                break;
            case cc.macro.KEY.left:
                AD.couldMove1 = true;
                AD.player1Angle = 270;

                break;
            case cc.macro.KEY.up:
                AD.couldMove1 = true;
                AD.player1Angle = 180;

                break;
            case cc.macro.KEY.down:
                AD.couldMove1 = true;
                AD.player1Angle = 0;

                break;
            case cc.macro.KEY.right:
                AD.couldMove1 = true;
                AD.player1Angle = 90;

                break;
        }
    },

    onKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                AD.couldMove0 = false;
                AD.player0Angle = null;
                break;
            case cc.macro.KEY.w:
                AD.couldMove0 = false;
                AD.player0Angle = null;
                break;
            case cc.macro.KEY.s:
                AD.couldMove0 = false;
                AD.player0Angle = null;
                break;
            case cc.macro.KEY.d:
                AD.couldMove0 = false;
                AD.player0Angle = null;
                break;
            case cc.macro.KEY.left:
                AD.couldMove1 = false;
                AD.player1Angle = null;
                break;
            case cc.macro.KEY.up:
                AD.couldMove1 = false;
                AD.player1Angle = null;
                break;
            case cc.macro.KEY.down:
                AD.couldMove1 = false;
                AD.player1Angle = null;
                break;
            case cc.macro.KEY.right:
                AD.couldMove1 = false;
                AD.player1Angle = null;
                break;
        }
    },
    start() {
        cc.director.emit("可以控制角色了")
        this.bg.active = this.gan.active = false;
    },
    touchStart(event) {
        //第1种
        switch (this.playerType) {
            case 0:
                AD.couldMove0 = true;
                AD.player0Angle = null;
                break;
            case 1:
                AD.couldMove1 = true;
                AD.player1Angle = null;
                break;
        }
        this.bg.position = this.gan.position = this.bg.parent.convertToNodeSpaceAR(event.getLocation());
        this.startPos = event.getLocation();



        //第二种
        this.hadSureAngle = false;
        this.isHeng = false;
        this.tempW = 0;
        this.tempH = 0;
    },
    touchMove(event) {
        //第三种
        // if (this.hadSureAngle) return;

        var _posNow = event.getLocation();
        var _pos = event.getDelta();
        this.tempW += _pos.x;
        this.tempH += _pos.y;
        var _r = Math.sqrt(Math.abs(this.tempW) * Math.abs(this.tempW) + Math.abs(this.tempH) * Math.abs(this.tempH));
        // console.log("滑动的距离是  " + _r);
        if (_r > this.max_R) {
            if (this.hadSureAngle == false) {
                this.hadSureAngle = true;
                this.bg.active = this.gan.active = true;
                if (Math.abs(this.tempW) > Math.abs(this.tempH)) //左右移动
                {
                    this.isHeng = true;
                    this.bg.angle = 90;
                }
                else {

                    this.isHeng = false;
                    this.bg.angle = 0;
                }
            }

        }
        if (this.hadSureAngle) {

            if (this.isHeng) {
                this.gan.y = this.bg.y;
                var _w = _posNow.x - this.startPos.x;
                if (_w < -80)
                    _w = -80;
                else if (_w > 80)
                    _w = 80;
                this.gan.x = this.bg.x + _w;

            }
            else 
            {
                this.gan.x = this.bg.x;
                var _w = _posNow.y - this.startPos.y;
                if (_w < -80)
                    _w = -80;
                else if (_w > 80)
                    _w = 80;
                this.gan.y = this.bg.y + _w;
            }
        }
        //第二种
        // if (this.hadSureAngle) return;

        // var _pos = event.getDelta();
        // this.tempW += _pos.x;
        // this.tempH += _pos.y;
        // var _r = Math.sqrt(Math.abs(this.tempW) * Math.abs(this.tempW) + Math.abs(this.tempH) * Math.abs(this.tempH));
        // // console.log("滑动的距离是  " + _r);
        // if (_r > this.max_R) {
        //     this.hadSureAngle = true;

        //     if (Math.abs(this.tempW) > Math.abs(this.tempH)) {//左右移动
        //         if (this.tempW > 0)//右移动
        //         {
        //             this.gan.x = this.bg.x + this.max_R;
        //         }
        //         else
        //             this.gan.x = this.bg.x - this.max_R;
        //     }
        //     else {
        //         if (this.tempH > 0)//s上移动
        //         {
        //             this.gan.y = this.bg.y + this.max_R;
        //         }
        //         else
        //             this.gan.y = this.bg.y - this.max_R;
        //     }
        // }
        //第1种
        // var _pos = event.getLocation();
        // let pos_0 = this.gan.parent.convertToNodeSpaceAR(_pos);//将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。

        // let pos_1 = this.bg.convertToNodeSpaceAR(_pos);//将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。

        // if (Tools.getDistance(pos_0, this.bg.position) < this.max_R) {
        //     this.gan.x = pos_0.x;
        //     this.gan.y = pos_0.y;
        // }
        // else {
        //     let pos = pos_1.normalizeSelf();//将触点归一化
        //     this.gan.x = this.bg.x + pos.x * this.max_R;//归一化的触点坐标 × 最大半径
        //     this.gan.y = this.bg.y + pos.y * this.max_R;
        // }
        // this.startPos = event.getLocation();
        // console.log("触摸move");

    },
    touchEnd(event) {
        this.bg.active = this.gan.active = false;
        this.gan.position = this.bg.position;
        switch (this.playerType) {
            case 0:
                AD.couldMove0 = false;
                break;
            case 1:
                AD.couldMove1 = false;
                break;
        }


    },
    update(dt) {

        var _angle = Tools.getAngle(this.bg.position, this.gan.position);
        if (this.playerType == 0) {
            if (AD.couldMove0) {
                if (_angle >= 315 || _angle < 45)
                    AD.player0Angle = 0;
                else if (_angle >= 45 && _angle < 135)
                    AD.player0Angle = 90;
                else if (_angle >= 135 && _angle < 225)
                    AD.player0Angle = 180;
                else if (_angle >= 225 && _angle < 315)
                    AD.player0Angle = 270;
            }
            else {
                AD.player0Angle = null;
            }

        }
        else {

            if (_angle >= 315 || _angle < 45)
                AD.player1Angle = 0;
            else if (_angle >= 45 && _angle < 135)
                AD.player1Angle = 90;
            else if (_angle >= 135 && _angle < 225)
                AD.player1Angle = 180;
            else if (_angle >= 225 && _angle < 315)
                AD.player1Angle = 270;
        }

    },
});
