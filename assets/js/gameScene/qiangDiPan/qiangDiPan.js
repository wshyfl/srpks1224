

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        roleDown: cc.Node,
        roleUp: cc.Node,
        yaoGanDown: cc.Node,
        yaoGanUp: cc.Node,
        prop_bigger: cc.Node,
        prop_faster: cc.Node,

    },


    onLoad() {
        this.initCollision();
        window.qiangDiPan = this;
        this.isAI = window.isAI;
        this.yaoGanUp.active = this.yaoGanDown.active = false;
        this.prop_bigger.active = this.prop_faster.active = false;
    },



    start() {
        this.scoreTarget = 3;
        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);



    },
    checkOver() {
        if (!this.beginNow) return;
        this.beginNow = false;
        cc.director.emit("获取分数", true, this.getScoreDown, this);
        cc.director.emit("获取分数", false, this.getScoreUp, this);
        if (this.scoreDown != this.scoreUp)
            cc.director.emit("游戏结束", (this.scoreDown > this.scoreUp));
        else
            cc.director.emit("游戏平局")


    },
    getScoreDown(_score) {
        this.scoreDown = _score;
    },
    getScoreUp(_score) {
        this.scoreUp = _score;
    },
    beginGame() {
        this.beginNow = true;
        this.initTouch();
        //生成道具
        this.schedule(() => {
            var _type = this.random(0, 1);
            if (_type == 0)
                var _prop = cc.instantiate(this.prop_bigger);
            else
                var _prop = cc.instantiate(this.prop_faster);
            _prop.parent = cc.find("propMng", this.node);
            _prop.active = true;
            _prop.position = cc.v2(this.random(-300, 300), this.random(-400, 400))
        }, 8)
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
        this.roleDown.getComponent("qiangDiPan_role").startMove();
        this.roleDown.getComponent("qiangDiPan_role").angleNow = null;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanDown.position = move_pos;
        this.yaoGanDown.active = true;
        this.yaoGanDown.children[0].position = cc.v2(0, 0);
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
        this.roleDown.getComponent("qiangDiPan_role").angleNow = _angle + 180;

    },
    onTouchEnd0() {
        this.yaoGanDown.active = false;
        this.roleDown.getComponent("qiangDiPan_role").angleNow = null;
        this.roleDown.getComponent("qiangDiPan_role").stopMove();
    },

    onTouchStart1(event) {
        if (!this.beginNow) return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanUp.position = move_pos;
        this.yaoGanUp.active = true;
        this.yaoGanUp.children[0].position = cc.v2(0, 0);

        this.roleUp.getComponent("qiangDiPan_role").startMove();
        this.roleUp.getComponent("qiangDiPan_role").angleNow = null;
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
        this.roleUp.getComponent("qiangDiPan_role").angleNow = _angle + 180;


    },
    onTouchEnd1() {
        this.yaoGanUp.active = false;

        this.roleUp.getComponent("qiangDiPan_role").angleNow = null;
        this.roleUp.getComponent("qiangDiPan_role").stopMove();
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
