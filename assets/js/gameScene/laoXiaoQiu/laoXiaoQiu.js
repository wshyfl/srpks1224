
cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        ballDown: cc.Node,
        ballUp: cc.Node,
        ballParentDown: cc.Node,
        ballParentUp: cc.Node,
        roleDown: cc.Node,
        roleUp: cc.Node,
        addScore: cc.Node,
        jianScore: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initCollision();
        this.isAI = window.isAI;
        this.sprNormalDown = cc.find("sprNormal", this.roleDown); this.sprNormalDown.active = true;
        this.sprEatDown = cc.find("sprEat", this.roleDown); this.sprEatDown.active = false;
        this.effectDown = cc.find("effect", this.roleDown); this.effectDown.active = true;

        this.sprNormalUp = cc.find("sprNormal", this.roleUp); this.sprNormalUp.active = true;
        this.sprEatUp = cc.find("sprEat", this.roleUp); this.sprEatUp.active = false;
        this.effectUp = cc.find("effect", this.roleUp); this.effectUp.active = true;


    },

    start() {

        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);

        cc.director.on("加分特效", (pos) => {
            this.createScoreEffect(true, pos);
        }, this)
        cc.director.on("减分特效", (pos) => {
            this.createScoreEffect(false, pos);

        }, this)
    },
    createScoreEffect(_add, pos) {
        if (_add)
            var _effect = cc.instantiate(this.addScore);
        else
            var _effect = cc.instantiate(this.jianScore);
        _effect.active = true;
        _effect.parent = this.node;
        _effect.position = pos;
        var _angle = 0;
        var _direction = 30;
        if (pos.y > 0) {
            _angle = 180;
            _direction = -30;
        }
        _effect.angle = _angle;
        cc.tween(_effect)
            .to(0.3, { scale: 1.2, y: pos.y + _direction })
            .to(0.4, { scale: 1, y: pos.y + _direction*1.6, opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                _effect.destroy();
            })
            .start();
    },

    //游戏开始
    beginGame() {
        this.beginNow = true;
        this.initTouch();
        this.scoreTarget = 30;//目标分数
        this.ballNumMax = 10;//红蓝各自的球总数

        this.checkBallNum(true);
        this.checkBallNum(false);

        this.schedule(() => {
            this.checkBallNum(true);
            this.checkBallNum(false);
        }, 4)
    },
    checkBallNum(_isDown) {
        var _parent = this.ballParentDown;
        if (!_isDown)
            _parent = this.ballParentUp;
        var _numChaZhi = this.ballNumMax - _parent.childrenCount;
        if (_numChaZhi > 0) {
            this.schedule(() => {
                this.createBall(_isDown);
            }, 0.1, _numChaZhi - 1)
        }
    },
    createBall(_down) {
        if (_down) {
            var _ball = cc.instantiate(this.ballDown);
            _ball.parent = this.ballParentDown;
        }
        else {
            var _ball = cc.instantiate(this.ballUp);
            _ball.parent = this.ballParentUp;
        }
        _ball.getComponent("laoXiaoQiu_ball").reset(_down);
        _ball.active = true;
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
        // manager.enabledDebugDraw = true;
    },

    initTouch() {
        this.couldTouchDown = true;
        this.couldTouchUp = true;
        this.touchDown.on(cc.Node.EventType.TOUCH_START, this.onTouchStart0, this);
        if (!this.isAI) {
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
        }
        else {
            this.schedule(() => {
                if (this.random(1, 10) >= 2)
                    this.AIFunc();
            }, 1)
        }

    },
    onTouchStart0(event) {
        if (!this.beginNow) return;
        if (!this.couldTouchDown) return;
        this.couldTouchDown = false;
        this.sprNormalDown.active = false;
        this.sprEatDown.active = true;
        cc.tween(this.sprEatDown)
            .to(0.2, { y: 150 })
            .call(() => {
                cc.director.emit("吃分");
                this.effectDown.getComponent(cc.ParticleSystem).resetSystem();
                this.sprNormalDown.active = true;
                this.sprNormalDown.y = 150;
                cc.tween(this.sprNormalDown)
                    .to(0.2, { y: 0 })
                    .call(() => {
                        this.couldTouchDown = true;
                    })
                    .start();
                this.scheduleOnce(() => {
                    this.sprEatDown.opacity = 255;
                    this.sprEatDown.y = 0;
                    this.sprEatDown.active = false;
                    this.checkOver();
                }, 0.1)
                this.sprEatDown.opacity = 0;
            })
            .start();
    },
    onTouchStart1(event) {
        this.AIFunc();
    },
    AIFunc() {
        if (!this.beginNow) return;
        if (!this.couldTouchUp) return;
        this.couldTouchUp = false;
        this.sprNormalUp.active = false;
        this.sprEatUp.active = true;
        cc.tween(this.sprEatUp)
            .to(0.2, { y: 150 })
            .call(() => {
                cc.director.emit("吃分");
                this.effectUp.getComponent(cc.ParticleSystem).resetSystem();
                this.sprNormalUp.active = true;
                this.sprNormalUp.y = 150;
                cc.tween(this.sprNormalUp)
                    .to(0.2, { y: 0 })
                    .call(() => {
                        this.couldTouchUp = true;
                    })
                    .start();
                this.scheduleOnce(() => {
                    this.sprEatUp.opacity = 255;
                    this.sprEatUp.y = 0;
                    this.sprEatUp.active = false;
                    this.checkOver();
                }, 0.1)
                this.sprEatUp.opacity = 0;
            })
            .start();
    },

    checkOver() {
        cc.director.emit("获取分数", true, this.getScoreDown, this);
        cc.director.emit("获取分数", false, this.getScoreUp, this);
        if (this.scoreDown >= this.scoreTarget) {
            cc.director.emit("游戏结束", true)
            this.beginNow = false;
        }
        else if (this.scoreUp >= this.scoreTarget) {
            cc.director.emit("游戏结束", false)
            this.beginNow = false;
        }
    },
    getScoreDown(_score) {
        this.scoreDown = _score;
    },
    getScoreUp(_score) {
        this.scoreUp = _score;
    },
    // update (dt) {},

    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
    getRadian(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return this.angleToRadian(angle);//角度转弧度
    },
    getAngle(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return angle;//角度转弧度
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
