

cc.Class({
    extends: cc.Component,

    properties: {
        carIndex: 0,
        lunPan: cc.Node,
        car: cc.Node,
        checkers: [cc.Node],
        AIPointParent: cc.Node,
        cheHenPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.beginNow = false;
      
    },
    //游戏开始
    beginGame() {
        this.beginNow = true;
        if(this.carIndex == 1)
        AD.audioMng.playSfx("发动机");
    },
    onDisable(){
        if(this.carIndex == 1)
        AD.audioMng.stopSfx("发动机");
    },
    start() {
        window.gameOver = false;
        this.circleNum = 3;//总圈数
        this.angleSpeed = 3;//转向速度
        this.carSpeed = 0;//移动速度
        this.carSpeedMax = 6;//移动速度
        this.radiusMax = 60;//轮盘最大半径
        this.point = this.lunPan.children[1];
        this.pan = this.lunPan.children[0];
        this.targetAngle = 0;
        this.isAI = (window.isAI && this.carIndex == 1);
        if(this.isAI)
        this.carSpeedMax = 6*this.random(90,98)*0.01;//移动速度
        this.cheHen = null;

        if (!this.isAI) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        else {
            this.carSpeed *= 0.9;//AI 速度较慢
            this.AIPoints = this.AIPointParent.children;
            for (var i = 0; i < this.AIPoints.length; i++) {
                this.AIPoints[i].active = (i == 0);
                this.AIPoints[i].getComponent("saiChe_AIPos").reset(i);
            }
            this.posIndex = 0;
            this.targetAIPos = this.AIPoints[this.posIndex].position;
            cc.director.on("下一个坐标点", () => {

                if (this.posIndex + 1 <= this.AIPoints.length - 1)
                    this.posIndex++;
                else
                    this.posIndex = 0;
                this.AIPoints[this.posIndex].active = true;

                this.targetAIPos = this.AIPoints[this.posIndex].position;

            }, this);
        }
        this.checkerNum = 0;
        this.lastIndex = -1;
        cc.director.on("通过检查点", (_carIndex, _checkerIndex) => {
            if (_carIndex == this.carIndex) {
                this.checkerNum++;
                if (this.checkerNum >= this.checkers.length * this.circleNum) {//通过了所有检查点
                    this.gameOverFunc((this.carIndex == 0));
                }
                if (_checkerIndex + 1 <= this.checkers.length - 1)
                    this.checkers[_checkerIndex + 1].active = true;
                else {
                    this.checkers[0].active = true;
                    cc.director.emit("分数增加", (this.carIndex == 0));
                }
            }
        }, this)
        for (var i = 0; i < this.checkers.length; i++) {
            this.checkers[i].active = (i == 0);
            this.checkers[i].getComponent("saiChe_checker").reset(this.carIndex, i);
        }
        // this.lunPan.active = false;
    },
    gameOverFunc(_downWin) {
        if (window.gameOver) return;
        window.gameOver = true;
        if(this.carIndex == 1)
        AD.audioMng.stopSfx("发动机");
        cc.director.emit("游戏结束", _downWin);
    },
    onTouchStart(event) {
        if (window.gameOver) return;
        this.lunPan.active = true;
        this.point.position = cc.v2(0, 0);
        var _touchPoint = event.getLocation();
        let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        this.lunPan.position = move_pos;

        // var _angle = this.getRadian(move_pos, this.lunPan.position);
        // this.point.x = Math.sin(_angle) * 60;
        // this.point.y = -Math.cos(_angle) * 60;
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


    },
    onTouchEnd(event) {
        if (window.gameOver) return;
        // this.lunPan.active = false;
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
        if(!this.beginNow)return;
        if (this.checkerNum >= this.checkers.length * this.circleNum || window.gameOver) {//通过了所有检查点
            if (this.carSpeed > 0)
                this.carSpeed -= 10 * dt;
            else
                this.carSpeed = 0;
            if (this.lunPan.active)
                this.lunPan.active = false;
        }
        else {
            if (this.carSpeed < this.carSpeedMax)
            this.carSpeed += 10 * dt;
        }
        if (this.isAI) {

            this.targetAngle = this.getAngle(this.targetAIPos, this.car.position);
        }
        if (this.targetAngle > 360)
            this.targetAngle -= 360;
        else if (this.targetAngle < 0)
            this.targetAngle += 360;


        if (this.targetAngle != null) {
            if (this.car.angle < this.targetAngle - this.angleSpeed) {
                if (Math.abs(this.car.angle - this.targetAngle) > 180) {
                    this.car.angle += 360;
                }
                this.car.angle += this.angleSpeed;
            }
            else if (this.car.angle > this.targetAngle + this.angleSpeed) {
                if (Math.abs(this.car.angle - this.targetAngle) > 180) {
                    this.car.angle -= 360;
                }
                this.car.angle -= this.angleSpeed;
            }
        }

        if (Math.abs(this.car.angle - this.targetAngle) > 10) {
            if (this.cheHen == null) {
                this.createCheHen();
            }
        }
        else
            this.cheHen = null;

        var _vx = -Math.sin(this.angleToRadian(this.car.angle)) * this.carSpeed;
        var _vy = Math.cos(this.angleToRadian(this.car.angle)) * this.carSpeed;

        this.pan.angle = this.targetAngle;
        this.car.x += _vx;
        this.car.y += _vy;
        if (this.cheHen != null) {

            this.cheHen.position = this.car.position;
            this.cheHen.angle = this.car.angle;
        }
    },
    createCheHen() {
        
        AD.audioMng.playSfx("漂移");
        var _cheHen = cc.instantiate(this.cheHenPrefab);
        _cheHen.parent = cc.find("carHenParent", this.node.parent);
        this.cheHen = _cheHen;
    },
});
