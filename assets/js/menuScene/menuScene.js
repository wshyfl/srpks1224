
cc.Class({
    extends: cc.Component,

    properties: {
        panels: [cc.Node],
        animNode: cc.Node,
        toggleContainer: cc.Node,
        btnAddToDesktop: cc.Node,
        animGui: cc.Node,
    },


    // onLoad () {},

    start() {
        // if (AD.chanelName == "oppo") {
        //     if (AD.anlGui) {
        //         this.animGui.active = true;
        //     } else {
        //         this.animGui.active = false;
        //     } 
        // }
        AD.audioMng.playMusic();
        var _height = cc.winSize.height - 1280;
        for (var i = 0; i < 2; i++) {
            cc.find("view/content", this.panels[i]).height -= _height;
            var _arr = cc.find("view/content", this.panels[i]).children;
            for (var j = 0; j < _arr.length; j++) {
                _arr[j].y += 20
                var _name = _arr[j].name;
                var _animIndex = Tools.getIndexInArray(globalData.modeName, _name);
                var _anim = cc.instantiate(this.animNode.children[_animIndex]);
                _anim.parent = cc.find("animation", _arr[j]);
                _anim.y = -110;
                _anim.scale = 0.7;
                var animN = _anim.getComponent(sp.Skeleton);
                animN.setAnimation(0, "daiji", true);

            }
            this.panels[i].active = (i == globalData.modeIndex);

            this.toggleContainer.children[i].getComponent(cc.Toggle).isChecked = (i == globalData.modeIndex);
        }

        if (globalData.firstToMenu) {
            globalData.firstToMenu = false;
        }
        else {

            this.scheduleOnce(() => {

                cc.director.emit("模式推荐");
            }, 0.5)
            AD.showBanner();
            AD.chaPing();
            // AD_vivo.showBox();
        }


        if (AD.chanelName == "oppo" && AD.wuDianRate == 20) {
            this.btnAddToDesktop.active = true;
        } else {
            this.btnAddToDesktop.active = false;
        }

        if (AD.chanelName == "android")
            this.btnAddToDesktop.active = false

    },
    btnCallBackMode(event, type) {
        AD.audioMng.playSfx("按钮");
        window.modeType = type;
        if (event.target.getChildByName("isHeZuo"))
            window.isHeZuo = true;
        else
            window.isHeZuo = false;
        console.log("window.isHeZuo  " + window.isHeZuo)
        if (event.target.getChildByName("ADChecker").active) //还未解锁         
        {
            var _isTimmer = event.target.getChildByName("ADChecker").getComponent("ADChecker").isTimmer;
            if (_isTimmer)//时间解锁
                cc.director.emit("系统提示", "时间还没到,请耐心等待");
            else {//视频解锁
                AD.showAD(this.unlockSucess, this);
            }
        }
        else
            cc.director.loadScene("readyScene");
    },

    unlockSucess() {
        globalData.setModeUnlockState(window.modeType);
        cc.director.loadScene("readyScene");
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "添加桌面":
                AD.addToDesk();
                break;
            case "更多游戏":
                AD.moreGame();
                break;
            default:
                for (var i = 0; i < 2; i++) {
                    this.panels[i].active = (i == type);
                }
                globalData.modeIndex = type;
                break;
        }

    },
    // update (dt) {},
});
