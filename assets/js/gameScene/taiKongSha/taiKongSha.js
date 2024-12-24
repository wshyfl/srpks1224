
cc.Class({
    extends: cc.Component,

    properties: {

        touchDown: cc.Node,
        touchUp: cc.Node,
        roleDown: cc.Node,
        groundDown: cc.Node,

        roleUp: cc.Node,
        groundUp: cc.Node,
        effectStar: cc.Prefab,
        effectYunShi: cc.Prefab,
        effectPaoDan: cc.Prefab,
        scorePrefab: cc.Node,
        yunShiNode: cc.Node,
        paoDanNode: cc.Node,
        objParentDown: cc.Node,
        objParentUp: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.taiKongSha = this;
        this.isAI = window.isAI;
        this.forcePerTimeDown = 0.2;
        this.GaDown = 0.2;
        this.forcePerTimeUp = -0.2;
        this.GaUp = -0.2;
        this.speedDown = 0;
        this.speedUp = 0;
        this.second = 45;//总时长

        this.groundDownY = this.groundDown.y + this.groundDown.height / 2 + this.roleDown.height / 2 * this.roleDown.scale;
        this.groundUpY = this.groundUp.y - this.groundDown.height / 2 - this.roleUp.height / 2 * this.roleDown.scale;
        this.initCollision();


        cc.director.on("星星特效", (_pos, _scale) => {
            if (this.gameOverNow) return;
            this.createEffectStar(_pos, _scale);
            cc.director.emit("分数增加", (_pos.y < 0))
        }, this)
        cc.director.on("陨石特效", (_pos, _scale) => {
            if (this.gameOverNow) return;
            this.createEffectYunShi(_pos, _scale);
            if (_pos.y < 0)
                cc.director.emit("分数减少", (_pos.y < 0), 3)
            else {
                if (this.isAI)
                    cc.director.emit("分数减少", (_pos.y < 0), 1)
                else
                    cc.director.emit("分数减少", (_pos.y < 0), 3)
            }
        }, this)
        cc.director.on("炮弹特效", (_pos, _scale) => {
            if (this.gameOverNow) return;
            this.createEffectPaoDan(_pos, _scale);
            if (_pos.y < 0)
                cc.director.emit("分数减少", (_pos.y < 0), 5)
            else {
                if (this.isAI)
                    cc.director.emit("分数减少", (_pos.y < 0), 2)
                else
                    cc.director.emit("分数减少", (_pos.y < 0), 5)
            }
        }, this)


    },

    start() {
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);

        this.penHuoDown = cc.find("penHuo", this.roleDown).getComponent(cc.ParticleSystem);
        this.penHuoUp = cc.find("penHuo", this.roleUp).getComponent(cc.ParticleSystem);

        this.isFly = false;


        //加载场景资源
    },
    getScoreDown(_score) {
        this.scoreDown = _score;
    },
    getScoreUp(_score) {
        this.scoreUp = _score;
    },
    onDisable(){
        
        AD.audioMng.stopSfx("喷火器");
        AD.audioMng.stopSfx("喷火器2");
    },
    beginGame() {
        this.gameOverNow = false;
        this.initTouch();
        this.touchNowDown = false;
        this.touchNowUp = false;

        //生成星星
        this.createScore(false);
        this.createScore(true);
        this.schedule(() => {
            if (this.gameOverNow) return;
            this.createScore(false);
            this.createScore(true);
        }, 4)

        //生成陨石
        this.schedule(() => {
            if (this.gameOverNow) return;
            this.createYunShi(false);
            this.createYunShi(true);
        }, 4, 10000, 2)
        //生成导弹        
        this.schedule(() => {
            if (this.gameOverNow) return;
            this.createPaoDan(false);
            this.createPaoDan(true);
        }, 6)
        //倒计时
        this.schedule(() => {
            if (this.second > 0) {

                this.second--;//总时长
                if (this.second == 0) {
                    this.gameOverNow = true;
                    cc.director.emit("获取分数", true, this.getScoreDown, this);
                    cc.director.emit("获取分数", false, this.getScoreUp, this);
                    if (this.scoreDown != this.scoreUp)
                        cc.director.emit("游戏结束", (this.scoreDown > this.scoreUp))
                    else
                        cc.director.emit("游戏平局")
                }
            }

        }, 1)

        //AI
        if (this.isAI) {
            this.schedule(() => {
                var _objTarget = null;
                var _minDistanceX = 1000;
                var _x = 100;
                for (var i = 0; i < this.objParentUp.children.length; i++) {
                    var _obj = this.objParentUp.children[i];
                    if (_obj.x < this.roleUp.x + _x && this.roleUp.x + _x - _obj.x < _minDistanceX) {
                        _objTarget = _obj;
                        _minDistanceX = this.roleUp.x + _x - _obj.x;
                    }
                }

                if (_objTarget != null) {
                    if (_objTarget.name != "taiKongSha_score") {

                        if (Math.abs(this.roleUp.y - _objTarget.y) < 120)

                            if (_objTarget.y > 250) {
                                this.speedUp = -3;
                                if (this.isFly == false) {
                                    this.penHuoUp.resetSystem();
                                    AD.audioMng.playSfx("喷火器2");
                                    this.isFly = true;
                                }
                            }

                            else {
                                this.penHuoUp.stopSystem();
                                AD.audioMng.stopSfx("喷火器2");
                                this.isFly = false;
                            }
                    }
                    else {
                        if (_objTarget.y < this.roleUp.y) {
                            this.speedUp = -3;
                            if (this.isFly == false) {
                                this.penHuoUp.resetSystem();
                                AD.audioMng.playSfx("喷火器2");
                                this.isFly = true;
                            }
                        }
                        else {
                            this.isFly = false;
                            this.penHuoUp.stopSystem();
                            AD.audioMng.stopSfx("喷火器2");
                        }
                    }

                }
            }, 0.01)
        }
    },
    initTouch() {

        this.touchDown.on("touchstart", this.onTouchStart0, this);
        this.touchDown.on("touchend", this.onTouchEnd0, this);

        if (!this.isAI) {
            this.touchUp.on("touchstart", this.onTouchStart1, this);
            this.touchUp.on("touchend", this.onTouchEnd1, this);
        }
        else {


        }
    },
    onTouchStart0(event) {
        this.touchNowDown = true;
        this.speedDown = 3;
        AD.audioMng.playSfx("喷火器");
        this.penHuoDown.resetSystem();
    },
    onTouchEnd0(event) {
        this.touchNowDown = false;
        this.penHuoDown.stopSystem();
        AD.audioMng.stopSfx("喷火器");
    },
    onTouchStart1(event) {
        this.touchNowUp = true;
        this.speedUp = -3;
        this.penHuoUp.resetSystem();
        AD.audioMng.playSfx("喷火器2");
    },
    onTouchEnd1(event) {
        this.touchNowUp = false;
        this.penHuoUp.stopSystem();
        AD.audioMng.stopSfx("喷火器2");
    },
    update(dt) {
        //下方
        if (this.touchNowDown) {
            this.speedDown += this.forcePerTimeDown;
        }
        else {
            this.speedDown -= this.GaDown;
        }
        this.roleDown.y += this.speedDown;
        if (this.roleDown.y < this.groundDownY)
            this.roleDown.y = this.groundDownY;
        else if (this.roleDown.y > -this.roleDown.height / 2) {
            this.roleDown.y = -this.roleDown.height / 2
            this.speedDown = 0;
        }
        //上方
        if (this.touchNowUp) {
            this.speedUp += this.forcePerTimeUp;
        }
        else {
            this.speedUp -= this.GaUp;
        }
        this.roleUp.y += this.speedUp;
        if (this.roleUp.y > this.groundUpY)
            this.roleUp.y = this.groundUpY;
        else if (this.roleUp.y < this.roleUp.height / 2) {
            this.roleUp.y = this.roleUp.height / 2
            this.speedUp = 0;
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
    //生成炮弹
    createPaoDan(_down) {
        var _score = cc.instantiate(this.paoDanNode)
        _score.active = true;
        if (_down) {

            _score.position = cc.v2(0, this.roleDown.y);
            _score.parent = this.objParentDown
        }
        else {
            _score.position = cc.v2(0, this.roleUp.y);
            _score.parent = this.objParentUp
        }
    },

    //生成炮弹爆开特效
    createEffectPaoDan(_pos, _scale) {
        AD.audioMng.playSfx("炮弹爆炸")
        var _effect = cc.instantiate(this.effectPaoDan);
        _effect.parent = this.node;
        _effect.position = _pos;
        // _effect.scale = _scale;
        cc.tween(_effect)
            .delay(1)
            .call(() => {
                _effect.destroy();
            })
            .start();
    },
    //生成陨石
    createYunShi(_down) {
        var _score = cc.instantiate(this.yunShiNode)
        _score.active = true;
        _score.parent = this.node;
        if (_down) {

            _score.position = cc.v2(110 + 360, this.random(-375, -125));
            _score.parent = this.objParentDown
        }
        else {

            _score.position = cc.v2(-110 - 360, this.random(136, 365));
            _score.parent = this.objParentUp
        }
    },
    //生成陨石爆开特效
    createEffectYunShi(_pos, _scale) {
        AD.audioMng.playSfx("炮弹爆炸")
        var _effect = cc.instantiate(this.effectYunShi);
        _effect.parent = this.node;
        _effect.position = _pos;
        // _effect.scale = _scale;
        cc.tween(_effect)
            .delay(1)
            .call(() => {
                _effect.destroy();
            })
            .start();
    },
    //生成星星  （一组3个）
    createScore(_down) {
        var _score = cc.instantiate(this.scorePrefab)
        _score.active = true;
        _score.parent = this.node;
        if (_down) {
            _score.position = cc.v2(110 + 360, this.random(-375, -125));
            _score.parent = this.objParentDown
        }
        else {
            _score.position = cc.v2(-110 - 360, this.random(136, 365));
            _score.parent = this.objParentUp
        }
    },
    //生成吃星星特效
    createEffectStar(_pos, _scale) {
        AD.audioMng.playSfx("得分")
        var _effect = cc.instantiate(this.effectStar);
        _effect.parent = this.node;
        _effect.position = _pos;
        // _effect.scale = _scale;
        cc.tween(_effect)
            .delay(1)
            .call(() => {
                _effect.destroy();
            })
            .start();
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
