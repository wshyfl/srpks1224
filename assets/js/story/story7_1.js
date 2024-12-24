

cc.Class({
    extends: cc.Component,

    properties: {
        
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.hong = cc.find("hong", this.node);
        this.sanBao = cc.find("sanBao", this.node);
        
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
        this.hongShan();
        cc.director.emit("人物害怕4");
        AD.human.changeHair(0)
        AD.human.changeYanJing(-1)
        this.scheduleOnce(function(){
            AD.gameScene.createDialog("我得想办法下飞机！", config.roleType.HUMAN);
            AD.couldClear = true;//
        },1)

        

        //被擦干净了
        cc.director.on("完成", () => {
            this.sanBao.active = false;
            AD.gameScene.wipUp();
            cc.director.emit("人物7开心");
            this.scheduleOnce(function(){
                
            AD.gameScene.createDialog("有降落伞就好办了", config.roleType.HUMAN);
            this.complete();
            },1)
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

    
    },
    hongShan(){
        cc.tween(this.hong)
        .repeatForever(
            cc.tween()
            .to(0.5,{opacity:60})
            .to(0.5,{opacity:0})
        )
        .start();
    },
    
});
