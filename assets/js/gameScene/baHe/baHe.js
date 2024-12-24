

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        body: cc.Node,
        leg: cc.Node,
        line: cc.Node,
        hanDiDown: cc.Node,
        hanDiUp: cc.Node,
        lineOverDown: cc.Node,
        lineOverUp: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isAI = window.isAI;
        this.speed = 0;
        this.speedA = 0.2;
        this.legMoveMaxValue = 30;//腿触发移动的上限
        this.forcePerTime = 4;//每次点击屏幕 使用的力
        this.gameOverNow = false;
        this.scoreNum0 = this.scoreNum1 = 0;
    },

    start() {
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
    },
    beginGame() {
        this.gameOverNow = false;
        this.initTouch();
        this.lineOverDown.scaleX = this.lineOverUp.scaleX = 0;
    },
    initTouch() {

        this.targetPos0 = null;
        this.touchDown.on(cc.Node.EventType.TOUCH_START, this.onTouchStart0, this);

        if (!this.isAI) {
            this.targetPos1 = null;
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
        }
        else {
            this.schedule(() => {
                if (this.random(1, 10) < 7 && !this.gameOverNow) {
                    this.speed = this.forcePerTime;
                    this.createHanDi(false);
                }
            }, 0.1)
        }
    },
    onTouchStart0(event) {
        if (this.gameOverNow) return;
        this.speed = -this.forcePerTime;
        this.createHanDi(true);

    },

    onTouchStart1(event) {
        if (this.gameOverNow) return;
        this.speed = this.forcePerTime;
        this.createHanDi(false);
    },
    createHanDi(_isDown) {
        if (_isDown)
            var _hanDi = cc.instantiate(this.hanDiDown);
        else
            var _hanDi = cc.instantiate(this.hanDiUp);
        _hanDi.active = true;
        _hanDi.parent = this.body;
        _hanDi.opacity = 0;
        cc.tween(_hanDi)
            .to(0.1, { opacity: 255 })
            .delay(0.1)
            .to(0.2, { opacity: 0 })
            .call(() => {
                _hanDi.destroy();
            })
            .start();
    },

    checkOver() {


        if (this.body.y > 0) {
            this.scoreNum1++;
            cc.director.emit("分数增加", false);
            cc.tween(this.lineOverUp)
            .to(0.3,{scaleX:1})
            .start();
        }
        else {
            this.scoreNum0++;
            cc.director.emit("分数增加", true);
            cc.tween(this.lineOverDown)
            .to(0.3,{scaleX:1})
            .start();
        }
        if (this.scoreNum0 >= 3) {
            cc.director.emit("游戏结束", true);
            return;
        }
        else if (this.scoreNum1 >= 3) {
            cc.director.emit("游戏结束", false);
            return;
        }
        else
        AD.audioMng.playSfx("游戏结束");
        //重新开始
        this.scheduleOnce(() => {
            this.leg.y = this.body.y = 0;
            this.lineOverDown.scaleX = this.lineOverUp.scaleX = 0;
            cc.director.emit("重置倒计时")
        }, 1)
    },

    update(dt) {
        if (this.gameOverNow) return;
        this.body.y += this.speed;
        if (this.speed > this.speedA)
            this.speed -= this.speedA;
        else if (this.speed < -this.speedA)
            this.speed += this.speedA;
        else
            this.speed = 0;
        if (this.body.y - this.leg.y > this.legMoveMaxValue || this.body.y - this.leg.y < -this.legMoveMaxValue) {
            this.leg.y = this.body.y;
        }
        if (this.body.y > this.line.height / 2 ||this.body.y < -this.line.height / 2) {
            this.gameOverNow = true;
            this.checkOver();
        }
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
