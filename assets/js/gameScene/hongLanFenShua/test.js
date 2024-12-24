// 0. > 试用于CocosCreator1.x及以下版本
//    > 会强制设置挂载该脚本的节点的anchor为(0.5, 0.5)，方便触摸位置转换
//    > 可以在该节点上添加cc.Sprite组件当背景色，不加则为背景透明
//    > 画板尺寸和挂载该脚本的节点size一致
 
 
// 1.setPen(event, param)       直接设置画笔功能 (带参数：原色画笔功能   不带参数：橡皮擦功能)
 
// 2.setPenColor（event, r, g, b, a)        画笔颜色
//      传值举例: object, 2, 255, 0, 255     5个参数，后4个分别对应r,g,b,a
//               object, "2,255,0,255"      2个参数，后1个字符串对应“r,g,b,a”,用英式','分割的字符串
// 注意：a对应的透明度alpha值为0时，为橡皮檫功能
 
// 3.setPenRadius(event, r)     画笔线粗(画笔半径)
 
 
cc.Class({
    extends: cc.Component,
 
    properties: {
        
    },
 
    // LIFE-CYCLE CALLBACKS:
 
    // use this for initialization
    // onLoad () { },
 
    start () {
        var self = this;
        self.rt = new cc.RenderTexture(100,100);
        self.node._sgNode.addChild(self.rt);
    },
    
    
 
    // update (dt) {},
});