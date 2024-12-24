

cc.Class({
    extends: cc.Component,

    properties: {
        bedUpgrade: cc.Prefab,
        doorUpgrade: cc.Prefab,
        paoUpgrade: cc.Prefab,
        paoCreate: cc.Prefab,
    },

    onLoad() {
        cc.director.on("升级床弹窗", (_caller) => {
            var _dialog = cc.instantiate(this.bedUpgrade);
            _dialog.getComponent("mengGuiSuShe_upgrade_bed").reset(_caller.bedLevel+1,_caller.isDown);
            _dialog.parent = this.node;
            if (_caller.isDown)
                _dialog.y = -400;
            else
            {
                _dialog.y = 400;
                _dialog.angle = 180;
            }
        }, this);
        cc.director.on("升级门弹窗", (_caller) => {
            var _dialog = cc.instantiate(this.doorUpgrade);
            _dialog.getComponent("mengGuiSuShe_upgrade_door").reset(_caller.doorLevel+1,_caller.isDown);
            _dialog.parent = this.node;
            if (_caller.isDown)
                _dialog.y = -400;
            else
            {
                _dialog.y = 400;
                _dialog.angle = 180;
            }
        }, this);
        cc.director.on("升级炮弹窗", (_caller) => {
            var _dialog = cc.instantiate(this.paoUpgrade);
            _dialog.getComponent("mengGuiSuShe_upgrade_pao").reset(_caller.doorLevel+1,_caller.isDown,_caller.index);
            _dialog.parent = this.node;
            if (_caller.isDown)
                _dialog.y = -400;
            else
            {
                _dialog.y = 400;
                _dialog.angle = 180;
            }
        }, this);
        cc.director.on("建造炮弹窗", (_paoDi) => {
            var _dialog = cc.instantiate(this.paoCreate);
            _dialog.getComponent("mengGuiSuShe_create_pao").reset(_paoDi);
            _dialog.parent = this.node;
            if (_paoDi.y < 0)
                _dialog.y = -400;
            else
            {
                _dialog.y = 400;
                _dialog.angle = 180;
            }
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
