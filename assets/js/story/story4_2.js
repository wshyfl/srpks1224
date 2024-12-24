

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);

        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物沮丧2");



        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我讨厌舞会，一点都不想去！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物开心4");
            AD.gameScene.createDialog("眼不见心不烦！", config.roleType.HUMAN);
            this.scheduleOnce(function(){
                cc.director.emit("人物走路4");
                cc.tween(this.human)
                .by(1.5,{x:800})
                .call(()=>{
                    this.complete();
                })
                .start();
            },2)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 1.5);
    },


});
