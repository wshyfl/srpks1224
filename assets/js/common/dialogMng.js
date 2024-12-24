
cc.Class({
    extends: cc.Component,

    properties: {
        dialogOver: cc.Prefab,
        dialogTuiJian: cc.Prefab,
        dialogPause: cc.Prefab,


    },
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.director.on("游戏结束", (_isDown) => {
            var _dialog = cc.instantiate(this.dialogOver);
            _dialog.parent = cc.find("Canvas/dialogMng");
            if (_isDown)
                _dialog.getComponent("dialogOver").reset(0);
            else
                _dialog.getComponent("dialogOver").reset(1);
            AD.chaPing(true);
            AD.showBanner(true);
        }, this);
        cc.director.on("游戏平局", () => {
            var _dialog = cc.instantiate(this.dialogOver);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogOver").reset(2);
            AD.chaPing(true);
            AD.showBanner(true);
        }, this);
        cc.director.on("合作模式结算", (_second) => {
            var _dialog = cc.instantiate(this.dialogOver);
            _dialog.parent = cc.find("Canvas/dialogMng");
            _dialog.getComponent("dialogOver").reset(3,_second);
            AD.chaPing(true);
            AD.showBanner(true);
        }, this);
        cc.director.on("模式推荐", () => {
            var _dialog = cc.instantiate(this.dialogTuiJian);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing();
            AD.showBanner();
        }, this);
        cc.director.on("暂停界面", () => {
            var _dialog = cc.instantiate(this.dialogPause);
            _dialog.parent = cc.find("Canvas/dialogMng");
            AD.chaPing(true);
            AD.showBanner();
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
