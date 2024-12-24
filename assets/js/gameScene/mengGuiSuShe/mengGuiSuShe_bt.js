

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    reset(_angle,_hurtNum) {
        AD.audioMng.playSfx("猛鬼开火");
        this.hurtNum = _hurtNum;
        this.vx = -Math.sin(this.angleToRadian(_angle)) * 20;
        this.vy = Math.cos(this.angleToRadian(_angle)) * 20;
    },

    start() {

    },

    update(dt) {
        this.node.x += this.vx;
        this.node.y += this.vy;
        if(this.node.x>370 || this.node.x <-370|| this.node.y <-800||this.node.y>800)
        window.mengGuiSuShe.btPool.put(this.node)
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
    onCollisionEnter(other, self) {
        if (other.tag == 100) {
            window.mengGuiSuShe.btPool.put(this.node)
            window.mengGuiSuShe.createEffect("女鬼被攻击",this.node.position)
            other.node.getComponent("mengGuiSuShe_nvGui").beHurt(this.hurtNum);
        }
    },
});
