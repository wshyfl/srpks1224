

cc.Class({
    extends: cc.Component,

    properties: {
        you: cc.Node,
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        AD.couldClear = false;//
        this.you.active = false;
            //被擦掉的换成主角衣服
            for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
                Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
            }
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
        cc.director.emit("人物待机");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("接下来要想办法逃出去了", config.roleType.HUMAN);
            AD.couldClear = true;
        }, 1)

        //被擦干净了
        cc.director.on("完成", () => {

            AD.gameScene.wipUp();
            cc.director.emit("人物6耶");
            this.humanAct();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {

        this.human.scaleX = -1 * this.human.scaleX;
        cc.tween(this.human)
            .delay(1)
            .call(() => {

                cc.director.emit("人物走");
            })
            .to(2, { x: -110, y: -180, scaleX: this.human.scaleX * 0.7, scaleY: this.human.scaleY * 0.7 })
            .call(() => {
                cc.director.emit("人物跳窗");
                // cc.director.emit("人物待机");
                // this.complete();
                // AD.gameScene.createDialog("这次任务感觉还不错！", config.roleType.HUMAN);
            })
            .delay(1)
            .call(() => {
                this.human.scale = 0;
                this.you.active = true;
                cc.tween(this.humanCopy)
                .by(2,{y:100})
                .start();
            })
            .delay(1)
            .call(()=>{
                

                AD.gameScene.createDialog("额.看来我该减肥了", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },

});
