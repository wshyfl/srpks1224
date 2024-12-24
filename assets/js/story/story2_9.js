

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.bangFei = cc.find("bangFei", this.node);
        this.taoNode = cc.find("taoNode", this.node);
        this.songGuo = cc.find("songGuo", this.node);this.songGuo.active = false;
        this.songShu = cc.find("songShu", this.node);
        this.effect = cc.find("effect", this.node);this.effect.active = false;

        AD.couldClear = false;//
    },

    start() {
        AD.gameScene.cameraGame.node.x = -720;
        cc.director.emit("人物挂树横2");
        cc.director.emit("绑匪走");
        AD.gameScene.changeCamera(1, this.cameraNode, 4);
        cc.tween(this.bangFei)
            .to(4, { x: -150 })
            .call(() => {

                cc.director.emit("绑匪待机张嘴");
            })
            .delay(1)
            .call(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("我得想办法赶走那个家伙！", config.roleType.HUMAN);
            })
            .start();
            



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.songGuoDown();
            // cc.director.emit("人物待机");
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    songGuoDown(){
        AD.gameScene.changeCamera(1.5, AD.gameScene.cameraGame.node, 1.5);
        this.songGuo.active = true;
        cc.tween(this.songGuo)
        .to(1.5,{y:-152})
        .call(()=>{
            cc.director.emit("绑匪待机捂肚子");
        })
        .delay(1.5)
        .call(()=>{
            this.songShuDown();
        })
        .start();
    },
    songShuDown(){
        cc.tween(this.songShu)
        .to(0.5,{x:-110,y:-25,scale:0.8})
        .call(()=>{
            this.songGuo.active = false;
            this.songShu.active = false;
            cc.director.emit("绑匪跑");
            this.bangFeiPao();
        })
        .start();
    
    },
    bangFeiPao(){
        
        AD.audioMng.playSfx("碰墙")
        cc.tween(this.songGuo)
        .by(0.5,{x:-50,y:80})
        .by(0.5,{x:-50,y:-80})
        .call(()=>{
            this.songGuo.active = false;
        })
        .start();

        AD.gameScene.changeCamera(1.5, this.taoNode, 2);
        cc.tween(this.bangFei)
        .to(2,{x:880})
        .call(()=>{            
            cc.director.emit("绑匪摔倒");
            this.effect.active = true;
        })
        .delay(1)
        .call(()=>{            
            AD.gameScene.createDialog("谢谢你，小松鼠！", config.roleType.HUMAN);
            this.complete();
        })
        .start();
        
    },
});
