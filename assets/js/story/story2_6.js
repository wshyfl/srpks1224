

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.naoZhong = cc.find("naoZhong", this.node);
        this.bangFei = cc.find("bangFei", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = true;




        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机跪");
        cc.director.emit("绑匪走");
        // AD.human.biaoQing("待机");
        AD.gameScene.changeCamera(1, this.cameraNode, 3);
        cc.tween(this.bangFei)
            .to(3, { x: 420 })
            .call(() => {
                cc.director.emit("绑匪待机");
            })
            .delay(1)

            .call(() => {
                AD.gameScene.createDialog("嘘...绑匪回来了", config.roleType.HUMAN);
                this.scheduleOnce(function () {
                    AD.couldClear = true;//
                }, 2);
            })
            .start();


        //被擦干净了
        cc.director.on("完成", () => {
            // cc.director.emit("人物待机劈腿");
            this.effect.active = false;
            AD.gameScene.wipUp();
            this.clockDown();
            this.scheduleOnce(function () {

            }, 2)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //水没了
    clockDown() {
        cc.tween(this.naoZhong)
            .by(0.5, { angle: -100, x: 10, y: -200, scale: -0.15 * this.naoZhong.scale })
            .delay(0.5)
            .call(() => {
                this.bangFeiUp();
            })
            .start();
    },
    bangFeiUp() {
        cc.tween(this.bangFei)
            .to(0.03, { scaleX: -1*this.bangFei.scaleX })
            .delay(0.5)
            .call(() => {
                cc.director.emit("绑匪走");
            })
            .to(1, { x: this.naoZhong.x + 100, y: this.naoZhong.y - 100, scale:  -0.8*this.bangFei.scaleX  })
            .call(() => {
                cc.director.emit("绑匪待机");
                AD.gameScene.createDialog("太好了，这样可以分散他注意力", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },
    // update (dt) {},
});
