

cc.Class({
    extends: cc.Component,

    properties: {
        npcParent: cc.Node,
        isDown: true,
    },

    onLoad() {
        this.angleNow = null;
        this.anim = this.node.getComponent(cc.Animation);
        this.animIsPlaying = false;
        this.shootPoint = cc.find("shootPoint", this.node); this.shootPoint.opacity = 0;
        this.targetNpc = null;
        this.gun = cc.find("xbdt_jueSe_2_4", this.node); this.gunY = this.gun.y;
        this.shootDistance = 700;

        this.yuanScale = this.node.scaleX;
        this.diePos = this.node.position;
        cc.director.on("角色复活", (_isDown) => {
            if (_isDown == this.isDown)
                this.revive();
        }, this);
    },

    start() {
        this.speed = 4;
        this.fireDuration = 0.1;

        this.fireFrame = 0;
        this.fireFunc = () => {
            if (this.doubleSpeedDuration > 0)//射速加倍
            {
                this.createBt();
            }
            else {
                this.fireFrame++;
                if (this.fireFrame % 2 == 1) {
                    this.createBt();
                }
            }
        };
        this.schedule(this.fireFunc, this.fireDuration);//

        // if(this.isDown){
        //     this.schedule(()=>{
        //         this.beHurt();
        //     },0.1)
        // }
        this.revive();
        cc.director.on("获得道具", (_type, _isDown) => {
            if (_isDown != this.isDown) return;
            switch (_type) {
                case "加血":
                    this.schedule(() => {
                        if (this.hp < this.hpZong) {
                            this.addHp();
                        }
                    }, 0.1, this.hpZong - 1)
                    break;
                case "伤害加倍":
                    this.doubleHurtDuration = 5;
                    break;
                case "射速加倍":
                    this.doubleSpeedDuration = 5;
                    break;
            }
        }, this)
    },
    addHp() {
        this.hp++;
        cc.director.emit("分数增加", this.isDown);

        var _effect = cc.instantiate(window.chiJi.effectAddHp);
        _effect.parent = cc.find("effectParent", window.chiJi.node);
        _effect.position = this.node.position;
        _effect.active = true;
        cc.tween(_effect)
            .by(0.2, { y: 80, opacity: 0 })
            .call(() => {
                _effect.destroy();
            })
            .start();

    },
    revive() {
        
        window.chiJi.roleNum++;
        this.node.scale = this.yuanScale;
        this.hp = this.hpZong = 10;
        
        this.node.position = this.diePos;
        for (var i = 0; i < this.hp; i++) {
            cc.director.emit("分数增加", this.isDown);
        }
    },
    createBt() {
        if (this.hp <= 0) return;
        if (this.targetNpc == null) return;
        cc.tween(this.gun)
            .to(0.02, { y: this.gunY + 10 })
            .to(0.1, { y: this.gunY })
            .start();

            this.createEffectFire();
        if (this.doubleHurtDuration > 0)//双倍伤害 （多加一行子弹）
        {
            var _pos = this.node.convertToWorldSpaceAR(cc.v2(this.shootPoint.x+10,this.shootPoint.y));
            var _pos2 = this.node.parent.convertToNodeSpaceAR(_pos);
            var _angle = this.node.angle;
            window.chiJi.createBt(_pos2, _angle)

            var _pos2_1 = this.node.convertToWorldSpaceAR(cc.v2(this.shootPoint.x-10,this.shootPoint.y));
            var _pos2_2 = this.node.parent.convertToNodeSpaceAR(_pos2_1);
            window.chiJi.createBt(_pos2_2, _angle)
        }
        else {
            var _pos = this.node.convertToWorldSpaceAR(this.shootPoint.position);
            var _pos2 = this.node.parent.convertToNodeSpaceAR(_pos);
            var _angle = this.node.angle;

            window.chiJi.createBt(_pos2, _angle)
        }

    },
    beHurt() {
        this.scheduleOnce(() => {
            if (this.hp <= 0) return;
            this.hp--;
            cc.director.emit("分数减少", this.isDown);
            if (this.hp <= 0) {
                this.createEffectDie();
                this.node.scale = 0;
                this.diePos = this.node.position;
                this.node.x = 2000;
            }
        }, 0.01)
    },
    createEffectDie() {
        var _effect = cc.instantiate(window.chiJi.effectRoleDie);
        _effect.parent = cc.find("effectParent", window.chiJi.node);
        _effect.position = this.node.position;
        _effect.active = true;
        _effect.getComponent("shuangRenChiJi_muBei").reset(this.isDown);

    },
    createEffectFire() {
        var _effect = cc.instantiate(window.chiJi.effectFire);
        _effect.parent = this.node;
        _effect.position = this.shootPoint.position;
        _effect.active = true;

    },
    update(dt) {
        if (this.doubleHurtDuration > 0)
            this.doubleHurtDuration -= dt;

        if (this.doubleSpeedDuration > 0)
            this.doubleSpeedDuration -= dt;

        if (this.hp <= 0) return;
        this.targetNpc = null;
        var _pos = null;
        var _dis = this.shootDistance;
        for (var i = 0; i < this.npcParent.children.length; i++) {
            var _npc = this.npcParent.children[i];
            var _disTemp = this.getDistance(this.node.position, _npc.position);
            if (_disTemp < _dis) {
                _dis = _disTemp;
                _pos = _npc.position;
                this.targetNpc = _npc;
            }
        }


        if (this.angleNow != null) {
            this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed;
            this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed;
            if (!this.animIsPlaying) {
                this.animIsPlaying = true;
                this.anim.play();
            }
            this.node.angle = this.angleNow + 180;
        }
        else {
            if (this.animIsPlaying) {
                this.anim.stop();
                this.animIsPlaying = false;
            }
        }
        if (_pos != null)
            this.node.angle = this.getAngle(this.node.position, _pos);
        if (this.node.x > 350)
            this.node.x = 350;
        else if (this.node.x < -350)
            this.node.x = -350;

        if (this.node.y > (cc.winSize.height / 2 - 30))
            this.node.y = (cc.winSize.height / 2 - 30);
        else if (this.node.y < - (cc.winSize.height / 2 - 30))
            this.node.y = - (cc.winSize.height / 2 - 30);
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
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
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
});
