

cc.Class({
    extends: cc.Component,

    properties: {
        btnVSPerson: cc.Node,
        btnVSPC: cc.Node,
        btnBegin: cc.Node,

        animNode: cc.Node,
        animParent: cc.Node,
        colorNode: cc.Node,
        nameLabel: cc.Sprite,
        nameParent: cc.Node,
        tips: cc.Label,
        animGui: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // if (AD.chanelName == "oppo") {
        //     if (AD.anlGui) {
        //         this.animGui.active = true;
        //     } else {
        //         this.animGui.active = false;
        //     } 
        // }
        AD.showBanner();
        AD.chaPing();
        AD_vivo.showBox();
        this.tips.string = globalData.getGuide(window.modeType, "准备界面");
        window.isAI = false;
        this.btnVSPerson.active = this.btnVSPC.active = !window.isHeZuo;
        this.btnBegin.active = window.isHeZuo;


        var _name = window.modeType;
        var _animIndex = Tools.getIndexInArray(globalData.modeName, _name);
        var _anim = cc.instantiate(this.animNode.children[_animIndex]);
        _anim.parent = this.animParent;
        _anim.y = -120;
        var animN = _anim.getComponent(sp.Skeleton);
        animN.setAnimation(0, "daiji", true);
        var _color = [[160, 103, 208], [102, 215, 154], [218, 172, 107]];
        var _index = Tools.random(0, _color.length - 1);
        _index = 2;
        this.colorNode.color = new cc.Color(_color[_index][0], _color[_index][1], _color[_index][2]);
        this.nameLabel.spriteFrame = this.nameParent.children[_animIndex].getComponent(cc.Sprite).spriteFrame;
    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "AI":
                window.isAI = true;
                cc.director.loadScene("gameScene");

                AD.audioMng.stopMusic();
                break;
            case "双人":
                window.isAI = false;
                cc.director.loadScene("gameScene");
                AD.audioMng.stopMusic();
                break;
            case "关闭":
                cc.director.loadScene("menuScene");
                break;
            case "开始游戏":
                cc.director.loadScene("gameScene");
                AD.audioMng.stopMusic();
                break;
        }
    },
    // update (dt) {},
});
