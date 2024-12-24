

cc.Class({
    extends: cc.Component,

    properties: {
        ball: cc.Node,
        zhen: cc.Prefab,
        zhen1: cc.Prefab,
        zhuanPan: cc.Node,
        zhuanPan1: cc.Node,
        zhuanPan2: cc.Node,
        zhenParent: cc.Node,
        effectDown: cc.Node,
        effectUp: cc.Node,



    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.feiDaoDaZhan = this;
        this.isAI = window.isAI;
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (this.gameOverNow == false) {
                let start_pos = this.node.convertToNodeSpaceAR(event.getLocation());
                if (start_pos.y < 0) {
                    if (window.feiDaoDaZhan.shengYuNum0 > 0) {
                        cc.director.emit("发射");
                    }
                }
                else if (start_pos.y > 0 && !this.isAI) {
                    if (this.shengYuNum1 > 0) {
                        cc.director.emit("发射1");
                    }

                }

            }
        }, this);
        AD.game21 = this;
        this.initCollision();
        this.couldShake = true;
        this.wuDi = false;
        this.gameOverNow = false;

        this.lunPanIndex = 0;
        this.scoreNow0 = 0;
        this.scoreNow1 = 0;
        this.shengYuNum0 = 7;
        this.shengYuNum1 = 7;

        cc.director.on("增加", (_roleIndex) => {
            if (_roleIndex == 0) {

                this.shengYuNum0--;
                this.scoreNow0++;
                cc.director.emit("重置点", _roleIndex, 6 - this.shengYuNum0, "成功");
                this.createNewZhen(0);
            }
            else {

                this.shengYuNum1--;
                cc.director.emit("重置点", _roleIndex, 6 - this.shengYuNum1, "成功");
                this.scoreNow1++;
                this.createNewZhen(1);
            }

            this.shake();
            cc.director.emit("分数增加", (_roleIndex == 0));
        }, this);
        cc.director.on("没插中", (_roleIndex) => {
            if (_roleIndex == 0) {
                this.shengYuNum0--;
                cc.director.emit("重置点", _roleIndex, 6 - this.shengYuNum0, "失败");
                this.createNewZhen(0);
            }
            else {

                this.shengYuNum1--;
                cc.director.emit("重置点", _roleIndex, 6 - this.shengYuNum1, "失败");
                this.createNewZhen(1);
            }


        }, this);



        this.couldZhuan = false;
        this.rotateState = 0;
        this.rotateSpeed = 0;
        this.rotateTime = 0;

        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
    },

    createEffect(_type) {
        var _effect = null;
        switch (_type) {
            case "特效下":
                _effect = cc.instantiate(this.effectDown);
                break;
            case "特效上":
                _effect = cc.instantiate(this.effectUp);
                break;
        }
        _effect.parent = this.node;
        _effect.active = true;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 1)
    },
    //游戏开始
    beginGame() {

        this.couldZhuan = true;
        this.createNewZhen(0);
        this.createNewZhen(1);
    },
    reset() {
        cc.director.emit("重置");

    },
    createNewZhen(_roleIndex) {
        this.checkOver();
        if (this.shengYuNum0 <= 0 && _roleIndex == 0) return;
        if (this.shengYuNum1 <= 0 && _roleIndex == 1) return;
        if (_roleIndex == 0) {

            var _zhen = cc.instantiate(this.zhen);
        }
        else {
            var _zhen = cc.instantiate(this.zhen1);
        }
        _zhen.parent = this.zhenParent;
        _zhen.scale = 1;
        _zhen.getComponent("feiDaoDaZhan_zhen").reset(_roleIndex);



    },
    checkOver() {
        if (this.shengYuNum0 == 0 && this.shengYuNum1 == 0) {

            this.scheduleOnce(() => {
                this.couldZhuan = false;
            }, 0.5)
            this.lunPanIndex++;
            if (this.lunPanIndex == 3) {
                if (this.scoreNow0 > this.scoreNow1) {
                    cc.director.emit("游戏结束", true);
                }
                else if (this.scoreNow0 < this.scoreNow1) {
                    cc.director.emit("游戏结束", false);
                }
                else {
                    cc.director.emit("游戏平局");
                }
                return;
            }
            cc.tween(this.ball)
                .delay(1)
                .to(0.3, { x: -720 })
                .call(() => {
                    this.ball.children.forEach(element => {
                        element.destroy();
                    });
                })
                .to(0.0001, { x: 0 })
                .start();
            cc.tween(this.zhuanPan.parent)
                .delay(1)
                .by(0.3, { x: -720 })
                .call(() => {
                    for (var i = 0; i < 7; i++) {
                        cc.director.emit("重置点", 0, i, "重置啦");
                        cc.director.emit("重置点", 1, i, "重置啦");
                    }
                    this.couldZhuan = true;
                    this.shengYuNum0 = 7;
                    this.shengYuNum1 = 7;
                    this.createNewZhen(0);
                    this.createNewZhen(1);
                })
                .start();


        }
    },
    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素


        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // m
    },
    update(dt) {
        if (this.gameOverNow == false && this.couldZhuan) {
            if (this.lunPanIndex == 0)
                this.ball.angle += 120 * dt;
            else if (this.lunPanIndex == 1)
                this.ball.angle -= 120 * dt;
            else {
                if (this.rotateState == 0) {


                    if (this.rotateTime < 3) {
                        this.rotateTime += dt;
                        if (this.rotateSpeed < 3)
                            this.rotateSpeed += 0.1;
                    }
                    else {
                        if (this.rotateSpeed > 0)
                            this.rotateSpeed -= 0.1;
                        else {
                            this.rotateState = 1;
                            this.rotateTime = 0;
                        }
                    }
                }
                else if (this.rotateState == 1) {


                    if (this.rotateTime < 3) {
                        this.rotateTime += dt;
                        if (this.rotateSpeed > -3)
                            this.rotateSpeed -= 0.1;
                    }
                    else {
                        if (this.rotateSpeed < 0)
                            this.rotateSpeed += 0.1;
                        else {

                            this.rotateState = 0;
                            this.rotateTime = 0;
                        }
                    }
                }

                this.ball.angle += this.rotateSpeed;
            }
            this.zhuanPan2.angle = this.zhuanPan1.angle = this.zhuanPan.angle = this.ball.angle;
        }
    },
    shake() {
        if (!this.couldShake) return;
        this.couldShake = false;
        var _time = 0.01
        var _length = 10;
        cc.tween(this.ball)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .call(() => {
                this.couldShake = true;
            })
            .start();
        cc.tween(this.zhuanPan)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .start();
        cc.tween(this.zhuanPan1)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .start();
        cc.tween(this.zhuanPan2)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .start();
    }
});
