

cc.Class({
    extends: cc.Component,

    properties: {
        shaiZi: cc.Node,
    },

    onLoad() {
        cc.systemEvent.setAccelerometerEnabled(true); //设置是否开启重力传感
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this); //注册重力传感响应事件

        this.speed = cc.v2(0, 0);

        this.initCollision();
        this.anim = this.shaiZi.getComponent(sp.Skeleton);
        this.playAct("点数", Tools.random(1, 6))
        this.yuanPos = this.shaiZi.position;
    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this); //取消重力传感响应事件
    },

    //x,y,z方向的重力感应加速度
    onDeviceMotionEvent(event) {
        console.log("event name:", event.type, " acc x:", event.acc.x, " acc y:", event.acc.y, " acc z:", event.acc.z); //单位是g=9.8m/s^2
        this.speed.x = event.acc.x;
        this.speed.y = event.acc.y;

        (this.anim.animation != "gundong")
        this.shaiZi.getComponent(cc.RigidBody).applyLinearImpulse( cc.v2(this.speed.x * 20000,  this.speed.y * 20000),
                this.shaiZi.getComponent(cc.RigidBody).getWorldCenter(), true);
                
        // let rightBody = this.shaiZi.getComponent(cc.RigidBody)
        // rightBody.linearVelocity = cc.v2(rightBody.linearVelocity.x + dt * this.speed.x * 20000, rightBody.linearVelocity.y + dt * this.speed.y * 20000)
    },
    start() {

    },

    update(dt) {
      

        var _dis = Tools.getDistance(this.yuanPos, this.shaiZi.position);

        if (_dis > 5) {

            this.playAct("滚动")
        }
        else {
            this.playAct("点数", Tools.random(1, 6))
        }
        this.yuanPos = this.shaiZi.position;
    },

    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素


        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // m
    },
    playAct(_name, ...data) {
        switch (_name) {
            case "待机":
                this.anim.setAnimation(0, "daiji" + Tools.random(1, 6), false);
                break;
            case "滚动":
                if (this.anim.animation != "gundong") {
                    this.anim.setAnimation(0, "gundong", true);
                }
                break;
            case "点数":
                if (this.anim.animation == "gundong")
                    this.anim.setAnimation(0, data[0] + "d", false);
                break;
        }
    },
});
