

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {
        cc.tween(this.node.getChildByName("spr"))
        .delay(Tools.random(10,30)*0.1)
        .repeatForever(
            cc.tween()
            .to(0.4,{y:10},{easing:"sineOut"})
            .to(0.4,{y:0},{easing:"sineIn"})
            // .delay(3+Tools.random(10,30)*0.1)
        )
        .start();
    },


    onCollisionEnter: function (other, self) {
        if (other.tag == 100)//碰到玩家了
        {
            AD.gameScene.createEffect("获得道具", this.node)
            AD.gameScene.playSfx("获得道具");
            this.node.destroy();
            AD.gameScene.keyNumSum ++;
            if(AD.gameScene.keyNumSum>=3){
                cc.director.emit("显示终点")
            }
        } 
    },
    // update (dt) {},
});
