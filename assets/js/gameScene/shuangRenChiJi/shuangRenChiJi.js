

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        roleDown: cc.Node,
        roleUp: cc.Node,
        yaoGanDown: cc.Node,
        yaoGanUp: cc.Node,
        bullet: cc.Node,
        effectBomb: cc.Node,
        effectNpcDie: cc.Node,
        effectRoleDie: cc.Node,
        effectAddHp: cc.Node,
        effectFire: cc.Node,
        prop: cc.Node,
        npc: cc.Node,
    },

    onLoad() {

        this.roleNum = 0;
        this.initCollision();
        this.isAI = false;
        this.yaoGanUp.active = this.yaoGanDown.active = false;
        window.chiJi = this;
    },

    start() {


        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);


        cc.director.on("特效", (_pos) => {
            var _effect = cc.instantiate(this.effectBomb);
            _effect.parent = cc.find("effectParent", this.node);
            _effect.position = _pos;
            _effect.active = true;
            cc.tween(_effect)
                .delay(1)
                .call(() => {
                    _effect.destroy();
                })
                .start();
        }, this)
        cc.director.on("npc特效", (_pos) => {
            var _effect = cc.instantiate(this.effectNpcDie);
            _effect.parent = cc.find("effectParent", this.node);
            _effect.position = _pos;
            _effect.active = true;
            cc.tween(_effect)
                .delay(1)
                .call(() => {
                    _effect.destroy();
                })
                .start();
        }, this)
    },
    beginGame() {
        this.beginNow = true;
        this.initTouch();
        this.duration = 0;
        this.durationTarget = 2;

        cc.director.emit("合作模式开始");
        this.second = 0;
        this.schedule(() => {
            this.second++;
            if (this.second % 4 == 0) {
                this.duration0 -= 0.1;
                this.duration1 -= 0.1;
                this.duration2 -= 0.1;
                if (this.duration0 < 0.2)
                    this.duration0 = 0.2;
                if (this.duration1 < 0.2)
                    this.duration1 = 0.2;
                if (this.duration2 < 0.2)
                    this.duration2 = 0.2;
            }
        }, 1);

        this.duration0Temp = this.duration1Temp = this.duration2Temp = 0;
        this.duration0 = 2;
        this.duration1 = 3;
        this.duration2 = 8;


        this.schedule(() => {
            this.createProp();
        }, 10);
    },
    //生成炮弹
    createBt(_pos, _angle) {
        if (!this.beginNow) return;
        var _bt = cc.instantiate(this.bullet);
        _bt.active = true;
        _bt.position = _pos;
        _bt.parent = cc.find("btParent", this.node);
        _bt.getComponent("shuangRenChiJi_bt").reset(_angle + 180)
    },
    //生成npc
    createNpc(_type) {
        if (!this.beginNow) return;
        var _bt = cc.instantiate(this.npc);
        _bt.active = true;
        _bt.parent = cc.find("npcParent", this.node);
        _bt.getComponent("shuangRenChiJi_npc").reset(_type)
    },
    //生成道具
    //生成npc
    createProp() {
        if (!this.beginNow) return;
        var _bt = cc.instantiate(this.prop);
        _bt.active = true;
        _bt.parent = cc.find("propParent", this.node);
    },
    update(dt) {
        this.duration0Temp += dt;
        this.duration1Temp += dt;
        this.duration2Temp += dt;
        if (this.duration0Temp > this.duration0) {
            this.duration0Temp = 0;
            this.createNpc(0);
        }
        if (this.duration1Temp > this.duration1) {
            this.duration1Temp = 0;
            this.createNpc(1);
        }
        if (this.duration2Temp > this.duration2) {
            this.duration2Temp = 0;
            this.createNpc(2);
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
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        this.yaoGanDown.position = move_pos;
        this.yaoGanDown.active = true;
        this.yaoGanDown.children[0].position = cc.v2(0, 0);
        this.roleDown.getComponent("shuangRenChiJi_role").angleNow = null;
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

        this.roleDown.getComponent("shuangRenChiJi_role").angleNow = _angle + 180;
     




    },
    onTouchEnd0() {
        this.yaoGanDown.active = false;
        this.roleDown.getComponent("shuangRenChiJi_role").angleNow = null;

    },

    onTouchStart1(event) {
        if (!this.beginNow) return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanUp.position = move_pos;
        this.yaoGanUp.active = true;
        this.yaoGanUp.children[0].position = cc.v2(0, 0);
        this.roleUp.getComponent("shuangRenChiJi_role").angleNow = null;

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

        this.roleUp.getComponent("shuangRenChiJi_role").angleNow = _angle + 180;



    },
    onTouchEnd1() {
        this.yaoGanUp.active = false;
        this.roleUp.getComponent("shuangRenChiJi_role").angleNow = null;

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
    // update (dt) {},
});
