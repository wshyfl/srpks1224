

cc.Class({
    extends: cc.Component,

    properties: {
        isRed: true,
        guang: cc.Node,
    },
    onLoad() {
        this.anim = this.node.getComponent(sp.Skeleton);
        this.playAct("待机开始");
    },
    start() {
        this.speed = 1;

        this.rate = 3;
        this.zhongDianY = 360;
        this.distanceY = this.zhongDianY - this.node.y;
        this.moveNow = false;
        this.isDie = false;
        cc.director.on("移动", (_isRed) => {
            if (!window.muTouRen.beginNow) return;
            if (_isRed != this.isRed) return;
            this.moveNow = true;
            this.playAct("移动");
        }, this)
        cc.director.on("停止", (_isRed) => {
            if (!window.muTouRen.beginNow) return;
            if (_isRed != this.isRed) return;
            this.moveNow = false;
            this.playAct("待机");
        }, this)

        this.wuZouRate = 50;//误动概率
        this.moveDuration = this.random(35, 50) * 0.1;//AI移动的时间
        this.delayDuration = this.random(2, 6) * 0.1;//AI延迟移动的时间
        this.moveRate = this.random(1, 100);

        cc.director.on("闭眼了", () => {
            this.moveDuration = this.random(35, 50) * 0.1;//AI移动的时间
            this.delayDuration = this.random(2, 6) * 0.1;//AI延迟移动的时间
            this.moveRate = this.random(1, 100);
        }, this);
        cc.director.emit("实时分数", this.isRed, parseInt((this.distanceY-this.zhongDianY + this.node.y)/this.distanceY*100));
        this.schedule(() => {
            if (window.muTouRen.beginNow)
            cc.director.emit("实时分数", this.isRed, parseInt((this.distanceY-this.zhongDianY + this.node.y)/this.distanceY*100));
        }, 0.1)
    },

    playAct(_name) {
        switch (_name) {
            case "待机":
                this.anim.setAnimation(0, "daiji" + this.random(1, 4), false);
                break;
            case "移动":
                if (this.anim.animation != "yidong") {
                    this.anim.setAnimation(0, "yidong", true);
                }
                break;
            case "待机开始":
                if (this.anim.animation != "kaishi") {
                    this.anim.setAnimation(0, "kaishi", true);
                }
                break;
            case "死亡":
                if (this.anim.animation != "shuaidao") {
                    this.anim.setAnimation(0, "shuaidao", false);

                    this.node.color = new cc.Color(180, 10, 0);
                    this.scheduleOnce(() => {
                        this.node.color = new cc.Color(255, 255, 255);
                    }, 0.1);
                    cc.tween(this.node)
                        .to(0.05, { scale: 1.1 })
                        .to(0.05, { scale: 1.0 })
                        .start();

                    this.schedule(() => {
                        this.node.color = new cc.Color(180, 10, 0);
                        this.scheduleOnce(() => {
                            this.node.color = new cc.Color(255, 255, 255);
                        }, 0.1);
                        cc.tween(this.node)
                            .to(0.05, { scale: 1.1 })
                            .to(0.05, { scale: 1.0 })
                            .start();
                    }, 0.2, 2)

                }
                break;
        }
    },
    update(dt) {
        if (!window.muTouRen.beginNow) {
            if (!this.isDie) {
                this.playAct("待机开始");
            }
            else
                this.playAct("死亡");
            return;
        }
        if (this.moveNow) {
            this.moveFunc(dt);
        }
        if (window.isAI && !this.isRed) {
            if (!this.guang.active) {
                if (this.delayDuration > 0)
                    this.delayDuration -= dt;
                else {
                    this.moveDuration -= dt;
                    if (this.moveDuration > 0) {
                        this.moveFunc();
                        if (this.node.y < this.zhongDianY)
                            this.playAct("移动");
                    }
                    else {
                        if (this.anim.animation == "yidong") {
                            if (this.node.y < this.zhongDianY)
                                this.playAct("待机");

                        }
                    }
                }

            } else {
                if (this.moveDuration > 0 && this.moveRate < this.wuZouRate) {
                    this.moveFunc();
                    if (this.node.y < this.zhongDianY)
                        this.playAct("移动");
                }
                else {
                    if (this.anim.animation == "yidong") {
                        if (this.node.y < this.zhongDianY)
                            this.playAct("待机");

                    }
                }
            }
        }
    },
    moveFunc(dt) {
        this.node.y += this.speed * this.node.scale;
        this.node.scale = 0.7 + (this.zhongDianY - this.node.y) / this.distanceY * 0.3;
        if (this.isRed) {
            this.node.x += 0.4 * this.speed / this.rate;
        }
        else
            this.node.x -= 0.4 * this.speed / this.rate;
        if (this.guang.active) {
            this.scheduleOnce(() => {
                cc.director.emit("游戏结束", !this.isRed);
            }, 1.5)
            window.muTouRen.beginNow = false;
            this.isDie = true;
        }
        if (this.node.y > this.zhongDianY) {
            this.scheduleOnce(() => {
                cc.director.emit("游戏结束", this.isRed);
            }, 0.3)
            window.muTouRen.beginNow = false;
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
