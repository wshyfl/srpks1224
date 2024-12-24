

cc.Class({
    extends: cc.Component,

    properties: {
        yuJingNode: cc.Node,
        daoDanNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
      
    },

    start() {
        if (this.node.y < 0) {

            this.daoDanNode.x = 360+100;
            this.speed = -6;
            this.yuJingNode.x = 290;
        }
        else {
            this.speed = 6;
            this.yuJingNode.x = -290;
            this.daoDanNode.scaleX = -1;
            this.yuJingNode.angle = 180;
            this.daoDanNode.x = -360-100;
        }
        this.couldMove = false;
        this.yuJingNodeScale = this.yuJingNode.scaleX;
        cc.tween(this.yuJingNode)
        .repeat(3,
            cc.tween()
            .to(0.2,{scale:1.1*this.yuJingNodeScale,opacity:100})
            .to(0.2,{scale:1*this.yuJingNodeScale,opacity:255})
        )
        .to(0.1,{scale:0})
        .call(()=>{
            this.couldMove = true;
            AD.audioMng.playSfx("导弹");
        })
        .start();
    },

    update(dt) {
        if( !this.couldMove)return
        this.daoDanNode.x += this.speed;
        if (this.node.y < 0) {
            if (this.daoDanNode.x < -360 - 120)
                this.node.destroy();
        }
        else {
            if (this.daoDanNode.x > 360 + 120)
                this.node.destroy();
        }
    },
});
