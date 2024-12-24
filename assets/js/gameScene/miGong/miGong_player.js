cc.Class({
    extends: cc.Component,

    properties: {
        playerType: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.distancePer = 50;//间隔
        this.distanceTemp = this.distancePer;
        this.speedN = 5;
        this.rateSpeed = 1;
        this.couldMoveArr = [false, false, false, false];//上下左右
        this.couldMoveArrTemp = [false, false, false, false];//上下左右


        this.up = cc.find("up", this.node).getComponent(cc.Label);
        this.down = cc.find("down", this.node).getComponent(cc.Label);
        this.left = cc.find("left", this.node).getComponent(cc.Label);
        this.right = cc.find("right", this.node).getComponent(cc.Label);
        
        cc.find("cloud", this.node).opacity = 0;//云层
        cc.find("effectSpeedUp", this.node).active = false;
        this.spr = cc.find("role/spr", this.node);
        this.ice = cc.find("ice", this.node); this.ice.active = false;

        cc.director.on("更换角色", (_playerType) => {
            if (_playerType == this.playerType)
                this.resetSpr("前");
        }, this)

        this.moveRate = 1;
        this.moveRateSwap = 1;
        cc.director.on("更改角色速率", (_playerType, _moveRate) => {
            if (_playerType == this.playerType) {
                this.moveRate = _moveRate;
            }
        }, this);

        cc.director.on("触发道具效果", (_nameProp, _playerType) => {
            switch (_nameProp) {
                
            }
        }, this);
        cc.director.on("生成炸弹", (_playerType) => {
            if (_playerType == this.playerType) {
                AD.gameScene.createMissile(this.node, _playerType);
            }
        }, this);

    },

    start() {

        this.resetSpr("前");
        // cc.tween(this.spr)
        //     .repeatForever(
        //         cc.tween()
        //             .to(0.2, { y: 5 }, { easing: "sineInOut" })
        //             .to(0.2, { y: -5 }, { easing: "sineInOut" })
        //     )
        //     .start();

        if (this.playerType == 0) {

            this.nightNode = cc.find("nightNode", this.node);
            this.nightNode.active = false;

        }
        //黑色
        if (globalData.modeType == "限时模式" && globalData.modeLevel == 2 && this.playerType == 0) {
            this.nightNode.active = true;
            this.nightNode.scale = 200;
            cc.tween(this.nightNode)
                .delay(1)//白 两秒
                .to(1.6, { scale: 1.5 })
                .start();

            this.blinkSecond = 0;
            this.schedule(function () {
                if(this.blinkSecond%10 ==9)
                {
                }
                this.blinkSecond++;
                if (this.blinkSecond % 24 == 9) {
                    if(Tools.random(1,100)<100)
                    { 
                        
                        cc.tween(this.nightNode)
                        .to(0.02, { opacity:  Tools.random(0,100)  })
                        .to(1.0+Tools.random(0,10)*0.05, { opacity: 255 })
                        .start();
                    }
                }
                if (this.blinkSecond % 24 == 10) {
                    if(Tools.random(1,100)<50)
                    {
                        cc.tween(this.nightNode)
                        .to(0.01, { opacity: Tools.random(0,100) })
                        .to(1.4+Tools.random(0,10)*0.05, { opacity: 255 })
                        .start();
                    }
                }
                if (this.blinkSecond % 24 == 13) {
                    if(Tools.random(1,100)<30)
                    {
                        cc.tween(this.nightNode)
                        .to(0.01, { opacity: Tools.random(0,100)  })
                        .to(1.4+Tools.random(0,10)*0.05, { opacity: 255 })
                        .start();
                    }
                }
            }, 0.5)
         

        }
        this.couldMove = true;
        cc.director.on("到达终点", (_playerType) => {
            if (_playerType == this.playerType)
                this.finishNode();
        }, this);
        this.isDie = false;
        cc.director.on("玩家被杀死", () => {
            if (!this.isDie) {
                
             
                this.isDie = true;
                this.animState.speed = 0;
                var _y = this.spr.y;
                this.couldMove = false;
                cc.tween(this.node)
                    .call(() => {
                        this.resetSpr("前");
                    })
                    .by(0.3, { scale: 0.5, y: 150 }, { easing: "sineOut" })
                    .by(0.8, { y: -800 }, { easing: "sineIn" })
                    .call(() => {
                        this.node.destroy();
                        cc.director.emit("游戏失败")
                    })
                    .start();
            }

        }, this);

        this.lastPos = this.node.position;
        this.startPos = this.node.position;
        //角色的playerType标识
        // cc.find("indexNode", this.node).active = (globalData.modeType.indexOf("双人") != -1)
        cc.find("indexNode", this.node).active = true;
        cc.tween(cc.find("indexNode", this.node))
            .repeatForever(
                cc.tween()
                    .by(0.3, { y: 10 }, { easing: "sineInOut" })
                    .by(0.3, { y: -10 }, { easing: "sineInOut" })
            )
            .start()


        this.anim = cc.find("role", this.node).getComponent(cc.Animation);

        this.animState = this.anim.play();
        this.animState.speed = 0.5;

        // this.schedule(function(){            
        //     AD.audioMng.playSfx("角色", Tools.random(0,7));
        // },5)
    },
    //到达终点
    finishNode() {
        this.couldMove = false;

        if (globalData.modeType == "限时模式" && globalData.modeLevel == 2) {
            cc.tween(this.nightNode)
                .to(0.6, { scale: 200 })
                .call(() => {
                    this.nightNode.active = false;
                    cc.tween(this.node)
                        .to(0.5, { scale: 0 })
                        .call(() => {
                            this.node.destroy();
                        })
                        .start();
                })
                .start();
        }
        else {
            cc.tween(this.node)
                .to(0.5, { scale: 0 })
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }
    },
    resetSpr(_name) {

        this.direciton = _name;
        this.roleIndex = globalData.role1Index;
        if (this.playerType == 1)
            this.roleIndex = globalData.role2Index;

        // switch (_name) {
        //     case "前":
        //         this.spr.getComponent(cc.Sprite).spriteFrame = AD.gameScene.roleSprArr[this.roleIndex * 3 + 0];
        //         this.spr.scaleX = 1;
        //         break;
        //     case "后":
        //         this.spr.getComponent(cc.Sprite).spriteFrame = AD.gameScene.roleSprArr[this.roleIndex * 3 + 1];
        //         this.spr.scaleX = 1;
        //         break;
        //     case "左":
        //         this.spr.getComponent(cc.Sprite).spriteFrame = AD.gameScene.roleSprArr[this.roleIndex * 3 + 2];
        //         this.spr.scaleX = 1;
        //         break;
        //     case "右":
        //         this.spr.getComponent(cc.Sprite).spriteFrame = AD.gameScene.roleSprArr[this.roleIndex * 3 + 2];
        //         this.spr.scaleX = -1;
        //         break;
        // }
    },

    update(dt) {
        // AD.xiangPi.ca(this.node.position)
        this.node.zIndex = 600 - this.node.y;
        if (AD.gameScene.gameFinish) {

            this.animState.speed = 0;
            return;
        }
        this.couldMoveArr[0] ? this.up.string = true : this.up.string = false;
        this.couldMoveArr[1] ? this.down.string = true : this.down.string = false;
        this.couldMoveArr[2] ? this.left.string = true : this.left.string = false;
        this.couldMoveArr[3] ? this.right.string = true : this.right.string = false;


        if (this.playerType == 0) {
            this.targetAngle = AD.player0Angle;
        }
        else {
            this.targetAngle = AD.player1Angle;
        }

        if (AD.couldMove0 && this.playerType == 0)
            this.moveCheck();

        else if (AD.couldMove1 && this.playerType == 1)
            this.moveCheck();
        this.move(dt);
    },
    moveCheck() {
        if (this.distanceTemp >= this.distancePer) {
            for (var i = 0; i < 4; i++) {
                this.couldMoveArrTemp[i] = false;
            }
            if (this.couldMoveArr[0] && this.targetAngle == 180) {//上
                this.couldMoveArrTemp[0] = true;
                this.distanceTemp = 0;
                this.resetSpr("后");
                AD.gameScene.createFootprint(this.node.position, this.direciton);
                // this.lastPos = this.node.position;
            }
            else if (this.couldMoveArr[1] && this.targetAngle == 0) {//下
                this.couldMoveArrTemp[1] = true;
                this.distanceTemp = 0;
                this.resetSpr("前");
                AD.gameScene.createFootprint(this.node.position, this.direciton);
                // this.lastPos = this.node.position;
            }
            else if (this.couldMoveArr[2] && this.targetAngle == 270) {//左
                this.couldMoveArrTemp[2] = true;
                this.distanceTemp = 0;
                this.resetSpr("左");
                AD.gameScene.createFootprint(this.node.position, this.direciton);
                // this.lastPos = this.node.position;
            }
            else if (this.couldMoveArr[3] && this.targetAngle == 90) {//右
                this.couldMoveArrTemp[3] = true;
                this.distanceTemp = 0;
                this.resetSpr("右");
                AD.gameScene.createFootprint(this.node.position, this.direciton);
                // this.lastPos = this.node.position;
            }
        }


    },
    move(dt) {
        if (this.couldMove == false) {
            return;
        }
        if (this.distanceTemp < this.distancePer) {
            this.animState.speed = 1;
            if (this.couldMoveArrTemp[0]) {//上
                this.node.y += this.speedN * this.moveRate * this.moveRateSwap;
                this.distanceTemp += this.speedN * this.moveRate * this.moveRateSwap;
            }
            else if (this.couldMoveArrTemp[1]) {//下
                this.node.y -= this.speedN * this.moveRate * this.moveRateSwap;
                this.distanceTemp += this.speedN * this.moveRate * this.moveRateSwap;
            }
            else if (this.couldMoveArrTemp[2]) {//左
                this.node.x -= this.speedN * this.moveRate * this.moveRateSwap;
                this.distanceTemp += this.speedN * this.moveRate * this.moveRateSwap;
            }
            else if (this.couldMoveArrTemp[3]) {//右
                this.node.x += this.speedN * this.moveRate * this.moveRateSwap;
                this.distanceTemp += this.speedN * this.moveRate * this.moveRateSwap;
            }

            if (this.distanceTemp == this.distancePer)
                this.lastPos = this.node.position;
        }
        else {
            this.animState.speed = 0.5;
            for (var i = 0; i < 4; i++) {
                this.couldMoveArrTemp[i] = false;
            }
        }
        if (this.targetAngle) {

            // this.vx = Math.sin(Tools.angleToRadian(this.targetAngle)) * this.speedN * dt;
            // this.vy = -Math.cos(Tools.angleToRadian(this.targetAngle)) * this.speedN * dt;
            // var _tempW = this.vx * this.rateSpeed;
            // var _tempH = this.vy * this.rateSpeed;
            // this.node.x += _tempW;
            // this.node.y += _tempH;
        }


        cc.find("effectSpeedUp", this.node).active = (this.moveRate > 1);
    },

    onCollisionEnter: function (other, self) {
        if (other.tag != 666) return;
        this.couldMoveArr[self.tag] = true;
    },

    onCollisionStay: function (other, self) {
        if (other.tag != 666) return;
        this.couldMoveArr[self.tag] = true;
    },

    onCollisionExit: function (other, self) {
        if (other.tag != 666) return;
        this.couldMoveArr[self.tag] = false;
    },
});
