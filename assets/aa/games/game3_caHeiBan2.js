

cc.Class({
    extends: cc.Component,

    properties: {
        xiangPi:cc.Node,
        cr: {
            default: 30,
            tooltip: '涂抹圆的半径'
        },
        mask: cc.Mask,
        collision:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AD.game3_caHeiBan = this;
        this.initCollision();
        this.collisionArr = this.collision.children;
    },

    start() {
        this.xiangPi.active = false;
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.log('touch start ' + event.touch.getLocation());

            
            self.xiangPi.active = true;
            let point = cc.v2(event.touch.getLocation().x ,
                event.touch.getLocation().y );

            point = self.mask.node.convertToNodeSpaceAR(point);
            self.xiangPi.position = cc.v2(point.x , point.y );
            self._addCircle(cc.v2(point.x , point.y ));
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            
            let point = cc.v2(event.touch.getLocation().x ,
                event.touch.getLocation().y );
            point = self.mask.node.convertToNodeSpaceAR(point);
            self.xiangPi.position = cc.v2(point.x, point.y);
            self._addCircle(cc.v2(point.x, point.y ));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            
            self.checkResult();
            self.xiangPi.active = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            
            self.checkResult();
            self.xiangPi.active = false;
        }, this);
    },

    _addCircle(pos) {
        this.mask._graphics.lineWidth = 1;
        this.mask._graphics.strokeColor = cc.color(255, 0, 0);
        this.mask._graphics.fillColor = cc.color(0, 255, 0);
        this.mask._graphics.ellipse(pos.x, pos.y, this.cr,this.cr );
        this.mask._graphics.fill();
        this.mask._graphics.stroke();
    },
    
    checkResult() {
     
        var _over =true;
        for(var i=0;i<this.collisionArr.length;i++){
            if(this.collisionArr[i].scale>0){
                _over=false;
                break;
            }
        }

        if(_over)
        {
            console.log("游戏结束")
        }
        // console.log("this.collision.childrenCount  " +this.collision.childrenCount)
        // if(this.collision.childrenCount<=0){
            
        // }
         
    },
    
    initCollision() {
        //重力碰撞初始化
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // m
    }
});
