
cc.Class({
    extends: cc.Component,

    properties: {
        left: false,
        x_Left: {
            default: 0,
            visible() {
                return this.left
            },
            tooltip:"距离左边界的距离"
        },
        right: false,
        x_Right: {
            default: 0,
            visible() {
                return this.right
            },
            tooltip:"距离右边界的距离"
        },
        up: false,

        y_Up: {
            default: 0,
            visible() {
                return this.up
            },
            tooltip:"距离上边界的距离"
        },
        down: false,
        y_Down: {
            default: 0,
            visible() {
                return this.down
            },
            tooltip:"距离下边界的距离"
        },
    },

    // onLoad () {},

    start() {
        if (this.left) {
            this.node.x = -cc.winSize.width / 2 + this.x_Left;
        }
        if (this.right) {
            this.node.x = cc.winSize.width / 2 + this.x_Right;
        }
        if (this.up) {
            this.node.y = cc.winSize.height / 2 + this.y_Up;
        }
        
        if (this.down) {
            this.node.y= -cc.winSize.height / 2 + this.y_Down;
        }
    },

    // update (dt) {},
});
