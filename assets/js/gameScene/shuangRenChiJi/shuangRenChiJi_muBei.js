

cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Sprite,
    },

    onLoad() {
        
    },

    reset(_isDown) {
        window.chiJi.roleNum--;
        
        if (window.chiJi.roleNum <= 0) {

            cc.director.emit("合作模式结束", "双人吃鸡");
        }
        this.beSaving = false;
        this.isDown = _isDown;
        this.bar.fillRange = 0;
        this.bar.node.parent.active = false;
        this.coudBeSava = false;
        this.scheduleOnce(() => {
            this.bar.node.parent.active = true;
            this.coudBeSava = true;
            cc.find("tips", this.node).active = true;
            cc.tween(cc.find("tips", this.node))
                .repeatForever(
                    cc.tween()
                        .to(0.3, { angle: -6 }, { easing: "sineInOut" })
                        .to(0.3, { angle: 0 }, { easing: "sineInOut" })
                )
                .start();
        }, 0.12);
        this.timeZong = 5;
        this.speed = 1 / this.timeZong;
    },

    update(dt) {
        if (this.beSaving && this.coudBeSava) {
            this.bar.fillRange += this.speed * dt;
            if (this.bar.fillRange >= 1) {
                this.node.destroy();
                cc.director.emit("角色复活", this.isDown);
            }
        }
        else {
            if (this.bar.fillRange > 0)
                this.bar.fillRange -= this.speed * dt * 2;

        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 100) {//碰到玩家

            this.beSaving = true;

        }
    },
    onEndContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 100) {//碰到玩家

            this.beSaving = false;

        }
    },
    dieFunc() {
        this.node.destroy();
        cc.director.emit("特效", this.node.position);
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
