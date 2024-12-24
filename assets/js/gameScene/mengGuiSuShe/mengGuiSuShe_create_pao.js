
cc.Class({
    extends: cc.Component,

    properties: {
        paoItemUp: cc.Prefab,
        paoItemDown: cc.Prefab,
        btnUpgrade: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    reset(_paoDi) {
        this.paoParent = _paoDi;
        this.isDown = (_paoDi.y < 0);
        this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= 8);
        this.schedule(() => {
            this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= 8);
        }, 1)
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "建造":
                window.mengGuiSuShe.setCoinNum(-8, this.isDown);
                this.createPao();
                Tools.resetDialog2(this.node, false);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;
        }
    },
    createPao() {
        
        AD.audioMng.playSfx("猛鬼建筑");
        if (this.isDown)
            var _pao = cc.instantiate(this.paoItemDown);
        else
            var _pao = cc.instantiate(this.paoItemUp);
        this.paoParent.children[0].scale = 0;
        _pao.parent = this.paoParent;
        _pao.position = cc.v2(0, 0);

    },
    // update (dt) {},
});
