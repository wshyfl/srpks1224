

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.mouse = cc.find("mouse", this.node);
        this.cat = cc.find("cat", this.node);
        this.mousePos1 = cc.find("mousePos1", this.node);
        this.mousePos2 = cc.find("mousePos2", this.node);
        this.catPos1 = cc.find("catPos1", this.node);
        this.catPos2 = cc.find("catPos2", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = true;

        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物睡觉");
        cc.director.emit("老鼠待机");
        cc.director.emit("猫趴着");
        this.scheduleOnce(function () {
            AD.couldClear = true;//            
            AD.gameScene.createDialog("能不能帮我把猫咪弄下来", config.roleType.HUMAN);
        }, 1);

        AD.audioMng.playSfx("猫")

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.effect.active = false;
            this.mouseRun();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    mouseRun() {
        
        cc.director.emit("老鼠跑");
        this.scheduleOnce(function(){
            
        cc.director.emit("猫待机");
        },1)
        
        cc.tween(this.mouse)
            .delay(0.5)
            .call(()=>{
                AD.audioMng.playSfx("老鼠")
                cc.director.emit("老鼠跑");
            })
            .to(2, { position: this.mousePos1.position,scaleX:-0.8,scaleY:0.8 },{easing:"sineInOut"})
            .to(0.01, { scaleX: 0.8 })
            .call(() => {
                this.catRun();
            })
            .delay(0.2)
            .to(2, { position: this.mousePos2.position ,scale:1},{easing:"sineInOut"})            
            .start();
    },
    catRun() {
        
        cc.director.emit("猫跑");
        cc.tween(this.cat)
        .to(1.5, { position: this.catPos1.position,scale:1 },{easing:"sineInOut"})
        .to(2, { position: this.catPos2.position,scale:1.2 },{easing:"sineInOut"})
        .call(()=>{
            AD.gameScene.createDialog("谢谢你，这样我可以再睡会了", config.roleType.HUMAN);
            this.complete();
        })
        .start();
     },
});
