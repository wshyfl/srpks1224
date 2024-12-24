

cc.Class({
    extends: cc.Component,

    properties: {
        xiangPiCa: cc.Node,
        card_mask: cc.Mask,
        radius: 100,
        maskNode: cc.Node,
        progress_label: cc.Label,
        progress_graphics: cc.Graphics,
        bar: cc.Sprite,
        sprArr: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    checkResult() {

        if (this.mask_progress >= this.progress_rect.length) {
            // console.log("擦干净了")
        }
        if (this.bar.fillRange >= 0.98) {
            console.log("擦干净了")
            cc.director.emit("弹出胜利界面");
            // this.maskNode.active = false;
            cc.tween(this.maskNode)
                .to(0.2, { opacity: 0 })
                .start();
        }
    },

    onLoad() {
        this.maskNode.getComponent(cc.Sprite).spriteFrame = this.sprArr[Tools.random(0, 2)]
        this.mask_graphics = new cc.Graphics();

        this.graphics_width = this.radius;
        this.mask_progress = 0;
        this.progress_rect = new Array();
        this.mask_graphics = this.card_mask['_graphics'];
        this.progress_debug = false;//是否开启进度的显示
        if (this.mask_graphics) {
            //添加卡片监听
            this.maskNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.maskNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.maskNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

            //初始化画笔
            this.mask_graphics.lineWidth = this.graphics_width;
            this.mask_graphics.lineCap = cc.Graphics.LineCap.ROUND;
            this.mask_graphics.lineJoin = cc.Graphics.LineJoin.ROUND;

            //初始化进度的格子

            var _w = this.graphics_width;
            let max_x = Math.ceil(this.maskNode.width / _w);
            let max_y = Math.ceil(this.maskNode.height / _w);
            for (let i = 0; i < max_x; i++) {
                for (let j = 0; j < max_y; j++) {
                    this.progress_rect.push({
                        rect: new cc.Rect(i * _w, j * _w, _w, _w),
                        isHit: false
                    })
                }
            }

            this.progress_graphics.fillColor = new cc.Color(1, 0, 0, 1);
        }
    },

    start() {
        this.touchId = null;
    },


    onDestroy() {
        //删除卡片监听
        this.maskNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.maskNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.maskNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.progress_rect.length = 0;
    },


    onTouchStart(event) {
        // if (this.touchId == null) {
        //     this.touchId = event.getTouches()[0]._id;
        //     var _touchPoint = cc.v2(event.getTouches()[0]._point.x, event.getTouches()[0]._point.y);
        //     let start_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        //     this.xiangPiCa.x = start_pos.x;
        //     this.xiangPiCa.y = start_pos.y;
        //     this.mask_graphics.circle(start_pos.x, start_pos.y, this.graphics_width / 2);
        //     this.mask_graphics.fill();
        //     this.mask_graphics.moveTo(start_pos.x, start_pos.y);

        //     this.checkProgress(start_pos);

            

        //     AD.audioMng.playSfx("擦黑板")
        // }
        var _touchPoint =event.getLocation();;
        let start_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        this.xiangPiCa.x = start_pos.x;
        this.xiangPiCa.y = start_pos.y;
        this.mask_graphics.circle(start_pos.x, start_pos.y, this.graphics_width / 2);
        this.mask_graphics.fill();
        this.mask_graphics.moveTo(start_pos.x, start_pos.y);

        this.checkProgress(start_pos);
        AD.audioMng.playSfx("擦黑板")
    },
    onTouchMove(event) {
        this.touchIds = event.getTouches();

        // for (var i = 0; i < this.touchIds.length; i++) {
        //     if (this.touchIds[i]._id == this.touchId) {
        //         var _touchPoint = cc.v2(this.touchIds[i]._point.x,this.touchIds[i]._point.y);
        //         let move_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        //         this.checkMaskGraphics(move_pos);


        //         let start_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        //         this.mask_graphics.circle(move_pos.x, move_pos.y, this.graphics_width / 2);
        //         this.mask_graphics.fill();
        //         this.mask_graphics.moveTo(move_pos.x, move_pos.y);


        //         this.xiangPiCa.x = start_pos.x;
        //         this.xiangPiCa.y = start_pos.y;
        //         this.checkProgress(move_pos);
        //     }
        // }
        
        var _touchPoint =event.getLocation();;
        let move_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        this.checkMaskGraphics(move_pos);


        let start_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        this.mask_graphics.circle(move_pos.x, move_pos.y, this.graphics_width / 2);
        this.mask_graphics.fill();
        this.mask_graphics.moveTo(move_pos.x, move_pos.y);


        this.xiangPiCa.x = start_pos.x;
        this.xiangPiCa.y = start_pos.y;
        this.checkProgress(move_pos);
    },
    onTouchEnd(event) {
        // this.touchIds = event.getTouches();
        // for (var i = 0; i < this.touchIds.length; i++) {
        //     if (this.touchIds[i]._id == this.touchId) {
        //         this.touchId = null;

        //         var _touchPoint = cc.v2(this.touchIds[i]._point.x,this.touchIds[i]._point.y);
        //         AD.audioMng.stopSfx("擦黑板")
        //         let end_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        //         this.checkMaskGraphics(end_pos);

        //         this.checkProgress(end_pos);
        //         this.checkResult();
        //     }
        // }
        
        var _touchPoint =event.getLocation();;
        AD.audioMng.stopSfx("擦黑板")
        let end_pos = this.card_mask.node.convertToNodeSpaceAR(_touchPoint);
        this.checkMaskGraphics(end_pos);

        this.checkProgress(end_pos);
        this.checkResult();
    },

    /**
     * 对移动过的线段进行划线
     * @param point 
     */
    checkMaskGraphics(point) {
        this.mask_graphics.lineTo(point.x, point.y);
        this.mask_graphics.strokeColor = new cc.Color(0, 0, 0, 0);
        this.mask_graphics.stroke();
        this.mask_graphics.moveTo(point.x, point.y);
    },

    /**
     * 检查涂开的进度
     * @param point 
     */
    checkProgress(point) {
        
        let max_y = Math.ceil(this.maskNode.height / this.graphics_width);
        //根据锚点偏移量计算新坐标
        if (this.maskNode.anchorX != 0) {
            point.x = this.maskNode.width * this.maskNode.anchorX + point.x;
        }
        if (this.maskNode.anchorY != 0) {
            point.y = this.maskNode.height * this.maskNode.anchorY - point.y;
        }


        //找到格子
        let point_x = Math.floor(point.x / this.graphics_width);
        let point_y = Math.floor(point.y / this.graphics_width);
        let rect_index = point_x * max_y + point_y;
        if (this.progress_rect[rect_index] && !this.progress_rect[rect_index].isHit) {
            this.progress_rect[rect_index].isHit = true;
            if (this.progress_debug) {
                // let progress_point = new cc.Vec2(point_x * this.graphics_width, point_y * this.graphics_width);
                // if (this.maskNode.anchorX != 0) {
                //     progress_point.x = progress_point.x - this.maskNode.width * this.maskNode.anchorX;
                // }
                // if (this.maskNode.anchorY != 0) {
                //     progress_point.y = this.maskNode.height * this.maskNode.anchorY - progress_point.y - this.graphics_width;
                // }
                // this.progress_graphics.rect(progress_point.x, progress_point.y, this.graphics_width, this.graphics_width);
                // this.progress_graphics.stroke();
            }
            this.mask_progress++;
            var _progress = (this.mask_progress / this.progress_rect.length).toFixed(2);
            this.progress_label.string = "当前已刮:" + _progress;

            this.bar.fillRange = _progress;
        }

    },

    onAgainClick(event) {
        this.mask_graphics.clear();
        this.progress_graphics.clear();
        this.mask_progress = 0;
        for (let i = 0; i < this.progress_rect.length; i++) {
            this.progress_rect[i].isHit = false;
        }
    },
    // update (dt) {},
});
