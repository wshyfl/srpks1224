
cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        panel0: cc.Node,
        panel1: cc.Node,
        tempPanel: cc.Node,
        effect1Panel: cc.Node,
        effect2Panel: cc.Node,
        effect3Panel: cc.Node,
        ballPrefabArr: cc.Prefab,
        caiQiuPre: cc.Prefab,
        zhaDanPre: cc.Prefab,
        fruitImgs: [cc.SpriteFrame]
    },

    onLoad() {
        AD.ballMng = this;
        window.targetAngle = null;
        this.ballArr = new Array();
        this.shootNum = 0;
        //为0时可以生成下一个
        this.canCreatTime = 3;

        this.schedule(() => {
            if (this.canCreatTime == 1) {
                this.createBgBall();
            }
            if (this.canCreatTime <= 0) {
                this.lianJiNum = 0;
                this.canCreatTime = 0;
                return
            }
            this.canCreatTime--;
        }, 0.1)
        /**是否可以合成 */
        this.canCompound = true;
        this.GameOver = false;
        this.GameWin = false;
        this.shootBallType = "普通";
        this.fruitWidth = [29, 45, 63, 80, 92, 108, 129, 160, 190];
        this._score = 0;
        this.rudiasMax = 255;
        this.lianJiNum = 0;
    },

    start() {

        this.createBallFirst();
        this.createBall(0);
        cc.director.on("检测合成", this.detectionCompound, this);
        cc.director.on("特殊球", this.onCreateSpecial, this);
        cc.director.on("消灭", this.zhaDanClearUp, this);
        cc.find("shiBaiView", this.node).height = this.node.height;
        this.node.height = cc.winSize.height / 2;
        if (this.isDown) {

            this.node.y = -cc.winSize.height / 4;
        }
        else {
            this.node.y = cc.winSize.height / 4;
        }
        if (window.isAI && !this.isDown) {
            this.schedule(this.AIFunc, 1.2);
        }
        else
            this.initTouch();
    },
    AIFunc() {
        if (AD.Game.GameOverNow || !AD.Game.beginNow) return
        if (this.canCreatTime != 0) return
        if (this.shootNum == 3) return
        var _name = null;
        var _ballNow = null;
        this.panel1.children.forEach(element => {
            _name = element.getComponent(cc.Sprite).spriteFrame.name;
            _ballNow = element;
        });
        if (_name == null) {
            console.warn("获取错误")
            return;
        }
        var _targetBall = null;
        this.panel0.children.forEach(element => {
            
            if (_name == element.getComponent(cc.Sprite).spriteFrame.name) {
                _targetBall = element;
            }
        });
        var _angle = 0;
        if (_targetBall != null && _ballNow != null) {
            _angle = this.getAngle(_targetBall.position, _ballNow.position);
        }
        this.shootNum++;
        this.shootBall(_angle);
        
        AD.audioMng.playSfx("发球");
        this.scheduleOnce(() => {
            this.createBall(this.random(0, 3))
        }, 0.1)
    },
    update(dt) {


    },
    initTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },
    touchStart(event) {
        if (AD.Game.GameOverNow) return

        let point = cc.v2(event.touch.getLocation().x,
            event.touch.getLocation().y);
        if (this.isDown) {
            var _pos = cc.v2(point.x - 360, point.y - cc.winSize.height / 4);

        }
        else {
            var _pos = cc.v2(point.x - 360, point.y - cc.winSize.height / 4 * 3);
        }
        // var _touchPoint = event.getLocation();
        // let move_pos = this.node.parent.convertToNodeSpaceAR(_touchPoint);
        var _angle = this.getAngle(_pos, cc.v2(0, 0));

        if (this.canCreatTime != 0) return
        if (this.shootNum == 3) return
        // AD.sound.playSfx("发球");
                AD.audioMng.playSfx("发球");
        this.shootNum++;
        this.shootBall(_angle);
        this.scheduleOnce(() => {
            this.createBall(this.random(0, 3))
        }, 0.1)
    },
    createBall(_num) {
        this._ball = cc.instantiate(this.ballPrefabArr);
        this._ball.parent = this.panel1;
        this._ball.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[_num];
        this._ball.getComponent(cc.CircleCollider).radius = this._ball.width / 2;
        this._ball.weight = _num;
        if (this.node.getSiblingIndex() == 3) {
            this._ball.scale = -1;
        }
    },
    shootBall(_angle) {
        this._ball.getComponent("ball2").reset(_angle);
    },
    createBallFirst() {
        var _ball = cc.instantiate(this.ballPrefabArr);
        _ball.parent = this.panel0;
        _ball.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[0];
        _ball.getComponent(cc.CircleCollider).radius = _ball.width / 2;
        _ball.weight = 0;
        if (this.node.getSiblingIndex() == 2) {
            _ball.y = -this.rudiasMax;
            _ball.getComponent("ball2").reset(180, true);
        }
        else {
            _ball.y = this.rudiasMax;
            _ball.getComponent("ball2").reset(360, true);
            _ball.scale = -1
        }
    },
    /**每三次创建一个水果 */
    createBgBall() {

        if (this.shootNum != 3) return
        var random = Math.random();
        if (random < 0.5) {
            if (this.panel0.children[0].weight > 2) {
                var _weight = this.random(0, 2);

            }
            else {
                var arr = [0, 1, 2];
                arr.splice(arr.indexOf(this.panel0.children[0].weight), 1)
                var _weight = arr[this.random(0, 1)];
            }
            var _ball = cc.instantiate(this.ballPrefabArr);
            _ball.scale = 0;
            _ball.parent = this.panel0;
            _ball.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[_weight];
            _ball.getComponent(cc.CircleCollider).radius = _ball.width / 2;
            _ball.weight = _weight;
            _ball.setSiblingIndex(0);
            if (this.node.getSiblingIndex() == 3) {
                _ball.scale = -1;
            }
            var angleDuration = Math.atan(_ball.width / 2 / this.rudiasMax) / (Math.PI / 180);
            var _angleNow = this.panel0.children[1].getComponent("ball2").angleNow - this.panel0.children[1].getComponent("ball2").angleDuration - angleDuration;
            _ball.x = -Math.sin(this.angleToRadian(_angleNow)) * this.rudiasMax;
            _ball.y = Math.cos(this.angleToRadian(_angleNow)) * this.rudiasMax;
            _ball.getComponent("ball2").reset(_angleNow, true);
            cc.tween(_ball)
                .to(0.05, { scale: 1 })
                .call(() => {
                    this.shootNum = 0;
                })
                .start()
        }
        else {
            if (this.panel0.children[this.panel0.children.length - 1].weight > 2) {
                var _weight = this.random(0, 2);

            }
            else {
                var arr = [0, 1, 2];
                arr.splice(arr.indexOf(this.panel0.children[this.panel0.children.length - 1].weight), 1)
                var _weight = arr[this.random(0, 1)];
            }
            var _ball = cc.instantiate(this.ballPrefabArr);
            _ball.scale = 0;
            _ball.parent = this.panel0;
            _ball.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[_weight];
            _ball.getComponent(cc.CircleCollider).radius = _ball.width / 2;
            _ball.weight = _weight;
            _ball.setSiblingIndex(this.panel0.children.length - 1);
            if (this.node.getSiblingIndex() == 3) {
                _ball.scale = -1;
            }
            var angleDuration = Math.atan(_ball.width / 2 / this.rudiasMax) / (Math.PI / 180);
            var _angleNow = this.panel0.children[this.panel0.children.length - 2].getComponent("ball2").angleNow + this.panel0.children[this.panel0.children.length - 2].getComponent("ball2").angleDuration + angleDuration;
            _ball.x = -Math.sin(this.angleToRadian(_angleNow)) * this.rudiasMax;
            _ball.y = Math.cos(this.angleToRadian(_angleNow)) * this.rudiasMax;
            _ball.getComponent("ball2").reset(_angleNow, true);
            cc.tween(_ball)
                .to(0.05, { scale: 1 })
                .call(() => {
                    this.shootNum = 0;
                })
                .start()
        }


    },
    /**检测合成 */
    detectionCompound(_index) {
        var fruits = this.panel0.children;
        if (fruits.length <= 1) return
        if (!this.canCompound) return

        if (_index == 0) {

            if (fruits[0].weight == fruits[1].weight) {
                this.canCompound = false;
                // AD.sound.playSfx("合成球");
                var _angle = fruits[0].getComponent("ball2").angleNow//(fruits[0].getComponent("ball2").angleNow + fruits[1].getComponent("ball2").angleNow) / 2;
                var fruit = fruits[0];
                var fruit1 = fruits[1];
                fruit.weight += 1;
                this.addScore(fruit.weight);
                fruit.getComponent("ball2").angleDuration = Math.atan(this.fruitWidth[fruit.weight] / 2 / this.rudiasMax) / (Math.PI / 180);
                fruit1.parent = this.tempPanel;
                this.ballFlying = fruit;
                fruit1.getComponent(cc.CircleCollider).enabled = false;
                fruit1.getComponent("ball2").onAngleRotat(_angle);
                this.scheduleOnce(() => {
                    this.onCreatLianJi();
                    AD.mount.onCreatFruitBoomEff(this.effect1Panel, this.effect2Panel, fruit.position, fruit1.weight);
                    this.canCompound = true;
                    fruit1.destroy();

                    if (fruit.weight > 8) {
                        fruit.destroy();
                        this.ballFlying = fruits[0]
                        fruits[0].getComponent("ball2").reset(_angle, true, true);
                        return
                    }
                    this.ballFlying = fruit;
                    AD.Game.onShowNewBallView(fruit.weight);
                    fruit.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[fruit.weight];
                    fruit.getComponent(cc.CircleCollider).radius = fruit.width / 2;
                    fruit.getComponent("ball2").reset(_angle, true, true);
                }, 0.2)

                this.canCreatTime = 3;
            }
            else {
                this.canCreatTime = 2;
            }
        }
        else if (_index == fruits.length - 1) {

            if (fruits[_index].weight == fruits[_index - 1].weight) {
                this.canCompound = false;
                // AD.sound.playSfx("合成球");
                AD.audioMng.playSfx("合成球");
                var _angle = fruits[_index].getComponent("ball2").angleNow//(fruits[_index].getComponent("ball2").angleNow + fruits[_index - 1].getComponent("ball2").angleNow) / 2
                var fruit = fruits[_index];
                var fruit1 = fruits[_index - 1];
                fruit.weight += 1;
                this.addScore(fruit.weight);
                fruit.getComponent("ball2").angleDuration = Math.atan(this.fruitWidth[fruit.weight] / 2 / this.rudiasMax) / (Math.PI / 180);
                fruit1.parent = this.tempPanel;
                this.ballFlying = fruit;
                fruit1.getComponent(cc.CircleCollider).enabled = false;
                fruit1.getComponent("ball2").onAngleRotat(_angle);
                this.scheduleOnce(() => {
                    this.onCreatLianJi();
                    AD.mount.onCreatFruitBoomEff(this.effect1Panel, this.effect2Panel, fruit.position, fruit1.weight);
                    fruit1.destroy();
                    this.canCompound = true;
                    if (fruit.weight > 8) {
                        fruit.destroy();
                        this.ballFlying = fruits[_index]
                        fruits[_index].getComponent("ball2").reset(_angle, true, true);
                        return
                    }
                    this.ballFlying = fruit;
                    AD.Game.onShowNewBallView(fruit.weight);
                    fruit.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[fruit.weight];
                    fruit.getComponent(cc.CircleCollider).radius = fruit.width / 2;
                    fruit.getComponent("ball2").reset(_angle, true, true);
                }, 0.2)


                this.canCreatTime = 3;
            }
            else {
                this.canCreatTime = 2;
            }
        }
        else {
            if (fruits[_index].weight == fruits[_index - 1].weight && fruits[_index].weight != fruits[_index + 1].weight) {
                // AD.sound.playSfx("合成球");
                AD.audioMng.playSfx("合成球");
                this.canCompound = false;
                var _angle = fruits[_index].getComponent("ball2").angleNow//(fruits[_index - 1].getComponent("ball2").angleNow + fruits[_index].getComponent("ball2").angleNow) / 2
                var fruit = fruits[_index];
                var fruit1 = fruits[_index - 1];

                fruit.weight += 1;
                this.addScore(fruit.weight);
                fruit.getComponent("ball2").angleDuration = Math.atan(this.fruitWidth[fruit.weight] / 2 / this.rudiasMax) / (Math.PI / 180);
                fruit1.parent = this.tempPanel;
                this.ballFlying = fruit;
                fruit1.getComponent(cc.CircleCollider).enabled = false;
                fruit1.getComponent("ball2").onAngleRotat(_angle);
                this.scheduleOnce(() => {
                    this.onCreatLianJi();
                    AD.mount.onCreatFruitBoomEff(this.effect1Panel, this.effect2Panel, fruit.position, fruit1.weight);
                    this.canCompound = true;
                    fruit1.destroy();
                    if (fruit.weight > 8) {
                        fruit.destroy();
                        this.ballFlying = fruits[0]
                        fruits[0].getComponent("ball2").reset(fruits[0].getComponent("ball2").angleNow, true, true);
                        return
                    }
                    this.ballFlying = fruit;
                    AD.Game.onShowNewBallView(fruit.weight);
                    fruit.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[fruit.weight];
                    fruit.getComponent(cc.CircleCollider).radius = fruit.width / 2;
                    fruit.getComponent("ball2").reset(_angle, true, true);
                }, 0.2)

                this.canCreatTime = 3;
            }
            else if (fruits[_index].weight == fruits[_index + 1].weight && fruits[_index].weight != fruits[_index - 1].weight) {
                // AD.sound.playSfx("合成球");
                AD.audioMng.playSfx("合成球");
                this.canCompound = false;
                var _angle = fruits[_index].getComponent("ball2").angleNow//(fruits[_index].getComponent("ball2").angleNow + fruits[_index + 1].getComponent("ball2").angleNow) / 2;
                var fruit = fruits[_index];
                var fruit1 = fruits[_index + 1];

                fruit.weight += 1;
                this.addScore(fruit.weight);
                fruit.getComponent("ball2").angleDuration = Math.atan(this.fruitWidth[fruit.weight] / 2 / this.rudiasMax) / (Math.PI / 180);
                fruit1.parent = this.tempPanel;
                this.ballFlying = fruit;
                fruit1.getComponent(cc.CircleCollider).enabled = false;
                fruit1.getComponent("ball2").onAngleRotat(_angle);
                this.scheduleOnce(() => {
                    this.onCreatLianJi();
                    AD.mount.onCreatFruitBoomEff(this.effect1Panel, this.effect2Panel, fruit.position, fruit1.weight);
                    this.canCompound = true;
                    fruit1.destroy();
                    if (fruit.weight > 8) {
                        fruit.destroy();
                        this.ballFlying = fruits[0]
                        fruits[0].getComponent("ball2").reset(fruits[0].getComponent("ball2").angleNow, true, true);
                        return
                    }
                    this.ballFlying = fruit;
                    AD.Game.onShowNewBallView(fruit.weight);
                    fruit.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[fruit.weight];
                    fruit.getComponent(cc.CircleCollider).radius = fruit.width / 2;
                    fruit.getComponent("ball2").reset(_angle, true, true);
                }, 0.2)

                this.canCreatTime = 3;
            }
            else if (fruits[_index].weight == fruits[_index + 1].weight && fruits[_index].weight == fruits[_index - 1].weight) {
                console.log("--------三个一样的球")
                // AD.sound.playSfx("合成球");
                AD.audioMng.playSfx("合成球");
                var _angle = fruits[_index].getComponent("ball2").angleNow;
                var fruit = fruits[_index];
                var fruit1 = fruits[_index - 1];
                var fruit2 = fruits[_index + 1];

                fruit.weight += 1;
                this.addScore(fruit.weight);
                fruit.getComponent("ball2").angleDuration = Math.atan(this.fruitWidth[fruit.weight] / 2 / this.rudiasMax) / (Math.PI / 180);
                fruit1.parent = this.tempPanel;
                this.ballFlying = fruit;
                fruit1.getComponent(cc.CircleCollider).enabled = false;
                fruit2.getComponent(cc.CircleCollider).enabled = false;
                fruit1.getComponent("ball2").onAngleRotat(_angle);
                fruit2.getComponent("ball2").onAngleRotat(_angle);
                this.scheduleOnce(() => {
                    this.onCreatLianJi();
                    AD.mount.onCreatFruitBoomEff(this.effect1Panel, this.effect2Panel, fruit.position, fruit1.weight);
                    fruit1.destroy();
                    fruit2.destroy();
                    if (fruit.weight > 8) {

                        fruit.destroy();
                        this.ballFlying = fruits[0]
                        fruits[0].getComponent("ball2").reset(fruits[0].getComponent("ball2").angleNow, true, true);
                        return
                    }
                    this.ballFlying = fruit;
                    AD.Game.onShowNewBallView(fruit.weight);
                    fruit.getComponent(cc.Sprite).spriteFrame = this.fruitImgs[fruit.weight];
                    fruit.getComponent(cc.CircleCollider).radius = fruit.width / 2;
                    fruit.getComponent("ball2").reset(_angle, true, true);
                }, 0.2)

                this.canCreatTime = 3;
            }
            else {
                this.canCreatTime = 2;
            }
        }
    },
    /**生成特殊球 */
    onCreateSpecial(_type) {
        this.shootBallType = _type;
        if (_type == "彩球") {
            this._ball.active = false;
            this.caiQiu = cc.instantiate(this.caiQiuPre);
            this.caiQiu.parent = this.panel1;
            this.caiQiu.weight = -1;
        }
        else {
            this._ball.active = false;
            this.zhaDan = cc.instantiate(this.zhaDanPre);
            this.zhaDan.parent = this.panel1;
            this.zhaDan.weight = -2;
        }
    },
    zhaDanClearUp() {
        if (this.panel0.children.length > 1) {
            this.scheduleOnce(() => {
                this.ballFlying = this.panel0.children[0]
                this.panel0.children[0].getComponent("ball2").reset(this.panel0.children[0].getComponent("ball2").angleNow, true, true);
            }, 0.1)
        }
    },
    onShootSpecial(_angle) {

        if (this.shootBallType == "彩球") {
            this.shootBallType = "普通"
            this.caiQiu.getComponent("ball2").reset(_angle);
        }
        else if (this.shootBallType == "炸弹") {
            this.shootBallType = "普通"
            this.zhaDan.getComponent("zhaDan").reset(_angle);
        }
        this.scheduleOnce(() => {
            this._ball.active = true;
        }, 0.1)
    },
    /**连击 */
    onCreatLianJi() {
        this.lianJiNum++;
        if (this.lianJiNum >= 2) {
            AD.mount.onCreatLianJiEff(this.effect3Panel, this.lianJiNum, cc.v2(250, 212));
        }
    },
    /**挑战结算 */
    onJieSuan() {
        if (this.GameOver) return
        this.GameOver = true;
        AD.Game.onJudgeJieSuan();
        cc.find("shiBaiView", this.node).active = true;
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
    addScore(num) {
        this._score += num;
        if (this.isDown) {
            AD.Game.scoreDown = this._score;

        }
        else
            AD.Game.scoreUp = this._score;
        for (var i = 0; i < num; i++) {
            cc.director.emit("分数增加", this.isDown);
        }
    },
    //获得随机整数 上下限都包括
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
