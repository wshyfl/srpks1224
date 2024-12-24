
cc.Class({
    extends: cc.Component,

    properties: {
        animNode: cc.Node,
        animParent: cc.Node,
        colorNode: cc.Node,
        btnUnlock: cc.Node,
        btnTry: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (AD.chanelName == "android" && AD.delayTime != 1) {
            this.node.destroy();
        }
        var _arr = new Array();
        this.isFree = (globalData.tuiJianIndex % 2 == 0);
        for (var i = 0; i < globalData.modeName.length; i++) {
            if (globalData.getModeUnlockState(globalData.modeName[i]) == this.isFree) {
                _arr.push(i);
            }
        }
        if (_arr.length == 0) {
            this.node.destroy();
            // return;
        }

        globalData.tuiJianIndex++;
        _arr = Tools.getNewArr(_arr, _arr.length);
        this.modeName = globalData.modeName[_arr[0]];
        if (this.modeName == "木头人" || this.modeName == "暴打波比") {
            this.node.destroy();
        }

        var _name = this.modeName;
        var _animIndex = Tools.getIndexInArray(globalData.modeName, _name);
        var _anim = cc.instantiate(this.animNode.children[_animIndex]);
        _anim.parent = this.animParent;
        _anim.y = -120;
        var animN = _anim.getComponent(sp.Skeleton);
        animN.setAnimation(0, "daiji", true);
        var _color = [[160, 103, 208], [102, 215, 154], [218, 172, 107]];
        var _index = Tools.random(0, _color.length - 1);
        _index = 2;
        this.colorNode.color = new cc.Color(_color[_index][0], _color[_index][1], _color[_index][2])

        this.btnUnlock.active = !this.isFree;
        this.btnTry.active = this.isFree;
        cc.tween(this.btnUnlock)
            .repeatForever(
                cc.tween()
                    .to(0.3, { scale: 1.1 })
                    .to(0.3, { scale: 1.0 })
            )
            .start();
        cc.tween(this.btnTry)
            .repeatForever(
                cc.tween()
                    .to(0.3, { scale: 1.1 })
                    .to(0.3, { scale: 1.0 })
            )
            .start();
    },

    start() {

    },
    onEnable() {

        Tools.resetDialog2(this.node, true);
    },
    //
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "返回":
                Tools.resetDialog2(this.node, false);
                break;
            case "解锁":
                AD.showAD(this.unlockSucess, this);
                break;
            case "试试":
                window.modeType = this.modeName;
                cc.director.loadScene("readyScene");
                break;

        }
    },
    unlockSucess() {


        globalData.setModeUnlockState(this.modeName);
        // cc.director.emit("系统提示", "新模式解锁");

        window.modeType = this.modeName;
        cc.director.loadScene("readyScene");
    },
    // update (dt) {},
});
