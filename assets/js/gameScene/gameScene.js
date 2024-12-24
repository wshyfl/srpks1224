

cc.Class({
    extends: cc.Component,

    properties: {
        dug: true,
        modePrefab: [cc.Prefab],
    },

    onLoad() {
        if (!this.dug)
            this.createMode();
        else {
            window.isAI = true;
            window.isHeZuo = false;
        }
        console.log("window.isHeZuo " +window.isHeZuo)
    },
    createMode() {
        var _modexIndex = -1;
        switch (window.modeType) {
            case "桌面弹球":
                _modexIndex = 0;
                break;
            case "漂移赛车":
                _modexIndex = 1;
                break;
            case "飞刀大战":
                _modexIndex = 2;
                break;
            case "炮弹战船":
                _modexIndex = 3;
                break;
            case "拔河比拼":
                _modexIndex = 4;
                break;
            case "太空杀":
                _modexIndex = 5;
                break;
            case "暴打波比":
                _modexIndex = 6;
                break;
            case "城堡攻防":
                _modexIndex = 7;
                break;
            case "河马捞球":
                _modexIndex = 8;
                break;
            case "坦克大战":
                _modexIndex = 9;
                break;
            case "茶叶蛋":
                _modexIndex = 10;
                break;
            case "猛鬼宿舍热门":
                _modexIndex = 11;
                break;
            case "猛鬼宿舍合作":
                _modexIndex = 11;
                break;
            case "木头人":
                _modexIndex = 12;
                break;
            case "地球护卫队":
                _modexIndex = 13;
                break;
            case "双人枪战":
                _modexIndex = 14;
                break;
            case "大西瓜":
                _modexIndex = 15;
                break;
            case "足球大战":
                _modexIndex = 16;
                break;
            case "抢地盘":
                _modexIndex = 17;
                break;
            case "双人迷宫":
                _modexIndex = 18;
                break;
        }
        if (_modexIndex != -1) {
            var _mode = cc.instantiate(this.modePrefab[_modexIndex]);
            _mode.parent = cc.find("Canvas/gameNode");
        }
    },

    start() {
        AD.showBanner();
        AD_vivo.showBox();
        cc.director.on("游戏结束", (_isDown) => {

            console.log("游戏结束 获胜方是：  " + _isDown)
        }, this);
        cc.director.on("游戏平局", (_downWin) => {

        }, this)

    },

    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "暂停":
                cc.director.emit("暂停界面");
                break;
                
        }
    }
    // update (dt) {},
});
