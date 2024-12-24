

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.human = cc.find("human", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);
        this.cameraPos3 = cc.find("cameraPos3", this.node);
        this.cameraPos4 = cc.find("cameraPos4", this.node);
        this.langRen0 = cc.find("langRen0", this.node);
        this.langRen = cc.find("langRen", this.node); this.langRen.active = false;
        AD.couldClear = false;//


        //隐藏数




    },

    start() {


        AD.handPosTemp = cc.v2(-50, 0);
        AD.gameScene.cameraGame.node.x = -670;


        //主角走过来
        this.humanAct();
        cc.director.emit("狼人待机蹲");


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();


            AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);

            this.scheduleOnce(function () {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing(25);
                
                this.effect.active = true;
                this.langRen.active = true;
                this.langRen0.active = false;
                this.scheduleOnce(function(){
                    this.langRenAct();
                    this.humanActLeave();
                },2)
            }, 1)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {
        cc.director.emit("人物走");

        AD.gameScene.changeCamera(1, this.cameraPos1, 2);
        cc.tween(this.human)
            .to(2, { x: -270 })
            .call(() => {
                AD.human.biaoQing(7);
                cc.director.emit("人物待机捂嘴");
            })
            .delay(1)
            .call(() => {
                AD.gameScene.changeCamera(1.3, this.cameraPos2, 1.5);
            })
            .delay(1.7)
            .call(() => {
                AD.gameScene.createDialog("哪个是我的约会对象？", config.roleType.HUMAN);
                AD.couldClear = true;//
            })
            .start();
    },
    langRenAct() {
        AD.gameScene.changeCamera(1, this.cameraPos4, 1.5);
        cc.director.emit("狼人跑");
        cc.tween(this.langRen)
            .by(3, { x: -1400 })
            .call(() => {
                AD.gameScene.createDialog("天哪，这是怎么回事啊！", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },
    humanActLeave() {
        cc.director.emit("人物跑");
        this.human.scaleX = -1*this.human.scaleX;
        cc.tween(this.human)
            .by(3, { x: -1400 })
            .start();
    },
});
