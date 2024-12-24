

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.girl = cc.find("girl", this.node);

        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物沮丧");
        cc.director.emit("紫衣女孩待机摊手");



        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我总是受到别人嘲笑", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);


        
        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("紫衣女孩害怕");
            cc.director.emit("人物开心4");
            AD.gameScene.createDialog("不过他们也有畏惧我的地方", config.roleType.HUMAN);
            this.scheduleOnce( ()=> {
                this.girl.scaleX = -1*this.girl.scaleX;
                cc.director.emit("紫衣女孩跑");
                cc.tween(this.girl)
                .by(1,{x:600})
                .call(()=>{
                    this.complete();
                })
                .start();
            }, 2)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 1.5);
    },


});
