

cc.Class({
    extends: cc.Component,

    properties: {

    },
    // onLoad () {},

    start() {
        if (this.node.y < 0)
            this.speed = -3;
        else
            this.speed = 3;
        var _angle = this.random(0, 360);
        var _x = -Math.sin(this.angleToRadian(_angle)) * 60;
        var _y = Math.cos(this.angleToRadian(_angle)) * 60;
        this.node.children[1].position = cc.v2(_x, _y);


       var _x2 = -Math.sin(this.angleToRadian(_angle + 180)) * 60;
       var _y2 = Math.cos(this.angleToRadian(_angle + 180)) * 60;
        this.node.children[2].position = cc.v2(_x2, _y2);

        
        // _x3 = -Math.sin(this.angleToRadian(_angle + 90)) * 60;
        // _y3 = Math.cos(this.angleToRadian(_angle + 90)) * 60;
        // this.node.children[3].position = cc.v2(_x3, _y3);

        
        // _x4 = -Math.sin(this.angleToRadian(_angle + 270)) * 60;
        // _y4 = Math.cos(this.angleToRadian(_angle + 270)) * 60;
        // this.node.children[4].position = cc.v2(_x4, _y4);

        this.node.children[0].position = cc.v2(0, 0);
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

    update(dt) {
        this.node.x += this.speed;
        if (this.node.y < 0) {
            if (this.node.x < -360 - 120)
                this.node.destroy();
        }
        else {
            if (this.node.x > 360 + 120)
                this.node.destroy();
        }
    },
});
