

cc.Class({
    extends: cc.Component,

    properties: {
        guang:cc.Node,
    },
    onLoad() {
        this.anim = this.node.getComponent(sp.Skeleton);
        this.playAct("待机开始");
    },
    start() {
        this.guang.active = false;
        this.zhengYanTime = 2;
        var self = this;
        this.anim.setCompleteListener((event) => {
            // console.log("动作播放完毕 " + event.animation.name)
            switch (event.animation.name) {
                case "biyan":
                    cc.director.emit("停止检测")
                    break;
                case "zhengyan":
                    self.playAct("观察");
                    cc.director.emit("开始检测");
                    self.zhengYanTime = 0;

                    break;
            }
        }, this)

        //默认是睁开眼的
        this.playAct("观察")
        this.scheduleOnce(()=>{

            
        },1)

        cc.director.on("木头人开始", () => {
            this.closeEye();
            this.funcPlaySfx();//首次播放音效
        }, this)
        cc.director.on("123木头人音效播放完毕", () => {//开始检测是否有人在动  
            this.openEye();
        }, this);
    },

    openEye() {
        // this.bigGirl.children[0].active = true;

        this.playAct("睁眼")
        this.guang.active = true;
        
    },
    closeEye() {
        this.guang.active = false;
        this.playAct("闭眼");
        cc.director.emit("闭眼了");
    },
    update(dt) {
        if (this.zhengYanTime < 1.5) {
            if (window.muTouRen.beginNow)
                this.zhengYanTime += dt;
            if (this.zhengYanTime >= 1.5) {
                this.closeEye();
                //随机停留一段时间 再次播放音效
                // var _timeForWait = Tools.random(150, 200) * 0.01;
                this.funcPlaySfx();//重复播放音效
            }
        }
    },
    funcPlaySfx() {
        var _time = Tools.random(10, 20) * 0.1;
        this.scheduleOnce(() => {
            if (!this.gameOver)
                window.muTouRen.playSfx("木头人");
        }, _time);
    },
    //小女孩的动作
    playAct(_actName) {
        switch (_actName) {
            case "待机":
                if (this.anim.animation != "daiji") {
                    this.anim.timeScale = 2;
                    this.anim.setAnimation(0, "daiji", true);
                }
                break;
            case "闭眼":
                if (this.anim.animation != "biyan") {
                    this.anim.timeScale = 15;
                    this.anim.setAnimation(0, "biyan", false);
                }
                break;
            case "睁眼":
                if (this.anim.animation != "zhengyan") {
                    this.anim.timeScale = 15;
                    this.anim.setAnimation(0, "zhengyan", false);
                }
                break;
            case "观察":
                if (this.anim.animation != "guancha") {
                    this.anim.timeScale = 2;
                    this.anim.setAnimation(0, "guancha", true);
                }
                break;
        }
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },

});
