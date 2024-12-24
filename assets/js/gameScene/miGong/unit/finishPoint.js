

cc.Class({
    extends: cc.Component,

    properties: {
        spr: cc.Sprite,
        sprFrame: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.targetIndex = null;
    },

    start() {

    },
    reset(_index) {
        this.targetIndex = _index;//-1:角色1 2都能触发效果  0:角色1才能触发效果  1:角色2才能触发效果
        if (_index == 1)
            this.spr.spriteFrame = this.sprFrame;
    },

    onCollisionEnter: function (other, self) {
        if (other.tag == 100 && this.targetIndex != null) {
            var _playerType = other.node.getComponent("miGong_player").playerType;
            if (this.targetIndex == -1){                
                cc.director.emit("到达终点", _playerType);
                AD.gameScene.playSfx("穿越");
            }
            else {
                if (_playerType != this.targetIndex) {
                    cc.director.emit("到达终点", _playerType);
                    AD.gameScene.playSfx("穿越");
                }
            }
        }
    },

    // update (dt) {},
});
