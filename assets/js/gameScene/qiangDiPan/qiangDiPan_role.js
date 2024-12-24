
cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        kuaiParent: cc.Node,
        propMng: cc.Node,
    },

    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.playAct("待机");



    },

    start() {
        this.speed = 3.5;
        this.moveRate = 1;
        this.angleNow = null;
        this.moveing = false;

        this.biggerDuration = 0;
        if (this.isDown == false && window.isAI) {
            this.arr = this.kuaiParent.children;
            this.num = this.arr.length;
            this.AIFunc = () => {
                var _targetPos = cc.v2(0, 0);
                if (this.propMng.children.length > 0) {//有道具
                    _targetPos = this.propMng.children[0].position;
                }
                else {//么有道具
                    var _dis = 1000;
                    for (var i = 0; i < this.num; i++) {
                        var _kuai = this.arr[i];
                        if (_kuai.color.g != 172) {
                            var _disTemp = this.getDistance(this.node.position, _kuai.position);
                            if (_disTemp < _dis) {
                                _dis = _disTemp;
                                _targetPos = _kuai.position;
                            }
                        }
                    }
                }


                this.angleNow = this.getAngle(_targetPos, this.node.position);
            }

            this.schedule(this.AIFunc, 0.3, 100000, 3);
            this.angleNow = this.random(0, 360);
        }
    },

    playAct(_name) {
        if (_name == "待机") {
            this.anim.play("zq_js_daiJi");
            this.moveing = false;
        }
        else if (_name == "移动") {

            this.anim.play("zq_js_yiDong");
            this.moveing = true;
        }
    },
    startMove() {
        this.playAct("移动");
    },
    stopMove() {
        this.playAct("待机");
    },
    update(dt) {
        if (!window.qiangDiPan.beginNow) {
            if (this.moveing)
                this.playAct("待机");
            return
        }


        if (this.angleNow != null) {
            this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed * this.moveRate;
            this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed * this.moveRate;
            this.node.angle = this.angleNow;
            if (this.moveing == false)
                this.playAct("移动");

        }
        if (this.node.x > 300)
            this.node.x = 300;
        else if (this.node.x < -300)
            this.node.x = -300;
        if (this.node.y > 422)
            this.node.y = 422;
        else if (this.node.y < -422)
            this.node.y = -422;
        if (this.biggerDuration > 0) {
            this.biggerDuration -= dt;
            if (this.biggerDuration <= 0)
                this.node.scale = 0.5;
        }
        if (this.fasterDuration > 0) {
            this.fasterDuration -= dt;
            if (this.fasterDuration <= 0)
                this.moveRate = 1;
        }
    },
    onCollisionEnter: function (other, self) {
        if (!window.qiangDiPan.beginNow) return
        if (other.tag == 0) {//碰到色块
            if (this.isDown) {
                if (other.node.color.g != 87) {
                    cc.director.emit("分数增加", true);
                }
                if (other.node.color.g == 172) {
                    cc.director.emit("分数减少", false);
                }


                other.node.color = new cc.Color(255, 87, 87);
            }
            else {

                if (other.node.color.g != 172) {
                    cc.director.emit("分数增加", false);
                }
                if (other.node.color.g == 87) {
                    cc.director.emit("分数减少", true);
                }
                other.node.color = new cc.Color(1, 172, 247);
            }
        }
        if (other.tag == 666)//放大
        {
            this.node.scale = 1;
            this.biggerDuration = 5;
            other.node.destroy();
        }
        else if (other.tag == 667)//加速
        {
            this.moveRate = 2;
            this.fasterDuration = 5;
            other.node.destroy();
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
