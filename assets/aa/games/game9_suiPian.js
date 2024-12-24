
cc.Class({
    extends: cc.Component,

    properties: {

    },


    // onLoad () {},

    start() {

    },

    reset() {
        
        var _direction = Tools.random(-360, 360);
        
        this.act = cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .by(1, { angle:_direction})
            );
            
        this.node.scale = Tools.random(5, 15) * 0.1;
        this.scaleTemp = this.node.scale;
        this.act.start();
        this.node.opacity = 255;
        this.node.x = Tools.random(-100, 100);
        this.node.y = Tools.random(-100, 0);
        this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-800 * this.scaleTemp * this.scaleTemp, 800 * this.scaleTemp * this.scaleTemp),
            Tools.random(1200 * this.scaleTemp * this.scaleTemp, 1800 * this.scaleTemp * this.scaleTemp)),
            // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, 2500),
            this.node.getComponent(cc.RigidBody).getWorldCenter(), true);

        this.targetY = Tools.random(-340, 70);
    },
    update(dt) {
        if (this.node.y <= this.targetY && this.node.getComponent(cc.RigidBody).linearVelocity.y < 0) {
            if (this.targetY > -260) {
                if (this.node.y != this.targetY) {
                    this.node.y = this.targetY;
                    this.targetX = this.node.x;
                    this.act.stop();

                    this.node.getComponent(cc.RigidBody).linearDamping = 100
                    this.node.getComponent(cc.RigidBody).linearVelocity.y = 0
                    this.node.getComponent(cc.RigidBody).linearVelocity.x = 0
                    this.node.getComponent(cc.RigidBody).gravityScale = 0;
                    cc.tween(this.node)
                        .delay(Tools.random(30, 50) * 0.1)
                        .to(1, { opacity: 0 })
                        .call(() => {
                            this.node.destroy();
                            
                        })
                        .start();
                }

                this.node.x = this.targetX;
                this.node.y = this.targetY;

            }
            else {
                if (this.node.y < -cc.winSize.height / 2 - 100) {
                    this.node.destroy();
                }
            }
        }
    },
});
