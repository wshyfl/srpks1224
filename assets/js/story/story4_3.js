

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.man = cc.find("man", this.node);

        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物害怕4");
        cc.director.emit("男人4站立");



        this.scheduleOnce(function () {
            AD.gameScene.createDialog("什么？他竟然在邀请我？", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            AD.gameScene.createDialog("我还没有做好心理准备！", config.roleType.HUMAN);
          
            cc.director.emit("人物走路4");
            this.scheduleOnce(function(){
                this.man.scaleX = -1*this.man.scaleX;
            },1.8)
            cc.tween(this.human)
            .by(3.0,{x:700})
            .call(()=>{
                this.complete();
            })
            .start();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 0.5);
    },


});
