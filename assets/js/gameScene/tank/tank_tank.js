

cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        shadow: cc.Node,
        body: cc.Node,
        pao: cc.Node,
        otherTank: cc.Node,
        bullet: cc.Node,
        effectFire: cc.Node,
        tipsZhuangDan: cc.Node,
    },

    onLoad() {
        this.speed = 5;

        this.animPao = this.pao.getComponent(cc.Animation);

        this.couldFire = true;
        this.angleNow = null;
        this.tipsZhuangDan.opacity = 0;
        this.CDIng = false;
        this.wuDi = false;
        //以下参数只应用于AI模式
        this.hadBarrier = false;//中间有障碍吗？(只应用于AI模式)
        this.AIMoveState = 0;
        this.AIMoveStateDuration = 0;

        this.parentJS = this.node.parent.getComponent("tank");
        this.gameOverNow = false;
        cc.director.on("游戏结束", () => {
            this.gameOverNow = true;
        }, this);
    },
    beHurt() {
        if (this.wuDi) return;
        this.wuDi = true;
        cc.tween(this.node)
            .to(0.4, { opacity: 60 })
            .to(0.4, { opacity: 255 })
            .to(0.4, { opacity: 60 })
            .to(0.4, { opacity: 255 })
            .to(0.4, { opacity: 60 })
            .to(0.4, { opacity: 255 })
            .call(() => {
                this.wuDi = false;
            })
            .start();
        cc.director.emit("分数增加", !this.isDown);
    },
    fireFunc() {
        if (!this.couldFire || this.CDIng || this.gameOverNow) return;
        this.animPao.play();
        var _bt = cc.instantiate(this.bullet);
        _bt.active = true;
        _bt.parent = this.node.parent;
        _bt.getComponent("tank_bullet").reset(this.pao.angle);

        var _pos = cc.v2(
            this.node.x - Math.sin(this.angleToRadian(this.pao.angle)) * 80,
            this.node.y + Math.cos(this.angleToRadian(this.pao.angle)) * 80
        );
        _bt.position = _pos;

        var _effectFire = cc.instantiate(this.effectFire);
        _effectFire.parent = this.node.parent;
        _effectFire.active = true;
        _effectFire.position = _pos;
        this.scheduleOnce(() => {
            _effectFire.destroy();
        }, 1);

        this.CDIng = true;
        cc.tween(this.tipsZhuangDan)
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 100 })
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 100 })
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.CDIng = false;
            })
            .start();
    },

    update(dt) {

        if (!this.parentJS.beginNow || this.gameOverNow) return;

        if (this.isDown == false && window.isAI) {
            // if (!this.CDIng) {
            //     this.angleNow = this.getAngle(this.otherTank.position, this.node.position);
            // }
            if (this.AIMoveState == 0) {

                this.angleNow = this.getAngle(this.otherTank.position, this.node.position);

                if (this.getDistance(this.node.position, this.otherTank.position) > 200) {
                    this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed;
                    this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed;
                    this.body.angle = this.angleNow;
                    this.shadow.angle = this.angleNow;

                }
            }
            else if (this.AIMoveState == 1) {
                this.AIMoveStateDuration -= dt;
                if (this.AIMoveStateDuration <= 0)
                    this.AIMoveState = 0;

                this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed;
                this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed;
                this.body.angle = this.angleNow;
                this.shadow.angle = this.angleNow;
            }


        }
        else {
            if (this.angleNow != null) {
                this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed;
                this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed;
                this.body.angle = this.angleNow;
                this.shadow.angle = this.angleNow;
            }


        }
        var _anglePao = this.getAngle(this.otherTank.position, this.node.position);
        this.pao.angle = _anglePao;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (this.isDown == false && window.isAI) {
            this.AIMoveState = 1;
            this.angleNow = this.random(0, 360);
            this.AIMoveStateDuration = this.random(10, 20) * 0.1;
        }
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
