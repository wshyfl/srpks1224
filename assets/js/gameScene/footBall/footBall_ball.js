

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 66://碰到球门-得分
                cc.director.emit("进球了", otherCollider.node.y < 0);
                this.scheduleOnce(function(){

                    this.node.active = false;
                },1)
                break;
            case 666://碰到球门-得分
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                break;
            case 88://碰到球员
                var _angle = this.getRadian(this.node.position, otherCollider.node.position);
                this.vx = -Math.sin(_angle) * 700;
                this.vy = Math.cos(_angle) * 700;
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.vx, this.vy);
                this.node.getComponent(cc.RigidBody).angularVelocity = this.random(500, 1000);
                this.scheduleOnce(() => {

                    otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                }, 0.1)
                break;
        }
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
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
