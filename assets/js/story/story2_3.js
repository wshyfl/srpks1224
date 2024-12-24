

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.human2 = cc.find("human2", this.node); this.human2.active = false;
        this.huo = cc.find("huo", this.node); this.huo.active = true;
        this.shui = cc.find("shui", this.node); this.shui.active = false;
        this.shengZi = cc.find("shengZi", this.node); this.shengZi.active = true;



        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机蹬腿");
        AD.human.biaoQing("生气");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我不想被烧死！", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.shui.active = true;
            cc.tween(this.huo)
                .to(2, { scale: 0 })
                .call(() => {
                    this.shengZi.active = false;
                    this.human.active = false;
                    this.human2.active = true;
                    cc.director.emit("人物待机捂嘴");
                    AD.human.biaoQing("开心");
                })
                .delay(1)                
                .call(() => {
                    AD.gameScene.createDialog("这下终于自由了", config.roleType.HUMAN);
                    this.complete();
                })

                .start();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //找到钥匙--解锁
    keyUp() {
        cc.tween(this.guangMask)
            .to(1, { height: 395 })
            .call(() => {
                this.huo.active = true;
            })
            .delay(0.5)
            .call(() => {
                // AD.human.biaoQing("开心");
                this.complete();
            })
            .start();
    },
    // update (dt) {},
});
