

cc.Class({
    extends: cc.Component,

    properties: {
        labelNum: cc.Node,
    },

    onLoad() {
        this.node.parent = cc.find("Canvas/UI/score");
    },

    start() {
        
        this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(window.taiKongSha.second);
        this.schedule(() => {
            
            
            if (window.taiKongSha.second >= 0)
                this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(window.taiKongSha.second);
       
                
        }, 1)

    },

    // update (dt) {},
});
