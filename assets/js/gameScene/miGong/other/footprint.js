

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.liftDuration = 0;
    },

    start() {
        cc.tween(this.node)
        .delay(3)
        .to(2,{opacity:0})
        .call(()=>{
            this.node.destroy();
        })
        .start();
    },

    onCollisionStay: function (other, self) {
        if (other.tag == 111)//碰到角色
        {
            if (this.liftDuration >= 0.1)
             {
                this.node.destroy();
             }
        }
    },
    update(dt) {
        this.liftDuration += dt;
    },
});
