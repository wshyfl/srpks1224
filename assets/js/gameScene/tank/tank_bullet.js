

cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,

    },

    onLoad() {


    },

    reset(_angle) {
        AD.audioMng.playSfx("开炮");
        this.speedN = 10;
        this.node.angle = _angle;
        this.vx = -Math.sin(this.angleToRadian(_angle)) * this.speedN;
        this.vy = Math.cos(this.angleToRadian(_angle)) * this.speedN;
        this.couldBeHurt = false;
        this.scheduleOnce(() => {
            this.couldBeHurt = true;
        }, 0.1)
    },
    start() {
        this.hp = 3;
        this.yuanX = this.node.x;
        this.yuanY = this.node.y;
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {


        if (otherCollider.tag == 881 || otherCollider.tag == 882) {
            if ((otherCollider.tag == 881 && !this.isDown) || (otherCollider.tag == 882 && this.isDown)) {
                this.node.destroy();
                otherCollider.node.getComponent("tank_tank").beHurt();
            }

        }
        else {

            if (this.couldBeHurt)
                this.hp--;
            if (this.hp == 0)
                this.node.destroy();

            if (Math.abs(this.node.y - otherCollider.node.y) <= otherCollider.node.height / 2)
                this.collisionDiNow = false;
            else
                this.collisionDiNow = true;

            if (this.collisionDiNow)//上下
             var   _angle = 180 - this.node.angle;
            else//左右
             var   _angle = - this.node.angle;

            this.scheduleOnce(() => {
                this.node.angle = _angle;
            }, 0.01)
            this.vx = -Math.sin(this.angleToRadian(_angle)) * this.speedN;
            this.vy = Math.cos(this.angleToRadian(_angle)) * this.speedN;
        }
    },
    onDestroy() {
        cc.director.emit("生成爆炸特效", this.node.position)
        AD.audioMng.playSfx("炮弹爆炸");
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
    update(dt) {
        // this.node.angle = Math.atan();


        this.node.x += this.vx;
        this.node.y += this.vy;
    },
});
