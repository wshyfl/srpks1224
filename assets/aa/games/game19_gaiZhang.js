

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode: cc.Node,
        zhang: cc.Node,
        sprNode: cc.Node,
        maskNode: cc.Node,
        sprArr: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.targetPos = cc.v2(0, 0);
        this.zhangPos = this.zhang.position;
        this.zhangScale = this.zhang.scale;
        this.couldTouch = true;
        this.touchNode.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (!this.couldTouch) return;
            this.couldTouch = false;
            let start_pos = this.maskNode.parent.convertToNodeSpaceAR(event.getLocation());

            this.zhangPos = cc.v2(start_pos.x, start_pos.y + 400);
            this.zhang.position = this.zhangPos
            this.zhang.opacity = 0;
            cc.tween(this.zhang)
                .to(0.1, { scale: 1, position: start_pos, opacity: 255 })
                .call(() => {
                    this.createZhang(cc.v2(start_pos.x, start_pos.y - this.maskNode.y));
                })
                .delay(0.3)
                .to(0.1, { scale: 1.5, position: this.zhangPos, opacity: 0 })
                .delay(0.1)
                .call(() => {
                    this.couldTouch = true;
                })
                .start();

        }, this);
        this.sprNode.scale = 0;
    },

    start() {

    },

    createZhang(_pos) {
        AD.audioMng.playSfx("盖章");
        cc.tween(this.node)
            .to(0.05, { scale: 0.99 })
            .to(0.05, { scale: 1 })
            .start();

        var _item = cc.instantiate(this.sprNode);
        _item.scale = 0.8;
        _item.position = _pos;
        _item.parent = this.sprNode.parent;
        _item.getComponent(cc.Sprite).spriteFrame = this.sprArr[Tools.random(0, this.sprArr.length - 1)];
        _item.angle = Tools.random(-45,45)
    }

    // update (dt) {},
});
