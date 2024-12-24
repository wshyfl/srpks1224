
cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        isGoalkeeper: false,
        index: 0,
    },

    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.playAct("待机");


        this.yuanPos = this.node.position;
        this.AISmartRate = 0.4;
    },

    start() {
        this.speed = 3.5;
        this.angleNow = null;
        this.schedule(() => {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.node.getComponent(cc.RigidBody).angularVelocity = 0;
        }, 0.3)
        cc.director.on("进球了", () => {
            this.stopMove();
            this.AITimmer = this.random(3,6)*0.1;
        }, this)
        this.AITimmer = this.random(3,6)*0.1;
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
        if (!window.footBall.beginNow) return
        if (this.isDown == false && window.isAI) {
            if(this.AITimmer>0){
                this.AITimmer-=dt;
                return;
            }
            if (this.isGoalkeeper)
                this.angleNow = this.getAngle(cc.v2(window.footBall.ball.x, window.footBall.ball.y + 50), this.node.position);
            else {
                if (window.footBall.ball.y > this.node.y) {
                    var _tempX = 80;
                    if (window.footBall.ball.x > this.node.x)
                        _tempX = -80;

                    this.angleNow = this.getAngle(cc.v2(window.footBall.ball.x + _tempX, window.footBall.ball.y + 100), this.node.position);
                }
                else {
                    var _tempX = 30;
                    if (window.footBall.ball.x < 0)
                        _tempX = -30;
                    if (window.footBall.ball.y > -450 && window.footBall.ball.y < 450) {

                        this.angleNow = this.getAngle(cc.v2(window.footBall.ball.x + _tempX, window.footBall.ball.y + 30), this.node.position);
                    }
                    else {
                        if (this.getDistance(this.node.position, this.yuanPos) > 20) {
                            this.angleNow = this.getAngle(this.yuanPos, cc.v2(this.node.x, this.node.y));
                        }
                        else {
                            this.angleNow = null
                        }
                    }
                }

            }
            if (isNaN(this.angleNow)) return;
            if (this.angleNow != null) {
                if (this.moveing == false)
                    this.playAct("移动");
            }
            else {
                if (this.moveing)
                    this.playAct("待机");
            }
        }
        if (this.angleNow != null) {
            this.node.x += -Math.sin(this.angleToRadian(this.angleNow)) * this.speed;
            this.node.y += Math.cos(this.angleToRadian(this.angleNow)) * this.speed;
            this.node.angle = this.angleNow;

        }
        if (this.isGoalkeeper) {
            if (this.node.x > 100)
                this.node.x = 100;
            else if (this.node.x < -100)
                this.node.x = -100;

            if (this.isDown) {
                if (this.node.y > -430)
                    this.node.y = -430;
                else if (this.node.y < -510)
                    this.node.y = -510;
            }
            else {

                if (this.node.y < 430)
                    this.node.y = 430;
                else if (this.node.y > 510)
                    this.node.y = 510;
            }
        }

        if (this.node.y < -510)
            this.node.y = -510;
        else if (this.node.y > 510)
            this.node.y = 510;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

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
