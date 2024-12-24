

cc.Class({
    extends: cc.Component,

    properties: {
        blinkArr: [cc.Node],
        bar: cc.Sprite,
        btn1: cc.Node,
        btn2: cc.Node,
        dianLiu1: cc.Node,
        dianLiu2: cc.Node,
        dianSi: cc.Node,
        btnAnim1: cc.Animation,
        btnAnim2: cc.Animation,
        bombNode: cc.Node,
    },

    onLoad() {
        this.duration = 5;
        this.chongDianSpeed = 1 / this.duration;
        this.haoDianSpeed = this.chongDianSpeed * 2.5;
        this.bar.fillRange = 0;
        this.chongDian1 = false;
        this.chongDian2 = false;


        this.btn1.on(cc.Node.EventType.TOUCH_START, () => {
            this.chongDian1 = true;
            if (this.chongDian2)
                this.actDianLiuFunc();
        }, this);
        this.btn1.on(cc.Node.EventType.TOUCH_END, () => {
            this.chongDian1 = false;
            this.actDianLiuFuncStop();
        }, this);
        this.btn1.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.chongDian1 = false;
            this.actDianLiuFuncStop();
        }, this);

        this.btn2.on(cc.Node.EventType.TOUCH_START, () => {
            this.chongDian2 = true;
            if (this.chongDian1)
                this.actDianLiuFunc();
        }, this);
        this.btn2.on(cc.Node.EventType.TOUCH_END, () => {
            this.chongDian2 = false;
            this.actDianLiuFuncStop();
        }, this);
        this.btn2.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.chongDian2 = false;
            this.actDianLiuFuncStop();
        }, this);

        this.blinking = false;
        this.dianLiu1YuanY = this.dianLiu1.y;
        this.act1 = cc.tween(this.dianLiu1)
            .repeatForever(
                cc.tween()
                    .to(1, { y: 250, scale: 0.6 })
                    .to(0.01, { opacity: 0, y: this.dianLiu1YuanY })
                    .delay(0.48)
                    .to(0.01, { opacity: 255, scale: 1 })

            );
        this.act2 = cc.tween(this.dianLiu2)
            .repeatForever(
                cc.tween()
                    .to(1, { y: 250, scale: 0.6 })
                    .to(0.01, { opacity: 0, y: this.dianLiu1YuanY })
                    .delay(0.48)
                    .to(0.01, { opacity: 255, scale: 1 })

            );

        this.actBtn1 = cc.tween(this.btn1)
            .repeatForever(
                cc.tween()
                    .to(1, { opacity: 100 })
                    .to(0.5, { opacity: 255 })
                    .delay(2)
            );
        this.actBtn2 = cc.tween(this.btn2)
            .repeatForever(
                cc.tween()
                    .to(1, { opacity: 100 })
                    .to(0.5, { opacity: 255 })
                    .delay(2)
            );
        this.actDianLiuFuncStop();




        this.dengPaoShakeState = 0;
        this.bombNode.active = false;
        this.bombDuration = 2;
        this.bombDurationTemp = 0;
        this.initCollision();

        this.overMax = false;
    },

    //停止充电
    actDianLiuFuncStop() {
        if (this.bombNode.active) return;
        this.dianSi.active = false;
        this.act1.stop();
        this.act2.stop();
        this.dianLiu1.active = this.dianLiu2.active = false;

        AD.audioMng.stopSfx("充电");
        if (this.overMax)
            AD.audioMng.stopSfx("电流不稳");
        this.actBtn1.start();
        this.actBtn2.start();
        this.btnAnim1.node.active = this.btnAnim2.node.active = false;
        this.blinkArr[1].parent.angle = 0;
    },
    //开始充电
    actDianLiuFunc() {
        if (this.bombNode.active) return;
        this.dianSi.active = true;

        this.scheduleOnce(() => {
            this.dianLiu1.active = this.dianLiu2.active = true;
            this.dianLiu1.y = this.dianLiu1YuanY;
            this.dianLiu1.opacity = 255;
            this.dianLiu1.scale = 1;

            this.dianLiu2.y = this.dianLiu1YuanY;
            this.dianLiu2.opacity = 255;
            this.dianLiu2.scale = 1;
            this.act1.start();
            this.act2.start();
        }, 1.5)

        AD.audioMng.playSfx("充电");
        this.actBtn1.stop();
        this.actBtn2.stop();
        this.btn1.opacity = this.btn2.opacity = 255;

        this.btnAnim1.node.active = this.btnAnim2.node.active = true;
        this.btnAnim1.play();
        this.btnAnim2.play();
    },

    getChongDianState() {
        var _chongDianIng = false;
        if (this.chongDian1 && this.chongDian2)
            _chongDianIng = true;

        return _chongDianIng;
    },
    start() {
        this.schedule(() => {
            if (Tools.random(1, 100) < 50)
                this.blinkFunc();
        }, 0.2)
    },
    chongDianFunc(dt) {
        if (this.bombNode.active) return;
        if (this.bar.fillRange >= 1) {//继续充电 会爆炸
            if (this.overMax == false) {
                this.overMax = true;
                AD.audioMng.playSfx("电流不稳");
            }
            this.bombDurationTemp += dt;
            if (this.bombDurationTemp >= this.bombDuration) {
                this.bombFunc();
            }
            if (this.dengPaoShakeState == 0) {
                this.blinkArr[1].parent.angle += 100 * dt;
                if (this.blinkArr[1].parent.angle > 1) {
                    this.dengPaoShakeState = 1;
                }
            }
            else if (this.dengPaoShakeState == 1) {
                this.blinkArr[1].parent.angle -= 100 * dt;
                if (this.blinkArr[1].parent.angle < -1) {
                    this.dengPaoShakeState = 0;
                }
            }
            return;
        }
        this.bar.fillRange += this.chongDianSpeed * dt;
        if (this.bar.fillRange > 1)
            this.bar.fillRange = 1;
    },
    haoDian(dt) {
        if (this.bombNode.active) return;
        this.bar.fillRange -= this.haoDianSpeed * dt;
        if (this.bar.fillRange < 0)
            this.bar.fillRange = 0;
    },
    blinkFunc() {
        if (this.getChongDianState() == false) return;
        this.blinking = true;
        this.scheduleOnce(() => {
            this.blinking = false;
        }, 0.1)
        var _opacity = this.blinkArr[0].opacity;
        for (var i = 0; i < 3; i++) {
            cc.tween(this.blinkArr[i])
                .to(0.05, { opacity: 0 })
                .to(0.05, { opacity: _opacity })
                .start();
        }
    },

    bombFunc() {
        this.actDianLiuFuncStop();
        this.bombNode.active = true;
        this.blinkArr[2].active = this.blinkArr[1].active = false;
        this.blinkArr[1].parent.getComponent(cc.Sprite).enabled = false;

        AD.audioMng.playSfx("玻璃打碎");
        cc.tween(this.blinkArr[0])
            .to(0.5, { opacity: 180 })
            .start();
    },
    update(dt) {
        if (this.getChongDianState())
            this.chongDianFunc(dt);
        else
            this.haoDian(dt);

        if (this.blinking == false && this.bombNode.active == false) {
            this.blinkArr[0].opacity = 180 * (1 - this.bar.fillRange)
            this.blinkArr[1].opacity = 255 * (1 - this.bar.fillRange)
        }
    },


    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // m
    }

});
