

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start() {
        // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-800, 800), Tools.random(800, 1800)),
        //     this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(Tools.random(-600,600),Tools.random(830,1600));

            var _angle = 1;
            if(Tools.random(0,1)==0)
            _angle=-1;
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                .by(Tools.random(5,20)*0.1,{angle:360*_angle})
                
            )
            .start();
    },

    update(dt) {
        if (this.node.y <= -cc.winSize.height / 2 - 300)
        this.node.destroy();
    },
});
