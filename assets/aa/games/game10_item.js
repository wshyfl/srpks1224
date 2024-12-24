

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.child =this.node.children[0];
        this.onTouch = false;
        this.index=0;
        for(var i=0;i<8;i++){
            if(this.node.parent.children[i] == this.node){
                this.index = i;
                break;
            }
        }

    },

    start () {
        // this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this)
        // this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this)
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd,this)
        cc.director.on("钢琴按下",(_pos)=>{
            if(Math.abs(_pos.x-this.node.x)<this.node.width/2){
                this.touchStart(_pos);
            }
            else 
            this.touchEnd();
        },this)
        cc.director.on("钢琴抬起",(_pos)=>{
            if(Math.abs(_pos.x-this.node.x)<this.node.width/2){
                this.touchEnd(_pos);
            }
            
        },this)
        cc.director.on("钢琴抬起2",(_pos)=>{
            this.touchEnd(_pos);
        },this)
    },

    touchStart(point){
        if(this.onTouch)return;
        this.onTouch = true;
        // let point = cc.v2(event.touch.getLocation().x ,
        // event.touch.getLocation().y );
        var _pos = this.node.convertToNodeSpaceAR(point);
        this.child.height = _pos.y - this.child.y +cc.winSize.height/2;
        AD.audioMng.playSfx("钢琴",this.index,this.child.height/this.node.height)

    },
    touchEnd(){
        
        this.onTouch = false;
    },
    
    update (dt) {
        if(this.child.height>0 && !this.onTouch)
        this.child.height-=600*dt;
    },
    
    
});
