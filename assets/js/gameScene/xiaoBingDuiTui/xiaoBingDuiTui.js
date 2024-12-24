

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        paoDown: cc.Node,
        shadowDown: cc.Node,
        shadowUp: cc.Node,
        paoUp: cc.Node,
        paoDan: cc.Node,
        soldierDown: cc.Node,
        soldierUp: cc.Node,
        npcParentDown: cc.Node,
        npcParentUp: cc.Node,
        effectParent: cc.Node,
        effectFire: cc.Node,
        effectBomb: cc.Node,
        effectDieDown: cc.Node,
        effectDieUp: cc.Node,
        wallUp: cc.Node,
        wallDown: cc.Node,
    },
    createEffect(_type, _pos) {
        var _effect = null;
        switch (_type) {
            case "开火":
                _effect = cc.instantiate(this.effectFire);
                break;
            case "爆炸":
                _effect = cc.instantiate(this.effectBomb);
                break;
            case "NPC死亡下":
                _effect = cc.instantiate(this.effectDieDown);
                break;
            case "NPC死亡上":
                _effect = cc.instantiate(this.effectDieUp);
                break;
        }
        if (_effect != null) {
            _effect.active = true;
            _effect.parent = this.effectParent;
            _effect.position = _pos;
            this.scheduleOnce(() => {
                _effect.destroy();
            }, 1)
        }

    },
    start() {
        window.xiaoBingDuiTui = this;
        this.isAI = window.isAI;
        this.initTouch();
        this.beginNow = false;
        this.sumLife = 15;//总的生命数量
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
            for (var i = 0; i < this.sumLife; i++) {
                cc.director.emit("分数增加", true);
                cc.director.emit("分数增加", false);
            }
        }, 0.1);
        this.soldierNum = 0;
        cc.director.on("对推检测结果", () => {
            this.checkOver();
        }, this)
        cc.director.on("分数减少", (_isDown) => {
            if (_isDown) {
                this.wallDown.color = new cc.Color(170, 10, 0);
                this.scheduleOnce(() => {
                    this.wallDown.color = new cc.Color(255, 255, 255);
                }, 0.1)
                cc.tween(this.wallDown)
                .to(0.05,{scale:1.05})
                .to(0.05,{scale:1.0})
                .start();
            }
            else {
                this.wallUp.color = new cc.Color(170, 10, 0);
                this.scheduleOnce(() => {
                    this.wallUp.color = new cc.Color(255, 255, 255);
                }, 0.1)
                cc.tween(this.wallUp)
                .to(0.05,{scale:1.05})
                .to(0.05,{scale:1.0})
                .start();
            }
        }, this);
        this.soldierDown.active = this.soldierUp.active = this.paoDan.active = false;
    },
    checkOver() {
        cc.director.emit("获取分数", true, this.getScoreDown, this);
        cc.director.emit("获取分数", false, this.getScoreUp, this);
        this.scheduleOnce(() => {
            if (!this.beginNow) return;
            if (this.scoreDown <= 0) {
                this.beginNow = false;
                cc.director.emit("游戏结束", false);
            }
            if (this.scoreUp <= 0) {
                this.beginNow = false;
                cc.director.emit("游戏结束", true);
            }
        }, 0.1)
    },
    getScoreDown(_score) {
        this.scoreDown = _score;
    },
    getScoreUp(_score) {
        this.scoreUp = _score;
    },
    //游戏开始
    beginGame() {
        this.beginNow = true;
        this.distanceDown = this.distanceUp = 0;


        this.createDuration = 4;//生成NPC的间隔
        this.createDurationTemp = 0;
        this.AICouldKaiPao = true;
        this.AIKaiPaoCD = 0;
    },


    update(dt) {
        if (this.beginNow) {
            //下炮 转动
            if (this.distanceDown == 0) {
                if (this.moveStateDown == 0) {
                    this.angleDown += this.angleSpeed;
                    if (this.angleDown >= this.maxAngle)
                        this.moveStateDown = 1;
                }

                if (this.moveStateDown == 1) {
                    this.angleDown -= this.angleSpeed;
                    if (this.angleDown <= -this.maxAngle)
                        this.moveStateDown = 0;
                }
            }
            else if (this.distanceDown > 0) {
                this.distanceDown += this.speedPao;
            }

            this.shadowDown.angle = this.paoDown.angle = this.angleDown;

            //上炮 转动
            if (this.distanceUp == 0) {
                if (this.moveStateUp == 0) {
                    this.angleUp += this.angleSpeed;
                    if (this.angleUp >= this.maxAngle + 180)
                        this.moveStateUp = 1;
                }

                if (this.moveStateUp == 1) {
                    this.angleUp -= this.angleSpeed;
                    if (this.angleUp <= -this.maxAngle + 180)
                        this.moveStateUp = 0;
                }
            }
            else if (this.distanceUp > 0) {
                this.distanceUp += this.speedPao;
                if (this.isAI) {
                    if (this.distanceUp >= this.targetDistanceAI && this.AIKaiPaoCD <= 0) {
                        this.AIKaiPaoCD = 1;
                        this.kaiPao();
                    }
                }
            }
            if (this.isAI) {
                this.AIFunc();
                if (this.AIKaiPaoCD > 0)
                    this.AIKaiPaoCD -= dt;
            }
            this.shadowUp.angle = this.paoUp.angle = this.angleUp;

            //生成NPC

            if (this.createDurationTemp <= 0) {
                this.createDurationTemp = this.createDuration;
                this.createDuration -= 0.2;
                if (this.createDuration < 1)
                    this.createDuration = 1;
                this.createNpc(true);
                this.createNpc(false);
            }
            this.createDurationTemp -= dt;
        }
    },
    initTouch() {
        this.maxAngle = 45;//最大角度 偏移
        this.angleSpeed = 2.5;//角速度
        this.speedPao = 10;//炮弹距离增长速度
        this.angleDown = 0; this.angleUp = 180;
        this.moveStateDown = this.moveStateUp = 0;
        this.touchDown.on(cc.Node.EventType.TOUCH_START, this.onTouchStart0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd0, this);

        if (!this.isAI) {
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd1, this);
        }
        else {

        }
        this.actDownXuLi =
            cc.tween(this.paoDown.children[0])
                .to(0.5, { scaleY: 0.5 })
                .call(() => {
                    this.actDownShake.start();
                });

        this.shakeDis = 4;//颤抖大小

        this.paoDownPosYuan = this.paoDown.position;
        this.actDownShake =
            cc.tween(this.paoDown)
                .repeatForever(
                    cc.tween()
                        .to(0.01, { x: this.paoDownPosYuan.x + this.shakeDis / 2, y: this.paoDownPosYuan.y + this.shakeDis })
                        .to(0.01, { x: this.paoDownPosYuan.x - this.shakeDis / 2, y: this.paoDownPosYuan.y + this.shakeDis })
                        .to(0.01, { x: this.paoDownPosYuan.x + this.shakeDis / 2, y: this.paoDownPosYuan.y - this.shakeDis })
                        .to(0.01, { x: this.paoDownPosYuan.x - this.shakeDis / 2, y: this.paoDownPosYuan.y - this.shakeDis })
                );


        this.actUpXuLi =
            cc.tween(this.paoUp.children[0])
                .to(0.5, { scaleY: 0.5 })
                .call(() => {
                    this.actUpShake.start();
                });

        this.paoUpPosYuan = this.paoUp.position;
        this.actUpShake =
            cc.tween(this.paoUp)
                .repeatForever(
                    cc.tween()
                        .to(0.01, { x: this.paoUpPosYuan.x + this.shakeDis / 2, y: this.paoUpPosYuan.y + this.shakeDis })
                        .to(0.01, { x: this.paoUpPosYuan.x - this.shakeDis / 2, y: this.paoUpPosYuan.y + this.shakeDis })
                        .to(0.01, { x: this.paoUpPosYuan.x + this.shakeDis / 2, y: this.paoUpPosYuan.y - this.shakeDis })
                        .to(0.01, { x: this.paoUpPosYuan.x - this.shakeDis / 2, y: this.paoUpPosYuan.y - this.shakeDis })
                );



    },
    AIFunc() {
        if (this.isAI) {
            if (!this.AICouldKaiPao || this.AIKaiPaoCD > 0) {
                return;
            }
        }
        var _npcTarget = null;
        var _y = -1000;
        for (var i = 0; i < this.npcParentDown.children.length; i++) {
            var _npcTemp = this.npcParentDown.children[i];
            if (_npcTemp.y > _y) {
                _npcTarget = _npcTemp;
                _y = _npcTemp.y;
            }
        }
        if (_npcTarget != null) {

            var _targetPos = cc.v2(_npcTarget.x, _npcTarget.y + 150);
            var _pos = this.paoUp.convertToWorldSpaceAR(this.paoUp.children[0].children[0].position);
            _pos = this.node.convertToNodeSpaceAR(_pos);

            var _targetAngle = this.getAngle(_targetPos, _pos);

            this.targetDistanceAI = this.getDistance(_pos, _targetPos);
            if ((this.paoUp.angle - _targetAngle) <= this.angleSpeed) {
                cc.tween(_npcTarget)
                    .by(0.1, { scale: 0.3 })
                    .by(0.1, { scale: -0.3 })
                    .start();

                this.AICouldKaiPao = false;
                this.miaoZhun();
            }

        }
    },
    onTouchStart0(event) {
        if (!this.beginNow) return;
        this.distanceDown = 50;
        this.actDownXuLi.start();
    },
    onTouchEnd0(event) {
        if (!this.beginNow) return;
        this.actDownShake.stop();
        this.paoDan.position = this.paoDownPosYuan;
        this.actDownXuLi.stop();
        this.createPaoDan(true)

        var _changeScale = 1 - this.paoDown.children[0].scaleY;
        cc.tween(this.paoDown.children[0])
            .to(0.1, { scaleY: 1 + _changeScale, scaleX: 1 - _changeScale * 0.5 })

            .to(0.1, { scaleY: 0.8, scaleX: 1 })
            .to(0.1, { scaleY: 1, scaleX: 1 })
            .delay(0.2)
            .call(() => {
                this.distanceDown = 0;
            }).start();


    },
    onTouchStart1(event) {
        this.miaoZhun();

    },
    miaoZhun() {
        this.distanceUp = 50;
        this.actUpXuLi.start();
    },

    onTouchEnd1(event) {
        this.kaiPao();
    },
    kaiPao() {

        this.actUpShake.stop();
        this.paoDan.position = this.paoDownPosYuan;

        this.createPaoDan(false)
        this.actUpXuLi.stop();
        var _changeScale = 1 - this.paoUp.children[0].scaleY;
        cc.tween(this.paoUp.children[0])
            .to(0.1, { scaleY: 1 + _changeScale, scaleX: 1 - _changeScale * 0.5 })

            .to(0.1, { scaleY: 0.8, scaleX: 1 })
            .to(0.1, { scaleY: 1, scaleX: 1 })
            .delay(0.2)
            .call(() => {
                this.distanceUp = 0;
                this.AICouldKaiPao = true;
            }).start();
    },
    //生成炮弹
    createPaoDan(_isDown) {
        var _paoDan = cc.instantiate(this.paoDan);
        _paoDan.active = true;
        _paoDan.parent = this.node;
        if (_isDown) {

            var _pos = this.paoDown.convertToWorldSpaceAR(this.paoDown.children[0].children[0].position);
            _pos = this.node.convertToNodeSpaceAR(_pos);
            _paoDan.position = _pos;
            _paoDan.getComponent("xiaoBingDuiTui_paoDan").reset(_isDown, this.paoDown.angle, this.distanceDown);
        }
        else {

            var _pos = this.paoUp.convertToWorldSpaceAR(this.paoUp.children[0].children[0].position);
            _pos = this.node.convertToNodeSpaceAR(_pos);
            _paoDan.position = _pos;
            _paoDan.getComponent("xiaoBingDuiTui_paoDan").reset(_isDown, this.paoUp.angle, this.distanceUp);
        }

    },
    //生成NPC
    createNpc(_isDown) {
        if (!this.beginNow) return;
        if (_isDown) {
            var _npc = cc.instantiate(this.soldierDown);
            this.soldierNum++
            _npc.parent = this.npcParentDown;
        }
        else {

            var _npc = cc.instantiate(this.soldierUp);
            _npc.parent = this.npcParentUp;
        }
        _npc.active = true;
        _npc.getComponent("xiaoBingDuiTui_soldier").reset(_isDown, 1 + this.soldierNum * 0.1);
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
