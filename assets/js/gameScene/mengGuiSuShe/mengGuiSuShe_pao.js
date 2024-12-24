

cc.Class({
    extends: cc.Component,

    properties: {
        pao: cc.Node,
        sprPaoArr: [cc.SpriteFrame],
        sprDiArr: [cc.SpriteFrame],
    },

    onLoad() {

    },

    start() {
        this.reset();
        cc.director.on("女鬼攻击", (_node, _hurtNum) => {
            if (_node == this.node) {
                window.mengGuiSuShe.createEffect("女鬼抓痕", this.node.parent.position)
                this.node.destroy();
                this.node.parent.children[0].scale = 1;
            }
        }, this)
    },
    reset() {

        window.mengGuiSuShe.createEffect("烟雾", this.node.parent.position)
        this.index = window.mengGuiSuShe.paoIndex;
        window.mengGuiSuShe.paoIndex++;
        this.isDown = (this.node.parent.y < 0);
        this.tips_upgrade = cc.find("tips_upgrade", this.node);
        this.tips_upgrade.active = false;

        this.btDuration = 1;//攻速
        this.btDurationTemp = 0;

        this.doorLevel = 0;//炮的等级
        this.resetData();
        cc.director.on("炮移除了", (_isDown, _index) => {
            if (_isDown != this.isDown || this.index != _index) return;

            this.node.destroy();
            this.node.parent.children[0].scale = 1;
        }, this);
        cc.director.on("炮升级了", (_isDown, _index) => {
            if (_isDown != this.isDown || this.index != _index) return;
            if (this.doorLevel < 3) {
                window.mengGuiSuShe.createEffect("烟雾", this.node.parent.position)
                this.doorLevel++;
                this.resetData();
                cc.find("door", this.node).getComponent(cc.Sprite).spriteFrame = this.sprPaoArr[this.doorLevel];
                cc.find("di", this.node).getComponent(cc.Sprite).spriteFrame = this.sprDiArr[this.doorLevel];
            }
            if (this.doorLevel < 3)
                this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.paoData.castNum[this.doorLevel + 1])
            else
                this.tips_upgrade.active = false;
        }, this);
        this.node.on("touchstart", () => {

            if (this.doorLevel < 3) {
                cc.director.emit("升级炮弹窗", this);
            }
        }, this);

        this.schedule(() => {
            if (this.doorLevel < 3)
                this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.paoData.castNum[this.doorLevel + 1])
            else
                this.tips_upgrade.active = false;
        }, 1)

        this.frame = 0;
    },

    resetData() {
        this.hurtNum = window.mengGuiSuShe.data.paoData.hurtNum[this.doorLevel];
        this.hurtDistance = window.mengGuiSuShe.data.paoData.hurtDistance[this.doorLevel] * 1000;
    },
    update(dt) {

        var _parent = window.mengGuiSuShe.nvGuiParent;
        var _targetNpc = null;
        this.frame++;
        if (this.frame % 4 == 0)
            for (var i = 0; i < _parent.children.length; i++) {
                var _diamondTemp = _parent.children[i];
                if (window.isHeZuo) {
                    var _disTemp = this.getDistance(cc.v2(_diamondTemp.x, _diamondTemp.y + 25), this.node.parent.position);

                    if (_disTemp < this.hurtDistance) {
                        _targetNpc = _diamondTemp;
                        break;
                    }
                }
                else if (this.isDown == _diamondTemp.getComponent("mengGuiSuShe_nvGui").isDown) {
                    var _disTemp = this.getDistance(_diamondTemp.position, this.node.parent.position);

                    if (_disTemp < this.hurtDistance) {
                        _targetNpc = _diamondTemp;
                        break;
                    }
                }

            }
        this.btDurationTemp += dt;
        if (_targetNpc != null) {
            if (_targetNpc.angle == 0)
                var _angle = this.getAngle(cc.v2(_targetNpc.x, _targetNpc.y + 60), this.node.parent.position);
            else
                var _angle = this.getAngle(cc.v2(_targetNpc.x, _targetNpc.y - 60), this.node.parent.position);
            this.pao.angle = _angle;

            if (this.btDurationTemp >= this.btDuration) {
                this.createBt();
                this.btDurationTemp = 0;
            }
        }
    },
    createBt() {
        if (!window.mengGuiSuShe.beginNow) {
            return;
        }
        this.vx = this.node.parent.x - Math.sin(this.angleToRadian(this.pao.angle)) * 50;
        this.vy = this.node.parent.y + Math.cos(this.angleToRadian(this.pao.angle)) * 50;
        cc.tween(this.pao)
            .to(0.02, { scaleY: 0.7 })
            .to(0.1, { scaleY: 1 })
            .start();
        window.mengGuiSuShe.createEffect("开火", cc.v2(this.vx, this.vy))
        window.mengGuiSuShe.createBt(cc.v2(this.vx, this.vy), this.pao.angle, this.hurtNum);
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
