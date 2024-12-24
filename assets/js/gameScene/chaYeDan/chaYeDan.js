

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        roleDown: cc.Node,
        roleUp: cc.Node,
        yaoGanDown: cc.Node,
        yaoGanUp: cc.Node,
        diamond1: cc.Node,
        diamond2: cc.Node,
        diamondUpSmall: cc.Node,
        diamondUpBig: cc.Node,
        diamondDownBig: cc.Node,
        diamondDownSmall: cc.Node,
        effect: cc.Node,
        effectParent: cc.Node,
        addScoreBig: cc.Node,
        addScoreSmall: cc.Node,


    },

    onLoad() {
        this.initCollision();
        this.isAI = window.isAI;
        this.yaoGanUp.active = this.yaoGanDown.active = false;
    },

    start() {
        this.scoreTarget = 30;
        this.AIDuration = 0.1;
        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
        cc.director.on("特效", (_pos, _isBig) => {
            this.createEffect(_pos);
            this.createScoreEffect(_isBig, _pos);

            AD.audioMng.playSfx("得分")
            if (_isBig) {
                cc.director.emit("分数增加", _pos.y < 0)
                cc.director.emit("分数增加", _pos.y < 0)
            }
            else
                cc.director.emit("分数增加", _pos.y < 0);
            this.checkOver();
            if (_pos.y > 0) {
                this.AIDuration = this.random(40, 80) * 0.01;//AI智能程度 越小越智能
            }
        }, this)
    },
    checkOver() {
        if (!this.beginNow) return;
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
    beginGame() {
        this.beginNow = true;
        this.initTouch();
        this.schedule(() => {
            this.createDiamond(true, false);
            this.createDiamond(false, false);
        }, 1.5)
        this.schedule(() => {
            this.createDiamond(true, true);
            this.createDiamond(false, true);
        }, 5)
    },
    createDiamond(_isDown, _big) {
        if (!this.beginNow) return;
        var _diamond = null;
        var _parent = null;
        var _posY = null;
        if (_isDown) {
            if (_big) {
                if (this.diamondDownBig.children.length < 1) {
                    _diamond = cc.instantiate(this.diamond2);
                    _parent = this.diamondDownBig;
                }
            }
            else if (!_big) {
                if (this.diamondDownSmall.children.length < 3) {
                    _diamond = cc.instantiate(this.diamond1);
                    _parent = this.diamondDownSmall;
                }
            }
            _posY = this.random(-530, -60)
        }
        else {
            if (_big) {
                if (this.diamondUpBig.children.length < 1) {
                    _diamond = cc.instantiate(this.diamond2);
                    _parent = this.diamondUpBig;
                }
            }
            else if (!_big) {
                if (this.diamondUpSmall.children.length < 3) {
                    _diamond = cc.instantiate(this.diamond1);
                    _parent = this.diamondUpSmall;
                }
            }
            _posY = this.random(60, 530)

        }
        if (_diamond != null) {
            var _posX = this.random(-300, -100);
            if (this.random(0, 1) == 1)
                _posX = -_posX;
            _diamond.active = true;
            _diamond.parent = _parent;
            _diamond.position = cc.v2(_posX, _posY);
            if (!_isDown)
                _diamond.angle = 180;
            _diamond.getComponent(cc.PhysicsBoxCollider).enabled = false;
            var _spr = cc.find("spr", _diamond);
            var _shadow = cc.find("shadow", _diamond);
            _spr.opacity = _shadow.opacity = 0;
            _shadow.scale = 0;
            _spr.y = 100;
            cc.tween(_spr)
                .to(0.3, { y: 0, opacity: 255 })
                .start();
            cc.tween(_shadow)
                .to(0.3, { opacity: 255, scale: 1 })
                .call(() => {
                    _diamond.getComponent(cc.PhysicsBoxCollider).enabled = true;
                })
                .start();
        }
    },
    createEffect(_pos) {
        var _effect = cc.instantiate(this.effect);
        _effect.parent = this.effectParent;
        _effect.position = _pos;
        _effect.active = true;
    },
    createScoreEffect(_add, pos) {
        if (_add)
            var _effect = cc.instantiate(this.addScoreBig);
        else
            var _effect = cc.instantiate(this.addScoreSmall);
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
            .to(0.4, { scale: 1, y: pos.y + _direction * 1.6, opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                _effect.destroy();
            })
            .start();
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
        this.roleDown.getComponent("chaYeDan_role").angleNow = null;
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
        if (this.yaoGanDown.children[0].x > 0)
            this.roleDown.scaleX = 1;
        else
            this.roleDown.scaleX = -1;
        this.roleDown.getComponent("chaYeDan_role").angleNow = _angle + 180;

    },
    onTouchEnd0() {
        this.yaoGanDown.active = false;
        this.roleDown.getComponent("chaYeDan_role").angleNow = null;
    },

    onTouchStart1(event) {
        if (!this.beginNow) return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        this.yaoGanUp.position = move_pos;
        this.yaoGanUp.active = true;
        this.yaoGanUp.children[0].position = cc.v2(0, 0);
        this.roleUp.getComponent("chaYeDan_role").angleNow = null;
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

        if (this.yaoGanUp.children[0].x > 0)
            this.roleUp.scaleX = 1;
        else
            this.roleUp.scaleX = -1;
        this.roleUp.getComponent("chaYeDan_role").angleNow = _angle + 180;

    },
    onTouchEnd1() {
        this.yaoGanUp.active = false;
        this.roleUp.getComponent("chaYeDan_role").angleNow = null;
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
    update(dt) {
        if (!this.beginNow) {
            this.roleUp.getComponent("chaYeDan_role").angleNow = null;
            return;
        }
        if (this.isAI) {
            if (this.AIDuration > 0) {
                this.AIDuration -= dt;
                // if(this.getDistance(this.roleUp.position, cc.v2(1,250))>50){

                //    var _angle1 = this.getAngle(this.roleUp.position, cc.v2(1,250)) + 180;

                //     if (250 > this.roleUp.x)
                //         this.roleUp.scaleX = 1;
                //     else
                //         this.roleUp.scaleX = -1;
                // }
                // this.roleUp.getComponent("chaYeDan_role").angleNow = _angle1;
                return;
            }
            var _angle = null;
            var _diamond = null;
            for (var i = 0; i < this.diamondUpBig.children.length; i++) {
                _diamond = this.diamondUpBig.children[0];
            }
            if (_diamond == null) {
                var _dis = 2000;
                for (var i = 0; i < this.diamondUpSmall.children.length; i++) {
                    var _diamondTemp = this.diamondUpSmall.children[0];
                    var _disTemp = this.getDistance(_diamondTemp.position, this.roleUp.position);
                    if (_disTemp < _dis) {
                        _diamond = _diamondTemp;
                        _dis = _disTemp;
                    }
                }
            }
            if (_diamond != null) {
                _angle = this.getAngle(this.roleUp.position, _diamond.position) + 180;

                if (_diamond.x > this.roleUp.x)
                    this.roleUp.scaleX = -1;
                else
                    this.roleUp.scaleX = 1;
            }
            else {
                if (this.getDistance(this.roleUp.position, cc.v2(1, 250)) > 50) {

                    _angle = this.getAngle(this.roleUp.position, cc.v2(1, 250)) + 180;

                    if (250 > this.roleUp.x)
                        this.roleUp.scaleX = -1;
                    else
                        this.roleUp.scaleX = 1;
                }
            }
            this.roleUp.getComponent("chaYeDan_role").angleNow = _angle;
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
