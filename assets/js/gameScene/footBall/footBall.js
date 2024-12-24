

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        roleDown: cc.Node,
        roleDown2: cc.Node,
        roleDown3: cc.Node,
        roleUp: cc.Node,
        roleUp2: cc.Node,
        roleUp3: cc.Node,
        yaoGanDown: cc.Node,
        yaoGanUp: cc.Node,
        ball: cc.Node,
    },


    onLoad() {
        this.initCollision();
        window.footBall = this;
        this.isAI = window.isAI;
        this.yaoGanUp.active = this.yaoGanDown.active = false;
        this.posDown = this.roleDown.position;
        this.posDown2 = this.roleDown2.position;
        this.posDown3 = this.roleDown3.position;
        this.posUp = this.roleUp.position;
        this.posUp2 = this.roleUp2.position;
        this.posUp3 = this.roleUp3.position;
    },



    start() {
        this.scoreTarget = 2;
        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
        this.scoreDown = 0;
        this.scoreUp = 0;
        cc.director.on("进球了", (_isDown) => {
            if (_isDown) {
                this.scoreDown++;
                cc.director.emit("分数增加",true);
            }
            else {
                this.scoreUp++;
                cc.director.emit("分数增加",false);
            }
            this.checkOver();
        }, this);


        this.ball.opacity = 0;
        this.ball.scale = 2;
        this.ballAct = cc.tween(this.ball)
            .to(0.4, { scale: 1, opacity: 255 }, { easing: "sineIn" })
            .to(0.2, { scale: 1.5 }, { easing: "sineOut" })
            .to(0.2, { scale: 1 }, { easing: "sineIn" })
            .to(0.1, { scale: 1.2 }, { easing: "sineOut" })
            .to(0.1, { scale: 1 }, { easing: "sineIn" });
        this.ballAct.start();
    },
    checkOver() {
        if (!this.beginNow) return;
        if (this.scoreDown >= this.scoreTarget) {
            this.beginNow = false;
            cc.director.emit("游戏结束", true);
        }
        else if (this.scoreUp >= this.scoreTarget) {
            this.beginNow = false;
            cc.director.emit("游戏结束", false);
        }
        else {
            console.log("游戏尚未结束  重置");
            this.reset();
            this.beginNow = false;
        }
    },
    reset() {
        this.scheduleOnce(() => {
            this.ball.active = true;
            this.ball.opacity = 0;
            this.ball.scale = 2;
            this.ballAct.start();
            this.ball.position = cc.v2(0, 0);
            this.ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.ball.getComponent(cc.RigidBody).angularVelocity = 0;

        }, 1.1)
        this.actMoveRole(this.roleDown, this.posDown);
        this.actMoveRole(this.roleDown2, this.posDown2);
        this.actMoveRole(this.roleDown3, this.posDown3);
        this.actMoveRole(this.roleUp, this.posUp);
        this.actMoveRole(this.roleUp2, this.posUp2);
        this.actMoveRole(this.roleUp3, this.posUp3);

        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 1)
    },
    actMoveRole(_node, _pos) {
        var _angle = 0;
        if (_pos.y>0)
            _angle = 180;
        cc.tween(_node)
            .to(0.5, { position: _pos, angle: _angle }, { easing: "sineInOut" })
            .start();
    },
    beginGame() {
        this.beginNow = true;
        this.initTouch();
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
        this.touchDown.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd0, this);



        if (!this.isAI) {
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd1, this);
        }


    },
    onTouchStart0(event) {
        if (!this.beginNow) return;
        this.roleDown.getComponent("footBall_role").startMove();
        this.roleDown2.getComponent("footBall_role").startMove();
        this.roleDown3.getComponent("footBall_role").startMove();
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanDown.position = move_pos;
        this.yaoGanDown.active = true;
        this.yaoGanDown.children[0].position = cc.v2(0, 0);
        this.roleDown.getComponent("footBall_role").angleNow = null;
        this.roleDown2.getComponent("footBall_role").angleNow = null;
        this.roleDown3.getComponent("footBall_role").angleNow = null;
    },
    onTouchMove0(event) {
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        var _radius = this.getDistance(this.yaoGanDown.position, move_pos);
        if (_radius > 26)
            _radius = 26;
        var _angle = this.getAngle(this.yaoGanDown.position, move_pos);
        if (isNaN(_angle)) return;
        this.yaoGanDown.children[0].x = Math.sin(this.angleToRadian(_angle)) * _radius;
        this.yaoGanDown.children[0].y = -Math.cos(this.angleToRadian(_angle)) * _radius;


        this.roleDown.getComponent("footBall_role").angleNow = _angle + 180;
        this.roleDown2.getComponent("footBall_role").angleNow = _angle + 180;
        this.roleDown3.getComponent("footBall_role").angleNow = _angle + 180;

    },
    onTouchEnd0() {
        this.yaoGanDown.active = false;
        this.roleDown.getComponent("footBall_role").angleNow = null;
        this.roleDown.getComponent("footBall_role").stopMove();
        this.roleDown2.getComponent("footBall_role").angleNow = null;
        this.roleDown2.getComponent("footBall_role").stopMove();
        this.roleDown3.getComponent("footBall_role").angleNow = null;
        this.roleDown3.getComponent("footBall_role").stopMove();
    },

    onTouchStart1(event) {
        if (!this.beginNow) return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanUp.position = move_pos;
        this.yaoGanUp.active = true;
        this.yaoGanUp.children[0].position = cc.v2(0, 0);

        this.roleUp.getComponent("footBall_role").startMove();
        this.roleUp.getComponent("footBall_role").angleNow = null;
        this.roleUp2.getComponent("footBall_role").startMove();
        this.roleUp3.getComponent("footBall_role").startMove();

        this.roleUp2.getComponent("footBall_role").angleNow = null;
        this.roleUp3.getComponent("footBall_role").angleNow = null;
    },
    onTouchMove1(event) {
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        var _radius = this.getDistance(this.yaoGanUp.position, move_pos);
        if (_radius > 26)
            _radius = 26;
        var _angle = this.getAngle(this.yaoGanUp.position, move_pos);
        if (isNaN(_angle)) return;
        this.yaoGanUp.children[0].x = Math.sin(this.angleToRadian(_angle)) * _radius;
        this.yaoGanUp.children[0].y = -Math.cos(this.angleToRadian(_angle)) * _radius;


        this.roleUp.getComponent("footBall_role").angleNow = _angle + 180;
        this.roleUp2.getComponent("footBall_role").angleNow = _angle + 180;
        this.roleUp3.getComponent("footBall_role").angleNow = _angle + 180;

    },
    onTouchEnd1() {
        this.yaoGanUp.active = false;
        this.roleUp.getComponent("footBall_role").angleNow = null;
        this.roleUp.getComponent("footBall_role").stopMove();

        this.roleUp2.getComponent("footBall_role").angleNow = null;
        this.roleUp2.getComponent("footBall_role").stopMove();

        this.roleUp3.getComponent("footBall_role").angleNow = null;
        this.roleUp3.getComponent("footBall_role").stopMove();
    },
    // update (dt) {
    //     this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    // },

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
