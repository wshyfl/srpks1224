

cc.Class({
    extends: cc.Component,

    properties: {
        carIndex: 0,
        lunPan: cc.Node,
        shuaZi: cc.Node,
        draw: cc.Graphics,
        heiBanColor:cc.Color,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        
        window.gameOver = false;
        this.carSpeed = 0;
        this.carSpeedMax = 8;
        this.angleSpeed = 0;
        this.angleSpeedMax = 4;
        
        this.draw.lineWidth = 125;
        this.draw.strokeColor = this.heiBanColor;
        
        this.radiusMax = 30;//轮盘最大半径
        this.point = this.lunPan.children[1];
        this.pan = this.lunPan.children[0];
        this.isAI = (window.isAI && this.carIndex == 1);

        if (!this.isAI) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        else {

        }


        

        this.lunPan.active = false;
    },
    gameOverFunc(_downWin) {
        if (window.gameOver) return;
        window.gameOver = true;

        this.carSpeed = 0;
        cc.director.emit("游戏结束", _downWin);
    },
    onTouchStart(event) {
        if (window.gameOver) return;
        this.lunPan.active = true;
        this.point.position = cc.v2(0, 0);
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        this.lunPan.position = move_pos;

        this.angleSpeed = 0;
        this.draw.moveTo(this.shuaZi.x, this.shuaZi.y)
    },
    onTouchMove(event) {
        if (window.gameOver) return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);

        var _radius = this.getDistance(this.lunPan.position, move_pos);
        if (_radius > this.radiusMax)
            _radius = this.radiusMax;
        var _angle = this.getAngle(this.lunPan.position, move_pos);
        this.point.x = Math.sin(this.angleToRadian(_angle)) * _radius;
        this.point.y = -Math.cos(this.angleToRadian(_angle)) * _radius;

        this.targetAngle = _angle + 180;

        this.carSpeed = this.carSpeedMax;

        if (this.targetAngle > 360)
            this.targetAngle -= 360;
        else if (this.targetAngle < 0)
            this.targetAngle += 360;

    },
    onTouchEnd(event) {
        this.carSpeed = 0;
        if (window.gameOver) return;
       

        this.lunPan.active = false;
        this.point.position = cc.v2(0, 0);
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
    update(dt) {




        if (this.carSpeed > 0) {
            if(this.angleSpeed<this.angleSpeedMax){
                this.angleSpeed+=3*dt;
            }
            if (this.targetAngle != null) {
                if (this.shuaZi.angle < this.targetAngle - this.angleSpeed*1.5) {
                    if (Math.abs(this.shuaZi.angle - this.targetAngle) > 180) {
                        this.shuaZi.angle += 360;
                    }
                    this.shuaZi.angle += this.angleSpeed;
                }
                else if (this.shuaZi.angle > this.targetAngle + this.angleSpeed*1.5) {
                    if (Math.abs(this.shuaZi.angle - this.targetAngle) > 180) {
                        this.shuaZi.angle -= 360;
                    }
                    this.shuaZi.angle -= this.angleSpeed;
                }
            }


            var _vx = -Math.sin(this.angleToRadian(this.shuaZi.angle)) * this.carSpeed;
            var _vy = Math.cos(this.angleToRadian(this.shuaZi.angle)) * this.carSpeed;

            this.pan.angle = this.targetAngle;
            this.shuaZi.x += _vx;
            this.shuaZi.y += _vy;

            
            this.draw.lineTo(this.shuaZi.x, this.shuaZi.y)
            this.draw.stroke();
            this.draw.moveTo(this.shuaZi.x, this.shuaZi.y);
            this.draw.stroke();
            this.draw.moveTo(this.shuaZi.x, this.shuaZi.y);
        }

    },

});
