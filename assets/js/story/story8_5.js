

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);

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
        
        AD.handPosTemp = cc.v2(0, 0);
        

        this.humanAct();

        
        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物高兴");
            this.complete();
            AD.gameScene.createDialog("太好了，还好有橡皮擦", config.roleType.HUMAN);      
            
            
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    humanAct() {
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");

        cc.tween(this.human)
        .to(1.5,{x:-70,y:-360,scaleX:-1,scaleY:1})
        .call(()=>{
            cc.director.emit("人物待机捂嘴");
            AD.human.biaoQing("惊讶");
            AD.gameScene.changeCamera(1, this.cameraPos, 0.5);
        })
        .delay(1)
        .call(()=>{
            AD.couldClear = true;//
            AD.gameScene.createDialog("通往楼顶的门被锁住了", config.roleType.HUMAN);                
            // this.complete();
        })
        .start();
    },
    
});
