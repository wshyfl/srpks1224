
cc.Class({
    extends: cc.Component,

    properties: {
        tipsArr:[cc.Label]
    },

    onLoad() {

    },

    onEnable() {
        for(var i=0;i<3;i++){
            this.tipsArr[i].string = globalData.getGuide(window.modeType, "玩法指引");
            this.node.children[i].active = false;
        }
        this.type = globalData.getGuide(window.modeType, "指引类型");
        this.targetNode = this.node.children[this.type - 1];

        var _y = 400;
        this.posConfig = {
            "桌面弹球": [cc.v2(0, _y), cc.v2(0, -_y)],//0
            "漂移赛车": [cc.v2(0, _y), cc.v2(0, -_y)],//1
            "飞刀大战": [cc.v2(0, _y), cc.v2(0, -_y)],//2
            "炮弹战船": [cc.v2(0, _y), cc.v2(0, -_y)],//3
            "拔河比拼": [cc.v2(0, _y), cc.v2(0, -_y)],//4
            "太空杀": [cc.v2(0, _y), cc.v2(0, -_y)],//5
            "暴打波比": [cc.v2(0, _y), cc.v2(0, -_y)],//6
            "城堡攻防": [cc.v2(0, _y), cc.v2(0, -_y)],//7
            "河马捞球": [cc.v2(0, _y), cc.v2(0, -_y)],//8
            "坦克大战": [cc.v2(0, _y), cc.v2(0, -_y)],//9
            "茶叶蛋": [cc.v2(0, _y), cc.v2(0, -_y)],//10
            "猛鬼宿舍热门": [cc.v2(0, _y), cc.v2(0, -_y)],//11
            "猛鬼宿舍合作": [cc.v2(0, _y), cc.v2(0, -_y)],//12
            "木头人": [cc.v2(-200, -400), cc.v2(200, -400)],//13
            "地球护卫队": [cc.v2(0, _y), cc.v2(0, -_y)],//14
            "大西瓜": [cc.v2(0, _y), cc.v2(0, -_y)],//15
            "双人枪战": [cc.v2(0, _y), cc.v2(0, -_y)],//16
            "双人迷宫": [cc.v2(0, _y), cc.v2(0, -_y)],//17
            "足球大战": [cc.v2(0, _y), cc.v2(0, -_y)],//18
            "抢地盘": [cc.v2(0, _y), cc.v2(0, -_y)],//19
        };
        //底部指引
        this.targetNode.active = true;
        this.targetNode.position = Tools.getValueFromObj(this.posConfig, window.modeType)[1];

        //顶部指引
        var _targetNode2 = cc.instantiate(this.targetNode);
        _targetNode2.position = Tools.getValueFromObj(this.posConfig, window.modeType)[0];
        if (window.modeType != "木头人")
            _targetNode2.angle = 180;
        else {
            this.targetNode.getChildByName("tipsDown").y = 250
            this.tipsArr[this.type - 1].node.x =  -this.tipsArr[this.type - 1].node.parent.x;
            _targetNode2.getChildByName("tipsDown").active = false;
        }
        _targetNode2.parent = this.node;
        
        cc.tween(this.node)
        .delay(3)
        .to(0.5,{opacity:0})
        .call(()=>{
            this.node.active  =false;
        })
        .start();
    },

    start() {

    },

    // update (dt) {},
});
