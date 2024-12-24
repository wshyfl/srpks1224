

cc.Class({
    extends: cc.Component,

    properties: {
        sprArr: [cc.SpriteFrame],
        sprEffectArr: [cc.SpriteFrame],
    },

    onLoad() {
        this.type = this.random(0, 2);//0加血 1伤害 2射速
        this.node.position = cc.v2(this.random(-300, 300), this.random(-400, 400));
        this.shadow = cc.find("shadow", this.node);
        this.tips = cc.find("sprTips", this.node); this.tips.getComponent(cc.Sprite).spriteFrame = this.sprEffectArr[this.type];
        this.tips.active = false;
        this.spr = cc.find("spr", this.node); this.spr.getComponent(cc.Sprite).spriteFrame = this.sprArr[this.type];
        this.yuanScale = this.node.scaleX;
        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(0.3, { scale: 0.9 * this.yuanScale })
                    .to(0.3, { scale: 1 * this.yuanScale })
            )
            .start();

        this.scheduleOnce(() => {
            cc.tween(this.node)
                .repeatForever(
                    cc.tween()
                        .to(0.2, { opacity: 100 })
                        .to(0.2, { opacity: 255 })
                )
                .start();
        }, 3)
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 5)
    },


    // update(dt) {    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.tag == 100) {//碰到玩家
            if (this.spr.active) {
                this.spr.active = false;
                this.shadow.active = false;
                this.tips.active = true;
                cc.tween(this.tips)
                    .to(0.2, { y: 80 }, { easing: "sineOut" })
                    .delay(0.5)
                    .to(0.2, { y: 110, opacity: 0 }, { easing: "sineOut" })
                    .call(() => {
                        this.node.destroy();
                    })
                    .start();
                AD.audioMng.playSfx("吃鸡吃道具");
                var _down = otherCollider.node.getComponent("shuangRenChiJi_role").isDown;
                switch (this.type) {//0加血 1伤害 2射速
                    case 0:
                        cc.director.emit("获得道具", "加血", _down)
                        break;
                    case 1:
                        cc.director.emit("获得道具", "伤害加倍", _down)
                        break;
                    case 2:
                        cc.director.emit("获得道具", "射速加倍", _down)
                        break;
                }
            }


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
