
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        cc.find("num", this.node).active = false;
        this.ballMngP = this.node.parent.parent.getComponent("ballMng2");


    },

    start() {

    },

    reset(_angle, ...first) {
        this.hadDie = false;
        this.rudias = 0;
        this.rudiasMax = 255;
        this.ballMngP.canCreatTime = 5;
        this.angleNow = _angle;
        this.angleChangeing = false;
        this.objAngle = { _angle: this.angleNow };
        if (first[0]) {
            this.hadDie = true;
            this.objAngle = { _angle: this.angleNow };
            this.angleChangeing = true;
        }
        if (this.node.name == "caiQiu") {
            this.angleDuration = Math.atan(this.node.width / 2 / this.rudiasMax) / (Math.PI / 180);//半角
        }
        else {
            this.angleDuration = Math.atan(this.ballMngP.fruitWidth[this.node.weight] / 2 / this.rudiasMax) / (Math.PI / 180);//半角
        }

        var _x = -Math.sin(this.angleToRadian(this.angleNow)) * this.rudiasMax;
        var _y = Math.cos(this.angleToRadian(this.angleNow)) * this.rudiasMax;

        cc.tween(this.node)
            .to(0.2, { x: _x, y: _y })
            .call(() => {
                if (this.hadDie == false) {
                    this.changeNoCollision();
                }
            })
            .start();
        this.turnDirection = 1000;//1000代表停止运动
        if (this.node.parent.parent.getSiblingIndex() == 2) {
            cc.director.on("新球来了", (_ball, _angleNew, _angleDuration) => {

                if (this.hadDie) {

                    this.scheduleOnce(() => {
                        this.changeCollision(_angleNew, _angleDuration);

                    }, 0.01)
                }

            }, this);
        }
        else {
            cc.director.on("新球来了2", (_ball, _angleNew, _angleDuration) => {

                if (this.hadDie) {

                    this.scheduleOnce(() => {
                        this.changeCollision(_angleNew, _angleDuration);

                    }, 0.01)
                }

            }, this);
        }
        this.panDuan = first[1]
        if (first[0] && first[1]) {
            if (this.node == this.ballMngP.ballFlying) {
                if (this.node.parent.parent.getSiblingIndex() == 2) {
                    cc.director.emit("新球来了", this.node, this.angleNow, this.angleDuration);
                }
                else {
                    cc.director.emit("新球来了2", this.node, this.angleNow, this.angleDuration);
                }
            }

        }
    },
    //插入球--碰到球
    changeCollision(_angleNew, _angleDuration) {

        this.angleChangeing = true;
        this.objAngle = { _angle: this.angleNow };
        this.turnDirection = -999;

        var _index = this.ballMngP.ballFlying.getSiblingIndex();

        this.turnDirection = _angleNew;
        if (this.node.getSiblingIndex() < _index) {
            for (var i = this.node.getSiblingIndex(); i < _index - 1; i++) {
                //发射过来的角度
                this.turnDirection -= (this.node.parent.children[i + 1].getComponent("ball2").angleDuration * 2);
            }
            this.turnDirection -= this.angleDuration;
            this.turnDirection -= this.ballMngP.ballFlying.getComponent("ball2").angleDuration;
        }
        else if (this.node.getSiblingIndex() > _index) {
            for (var i = _index + 1; i < this.node.getSiblingIndex(); i++) {
                this.turnDirection += (this.node.parent.children[i].getComponent("ball2").angleDuration * 2);
            }

            this.turnDirection += this.angleDuration;
            this.turnDirection += this.ballMngP.ballFlying.getComponent("ball2").angleDuration;
        }
        if (this.turnDirection < 180) {
            if (this.angleNow > 180) {
                this.objAngle._angle = this.angleNow - 360;
            }
        }
        else {
            if (this.angleNow < 180) {
                this.objAngle._angle = this.angleNow + 360;
            }
        }

        if (this.turnDirection != -999) {

            var _tempAngle = this.turnDirection - this.objAngle._angle;

            if (_tempAngle > 180) {
                _tempAngle -= 360
            }
            else if (_tempAngle < -180) {
                _tempAngle += 360
            }

            cc.tween(this.objAngle)
                .by(0.1, { _angle: _tempAngle })
                .call(() => {
                    // this.changeReserver(_angleNew,_angleDuration);
                    if (this.objAngle._angle < 0)
                        this.objAngle._angle += 360;
                    else if (this.objAngle._angle > 360)
                        this.objAngle._angle -= 360;
                })
                // .delay(0.2)
                .call(() => {
                    if (this.ballMngP.GameOver) return
                    this.ballMngP.detectionCompound(this.ballMngP.ballFlying.getSiblingIndex());


                })
                .start();
        }

    },
    //转动--没碰到球
    changeNoCollision() {

        this.hadDie = true;
        this.angleChangeing = true;
        this.objAngle = { _angle: this.angleNow };
        this.turnDirection = -999;

        this.node.parent = this.ballMngP.panel0;
        var _ballArr = this.ballMngP.panel0.children;


        //只有一个球在圈上
        if (_ballArr.length == 2) {
            if (Math.abs(this.angleNow - this.node.parent.children[0].getComponent("ball2").angleNow) > 180) {
                if (this.angleNow < this.node.parent.children[0].getComponent("ball2").angleNow) {
                    this.node.setSiblingIndex(1);
                    this.turnDirection = _ballArr[0].getComponent("ball2").angleNow + _ballArr[0].getComponent("ball2").angleDuration + this.angleDuration;
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[0].weight
                    }
                }
                else {//小角度
                    this.node.setSiblingIndex(0);
                    this.turnDirection = _ballArr[1].getComponent("ball2").angleNow - _ballArr[1].getComponent("ball2").angleDuration - this.angleDuration;
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[1].weight
                    }
                }
            }
            else {
                if (this.angleNow > this.node.parent.children[0].getComponent("ball2").angleNow) {
                    this.node.setSiblingIndex(1);
                    this.turnDirection = _ballArr[0].getComponent("ball2").angleNow + _ballArr[0].getComponent("ball2").angleDuration + this.angleDuration;
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[0].weight
                    }
                }
                else {//小角度
                    this.node.setSiblingIndex(0);
                    this.turnDirection = _ballArr[1].getComponent("ball2").angleNow - _ballArr[1].getComponent("ball2").angleDuration - this.angleDuration;
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[1].weight
                    }
                }
            }

            // if (this.angleNow > this.node.parent.children[0].getComponent("ball2").angleNow) {
            //     this.node.setSiblingIndex(1);
            //     this.turnDirection = _ballArr[0].getComponent("ball2").angleNow + _ballArr[0].getComponent("ball2").angleDuration + this.angleDuration;
            //     if (this.node.weight == -1) {
            //         this.node.weight = _ballArr[0].weight
            //     }
            // }
            // else {
            //     this.node.setSiblingIndex(0);
            //     this.turnDirection = _ballArr[1].getComponent("ball2").angleNow - _ballArr[1].getComponent("ball2").angleDuration - this.angleDuration;
            //     if (this.node.weight == -1) {
            //         this.node.weight = _ballArr[1].weight
            //     }
            // }
        }
        else {

            var _distanceMin = 1000;
            var _targetIndex = -1;
            this.ballMngP.panel0.children.forEach(element => {
                if (element != this.node) {
                    if (this.getDistance(this.node.position, element.position) < _distanceMin) {
                        _distanceMin = this.getDistance(this.node.position, element.position);
                        _targetIndex = element.getSiblingIndex();
                    }
                }

            });

            if (_targetIndex != -1) {
                if (_targetIndex == 0) {//离0号近
                    this.node.setSiblingIndex(0);
                    this.turnDirection = _ballArr[1].getComponent("ball2").angleNow - _ballArr[1].getComponent("ball2").angleDuration - this.angleDuration;
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[1].weight
                    }
                }
                else {
                    if (this.node.weight == -1) {
                        this.node.weight = _ballArr[_ballArr.length - 2].weight
                    }
                    this.turnDirection =
                        _ballArr[_ballArr.length - 2].getComponent("ball2").angleNow +
                        _ballArr[_ballArr.length - 2].getComponent("ball2").angleDuration + this.angleDuration;
                }
            }

        }
        // this.turnDirection = this.turnDirection % 360;


        if (this.turnDirection < 180) {
            if (this.angleNow > 180) {
                this.objAngle._angle = this.angleNow - 360;
            }
        }
        else {
            if (this.angleNow < 180) {
                this.objAngle._angle = this.angleNow + 360;
            }
        }

        if (this.turnDirection != -999) {

            var _tempAngle = this.turnDirection - this.objAngle._angle
            if (_tempAngle > 180) {
                _tempAngle -= 360
            }
            else if (_tempAngle < -180) {
                _tempAngle += 360
            }
            cc.tween(this.objAngle)
                .by(0.1, { _angle: _tempAngle })
                .call(() => {
                    // this.changeReserver(_angleNew,_angleDuration);
                    if (this.objAngle._angle < 0)
                        this.objAngle._angle += 360;
                    else if (this.objAngle._angle > 360)
                        this.objAngle._angle -= 360;
                })
                .call(() => {
                    if (this.node.getSiblingIndex() == 0 || this.node.getSiblingIndex() == this.node.parent.children.length - 1) {
                        this.ballMngP.detectionCompound(this.node.getSiblingIndex());
                    }
                })
                .start();
        }
    },
    update(dt) {

        if (this.angleChangeing) {
            this.angleNow = this.objAngle._angle;
            this.node.x = -Math.sin(this.angleToRadian(this.angleNow)) * this.rudiasMax;
            this.node.y = Math.cos(this.angleToRadian(this.angleNow)) * this.rudiasMax;
        }
        else {

        }
        // cc.find("num", this.node).getComponent(cc.Label).string = parseInt(this.angleNow);

    },
    //普通碰撞
    onCollisionEnter(other, self) {
        if (this.ballMngP.GameOver) return
        if (self.node.weight == -1 && other.node.parent.name == "panel0") {
            self.node.weight = other.node.weight;
        }
        if (this.hadDie == false) {//碰到NPC的球形碰撞框 左半框

            window.collisionBallOnCircle = other.node;//在圈上被碰到的球
            this.ballMngP.ballFlying = this.node;//新生成的球
            this.dieFunc();

        }
        else {


        }
        if (this.node.parent.name == other.node.parent.name) {
            if (this.node.getSiblingIndex() == 0 && other.node.getSiblingIndex() == other.node.parent.children.length - 1) {
                if (this.node.parent.children.length > 6) {
                    this.ballMngP.onJieSuan();
                }
            }
        }
    },
    dieFunc() {
        if (this.panDuan) return

        this.hadDie = true;

        this.node.parent = this.ballMngP.panel0;
        if (Math.abs(this.angleNow - window.collisionBallOnCircle.getComponent("ball2").angleNow) > 180) {
            if (this.angleNow < window.collisionBallOnCircle.getComponent("ball2").angleNow) {
                this.node.setSiblingIndex(window.collisionBallOnCircle.getSiblingIndex() + 1);
            }
            else {//小角度

                this.node.setSiblingIndex(window.collisionBallOnCircle.getSiblingIndex());

            }
        }
        else {
            if (this.angleNow > window.collisionBallOnCircle.getComponent("ball2").angleNow) {
                this.node.setSiblingIndex(window.collisionBallOnCircle.getSiblingIndex() + 1);
            }
            else {//小角度

                this.node.setSiblingIndex(window.collisionBallOnCircle.getSiblingIndex());

            }
        }

        if (this.node.parent.parent.getSiblingIndex() == 2) {
            cc.director.emit("新球来了", this.node, this.angleNow, this.angleDuration);
        }
        else {
            cc.director.emit("新球来了2", this.node, this.angleNow, this.angleDuration);
        }

    },
    onAngleRotat(_a) {
        var _tempAngle = _a - this.objAngle._angle;

        if (_tempAngle > 180) {
            _tempAngle -= 360
        }
        else if (_tempAngle < -180) {
            _tempAngle += 360
        }

        cc.tween(this.objAngle)
            .by(0.2, { _angle: _tempAngle })
            .call(() => {
                // this.changeReserver(_angleNew,_angleDuration);
                if (this.objAngle._angle < 0)
                    this.objAngle._angle += 360;
                else if (this.objAngle._angle > 360)
                    this.objAngle._angle -= 360;
            })
            .start()
        // cc.tween(this.objAngle)
        // .to(0.1,{_angle:_a})
        // .start()
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
      //获得两点之间的距离
      getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
});
