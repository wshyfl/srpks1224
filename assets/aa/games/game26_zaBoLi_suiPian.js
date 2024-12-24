

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start() {
        // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-800, 800), Tools.random(800, 1800)),
        //     this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
        var _angle = Tools.getAngle(this.node.position,AD.pos);
        this.vx = -Math.sin(Tools.angleToRadian(_angle)) * 1;
        this.vy = Math.cos(Tools.angleToRadian(_angle)) * 1;
        var _dis =  Tools.getDistance(AD.pos,this.node.position);
        var _rate = 100/_dis;
        var _force = 1000;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.vx *_force,this.vy*_force);

            var _angle = 1;
            if(Tools.random(0,1)==0)
            _angle=-1;
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                .by(Tools.random(15,20)*0.1,{angle:360*_angle})
                
            )
            .start();
    },

    update(dt) {
        if (this.node.y <= -cc.winSize.height / 2 - 300)
        this.node.destroy();
    },
});
