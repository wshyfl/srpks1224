window.globalData = {

    clearDataNow: false,//清除数据吗?
    keyFirst: "key_firstShuangRenPKSai0",
    keyData: "key_dataShuangRenPKSai0",
    firstToMenu: true,
    miGongLevel: 0,
    showTuiJian: false,
    tuiJianIndex: 0,
    modeIndex: 0,
    modeName: [
        "桌面弹球",//0
        "漂移赛车",//1
        "飞刀大战",//2
        "炮弹战船",//3
        "拔河比拼",//4
        "太空杀",//5
        "暴打波比",//6
        "城堡攻防",//7
        "河马捞球",//8
        "坦克大战",//9
        "茶叶蛋",//10
        "猛鬼宿舍热门",//11
        "猛鬼宿舍合作",//12
        "木头人",//13
        "地球护卫队",//14
        "大西瓜",//15
        "双人枪战",//16
        "双人迷宫",//17
        "足球大战",//18
        "抢地盘",//19
    ],
    data: {
        onlineSecond: 0,
        modeUnlockState: {//模式解锁状态
            "桌面弹球": true,
            "漂移赛车": true,
            "飞刀大战": true,
            "炮弹战船": false,
            "拔河比拼": true,
            "太空杀": true,
            "暴打波比": false,
            "城堡攻防": false,
            "河马捞球": false,
            "坦克大战": false,
            "茶叶蛋": true,
            "猛鬼宿舍热门": false,
            "猛鬼宿舍合作": false,
            "木头人": true,
            "地球护卫队": true,
            "大西瓜": false,
            "双人枪战": false,
            "双人迷宫": true,
            "足球大战": true,
            "抢地盘": true,
        },
        modeScoreMax: {//最高记录
            "桌面弹球": 0,
            "漂移赛车": 0,
            "飞刀大战": 0,
            "炮弹战船": 0,
            "拔河比拼": 0,
            "太空杀": 0,
            "暴打波比": 0,
            "城堡攻防": 0,
            "河马捞球": 0,
            "坦克大战": 0,
            "茶叶蛋": 0,
            "猛鬼宿舍热门": 0,
            "猛鬼宿舍合作": 0,
            "木头人": 0,
            "地球护卫队": 0,
            "大西瓜": 0,
            "双人枪战": 0,
            "双人迷宫": 0,
            "足球大战": 0,
            "抢地盘": 0,
        },
        guideState: {//指引
            "桌面弹球": false,
            "漂移赛车": false,
            "飞刀大战": false,
            "炮弹战船": false,
            "拔河比拼": false,
            "太空杀": false,
            "暴打波比": false,
            "城堡攻防": false,
            "河马捞球": false,
            "坦克大战": false,
            "茶叶蛋": false,
            "猛鬼宿舍热门": false,
            "猛鬼宿舍合作": false,
            "木头人": false,
            "地球护卫队": false,
            "大西瓜": false,
            "双人枪战": false,
            "双人迷宫": false,
            "足球大战": false,
            "抢地盘": false,
        },
    },
    getGuideState(_modeName) {
        var _key = Tools.getValueFromObj(this.data.guideState, _modeName);
        return _key;
    },
    setGuideState(_modeName) {
        var _sucess = Tools.setValueFromObj(this.data.guideState, _modeName, true);
        if (_sucess) {
            console.log("指引完毕 " + _modeName)
            this.saveData();
        }
    },

    getGuide(_modeName, _placeName) {
        var _config = null;
        for (var i = 0; i < AD.tipsJSON.length; i++) {
            if (AD.tipsJSON[i].Mode_Name == _modeName) {
                _config = AD.tipsJSON[i];
                break;
            }
        }
        if (_config == null) {
            console.warn("指引配置获取失败  " + _modeName);
            return;
        }
        var _result = null;
        switch (_placeName) {
            case "准备界面":
                _result = _config.Mode_Ready;
                break;
            case "玩法提示":
                _result = _config.Mode_Tips;
                break;
            case "玩法指引":
                _result = _config.Mode_Guide;
                break;
            case "指引类型":
                _result = _config.Mode_Type;
                break;
        }
        if (_result == null) {
            console.warn("指引配置获取失败**  " + _placeName);
            return;
        }
        return _result;

    },
    getModeScoreMax(_modeName) {
        var _key = Tools.getValueFromObj(this.data.modeScoreMax, _modeName);
        return _key;
    },
    setModeScoreMax(_modeName, _num) {
        if (_num > this.getModeScoreMax()) {
            var _sucess = Tools.setValueFromObj(this.data.modeScoreMax, _modeName, _num);
            if (_sucess) {
                cc.director.emit("新纪录");
                console.log("新纪录 " + _modeName)
                this.saveData();
            }
        }

    },
    getModeUnlockState(_modeName) {
        var _key = Tools.getValueFromObj(this.data.modeUnlockState, _modeName);
        return _key;
    },

    setModeUnlockState(_modeName) {
        var _sucess = Tools.setValueFromObj(this.data.modeUnlockState, _modeName, true);
        if (_sucess) {
            cc.director.emit("解锁模式");
            console.log("解锁模式 " + _modeName)
            this.saveData();
        }
    },



    getDataAll() {

        if (this.clearDataNow)
            globalData.clearAllData();
        cc.debug.setDisplayStats(false);
        if (cc.sys.localStorage.getItem(globalData.keyFirst) != 1) {
            cc.sys.localStorage.setItem(globalData.keyFirst, 1);
            globalData.saveData();
            cc.log("首次进入游戏")
            globalData.data = globalData.getData();

        }
        else {
            cc.log("非首次进入游戏 " + cc.sys.localStorage.getItem(globalData.keyFirst))
            globalData.data = globalData.getData();

        }



    },
    clearAllData() {
        cc.sys.localStorage.removeItem(globalData.keyFirst);
        cc.sys.localStorage.removeItem(globalData.keyData);
    },
    saveData() {

        cc.sys.localStorage.setItem(globalData.keyData, JSON.stringify(globalData.data));
    },
    getData() {
        var _res = cc.sys.localStorage.getItem(globalData.keyData);
        cc.log("_res = " + _res)
        if (_res != null)
            return JSON.parse(_res);

    },



    changeScene(_nextScene) {
        cc.director.emit("显示过场", _nextScene);
        // cc.director.loadScene(_nextScene);
    }
}