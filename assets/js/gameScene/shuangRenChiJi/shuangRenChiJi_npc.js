

cc.Class({
    extends: cc.Component,

    properties: {
        sprArr: [cc.SpriteFrame],
        sprShadowArr: [cc.SpriteFrame],
    },

    onLoad() {


    },
    reset(_type) {
        this.speed = 0.5 + this.random(5, 20) * 0.1;
        this.hp = 1;
        this.type = _type;
        var _angle = this.random(0, 360);
        this.node.position = cc.v2(-Math.sin(this.angleToRadian(_angle)) * 1000, Math.cos(this.angleToRadian(_angle)) * 1000);

        this.yuanScale = this.node.scaleX;
        switch (this.type) {
            case 0:
                this.hp = 5;
                break;
            case 1:
                this.hp = 8;
                break;
            case 2:
                this.hp = 15;
                break;
        }
        this.shadow = cc.find("shadow", this.node); this.shadow.getComponent(cc.Sprite).spriteFrame = this.sprShadowArr[this.type];
        this.spr = cc.find("spr", this.node); this.spr.getComponent(cc.Sprite).spriteFrame = this.sprArr[this.type];
        var _direction = this.random(0, 1);
        if (_direction == 0)
            _direction = -1;
        cc.tween(cc.find("spr", this.node))
            .repeatForever(
                cc.tween()
                    .by(this.random(20, 50) * 0.01, { angle: this.random(90, 180) * _direction })
                    .delay(this.random(50, 100) * 0.01)
            )
            .start();
    },
    update(dt) {
        this.shadow.angle = this.spr.angle;
        if (!window.chiJi.beginNow) return;
        var _distance = 1000;
        var _pos = null;
        if (window.chiJi.roleUp.scale != 0)
            if (this.getDistance(this.node.position, window.chiJi.roleUp.position) < _distance) {
                _pos = window.chiJi.roleUp.position;
                _distance = this.getDistance(this.node.position, window.chiJi.roleUp.position);
            }
        if (window.chiJi.roleDown.scale != 0)
            if (this.getDistance(this.node.position, window.chiJi.roleDown.position) < _distance) {
                _pos = window.chiJi.roleDown.position;
            }
        if (_pos == null) return;
        var _angle = this.getAngle(_pos, this.node.position)
        this.vx = -Math.sin(this.angleToRadian(_angle)) * this.speed;
        this.vy = Math.cos(this.angleToRadian(_angle)) * this.speed;
        this.node.x += this.vx;
        this.node.y += this.vy;
    },
    beHurt() {
        this.hp--;
        if (this.hp <= 0) {
            this.dieFunc();
            var _angle = this.random(0, 360);
            for (var i = 0; i < 4; i++)
                window.chiJi.createBt(this.node.position, _angle + i * 90)
        }
        else {
            cc.tween(this.node)
                .to(0.05, { scale: 0.9 * this.yuanScale })
                .to(0.05, { scale: 1.2 * this.yuanScale })
                .to(0.05, { scale: 1 * this.yuanScale })
                .start();

        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 100) {//碰到玩家
            this.dieFunc();
            otherCollider.node.getComponent("shuangRenChiJi_role").beHurt();
        }
        else if (otherCollider.tag == 88) {//碰到玩家子弹
            this.beHurt();
        }
    },
    dieFunc() {
        AD.audioMng.playSfx("NPC死亡");
        this.node.destroy();
        cc.director.emit("npc特效", this.node.position);
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
