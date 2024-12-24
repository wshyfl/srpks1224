

cc.Class({
    extends: cc.Component,

    properties: {
        human: cc.Node,
        qianZi: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.qianZiCopy = cc.find("qianZiCopy", this.node); this.qianZiCopy.active = false;
        this.dengCopy = cc.find("dengCopy", this.node); this.dengCopy.active = false;
        this.deng = cc.find("deng", this.node); this.deng.active = true;
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.ji = cc.find("ji", this.node);
        this.jiSpr = cc.find("ji", this.ji);
        this.mask = cc.find("mask", this.jiSpr);
        AD.couldClear = false;//
    },

    // AD.handPosTemp = cc.v2(0,400)
    // AD.gameScene.cameraGame.node.x = -100;
    // AD.gameScene.cameraGame.zoomRatio = 1.5;
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {


        AD.gameScene.cameraGame.node.x = -720;


        //主角走过来
        this.humanRun();


        this.jiGuang();
        this.func = function () {
            this.jiGongJi();
        };

        this.schedule(this.func, 3);
        //被擦干净了
        cc.director.on("完成", () => {

            AD.gameScene.wipUp();

            cc.director.emit("人物6耶");
            this.qianZiAct();


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanRun() {
        AD.gameScene.changeCamera(1, this.cameraPos1, 2);

        cc.director.emit("人物跑");
        cc.tween(this.human)
            .to(2, { x: -310 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing(6);
            })
            .delay(0.5)
            .call(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("得先解决掉那只鸡啊！", config.roleType.HUMAN);
            })
            .start();
    },
    jiGongJi() {
        cc.tween(this.ji)
            .to(0.05, { angle: -3 })
            .to(0.1, { angle: 3 })
            .call(() => {
                this.jiGuang();
            })
            .delay(1.2)
            .to(0.05, { angle: 0 })
            .start();
    },
    jiGuang() {
        this.mask.width = 0;
        cc.tween(this.mask)
            .to(0.1, { width: this.mask.children[0].width })
            .delay(1)
            .to(0.02, { width: 0 })
            .start();
    },

    qianZiAct() {
        cc.tween(this.qianZi)
            .to(0.5, { position: this.qianZiCopy.position })
            .delay(0.2)
            .call(() => {
                this.dengAct();
            })
            .start();
    },
    dengAct() {
        cc.tween(this.deng)
            .to(0.5, { position: this.dengCopy.position })
            .call(() => {
                this.jiDown();
                this.dengMoveNow = true;
                this.vx = -8; this.vy = 6; this.vaX = 0.2, this.vaY = 0.6;
            })
            .start();
    },
    jiDown() {
        this.mask.active = false;
        this.unschedule(this.func);
        cc.tween(this.ji)
        .to(0.1,{angle:-5})
        .to(0.5,{angle:5})
        .call(()=>{
            cc.tween(this.jiSpr)
            .by(2,{angle:1000})
            .start();
        })
        .by(0.3,{x:-150,y:-150})
        .by(1.5,{y:-1200})
        .call(()=>{
            this.humanAct();
        })
        .start();
    },
    humanAct(){
        cc.director.emit("人物走");
        cc.tween(this.human)
        .to(0.6,{x:-135})
        .call(()=>{
            cc.director.emit("人物待机");
            AD.gameScene.createDialog("没想到吧！", config.roleType.HUMAN);
            this.complete();
        })
        .start();
    },
    update() {
        if (this.dengMoveNow) {
            this.deng.angle += 5;
            this.deng.x += this.vx; this.deng.y += this.vy;
            this.vx += this.vaX; this.vy -= this.vaY;
            if (this.vx > 0)
                this.vx = 0;
        }
    },

});
