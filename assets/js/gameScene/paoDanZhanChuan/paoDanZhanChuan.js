
cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        chuanJiangDown: cc.Node,
        chuanJiangUp: cc.Node,
        ballPrefabUp: cc.Prefab,
        ballPrefabDown: cc.Prefab,
        paoKouUp: cc.Node,
        paoKouDown: cc.Node,
        effectDown: cc.Node,
        effectUp: cc.Node,
        boWen: cc.Node,
        effectFire: cc.Node,
    },

    onLoad() {
        this.isAI = window.isAI;
        this.AISmart = 13;//越小 反应越灵敏
        this.ballParent = cc.find("ballParent", this.node);
        this.initTouch();
        this.initCollision();
        this.initEffect();
        this.effectDown.opacity = this.effectUp.opacity = 0;
        // this.initBoWen();
    },

    start() {
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
    },
    initEffect() {
        this.effectDown.opacity = this.effectUp.opacity = 0;
        this.effectDownAct =
            cc.tween(this.effectDown)
                .to(0.05, { opacity: 255 })
                .to(0.1, { opacity: 0 });

        this.effectUpAct =
            cc.tween(this.effectUp)
                .to(0.05, { opacity: 255 })
                .to(0.1, { opacity: 0 });

        this.effectDownAct2 =
            cc.tween(this.effectDown.parent)
                .to(0.05, { scale: 1.05 })
                .to(0.1, { scale: 1 });

        this.effectUpAct2 =
            cc.tween(this.effectUp.parent)
                .to(0.05, { scale: 1.05 })
                .to(0.1, { scale: 1 });
    },
    //游戏开始
    beginGame() {
        //发射炮弹
        this.index = this.random(0, 1);
        this.createBall(this.index % 2 == 0);
        this.schedule(() => {
            this.index++;
            this.createBall(this.index % 2 == 0);
        }, 3);


        this.hpDown = this.hpUp = 10;
        for (var i = 0; i < this.hpDown; i++) {
            cc.director.emit("分数增加", true);
            cc.director.emit("分数增加", false);
        }
        cc.director.on("击中敌方", (_hitDown) => {
            if (this.hpDown == 0 || this.hpUp == 0) return;
            if (_hitDown) {
                this.hpDown--;
                cc.director.emit("分数减少", true);
                this.effectDownAct.start();
                this.effectDownAct2.start();
            }
            else {
                this.hpUp--;
                cc.director.emit("分数减少", false);
                this.effectUpAct.start();
                this.effectUpAct2.start();
            }
            this.checkOver();
        }, this)
    },

    checkOver() {
        if (this.ballParent.children.length <= 0)
            this.createBall(this.index % 2 == 0);

        if (this.hpDown <= 0)
            cc.director.emit("游戏结束", false);
        else if (this.hpUp <= 0)
            cc.director.emit("游戏结束", true);
    },
    createBall(_down) {


        AD.audioMng.playSfx("开炮");
        if (_down) {

            var _ball = cc.instantiate(this.ballPrefabDown);
            _ball.position = this.paoKouDown.position;
        }
        else {

            var _ball = cc.instantiate(this.ballPrefabUp);

            _ball.position = this.paoKouUp.position;
        }
        _ball.parent = this.ballParent;
        var _effect = cc.instantiate(this.effectFire);
        _effect.parent = this.node;
        _effect.active = true;
        if (!_down)
        _effect.angle = 180;
        _effect.position = _ball.position;
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

        this.targetPos0 = null;
        this.touchDown.on(cc.Node.EventType.TOUCH_START, this.onTouchStart0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd0, this);

        if (!this.isAI) {
            this.targetPos1 = null;
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd1, this);
        }

    },
    onTouchStart0(event) {
        this.targetPos0 = this.node.convertToNodeSpaceAR(event.getLocation());
    },
    onTouchMove0(event) {
        this.targetPos0 = this.node.convertToNodeSpaceAR(event.getLocation());
    },
    onTouchEnd0(event) {
        this.targetPos0 = null;
    },
    onTouchStart1(event) {
        this.targetPos1 = this.node.convertToNodeSpaceAR(event.getLocation());
    },
    onTouchMove1(event) {
        this.targetPos1 = this.node.convertToNodeSpaceAR(event.getLocation());
    },
    onTouchEnd1(event) {
        this.targetPos1 = null;
    },
    AIFunc() {
        var targetBallY = -800;
        for (var i = 0; i < this.ballParent.children.length; i++) {
            if (this.ballParent.children[i].getComponent(cc.RigidBody).linearVelocity.y > 0) {
                if (this.ballParent.children[i].y > targetBallY) {
                    targetBallY = this.ballParent.children[i].y
                    this.targetPos1 = this.ballParent.children[i].position;
                }
            }
        }
    },
    initBoWen() {
        this.createBoWenFunc = () => {
            var _boWen = cc.instantiate(this.boWen);
            _boWen.parent = this.boWen.parent;
            _boWen.width = this.random(200,400);
            _boWen.position = cc.v2(_boWen.width + 360, this.random(-350, 350));
            // _boWen.x =0;
            var _targetX = -(500 + _boWen.width);
            var _time = (_boWen.x - _targetX) / (this.random(-20, 20) + 50);
            cc.tween(_boWen)
                .to(_time, { x: _targetX })
                .call(() => {
                    _boWen.destroy();
                })
                .start();
        };
        this.schedule(this.createBoWenFunc,5);
        for (var i = 0; i < this.boWen.parent.children.length; i++) {
            var _boWen = this.boWen.parent.children[i];
            var _targetX = -(500 + _boWen.width);
            var _time = (_boWen.x - _targetX) / (this.random(-20, 20) + 50);
            cc.tween(_boWen)
                .to(_time, { x: _targetX })
                .call(() => {
                    _boWen.destroy();
                })
                .start();
        }
    },
    update(dt) {
        if (this.isAI) {
            this.AIFunc();
        }
        if (this.targetPos0 != null) {
            this.chuanJiangDown.x += (this.targetPos0.x - this.chuanJiangDown.x) / 6;

            var _angle = this.getAngle(cc.v2(this.targetPos0.x, -100), this.chuanJiangDown.position);;
            if (_angle < 180) {
                if (_angle > 45)
                    _angle = 45;
            }
            else {
                if (_angle < 315)
                    _angle = 315;
            }
            this.chuanJiangDown.angle = _angle;
            

        }
        if (this.targetPos1 != null) {
            if (this.isAI) {
                this.chuanJiangUp.x += (this.targetPos1.x - this.chuanJiangUp.x) / this.AISmart;
            }
            else
                this.chuanJiangUp.x += (this.targetPos1.x - this.chuanJiangUp.x) / 6;


            var _angle = this.getAngle(this.chuanJiangUp.position, cc.v2(this.targetPos1.x, 100));;
            if (_angle < 180) {
                if (_angle > 45)
                    _angle = 45;
            }
            else {
                if (_angle < 315)
                    _angle = 315;
            }
            this.chuanJiangUp.angle = _angle;
            
        }
    },
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
