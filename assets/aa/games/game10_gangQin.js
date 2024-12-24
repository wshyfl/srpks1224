

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            cc.director.emit("钢琴按下",_pos);
        },this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            cc.director.emit("钢琴按下",_pos);
        },this)
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            cc.director.emit("钢琴抬起",_pos);
        },this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            cc.director.emit("钢琴抬起2",_pos);
        },this)
    },

    // update (dt) {},
});
