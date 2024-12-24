

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.onBallNow = false;

    },
    reset() {
        this.onBallNow = false;
        this.node.x = 0;
        this.node.y = -cc.winSize.height / 2 - this.node.height / 2;
        this.couldMove = false;
        cc.director.on("发射", () => {
            this.couldMove = true;
            AD.audioMng.playSfx("见缝插针");
        
            
        }, this);
        cc.director.on("重置", () => {
            if(this.onBallNow)
            this.node.destroy();
        
            
        }, this);
        cc.tween(this.node)
            .by(0.1, { y: this.node.height  })
            .call(() => {
               
            })
            .start();
    },

    onCollisionEnter(other, self) {
        
        
        if (self.tag == 0 && other.tag == 66) {
            var _pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let start_pos = other.node.convertToNodeSpaceAR(_pos1);
            this.node.parent = other.node;
            this.node.position = start_pos;
            this.onBallNow=true;

            this.node.angle = -other.node.angle
            AD.game21.createNewZhen();
            cc.director.emit("增加");
            this.node.zIndex = -1;
        }
        if(AD.game21.wuDi==false){
            if (self.tag == 1 && other.tag == 1) {
                console.log("死亡");
                cc.director.emit("游戏结束");
            }
        }
    },
    update(dt) {
        if (this.onBallNow) return;
        if (this.couldMove)
            this.node.y += 4000*dt;
    },
});
