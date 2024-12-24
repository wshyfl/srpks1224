
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);



    },
    reset() {
        this.isSpecial = false;
        this.couldControl = true;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        if (!AD.game16.hadCreateTarget) {
            AD.game16.hadCreateTarget = true;
            this.isSpecial = true;
            this.node.zIndex = -1;
            this.node.getComponent(cc.Sprite).spriteFrame = AD.game16.targetSpr;
        }
        else {

            this.node.zIndex = 0;
            var _sprIndex = Tools.random(0, AD.game16.sprsParent.children.length - 1)
            while (_sprIndex == AD.game16.targetSprIndex) {
                _sprIndex = Tools.random(0, AD.game16.sprsParent.children.length - 1)
            }
            this.node.getComponent(cc.Sprite).spriteFrame = AD.game16.sprArr[_sprIndex];
        }

        this.node.position = cc.v2(Tools.random(-300, 300), Tools.random(AD.game16.down.y + 50, AD.game16.up.y - 50));

        this.node.angle = Tools.random(0, 360)
    },

    onTouchStart(event) {
        if (!this.couldControl) return;
        this.timeStart = Tools.getDate("millisecond");
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.moveTempX = 0;
        if(this.isSpecial){
            this.scheduleOnce(()=>{
                AD.audioMng.playSfx("确定");

                cc.director.emit("找到了");
                cc.tween(this.node)
                .to(0.2,{opacity:0})
                .to(0.2,{opacity:255})
                .to(0.2,{opacity:0})
                .to(0.2,{opacity:255})
                .to(0.2,{opacity:0})
                .to(0.2,{opacity:255})
                .to(0.2,{opacity:0})
                .to(0.2,{opacity:255})
                .call(()=>{
                    this.end();
                })
                .start();
            },2)
            
          
         
        }
    },

    onTouchMove(event) {
        if (!this.couldControl) return;
        this.node.x += event.getDelta().x;
        this.node.y += event.getDelta().y;

        var _timeSum = (Tools.getDate("millisecond") - this.timeStart) / 50;//用时S
        this.speedX = event.getDelta().x / _timeSum;
        this.speedY = event.getDelta().y / _timeSum;

        this.timeStart = Tools.getDate("millisecond");
        this.starPos = event.getLocation();
        if (this.isSpecial) {
            this.node.zIndex = 1;
        }
    },
    onTouchEnd(event) {
        if (!this.couldControl) {

            return;
        }
        // this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.speedX * 8, this.speedY * 8);

        // this.node.getComponent(cc.RigidBody).angularVelocity = Tools.random(-100, 100)
        // if (this.isSpecial) {
        //     this.zIndex = 1;
        // }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (this.isSpecial && this.node.zIndex == 1 && this.couldControl) {
            if (otherCollider.tag == 666) {
                this.couldControl = false;
                this.end();
            }

        }
    },
    // update(dt) {

    // },
    end() {
        this.scheduleOnce(() => {
            if (this.node.getComponent(cc.RigidBody).type == cc.RigidBodyType.Dynamic) {

                this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
                cc.tween(this.node)
                    .to(0.2, { position: AD.game16.targetNode.position, angle: 0 })
                    .call(() => {
                        AD.game16.reset();
                    })
                    .start();
            }
        }, 0.05)
    },
});
