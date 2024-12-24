
cc.Class({
    extends: cc.Component,

    properties: {
        touchNode: cc.Node,
        dangBan: cc.Node,
    },
    onLoad() {
        window.gameOver = false;
        this.initCollision();
        this.isAI = false;
        if (this.touchNode.y > 0) {
            if (!window.isAI)
                this.initTouch();
            else
                this.isAI = true;
        }
        else
            this.initTouch();
        this.initOther();
        this.dangBanPos = this.dangBan.position;
        this.scoreNum = 0;
        this.couldMoveUp = true;
        this.ball = cc.find("ball", this.node);
    },

    start() {
        cc.director.on("得分", (_roleType) => {
            if (this.touchNode.y > 0) {
                this.addScore(_roleType);
            }
        }, this)

        cc.director.on("重置", () => {
            this.reset();
        }, this)
        if (this.isAI) {
            this.cleverNum = 10;//反应用时(越小 越厉害)
        }
        this.beginNow = false;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            if (this.touchNode.y > 0) 
            cc.director.emit("重置倒计时");
        }, 0.1);
        
    },

    //游戏开始
    beginGame() {
        this.beginNow = true;

     
    },
    addScore(_roleType) {
        this.ball.active = false;
        if (_roleType == 0) {//底部 得分
            
            this.node.getComponents("daZhuanKuai")[0].scoreNum++;
            cc.director.emit("分数增加", true);
        }
        else {

            
            this.node.getComponents("daZhuanKuai")[1].scoreNum++;
            cc.director.emit("分数增加", false);
        }


        if (this.node.getComponents("daZhuanKuai")[0].scoreNum >= 2) {
            this.gameOverFunc(true);//下方胜利
        }
        else if (this.node.getComponents("daZhuanKuai")[1].scoreNum >= 2) {
            this.gameOverFunc(false);//上方胜利
        }
        else {
            this.scheduleOnce(() => {
                cc.director.emit("重置");
            }, 1);
        }
    },
    //_downWin==>是下方胜利吗？
    gameOverFunc(_downWin) {
        if (window.gameOver) return;
        window.gameOver = true;
        cc.director.emit("游戏结束", _downWin);
    },
    reset() {
        this.couldMoveUp = true;
        if (this.touchNode.y > 0)
            this.dangBan.position = cc.v2(0, 260);
        else
            this.dangBan.position = cc.v2(3, -260);
        this.ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
        this.targetPos = null;
        if (this.touchNode.y > 0) {
            this.ball.active = true;
            if (this.random(0, 1) == 1) {

                this.ball.position = cc.v2(0, 120);
                if (this.isAI) {
                    cc.tween(this.dangBan)
                        .by(0.2, { y: -100 })
                        .by(0.2, { y: 100 })
                        .start();
                }
            }
            else
                this.ball.position = cc.v2(0, -120);
        }

    },
    initTouch() {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    },
    onTouchStart(event) {
        if(! this.beginNow)return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.convertToNodeSpaceAR(_touchPoint);
        this.targetPos = move_pos;
        this.underFinger = false;
        this.moveSpeed = 0;
    },
    onTouchMove(event) {
        if(! this.beginNow)return;
        var _touchPoint = event.getLocation();
        let move_pos = this.node.convertToNodeSpaceAR(_touchPoint);

        if (this.dangBan.y < 0) {
            if (move_pos.y > -50)
                return;
        }
        else if (this.dangBan.y > 0) {
            if (move_pos.y < 50)
                return;
        }

        this.targetPos = move_pos;
        if (this.underFinger) {
            this.dangBan.x += event.getDelta().x;
            this.dangBan.y += event.getDelta().y;
        }
        if (this.dangBan.x > this.touchNode.width / 2 - this.dangBan.width / 2)
            this.dangBan.x = this.touchNode.width / 2 - this.dangBan.width / 2
        else if (this.dangBan.x < -this.touchNode.width / 2 + this.dangBan.width / 2)
            this.dangBan.x = -this.touchNode.width / 2 + this.dangBan.width / 2

        this.moveSpeed = Math.sqrt(Math.pow(event.getDelta().x, 2) + Math.pow(event.getDelta().y, 2));
    },
    onTouchEnd(event) {
        if(! this.beginNow)return;
        this.moveSpeed = 0;
        this.underFinger = false;
    },
    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },

    initOther() {
        this.targetPos = null;
        this.speed = 40;
        this.vx = 0;
        this.vy = 0;
        this.underFinger = false;
        this.moveSpeed = 0;

    },
    update(dt) {
        if (this.isAI && this.ball.active) {
            // if (this.ball.getComponent(cc.RigidBody).linearVelocity.y < 0) {
            //     // else 
            //     if (this.dangBan.y < this.dangBanPos.y - 15) {
            //         this.dangBan.y += 15;
            //     }
            // }
            //纵向追踪
            if (this.dangBan.y > this.ball.y) {//球在挡板下方==> 可以往前推
                if (this.ball.y > 0 && this.couldMoveUp) {
                    this.couldMoveUp = false;
                    var _distanceY = Math.abs(this.dangBan.y - this.ball.y);
                    if (_distanceY > 100)
                        _distanceY = 100;
                    cc.tween(this.dangBan)
                        .by(0.2, { y: -_distanceY })
                        .by(0.2, { y: _distanceY })
                        .delay(0.5)
                        .call(() => {
                            this.couldMoveUp = true;
                        })
                        .start();
                }
                if (!this.couldMoveUp) {
                    if (this.dangBan.y > this.dangBanPos.y+100) {
                        this.dangBan.y -= 15;
                    }

                }
            }
            else {
                if (this.dangBan.y < 260)
                    this.dangBan.y += 15;
                else if (this.couldMoveUp) {
                    var _distanceY = Math.abs(this.dangBan.y - this.ball.y)
                    cc.tween(this.dangBan)
                        .by(0.2, { y: _distanceY })
                        .by(0.2, { y: -_distanceY })
                        .delay(0.5)
                        .call(() => {
                            this.couldMoveUp = true;
                        })
                        .start();
                }
            }
            //横向追踪
            {
                var _vx = Math.abs(this.dangBan.x - this.ball.x) / this.cleverNum;
                if (this.dangBan.x < this.ball.x - _vx)
                    this.dangBan.x += _vx;
                else if (this.dangBan.x > this.ball.x + _vx)
                    this.dangBan.x -= _vx;
                // this.dangBan.y-=10;

                this.moveSpeed =100;

                // this.dangBan.x = this.ball.x;
            }
        }
        if (this.targetPos) {
            var _distance = this.getDistance(this.targetPos, this.dangBan.position);
            if (_distance > this.speed) {
                var _radian = this.getRadian(this.dangBan.position, this.targetPos);
                this.vx = Math.sin(_radian) * this.speed;
                this.vy = -Math.cos(_radian) * this.speed;
                this.dangBan.x += this.vx;
                this.dangBan.y += this.vy;
            }
            else {
                this.underFinger = true;
                this.dangBan.position = this.targetPos;
            }
        }
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
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
