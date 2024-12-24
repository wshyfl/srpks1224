

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {

    },

    onCollisionEnter(other,self){
        other.node.active=false;
        AD.audioMng.playSfx("吃薯片");
        AD.game23.check();
        var _pos =  other.node.parent.convertToWorldSpaceAR( other.node.position);
        var _pos2 =  AD.game23.node.convertToNodeSpaceAR(_pos);
        for(var i=0;i<6;i++){
            AD.game23.createSuiZha(_pos2,other.node.width/2,other.node.height/2);
        }
    }
    // update (dt) {},
});
