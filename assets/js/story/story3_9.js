

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cat = cc.find("cat", this.node);
        this.xue = cc.find("xue", this.node);this.xue.active = false;
        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物待机");
        cc.director.emit("消防员待机");
        AD.xiaoFangYuan.kouZhao(-1);
        cc.director.emit("猫待机");

        
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("来创造一场英雄救美吧！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.xue.active = true;
            this.xueAct();
            
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    xueAct(){
        cc.tween(this.xue)
        .to(0.5,{x:-200,y:40,angle:-18})
        .delay(0.3)
        .call(()=>{
            this.scheduleOnce(function(){
                cc.director.emit("人物发抖躺");
                cc.director.emit("消防员惊恐");
                cc.director.emit("猫跳");

                AD.audioMng.playSfx("猫")
                cc.tween(this.cat)
                .to(0.2,{x:this.cat.x + 80,y:this.cat.y+50})
                .to(0.01,{scaleX:1})
                .to(0.2,{x:this.cat.x + 80,y:this.cat.y-50})
                .start();
                this.scheduleOnce(function(){
                    
                cc.director.emit("猫待机");
                },1)
            },0.3)
        })
        .to(0.5,{x:-216,y:-308,angle:0})
        .delay(0.5)
        .call(()=>{
            
            AD.gameScene.changeCamera(2, this.cameraPos1, 0.7);;
        })
        .delay(1)
        .call(()=>{
            this.complete();
            AD.gameScene.createDialog("天哪，我需要帮助！", config.roleType.HUMAN);
        })
        .start();
    },

});
