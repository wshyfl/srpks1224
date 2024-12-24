

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.qiang = cc.find("qiang", this.node); this.qiang.active = true;

        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机跪");
        this.scheduleOnce(function () {
            AD.couldClear = true;//
            AD.gameScene.createDialog("现在就是我出去的好机会！", config.roleType.HUMAN);
        }, 2);



        //被擦干净了
        cc.director.on("完成", () => {
            // cc.director.emit("人物待机劈腿");
            AD.gameScene.wipUp();

            this.human.scaleX = this.human.scaleX * -1;
            cc.director.emit("人物待机");


            this.scheduleOnce(function () {
                cc.director.emit("人物跳窗");
                cc.tween(this.human)
                    .to(0.4, { x: -100, y: 290 })
                    .delay(0.6)
                    .call(() => {
                        AD.gameScene.createDialog("悄悄的，千万不能发出声音......", config.roleType.HUMAN);
                        this.human.scaleX = this.human.scaleX * -1;
                        // this.qiang.active = true;
                        var pos1 = this.human.parent.convertToWorldSpaceAR(this.human.position);
                        var pos2 = this.qiang.convertToNodeSpaceAR(pos1);
                        this.human.position = cc.v2(pos2.x - 25, pos2.y);
                        this.human.parent = this.qiang;

                        cc.director.emit("人物待机捂嘴");
                    })
                    .delay(1)
                    .by(2, { y: -200 })
                    .call(() => {
                        this.complete();
                    })
                    .start();
            }, 1)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 1);
    },
    
});
