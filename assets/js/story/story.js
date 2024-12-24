

cc.Class({
    extends: cc.Component,

    properties: {
        levelArr:{
            default:[],
            type:[cc.Prefab]
        }
    },

    // onLoad () {},

    start () {
    },
    onEnable(){
        
        var _story= cc.instantiate(this.levelArr[globalData.levelIndex]);
        // var _story= cc.instantiate(this.levelArr[1]);
        _story.active = true;
        _story.parent = this.node;

        console.log("/*/*  " + this.node.name + " globalData.levelIndex " + globalData.levelIndex)
    },
    onDisable(){
        this.node.children.forEach(element2 => {
            element2.destroy();
        });
    },
    // update (dt) {},
});
