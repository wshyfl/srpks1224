

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {

    },
    onEnable(){
        this.node.children.forEach(element => {
            element.getComponent(cc.ParticleSystem).resetSystem();
        });
    }

    // update (dt) {},
});
